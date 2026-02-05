"use client";

import { PrismicRichText } from "@prismicio/react";
import { useState, FormEvent } from "react";

type NewsletterSlice = {
  slice_type: string;
  variation: string;
  primary: {
    title?: string;
    description?: any;
  };
};

export default function Newsletter({ slice }: { slice: NewsletterSlice }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSuccess(true);
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
          />
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
