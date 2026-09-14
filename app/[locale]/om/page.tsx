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

      <AboutSv />

      <Link
        href="/buda"
        className="mt-8 inline-block rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:brightness-110 transition"
      >
        Ta din plats
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

function AboutSv() {
  return (
    <>
      <p className="mt-4 text-sm text-muted">
        StreamTopp är en topplista för livestreamers där platsen man syns på avgörs av ett
        enda mått: vem som är villig att betala mest för den. Ingen prenumeration, inget
        algoritm-lotteri — bara ett fast pris för att gå om den som ligger etta just nu och
        synas för fler tittare.
      </p>

      <Section title="Hur det funkar">
        <p>
          Du väljer vilken plats du vill ha. Vi räknar ut vad det kostar att gå om den som
          ligger där idag (minst 5 % eller 50 kr mer, det som är störst). Du betalar, och din
          kanal är synlig högst upp direkt — ingen granskning, ingen väntetid.
        </p>
        <p>
          Vem som helst kan sedan buda över dig. Det finns ingen &quot;ägd&quot; plats — bara
          den streamer som senast betalade mest.
        </p>
      </Section>

      <Section title="Varför livestreamers">
        <p>
          Att synas är svårt när plattformarnas algoritmer avgör vem som hamnar överst. Genom
          att hålla oss till livestreaming blir listan relevant för en publik som aktivt
          letar efter nya kanaler att kolla in — oavsett om du streamar på Twitch, YouTube,
          Kick eller TikTok.
        </p>
      </Section>

      <Section title="Vem ligger bakom">
        <p>
          StreamTopp drivs som ett litet, privat sidoprojekt — inte av ett registrerat bolag.
          Se{" "}
          <Link href="/kontakt" className="underline hover:text-foreground">
            kontaktsidan
          </Link>{" "}
          för att höra av dig, eller{" "}
          <Link href="/villkor" className="underline hover:text-foreground">
            villkoren
          </Link>{" "}
          för hur listningar och betalningar fungerar i detalj.
        </p>
      </Section>
    </>
  );
}
