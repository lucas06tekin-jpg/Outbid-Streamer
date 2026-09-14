import { NextResponse } from "next/server";
import { getOnlineCount, getTotalViews, getLatestActivity } from "@/lib/stats";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [onlineCount, totalViews, latestActivity, topStreamers] = await Promise.all([
    getOnlineCount(),
    getTotalViews(),
    getLatestActivity(10),
    prisma.streamer.findMany({
      where: { status: "PAID" },
      orderBy: { currentBid: "desc" },
      select: { currentBid: true },
      take: 20,
    }),
  ]);

  return NextResponse.json({
    onlineCount,
    totalViews,
    latestActivity,
    rankedBids: topStreamers.map((s) => s.currentBid),
  });
}
