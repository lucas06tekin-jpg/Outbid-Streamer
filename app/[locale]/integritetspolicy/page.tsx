import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const m = await getTranslations("meta");

  const supportEmail = process.env.SUPPORT_EMAIL || "support@example.se";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">{t("privacyTitle")}</h1>
      <PrivacySv siteName={m("siteName")} supportEmail={supportEmail} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-muted leading-relaxed">{children}</div>
    </section>
  );
}

function PrivacySv({
  siteName,
  supportEmail,
}: {
  siteName: string;
  supportEmail: string;
}) {
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        {siteName} drivs som ett privat projekt (ej registrerat bolag). Kontakta{" "}
        <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
          {supportEmail}
        </a>{" "}
        i alla frågor som rör personuppgiftsansvar och behandlingen av dina personuppgifter
        enligt beskrivningen nedan.
      </p>

      <Section title="Vilka uppgifter vi lagrar">
        <ul className="list-disc pl-5 space-y-1">
          <li>Namn, e-postadress och ev. VAT-nummer/org.nr som du anger vid en listning.</li>
          <li>Kanal-URL, plattform, beskrivning, kategori och ev. bild-URL för din listning.</li>
          <li>IP-adress och tidsstämpel vid klick på en listnings länk (för klickstatistik och missbruksskydd).</li>
          <li>
            Betalningsuppgifter (kortnummer m.m.) hanteras och lagras aldrig av oss - all
            betalning sker hos och lagras av Stripe.
          </li>
        </ul>
      </Section>

      <Section title="Varför vi lagrar uppgifterna">
        <p>
          Uppgifterna behövs för att kunna leverera tjänsten (visa din listning, skicka
          kvitto, kontakta dig om din listning) samt för att uppfylla bokförings- och
          skattelagstiftning.
        </p>
      </Section>

      <Section title="Lagringstid">
        <p>
          Uppgifter kopplade till en aktiv listning sparas så länge listningen är aktiv.
          Uppgifter som krävs enligt bokföringslagen (kvitton, betalningsunderlag) sparas i 7
          år. Övriga uppgifter raderas eller anonymiseras senast 24 månader efter senaste
          aktivitet.
        </p>
      </Section>

      <Section title="Var uppgifterna lagras">
        <p>
          All data lagras inom EU (databas i Frankfurt, Tyskland). Vi delar uppgifter med
          Stripe (betalning) och vår e-posttjänst för kvittoutskick, båda med
          personuppgiftsbiträdesavtal (DPA) på plats. Stripes DPA finns tillgängligt via
          Stripes dashboard och har godkänts av oss.
        </p>
      </Section>

      <Section title="Dina rättigheter">
        <p>
          Du har rätt att begära utdrag, rättelse eller radering av dina uppgifter (&quot;rätt
          att bli glömd&quot;). Kontakta{" "}
          <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
            {supportEmail}
          </a>{" "}
          för att utöva dina rättigheter. Du har även rätt att lämna klagomål till
          Integritetsskyddsmyndigheten (IMY).
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Se vår separata{" "}
          <Link href="/cookies" className="underline hover:text-foreground">
            cookiepolicy
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
