import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { minNextBid } from "@/lib/format";
import BidForm from "@/components/BidForm";
import type { Metadata } from "next";

const INCREMENT_ORE = Number(process.env.MIN_BID_INCREMENT_ORE ?? 100);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bidForm" });
  return { title: t("title") };
}

export default async function BidPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slug?: string }>;
}) {
  const { locale } = await params;
  const { slug } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("bidForm");

  const streamer = slug
    ? await prisma.streamer.findFirst({ where: { slug } })
    : null;

  const minBidOre = minNextBid(streamer?.currentBid ?? 0, INCREMENT_ORE);

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("intro")}</p>

      <BidForm
        locale={locale}
        minBidOre={minBidOre}
        prefill={
          streamer
            ? {
                slug: streamer.slug,
                name: streamer.name,
                platform: streamer.platform,
                url: streamer.url,
                description: streamer.description,
                category: streamer.category,
                imageUrl: streamer.imageUrl ?? "",
                email: streamer.email,
                vatNumber: streamer.vatNumber ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
