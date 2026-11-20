
import "dotenv/config";
import Stripe from "stripe";

import { processSuccessfulStripePayment } from "../src/lib/stripePaymentProcessing";

async function main() {
  const paymentIntentId = process.argv[2];

  if (!paymentIntentId || !paymentIntentId.startsWith("pi_")) {
    throw new Error(
      "Usage: npx tsx scripts/recoverStripePayment.ts <payment_intent_id>"
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
  });

  // Retrieve the payment directly from Stripe.
  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentIntentId
  );

  // This recovery script is intended for sandbox testing.
  if (paymentIntent.livemode) {
    throw new Error(
      "Live payments cannot be processed using this recovery script."
    );
  }

  console.log("Verified Stripe payment:", {
    id: paymentIntent.id,
    status: paymentIntent.status,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });

  // Reuse the webhook's verified fulfillment logic.
  const result = await processSuccessfulStripePayment(
    paymentIntent
  );

  console.log("Payment recovery result:", result);
}

main()
  .catch((error) => {
    console.error("Payment recovery failed:", error);
    process.exitCode = 1;
  });
