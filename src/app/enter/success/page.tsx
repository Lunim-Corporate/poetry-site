import type { Metadata } from "next";
import QRCode from "qrcode";
import Link from "next/link";
import Stripe from "stripe";
import MarkEntryComplete from "./MarkEntryComplete";
import SuccessStepper from "./SuccessStepper";
import CreateAccountForm from "./CreateAccountForm";
import PostingAddressSection from "@/components/PostingAddressSection";
import { getBookTitlesForToken, markEntryPaidByToken } from "@/lib/googleSheets";
import { sendEntrantConfirmation, sendAdminNotification } from "@/lib/email";
import { postingBookFromShipping } from "@/lib/mockAuth";

type AssignedJudge = {
  id: string;
  name: string;
  street: string;
  town: string;
  postcode: string;
  country: string;
};

export const metadata: Metadata = {
  title: "Entry Confirmed - Maya Poetry Book Awards",
  description: "Your competition entry payment was successful.",
};

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

function parseBookTitlesFromStripeMetadata(
  meta: Record<string, string | undefined>,
  bookCount: number
): string[] {
  const json = meta.book_titles_json;
  if (typeof json === "string" && json.trim()) {
    try {
      const parsed = JSON.parse(json) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim()).filter(Boolean);
      }
    } catch {
      /* ignore invalid JSON */
    }
  }
  const out: string[] = [];
  for (let i = 1; i <= bookCount; i++) {
    const v = meta[`book_title_${i}`];
    if (typeof v === "string" && v.trim()) out.push(v.trim());
  }
  return out;
}

function mergeStripeMetadata(
  existing: Stripe.Metadata | null,
  patch: Record<string, string>
): Record<string, string> {
  const base: Record<string, string> = {};
  if (existing) {
    for (const key of Object.keys(existing)) {
      const v = existing[key as keyof typeof existing];
      if (typeof v === "string") base[key] = v;
    }
  }
  return { ...base, ...patch };
}

