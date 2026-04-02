import { NextResponse } from "next/server";
import { getCars, addCar, updateCar, deleteCar } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";
import { sanitize, validateRequired } from "@/lib/validate";
import { logger } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function GET(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();
  try {
    return NextResponse.json(getCars());
  } catch (err) {
    logger.error("Failed to get cars", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { valid, missing } = validateRequired(body, ["name", "brand", "price"]);
  if (!valid) {
    return badRequest(`Missing required fields: ${missing.join(", ")}`);
  }

  try {
    const car = addCar({
      ...body,
      name: sanitize(body.name, 200),
      brand: sanitize(body.brand, 100),
      model: sanitize(body.model || "", 100),
      description: sanitize(body.description || "", 2000),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split("T")[0],
    });
    return NextResponse.json(car, { status: 201 });
  } catch (err) {
    logger.error("Failed to add car", err);
    return NextResponse.json({ error: "Failed to save car" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.id) return badRequest("Car ID is required");

  try {
    // Whitelist and sanitize allowed fields
    const allowedFields = ["name", "brand", "model", "year", "price", "originalPrice", "fuelType",
      "transmission", "kmDriven", "ownerType", "location", "city", "features", "description",
      "color", "registration", "insurance", "images", "featured"];
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    if (updates.name) updates.name = sanitize(updates.name as string, 200);
    if (updates.brand) updates.brand = sanitize(updates.brand as string, 100);
    if (updates.model) updates.model = sanitize(updates.model as string, 100);
    if (updates.description) updates.description = sanitize(updates.description as string, 2000);

    const car = updateCar(body.id, updates);
    if (!car) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(car);
  } catch (err) {
    logger.error("Failed to update car", err);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.id) return badRequest("Car ID is required");

  try {
    const deleted = deleteCar(body.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to delete car", err);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
