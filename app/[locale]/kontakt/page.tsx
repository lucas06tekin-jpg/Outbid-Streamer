import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const f = await getTranslations("footer");

  const supportEmail = process.env.SUPPORT_EMAIL || "support@example.se";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("intro")}</p>

      <dl className="mt-8 space-y-3 rounded-xl border border-border bg-surface p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{f("support")}</dt>
          <dd>
            <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
              {supportEmail}
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
