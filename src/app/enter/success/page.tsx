import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { createClient } from "@/prismicio";
import { WIZARD_STEPS, DEFAULT_SHIPPING } from "../constants";
import PrintButton from "./PrintButton";
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
    // Stripe also appends these on 3DS redirect:
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
  const bookCount = Number(intent.metadata?.book_count ?? 1);
  const totalGBP = intent.metadata?.total_gbp ?? "0";

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

  // Fire-and-forget: log to Google Sheets + send emails — never blocks the page
  const emailEntry = {
    name: entrantName,
    email: entrantEmail,
    quantity: bookCount,
    priceGBP: Number(totalGBP),
    paymentId: intentId,
    reference,
    shipping,
  };

  appendEntryToSheet({
    name: entrantName,
    email: entrantEmail,
    quantity: bookCount,
    priceGBP: Number(totalGBP),
    paymentId: intentId,
  }).catch((err) => console.error("Failed to log entry to Google Sheets:", err));

  sendEntrantConfirmation(emailEntry).catch((err) =>
    console.error("Failed to send entrant confirmation email:", err)
  );

  sendAdminNotification(emailEntry).catch((err) =>
    console.error("Failed to send admin notification email:", err)
  );

  return (
    <section className="py-10 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        {/* Step indicator — all complete */}
        <div className="mb-10">
          <div className="flex items-start justify-between relative">
            <div className="absolute top-[52px] md:top-[56px] left-[calc(12.5%+20px)] right-[calc(62.5%+20px)] h-0.5 bg-slate-200" />
            <div className="absolute top-[52px] md:top-[56px] left-[calc(37.5%+20px)] right-[calc(37.5%+20px)] h-0.5 bg-slate-200" />
            <div className="absolute top-[52px] md:top-[56px] left-[calc(62.5%+20px)] right-[calc(12.5%+20px)] h-0.5 bg-slate-200" />

            {WIZARD_STEPS.map((step, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === 4;
              return (
                <div key={index} className="flex flex-col items-center flex-1 relative z-10">
                  <p className="text-[10px] md:text-xs text-slate-400 font-medium mb-1.5">
                    Step {stepNum}
                  </p>
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-slate-100 border-primary text-primary"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <p className="text-center mt-1.5 leading-tight">
                    <span className="hidden md:block text-[11px] text-slate-500">
                      {step.label}
                      <br />
                      {step.sublabel}
                    </span>
                    <span className="md:hidden text-[10px] text-slate-500">
                      {step.mobileLabel}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Payment Successful!
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Thank you {entrantName} for your entry (&pound;{totalGBP}). Please
            send your {bookCount === 1 ? "book" : `${bookCount} books`} to the
            address below.
          </p>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                Shipping Address
              </h4>
              <p className="text-slate-600 leading-relaxed">
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
            <div className="w-28 h-28 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-500 shrink-0">
              QR Code
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">Reference: {reference}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <PrintButton />
            <Link
              href="/"
              className="border border-slate-200 hover:border-slate-300 text-slate-700 font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
            >
              Return Home
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
          className="inline-block bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
        >
          {linkText}
        </Link>
      </div>
    </section>
  );
}
