import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/prismicio";
import { DEFAULT_PRICE_SINGLE, DEFAULT_PRICE_MULTIPLE } from "@/app/enter/constants";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

function calculateTotal(
  bookCount: number,
  priceSingle: number,
  priceMultiple: number
): number {
  if (bookCount < 1 || bookCount > 6) return 0;
  return bookCount === 1 ? priceSingle : priceMultiple * bookCount;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bookCount } = body as {
      name: string;
      email: string;
      bookCount: number;
    };

    if (!name || !email || !bookCount || bookCount < 1 || bookCount > 6) {
      return NextResponse.json(
        { error: "Invalid entry details." },
        { status: 400 }
      );
    }

    // Fetch pricing from Prismic (with fallback defaults)
    const client = createClient();
    const doc = await client.getSingle("enter_page").catch(() => null);
    const data = (doc?.data ?? {}) as Record<string, unknown>;
    const priceSingle = (data.price_single_book as number) ?? DEFAULT_PRICE_SINGLE;
    const priceMultiple = (data.price_multiple_books as number) ?? DEFAULT_PRICE_MULTIPLE;

    const totalGBP = calculateTotal(bookCount, priceSingle, priceMultiple);
    if (totalGBP <= 0) {
      return NextResponse.json(
        { error: "Could not calculate price." },
        { status: 400 }
      );
    }

    const origin = request.nextUrl.origin;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Poetry Book Award Entry (${bookCount} ${bookCount === 1 ? "book" : "books"})`,
              description: `Competition entry for ${name}`,
            },
            unit_amount: totalGBP * 100, // Stripe uses pence
          },
          quantity: 1,
        },
      ],
      metadata: {
        entrant_name: name,
        entrant_email: email,
        book_count: String(bookCount),
        total_gbp: String(totalGBP),
      },
      success_url: `${origin}/enter/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/enter?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
