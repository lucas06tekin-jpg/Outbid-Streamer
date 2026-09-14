import { NextRequest, NextResponse } from "next/server";
import { recordHeartbeat, getOnlineCount } from "@/lib/stats";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 100) : null;

  if (!sessionId) {
    return NextResponse.json({ error: "missing_session_id" }, { status: 400 });
  }

  await recordHeartbeat(sessionId);
  const onlineCount = await getOnlineCount();

  return NextResponse.json({ onlineCount });
}
