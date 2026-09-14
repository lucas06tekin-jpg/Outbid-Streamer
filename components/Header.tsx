import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const t = useTranslations("nav");
  const m = useTranslations("meta");
  const h = useTranslations("home");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <Logo className="h-7 w-7" />
          {m("siteName")}
        </Link>

        <nav className="hidden shrink-0 items-center gap-4 text-sm text-muted md:flex">
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

        <form action="/" method="GET" className="hidden flex-1 sm:block">
          <div className="mx-auto flex w-full max-w-md items-center overflow-hidden rounded-full border border-border bg-surface-2 pl-4 transition focus-within:border-accent">
            <input
              type="text"
              name="q"
              placeholder={h("searchPlaceholder")}
              aria-label={h("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground placeholder:text-muted outline-none"
            />
            <button
              type="submit"
              aria-label={h("searchPlaceholder")}
              className="flex h-8 w-8 shrink-0 items-center justify-center m-1 rounded-full bg-surface text-muted transition hover:text-accent"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/admin"
            className="hidden rounded-full bg-surface-2 px-4 py-1.5 text-sm font-medium text-foreground transition hover:bg-border sm:inline-block"
          >
            {t("admin")}
          </Link>
          <Link
            href="/buda"
            className="whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground transition hover:brightness-110"
          >
            <span className="sm:hidden">{t("bidShort")}</span>
            <span className="hidden sm:inline">{t("bid")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
