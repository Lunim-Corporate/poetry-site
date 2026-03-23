import { google } from "googleapis";

export interface EntryRow {
  name: string;
  email: string;
  quantity: number;
  priceGBP: number;
  paymentId: string;
}

export async function appendEntryToSheet(entry: EntryRow): Promise<string> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error("Missing Google Sheets environment variables.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:G",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          timestamp,
          entry.name,
          entry.email,
          entry.quantity,
          `£${entry.priceGBP}`,
          entry.paymentId,
          "paid",
        ],
      ],
    },
  });

  // Extract the row number from the updated range (e.g. "Sheet1!A5:G5") and
  // build a direct link so admins can jump straight to this entry.
  const updatedRange = response.data.updates?.updatedRange ?? "";
  const rowMatch = updatedRange.match(/[A-Z](\d+):/);
  const rowNumber = rowMatch ? rowMatch[1] : "1";

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0&range=A${rowNumber}`;
}
