import { NextRequest, NextResponse } from "next/server";
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

  if (newsletter) {
    const { firstName, lastName } = parseFullName(name);
    const result = await upsertListMember(email.trim(), {
      FNAME: firstName,
      LNAME: lastName,
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
