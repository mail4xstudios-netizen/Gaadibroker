import { NextResponse } from "next/server";
import { validateAdmin, createToken, verifyToken } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize } from "@/lib/validate";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // Rate limit: 5 login attempts per 15 minutes per IP
  const rl = rateLimit(`auth:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
  if (!rl.success) {
    logger.security("Login rate limited", { ip });
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.retryAfterMs || 900000) / 1000)) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username = sanitize(body.username, 50);
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const result = validateAdmin(username, password, ip);

  if (result.success) {
    logger.info("Admin login successful", { ip });
    return NextResponse.json({ success: true, token: createToken() });
  }

  logger.security("Failed admin login attempt", { ip, username });
  return NextResponse.json({ error: result.error }, { status: 401 });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
  const valid = verifyToken(authHeader.slice(7));
  return NextResponse.json({ valid }, { status: valid ? 200 : 401 });
}
