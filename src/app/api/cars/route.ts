import { NextResponse } from "next/server";
import { getCars } from "@/lib/store";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const cars = getCars();
    return NextResponse.json(cars);
  } catch (err) {
    logger.error("Failed to get cars", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
