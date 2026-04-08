import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";
import { sanitize } from "@/lib/validate";
import { logger } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();
  try {
    return NextResponse.json(await getSiteContent());
  } catch (err) {
    logger.error("Failed to get site content", err);
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

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    // Whitelist and sanitize allowed fields
    const allowedFields: Record<string, number> = {
      heroTitle: 200, heroSubtitle: 500, heroCta: 50, bannerImage: 500,
      aboutText: 2000, contactEmail: 100, contactPhone: 20, contactAddress: 300, whatsappNumber: 20,
      privacyPolicy: 20000, termsOfService: 20000, youtubeVideoUrl: 500,
    };
    const sanitized: Record<string, unknown> = {};
    for (const [key, maxLen] of Object.entries(allowedFields)) {
      if (body[key] !== undefined) sanitized[key] = sanitize(body[key], maxLen);
    }
    // Handle array fields separately
    if (body.sliderImages && Array.isArray(body.sliderImages)) {
      sanitized.sliderImages = body.sliderImages.map((url: string) => sanitize(url, 500));
    }
    if (body.youtubeVideos && Array.isArray(body.youtubeVideos)) {
      sanitized.youtubeVideos = body.youtubeVideos.map((url: string) => sanitize(url, 500));
    }
    const content = await updateSiteContent(sanitized);
    return NextResponse.json(content);
  } catch (err) {
    logger.error("Failed to update site content", err);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
