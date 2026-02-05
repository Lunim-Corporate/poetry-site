"use client";

import { PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";

type AboutWithNewsletterAndContactSlice = {
  slice_type: string;
  variation: string;
  primary: {
    about_title?: string;
    about_subtitle?: string;
    about_description?: RichTextField;
    newsletter_heading?: string;
    newsletter_description?: RichTextField;
    newsletter_button_text?: string;
    contact_heading?: string;
    contact_description?: RichTextField;
    contact_button_text?: string;
    show_newsletter_checkbox?: boolean;
  };
};

interface AboutWithNewsletterAndContactProps {
  slice: AboutWithNewsletterAndContactSlice;
  index: number;
  slices: any[];
  context: any;
}

export default function AboutWithNewsletterAndContact({
  slice,
}: AboutWithNewsletterAndContactProps) {
  const {
    about_title,
    about_subtitle,
    about_description,
    newsletter_heading,
    newsletter_description,
    newsletter_button_text,
    contact_heading,
    contact_description,
    contact_button_text,
    show_newsletter_checkbox,
  } = slice.primary;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Newsletter signup submitted (placeholder)");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Contact form submitted (placeholder)");
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 items-start">
          {/* Left Column - About */}
          <div className="space-y-4">
            <div className="mb-6">
              {about_title && (
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {about_title}
                </h2>
              )}
              {about_subtitle && (
                <p className="text-lg text-slate-500">{about_subtitle}</p>
              )}
            </div>

            {about_description && (
              <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-semibold prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900">
                <PrismicRichText field={about_description} />
              </div>
            )}
          </div>

          {/* Right Column - Newsletter & Contact */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Newsletter Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              {newsletter_heading && (
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {newsletter_heading}
                </h3>
              )}
              {newsletter_description && (
                <div className="text-sm text-slate-500 mb-4">
                  <PrismicRichText field={newsletter_description} />
                </div>
              )}
              <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-1"
                    htmlFor="newsletter-email"
                  >
                    Email
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
                >
                  {newsletter_button_text || "Subscribe"}
                </button>
              </form>
            </div>

            {/* Contact Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              {contact_heading && (
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {contact_heading}
                </h3>
              )}
              {contact_description && (
                <div className="text-sm text-slate-500 mb-4">
                  <PrismicRichText field={contact_description} />
                </div>
              )}
              <form className="space-y-3" onSubmit={handleContactSubmit}>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-1"
                    htmlFor="contact-name"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-1"
                    htmlFor="contact-email"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 mb-1"
                    htmlFor="contact-message"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="How can we help?"
                    rows={4}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
                  />
                </div>
                {show_newsletter_checkbox !== false && (
                  <div className="flex items-center gap-2">
                    <input
                      id="contact-newsletter"
                      type="checkbox"
                      name="newsletter"
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <label
                      htmlFor="contact-newsletter"
                      className="text-xs text-slate-600"
                    >
                      Also sign me up for the newsletter
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
                >
                  {contact_button_text || "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
