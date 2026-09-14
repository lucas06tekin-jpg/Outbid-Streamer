import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("about") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("about")}
      </h1>

      <AboutContent />

      <Link
        href="/bid"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
      >
        Take your spot
      </Link>
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

function AboutContent() {
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        StreamerBid is a leaderboard for livestreamers where the spot you&apos;re seen at comes
        down to one thing: who&apos;s willing to pay the most for it. No subscription, no
        algorithm lottery — just a flat price to overtake whoever&apos;s #1 right now and get
        seen by more viewers.
      </p>

      <Section title="How it works">
        <p>
          You pick the spot you want. We work out what it costs to overtake whoever holds it
          today (at least 5% or 50 kr more, whichever is higher). You pay, and your channel is
          visible at the top immediately — no review, no waiting.
        </p>
        <p>
          Anyone can then outbid you. There&apos;s no &quot;owned&quot; spot — just whichever
          streamer most recently paid the most.
        </p>
      </Section>

      <Section title="Why livestreamers">
        <p>
          Getting seen is hard when platform algorithms decide who rises to the top. By
          sticking to livestreaming, the list stays relevant for an audience actively looking
          for new channels to check out — whether you stream on Twitch, YouTube, Kick or
          TikTok.
        </p>
      </Section>

      <Section title="Who's behind this">
        <p>
          StreamerBid is run as a small, private side project — not a registered company. See
          the{" "}
          <Link href="/contact" className="underline hover:text-foreground">
            contact page
          </Link>{" "}
          to reach out, or the{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            terms
          </Link>{" "}
          for the details on how listings and payments work.
        </p>
      </Section>
    </>
  );
}
