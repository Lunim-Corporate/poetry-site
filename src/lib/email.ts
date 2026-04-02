import { Resend } from "resend";

export interface EmailEntry {
  name: string;
  email: string;
  quantity: number;
  priceGBP: number;
  paymentId: string;
  reference: string;
  /** Book titles in order; used for admin email listing. */
  bookTitles?: string[];
  shipping: {
    name: string;
    street: string;
    town: string;
    postcode: string;
    country: string;
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY environment variable.");
  return new Resend(apiKey);
}

function formatShipping(shipping: EmailEntry["shipping"]): string {
  return [
    shipping.name,
    ...shipping.street.split("\n"),
    shipping.town,
    shipping.postcode,
    shipping.country,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendEntrantConfirmation(entry: EmailEntry): Promise<void> {
  const resend = getResend();
  const fromEmail = process.env.EMAIL_FROM!;
  const bookWord = entry.quantity === 1 ? "book" : "books";
  const shippingFormatted = formatShipping(entry.shipping);

  await resend.emails.send({
    from: fromEmail,
    to: entry.email,
    subject: "Your Maya Poetry Book Awards entry is confirmed",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h1 style="font-size: 22px; margin-bottom: 4px;">Entry Confirmed</h1>
        <p style="color: #64748b; margin-top: 0;">Maya Poetry Book Awards</p>

        <p>Dear ${entry.name},</p>
        <p>
          Thank you for entering the Maya Poetry Book Awards. We have received your
          payment of <strong>£${entry.priceGBP}</strong> for
          <strong>${entry.quantity} ${bookWord}</strong>.
        </p>

        <h2 style="font-size: 16px; margin-bottom: 8px;">Next Step: Send Your ${entry.quantity === 1 ? "Book" : "Books"}</h2>
        <p>Please post your ${bookWord} to the address below:</p>
        <pre style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-family: inherit; font-size: 14px; white-space: pre-wrap;">${shippingFormatted}</pre>

        <p style="font-size: 13px; color: #64748b;">
          Reference: <strong>${entry.reference}</strong><br/>
          Payment ID: ${entry.paymentId}
        </p>

        <p style="font-size: 13px; color: #94a3b8;">
          If you have any questions, please reply to this email or use the contact form on our website.
        </p>
      </div>
    `,
  });
}

export async function sendAdminNotification(entry: EmailEntry): Promise<void> {
  const resend = getResend();
  const fromEmail = process.env.EMAIL_FROM!;
  const adminEmail = process.env.ADMIN_EMAIL!;

  if (!adminEmail) throw new Error("Missing ADMIN_EMAIL environment variable.");

  const bookWord = entry.quantity === 1 ? "book" : "books";
  const timestamp = new Date().toISOString();
  const titles = entry.bookTitles?.filter(Boolean) ?? [];
  const booksCell =
    titles.length > 0
      ? `<ol style="margin: 0; padding-left: 20px;">${titles.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ol>`
      : `${entry.quantity} ${bookWord}`;

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New entry: ${entry.name} — ${entry.reference}`,
    html: `
      <div style="font-family: monospace; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="font-family: Georgia, serif; font-size: 18px;">New Entry Received</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b; vertical-align: top;">Name</td><td>${entry.name}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b; vertical-align: top;">Email</td><td>${entry.email}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b; vertical-align: top;">Books</td><td>${booksCell}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b;">Amount</td><td>£${entry.priceGBP}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b;">Reference</td><td>${entry.reference}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b;">Payment ID</td><td>${entry.paymentId}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #64748b;">Timestamp</td><td>${timestamp}</td></tr>
        </table>
      </div>
    `,
  });
}
