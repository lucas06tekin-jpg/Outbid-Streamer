import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("termsTitle") };
}

export default async function TermsPage({
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
      <h1 className="text-2xl font-bold">{t("termsTitle")}</h1>

      <TermsSv siteName={m("siteName")} supportEmail={supportEmail} />
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

function TermsSv({
  siteName,
  supportEmail,
}: {
  siteName: string;
  supportEmail: string;
}) {
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        Dessa villkor gäller för tjänsten {siteName}, &quot;vi&quot;, till dig som placerar en
        listning på topplistan, &quot;du&quot;.
      </p>

      <Section title="1. Tjänsten">
        <p>
          Tjänsten låter dig betala för att placera din streamingkanal (Twitch, YouTube, Kick,
          TikTok eller annan plattform) på en offentlig topplista. Listningar sorteras efter
          aktuellt bud i fallande ordning. Vem som helst kan gå om en placering genom att
          lägga ett högre bud än det nuvarande.
        </p>
      </Section>

      <Section title="2. Pris och betalning">
        <p>
          Alla priser anges i svenska kronor (SEK) inklusive 25% moms. Betalning sker via
          Stripe med kort, Swish eller Klarna. Din plats på topplistan aktiveras direkt efter
          att betalningen har godkänts.
        </p>
      </Section>

      <Section title="3. Ångerrätt">
        <p>
          Tjänsten är en digital tjänst som levereras och förbrukas i sin helhet direkt vid
          köpet (din listning aktiveras omedelbart). I enlighet med lagen om distansavtal och
          avtal utanför affärslokaler (2005:59) förlorar du din ångerrätt när tjänsten har
          påbörjats med ditt uttryckliga samtycke, vilket du bekräftar genom att kryssa i
          rutan om ångerrätt innan betalning.
        </p>
      </Section>

      <Section title="4. Regler för listningar">
        <ul className="list-disc pl-5 space-y-1">
          <li>Länken ska peka till en fungerande, egen streamingkanal.</li>
          <li>Innehåll får inte vara olagligt, stötande, vilseledande eller bedrägligt.</li>
          <li>Vi förbehåller oss rätten att avvisa eller ta bort listningar som bryter mot dessa regler, utan återbetalning om innehållet var vilseledande vid inlämning.</li>
          <li>Klickstatistik är vägledande och kan inte garanteras vara felfri.</li>
        </ul>
      </Section>

      <Section title="5. Ansvarsbegränsning">
        <p>
          Vi ansvarar inte för innehållet på externa webbplatser som listas via tjänsten.
          Tjänsten tillhandahålls i befintligt skick.
        </p>
      </Section>

      <Section title="6. Kontakt">
        <p>
          Frågor om dessa villkor besvaras på{" "}
          <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
            {supportEmail}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
