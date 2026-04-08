import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`content:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const content = await getSiteContent();
    // Only return public fields
    return NextResponse.json({
      privacyPolicy: content.privacyPolicy || "",
      termsOfService: content.termsOfService || "",
      youtubeVideoUrl: content.youtubeVideoUrl || "",
      youtubeVideos: content.youtubeVideos || [],
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
