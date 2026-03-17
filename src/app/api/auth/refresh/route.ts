import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const rl = rateLimit(`refresh:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { refreshToken } = body;
  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token required" }, { status: 400 });
  }

  const tokens = refreshAccessToken(refreshToken);
  if (!tokens) {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }

  return NextResponse.json(tokens);
}
