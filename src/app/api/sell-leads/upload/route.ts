import { NextResponse } from "next/server";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import { extractUserFromRequest } from "@/lib/user-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  // Require user authentication
  const user = extractUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  // Rate limit: 10 uploads per minute per user
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`sell-upload:${user.userId}:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    // Derive extension from validated MIME type, not filename
    const ext = ALLOWED_TYPES[file.type];
    const safeName = `sell-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "sell-images");

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeName);
    if (!filePath.startsWith(uploadDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/sell-images/${safeName}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
