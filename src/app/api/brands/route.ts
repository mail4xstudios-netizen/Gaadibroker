import { NextResponse } from "next/server";
import { getBrands } from "@/lib/store";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    return NextResponse.json(getBrands());
  } catch (err) {
    logger.error("Failed to get brands", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
