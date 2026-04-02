import { google } from "googleapis";

const SHEET_NAME = "Sheet1";
const SHEET_GID = 0;
// Final column layout (after moving bookTitles):
// A: createdAt, B: name, C: email, D: phone, E: quantity,
// F: bookTitles, G: priceGBP, H: paymentId, I: token, J: status,
// K: rulesConfirmed, L: paidAt
const ROW_WIDTH = 12;

export interface IncompleteEntryRow {
  token: string;
  rulesConfirmed: boolean;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  priceGBP: number;
  bookTitles: string[];
}

export interface PaidEntryUpdate {
  token: string;
  quantity: number;
  priceGBP: number;
  paymentId: string;
  paidAt: string;
  // Optional because some flows only sync paymentId/paidAt and rely on the
  // earlier incomplete upsert to have already written bookTitles.
  bookTitles?: string[];
}

function getSheetsConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!spreadsheetId || !clientEmail || !privateKey) {
    throw new Error("Missing Google Sheets environment variables.");
  }

  return { spreadsheetId, clientEmail, privateKey };
}

async function getSheetsClient() {
  const { clientEmail, privateKey } = getSheetsConfig();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function buildRowUrl(spreadsheetId: string, rowNumber: number): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${SHEET_GID}&range=A${rowNumber}`;
}

function normalizeRow(values: (string | number | null | undefined)[]): (string | number)[] {
  return Array.from({ length: ROW_WIDTH }, (_, index) => {
    const value = values?.[index];
    return value == null ? "" : value;
  });
}

async function findRowByToken(token: string): Promise<number | null> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    // token moved from H -> I
    range: `${SHEET_NAME}!I2:I`,
  });

  const values = response.data.values ?? [];
  const index = values.findIndex((row) => String(row[0] ?? "").trim() === token);

  return index === -1 ? null : index + 2;
}

async function getRowValues(rowNumber: number): Promise<(string | number)[]> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    // write/read A -> L
    range: `${SHEET_NAME}!A${rowNumber}:L${rowNumber}`,
  });

  return normalizeRow(response.data.values?.[0] ?? []);
}

async function updateRowValues(rowNumber: number, values: (string | number)[]): Promise<void> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!A${rowNumber}:L${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [normalizeRow(values)],
    },
  });
}

async function appendRow(values: (string | number)[]): Promise<number> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:L`,
    valueInputOption: "RAW",
    requestBody: {
      values: [normalizeRow(values)],
    },
  });

  const updatedRange = response.data.updates?.updatedRange ?? "";
  const rowMatch = updatedRange.match(/[A-Z]+(\d+):/);

  return rowMatch ? Number(rowMatch[1]) : 1;
}

export async function upsertIncompleteEntry(entry: IncompleteEntryRow): Promise<string> {
  const { spreadsheetId } = getSheetsConfig();
  const rowNumber = await findRowByToken(entry.token);

  const bookTitlesCell = (entry.bookTitles ?? []).join(", ");

  if (rowNumber) {
    const current: (string | number)[] = await getRowValues(rowNumber);
    current[1] = entry.name;
    current[2] = entry.email;
    current[3] = entry.phone;
    current[4] = entry.quantity;
    current[5] = bookTitlesCell;
    current[6] = entry.priceGBP;
    current[7] = "";
    current[8] = entry.token;
    current[9] = "Incomplete";
    current[10] = entry.rulesConfirmed ? "Yes" : "No";
    current[11] = "";

    await updateRowValues(rowNumber, current);
    return buildRowUrl(spreadsheetId, rowNumber);
  }

  const newRowNumber = await appendRow([
    new Date().toISOString(),
    entry.name,
    entry.email,
    entry.phone,
    entry.quantity,
    bookTitlesCell,
    entry.priceGBP,
    "",
    entry.token,
    "Incomplete",
    entry.rulesConfirmed ? "Yes" : "No",
    "",
  ]);

  return buildRowUrl(spreadsheetId, newRowNumber);
}

export async function markEntryPaidByToken(entry: PaidEntryUpdate): Promise<string> {
  const { spreadsheetId } = getSheetsConfig();
  const rowNumber = await findRowByToken(entry.token);

  if (!rowNumber) {
    throw new Error("Could not find existing Google Sheets row for entry token.");
  }

  const current: (string | number)[] = await getRowValues(rowNumber);
  current[4] = entry.quantity;
  if (entry.bookTitles) {
    current[5] = entry.bookTitles.join(", ");
  }
  current[6] = entry.priceGBP;
  current[7] = entry.paymentId;
  current[8] = entry.token;
  current[9] = "Paid";
  current[11] = entry.paidAt;

  await updateRowValues(rowNumber, current);

  return buildRowUrl(spreadsheetId, rowNumber);
}
