import { NextResponse } from "next/server";
import { getUserByEmail, getUserByPhone } from "@/lib/store";
import { generateOTP } from "@/lib/user-auth";
import { isValidEmail, isValidPhone } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`otp-send:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many OTP requests. Try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, phone, purpose } = body; // purpose: "login" | "signup" | "verify"

  if (!email && !phone) {
    return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (phone && !isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const identifier = email || phone;

  // For login purpose, user must exist
  if (purpose === "login") {
    const user = email ? getUserByEmail(email) : getUserByPhone(phone);
    if (!user) {
      return NextResponse.json({ error: "No account found with this " + (email ? "email" : "phone number") }, { status: 404 });
    }
    if (user.blocked) {
      return NextResponse.json({ error: "Account suspended. Contact support." }, { status: 403 });
    }
  }

  // For signup purpose, user must NOT exist
  if (purpose === "signup") {
    const existingUser = email ? getUserByEmail(email) : getUserByPhone(phone);
    if (existingUser) {
      return NextResponse.json({ error: "An account already exists with this " + (email ? "email" : "phone number") }, { status: 409 });
    }
  }

  const result = generateOTP(identifier!, ip);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 429 });
  }

  // In production, send OTP via email/SMS service (Twilio, SendGrid, etc.)
  // For now, log it and return success
  logger.info(`OTP sent to ${identifier}: ${result.code}`);

  return NextResponse.json({
    success: true,
    message: `OTP sent to ${email ? "your email" : "your phone"}`,
    // Include OTP in dev mode for testing (REMOVE in production)
    ...(process.env.NODE_ENV === "development" ? { otp: result.code } : {}),
  });
}
