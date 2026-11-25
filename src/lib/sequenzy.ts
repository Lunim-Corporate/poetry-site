/**
 * Sequenzy newsletter subscriber client.
 * Docs: https://docs.sequenzy.com/api-reference/subscribers/create
 * Auth: Settings → API Keys & SMTP in the Sequenzy dashboard.
 */

function skipSequenzy(): boolean {
  return process.env.SKIP_SEQUENZY?.trim().toLowerCase() === "true";
}

function getSequenzyConfig(): {
  apiKey: string;
  listId?: string;
  companyId?: string;
} | null {
  const apiKey = process.env.SEQUENZY_API_KEY?.trim();
  if (!apiKey) return null;
  const listId = process.env.SEQUENZY_LIST_ID?.trim() || undefined;
  const companyId = process.env.SEQUENZY_COMPANY_ID?.trim() || undefined;
  return { apiKey, listId, companyId };
}

/** Split a full name into first + last (last = remainder after first word). */
export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export type SequenzyResult = { ok: true } | { ok: false; error: string };

type SequenzyApiResponse = {
  success?: boolean;
  error?: string;
  subscriber?: { skipped?: boolean; created?: boolean; updated?: boolean };
};

/**
 * Create or update a Sequenzy subscriber (POST /api/v1/subscribers).
 * Pass firstName/lastName when available (e.g. contact form / enter wizard).
 * Uses optInMode "confirmed" because the user opted in via our UI.
 * duplicateStrategy "merge" fills missing fields without overwriting existing data.
 */
export async function upsertSubscriber(
  email: string,
  fields?: { firstName?: string; lastName?: string }
): Promise<SequenzyResult> {
  if (skipSequenzy()) {
    console.info("[sequenzy] SKIP_SEQUENZY=true; skipping subscriber upsert.");
    return { ok: true };
  }

  const cfg = getSequenzyConfig();
  if (!cfg) {
    console.error("Missing Sequenzy environment variables.");
    return { ok: false, error: "Server configuration error." };
  }

  const body: Record<string, unknown> = {
    email: email.trim(),
    status: "active",
    optInMode: "confirmed",
    duplicateStrategy: "merge",
  };

  if (fields?.firstName?.trim()) body.firstName = fields.firstName.trim();
  if (fields?.lastName?.trim()) body.lastName = fields.lastName.trim();
  if (cfg.listId) body.lists = [cfg.listId];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cfg.apiKey}`,
  };
  if (cfg.companyId) {
    headers["x-company-id"] = cfg.companyId;
  }

  try {
    const response = await fetch("https://api.sequenzy.com/api/v1/subscribers", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as SequenzyApiResponse;

    // Existing subscribers with duplicateStrategy "skip"/"merge" still return success.
    if (response.ok && data.success !== false) {
      return { ok: true };
    }

    console.error("Sequenzy error:", {
      status: response.status,
      error: data.error ?? "unknown",
    });
    return { ok: false, error: data.error ?? "Subscription failed." };
  } catch (err) {
    console.error("Sequenzy network error:", err instanceof Error ? err.message : "unknown");
    return { ok: false, error: "Subscription failed." };
  }
}
