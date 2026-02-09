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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
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
