"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-muted">{t("body")}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="rounded-md bg-surface-2 px-5 py-2.5 font-semibold hover:bg-border transition-colors"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
