import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { processSuccessfulStripePayment } from "@/lib/stripePaymentProcessing";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1. Check webhook configuration
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      {
        error: "Missing webhook signature or configuration.",
      },
      { status: 400 }
    );
  }

  // 2. Verify that the event genuinely came from Stripe
  let event: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-01-28.clover",
    });

    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook verification failed:",
      error
    );

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  // 3. Ignore event types we are not processing
  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({
      received: true,
    });
  }

  // 4. Process successful payment
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  try {
    const result = await processSuccessfulStripePayment(
      paymentIntent
    );

    console.info("Stripe payment processed:", result);

    return NextResponse.json({
      received: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Stripe payment processing failed:",
      error
    );

    // Return 500 so Stripe knows processing was unsuccessful.
    return NextResponse.json(
      {
        error: "Payment processing failed.",
      },
      { status: 500 }
    );
  }
}
