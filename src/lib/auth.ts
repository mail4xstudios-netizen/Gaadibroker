import crypto from "crypto";
import { logger } from "./logger";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
const ADMIN_PASSWORD_SALT = process.env.ADMIN_PASSWORD_SALT!;
const AUTH_SECRET = process.env.AUTH_SECRET!;
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT_MINUTES || "30") * 60 * 1000;
const REFRESH_TOKEN_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

// Rate limiting: track failed attempts by IP
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

// Revoked tokens set (in production, use Redis)
const revokedTokens = new Set<string>();

// TOTP secrets store (in production, use DB)
const totpSecrets = new Map<string, string>();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

export function validateAdmin(username: string, password: string, ip?: string): { success: boolean; error?: string } {
  if (ip) {
    const attempts = failedAttempts.get(ip);
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - attempts.lastAttempt;
      if (elapsed < LOCKOUT_DURATION) {
        const remaining = Math.ceil((LOCKOUT_DURATION - elapsed) / 60000);
        return { success: false, error: `Too many failed attempts. Try again in ${remaining} minutes.` };
      }
      failedAttempts.delete(ip);
    }
  }

  const passwordHash = hashPassword(password, ADMIN_PASSWORD_SALT);
  const isValid = username === ADMIN_USERNAME &&
    crypto.timingSafeEqual(Buffer.from(passwordHash), Buffer.from(ADMIN_PASSWORD_HASH));

  if (!isValid) {
    if (ip) {
      const attempts = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 };
      failedAttempts.set(ip, { count: attempts.count + 1, lastAttempt: Date.now() });
    }
    logger.security("Failed login attempt", { ip, username });
    return { success: false, error: "Invalid credentials" };
  }

  if (ip) failedAttempts.delete(ip);
  return { success: true };
}

// ─── Token Management ───

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

    // Check if token is revoked
    if (payload.jti && revokedTokens.has(payload.jti)) return null;

    // Check expiry
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export function createToken(): string {
  return signPayload({
    sub: ADMIN_USERNAME,
    type: "access",
    iat: Date.now(),
    exp: Date.now() + SESSION_TIMEOUT,
    jti: crypto.randomBytes(16).toString("hex"),
  });
}

export function createRefreshToken(): string {
  return signPayload({
    sub: ADMIN_USERNAME,
    type: "refresh",
    iat: Date.now(),
    exp: Date.now() + REFRESH_TOKEN_TIMEOUT,
    jti: crypto.randomBytes(16).toString("hex"),
  });
}

export function verifyToken(token: string): boolean {
  const payload = verifyAndDecode(token);
  return payload !== null && payload.type === "access";
}

export function verifyRefreshToken(token: string): boolean {
  const payload = verifyAndDecode(token);
  return payload !== null && payload.type === "refresh";
}

export function refreshAccessToken(refreshToken: string): { accessToken: string; refreshToken: string } | null {
  const payload = verifyAndDecode(refreshToken);
  if (!payload || payload.type !== "refresh") return null;

  // Revoke old refresh token (rotation)
  if (payload.jti) revokedTokens.add(payload.jti as string);

  return {
    accessToken: createToken(),
    refreshToken: createRefreshToken(),
  };
}

export function revokeToken(token: string): void {
  const payload = verifyAndDecode(token);
  if (payload?.jti) {
    revokedTokens.add(payload.jti as string);
  }
}

export function authenticateRequest(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return verifyToken(authHeader.slice(7));
}

// ─── 2FA (TOTP) ───

export function generate2FASecret(): { secret: string; otpAuthUrl: string } {
  const secret = crypto.randomBytes(20).toString("hex");
  const otpAuthUrl = `otpauth://totp/GaadiBroker:admin?secret=${secret}&issuer=GaadiBroker`;
  return { secret, otpAuthUrl };
}

export function enable2FA(username: string, secret: string): void {
  totpSecrets.set(username, secret);
}

export function is2FAEnabled(username: string): boolean {
  return totpSecrets.has(username);
}

export function verify2FA(username: string, code: string): boolean {
  const secret = totpSecrets.get(username);
  if (!secret) return false;

  // TOTP: generate code for current 30-second window and adjacent windows
  const now = Math.floor(Date.now() / 1000);
  for (const offset of [-1, 0, 1]) {
    const time = Math.floor((now + offset * 30) / 30);
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigUInt64BE(BigInt(time));
    const hmac = crypto.createHmac("sha1", Buffer.from(secret, "hex")).update(timeBuffer).digest();
    const offsetByte = hmac[hmac.length - 1] & 0x0f;
    const otp = ((hmac.readUInt32BE(offsetByte) & 0x7fffffff) % 1000000).toString().padStart(6, "0");
    if (otp === code) return true;
  }
  return false;
}
