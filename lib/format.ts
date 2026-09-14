export const VAT_RATE = 0.25;

/** Formats an amount in öre as a Swedish kronor string, e.g. 1270000 -> "12 700 kr" */
export function formatOre(ore: number, locale: string = "sv-SE"): string {
  const kr = Math.round(ore / 100);
  return `${new Intl.NumberFormat(locale).format(kr)} kr`;
}

export function krToOre(kr: number): number {
  return Math.round(kr * 100);
}

/** Splits a VAT-inclusive amount (in öre) into ex-VAT and VAT parts. */
export function splitVatInclusive(totalOre: number) {
  const exVat = Math.round(totalOre / (1 + VAT_RATE));
  const vat = totalOre - exVat;
  return { totalOre, exVatOre: exVat, vatOre: vat };
}

/** Formats a past timestamp as a short relative string, e.g. "4 min sedan" / "4 min ago". */
export function formatRelativeTime(iso: string, locale: string = "sv-SE"): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.max(1, Math.round(diffMs / 1000));
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" });

  if (diffSec < 60) return rtf.format(-diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return rtf.format(-diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return rtf.format(-diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  return rtf.format(-diffDay, "day");
}

/** Stripe rejects SEK Checkout Sessions under this amount ("amount_too_small"). */
export const STRIPE_MIN_CHARGE_ORE = 300;

/** Minimum next bid (in öre) given the current highest bid (in öre). No percentage
 *  floor — just enough to beat the current bid by at least incrementOre, but never
 *  below what Stripe will accept as a charge. */
export function minNextBid(currentBidOre: number, incrementOre: number): number {
  return Math.max(currentBidOre + incrementOre, incrementOre, STRIPE_MIN_CHARGE_ORE);
}
