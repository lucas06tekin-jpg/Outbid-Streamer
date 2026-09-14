"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import LeaderboardRow from "./LeaderboardRow";

type Streamer = {
  id: string;
  slug: string;
  name: string;
  platform: string;
  description: string;
  category: string;
  imageUrl: string | null;
  currentBid: number;
  clicks: number;
};

export default function LeaderboardSearch({ streamers }: { streamers: Streamer[] }) {
  const t = useTranslations("home");
  const [query, setQuery] = useState("");

  const ranked = useMemo(() => streamers.map((s, i) => ({ ...s, rank: i + 1 })), [streamers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ranked;
    return ranked.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [ranked, query]);

  return (
    <div>
      <div className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="input pl-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={t("searchClear")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center text-muted">
          {query ? t("searchEmpty", { query }) : t("empty")}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => (
            <LeaderboardRow key={s.id} rank={s.rank} streamer={s} />
          ))}
        </div>
      )}
    </div>
  );
}
