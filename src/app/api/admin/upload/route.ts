import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const ALLOWED_TYPES = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FOLDERS = ["brands", "uploads"];

export async function POST(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "brands";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, SVG, JPEG, and WebP files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be under 5MB" },
        { status: 400 }
      );
    }

    // Validate folder
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    // Sanitize filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const fileName = `${safeName}-${Date.now()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeDir = path.join(process.cwd(), "public", folder);

    // Ensure directory exists
    if (!existsSync(safeDir)) {
      mkdirSync(safeDir, { recursive: true });
    }

    const filePath = path.join(safeDir, fileName);

    // Prevent path traversal
    if (!filePath.startsWith(safeDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 400 });
    }

    writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/${folder}/${fileName}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
