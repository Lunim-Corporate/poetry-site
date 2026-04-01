import { NextRequest, NextResponse } from "next/server";
import { markEntryPaidByToken } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, paymentId, bookCount, totalGBP, paidAt, bookTitles } = body as {
      token?: string;
      paymentId?: string;
      bookCount?: number;
      totalGBP?: number;
      paidAt?: string;
      bookTitles?: string[];
    };

    if (!token || !paymentId || !bookCount || !totalGBP || !paidAt) {
      return NextResponse.json(
        { error: "Missing payment sync details." },
        { status: 400 }
      );
    }

    const sheetRowUrl = await markEntryPaidByToken({
      token,
      quantity: bookCount,
      priceGBP: totalGBP,
      paymentId,
      paidAt,
      bookTitles: bookTitles ?? [],
    });

    return NextResponse.json({ ok: true, sheetRowUrl });
  } catch (err) {
    console.error("Failed to sync paid entry to Google Sheets:", err);
    return NextResponse.json(
      { error: "Failed to sync paid entry." },
      { status: 500 }
    );
  }
}
