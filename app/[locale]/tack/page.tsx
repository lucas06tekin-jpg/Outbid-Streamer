import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import AutoRefresh from "@/components/AutoRefresh";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "thanks" });
  return { title: t("title"), robots: { index: false } };
}

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("thanks");

  let state: "paid" | "pending" | "failed" = "failed";

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        const bid = await prisma.bid.findUnique({
          where: { stripeSessionId: session_id },
        });
        state = bid?.status === "PAID" ? "paid" : "pending";
      } else if (session.status === "open") {
        state = "pending";
      }
    } catch {
      state = "failed";
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-16 text-center">
      {state === "pending" && <AutoRefresh />}

      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-muted">
        {state === "paid" && t("paid")}
        {state === "pending" && t("pending")}
        {state === "failed" && t("failed")}
      </p>
      {state === "paid" && <p className="mt-2 text-xs text-muted">{t("receiptNote")}</p>}

      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
      >
        {t("backToList")}
      </Link>
    </div>
  );
}
