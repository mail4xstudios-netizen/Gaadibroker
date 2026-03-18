import { NextResponse } from "next/server";
import { getUserByEmail, getUserByPhone, addUser } from "@/lib/store";
import { hashUserPassword, createUserToken, createUserRefreshToken, recordLogin, getDeviceInfo } from "@/lib/user-auth";
import { sanitize, isValidEmail, isValidPhone } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many signup attempts. Try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  // Check for existing user
  if (getUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  if (phone && getUserByPhone(phone)) {
    return NextResponse.json({ error: "An account with this phone number already exists" }, { status: 409 });
  }

  try {
    const { hash, salt } = hashUserPassword(password);
    const deviceInfo = getDeviceInfo(request);
    const now = new Date().toISOString();

    const user = addUser({
      id: crypto.randomUUID(),
      name: sanitize(name, 100),
      email: email.toLowerCase().trim(),
      phone: phone ? sanitize(phone, 15) : "",
      passwordHash: hash,
      passwordSalt: salt,
      emailVerified: false,
      phoneVerified: false,
      role: "user",
      blocked: false,
      lastLoginAt: now,
      lastLoginIp: deviceInfo.ip,
      lastLoginDevice: deviceInfo.device,
      loginCount: 1,
      createdAt: now,
      updatedAt: now,
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

    logger.info(`New user signup: ${user.email}`);

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
    }, { status: 201 });
  } catch (err) {
    logger.error("Signup failed", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
