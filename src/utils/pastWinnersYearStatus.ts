import type { ListEntry, WinnerEntry } from "@/types";

export type PastWinnersYearStatus = "hidden" | "winners" | "shortlist" | "longlist";

function hasBookEntries(
  entries: Array<{ book_title?: string }> | undefined
): boolean {
  return (entries ?? []).some((entry) => Boolean(entry.book_title?.trim()));
}

/** Resolve listing/nav visibility from winners, shortlist, and longlist content. */
export function getPastWinnersYearStatus(data: {
  winners?: WinnerEntry[];
  shortlist?: ListEntry[];
  longlist?: ListEntry[];
}): PastWinnersYearStatus {
  if (hasBookEntries(data.winners)) return "winners";
  if (hasBookEntries(data.shortlist)) return "shortlist";
  if (hasBookEntries(data.longlist)) return "longlist";
  return "hidden";
}

export function getPastWinnersNavLabel(
  year: number,
  status: Exclude<PastWinnersYearStatus, "hidden">
): string {
  switch (status) {
    case "shortlist":
      return `${year} Shortlist`;
    case "longlist":
      return `${year} Longlist`;
    default:
      return `${year} Winners`;
  }
}
