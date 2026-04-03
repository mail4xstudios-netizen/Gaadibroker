import { NextResponse } from "next/server";
import { getUserById, updateUser, addUser } from "@/lib/store";
import { extractFirebaseUser } from "@/lib/user-auth";
import { sanitize, isValidPhone } from "@/lib/validate";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const auth = await extractFirebaseUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(auth.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    city: user.city,
    createdAt: user.createdAt,
  });
}

export async function PUT(request: Request) {
  const auth = await extractFirebaseUser(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success: rlOk } = rateLimit(`profile:${auth.userId}`, { limit: 10, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many updates. Try again later." }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Check if user exists; if not, create them (first sign-in via Google)
  let user = await getUserById(auth.userId);
  if (!user) {
    try {
      user = await addUser({
        id: auth.userId,
        name: sanitize(body.name || "", 100),
        email: auth.email,
        phone: "",
        role: "user",
        avatar: sanitize(body.avatar || "", 500),
        city: "",
        blocked: false,
        emailVerified: true,
        phoneVerified: false,
        loginCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      logger.error("Failed to create user profile", err);
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
  }

  const updates: Record<string, unknown> = {};

  if (body.name) updates.name = sanitize(body.name, 100);
  if (body.phone) {
    if (!isValidPhone(body.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    updates.phone = body.phone;
  }
  if (body.city) updates.city = sanitize(body.city, 50);
  if (body.avatar) updates.avatar = sanitize(body.avatar, 500);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        city: user.city,
      },
    });
  }

  try {
    const updated = await updateUser(auth.userId, updates);
    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        avatar: updated.avatar,
        city: updated.city,
      },
    });
  } catch (err) {
    logger.error("Profile update failed", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
