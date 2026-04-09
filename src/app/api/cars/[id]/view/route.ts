import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// POST /api/cars/[id]/view
// Tracks a view for a car. Maintains a rolling 24h counter by resetting
// the counter whenever `recentViewsResetAt` is older than 24 hours.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  // Per-IP rate limit: at most 10 view pings per minute across all cars.
  const { success: rlOk } = rateLimit(`carview:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rlOk) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { id } = await params;
    if (!adminDb || typeof adminDb.collection !== "function") {
      return NextResponse.json({ recentViews: 0 });
    }
    const docRef = adminDb.collection("cars").doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const data = snap.data() || {};
    const now = Date.now();
    const resetAt = data.recentViewsResetAt ? new Date(data.recentViewsResetAt).getTime() : 0;
    const stale = !resetAt || now - resetAt > 24 * 60 * 60 * 1000;

    if (stale) {
      await docRef.update({
        recentViews: 1,
        recentViewsResetAt: new Date(now).toISOString(),
      });
      return NextResponse.json({ recentViews: 1 });
    }

    await docRef.update({ recentViews: FieldValue.increment(1) });
    return NextResponse.json({ recentViews: (data.recentViews || 0) + 1 });
  } catch (err) {
    logger.error("Failed to track car view", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
