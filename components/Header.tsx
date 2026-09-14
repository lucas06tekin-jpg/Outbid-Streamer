import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Logo from "./Logo";

export default function Header() {
  const t = useTranslations("nav");
  const m = useTranslations("meta");

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Logo className="h-7 w-7" />
          {m("siteName")}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t("home")}
          </Link>
          <Link href="/kategorier" className="hover:text-foreground transition-colors">
            {t("categories")}
          </Link>
          <Link href="/om" className="hover:text-foreground transition-colors">
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/buda"
            className="whitespace-nowrap rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground hover:brightness-110 transition"
          >
            <span className="sm:hidden">{t("bidShort")}</span>
            <span className="hidden sm:inline">{t("bid")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
