import { NextResponse } from "next/server";
import { getCarById } from "@/lib/store";
import { logger } from "@/lib/logger";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await getCarById(id);
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (err) {
    logger.error("Failed to get car detail", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
