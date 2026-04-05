import { NextResponse } from "next/server";
import { getUserByPhone, addUser } from "@/lib/store";
import { hashUserPassword, createUserToken } from "@/lib/user-auth";
import { sanitize, isValidPhone } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`signup:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { phone, password, name } = body;

  if (!phone || !isValidPhone(phone)) {
    return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
  }

  if (!password || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  // Check if user already exists
  const existing = await getUserByPhone(phone);
  if (existing) {
    return NextResponse.json({ error: "This mobile number is already registered. Please login instead." }, { status: 409 });
  }

  // Hash password
  const { hash, salt } = hashUserPassword(password);

  // Create user
  const userId = crypto.randomUUID();
  const user = await addUser({
    id: userId,
    name: sanitize(name || "", 100),
    email: "",
    phone,
    passwordHash: hash,
    passwordSalt: salt,
    role: "user",
    avatar: "",
    city: "",
    blocked: false,
    emailVerified: false,
    phoneVerified: true,
    loginCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Create access token
  const token = createUserToken(user.id, "");

  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  }, { status: 201 });
}
