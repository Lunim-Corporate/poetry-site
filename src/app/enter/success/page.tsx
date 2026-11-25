// import type { Metadata } from "next";
// import QRCode from "qrcode";
// import Link from "next/link";
// import Stripe from "stripe";
// import MarkEntryComplete from "./MarkEntryComplete";
// import SuccessStepper from "./SuccessStepper";
// import CreateAccountForm from "./CreateAccountForm";
// import PostingAddressSection from "@/components/PostingAddressSection";
// import { getBookTitlesForToken, markEntryPaidByToken } from "@/lib/googleSheets";
// import { sendEntrantConfirmation, sendAdminNotification } from "@/lib/email";
// import { postingBookFromShipping } from "@/lib/mockAuth";
// import { prisma } from "@/lib/prisma";



// type AssignedJudge = {
//   id: string;
//   name: string;
//   street: string;
//   town: string;
//   postcode: string;
//   country: string;
// };

// export const metadata: Metadata = {
//   title: "Entry Confirmed - Maya Poetry Book Awards",
//   description: "Your competition entry payment was successful.",
// };

// function getStripe() {
//   return new Stripe(process.env.STRIPE_SECRET_KEY!, {
//     apiVersion: "2026-01-28.clover",
//   });
// }

// function parseBookTitlesFromStripeMetadata(
//   meta: Record<string, string | undefined>,
//   bookCount: number
// ): string[] {
//   const json = meta.book_titles_json;
//   if (typeof json === "string" && json.trim()) {
//     try {
//       const parsed = JSON.parse(json) as unknown;
//       if (Array.isArray(parsed)) {
//         return parsed.map((t) => String(t).trim()).filter(Boolean);
//       }
//     } catch {
//       /* ignore invalid JSON */
//     }
//   }
//   const out: string[] = [];
//   for (let i = 1; i <= bookCount; i++) {
//     const v = meta[`book_title_${i}`];
//     if (typeof v === "string" && v.trim()) out.push(v.trim());
//   }
//   return out;
// }

// function mergeStripeMetadata(
//   existing: Stripe.Metadata | null,
//   patch: Record<string, string>
// ): Record<string, string> {
//   const base: Record<string, string> = {};
//   if (existing) {
//     for (const key of Object.keys(existing)) {
//       const v = existing[key as keyof typeof existing];
//       if (typeof v === "string") base[key] = v;
//     }
//   }
//   return { ...base, ...patch };
// }

// /** Avoid blocking the whole page (and emails) if Google Sheets is slow or hangs. */
// function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
//   return Promise.race([
//     promise,
//     new Promise<T>((resolve) => {
//       setTimeout(() => resolve(fallback), ms);
//     }),
//   ]);
// }

// export default async function SuccessPage({
//   searchParams,
// }: {
//   searchParams: Promise<{
//     payment_intent_id?: string;
//     payment_intent?: string;
//     redirect_status?: string;
//   }>;
// }) {
//   const params = await searchParams;
//   const intentId = params.payment_intent_id ?? params.payment_intent;

//   if (!intentId) {
//     return (
//       <ErrorState
//         title="No payment found"
//         message="It looks like you arrived here without completing a payment."
//         linkText="Go to Entry Page"
//       />
//     );
//   }

//   const stripe = getStripe();
//   let intent: Stripe.PaymentIntent;
//   try {
//     intent = await stripe.paymentIntents.retrieve(intentId);
//   } catch {
//     return (
//       <ErrorState
//         title="Invalid payment"
//         message="We couldn't verify your payment. Please contact us if you believe this is an error."
//         linkText="Go to Entry Page"
//       />
//     );
//   }

//   if (intent.status === "processing") {
//     return (
//       <ErrorState
//         title="Payment processing"
//         message="Your payment is still being processed. Please check back shortly. Do not make another payment."
//         linkText="Back to Entry Page"
//       />
//     );
//   }

//   if (intent.status !== "succeeded") {
//     return (
//       <ErrorState
//         title="Payment not completed"
//         message="Your payment has not been confirmed. Please check your payment status before trying again."
//         linkText="Back to Entry Page"
//       />
//     );
//   }

