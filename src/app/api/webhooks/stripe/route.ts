
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook signature or configuration." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Signature verification requires the original, unmodified body.
    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type !== "payment_intent.succeeded") {
    return NextResponse.json({ received: true });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  try {
    if (
      paymentIntent.status !== "succeeded" ||
      paymentIntent.amount_received !== paymentIntent.amount
    ) {
      throw new Error("PaymentIntent is not fully paid.");
    }

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

    if (
      paymentIntent.metadata.checkoutId !== checkout.id ||
      paymentIntent.metadata.userId !== checkout.userId ||
      paymentIntent.metadata.competitionId !== checkout.competitionId
    ) {
      throw new Error("PaymentIntent metadata does not match checkout.");
    }

    if (
      paymentIntent.amount !== checkout.expectedAmountPence ||
      paymentIntent.currency.toLowerCase() !==
        checkout.currency.toLowerCase()
    ) {
      throw new Error("Payment amount or currency mismatch.");
    }

    if (
      checkout.bookTitles.length < 1 ||
      checkout.bookTitles.length > 6 ||
      checkout.bookTitles.some(
        (title) => !title.trim() || title.length > 255
      )
    ) {
      throw new Error("Invalid book titles stored in checkout.");
    }

    const result = await prisma.$transaction(async (tx) => {
      // Only one webhook invocation can claim a pending checkout.
      const claimed = await tx.pendingCheckout.updateMany({
        where: {
          id: checkout.id,
          status: "PENDING",
        },
        data: {
          status: "PAID",
        },
      });

      if (claimed.count === 0) {
        const existing = await tx.pendingCheckout.findUnique({
          where: { id: checkout.id },
          include: { submission: true },
        });

        if (
          existing?.status === "PAID" &&
          existing.submission
        ) {
          return { alreadyProcessed: true };
        }

        throw new Error(
          "Checkout is not pending or has an incomplete submission."
        );
      }

      const referenceBase = `MAYA-${checkout.createdAt.getUTCFullYear()}-${checkout.id.replace(/-/g, "").slice(0, 16).toUpperCase()}`;

      const submission = await tx.submission.create({
        data: {
          competitionId: checkout.competitionId,
          entrantId: checkout.userId,
          pendingCheckoutId: checkout.id,
          title: "Poetic Poems Entry",
          books: {
            create: checkout.bookTitles.map((title, index) => ({
              title: title.trim(),
              reference: `${referenceBase}-${String(index + 1).padStart(2, "0")}`,
              status: "SUBMITTED",
            })),
          },
        },
      });

      return {
        alreadyProcessed: false,
        submissionId: submission.id,
      };
    });

    console.info("Stripe payment processed:", {
      paymentIntentId: paymentIntent.id,
      checkoutId: checkout.id,
      ...result,
    });

    return NextResponse.json({
      received: true,
      ...result,
    });
  } catch (error) {
    console.error("Stripe payment processing failed:", error);

    // A non-2xx response tells Stripe to retry delivery.
    return NextResponse.json(
      { error: "Payment processing failed." },
      { status: 500 }
    );
  }
}
