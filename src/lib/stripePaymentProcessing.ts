
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function processSuccessfulStripePayment(
  paymentIntent: Stripe.PaymentIntent
) {
  // 1. Verify that Stripe confirms full payment
  if (
    paymentIntent.status !== "succeeded" ||
    paymentIntent.amount_received !== paymentIntent.amount
  ) {
    throw new Error("PaymentIntent is not fully paid.");
  }

  // 2. Find the corresponding checkout
  const checkout = await prisma.pendingCheckout.findUnique({
    where: {
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  if (!checkout) {
    throw new Error(
      `No checkout found for PaymentIntent ${paymentIntent.id}`
    );
  }

  // 3. Verify Stripe metadata against PostgreSQL
  if (
    paymentIntent.metadata.maya_checkout_id !== checkout.id ||
    paymentIntent.metadata.maya_user_id !== checkout.userId ||
    paymentIntent.metadata.competition_id !== checkout.competitionId
  ) {
    throw new Error("PaymentIntent metadata does not match checkout.");
  }

  // 4. Verify the expected payment amount and currency
  if (
    paymentIntent.amount !== checkout.expectedAmountPence ||
    paymentIntent.currency.toLowerCase() !==
      checkout.currency.toLowerCase()
  ) {
    throw new Error("Payment amount or currency mismatch.");
  }

  // 5. Validate the stored book titles
  if (
    checkout.bookTitles.length < 1 ||
    checkout.bookTitles.length > 6 ||
    checkout.bookTitles.some(
      (title) => !title.trim() || title.length > 255
    )
  ) {
    throw new Error("Invalid book titles stored in checkout.");
  }

  // 6. Atomically register the paid competition entry
  const result = await prisma.$transaction(async (tx) => {
    const claimed = await tx.pendingCheckout.updateMany({
      where: {
        id: checkout.id,
        status: "PENDING",
      },
      data: {
        status: "PAID",
      },
    });

    // Handle repeated webhook events safely
    if (claimed.count === 0) {
      const existing = await tx.pendingCheckout.findUnique({
        where: { id: checkout.id },
        include: { submission: true },
      });

      if (existing?.status === "PAID" && existing.submission) {
        await tx.paymentFulfillment.upsert({
          where: { checkoutId: checkout.id },
          update: {},
          create: { checkoutId: checkout.id },
        });

        return {
          alreadyProcessed: true,
          submissionId: existing.submission.id,
        };
      }

      throw new Error(
        "Checkout is not pending or has an incomplete submission."
      );
    }

    const referenceBase =
      `MAYA-${checkout.createdAt.getUTCFullYear()}-` +
      checkout.id.replace(/-/g, "").slice(0, 16).toUpperCase();

    const submission = await tx.submission.create({
      data: {
        competitionId: checkout.competitionId,
        entrantId: checkout.userId,
        pendingCheckoutId: checkout.id,
        title: "Poetic Poems Entry",
        books: {
          create: checkout.bookTitles.map((title, index) => ({
            title: title.trim(),
            reference:
              `${referenceBase}-${String(index + 1).padStart(2, "0")}`,
            status: "SUBMITTED",
          })),
        },
      },
    });

    await tx.paymentFulfillment.create({
      data: {
        checkoutId: checkout.id,
      },
    });

    return {
      alreadyProcessed: false,
      submissionId: submission.id,
    };
  });

  return {
    paymentIntentId: paymentIntent.id,
    checkoutId: checkout.id,
    ...result,
  };
}
