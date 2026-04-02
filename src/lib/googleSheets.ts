import { google } from "googleapis";

const DEFAULT_SHEET_TAB_NAME = "Entries";
const SHEET_GID = 0;
/** Max sheet row when scanning for token (`A2:J{n}`). Keep modest — large n slows every lookup. */
const TOKEN_SCAN_MAX_ROW = 5_000;

/** Compare tab titles; strips zero-width/BOM and normalizes Unicode so UI/API mismatches still match. */
function normalizeTabTitleForMatch(title: string): string {
  return title
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Resolves the real tab title from the spreadsheet (no long-lived cache — tab list can change).
 * Order: `GOOGLE_SHEETS_TAB_NAME` env → tab named "Entries" (normalized match) → tab with sheetId 0 → first tab.
 */
async function resolveTabTitle(): Promise<string> {
  const env = process.env.GOOGLE_SHEETS_TAB_NAME?.trim();
  if (env) {
    return env;
  }

  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.get({ spreadsheetId });
  const list = res.data.sheets ?? [];
  const tabList = list.map((s) => s.properties?.title).filter(Boolean) as string[];

  const byDefaultName = list.find(
    (s) =>
      normalizeTabTitleForMatch(s.properties?.title ?? "") ===
      normalizeTabTitleForMatch(DEFAULT_SHEET_TAB_NAME)
  );
  const byGid = list.find((s) => s.properties?.sheetId === SHEET_GID);
  const firstTitle = list[0]?.properties?.title;

  let picked: string;
  let branch: string;

  if (byDefaultName?.properties?.title) {
    picked = byDefaultName.properties.title;
    branch = "matchedEntries";
  } else if (byGid?.properties?.title) {
    picked = byGid.properties.title;
    branch = "sheetId0";
  } else if (firstTitle) {
    picked = firstTitle;
    branch = "firstTab";
  } else {
    throw new Error("Google Spreadsheet has no sheets.");
  }

  if (branch === "sheetId0" || branch === "firstTab") {
    console.warn(
      `[googleSheets] No tab named "${DEFAULT_SHEET_TAB_NAME}" in this spreadsheet. Writing to "${picked}" instead. Available tabs: ${tabList.join(", ")}. Add an "${DEFAULT_SHEET_TAB_NAME}" tab here, or set GOOGLE_SHEETS_TAB_NAME to one of these titles (or fix GOOGLE_SHEETS_SPREADSHEET_ID if the data lives in another file).`
    );
  }

  return picked;
}

/**
 * A1 range with sheet tab name. Quote only when required (spaces, etc.).
 */
function sheetRange(a1: string, tabName: string): string {
  const needsQuotes =
    /[\s']/.test(tabName) || /^\d/.test(tabName) || !/^[A-Za-z0-9_-]+$/.test(tabName);
  if (needsQuotes) {
    const escaped = tabName.replace(/'/g, "''");
    return `'${escaped}'!${a1}`;
  }
  return `${tabName}!${a1}`;
}
// Final column layout (after moving bookTitles + adding reference):
// A: reference (MAYA-YYYY-XXXXXXXX), B: createdAt, C: name, D: email, E: phone,
// F: quantity, G: bookTitles, H: priceGBP, I: paymentId, J: token,
// K: status, L: rulesConfirmed, M: paidAt
const ROW_WIDTH = 13;

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
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
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
  const tab = await resolveTabTitle();

  // Use a rectangular range (A2:J…), not `J2:J…` — some API paths reject single-column
  // bounded ranges as "Unable to parse range". Token is column J (index 9).
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange(`A2:J${TOKEN_SCAN_MAX_ROW}`, tab),
  });

  const values = response.data.values ?? [];
  const index = values.findIndex((row) => String(row[9] ?? "").trim() === token);

  return index === -1 ? null : index + 2;
}

async function getRowValues(rowNumber: number): Promise<(string | number)[]> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();
  const tab = await resolveTabTitle();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    // read A -> M
    range: sheetRange(`A${rowNumber}:M${rowNumber}`, tab),
  });

  return normalizeRow(response.data.values?.[0] ?? []);
}

async function updateRowValues(rowNumber: number, values: (string | number)[]): Promise<void> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();
  const tab = await resolveTabTitle();

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: sheetRange(`A${rowNumber}:M${rowNumber}`, tab),
    valueInputOption: "RAW",
    requestBody: {
      values: [normalizeRow(values)],
    },
  });
}

async function appendRow(values: (string | number)[]): Promise<number> {
  const { spreadsheetId } = getSheetsConfig();
  const sheets = await getSheetsClient();
  const tab = await resolveTabTitle();

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange(`A:M`, tab),
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
    // index 0 is reference, which we don't know yet at "incomplete" stage
    current[2] = entry.name;
    current[3] = entry.email;
    current[4] = entry.phone;
    current[5] = entry.quantity;
    current[6] = bookTitlesCell;
    current[7] = entry.priceGBP;
    current[8] = "";
    current[9] = entry.token;
    current[10] = "Incomplete";
    current[11] = entry.rulesConfirmed ? "Yes" : "No";
    current[12] = "";

    await updateRowValues(rowNumber, current);
    return buildRowUrl(spreadsheetId, rowNumber);
  }

  const newRowNumber = await appendRow([
    "", // reference
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

  const reference = `MAYA-${new Date().getFullYear()}-${entry.paymentId.slice(-8).toUpperCase()}`;

  const current: (string | number)[] = await getRowValues(rowNumber);

  current[0] = reference;
  current[5] = entry.quantity;
  if (entry.bookTitles) {
    current[6] = entry.bookTitles.join(", ");
  }
  current[7] = entry.priceGBP;
  current[8] = entry.paymentId;
  current[9] = entry.token;
  current[10] = "Paid";
  current[12] = entry.paidAt;

  await updateRowValues(rowNumber, current);

  return buildRowUrl(spreadsheetId, rowNumber);
}