//   // Confirm that the webhook has processed the payment.
//   const checkout = await prisma.pendingCheckout.findUnique({
//     where: {
//       stripePaymentIntentId: intent.id,
//     },
//     include: {
//       submission: {
//         include: {
//           books: true,
//         },
//       },
//     },
//   });

//   if (
//     !checkout ||
//     checkout.status !== "PAID" ||
//     !checkout.submission
//   ) {
//     return (
//       <ErrorState
//         title="Finalising your entry"
//         message="Your payment was successful, but we're still registering your competition entry. Please check back shortly. Do not make another payment."
//         linkText="Back to Entry Page"
//       />
//     );
//   }

//   const entrantName = intent.metadata?.entrant_name ?? "Entrant";
//   const entrantEmail = intent.metadata?.entrant_email ?? "";
//   const entryToken = intent.metadata?.entry_token ?? "";
//   const bookCount = Number(intent.metadata?.book_count ?? 1);
//   const totalGBP = intent.metadata?.total_gbp ?? "0";
//   const bookLabel = bookCount === 1 ? "book" : "books";

//   const meta = (intent.metadata ?? {}) as Record<string, string | undefined>;
//   const bookTitlesFromMetadata = parseBookTitlesFromStripeMetadata(meta, bookCount);
//   let resolvedBookTitles = bookTitlesFromMetadata;
//   if (resolvedBookTitles.length === 0 && entryToken) {
//     try {
//       resolvedBookTitles = await withTimeout(getBookTitlesForToken(entryToken), 8_000, []);
//     } catch (err) {
//       console.error("Could not load book titles from sheet for email:", err);
//     }
//   }

//   const reference = `MAYA-${new Date().getFullYear()}-${intentId.slice(-8).toUpperCase()}`;

//   // TODO: wire to real assignment data (judge assigned instantly at entry time)
//   const assignedJudge: AssignedJudge = {
//     id: "placeholder-sub-judge-1",
//     name: "Alex Morgan",
//     street: "14 Chapel Street",
//     town: "Cardiff",
//     postcode: "CF10 2AB",
//     country: "United Kingdom",
//   };

//   const shipping = {
//     name: assignedJudge.name,
//     street: assignedJudge.street,
//     town: assignedJudge.town,
//     postcode: assignedJudge.postcode,
//     country: assignedJudge.country,
//   };

//   const emailEntry = {
//     name: entrantName,
//     email: entrantEmail,
//     quantity: bookCount,
//     priceGBP: Number(totalGBP),
//     paymentId: intentId,
//     reference,
//     bookTitles: resolvedBookTitles.length > 0 ? resolvedBookTitles : undefined,
//     shipping,
//   };

//   // Only run side effects once — guard against re-runs on page refresh.
//   // We store the sheet row URL in Stripe metadata after the first processing.
//   let sheetRowUrl =
//     `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEETS_SPREADSHEET_ID}/edit`;

//   if (!intent.metadata?.entry_processed) {
//     // Send confirmation emails first. Previously: Stripe metadata update ran before
//     // emails; if that call hung or the worker died before the send lines, no mail went out
//     // while entry_processed could still get set on a retry.
//     try {
//       await Promise.all([
//         sendEntrantConfirmation(emailEntry),
//         sendAdminNotification(emailEntry),
//       ]);
//     } catch (err) {
//       console.error("Failed to send confirmation emails:", err);
//     }

//     try {
//       if (entryToken) {
//         sheetRowUrl = await markEntryPaidByToken({
//           token: entryToken,
//           quantity: bookCount,
//           priceGBP: Number(totalGBP),
//           paymentId: intentId,
//           paidAt: new Date(intent.created * 1000).toISOString(),
//           bookTitles: resolvedBookTitles.length > 0 ? resolvedBookTitles : undefined,
//         });
//       } else {
//         console.error("Missing entry token in Stripe metadata; skipping Google Sheets paid sync.");
//       }
//     } catch (err) {
//       console.error("Failed to sync paid entry to Google Sheets:", err);
//     }

//     try {
//       const mergedMeta = mergeStripeMetadata(intent.metadata, {
//         entry_processed: "true",
//         sheet_row_url: sheetRowUrl,
//       });
//       await stripe.paymentIntents.update(intentId, { metadata: mergedMeta });
//     } catch (err) {
//       console.error("Failed to update Stripe metadata after entry processing:", err);
//     }
//   } else if (intent.metadata?.sheet_row_url) {
//     sheetRowUrl = intent.metadata.sheet_row_url;
//   }

