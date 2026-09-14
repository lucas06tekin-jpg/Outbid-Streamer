import { headers } from "next/headers";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import LeaderboardSearch from "@/components/LeaderboardSearch";
import LiveDashboard from "@/components/LiveDashboard";
import FeaturedStream from "@/components/FeaturedStream";
import RunnerUpStream from "@/components/RunnerUpStream";
import { getOnlineCount, getTotalViews, getLatestActivity } from "@/lib/stats";

const INCREMENT_ORE = Number(process.env.MIN_BID_INCREMENT_ORE ?? 100);

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [streamers, allPaidBids, topStreamer, runnersUp, onlineCount, totalViews, latestActivity] = await Promise.all([
    prisma.streamer.findMany({
      where: {
        status: "PAID",
        ...(category ? { category } : {}),
      },
      orderBy: { currentBid: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        platform: true,
        description: true,
        category: true,
        imageUrl: true,
        currentBid: true,
        clicks: true,
      },
    }),
    prisma.streamer.findMany({
      where: { status: "PAID" },
      orderBy: { currentBid: "desc" },
      select: { currentBid: true },
      take: 20,
    }),
    prisma.streamer.findFirst({
      where: { status: "PAID" },
      orderBy: { currentBid: "desc" },
      select: { id: true, slug: true, name: true, platform: true, url: true },
    }),
    prisma.streamer.findMany({
      where: { status: "PAID" },
      orderBy: { currentBid: "desc" },
      skip: 1,
      take: 2,
      select: { id: true, slug: true, name: true, platform: true, url: true },
    }),
    getOnlineCount(),
    getTotalViews(),
    getLatestActivity(10),
  ]);

  const requestHost = (await headers()).get("host") ?? "localhost";
  const parentHost = requestHost.split(":")[0];

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
          {topStreamer && (
            <div className="relative">
              <div
                aria-hidden="true"
                className="stage-glow pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10 blur-3xl"
              />
              <FeaturedStream streamer={topStreamer} parentHost={parentHost} />

              {runnersUp.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {runnersUp.map((s, i) => (
                    <RunnerUpStream key={s.id} streamer={s} rank={i + 2} parentHost={parentHost} />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface-2/50 p-5">
            <LiveDashboard
              initialStats={{
                onlineCount,
                totalViews,
                latestActivity,
                rankedBids: allPaidBids.map((s) => s.currentBid),
              }}
              incrementOre={INCREMENT_ORE}
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted">{t("subtitle")}</p>
          </div>
          <Link
            href="/buda"
            className="shrink-0 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-110 transition"
          >
            {t("ctaButton")}
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/"
            scroll={false}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              !category
                ? "bg-accent text-accent-foreground font-semibold"
                : "bg-surface-2 text-muted hover:text-foreground"
            }`}
          >
            {t("allCategories")}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={{ pathname: "/", query: { category: c.slug } }}
              scroll={false}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                category === c.slug
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "bg-surface-2 text-muted hover:text-foreground"
              }`}
            >
              {categoryLabel(c.slug, locale)}
            </Link>
          ))}
        </div>

        <LeaderboardSearch streamers={streamers} initialQuery={q} />
      </div>
    </div>
  );
}
