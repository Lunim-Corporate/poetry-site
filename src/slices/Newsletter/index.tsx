"use client";

import { PrismicRichText } from "@prismicio/react";
import { useState, FormEvent } from "react";
import type { NewsletterSliceData, SliceComponentProps } from "@/types";

export default function Newsletter({ slice }: SliceComponentProps<NewsletterSliceData>) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="newsletter sketch-card"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h3 className="cardTitle">{slice.primary.title || "Newsletter"}</h3>
      <div className="muted">
        <PrismicRichText field={slice.primary.description} />
      </div>

      {isSuccess ? (
        <p>
          <strong>Thank you!</strong> You&apos;ve been added to our mailing list.
        </p>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <label className="label" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-base"
          />
          {error && <p className="text-red-600 text-base mt-1">{error}</p>}
          <button
            type="submit"
            className={`btn btn--full ${isLoading ? "is-loading" : ""}`}
            disabled={isLoading}
          >
            <span className="btn__spinner" aria-hidden="true"></span>
            <span className="btn__label">Subscribe</span>
          </button>
        </form>
      )}
    </div>
  );
}
