import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("Missing Mailchimp environment variables.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  // The datacenter is the suffix of the API key (e.g. "us14" from "abc123-us14")
  const dc = apiKey.split("-").pop();

  const response = await fetch(
    `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({ email_address: email, status: "subscribed" }),
    }
  );

  if (response.ok) {
    return NextResponse.json({ success: true });
  }

  const data = await response.json();

  // Member already subscribed — treat as success so the user isn't confused
  if (data.title === "Member Exists") {
    return NextResponse.json({ success: true });
  }

  console.error("Mailchimp error:", data);
  return NextResponse.json({ error: data.detail ?? "Subscription failed." }, { status: 500 });
}
