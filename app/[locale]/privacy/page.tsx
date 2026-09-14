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

  const supportEmail = process.env.SUPPORT_EMAIL || "support@example.com";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">{t("privacyTitle")}</h1>
      <PrivacyContent siteName={m("siteName")} supportEmail={supportEmail} />
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

function PrivacyContent({
  siteName,
  supportEmail,
}: {
  siteName: string;
  supportEmail: string;
}) {
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        {siteName} is run as a private project (not a registered company). Contact{" "}
        <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
          {supportEmail}
        </a>{" "}
        with any questions about data controllership and how your personal data is processed
        as described below.
      </p>

      <Section title="What data we store">
        <ul className="list-disc pl-5 space-y-1">
          <li>Name, email address, and any VAT number/business ID you provide when placing a listing.</li>
          <li>Channel URL, platform, description, category, and any image URL for your listing.</li>
          <li>IP address and timestamp when a listing&apos;s link is clicked (for click statistics and abuse prevention).</li>
          <li>
            Payment details (card numbers, etc.) are never handled or stored by us - all
            payment processing happens at, and is stored by, Stripe.
          </li>
        </ul>
      </Section>

      <Section title="Why we store this data">
        <p>
          The data is needed to deliver the service (show your listing, send a receipt,
          contact you about your listing) and to comply with bookkeeping and tax law.
        </p>
      </Section>

      <Section title="Retention period">
        <p>
          Data tied to an active listing is kept for as long as the listing is active. Data
          required under Swedish bookkeeping law (receipts, payment records) is kept for 7
          years. Other data is deleted or anonymized no later than 24 months after the last
          activity.
        </p>
      </Section>

      <Section title="Where data is stored">
        <p>
          All data is stored within the EU (database in Frankfurt, Germany). We share data
          with Stripe (payments) and our email provider for receipts, both with a data
          processing agreement (DPA) in place. Stripe&apos;s DPA is available via the Stripe
          dashboard and has been accepted by us.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You have the right to request an extract, correction, or deletion of your data
          (&quot;the right to be forgotten&quot;). Contact{" "}
          <a href={`mailto:${supportEmail}`} className="underline hover:text-foreground">
            {supportEmail}
          </a>{" "}
          to exercise your rights. You also have the right to file a complaint with the
          Swedish Authority for Privacy Protection (IMY).
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          See our separate{" "}
          <Link href="/cookies" className="underline hover:text-foreground">
            cookie policy
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