//   const qrDataUrl = await QRCode.toDataURL(sheetRowUrl, {
//     width: 224,
//     margin: 1,
//     color: { dark: "#0f172a", light: "#ffffff" },
//   });

//   return (
//     <section className="py-10 font-sans">
//       <MarkEntryComplete />
//       <div className="max-w-2xl mx-auto px-6">
//         <SuccessStepper />

//         {/* Step 4 card */}
//         <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
//           {/* Status banner */}
//           <div className="border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3 font-bold text-base text-emerald-800 mb-4" role="status">
//             Thank you, payment of &pound;{totalGBP} was made successfully.
//           </div>

//           <h2 className="text-lg font-semibold text-slate-900 mb-1">
//             Print label and send your {bookLabel}
//           </h2>
//           <p className="text-base text-slate-500 mb-4">
//             Click the &ldquo;Print label&rdquo; button to print out the details shown
//             below, then stick this on the parcel for the {bookLabel} you&apos;re
//             sending. Or, if you prefer, copy the details by hand &mdash; make sure to
//             include the proof of payment reference.
//           </p>

//           <div className="mt-2 mb-5">
//             <PostingAddressSection
//               book={postingBookFromShipping(
//                 shipping,
//                 "assigned_not_posted",
//                 `success-${intentId.slice(-8)}`
//               )}
//               reference={reference}
//               qrDataUrl={qrDataUrl}
//               showPrintButton
//             />
//           </div>

//           <p className="text-xs text-slate-500 mt-4 leading-relaxed">
//             The reference QR code and number are for the organiser&apos;s use only. If
//             printing the label, please keep these elements visible. If manually copying
//             the details, just be sure to write out the reference number.
//           </p>
//           <p className="text-xs text-slate-500 mt-3 leading-relaxed">
//             It is your responsibility to ensure the correct postage is applied to your
//             parcel and to pay for it. Incorrect postage could result in your package
//             being returned to you and possibly in you missing the deadline.
//           </p>
//           <p className="text-xs text-slate-500 mt-3 leading-relaxed">
//             If posting from overseas (outside the UK), it is exclusively your
//             responsibility to fill out any customs forms and declarations that may be
//             needed.
//           </p>

//           <CreateAccountForm email={entrantEmail} entryReference={reference} />
//         </div>
//       </div>
//     </section>
//   );
// }

// function ErrorState({
//   title,
//   message,
//   linkText,
// }: {
//   title: string;
//   message: string;
//   linkText: string;
// }) {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-2xl mx-auto px-6 text-center">
//         <h1 className="text-2xl font-bold text-slate-900 mb-4">{title}</h1>
//         <p className="text-slate-600 mb-6">{message}</p>
//         <Link
//           href="/enter"
//           className="inline-block border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-5 rounded-lg text-base transition-colors"
//         >
//           {linkText}
//         </Link>
//       </div>
//     </section>
//   );
// }












import type { Metadata } from "next";
import QRCode from "qrcode";
import Link from "next/link";
import Stripe from "stripe";

import MarkEntryComplete from "./MarkEntryComplete";
import SuccessStepper from "./SuccessStepper";
import CreateAccountForm from "./CreateAccountForm";

import PostingAddressSection from "@/components/PostingAddressSection";
import { markEntryPaidByToken } from "@/lib/googleSheets";
import {
  sendEntrantConfirmation,
  sendAdminNotification,
} from "@/lib/email";
import { postingBookFromShipping } from "@/lib/mockAuth";
import { prisma } from "@/lib/prisma";

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

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

function mergeStripeMetadata(
  existing: Stripe.Metadata | null,
  patch: Record<string, string>
): Record<string, string> {
  const base: Record<string, string> = {};

  if (existing) {
    for (const key of Object.keys(existing)) {
      const value = existing[key as keyof typeof existing];

      if (typeof value === "string") {
        base[key] = value;
      }
    }
  }

  return {
    ...base,
    ...patch,
  };
}

