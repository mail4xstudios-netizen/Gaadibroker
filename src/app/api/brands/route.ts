import { NextResponse } from "next/server";
import { getBrands } from "@/lib/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success: rlOk } = rateLimit(`brands:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    return NextResponse.json(await getBrands());
  } catch (err) {
    logger.error("Failed to get brands", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
