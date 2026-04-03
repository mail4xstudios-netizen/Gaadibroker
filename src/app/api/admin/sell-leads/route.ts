import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getSellLeads, updateSellLead } from "@/lib/store";

export async function GET(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSellLeads());
}

export async function PATCH(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }
    // Whitelist allowed fields only
    const allowedFields = ["status", "notes", "assignedTo"];
    const updates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updates[key] = body[key];
    }
    const updated = await updateSellLead(body.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
