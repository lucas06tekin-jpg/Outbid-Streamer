"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatOre, formatRelativeTime, minNextBid } from "@/lib/format";
import type { ActivityItem } from "@/lib/stats";

const TOAST_LIFETIME_MS = 6000;

type Stats = {
  onlineCount: number;
  totalViews: number;
  latestActivity: ActivityItem[];
  rankedBids: number[];
};

export default function LiveDashboard({
  initialStats,
  incrementOre,
}: {
  initialStats: Stats;
  incrementOre: number;
}) {
  const t = useTranslations("live");
  const locale = useLocale();
  const [stats, setStats] = useState(initialStats);
  const [targetRank, setTargetRank] = useState(1);
  const [toasts, setToasts] = useState<ActivityItem[]>([]);
  const numberFmt = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const seenIdsRef = useRef<Set<string>>(new Set(initialStats.latestActivity.map((i) => i.id)));

  useEffect(() => {
    try {
      if (!localStorage.getItem("streamtopp_visited")) {
        localStorage.setItem("streamtopp_visited", "1");
        fetch("/api/track-view", { method: "POST" }).catch(() => {});
      }
    } catch {}

    let sessionId: string;
    try {
      sessionId = sessionStorage.getItem("streamtopp_session") ?? crypto.randomUUID();
      sessionStorage.setItem("streamtopp_session", sessionId);
    } catch {
      sessionId = crypto.randomUUID();
    }

    const ping = () =>
      fetch("/api/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {});

    const refresh = () =>
      fetch("/api/stats")
        .then((r) => r.json())
        .then((next: Stats) => {
          const fresh = next.latestActivity.filter((item) => !seenIdsRef.current.has(item.id));
          if (fresh.length > 0) {
            fresh.forEach((item) => seenIdsRef.current.add(item.id));
            setToasts((prev) => [...fresh.reverse(), ...prev].slice(0, 3));
          }
          setStats(next);
        })
        .catch(() => {});

    ping();
    const heartbeatTimer = setInterval(ping, 20000);
    const statsTimer = setInterval(refresh, 5000);

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(statsTimer);
    };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, TOAST_LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [toasts]);

  const maxRank = Math.max(stats.rankedBids.length + 1, 5);
  const bidToBeat = stats.rankedBids[targetRank - 1] ?? 0;
  const minBid = minNextBid(bidToBeat, incrementOre);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          {t("online", { count: numberFmt.format(stats.onlineCount) })}
        </span>
        <span aria-hidden="true">·</span>
        <span>{t("totalViews", { count: numberFmt.format(stats.totalViews) })}</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label={t("prevRank")}
          onClick={() => setTargetRank((r) => Math.max(1, r - 1))}
          disabled={targetRank <= 1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-lg text-muted transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
        >
          −
        </button>

        <h1 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {targetRank === 1
            ? t.rich("claimHeadline1", {
                amount: () => <span className="text-accent">{formatOre(minBid, locale)}</span>,
              })
            : t.rich("claimHeadlineN", {
                rank: targetRank,
                amount: () => <span className="text-accent">{formatOre(minBid, locale)}</span>,
              })}
        </h1>

        <button
          type="button"
          aria-label={t("nextRank")}
          onClick={() => setTargetRank((r) => Math.min(maxRank, r + 1))}
          disabled={targetRank >= maxRank}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-lg text-muted transition hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted"
        >
          +
        </button>
      </div>

      <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted">
        {t("claimSubtext", { floor: formatOre(incrementOre, locale) })}
      </p>

      <ActivityTicker items={stats.latestActivity} />
      <ToastStack items={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}

function ToastStack({
  items,
  onDismiss,
}: {
  items: ActivityItem[];
  onDismiss: (id: string) => void;
}) {
  const t = useTranslations("live");
  const locale = useLocale();

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 sm:bottom-6 sm:right-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/kanal/${item.streamerSlug}`}
          onClick={() => onDismiss(item.id)}
          className="animate-toast-in pointer-events-auto flex w-72 items-start gap-3 rounded-xl border border-border bg-surface p-3 shadow-lg transition hover:border-accent"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-sm font-bold text-accent">
            #{item.rank}
          </span>
          <span className="min-w-0 text-sm">
            <span className="block truncate font-medium text-foreground">
              {t("toastMessage", {
                name: item.streamerName,
                rank: item.rank,
                amount: formatOre(item.amount, locale),
              })}
            </span>
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDismiss(item.id);
            }}
            aria-label={t("toastDismiss")}
            className="ml-auto shrink-0 text-muted hover:text-foreground"
          >
            ✕
          </button>
        </Link>
      ))}
    </div>
  );
}

function ActivityTicker({ items }: { items: ActivityItem[] }) {
  const t = useTranslations("live");
  const locale = useLocale();

  if (items.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-muted">{t("activityEmpty")}</p>
    );
  }

  const loop = [...items, ...items];

  return (
    <div className="mt-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {t("activityTitle")}
      </p>
      <div className="group relative overflow-hidden rounded-xl border border-border bg-surface [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
        <div className="flex w-max animate-ticker gap-3 py-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap">
          {loop.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={`/kanal/${item.streamerSlug}`}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs whitespace-nowrap hover:border-accent"
            >
              <span className="font-mono font-semibold text-accent">#{item.rank}</span>
              <span className="font-medium">{item.streamerName}</span>
              <span className="text-muted">{formatOre(item.amount, locale)}</span>
              <span className="text-muted">· {formatRelativeTime(item.createdAt, locale)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
