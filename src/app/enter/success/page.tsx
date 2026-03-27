import type { Metadata } from "next";
import QRCode from "qrcode";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/prismicio";
import { DEFAULT_SHIPPING } from "../constants";
import PrintButton from "./PrintButton";
import MarkEntryComplete from "./MarkEntryComplete";
import SuccessStepper from "./SuccessStepper";
import { appendEntryToSheet } from "@/lib/googleSheets";
import { sendEntrantConfirmation, sendAdminNotification } from "@/lib/email";

export const metadata: Metadata = {
  title: "Entry Confirmed - Maya Poetry Book Awards",
  description: "Your competition entry payment was successful.",
};

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
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
  const entrantPhone = intent.metadata?.entrant_phone ?? "";
  const bookCount = Number(intent.metadata?.book_count ?? 1);
  const totalGBP = intent.metadata?.total_gbp ?? "0";
  const bookLabel = bookCount === 1 ? "book" : "books";

  const reference = `MAYA-${new Date().getFullYear()}-${intentId.slice(-8).toUpperCase()}`;

  const client = createClient();
  const doc = await client.getSingle("enter_page").catch(() => null);
  const data = (doc?.data ?? {}) as Record<string, unknown>;

  const shipping = {
    name: (data.shipping_name as string) || DEFAULT_SHIPPING.name,
    street: (data.shipping_street as string) || DEFAULT_SHIPPING.street,
    town: (data.shipping_town as string) || DEFAULT_SHIPPING.town,
    postcode: (data.shipping_postcode as string) || DEFAULT_SHIPPING.postcode,
    country: (data.shipping_country as string) || DEFAULT_SHIPPING.country,
  };

  const emailEntry = {
    name: entrantName,
    email: entrantEmail,
    quantity: bookCount,
    priceGBP: Number(totalGBP),
    paymentId: intentId,
    reference,
    shipping,
  };

  // Only run side effects once — guard against re-runs on page refresh.
  // We store the sheet row URL in Stripe metadata after the first processing.
  let sheetRowUrl =
    `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/edit`;

  if (!intent.metadata?.entry_processed) {
    try {
      sheetRowUrl = await appendEntryToSheet({
        name: entrantName,
        email: entrantEmail,
        phone: entrantPhone,
        quantity: bookCount,
        priceGBP: Number(totalGBP),
        paymentId: intentId,
      });
    } catch (err) {
      console.error("Failed to log entry to Google Sheets:", err);
    }

    await stripe.paymentIntents.update(intentId, {
      metadata: { ...intent.metadata, entry_processed: "true", sheet_row_url: sheetRowUrl },
    });

    sendEntrantConfirmation(emailEntry).catch((err) =>
      console.error("Failed to send entrant confirmation email:", err)
    );

    sendAdminNotification(emailEntry).catch((err) =>
      console.error("Failed to send admin notification email:", err)
    );
  } else if (intent.metadata?.sheet_row_url) {
    sheetRowUrl = intent.metadata.sheet_row_url;
  }

  const qrDataUrl = await QRCode.toDataURL(sheetRowUrl, {
    width: 224,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
  });

  return (
    <section className="py-10 bg-white font-sans">
      <MarkEntryComplete />
      <div className="max-w-2xl mx-auto px-6">
        <SuccessStepper />

        {/* Step 4 card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          {/* Status banner */}
          <div className="border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3 font-bold text-sm text-emerald-800 mb-4" role="status">
            Thank you, payment of &pound;{totalGBP} was made successfully.
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mb-1">
            Print label and send your {bookLabel}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Click the &ldquo;Print label&rdquo; button to print out the details shown
            below, then stick this on the parcel for the {bookLabel} you&apos;re
            sending. Or, if you prefer, copy the details by hand &mdash; make sure to
            include the proof of payment reference.
          </p>

          {/* Label grid */}
          <div id="print-label" className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6 mt-2 mb-5 p-4 border-2 border-dashed border-slate-400/60 rounded-lg">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mt-0 mb-2">Address</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>{shipping.name}</strong>
                <br />
                {shipping.street.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
                {shipping.town}
                <br />
                {shipping.postcode}
                <br />
                {shipping.country}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mt-0 mb-3">Reference</h3>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="QR code linking to this entry in Google Sheets"
                width={112}
                height={112}
                className="rounded"
              />
              <p className="text-sm font-extrabold text-slate-900 mt-3">{reference}</p>
            </div>
          </div>

          <PrintButton />

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

          <div className="mt-5">
            <Link
              href="/"
              className="text-sm text-slate-500 underline hover:text-slate-700"
            >
              Return to home page
            </Link>
          </div>
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
          className="inline-block border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-5 rounded-lg text-sm transition-colors"
        >
          {linkText}
        </Link>
      </div>
    </section>
  );
}
