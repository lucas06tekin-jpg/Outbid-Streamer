import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, categoryLabel } from "@/lib/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("categories") };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("categoriesPage");

  const counts = await prisma.streamer.groupBy({
    by: ["category"],
    where: { status: "PAID" },
    _count: { category: true },
  });
  const countMap = new Map(counts.map((c) => [c.category, c._count.category]));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{t("subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {CATEGORIES.map((c) => {
          const count = countMap.get(c.slug) ?? 0;
          return (
            <Link
              key={c.slug}
              href={{ pathname: "/", query: { category: c.slug } }}
              className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-4 transition hover:border-accent"
            >
              <span className="font-medium text-foreground">{categoryLabel(c.slug)}</span>
              <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
                {t("count", { count })}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
