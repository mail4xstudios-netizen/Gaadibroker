import { NextResponse } from "next/server";
import { getUserByEmail, getUserByPhone, addUser, updateUser } from "@/lib/store";
import { verifyOTP, createUserToken, createUserRefreshToken, recordLogin, getDeviceInfo } from "@/lib/user-auth";
import { sanitize } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`otp-verify:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many verification attempts." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, phone, otp, name, purpose } = body;
  const identifier = email || phone;

  if (!identifier || !otp) {
    return NextResponse.json({ error: "Email/phone and OTP are required" }, { status: 400 });
  }

  const result = verifyOTP(identifier, otp, ip);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const deviceInfo = getDeviceInfo(request);
  const now = new Date().toISOString();

  try {
    let user = email ? getUserByEmail(email) : getUserByPhone(phone);

    if (!user && purpose === "signup") {
      // Auto-create user via OTP signup
      user = addUser({
        id: crypto.randomUUID(),
        name: sanitize(name || (email ? email.split("@")[0] : phone), 100),
        email: email ? email.toLowerCase().trim() : "",
        phone: phone || "",
        emailVerified: !!email,
        phoneVerified: !!phone,
        role: "user",
        blocked: false,
        lastLoginAt: now,
        lastLoginIp: deviceInfo.ip,
        lastLoginDevice: deviceInfo.device,
        loginCount: 1,
        createdAt: now,
        updatedAt: now,
      });
      logger.info(`New user created via OTP: ${identifier}`);
    } else if (user) {
      // Mark email/phone as verified
      const updates: Partial<typeof user> = {
        lastLoginAt: now,
        lastLoginIp: deviceInfo.ip,
        lastLoginDevice: deviceInfo.device,
        loginCount: (user.loginCount || 0) + 1,
      };
      if (email) updates.emailVerified = true;
      if (phone) updates.phoneVerified = true;
      updateUser(user.id, updates);
    } else {
      return NextResponse.json({ error: "No account found. Please sign up first." }, { status: 404 });
    }

    const token = createUserToken(user.id, user.email);
    const refreshToken = createUserRefreshToken(user.id);

    recordLogin({
      userId: user.id,
      ip: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      method: email ? "otp_email" : "otp_phone",
      success: true,
      timestamp: now,
    });

    return NextResponse.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    logger.error("OTP verify failed", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
