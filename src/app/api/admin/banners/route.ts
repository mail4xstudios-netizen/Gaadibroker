import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();
  try {
    return NextResponse.json(getSiteContent());
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
    const content = updateSiteContent(body);
    return NextResponse.json(content);
  } catch (err) {
    logger.error("Failed to update site content", err);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
