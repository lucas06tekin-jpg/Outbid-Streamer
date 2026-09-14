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

  const supportEmail = process.env.SUPPORT_EMAIL || "support@example.com";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">{t("termsTitle")}</h1>

      <TermsContent siteName={m("siteName")} supportEmail={supportEmail} />
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

function TermsContent({
  siteName,
  supportEmail,
}: {
  siteName: string;
  supportEmail: string;
}) {
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        These terms apply to the {siteName} service, &quot;we&quot;, and to you as someone
        placing a listing on the leaderboard, &quot;you&quot;.
      </p>

      <Section title="1. The service">
        <p>
          The service lets you pay to place your streaming channel (Twitch, YouTube, Kick,
          TikTok, or another platform) on a public leaderboard. Listings are sorted by current
          bid in descending order. Anyone can overtake a spot by placing a higher bid than the
          current one.
        </p>
      </Section>

      <Section title="2. Price and payment">
        <p>
          All prices are shown in Swedish kronor (SEK) including 25% VAT. Payment is handled
          via Stripe with card, Swish, or Klarna. Your spot on the leaderboard activates
          immediately once payment is approved.
        </p>
      </Section>

      <Section title="3. Right of withdrawal">
        <p>
          The service is a digital service that is delivered and fully consumed at the moment
          of purchase (your listing activates immediately). Under the Swedish Distance and
          Off-Premises Contracts Act (2005:59), you lose your right of withdrawal once the
          service has begun with your express consent, which you confirm by checking the
          withdrawal box before payment.
        </p>
      </Section>

      <Section title="4. Listing rules">
        <ul className="list-disc pl-5 space-y-1">
          <li>The link must point to a working channel you actually stream on.</li>
          <li>Content must not be illegal, offensive, misleading, or fraudulent.</li>
          <li>We reserve the right to reject or remove listings that break these rules, with no refund if the content was misleading at submission.</li>
          <li>Click statistics are indicative and cannot be guaranteed error-free.</li>
        </ul>
      </Section>

      <Section title="5. Limitation of liability">
        <p>
          We are not responsible for the content of external sites listed through the service.
          The service is provided as-is.
        </p>
      </Section>

      <Section title="6. Contact">
        <p>
          Questions about these terms are answered at{" "}
          <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
            {supportEmail}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
