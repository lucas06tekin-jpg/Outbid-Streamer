import { getTranslations } from "next-intl/server";
import { getSiteSummary } from "@/lib/stats";
import { formatOre } from "@/lib/format";

export default async function SiteStatsFooter({ locale }: { locale: string }) {
  const t = await getTranslations("siteSummary");
  const summary = await getSiteSummary();
  const numberFmt = new Intl.NumberFormat(locale);

  return (
    <div className="mt-14 border-t border-border pt-10 text-center">
      <p className="text-sm text-muted">{t("eyebrow", { days: summary.daysSinceLaunch })}</p>

      <div className="mx-auto mt-5 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface px-4 py-5">
          <p className="flex items-center justify-center gap-1.5 font-display text-2xl font-semibold tracking-tight">
            <span className="inline-block h-2 w-2 rounded-full bg-live" aria-hidden="true" />
            {numberFmt.format(summary.visitors)}
          </p>
          <p className="mt-1 text-xs text-muted">{t("visitors")}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface px-4 py-5">
          <p className="font-display text-2xl font-semibold tracking-tight text-accent">
            {formatOre(summary.revenueOre, locale)}
          </p>
          <p className="mt-1 text-xs text-muted">{t("revenue")}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface px-4 py-5">
          <p className="font-display text-2xl font-semibold tracking-tight">
            {numberFmt.format(summary.streamersAdded)}
          </p>
          <p className="mt-1 text-xs text-muted">{t("streamersAdded")}</p>
        </div>
      </div>
    </div>
  );
}
