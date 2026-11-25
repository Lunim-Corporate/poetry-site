"use client";

import { type ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";

export type JudgingTableRow = {
  id: string;
  applicantName: string;
  bookTitle: string;
  reference: string;
  /** ISO date — shown as Entered date */
  enteredDate: string;
  stageLabel: string;
  /** Head-judge columns */
  judgeName?: string | null;
  paymentAmountGBP?: number;
};

export type JudgingEntriesTableProps = {
  rows: JudgingTableRow[];
  /** Extra columns for the head-judge competition overview */
  variant?: "sub_judge" | "head_judge";
  renderExpanded: (row: JudgingTableRow) => ReactNode;
  emptyMessage?: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatGBP(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

/**
 * Shared expandable entries table for sub-judge and head-judge dashboards.
 * One expand control per row reveals an inline detail panel underneath.
 */
export default function JudgingEntriesTable({
  rows,
  variant = "sub_judge",
  renderExpanded,
  emptyMessage = "No entries to show",
}: JudgingEntriesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const showHeadCols = variant === "head_judge";
  /** Expand control + data columns */
  const colCount = showHeadCols ? 8 : 6;

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (rows.length === 0) {
    return (
      <p className="text-base text-slate-500 py-8 text-center border border-dashed border-slate-200 rounded-lg">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-x-auto">
      <table className="w-full text-left text-sm min-w-[640px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="w-10 px-2 py-2.5" scope="col">
              <span className="sr-only">Expand</span>
            </th>
            <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
              Applicant
            </th>
            <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
              Book title
            </th>
            <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
              Reference
            </th>
            <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
              Entered date
            </th>
            <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
              Stage
            </th>
            {showHeadCols && (
              <>
                <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
                  Judge
                </th>
                <th className="px-3 py-2.5 font-semibold text-slate-600" scope="col">
                  Payment
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const expanded = expandedId === row.id;
            return (
              <TableRowGroup
                key={row.id}
                row={row}
                expanded={expanded}
                showHeadCols={showHeadCols}
                colCount={colCount}
                onToggle={() => toggle(row.id)}
                renderExpanded={renderExpanded}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TableRowGroup({
  row,
  expanded,
  showHeadCols,
  colCount,
  onToggle,
  renderExpanded,
}: {
  row: JudgingTableRow;
  expanded: boolean;
  showHeadCols: boolean;
  colCount: number;
  onToggle: () => void;
  renderExpanded: (row: JudgingTableRow) => ReactNode;
}) {
  return (
    <>
      <tr className={expanded ? "bg-slate-50/80" : "bg-white hover:bg-slate-50/40"}>
        <td className="px-2 py-2.5 align-middle">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? `Collapse details for ${row.bookTitle}`
                : `Expand details for ${row.bookTitle}`
            }
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </td>
        <td className="px-3 py-2.5 font-medium text-slate-900 align-middle">
          {row.applicantName}
        </td>
        <td className="px-3 py-2.5 italic text-slate-800 align-middle">{row.bookTitle}</td>
        <td className="px-3 py-2.5 font-semibold tracking-wide text-slate-700 align-middle whitespace-nowrap">
          {row.reference}
        </td>
        <td className="px-3 py-2.5 text-slate-600 align-middle whitespace-nowrap">
          {formatDate(row.enteredDate)}
        </td>
        <td className="px-3 py-2.5 text-slate-700 align-middle whitespace-nowrap">
          {row.stageLabel}
        </td>
        {showHeadCols && (
          <>
            <td className="px-3 py-2.5 text-slate-700 align-middle">
              {row.judgeName ?? (
                <span className="font-medium text-amber-800">Unassigned</span>
              )}
            </td>
            <td className="px-3 py-2.5 text-slate-700 align-middle tabular-nums whitespace-nowrap">
              {typeof row.paymentAmountGBP === "number"
                ? formatGBP(row.paymentAmountGBP)
                : "—"}
            </td>
          </>
        )}
      </tr>
      {expanded && (
        <tr className="bg-slate-50/60">
          <td colSpan={colCount} className="px-4 py-4 border-t border-slate-100">
            {renderExpanded(row)}
          </td>
        </tr>
      )}
    </>
  );
}

export { formatGBP };
