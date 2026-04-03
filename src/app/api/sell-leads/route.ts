import { NextResponse } from "next/server";
import { addSellLead } from "@/lib/store";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize, isValidPhone, validateRequired } from "@/lib/validate";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const rl = rateLimit(`sell-lead:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!rl.success) {
    logger.security("Sell lead form rate limited", { ip });
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { valid, missing } = validateRequired(body, [
    "userName", "userPhone", "brand", "model", "year", "kmDriven", "fuelType", "city", "images",
  ]);
  if (!valid) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
  }

  if (!Array.isArray(body.images) || body.images.length === 0) {
    return NextResponse.json({ error: "At least one car image is required" }, { status: 400 });
  }

  const phone = sanitize(body.userPhone, 15).replace(/\D/g, "");
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  try {
    const lead = await addSellLead({
      id: Date.now().toString(),
      userId: sanitize(body.userId || "", 50),
      userName: sanitize(body.userName, 100),
      userPhone: phone,
      userEmail: sanitize(body.userEmail || "", 200),
      brand: sanitize(body.brand, 100),
      model: sanitize(body.model, 100),
      year: sanitize(body.year, 4),
      kmDriven: sanitize(body.kmDriven, 20),
      fuelType: sanitize(body.fuelType, 20),
      city: sanitize(body.city, 100),
      expectedPrice: sanitize(body.expectedPrice || "", 20),
      images: body.images.slice(0, 10).map((img: string) => sanitize(img, 500)),
      status: "new",
      adminNotes: "",
      createdAt: new Date().toISOString(),
    });

    logger.info("New sell lead captured", { id: lead.id, brand: lead.brand, ip });
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    logger.error("Failed to save sell lead", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
