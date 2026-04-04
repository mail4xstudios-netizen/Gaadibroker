import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { uploadToR2, isR2Ready } from "@/lib/cloudflare-r2";
import { convertToWebP } from "@/lib/image-convert";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FOLDERS = ["brands", "uploads", "cars"];

export async function POST(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isR2Ready()) {
    return NextResponse.json(
      { error: "Image storage not configured. Please set Cloudflare R2 environment variables." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "brands";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, and WebP files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP
    const { buffer, contentType, ext } = await convertToWebP(rawBuffer, file.type);

    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const key = `${folder}/${safeName}-${Date.now()}.${ext}`;

    const url = await uploadToR2(buffer, key, contentType);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Upload failed:", message, err);
    return NextResponse.json({ error: "Upload failed", detail: message }, { status: 500 });
  }
}
