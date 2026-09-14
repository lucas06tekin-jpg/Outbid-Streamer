import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { bidSchema } from "@/lib/validation";
import { minNextBid, krToOre } from "@/lib/format";
import { slugify, randomSuffix } from "@/lib/slug";

const INCREMENT_ORE = Number(process.env.MIN_BID_INCREMENT_ORE ?? 100);

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bidSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const bidOre = krToOre(input.bidKr);

  let streamer = await prisma.streamer.findFirst({
    where: input.slug ? { slug: input.slug } : { url: input.url },
  });

  const currentBid = streamer?.currentBid ?? 0;
  const minBid = minNextBid(currentBid, INCREMENT_ORE);

  if (bidOre < minBid) {
    return NextResponse.json(
      { error: "bid_too_low", minBidOre: minBid },
      { status: 409 }
    );
  }

  if (!streamer) {
    let slug = slugify(input.name);
    let attempt = 0;
    while (await prisma.streamer.findUnique({ where: { slug } })) {
      attempt += 1;
      slug = `${slugify(input.name)}-${randomSuffix(4)}`;
      if (attempt > 5) break;
    }

    streamer = await prisma.streamer.create({
      data: {
        slug,
        name: input.name,
        platform: input.platform,
        url: input.url,
        description: input.description,
        category: input.category,
        imageUrl: input.imageUrl || null,
        email: input.email,
        vatNumber: input.vatNumber || null,
        status: "PENDING",
        currentBid: 0,
      },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // Betalmetoder styrs via Stripe Dashboard -> Settings -> Payment methods,
    // inte hårdkodat här. Om Swish/Klarna inte är aktiverat i dashboarden
    // skulle en explicit payment_method_types-lista göra hela anropet ogiltigt.
    customer_email: input.email,
    line_items: [
      {
        price_data: {
          currency: "sek",
          unit_amount: bidOre,
          product_data: {
            name: `Topplista: ${input.name}`,
            description: "Plats på topplistan (inkl. 25% moms)",
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/tack?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/buda?canceled=1`,
    metadata: {
      streamerId: streamer.id,
      name: input.name,
      platform: input.platform,
      description: input.description,
      category: input.category,
      imageUrl: input.imageUrl || "",
      vatNumber: input.vatNumber || "",
      email: input.email,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "stripe_error" }, { status: 500 });
  }

  await prisma.bid.create({
    data: {
      streamerId: streamer.id,
      amount: bidOre,
      stripeSessionId: session.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ url: session.url });
}
