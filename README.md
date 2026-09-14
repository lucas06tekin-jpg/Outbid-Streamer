# StreamTopp — betald leaderboard för livestreamers (outbid.lol-klon)

En svensk/europeisk "pay-to-rank"-leaderboard för livestreamers. Streamers betalar för att
synas högst upp; vem som helst kan buda över nuvarande etta. Byggd med Next.js (App Router),
Prisma, PostgreSQL på Supabase och Stripe (kort, Swish, Klarna).

## Teknikstack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- next-intl för svenska/engelska (svenska är standard, `/en/...` för engelska)
- Prisma 7 (driver adapters) mot PostgreSQL på Supabase
- Stripe Checkout (hosted) med kort, Swish och Klarna, i SEK
- Resend för kvitto-e-post (valfritt)

## Kom igång lokalt

```bash
npm install
```

### 1. Databasen (Supabase)

Detta projekt behöver ett eget Supabase-projekt (skilt från ev. andra Outbid-kloner).

1. Skapa ett nytt projekt på [supabase.com](https://supabase.com/dashboard) — välj gärna
   region **eu-central-1 (Frankfurt)** för EU-datalagring.
2. Gå till **Project Settings → Database → Connection string** och hämta:
   - **Connection pooling** (port `6543`, Supavisor "Transaction" mode) → detta blir
     `DATABASE_URL` (det appen använder i körtid).
   - **Session pooler** (port `5432` via `pooler.supabase.com`) → detta blir `DIRECT_URL`
     (det Prisma CLI använder för migrations). Den "riktiga" direktanslutningen
     (`db.<ref>.supabase.co:5432`) kräver IPv6 och är ofta oåtkomlig lokalt/i CI, så
     session-poolern används istället som standard i detta projekt.
3. Skapa en **Storage bucket** som heter `streamer-images` (public) för uppladdade
   profilbilder/loggor, och hämta din **anon key** under **Project Settings → API**.

Kopiera `.env.example` till `.env` och fyll i projekt-ref/lösenord/nycklar:

```bash
cp .env.example .env
```

Kör sedan migrationerna mot din nya databas:

```bash
npm run db:migrate
npm run db:generate
```

Vill du seeda lite demodata lokalt (fyra exempel-streamers):

```bash
npm run db:seed
```

Framtida schemaändringar görs som vanligt med:

```bash
npm run db:migrate -- --name din_migration
```

### 2. Stripe

1. Skapa ett konto på [stripe.com](https://stripe.com) om du inte redan har ett.
2. Hämta test-nycklar under **Developers → API keys** och fyll i `.env`:
   - `STRIPE_SECRET_KEY` (sk_test_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
3. Aktivera **Swish** och **Klarna** som betalmetoder: **Settings → Payment methods** i
   Stripe Dashboard, sök upp Swish och Klarna och slå på dem (Swish kräver ett svenskt
   bankgironummer/Stripe-avtal för produktion — i test-läge fungerar det direkt).
4. Godkänn Stripes **Data Processing Agreement (DPA)** under **Settings → Compliance** —
   detta nämns i integritetspolicyn.
5. Webhook (lokalt): installera [Stripe CLI](https://stripe.com/docs/stripe-cli) och kör:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   Klistra in den `whsec_...`-nyckel som skrivs ut i `STRIPE_WEBHOOK_SECRET` i `.env`.

6. I produktion: skapa en webhook-endpoint i Stripe Dashboard som pekar mot
   `https://din-domän.se/api/webhook`, lyssnar på `checkout.session.completed`,
   `checkout.session.expired` och `payment_intent.payment_failed`, och lägg
   dess signeringsnyckel som `STRIPE_WEBHOOK_SECRET` i Vercel.

### 3. Kvitto-e-post (valfritt men rekommenderat)

Skapa ett konto på [resend.com](https://resend.com), verifiera din avsändardomän, och fyll i:

- `RESEND_API_KEY`
- `RECEIPT_FROM_EMAIL` (t.ex. `kvitto@dindomän.se`)

Om dessa lämnas tomma skickas inget kvitto, men betalningen/listningen fungerar ändå —
det loggas bara en varning i serverloggen.

### 4. Kontakt

Fyll i i `.env`:

```
SUPPORT_EMAIL=
```

Visas i footer, på kontaktsidan och i villkor/integritetspolicy.

**Obs:** Om du börjar ta betalt på riktigt (Stripe live-läge, inte test-läge) som en
regelbunden inkomstkälla räknar Skatteverket det oftast som näringsverksamhet, vilket i
Sverige normalt kräver att du registrerar dig som minst enskild firma (gratis och snabbt
via Bolagsverket). Inte bråttom så länge Stripe står i test-läge, men värt att känna till
innan ni tar riktiga pengar.

### 5. Admin

Sätt ett starkt lösenord i `ADMIN_PASSWORD`. Adminpanelen nås på `/admin` och låter dig
avvisa (dölja) olämpliga listningar, återaktivera dem, samt radera dem permanent
("rätt att bli glömd" enligt GDPR).

### 6. Starta appen

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Deploy till Vercel

1. Skapa ett nytt Vercel-projekt från detta repo.
2. Sätt regionen till **arn1 (Stockholm)** under **Settings → Functions → Region**.
3. Lägg till samtliga variabler från `.env` i **Settings → Environment Variables**
   (använd riktiga Stripe **live**-nycklar och en stark `ADMIN_PASSWORD` i produktion).
4. Sätt `NEXT_PUBLIC_BASE_URL` till din riktiga domän.
5. Deploya. Glöm inte att lägga till produktionens webhook-endpoint i Stripe (steg 2.6 ovan).

## Juridiskt att tänka på innan lansering

Denna kodbas innehåller ett startförslag på villkor, integritetspolicy och
ångerrätts-hantering enligt svensk distansavtalslag och GDPR, men **är inte juridisk
rådgivning**. Låt en jurist granska villkoren, momshanteringen (särskilt om ni säljer
till kunder i flera EU-länder och behöver registrera er för OSS/One Stop Shop) och
GDPR-rutinerna innan ni tar betalt av riktiga kunder.

## Projektstruktur

```
app/
  [locale]/            # Lokaliserade sidor (sv/en): topplista, kanalsida, buda-flöde,
                        # tack-sida, villkor, integritetspolicy, cookies, kontakt
  admin/                # Lösenordsskyddad adminpanel (ej lokaliserad)
  go/[id]/              # Klickspårning + redirect till extern kanallänk
  api/checkout/         # Skapar Stripe Checkout Session
  api/webhook/          # Stripe-webhook (signaturverifiering, uppdaterar DB, skickar kvitto)
prisma/
  schema.prisma
  seed.ts
lib/
  prisma.ts             # Prisma Client med pg driver-adapter (Prisma 7)
  stripe.ts
  format.ts             # SEK-formatering, moms-uppdelning, min-budsberäkning
  categories.ts          # Innehållskategorier (Gaming, Just Chatting, IRL, ...)
  platforms.ts           # Streamingplattformar (Twitch, YouTube, Kick, TikTok, ...)
  admin-auth.ts
i18n/                    # next-intl routing/config
messages/                # sv.json / en.json
```

## Min budökning

Nästa bud måste vara minst `MIN_BID_INCREMENT_ORE` öre högre än nuvarande bud, aldrig under
Stripes minimigräns för en SEK-betalning, konfigurerbart i `.env`. Standard: 1 kr.
