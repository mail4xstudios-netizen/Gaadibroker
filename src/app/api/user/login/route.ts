import { NextResponse } from "next/server";
import { getUserByEmail, getUserByPhone, updateUser } from "@/lib/store";
import { verifyUserPassword, createUserToken, createUserRefreshToken, recordLogin, getDeviceInfo } from "@/lib/user-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`user-login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many login attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, phone, password } = body;

  if (!password || (!email && !phone)) {
    return NextResponse.json({ error: "Email/phone and password are required" }, { status: 400 });
  }

  try {
    const user = email ? getUserByEmail(email) : getUserByPhone(phone);
    const deviceInfo = getDeviceInfo(request);
    const now = new Date().toISOString();

    if (!user || !user.passwordHash || !user.passwordSalt) {
      recordLogin({
        userId: email || phone,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        method: "password",
        success: false,
        timestamp: now,
      });
      logger.security("Failed user login - user not found", { email, phone, ip });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (user.blocked) {
      return NextResponse.json({ error: "Your account has been suspended. Contact support." }, { status: 403 });
    }

    if (!verifyUserPassword(password, user.passwordHash, user.passwordSalt)) {
      recordLogin({
        userId: user.id,
        ip: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        method: "password",
        success: false,
        timestamp: now,
      });
      logger.security("Failed user login - wrong password", { email: user.email, ip });
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update last login
    updateUser(user.id, {
      lastLoginAt: now,
      lastLoginIp: deviceInfo.ip,
      lastLoginDevice: deviceInfo.device,
      loginCount: (user.loginCount || 0) + 1,
    });

    const token = createUserToken(user.id, user.email);
    const refreshToken = createUserRefreshToken(user.id);

    recordLogin({
      userId: user.id,
      ip: deviceInfo.ip,
      userAgent: deviceInfo.userAgent,
      method: "password",
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
    logger.error("Login failed", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
