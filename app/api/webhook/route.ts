import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { splitVatInclusive } from "@/lib/format";
import { sendReceiptEmail } from "@/lib/receipt";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "payment_intent.payment_failed"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await prisma.bid
        .updateMany({
          where: { stripeSessionId: session.id, status: "PENDING" },
          data: { status: "FAILED" },
        })
        .catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const bid = await prisma.bid.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!bid || bid.status === "PAID") return;

  const metadata = session.metadata ?? {};
  const streamer = await prisma.streamer.findUnique({
    where: { id: bid.streamerId },
  });
  if (!streamer) return;

  const newCurrentBid = Math.max(streamer.currentBid, bid.amount);

  await prisma.$transaction([
    prisma.bid.update({
      where: { id: bid.id },
      data: { status: "PAID" },
    }),
    prisma.streamer.update({
      where: { id: streamer.id },
      data: {
        status: "PAID",
        currentBid: newCurrentBid,
        name: metadata.name || streamer.name,
        platform: metadata.platform || streamer.platform,
        description: metadata.description || streamer.description,
        category: metadata.category || streamer.category,
        imageUrl: metadata.imageUrl || streamer.imageUrl,
        vatNumber: metadata.vatNumber || streamer.vatNumber,
      },
    }),
  ]);

  const { exVatOre, vatOre, totalOre } = splitVatInclusive(bid.amount);
  const email = metadata.email || streamer.email;

  await sendReceiptEmail({
    to: email,
    streamerName: metadata.name || streamer.name,
    totalOre,
    exVatOre,
    vatOre,
    vatNumber: metadata.vatNumber || streamer.vatNumber,
  }).catch((err) => console.error("Kunde inte skicka kvitto", err));
}
