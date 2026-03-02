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
    <div className="space-y-6">
      {/* Newsletter Card */}
      <aside
        id="newsletter"
        className="bg-[#F9F5EF] border border-[#B7A08F] rounded-xl p-6"
        aria-label="Newsletter sign-up"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">Newsletter</h3>
        <p className="text-sm text-[#333333] mb-5">
          Want to be kept informed? No spam - just relevant updates.
        </p>
        {newsletterSuccess ? (
          <p className="text-sm text-[#333333]">
            <strong>Thank you!</strong> You&apos;ve been added to our mailing
            list.
          </p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={handleNewsletterSubmit}
            noValidate
          >
            <div className="mb-8">
              <label
                className="block text-md font-bold text-[#333333] mb-3"
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
                className="w-full px-4 py-2.5 text-sm border-2 border-[#999999] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
              />
              {newsletterError && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {newsletterError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={newsletterSubmitting}
              className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-400 text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {newsletterSubmitting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {newsletterSubmitting ? "Signing up..." : "Sign up"}
            </button>
            <p className="text-sm text-[#333333]">
              By signing up, you agree to receive emails. You can unsubscribe at
              any time.
            </p>
          </form>
        )}
      </aside>

      {/* Contact Card */}
      <aside
        id="contact-form"
        className="bg-[#F9F5EF] border border-[#B7A08F] rounded-xl p-6"
        aria-label="Contact form"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Contact Us
        </h3>
        <p className="text-sm text-[#333333] mb-5">
          Send us a message and we&apos;ll get back to you.
        </p>
        {contactSuccess ? (
          <p className="text-sm text-[#333333]">
            <strong>
              Thank you{contactData.name ? `, ${contactData.name}` : ""}!
            </strong>{" "}
            We&apos;ll be in touch soon.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={handleContactSubmit} noValidate>
            <div className="mb-8">
              <label
                className="block text-md font-bold text-[#333333] mb-3"
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
                  if (contactErrors.name)
                    setContactErrors({ ...contactErrors, name: "" });
                }}
                className="w-full px-4 py-2.5 text-sm border-2 border-[#999999] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
              />
              {contactErrors.name && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {contactErrors.name}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label
                className="block text-md font-bold text-[#333333] mb-3"
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
                  if (contactErrors.email)
                    setContactErrors({ ...contactErrors, email: "" });
                }}
                className="w-full px-4 py-2.5 text-sm border-2 border-[#999999] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
              />
              {contactErrors.email && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {contactErrors.email}
                </p>
              )}
            </div>
            <div className="mb-8">
              <label
                className="block text-md font-bold text-[#333333] mb-3"
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
                  if (contactErrors.message)
                    setContactErrors({ ...contactErrors, message: "" });
                }}
                className="w-full px-4 py-2.5 text-sm border-2 border-[#999999] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y bg-white"
              />
              {contactErrors.message && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {contactErrors.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mb-6">
              <input
                id="sidebar-contact-newsletter"
                type="checkbox"
                name="newsletter"
                checked={contactData.newsletter}
                onChange={(e) =>
                  setContactData({
                    ...contactData,
                    newsletter: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-primary rounded"
              />
              <label
                htmlFor="sidebar-contact-newsletter"
                className="text-sm font-bold text-[#333333]"
              >
                Sign me up to your newsletter
              </label>
            </div>
            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-400 text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
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
