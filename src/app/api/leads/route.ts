import { NextResponse } from "next/server";
import { addLead } from "@/lib/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize, isValidPhone, validateRequired } from "@/lib/validate";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // Rate limit: 5 leads per minute per IP
  const rl = rateLimit(`lead:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rl.success) {
    logger.security("Lead form rate limited", { ip });
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs || 60000) / 1000)) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { valid, missing } = validateRequired(body, ["name", "phone", "carId"]);
  if (!valid) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
  }

  const phone = sanitize(body.phone, 15).replace(/\D/g, "");
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  try {
    const lead = addLead({
      id: crypto.randomUUID(),
      name: sanitize(body.name, 100),
      phone,
      carId: sanitize(body.carId, 50),
      carName: sanitize(body.carName || "Unknown", 200),
      source: sanitize(body.source || "website", 50),
      status: "new",
      createdAt: new Date().toISOString(),
    });

    logger.info("New lead captured", { id: lead.id, source: lead.source, ip });
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    logger.error("Failed to save lead", err);
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}

// GET removed from public endpoint - leads are only accessible via /api/admin/leads with auth
