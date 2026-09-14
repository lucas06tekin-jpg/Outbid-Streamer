import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEmbedInfo } from "@/lib/embed";
import { platformLabel } from "@/lib/platforms";

export default async function RunnerUpStream({
  streamer,
  rank,
  parentHost,
}: {
  streamer: { id: string; slug: string; name: string; platform: string; url: string };
  rank: number;
  parentHost: string;
}) {
  const t = await getTranslations("featured");
  const embed = getEmbedInfo(streamer.platform, streamer.url, parentHost);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-bold text-muted">
          {rank}
        </span>
        <span className="truncate text-sm font-medium text-foreground">{streamer.name}</span>
        <span className="ml-auto shrink-0 text-xs text-muted">{platformLabel(streamer.platform)}</span>
      </div>

      {embed.kind === "none" ? (
        <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-surface-2 px-4 text-center">
          <p className="text-xs text-muted">{t("noPreview")}</p>
          <a
            href={`/go/${streamer.id}`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:brightness-110 transition"
          >
            {t("watchLive")}
          </a>
        </div>
      ) : (
        <iframe
          src={embed.src}
          className="aspect-video w-full"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          title={t("liveNow", { name: streamer.name })}
        />
      )}

      <div className="px-3 py-1.5 text-right">
        <Link href={`/kanal/${streamer.slug}`} className="text-xs text-muted hover:text-accent transition-colors">
          {t("viewProfile")}
        </Link>
      </div>
    </div>
  );
}
