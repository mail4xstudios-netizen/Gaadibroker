import { NextResponse } from "next/server";
import { getBrands, addBrand, updateBrand, deleteBrand } from "@/lib/store";
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
    return NextResponse.json(getBrands());
  } catch (err) {
    logger.error("Failed to get brands", err);
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

  const { valid, missing } = validateRequired(body, ["name", "slug"]);
  if (!valid) {
    return badRequest(`Missing required fields: ${missing.join(", ")}`);
  }

  try {
    const brand = addBrand({
      id: Date.now().toString(),
      name: sanitize(body.name, 100),
      slug: sanitize(body.slug, 50).toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      logo: sanitize(body.logo || "", 500),
    });
    return NextResponse.json(brand, { status: 201 });
  } catch (err) {
    logger.error("Failed to add brand", err);
    return NextResponse.json({ error: "Failed to save brand" }, { status: 500 });
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

  if (!body.id) return badRequest("Brand ID is required");

  try {
    const { id, ...updates } = body;
    if (updates.name) updates.name = sanitize(updates.name, 100);
    if (updates.slug) updates.slug = sanitize(updates.slug, 50).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (updates.logo) updates.logo = sanitize(updates.logo, 500);

    const brand = updateBrand(id, updates);
    if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(brand);
  } catch (err) {
    logger.error("Failed to update brand", err);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
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

  if (!body.id) return badRequest("Brand ID is required");

  try {
    const deleted = deleteBrand(body.id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Failed to delete brand", err);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
