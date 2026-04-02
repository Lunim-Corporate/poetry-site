"use client";

import { PrismicRichText } from "@prismicio/react";
import { useState, FormEvent } from "react";
import type { ContactCardSliceData, SliceComponentProps } from "@/types";

export default function ContactCard({ slice }: SliceComponentProps<ContactCardSliceData>) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    newsletter: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim() || !formData.email.trim() || !validateEmail(formData.email) || !formData.message.trim()) {
      setError("Please fill in all fields with a valid email.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          newsletter: formData.newsletter,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setIsSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="contact"
      className="contactCard sketch-card"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h3 className="cardTitle">{slice.primary.title || "Contact Us"}</h3>
      <div className="muted">
        <PrismicRichText field={slice.primary.description} />
      </div>

      {isSuccess ? (
        <p>
          <strong>Thank you{formData.name ? `, ${formData.name}` : ""}!</strong> We&apos;ll be in touch soon.
        </p>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <div className="formRow formRow--split">
            <div>
              <label className="label" htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="formRow">
            <label className="label" htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="How can we help?"
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div className="checkRow">
            <input
              id="contact-newsletter"
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
            />
            <label htmlFor="contact-newsletter">
              Also sign me up for the newsletter
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={`btn btn--full ${isLoading ? "is-loading" : ""}`}
            disabled={isLoading}
          >
            <span className="btn__spinner" aria-hidden="true"></span>
            <span className="btn__label">Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
}
