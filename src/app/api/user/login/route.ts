import { NextResponse } from "next/server";
import { getUserByPhone, updateUser } from "@/lib/store";
import { verifyUserPassword, createUserToken } from "@/lib/user-auth";
import { isValidPhone } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`login:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { phone, password } = body;

  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json({ error: "Please enter a valid mobile number" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  // Find user
  const user = await getUserByPhone(phone);
  if (!user) {
    return NextResponse.json({ error: "No account found with this number. Please sign up first." }, { status: 404 });
  }

  if (user.blocked) {
    return NextResponse.json({ error: "Your account has been blocked. Please contact support." }, { status: 403 });
  }

  // Verify password
  if (!user.passwordHash || !user.passwordSalt) {
    return NextResponse.json({ error: "Please sign up again to set a password." }, { status: 400 });
  }

  const valid = verifyUserPassword(password, user.passwordHash, user.passwordSalt);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
  }

  // Update last login
  await updateUser(user.id, {
    lastLoginAt: new Date().toISOString(),
    lastLoginIp: ip,
  });

  // Create access token
  const token = createUserToken(user.id, user.email || "");

  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });
}
