"use client";

import { useState, FormEvent } from "react";

export default function Sidebar() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
    newsletter: false,
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNewsletterSuccess(true);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Newsletter Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Newsletter</h3>
        <p className="text-sm text-slate-500 mb-4">
          Stay updated with award news, deadlines, and winner announcements.
        </p>
        {newsletterSuccess ? (
          <p className="text-sm text-slate-700">
            <strong>Thank you!</strong> You&apos;ve been added to our mailing list.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
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
                placeholder="you@example.com"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Contact Card */}
      <div id="contact" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Contact Us</h3>
        <p className="text-sm text-slate-500 mb-4">
          Have questions? We&apos;re here to help.
        </p>
        {contactSuccess ? (
          <p className="text-sm text-slate-700">
            <strong>Thank you{contactData.name ? `, ${contactData.name}` : ""}!</strong> We&apos;ll be in touch soon.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={handleContactSubmit}>
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
                placeholder="Your name"
                required
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
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
                placeholder="you@example.com"
                required
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
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
                placeholder="How can we help?"
                rows={4}
                required
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
              />
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
                Also sign me up for the newsletter
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
