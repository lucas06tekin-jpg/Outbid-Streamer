import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("nav");
  const f = useTranslations("footer");
  const m = useTranslations("meta");

  const supportEmail = process.env.SUPPORT_EMAIL || "support@example.se";

  return (
    <footer className="border-t border-border bg-surface mt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-semibold text-foreground">{m("siteName")}</p>
          <p className="mt-2 text-muted">{m("tagline")}</p>
        </div>

        <div className="text-muted space-y-1">
          <p>
            <span className="text-foreground">{f("support")}:</span>{" "}
            <a href={`mailto:${supportEmail}`} className="hover:text-foreground">
              {supportEmail}
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1 text-muted">
          <Link href="/kategorier" className="hover:text-foreground">
            {t("categories")}
          </Link>
          <Link href="/om" className="hover:text-foreground">
            {t("about")}
          </Link>
          <Link href="/villkor" className="hover:text-foreground">
            {t("terms")}
          </Link>
          <Link href="/integritetspolicy" className="hover:text-foreground">
            {t("privacy")}
          </Link>
          <Link href="/cookies" className="hover:text-foreground">
            {t("cookies")}
          </Link>
          <Link href="/kontakt" className="hover:text-foreground">
            {t("contact")}
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {m("siteName")}. {f("rights")}
      </div>
    </footer>
  );
}
