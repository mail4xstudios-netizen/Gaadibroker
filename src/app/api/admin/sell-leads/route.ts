import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getSellLeads, updateSellLead } from "@/lib/store";

export async function GET(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getSellLeads());
}

export async function PATCH(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing lead ID" }, { status: 400 });
    }
    const updated = updateSellLead(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
