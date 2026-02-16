"use client";

import { useState, FormEvent } from "react";

export default function Sidebar() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
    newsletter: false,
  });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !validateEmail(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }
    setNewsletterSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setNewsletterSubmitting(false);
    setNewsletterSuccess(true);
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!contactData.name.trim()) errors.name = "Please enter your name.";
    if (!contactData.email.trim() || !validateEmail(contactData.email))
      errors.email = "Please enter a valid email address.";
    if (!contactData.message.trim()) errors.message = "Please enter a message.";
    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }
    setContactSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setContactSubmitting(false);
    setContactSuccess(true);
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Newsletter Card */}
      <aside id="newsletter" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" aria-label="Newsletter sign-up">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Newsletter</h3>
        <p className="text-sm text-slate-500 mb-4">
          Want to be kept informed? No spam - just relevant updates.
        </p>
        {newsletterSuccess ? (
          <p className="text-sm text-slate-700">
            <strong>Thank you!</strong> You&apos;ve been added to our mailing list.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={handleNewsletterSubmit} noValidate>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="sidebar-newsletter-email"
              >
                Email
              </label>
              <input
                id="sidebar-newsletter-email"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterError) setNewsletterError("");
                }}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {newsletterError && (
                <p className="text-xs text-red-600 mt-1" role="alert">{newsletterError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="w-full bg-primary hover:bg-primary-light disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {newsletterSubmitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {newsletterSubmitting ? "Signing up..." : "Sign up"}
            </button>
            <p className="text-[11px] text-slate-400">
              By signing up, you agree to receive emails. You can unsubscribe at any time.
            </p>
          </form>
        )}
      </aside>

      {/* Contact Card */}
      <aside id="contact-form" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" aria-label="Contact form">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Contact Us</h3>
        <p className="text-sm text-slate-500 mb-4">
          Send us a message and we&apos;ll get back to you.
        </p>
        {contactSuccess ? (
          <p className="text-sm text-slate-700">
            <strong>Thank you{contactData.name ? `, ${contactData.name}` : ""}!</strong> We&apos;ll be in touch soon.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={handleContactSubmit} noValidate>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="sidebar-contact-name"
              >
                Name
              </label>
              <input
                id="sidebar-contact-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                value={contactData.name}
                onChange={(e) => {
                  setContactData({ ...contactData, name: e.target.value });
                  if (contactErrors.name) setContactErrors({ ...contactErrors, name: "" });
                }}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {contactErrors.name && (
                <p className="text-xs text-red-600 mt-1" role="alert">{contactErrors.name}</p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="sidebar-contact-email"
              >
                Email
              </label>
              <input
                id="sidebar-contact-email"
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                required
                value={contactData.email}
                onChange={(e) => {
                  setContactData({ ...contactData, email: e.target.value });
                  if (contactErrors.email) setContactErrors({ ...contactErrors, email: "" });
                }}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              {contactErrors.email && (
                <p className="text-xs text-red-600 mt-1" role="alert">{contactErrors.email}</p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="sidebar-contact-message"
              >
                Message
              </label>
              <textarea
                id="sidebar-contact-message"
                name="message"
                rows={5}
                required
                value={contactData.message}
                onChange={(e) => {
                  setContactData({ ...contactData, message: e.target.value });
                  if (contactErrors.message) setContactErrors({ ...contactErrors, message: "" });
                }}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
              />
              {contactErrors.message && (
                <p className="text-xs text-red-600 mt-1" role="alert">{contactErrors.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="sidebar-contact-newsletter"
                type="checkbox"
                name="newsletter"
                checked={contactData.newsletter}
                onChange={(e) => setContactData({ ...contactData, newsletter: e.target.checked })}
                className="w-4 h-4 accent-primary rounded"
              />
              <label htmlFor="sidebar-contact-newsletter" className="text-xs text-slate-600">
                Sign me up to your newsletter
              </label>
            </div>
            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full bg-primary hover:bg-primary-light disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {contactSubmitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {contactSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
