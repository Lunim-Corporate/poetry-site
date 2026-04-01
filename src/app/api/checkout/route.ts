import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/prismicio";
import { DEFAULT_PRICE_SINGLE, DEFAULT_PRICE_MULTIPLE } from "@/app/enter/constants";
import { upsertIncompleteEntry } from "@/lib/googleSheets";

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
    const { name, email, phone, token, rulesConfirmed, bookCount, bookTitles } = body as {
      name: string;
      email: string;
      phone?: string;
      token?: string;
      rulesConfirmed?: boolean;
      bookCount: number;
      bookTitles?: string[];
    };

    if (!name || !email || !token || !bookCount || bookCount < 1 || bookCount > 6) {
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

    await upsertIncompleteEntry({
      token: token.trim(),
      rulesConfirmed: Boolean(rulesConfirmed),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() ?? "",
      quantity: bookCount,
      priceGBP: totalGBP,
      bookTitles: (bookTitles ?? []).map((t) => t.trim()),
    });

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount: totalGBP * 100, // Stripe uses pence
      currency: "gbp",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
      metadata: {
        entrant_name: name.trim(),
        entrant_email: email.trim(),
        entrant_phone: phone?.trim() ?? "",
        entry_token: token?.trim() ?? "",
        book_count: String(bookCount),
        total_gbp: String(totalGBP),
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error("Stripe payment intent error:", err);
    return NextResponse.json(
      { error: "Failed to create payment intent." },
      { status: 500 }
    );
  }
}
