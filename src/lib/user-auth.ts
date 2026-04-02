import crypto from "crypto";
import { logger } from "./logger";

const AUTH_SECRET = process.env.AUTH_SECRET!;

// ─── Password Hashing ───
export function hashUserPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyUserPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

// ─── User Token Management ───
function signPayload(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

function verifyAndDecode(token: string): Record<string, unknown> | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;
    const expectedSig = crypto.createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createUserToken(userId: string, email: string): string {
  return signPayload({
    sub: userId,
    email,
    type: "user_access",
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    jti: crypto.randomBytes(16).toString("hex"),
  });
}

export function createUserRefreshToken(userId: string): string {
  return signPayload({
    sub: userId,
    type: "user_refresh",
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    jti: crypto.randomBytes(16).toString("hex"),
  });
}

export function verifyUserToken(token: string): { userId: string; email: string } | null {
  const payload = verifyAndDecode(token);
  if (!payload || payload.type !== "user_access") return null;
  return { userId: payload.sub as string, email: payload.email as string };
}

export function verifyUserRefreshToken(token: string): { userId: string } | null {
  const payload = verifyAndDecode(token);
  if (!payload || payload.type !== "user_refresh") return null;
  return { userId: payload.sub as string };
}

export function extractUserFromRequest(request: Request): { userId: string; email: string } | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return verifyUserToken(authHeader.slice(7));
}

// Separate function for blocked user check — call from API routes that need it
export function extractVerifiedUser(request: Request): { userId: string; email: string } | null {
  const tokenData = extractUserFromRequest(request);
  if (!tokenData) return null;

  // Import dynamically to avoid circular dependency
  const { getUserById } = require("@/lib/store");
  try {
    const user = getUserById(tokenData.userId);
    if (!user || user.blocked) return null;
  } catch { /* if store unavailable, allow through */ }

  return tokenData;
}

// ─── OTP System ───
interface OTPEntry {
  code: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

const otpStore = new Map<string, OTPEntry>();
const otpRateLimit = new Map<string, { count: number; resetAt: number }>();

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore) {
    if (now > entry.expiresAt) otpStore.delete(key);
  }
  for (const [key, entry] of otpRateLimit) {
    if (now > entry.resetAt) otpRateLimit.delete(key);
  }
}, 5 * 60 * 1000);

export function generateOTP(identifier: string, ip?: string): { code: string; error?: string } {
  // Rate limit: max 5 OTPs per 15 minutes per identifier
  const rateLimitKey = `otp:${identifier}`;
  const rateEntry = otpRateLimit.get(rateLimitKey);
  const now = Date.now();

  if (rateEntry && now < rateEntry.resetAt && rateEntry.count >= 5) {
    const remaining = Math.ceil((rateEntry.resetAt - now) / 60000);
    logger.security("OTP rate limit exceeded", { identifier, ip });
    return { code: "", error: `Too many OTP requests. Try again in ${remaining} minutes.` };
  }

  if (rateEntry && now < rateEntry.resetAt) {
    rateEntry.count++;
  } else {
    otpRateLimit.set(rateLimitKey, { count: 1, resetAt: now + 15 * 60 * 1000 });
  }

  // Generate 6-digit OTP
  const code = crypto.randomInt(100000, 999999).toString();

  otpStore.set(identifier, {
    code,
    expiresAt: now + 10 * 60 * 1000, // 10 minutes
    attempts: 0,
    verified: false,
  });

  logger.info(`OTP generated for ${identifier}`);
  return { code };
}

export function verifyOTP(identifier: string, code: string, ip?: string): { success: boolean; error?: string } {
  const entry = otpStore.get(identifier);

  if (!entry) {
    return { success: false, error: "OTP expired or not found. Please request a new one." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(identifier);
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  if (entry.attempts >= 5) {
    otpStore.delete(identifier);
    logger.security("OTP max attempts exceeded", { identifier, ip });
    return { success: false, error: "Too many incorrect attempts. Please request a new OTP." };
  }

  entry.attempts++;

  // Timing-safe comparison to prevent side-channel attacks
  const codeMatch = entry.code.length === code.length &&
    crypto.timingSafeEqual(Buffer.from(entry.code), Buffer.from(code));
  if (!codeMatch) {
    return { success: false, error: `Invalid OTP. ${5 - entry.attempts} attempts remaining.` };
  }

  entry.verified = true;
  otpStore.delete(identifier);
  return { success: true };
}

// ─── Login Tracking ───
export interface LoginRecord {
  userId: string;
  ip: string;
  userAgent: string;
  method: "password" | "otp_email" | "otp_phone";
  success: boolean;
  timestamp: string;
}

const loginHistory: LoginRecord[] = [];
const MAX_LOGIN_HISTORY = 1000;

export function recordLogin(record: LoginRecord): void {
  loginHistory.unshift(record);
  if (loginHistory.length > MAX_LOGIN_HISTORY) {
    loginHistory.length = MAX_LOGIN_HISTORY;
  }
}

export function getLoginHistory(userId?: string): LoginRecord[] {
  if (userId) return loginHistory.filter((r) => r.userId === userId);
  return [...loginHistory];
}

// ─── Device Fingerprint ───
export function getDeviceInfo(request: Request): { ip: string; userAgent: string; device: string } {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  let device = "Desktop";
  if (/mobile|android|iphone/i.test(userAgent)) device = "Mobile";
  else if (/tablet|ipad/i.test(userAgent)) device = "Tablet";

  return { ip, userAgent, device };
}
