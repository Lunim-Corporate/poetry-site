import { NextRequest, NextResponse, after } from "next/server";
import { Prisma } from "@prisma/client";
import Stripe from "stripe";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/prismicio";
import {
  DEFAULT_PRICE_SINGLE,
  DEFAULT_PRICE_MULTIPLE,
} from "@/app/enter/constants";
import { upsertIncompleteEntry } from "@/lib/googleSheets";

export const runtime = "nodejs";

const checkoutSchema = z
  .object({
    name: z.string().trim().min(1).max(255),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(50).optional(),
    token: z.string().trim().min(1).max(100),
    rulesConfirmed: z.literal(true),
    bookCount: z.number().int().min(1).max(6),
    bookTitles: z.array(z.string().trim().min(1).max(255)).min(1).max(6),
  })
  .refine((data) => data.bookTitles.length === data.bookCount, {
    message: "Book count must match the supplied titles.",
    path: ["bookTitles"],
  });
import { parseFullName, upsertSubscriber } from "@/lib/sequenzy";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

function calculateTotal(
  bookCount: number,
  priceSingle: number,
  priceMultiple: number,
): number {
  return bookCount === 1 ? priceSingle : priceMultiple * bookCount;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      token,
      rulesConfirmed,
      bookCount,
      bookTitles,
      newsletter,
    } = body as {
      name: string;
      email: string;
      phone?: string;
      token?: string;
      rulesConfirmed?: boolean;
      bookCount: number;
      bookTitles?: string[];
      newsletter?: boolean;
    };
    const wantsNewsletter = Boolean(newsletter);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid entry details.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, phone, token, bookCount, bookTitles } = parsed.data;

    const normalizedEmail = email.toLowerCase();

    // 2. Retrieve the competition
    const competition = await prisma.competition.findFirst({
      where: {
        name: {
          equals: "Poetic Poems",
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!competition) {
      return NextResponse.json(
        { error: "Competition not found." },
        { status: 404 },
      );
    }

    // Dates are stored as PostgreSQL DATE values.
    // Compare UTC calendar dates, not timestamps.
    // Confirm the competition's intended timezone
    // before deploying this rule to production.
    const today = new Date().toISOString().slice(0, 10);
    const opening = competition.startDate.toISOString().slice(0, 10);
    const closing = competition.endDate.toISOString().slice(0, 10);

    if (today < opening || today > closing) {
      return NextResponse.json(
        { error: "Competition entries are currently closed." },
        { status: 403 },
      );
    }

    // 3. Retrieve pricing from Prismic
    const client = createClient();
    const doc = await client.getSingle("enter_page").catch(() => null);

    const data = (doc?.data ?? {}) as Record<string, unknown>;

    const priceSingle = data.price_single_book ?? DEFAULT_PRICE_SINGLE;

    const priceMultiple = data.price_multiple_books ?? DEFAULT_PRICE_MULTIPLE;

    if (
      typeof priceSingle !== "number" ||
      typeof priceMultiple !== "number" ||
      !Number.isFinite(priceSingle) ||
      !Number.isFinite(priceMultiple)
    ) {
      return NextResponse.json(
        { error: "Invalid competition pricing." },
        { status: 500 },
      );
    }

    const totalGBP = calculateTotal(bookCount, priceSingle, priceMultiple);

    const amountPence = Math.round(totalGBP * 100);

    if (!Number.isSafeInteger(amountPence) || amountPence <= 0) {
      return NextResponse.json(
        { error: "Could not calculate entry price." },
        { status: 400 },
      );
    }

    // 4. Resolve authenticated user or guest account
    const session = await auth();
    const authenticatedUserId = session?.user?.id;

    let user;

    if (authenticatedUserId) {
      user = await prisma.user.findUnique({
        where: { id: authenticatedUserId },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Authenticated account not found." },
          { status: 401 },
        );
      }

      // The submitted email must match the logged-in account.
      if (user.email.toLowerCase() !== normalizedEmail) {
        return NextResponse.json(
          { error: "Please use your account email." },
          { status: 400 },
        );
      }
    } else {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        try {
          user = await prisma.user.create({
            data: {
              name,
              email: normalizedEmail,
              phoneNumber: phone || null,
              passwordHash: null,
              isGhost: true,
              role: "ENTRANT",
            },
          });
        } catch (error) {
          // Handle simultaneous checkouts using the same email.
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            user = await prisma.user.findUnique({
              where: { email: normalizedEmail },
            });
          } else {
            throw error;
          }
        }
      }
    }

    if (!user) {
      throw new Error("Could not resolve entrant account.");
    }

    // 5. Create the pending checkout
    const checkout = await prisma.pendingCheckout.create({
      data: {
        userId: user.id,
        competitionId: competition.id,
        entryToken: token,
        bookTitles,
        expectedAmountPence: amountPence,
        currency: "gbp",
        status: "PENDING",
      },
    });

    // 6. Create or reuse Stripe customer
    const stripe = getStripe();

    // Only reuse an existing Stripe customer when
    // the visitor is authenticated.
    let customerId: string | undefined = authenticatedUserId
      ? (user.stripeCustomerId ?? undefined)
      : undefined;

    // A newly created ghost account has no existing
    // customer. Create one for this checkout.
    // Existing guest emails are deliberately not given
    // access to the account's saved Stripe customer.
    if (!customerId && user.isGhost && !user.stripeCustomerId) {
      const customer = await stripe.customers.create(
        {
          name,
          email: normalizedEmail,
          phone: phone || undefined,
          metadata: {
            maya_user_id: user.id,
          },
        },
        {
          idempotencyKey: `maya-customer-${user.id}`,
        },
      );

      customerId = customer.id;

      await prisma.user.updateMany({
        where: {
          id: user.id,
          stripeCustomerId: null,
        },
        data: {
          stripeCustomerId: customerId,
        },
      });
    }

    // 7. Prepare Stripe metadata
    const metadata: Record<string, string> = {
      maya_checkout_id: checkout.id,
      maya_user_id: user.id,
      competition_id: competition.id,
      entrant_name: name,
      entrant_email: normalizedEmail,
      entrant_phone: phone || "",
      entry_token: token,
      book_count: String(bookCount),
      total_gbp: totalGBP.toFixed(2),
    };

    bookTitles.forEach((title, index) => {
      metadata[`book_title_${index + 1}`] = title;
    });

    const titlesJson = JSON.stringify(bookTitles);

    if (titlesJson.length <= 500) {
      metadata.book_titles_json = titlesJson;
    }

    // 8. Create the Stripe PaymentIntent
    const intent = await stripe.paymentIntents.create(
      {
        amount: amountPence,
        currency: "gbp",
        receipt_email: normalizedEmail,
        ...(customerId ? { customer: customerId } : {}),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      },
      {
        idempotencyKey: `maya-checkout-${checkout.id}`,
      },
    );

    // 9. Link Stripe payment to PostgreSQL checkout
    await prisma.pendingCheckout.update({
      where: { id: checkout.id },
      data: {
        stripePaymentIntentId: intent.id,
      },
    });

    // 10. Preserve existing Google Sheets integration
    const sheetPayload = {
      token,
      rulesConfirmed: true,
      name,
      email: normalizedEmail,
      phone: phone || "",
      quantity: bookCount,
      priceGBP: totalGBP,
      bookTitles,
    };

    after(async () => {
      try {
        await upsertIncompleteEntry(sheetPayload);
      } catch (sheetErr) {
        console.error("Google Sheets upsert failed:", sheetErr);
      }

      if (wantsNewsletter) {
        const { firstName, lastName } = parseFullName(name.trim());
        const result = await upsertSubscriber(email.trim(), {
          firstName,
          lastName,
        });
        if (!result.ok) {
          console.error(
            "Enter wizard: Sequenzy signup failed after payment intent created:",
            result.error,
          );
        }
      }

      if (wantsNewsletter) {
        const { firstName, lastName } = parseFullName(name.trim());
        const result = await upsertSubscriber(email.trim(), {
          firstName,
          lastName,
        });
        if (!result.ok) {
          console.error(
            "Enter wizard: Sequenzy signup failed after payment intent created:",
            result.error,
          );
        }
      }
    });

    // 11. Return existing frontend response format
    return NextResponse.json({
      clientSecret: intent.client_secret,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "This checkout reference is already in use.",
        },
        { status: 409 },
      );
    }

    console.error("Checkout creation failed:", error);

    return NextResponse.json(
      { error: "Failed to initialize checkout." },
      { status: 500 },
    );
  }
}
