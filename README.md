# StreamerBid — a paid leaderboard for livestreamers (outbid.lol clone)

A "pay-to-rank" leaderboard for livestreamers. Streamers pay to be seen at the top; anyone
can outbid whoever's currently #1. Built with Next.js (App Router), Prisma, PostgreSQL on
Supabase, and Stripe (card, Swish, Klarna).

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- next-intl for i18n (currently English-only; add another locale in `i18n/routing.ts`)
- Prisma 7 (driver adapters) against PostgreSQL on Supabase
- Stripe Checkout (hosted) with card, Swish, and Klarna, in SEK
- Resend for receipt emails (optional)

## Getting started locally

```bash
npm install
```

### 1. The database (Supabase)

This project needs its own Supabase project (separate from any other Outbid clones).

1. Create a new project at [supabase.com](https://supabase.com/dashboard) — pick region
   **eu-central-1 (Frankfurt)** for EU data residency.
2. Go to **Project Settings → Database → Connection string** and grab:
   - **Connection pooling** (port `6543`, Supavisor "Transaction" mode) → this becomes
     `DATABASE_URL` (what the app uses at runtime).
   - **Session pooler** (port `5432` via `pooler.supabase.com`) → this becomes `DIRECT_URL`
     (what the Prisma CLI uses for migrations). The "real" direct connection
     (`db.<ref>.supabase.co:5432`) requires IPv6 and is often unreachable locally/in CI, so
     the session pooler is used as the default in this project instead.
3. Create a **Storage bucket** named `streamer-images` (public) for uploaded profile
   pictures/logos, and grab your **anon key** under **Project Settings → API**.

Copy `.env.example` to `.env` and fill in the project ref/password/keys:

```bash
cp .env.example .env
```

Then run the migrations against your new database:

```bash
npm run db:migrate
npm run db:generate
```

Want to seed some local demo data (four example streamers)?

```bash
npm run db:seed
```

Future schema changes are made as usual with:

```bash
npm run db:migrate -- --name your_migration
```

### 2. Stripe

1. Create an account at [stripe.com](https://stripe.com) if you don't already have one.
2. Grab test keys under **Developers → API keys** and fill in `.env`:
   - `STRIPE_SECRET_KEY` (sk_test_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
3. Enable **Swish** and **Klarna** as payment methods: **Settings → Payment methods** in the
   Stripe Dashboard, find Swish and Klarna and turn them on (Swish requires a Swedish
   bankgiro number/Stripe agreement for production — in test mode it works right away).
4. Accept Stripe's **Data Processing Agreement (DPA)** under **Settings → Compliance** —
   this is referenced in the privacy policy.
5. Webhook (locally): install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

   Paste the `whsec_...` key it prints into `STRIPE_WEBHOOK_SECRET` in `.env`.

6. In production: create a webhook endpoint in the Stripe Dashboard pointing at
   `https://your-domain.com/api/webhook`, listening for `checkout.session.completed`,
   `checkout.session.expired`, and `payment_intent.payment_failed`, and set its signing
   secret as `STRIPE_WEBHOOK_SECRET` in Vercel.

### 3. Receipt emails (optional but recommended)

Create an account at [resend.com](https://resend.com), verify your sending domain, and fill in:

- `RESEND_API_KEY`
- `RECEIPT_FROM_EMAIL` (e.g. `receipts@yourdomain.com`)

If these are left blank, no receipt is sent, but the payment/listing still works — it just
logs a warning in the server log.

### 4. Contact

Fill in `.env`:

```
SUPPORT_EMAIL=
```

Shown in the footer, on the contact page, and in the terms/privacy policy.

**Note:** If you start taking real payments (Stripe live mode, not test mode) as a recurring
income source, Skatteverket (the Swedish Tax Agency) usually treats that as business
activity, which in Sweden normally requires registering at least a sole proprietorship
(free and quick via Bolagsverket). No rush while Stripe is in test mode, but worth knowing
before you take real money.

### 5. Admin

Set a strong password in `ADMIN_PASSWORD`. The admin panel is available at `/admin` and lets
you reject (hide) inappropriate listings, reactivate them, and permanently delete them
("right to be forgotten" under GDPR).

### 6. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Create a new Vercel project from this repo.
2. Set the region to **arn1 (Stockholm)** under **Settings → Functions → Region**.
3. Add all the variables from `.env` in **Settings → Environment Variables** (use real
   Stripe **live** keys and a strong `ADMIN_PASSWORD` in production).
4. Set `NEXT_PUBLIC_BASE_URL` to your real domain.
5. Deploy. Don't forget to add the production webhook endpoint in Stripe (step 2.6 above).

## Legal considerations before launch

This codebase includes a starting draft of terms, a privacy policy, and withdrawal-right
handling under Swedish distance-selling law and GDPR, but **this is not legal advice**. Have
a lawyer review the terms, VAT handling (especially if you sell to customers in multiple EU
countries and need to register for OSS/One Stop Shop), and GDPR procedures before charging
real customers.

## Project structure

```
app/
  [locale]/            # Localized pages: leaderboard, channel page, bid flow,
                        # thanks page, terms, privacy policy, cookies, contact
  admin/                # Password-protected admin panel (not localized)
  go/[id]/              # Click tracking + redirect to the external channel link
  api/checkout/         # Creates a Stripe Checkout Session
  api/webhook/          # Stripe webhook (signature verification, updates DB, sends receipt)
prisma/
  schema.prisma
  seed.ts
lib/
  prisma.ts             # Prisma Client with the pg driver adapter (Prisma 7)
  stripe.ts
  format.ts             # SEK formatting, VAT split, minimum-bid calculation
  categories.ts          # Content categories (Gaming, Just Chatting, IRL, ...)
  platforms.ts           # Streaming platforms (Twitch, YouTube, Kick, TikTok, ...)
  admin-auth.ts
i18n/                    # next-intl routing/config
messages/                # en.json
```

## Minimum bid increment

The next bid must be at least `MIN_BID_INCREMENT_ORE` öre higher than the current bid, never
below Stripe's minimum charge for a SEK payment, configurable in `.env`. Default: 1 kr.
