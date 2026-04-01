"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({
  entryToken,
  totalGBP,
  bookCount,
  bookTitles,
}: {
  entryToken: string;
  totalGBP: number;
  bookCount: number;
  bookTitles: string[];
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/enter/success`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      if (entryToken) {
        try {
          const syncResponse = await fetch("/api/entry-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: entryToken,
              paymentId: paymentIntent.id,
              bookCount,
              totalGBP,
              paidAt: new Date().toISOString(),
              bookTitles,
            }),
          });

          if (!syncResponse.ok) {
            throw new Error("Paid entry sync failed.");
          }
        } catch (syncError) {
          console.error("Failed to mark sheet entry as paid from client:", syncError);
        }
      }

      sessionStorage.setItem("maya_entry_complete", "true");
      router.push(`/enter/success?payment_intent_id=${paymentIntent.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Spinner shown until PaymentElement signals it's fully rendered */}
      {!isReady && (
        <div className="flex items-center justify-center py-10 text-slate-400 text-sm gap-2">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
          Loading payment form...
        </div>
      )}

      {/* PaymentElement is always mounted so Stripe can load in the background;
          hidden via CSS until onReady fires to avoid showing a half-loaded UI */}
      <div style={{ display: isReady ? "block" : "none" }}>
        <PaymentElement onReady={() => setIsReady(true)} />
      </div>

      {error && (
        <p
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          role="alert"
        >
          {error}
        </p>
      )}

      {isReady && (
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-[#23100A] font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {isProcessing
            ? "Processing payment..."
            : `Pay \u00A3${totalGBP} securely`}
        </button>
      )}
    </form>
  );
}

export default function PaymentForm({
  clientSecret,
  entryToken,
  totalGBP,
  bookCount,
  bookTitles,
}: {
  clientSecret: string;
  entryToken: string;
  totalGBP: number;
  bookCount: number;
  bookTitles: string[];
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: { borderRadius: "8px" },
        },
      }}
    >
      <CheckoutForm entryToken={entryToken} totalGBP={totalGBP} bookCount={bookCount} bookTitles={bookTitles} />
    </Elements>
  );
}
