import { NextRequest, NextResponse } from "next/server";
import { upsertSubscriber } from "@/lib/sequenzy";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const result = await upsertSubscriber(email.trim());
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
