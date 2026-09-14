import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getEmbedInfo } from "@/lib/embed";
import PlatformBadge from "./PlatformBadge";

export default async function FeaturedStream({
  streamer,
  parentHost,
}: {
  streamer: { id: string; slug: string; name: string; platform: string; url: string };
  parentHost: string;
}) {
  const t = await getTranslations("featured");
  const embed = getEmbedInfo(streamer.platform, streamer.url, parentHost);

  return (
    <div className="overflow-hidden rounded-xl border border-accent/40 bg-surface">
      <div className="flex items-center gap-2 border-b border-border bg-accent-soft px-4 py-2.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
        </span>
        <span className="truncate text-sm font-semibold text-foreground">
          {t("liveNow", { name: streamer.name })}
        </span>
        <PlatformBadge platform={streamer.platform} className="ml-auto" />
      </div>

      {embed.kind === "none" ? (
        <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-surface-2 px-6 text-center">
          <p className="text-sm text-muted">{t("noPreview")}</p>
          <a
            href={`/go/${streamer.id}`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:brightness-110 transition"
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

      <div className="px-4 py-2.5 text-right">
        <Link href={`/channel/${streamer.slug}`} className="text-xs text-muted hover:text-accent transition-colors">
          {t("viewProfile")}
        </Link>
      </div>
    </div>
  );
}
