import { NextResponse } from "next/server";
import { getUsers, getUserById, updateUser, deleteUser } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";
import { getLoginHistory } from "@/lib/user-auth";
import { logger } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();

  try {
    const users = getUsers().map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      emailVerified: u.emailVerified,
      phoneVerified: u.phoneVerified,
      blocked: u.blocked,
      lastLoginAt: u.lastLoginAt,
      lastLoginIp: u.lastLoginIp,
      lastLoginDevice: u.lastLoginDevice,
      loginCount: u.loginCount,
      city: u.city,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users, total: users.length });
  } catch (err) {
    logger.error("Failed to get users", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = getUserById(body.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (typeof body.blocked === "boolean") updates.blocked = body.blocked;
    if (body.role && ["user", "seller", "admin"].includes(body.role)) updates.role = body.role;

    const updated = updateUser(body.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    logger.info(`Admin updated user ${body.id}: ${JSON.stringify(updates)}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to update user", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const deleted = deleteUser(body.id);
    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    logger.info(`Admin deleted user ${body.id}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to delete user", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
