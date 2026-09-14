import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatOre } from "@/lib/format";
import { categoryLabel } from "@/lib/categories";
import { platformLabel } from "@/lib/platforms";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const streamer = await prisma.streamer.findFirst({
    where: { slug, status: "PAID" },
    select: { name: true, description: true },
  });
  if (!streamer) return {};
  return { title: streamer.name, description: streamer.description };
}

export default async function StreamerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("streamer");

  const streamer = await prisma.streamer.findFirst({
    where: { slug, status: "PAID" },
  });

  if (!streamer) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← {t("backToList")}
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
          {streamer.imageUrl ? (
            <Image
              src={streamer.imageUrl}
              alt={streamer.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">{streamer.name}</h1>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="inline-block rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
              {platformLabel(streamer.platform)}
            </span>
            <span className="inline-block rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
              {categoryLabel(streamer.category)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-foreground/90">{streamer.description}</p>

      <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface p-5">
        <div>
          <dt className="text-xs text-muted">{t("currentBid")}</dt>
          <dd className="text-lg font-semibold text-accent">
            {formatOre(streamer.currentBid, locale)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">{t("clicks")}</dt>
          <dd className="text-lg font-semibold">{streamer.clicks}</dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`/go/${streamer.id}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
        >
          {t("visit")}
        </a>
        <Link
          href={`/bid?slug=${streamer.slug}`}
          className="rounded-md bg-surface-2 px-5 py-2.5 font-semibold hover:bg-border transition-colors"
        >
          {t("claimThisRank")}
        </Link>
      </div>
    </div>
  );
}
