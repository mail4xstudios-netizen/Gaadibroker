import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getLoginHistory } from "@/lib/user-auth";

export async function GET(request: Request) {
  if (!authenticateRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") || undefined;

  const history = getLoginHistory(userId);
  return NextResponse.json({ history, total: history.length });
}
