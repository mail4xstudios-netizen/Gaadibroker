import { NextResponse } from "next/server";
import { getUserById, updateUser } from "@/lib/store";
import { extractUserFromRequest, hashUserPassword } from "@/lib/user-auth";
import { sanitize, isValidPhone } from "@/lib/validate";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const auth = extractUserFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = getUserById(auth.userId);
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
    emailVerified: user.emailVerified,
    phoneVerified: user.phoneVerified,
    createdAt: user.createdAt,
  });
}

export async function PUT(request: Request) {
  const auth = extractUserFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const user = getUserById(auth.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
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

  // Password change
  if (body.newPassword) {
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    const { hash, salt } = hashUserPassword(body.newPassword);
    updates.passwordHash = hash;
    updates.passwordSalt = salt;
  }

  try {
    const updated = updateUser(auth.userId, updates);
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
        emailVerified: updated.emailVerified,
        phoneVerified: updated.phoneVerified,
      },
    });
  } catch (err) {
    logger.error("Profile update failed", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
