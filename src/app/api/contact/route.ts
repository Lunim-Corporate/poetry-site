import { NextRequest, NextResponse } from "next/server";
import { sendContactFormNotification } from "@/lib/email";
import { appendContactMessageRow } from "@/lib/googleSheets";
import { parseFullName, upsertListMember } from "@/lib/mailchimp";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { name, email, message, newsletter } = body as {
    name?: string;
    email?: string;
    message?: string;
    newsletter?: boolean;
  };

  if (!name?.trim() || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email?.trim() || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  if (!message?.trim() || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const wantsNewsletter = Boolean(newsletter);

  try {
    await sendContactFormNotification({
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      newsletterOptIn: wantsNewsletter,
    });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return NextResponse.json(
      { error: "Could not send your message. Please try again later." },
      { status: 500 }
    );
  }

  try {
    await appendContactMessageRow({
      timestamp: new Date().toISOString(),
      name: trimmedName,
      email: trimmedEmail,
      newsletter: wantsNewsletter ? "Yes" : "No",
      message: trimmedMessage,
    });
  } catch (err) {
    console.error("Contact form Google Sheets append failed:", err);
    return NextResponse.json(
      { error: "Could not save your message. Please try again later." },
      { status: 500 }
    );
  }

  if (wantsNewsletter) {
    const { firstName, lastName } = parseFullName(trimmedName);
    const result = await upsertListMember(trimmedEmail, {
      FNAME: firstName,
      LNAME: lastName,
    });
    if (!result.ok) {
      console.error("Contact form: Mailchimp signup failed after email was sent:", result.error);
    }
  }

  return NextResponse.json({ success: true });
}