/** Avoid blocking the whole page (and emails) if Google Sheets is slow or hangs. */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    }),
  ]);
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment_intent_id?: string;
    payment_intent?: string;
    redirect_status?: string;
  }>;
}) {
  const params = await searchParams;
  const intentId = params.payment_intent_id ?? params.payment_intent;

  if (!intentId) {
    return (
      <ErrorState
        title="No payment found"
        message="It looks like you arrived here without completing a payment."
        linkText="Go to Entry Page"
      />
    );
  }

  const stripe = getStripe();
  let intent: Stripe.PaymentIntent;
  try {
    intent = await stripe.paymentIntents.retrieve(intentId);
  } catch {
    return (
      <ErrorState
        title="Invalid payment"
        message="We couldn't verify your payment. Please contact us if you believe this is an error."
        linkText="Go to Entry Page"
      />
    );
  }

  if (intent.status !== "succeeded") {
    return (
      <ErrorState
        title="Payment not completed"
        message="Your payment has not been confirmed yet. Please try again or contact us for assistance."
        linkText="Try Again"
      />
    );
  }

  const entrantName = intent.metadata?.entrant_name ?? "Entrant";
  const entrantEmail = intent.metadata?.entrant_email ?? "";
  const entryToken = intent.metadata?.entry_token ?? "";
  const bookCount = Number(intent.metadata?.book_count ?? 1);
  const totalGBP = intent.metadata?.total_gbp ?? "0";
  const bookLabel = bookCount === 1 ? "book" : "books";

  const meta = (intent.metadata ?? {}) as Record<string, string | undefined>;
  const bookTitlesFromMetadata = parseBookTitlesFromStripeMetadata(meta, bookCount);
  let resolvedBookTitles = bookTitlesFromMetadata;
  if (resolvedBookTitles.length === 0 && entryToken) {
    try {
      resolvedBookTitles = await withTimeout(getBookTitlesForToken(entryToken), 8_000, []);
    } catch (err) {
      console.error("Could not load book titles from sheet for email:", err);
    }
  }

  const reference = `MAYA-${new Date().getFullYear()}-${intentId.slice(-8).toUpperCase()}`;

  // TODO: wire to real assignment data (judge assigned instantly at entry time)
  const assignedJudge: AssignedJudge = {
    id: "placeholder-sub-judge-1",
    name: "Alex Morgan",
    street: "14 Chapel Street",
    town: "Cardiff",
    postcode: "CF10 2AB",
    country: "United Kingdom",
  };

  const shipping = {
    name: assignedJudge.name,
    street: assignedJudge.street,
    town: assignedJudge.town,
    postcode: assignedJudge.postcode,
    country: assignedJudge.country,
  };

  const emailEntry = {
    name: entrantName,
    email: entrantEmail,
    quantity: bookCount,
    priceGBP: Number(totalGBP),
    paymentId: intentId,
    reference,
    bookTitles: resolvedBookTitles.length > 0 ? resolvedBookTitles : undefined,
    shipping,
  };

  // Only run side effects once — guard against re-runs on page refresh.
  // We store the sheet row URL in Stripe metadata after the first processing.
  let sheetRowUrl =
    `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/edit`;

  if (!intent.metadata?.entry_processed) {
    // Send confirmation emails first. Previously: Stripe metadata update ran before
    // emails; if that call hung or the worker died before the send lines, no mail went out
    // while entry_processed could still get set on a retry.
    try {
      await Promise.all([
        sendEntrantConfirmation(emailEntry),
        sendAdminNotification(emailEntry),
      ]);
    } catch (err) {
      console.error("Failed to send confirmation emails:", err);
    }

    try {
      if (entryToken) {
        sheetRowUrl = await markEntryPaidByToken({
          token: entryToken,
          quantity: bookCount,
          priceGBP: Number(totalGBP),
          paymentId: intentId,
          paidAt: new Date(intent.created * 1000).toISOString(),
          bookTitles: resolvedBookTitles.length > 0 ? resolvedBookTitles : undefined,
        });
      } else {
        console.error("Missing entry token in Stripe metadata; skipping Google Sheets paid sync.");
      }
    } catch (err) {
      console.error("Failed to sync paid entry to Google Sheets:", err);
    }

    try {
      const mergedMeta = mergeStripeMetadata(intent.metadata, {
        entry_processed: "true",
        sheet_row_url: sheetRowUrl,
      });
      await stripe.paymentIntents.update(intentId, { metadata: mergedMeta });
    } catch (err) {
      console.error("Failed to update Stripe metadata after entry processing:", err);
    }
  } else if (intent.metadata?.sheet_row_url) {
    sheetRowUrl = intent.metadata.sheet_row_url;
  }

  const qrDataUrl = await QRCode.toDataURL(sheetRowUrl, {
    width: 224,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <section className="py-10 font-sans">
      <MarkEntryComplete />
      <div className="max-w-2xl mx-auto px-6">
        <SuccessStepper />

        {/* Step 4 card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          {/* Status banner */}
          <div className="border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3 font-bold text-base text-emerald-800 mb-4" role="status">
            Thank you, payment of &pound;{totalGBP} was made successfully.
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Print label and send your {bookLabel}
          </h2>
          <p className="text-base text-slate-500 mb-4">
            Click the &ldquo;Print label&rdquo; button to print out the details shown
            below, then stick this on the parcel for the {bookLabel} you&apos;re
            sending. Or, if you prefer, copy the details by hand &mdash; make sure to
            include the proof of payment reference.
          </p>

          <div className="mt-2 mb-5">
            <PostingAddressSection
              book={postingBookFromShipping(
                shipping,
                "assigned_not_posted",
                `success-${intentId.slice(-8)}`
              )}
              reference={reference}
              qrDataUrl={qrDataUrl}
              showPrintButton
            />
          </div>

          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            The reference QR code and number are for the organiser&apos;s use only. If
            printing the label, please keep these elements visible. If manually copying
            the details, just be sure to write out the reference number.
          </p>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            It is your responsibility to ensure the correct postage is applied to your
            parcel and to pay for it. Incorrect postage could result in your package
            being returned to you and possibly in you missing the deadline.
          </p>
          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            If posting from overseas (outside the UK), it is exclusively your
            responsibility to fill out any customs forms and declarations that may be
            needed.
          </p>

          <CreateAccountForm email={entrantEmail} entryReference={reference} />
        </div>
      </div>
    </section>
  );
}

function ErrorState({
  title,
  message,
  linkText,
}: {
  title: string;
  message: string;
  linkText: string;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-slate-600 mb-6">{message}</p>
        <Link
          href="/enter"
          className="inline-block border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-5 rounded-lg text-base transition-colors"
        >
          {linkText}
        </Link>
      </div>
    </section>
  );
}
