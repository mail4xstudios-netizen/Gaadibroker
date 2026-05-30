import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { addUser, getUserById, getUserByPhone, updateUser } from "@/lib/store";
import { sanitize } from "@/lib/validate";
import { getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const uid = decoded.uid;
  const phone = (decoded.phone_number || "").replace(/^\+91/, "");
  if (!phone) {
    return NextResponse.json({ error: "No phone on token" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  const name = sanitize(body.name, 60) || "User";

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "";
  const device = userAgent.match(/(Mobile|Android|iPhone|iPad)/i) ? "Mobile" : "Desktop";
  const now = new Date().toISOString();

  try {
    const existingById = await getUserById(uid);
    const existingByPhone = existingById || (await getUserByPhone(phone));

    if (existingByPhone) {
      await updateUser(existingByPhone.id, {
        name: name !== "User" ? name : existingByPhone.name,
        phone,
        phoneVerified: true,
        lastLoginAt: now,
        lastLoginIp: ip,
        lastLoginDevice: device,
        loginCount: (existingByPhone.loginCount || 0) + 1,
      });
    } else {
      await addUser({
        id: uid,
        name,
        email: "",
        phone,
        emailVerified: false,
        phoneVerified: true,
        role: "user",
        blocked: false,
        lastLoginAt: now,
        lastLoginIp: ip,
        lastLoginDevice: device,
        loginCount: 1,
        createdAt: now,
        updatedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to sync OTP user", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
