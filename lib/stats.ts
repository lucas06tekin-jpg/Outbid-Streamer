import { prisma } from "./prisma";

const ONLINE_WINDOW_SECONDS = 45;
const HEARTBEAT_CLEANUP_SECONDS = 300;

export async function recordHeartbeat(sessionId: string) {
  await prisma.$executeRaw`
    INSERT INTO "Heartbeat" ("sessionId", "lastSeen")
    VALUES (${sessionId}, now())
    ON CONFLICT ("sessionId") DO UPDATE SET "lastSeen" = now()
  `;

  await prisma.heartbeat.deleteMany({
    where: { lastSeen: { lt: new Date(Date.now() - HEARTBEAT_CLEANUP_SECONDS * 1000) } },
  });
}

export async function getOnlineCount(): Promise<number> {
  return prisma.heartbeat.count({
    where: { lastSeen: { gt: new Date(Date.now() - ONLINE_WINDOW_SECONDS * 1000) } },
  });
}

export async function incrementTotalViews(): Promise<number> {
  const stat = await prisma.siteStat.upsert({
    where: { id: 1 },
    update: { totalViews: { increment: 1 } },
    create: { id: 1, totalViews: 1 },
  });
  return stat.totalViews;
}

export async function getTotalViews(): Promise<number> {
  const stat = await prisma.siteStat.findUnique({ where: { id: 1 } });
  return stat?.totalViews ?? 0;
}

export type SiteSummary = {
  visitors: number;
  revenueOre: number;
  streamersAdded: number;
  launchDate: string | null;
};

export async function getSiteSummary(): Promise<SiteSummary> {
  const [visitors, revenue, streamersAdded, firstStreamer] = await Promise.all([
    getTotalViews(),
    prisma.bid.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.streamer.count(),
    prisma.streamer.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
  ]);

  return {
    visitors,
    revenueOre: revenue._sum.amount ?? 0,
    streamersAdded,
    launchDate: firstStreamer?.createdAt.toISOString() ?? null,
  };
}

export type ActivityItem = {
  id: string;
  streamerName: string;
  streamerSlug: string;
  amount: number;
  rank: number;
  createdAt: string;
};

export async function getLatestActivity(limit = 10): Promise<ActivityItem[]> {
  const rows = await prisma.$queryRaw<
    { id: string; name: string; slug: string; amount: number; createdAt: Date; rank: bigint }[]
  >`
    SELECT b.id, s.name, s.slug, b.amount, b."createdAt",
      (SELECT COUNT(*) + 1 FROM "Streamer" s2 WHERE s2.status = 'PAID' AND s2."currentBid" > s."currentBid") AS rank
    FROM "Bid" b
    JOIN "Streamer" s ON s.id = b."streamerId"
    WHERE b.status = 'PAID'
    ORDER BY b."createdAt" DESC
    LIMIT ${limit}
  `;

  return rows.map((r) => ({
    id: r.id,
    streamerName: r.name,
    streamerSlug: r.slug,
    amount: r.amount,
    rank: Number(r.rank),
    createdAt: r.createdAt.toISOString(),
  }));
}
