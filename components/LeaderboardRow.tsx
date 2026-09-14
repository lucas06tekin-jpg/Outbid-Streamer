import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { formatOre } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import { platformLabel } from "@/lib/platforms";

const RANK_STYLES: Record<number, string> = {
  1: "bg-gold text-accent-foreground",
  2: "bg-silver text-accent-foreground",
  3: "bg-bronze text-accent-foreground",
};

export default function LeaderboardRow({
  rank,
  streamer,
}: {
  rank: number;
  streamer: {
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
}) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border px-4 py-4 sm:px-5 transition-colors ${
        rank === 1
          ? "border-accent/40 bg-accent-soft"
          : "border-border bg-surface hover:border-accent/40"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
          RANK_STYLES[rank] ?? "bg-surface-2 text-muted"
        }`}
      >
        {rank}
      </div>

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-2">
        {streamer.imageUrl ? (
          <Image
            src={streamer.imageUrl}
            alt={streamer.name}
            width={44}
            height={44}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted text-xs">
            {streamer.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/kanal/${streamer.slug}`}
          className="font-semibold text-foreground hover:text-accent transition-colors"
        >
          {streamer.name}
        </Link>
        <p className="truncate text-sm text-muted">{streamer.description}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="inline-block rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
            {platformLabel(streamer.platform)}
          </span>
          <span className="inline-block rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
            {categoryLabel(streamer.category, locale)}
          </span>
        </div>
      </div>

      <div className="hidden sm:block text-right text-xs text-muted w-16">
        {streamer.clicks} {t("clicks").toLowerCase()}
      </div>

      <div className="text-right w-24 shrink-0">
        <div className="font-semibold text-accent">{formatOre(streamer.currentBid, locale)}</div>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5">
        <a
          href={`/go/${streamer.id}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="rounded-md bg-surface-2 px-3 py-1.5 text-center text-xs font-medium text-foreground hover:bg-border transition-colors"
        >
          {t("visit")}
        </a>
        <Link
          href={`/buda?slug=${streamer.slug}`}
          className="rounded-md bg-accent px-3 py-1.5 text-center text-xs font-semibold text-accent-foreground hover:brightness-110 transition"
        >
          {t("claim")}
        </Link>
      </div>
    </div>
  );
}
