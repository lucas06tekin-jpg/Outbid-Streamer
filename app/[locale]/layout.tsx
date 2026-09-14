import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import CursorMascot from "@/components/CursorMascot";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const siteName = t("siteName");
  const tagline = t("tagline");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteName} — ${tagline}`,
      template: `%s — ${siteName}`,
    },
    description: tagline,
    openGraph: {
      title: siteName,
      description: tagline,
      siteName,
      locale,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: siteName,
      description: tagline,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
      <CursorMascot />
    </NextIntlClientProvider>
  );
}
