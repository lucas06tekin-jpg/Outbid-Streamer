import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("cookiesTitle") };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">{t("cookiesTitle")}</h1>

      <CookiesSv />
    </div>
  );
}

function CookiesSv() {
  return (
    <div className="mt-4 space-y-4 text-sm text-muted leading-relaxed">
      <p>
        Vi använder endast cookies som är strikt nödvändiga för att sajten ska fungera, till
        exempel för att komma ihåg ditt val i cookiebannern och för att hantera din
        admin-inloggning. Dessa kräver inte samtycke enligt lag.
      </p>
      <p>
        Vi använder inga cookies för analys, marknadsföring eller spårning i denna version av
        tjänsten. Om det läggs till i framtiden kommer denna sida att uppdateras och du
        kommer att tillfrågas om samtycke innan sådana cookies aktiveras.
      </p>
      <table className="w-full border-collapse text-left text-xs mt-4">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 pr-4">Namn</th>
            <th className="py-2 pr-4">Syfte</th>
            <th className="py-2">Varaktighet</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2 pr-4">cookie-consent-necessary-only</td>
            <td className="py-2 pr-4">Kommer ihåg att du stängt cookiebannern</td>
            <td className="py-2">Lokal lagring i din webbläsare</td>
          </tr>
          <tr>
            <td className="py-2 pr-4">admin_session</td>
            <td className="py-2 pr-4">Håller dig inloggad i adminpanelen</td>
            <td className="py-2">12 timmar</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
