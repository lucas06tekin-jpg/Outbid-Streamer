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

      <CookiesContent />
    </div>
  );
}

function CookiesContent() {
  return (
    <div className="mt-4 space-y-4 text-sm text-muted leading-relaxed">
      <p>
        We only use cookies that are strictly necessary for the site to work, for example to
        remember your choice in the cookie banner and to handle your admin login. These
        don&apos;t require consent under law.
      </p>
      <p>
        We don&apos;t use any cookies for analytics, marketing, or tracking in this version of
        the service. If that changes in the future, this page will be updated and you&apos;ll
        be asked for consent before such cookies are activated.
      </p>
      <table className="w-full border-collapse text-left text-xs mt-4">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Purpose</th>
            <th className="py-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2 pr-4">cookie-consent-necessary-only</td>
            <td className="py-2 pr-4">Remembers that you&apos;ve closed the cookie banner</td>
            <td className="py-2">Local storage in your browser</td>
          </tr>
          <tr>
            <td className="py-2 pr-4">admin_session</td>
            <td className="py-2 pr-4">Keeps you logged in to the admin panel</td>
            <td className="py-2">12 hours</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
