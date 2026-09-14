import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-5xl font-semibold text-accent">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("body")}</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