function getPaymentStatusUrl(intentId: string) {
  return `/enter/success?payment_intent_id=${encodeURIComponent(
    intentId
  )}`;
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

  const intentId =
    params.payment_intent_id ?? params.payment_intent;

  if (!intentId) {
    return (
      <ErrorState
        title="No payment found"
        message="It looks like you arrived here without completing a payment."
        linkText="Go to Entry Page"
        href="/enter"
      />
    );
  }

  const stripe = getStripe();

  let intent: Stripe.PaymentIntent;

  try {
    intent = await stripe.paymentIntents.retrieve(intentId);
  } catch (error) {
    console.error("Could not retrieve Stripe payment:", error);

    return (
      <ErrorState
        title="Unable to verify payment"
        message="We couldn't verify your payment at the moment. If you have already paid, please do not make another payment."
        linkText="Check Again"
        href={getPaymentStatusUrl(intentId)}
      />
    );
  }

  // Handle payments that are still being processed.
  if (intent.status === "processing") {
    return (
      <ErrorState
        title="Payment processing"
        message="Your payment is still being processed by Stripe. Please check back shortly. Do not make another payment."
        linkText="Check Again"
        href={getPaymentStatusUrl(intentId)}
      />
    );
  }

  // Only succeeded payments can proceed to entry verification.
  if (intent.status !== "succeeded") {
    return (
      <ErrorState
        title="Payment not completed"
        message="Your payment has not been confirmed. Please check your payment details or contact the organisers if you need assistance."
        linkText="Back to Entry Page"
        href="/enter"
      />
    );
  }

  // Verify the payment has been processed by the webhook.
  let checkout;

  try {
    checkout = await prisma.pendingCheckout.findUnique({
      where: {
        stripePaymentIntentId: intent.id,
      },
      include: {
        user: true,
        submission: {
          include: {
            books: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Could not retrieve checkout:", error);

    return (
      <ErrorState
        title="Unable to load your entry"
        message="Your payment was successful, but we couldn't load your entry details right now. Please check again shortly. Do not make another payment."
        linkText="Check Again"
        href={getPaymentStatusUrl(intentId)}
      />
    );
  }

  if (
    !checkout ||
    checkout.status !== "PAID" ||
    !checkout.submission ||
    checkout.submission.books.length === 0
  ) {
    return (
      <ErrorState
        title="Finalising your entry"
        message="Your payment was successful, but we're still registering your competition entry. Please check back shortly. Do not make another payment."
        linkText="Check Again"
        href={getPaymentStatusUrl(intentId)}
      />
    );
  }

  // PostgreSQL is now the source of truth for entry details.
  const entrantName = checkout.user.name;
  const entrantEmail = checkout.user.email;

  const entryToken = checkout.entryToken;

  const books = checkout.submission.books;

  const resolvedBookTitles = books.map((book) => book.title);

  const bookCount = books.length;

  const totalGBP = (
    checkout.expectedAmountPence / 100
  ).toFixed(2);

  const bookLabel = bookCount === 1 ? "book" : "books";

  // Book references are created by the Stripe webhook.
  const bookReferences = books.map((book) => book.reference);

  // Use the first book reference as the displayed entry reference.
  const reference = bookReferences[0];

  // A shipping address must be assigned by the backend.
  // Do not use the old hardcoded judge address in production.
  // const assignedJudge: AssignedJudge | null = null;
  // Placeholder judge address for local testing only
  const assignedJudge = {
    id: "placeholder-sub-judge-1",
    name: "Alex Morgan",
    street: "14 Chapel Street",
    town: "Cardiff",
    postcode: "CF10 2AB",
    country: "United Kingdom",
  };

  // Shipping details required by EmailEntry
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
    paymentId: intent.id,
    reference,
    bookTitles: resolvedBookTitles,
    shipping,
  };

  // TEMPORARY: Existing post-payment side effects.
  //
  // These will be moved to a reliable backend workflow.
  // Stripe metadata is not a fully reliable idempotency mechanism.
  // Concurrent requests or partial failures can cause duplicates.
  let sheetRowUrl: string | null =
    intent.metadata?.sheet_row_url || null;

  if (!intent.metadata?.entry_processed) {
    try {
      await Promise.all([
        sendEntrantConfirmation(emailEntry),
        sendAdminNotification(emailEntry),
      ]);
    } catch (error) {
      console.error(
        "Failed to send confirmation emails:",
        error
      );
    }

    try {
      sheetRowUrl = await markEntryPaidByToken({
        token: entryToken,
        quantity: bookCount,
        priceGBP: Number(totalGBP),
        paymentId: intent.id,
        paidAt: new Date(
          intent.created * 1000
        ).toISOString(),
        bookTitles: resolvedBookTitles,
      });
    } catch (error) {
      console.error(
        "Failed to sync payment to Google Sheets:",
        error
      );
    }

    try {
      const updatedMetadata = mergeStripeMetadata(
        intent.metadata,
        {
          entry_processed: "true",
          ...(sheetRowUrl
            ? { sheet_row_url: sheetRowUrl }
            : {}),
        }
      );

      await stripe.paymentIntents.update(intent.id, {
        metadata: updatedMetadata,
      });
    } catch (error) {
      console.error(
        "Failed to update Stripe metadata:",
        error
      );
    }
  }

  // QR code is only generated when a verified shipping
  // destination has been configured.
  const qrDataUrl =
    shipping && sheetRowUrl
      ? await QRCode.toDataURL(sheetRowUrl, {
          width: 224,
          margin: 1,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        })
      : null;

  return (
    <section className="py-10 font-sans">
      <MarkEntryComplete />

      <div className="max-w-2xl mx-auto px-6">
        <SuccessStepper />

        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          {/* Payment confirmation */}
          <div
            className="border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3 font-bold text-base text-emerald-800 mb-4"
            role="status"
          >
            Thank you, payment of £{totalGBP} was made
            successfully.
          </div>

          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Your competition entry is confirmed!
          </h2>

          <p className="text-base text-slate-600 mb-5">
            We have successfully registered your{" "}
            {bookCount} {bookLabel} for the Maya Poetry
            Book Awards.
          </p>

          {/* Entry information */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">
              Entry Details
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-700">
                  Entrant:
                </span>{" "}
                <span className="text-slate-900">
                  {entrantName}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-700">
                  Email:
                </span>{" "}
                <span className="text-slate-900">
                  {entrantEmail}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-700">
                  Number of books:
                </span>{" "}
                <span className="text-slate-900">
                  {bookCount}
                </span>
              </div>

              <div>
                <span className="font-semibold text-slate-700">
                  Payment reference:
                </span>{" "}
                <span className="break-all text-slate-900">
                  {intent.id}
                </span>
              </div>
            </div>
          </div>

          {/* Registered books */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Your Registered Books
            </h3>

            <div className="space-y-3">
              {books.map((book, index) => (
                <div
                  key={book.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {index + 1}. {book.title}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Reference: {book.reference}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Status: {book.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Print label and send your {bookLabel}
            </h3>

            {shipping && qrDataUrl ? (
              <>
                <p className="text-base text-slate-500 mb-4">
                  Print the shipping label below and attach
                  it securely to your parcel.
                </p>

                <PostingAddressSection
                  book={postingBookFromShipping(
                    shipping,
                    "assigned_not_posted",
                    `success-${intent.id.slice(-8)}`
                  )}
                  reference={reference}
                  qrDataUrl={qrDataUrl}
                  showPrintButton
                />

                <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                  Please ensure the correct postage is
                  applied to your parcel.
                </p>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  If posting from outside the UK, you are
                  responsible for any required customs
                  declarations.
                </p>
              </>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900 mb-2">
                  Shipping instructions pending
                </p>

                <p className="text-sm text-amber-800">
                  Your competition entry has been registered
                  successfully. However, the postal
                  destination has not yet been assigned.
                  Please do not send your books until the
                  organisers provide a confirmed shipping
                  address.
                </p>
              </div>
            )}
          </div>

          {/* Account creation */}
          {checkout.user.isGhost && (
            <CreateAccountForm
              email={entrantEmail}
              entryReference={reference}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ErrorState({
  title,
  message,
  linkText,
  href,
}: {
  title: string;
  message: string;
  linkText: string;
  href: string;
}) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {title}
        </h1>

        <p className="text-slate-600 mb-6">
          {message}
        </p>

        <Link
          href={href}
          className="inline-block border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-5 rounded-lg text-base transition-colors"
        >
          {linkText}
        </Link>
      </div>
    </section>
  );
}