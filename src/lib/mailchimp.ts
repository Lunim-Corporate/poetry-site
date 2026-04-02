import { createHash } from "node:crypto";

function getMailchimpConfig(): { apiKey: string; audienceId: string; dc: string } | null {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;
  const dc = apiKey.split("-").pop();
  if (!dc) return null;
  return { apiKey, audienceId, dc };
}

/** Split a full name into first + last (last = remainder after first word). */
export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export type MailchimpResult = { ok: true } | { ok: false; error: string };

/**
 * Add or update a list member (Mailchimp Marketing API PUT upsert).
 * Use merge fields FNAME/LNAME when subscribing from contact form; omit for email-only newsletter.
 */
export async function upsertListMember(
  email: string,
  mergeFields?: { FNAME?: string; LNAME?: string }
): Promise<MailchimpResult> {
  const cfg = getMailchimpConfig();
  if (!cfg) {
    console.error("Missing Mailchimp environment variables.");
    return { ok: false, error: "Server configuration error." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hash = createHash("md5").update(normalizedEmail).digest("hex");

  const body: Record<string, unknown> = {
    email_address: email.trim(),
    status_if_new: "subscribed",
  };

  const mf: Record<string, string> = {};
  if (mergeFields?.FNAME?.trim()) mf.FNAME = mergeFields.FNAME.trim();
  if (mergeFields?.LNAME?.trim()) mf.LNAME = mergeFields.LNAME.trim();
  if (Object.keys(mf).length > 0) body.merge_fields = mf;

  const response = await fetch(
    `https://${cfg.dc}.api.mailchimp.com/3.0/lists/${cfg.audienceId}/members/${hash}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${cfg.apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (response.ok) return { ok: true };

  const data = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
  console.error("Mailchimp error:", data);
  return { ok: false, error: data.detail ?? "Subscription failed." };
}
