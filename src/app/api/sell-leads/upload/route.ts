import { NextResponse } from "next/server";
import { extractFirebaseUser, extractUserFromRequest } from "@/lib/user-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { uploadToR2, isR2Ready } from "@/lib/cloudflare-r2";
import { convertToWebP } from "@/lib/image-convert";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  // Try custom token first, then Firebase token
  const user = extractUserFromRequest(request) || await extractFirebaseUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
  }

  if (!isR2Ready()) {
    return NextResponse.json(
      { error: "Image storage not configured." },
      { status: 503 }
    );
  }

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

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP
    const { buffer, contentType, ext } = await convertToWebP(rawBuffer, file.type);

    const key = `sell-images/sell-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const url = await uploadToR2(buffer, key, contentType);
    return NextResponse.json({ url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
