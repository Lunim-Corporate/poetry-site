"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({ totalGBP }: { totalGBP: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setError(
          submitError.message ??
            "Payment details are invalid. Please try again."
        );
        return;
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/enter/success`,
          },
          redirect: "if_required",
        });

      if (confirmError) {
        setError(
          confirmError.message ??
            "Payment failed. Please try again."
        );
        return;
      }

      if (
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "processing"
      ) {
        router.push(
          `/enter/success?payment_intent_id=${encodeURIComponent(
            paymentIntent.id
          )}`
        );
        return;
      }

      setError(
        "Payment has not been completed. Please check your payment details."
      );
    } catch (err) {
      console.error("Stripe payment confirmation error:", err);

      setError(
        "We couldn't confirm the payment result. Please check your payment status before trying again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isReady && (
        <div className="flex items-center justify-center py-10 text-slate-400 text-base gap-2">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
          Loading payment form...
        </div>
      )}

      <div style={{ display: isReady ? "block" : "none" }}>
        <PaymentElement onReady={() => setIsReady(true)} />
      </div>

      {error && (
        <p
          className="text-base text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
          role="alert"
        >
          {error}
        </p>
      )}

      {isReady && (
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-[#23100A] font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}

          {isProcessing
            ? "Processing payment..."
            : `Pay £${totalGBP.toFixed(2)} securely`}
        </button>
      )}
    </form>
  );
}

type PaymentFormProps = {
  clientSecret: string;
  totalGBP: number;
};

export default function PaymentForm({
  clientSecret,
  totalGBP,
}: PaymentFormProps) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            borderRadius: "8px",
          },
        },
      }}
    >
      <CheckoutForm totalGBP={totalGBP} />
    </Elements>
  );
}