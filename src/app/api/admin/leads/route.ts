import { NextResponse } from "next/server";
import { getLeads, updateLeadStatus, updateLead } from "@/lib/store";
import { authenticateRequest } from "@/lib/auth";
import { logger } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!authenticateRequest(request)) return unauthorized();
  try {
    return NextResponse.json(getLeads());
  } catch (err) {
    logger.error("Failed to get leads", err);
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

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    // If only status update (backward compatible)
    if (body.status && Object.keys(body).length <= 2) {
      const validStatuses = ["new", "contacted", "converted", "closed"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
      }
      const lead = updateLeadStatus(body.id, body.status);
      if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(lead);
    }

    // Full lead update — whitelist allowed fields only
    const allowedFields = ["status", "leadType", "followUpDate", "followUpNotes", "callHistory"];
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    const lead = updateLead(body.id, updates);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (err) {
    logger.error("Failed to update lead", err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
