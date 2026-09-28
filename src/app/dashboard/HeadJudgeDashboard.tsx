"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HEAD_JUDGE_TOTAL_SUB_JUDGES,
  LONGLIST_CAP,
  MOCK_HEAD_SUB_JUDGES,
  PLACEMENT_OPTIONS,
  PRIZE_CAP,
  SHORTLIST_CAP,
  countPlacementMembership,
  getMockHeadJudgeState,
  isPrizePlacement,
  persistMockHeadJudgeState,
  placementLabel,
  placementMatchesFilter,
  type HeadJudgePlacement,
  type HeadJudgePrizePlacement,
} from "@/lib/mockHeadJudgeData";
import {
  MOCK_ORGANISER_ENTRIES,
  MOCK_ORGANISER_SUB_JUDGES,
  ORGANISER_STAGE_FILTER_OPTIONS,
  isAdvancedToHeadJudge,
  organiserStageLabel,
  totalPaymentsCollectedGBP,
  type MockOrganiserEntry,
  type OrganiserPipelineStage,
} from "@/lib/mockOrganiserData";
import DashboardHeaderActions from "@/components/DashboardHeaderActions";
import JudgingEntriesTable, {
  formatGBP,
  type JudgingTableRow,
} from "@/components/JudgingEntriesTable";

type HeadJudgeDashboardProps = {
  judgeName: string;
  judgeEmail: string;
  onSignOut: () => void;
  onDemoDataReset: () => void;
};

type PendingPrizeReplace = {
  entryId: string;
  prize: HeadJudgePrizePlacement;
  previousEntryId: string;
};

type SortOption =
  | "date_received"
  | "book_title"
  | "applicant_name"
  | "payment"
  | "placement";
type PlacementFilter = "all" | HeadJudgePlacement;
type StageFilter = "all" | OrganiserPipelineStage;
type ReceivedFilter = "all" | "received" | "awaiting";

/** Lower rank = higher placement for "Placement (highest first)" sort. */
function placementSortRank(placement: HeadJudgePlacement): number {
  switch (placement) {
    case "first_prize":
      return 0;
    case "second_prize":
      return 1;
    case "third_prize":
      return 2;
    case "childrens_prize":
      return 3;
    case "shortlist":
      return 4;
    case "longlist":
      return 5;
    case "none":
    default:
      return 6;
  }
}

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A]";

const selectClassName =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed";

const notesClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A] min-h-[88px] resize-y disabled:bg-slate-100 disabled:text-slate-500";

function entryToRow(entry: MockOrganiserEntry): JudgingTableRow {
  return {
    id: entry.id,
    applicantName: entry.applicantName,
    bookTitle: entry.bookTitle,
    reference: entry.reference,
    enteredDate: entry.dateReceived,
    stageLabel: organiserStageLabel(entry.stage),
    judgeName: entry.subJudgeName,
    paymentAmountGBP: entry.paymentAmountGBP,
  };
}

export default function HeadJudgeDashboard({
  judgeName,
  judgeEmail,
  onSignOut,
  onDemoDataReset,
}: HeadJudgeDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [judgeFilter, setJudgeFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [placementFilter, setPlacementFilter] = useState<PlacementFilter>("all");
  const [receivedFilter, setReceivedFilter] = useState<ReceivedFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_received");
  const [placements, setPlacements] = useState<Record<string, HeadJudgePlacement>>({});
  const [receivedIds, setReceivedIds] = useState<Set<string>>(new Set());
  const [headNotes, setHeadNotes] = useState<Record<string, string>>({});
  const [finalized, setFinalized] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [confirmFinalizeOpen, setConfirmFinalizeOpen] = useState(false);
  const [pendingPrizeReplace, setPendingPrizeReplace] =
    useState<PendingPrizeReplace | null>(null);
  const [capWarning, setCapWarning] = useState<string | null>(null);

  const allEntries = MOCK_ORGANISER_ENTRIES;
  const advancedEntries = useMemo(
    () => allEntries.filter(isAdvancedToHeadJudge),
    [allEntries]
  );
  const subJudges = MOCK_HEAD_SUB_JUDGES;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = getMockHeadJudgeState();
      setPlacements(saved.placements);
      setReceivedIds(new Set(saved.receivedIds));
      setHeadNotes(saved.headNotes);
      setFinalized(saved.finalized);
      setLoading(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    persistMockHeadJudgeState({
      placements,
      finalized,
      receivedIds: Array.from(receivedIds),
      headNotes,
    });
  }, [placements, finalized, receivedIds, headNotes, loading]);

  const collectedGBP = useMemo(
    () => totalPaymentsCollectedGBP(allEntries),
    [allEntries]
  );

  const membership = useMemo(
    () => countPlacementMembership(placements),
    [placements]
  );

  const submittedCount = subJudges.filter((j) => j.submitted).length;
  const allSubmitted = submittedCount === HEAD_JUDGE_TOTAL_SUB_JUDGES;
  const incompleteSubmissions = !allSubmitted;
  const booksReceivedCount = advancedEntries.filter((e) =>
    receivedIds.has(e.id)
  ).length;
  const placedCount = Object.values(placements).filter((p) => p !== "none").length;

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = allEntries.filter((entry) => {
      if (judgeFilter === "unassigned" && entry.subJudgeId !== null) return false;
      if (
        judgeFilter !== "all" &&
        judgeFilter !== "unassigned" &&
        entry.subJudgeId !== judgeFilter
      ) {
        return false;
      }
      if (stageFilter !== "all" && entry.stage !== stageFilter) return false;

      if (placementFilter !== "all") {
        if (!isAdvancedToHeadJudge(entry)) return false;
        const placement = placements[entry.id] ?? "none";
        if (!placementMatchesFilter(placement, placementFilter)) return false;
      }

      if (receivedFilter !== "all") {
        if (!isAdvancedToHeadJudge(entry)) return false;
        const isReceived = receivedIds.has(entry.id);
        if (receivedFilter === "received" && !isReceived) return false;
        if (receivedFilter === "awaiting" && isReceived) return false;
      }

      if (!q) return true;
      if (entry.applicantName.toLowerCase().includes(q)) return true;
      if (entry.reference.toLowerCase().includes(q)) return true;
      if (entry.bookTitle.toLowerCase().includes(q)) return true;
      if (entry.subJudgeName?.toLowerCase().includes(q)) return true;
      return false;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "book_title":
          return a.bookTitle.localeCompare(b.bookTitle);
        case "applicant_name":
          return a.applicantName.localeCompare(b.applicantName);
        case "payment":
          return b.paymentAmountGBP - a.paymentAmountGBP;
        case "placement": {
          const rankA = placementSortRank(placements[a.id] ?? "none");
          const rankB = placementSortRank(placements[b.id] ?? "none");
          if (rankA !== rankB) return rankA - rankB;
          return a.dateReceived.localeCompare(b.dateReceived);
        }
        case "date_received":
        default:
          return a.dateReceived.localeCompare(b.dateReceived);
      }
    });

    return list;
  }, [
    allEntries,
    searchQuery,
    judgeFilter,
    stageFilter,
    placementFilter,
    receivedFilter,
    placements,
    receivedIds,
    sortBy,
  ]);

  const tableRows = useMemo(
    () => filteredEntries.map(entryToRow),
    [filteredEntries]
  );

  const entryById = useMemo(() => {
    const map = new Map<string, MockOrganiserEntry>();
    for (const e of allEntries) map.set(e.id, e);
    return map;
  }, [allEntries]);

  const placedByTier = useMemo(() => {
    const groups: Record<
      Exclude<HeadJudgePlacement, "none">,
      MockOrganiserEntry[]
    > = {
      first_prize: [],
      second_prize: [],
      third_prize: [],
      childrens_prize: [],
      shortlist: [],
      longlist: [],
    };
    for (const entry of advancedEntries) {
      const p = placements[entry.id];
      if (p && p !== "none") groups[p].push(entry);
    }
    return groups;
  }, [advancedEntries, placements]);

  function toggleBookReceived(entryId: string) {
    if (finalized) return;
    setReceivedIds((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) next.delete(entryId);
      else next.add(entryId);
      return next;
    });
  }

  function applyPlacement(entryId: string, next: HeadJudgePlacement) {
    setPlacements((prev) => {
      const updated = { ...prev };
      if (next === "none") {
        delete updated[entryId];
      } else {
        if (isPrizePlacement(next)) {
          for (const [id, p] of Object.entries(updated)) {
            if (p === next && id !== entryId) {
              updated[id] = "shortlist";
            }
          }
        }
        updated[entryId] = next;
      }
      return updated;
    });
  }

  function wouldExceedCaps(
    entryId: string,
    next: HeadJudgePlacement,
    current: Record<string, HeadJudgePlacement>
  ): string | null {
    const simulated = { ...current };
    if (next === "none") delete simulated[entryId];
    else {
      if (isPrizePlacement(next)) {
        for (const [id, p] of Object.entries(simulated)) {
          if (p === next && id !== entryId) simulated[id] = "shortlist";
        }
      }
      simulated[entryId] = next;
    }
    const counts = countPlacementMembership(simulated);
    if (counts.shortlist > SHORTLIST_CAP) {
      return `Shortlist is full (${SHORTLIST_CAP}/${SHORTLIST_CAP}). Remove a book from the shortlist before adding another.`;
    }
    if (counts.longlist > LONGLIST_CAP) {
      return `Longlist is full (${LONGLIST_CAP}/${LONGLIST_CAP}). Remove a book from the longlist before adding another.`;
    }
    return null;
  }

  function handlePlacementChange(entryId: string, next: HeadJudgePlacement) {
    if (finalized) return;
    setCapWarning(null);

    if (isPrizePlacement(next)) {
      const previousEntryId = Object.entries(placements).find(
        ([id, p]) => p === next && id !== entryId
      )?.[0];
      if (previousEntryId) {
        const capError = wouldExceedCaps(entryId, next, placements);
        if (capError) {
          setCapWarning(capError);
          return;
        }
        setPendingPrizeReplace({ entryId, prize: next, previousEntryId });
        return;
      }
    }

    const capError = wouldExceedCaps(entryId, next, placements);
    if (capError) {
      setCapWarning(capError);
      return;
    }

    applyPlacement(entryId, next);
  }

  function confirmReplacePrize() {
    if (!pendingPrizeReplace) return;
    applyPlacement(pendingPrizeReplace.entryId, pendingPrizeReplace.prize);
    setPendingPrizeReplace(null);
  }

  function updateHeadNote(entryId: string, value: string) {
    setHeadNotes((prev) => ({ ...prev, [entryId]: value }));
  }

  function finalizeResults() {
    setFinalized(true);
    setConfirmFinalizeOpen(false);
    setReviewOpen(false);
  }

  function renderExpanded(row: JudgingTableRow) {
    const entry = entryById.get(row.id);
    if (!entry) return null;

    if (!isAdvancedToHeadJudge(entry)) {
      return (
        <div className="max-w-xl space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Status:</span>{" "}
            {organiserStageLabel(entry.stage)}
          </p>
          <p>
            Assigned judge:{" "}
            <span className="font-medium text-slate-800">
              {entry.subJudgeName ?? "Unassigned"}
            </span>
          </p>
          <p className="text-slate-500">
            Full head-judge controls appear once this book is advanced from a
            sub-judge shortlist.
          </p>
        </div>
      );
    }

    const placement = placements[entry.id] ?? "none";
    const bookReceived = receivedIds.has(entry.id);
    const noteDraft = headNotes[entry.id] ?? "";

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_14rem] gap-4 max-w-3xl">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                bookReceived
                  ? "inline-flex items-center rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800"
                  : "inline-flex items-center rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-900"
              }
            >
              {bookReceived ? "Received" : "Awaiting book"}
            </span>
            {placement !== "none" && (
              <span className="inline-flex items-center rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {placementLabel(placement)}
              </span>
            )}
          </div>

          <div className="text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 leading-relaxed">
            <p className="font-medium text-slate-700 mb-1">Sub-judge&apos;s review</p>
            <p>{entry.subJudgeReview ?? "No review on record."}</p>
          </div>

          <div>
            <label
              htmlFor={`head-note-${entry.id}`}
              className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
            >
              Head judge&apos;s notes
            </label>
            <textarea
              id={`head-note-${entry.id}`}
              value={noteDraft}
              disabled={finalized}
              onChange={(e) => updateHeadNote(entry.id, e.target.value)}
              placeholder="Your private notes on this book…"
              className={notesClassName}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => toggleBookReceived(entry.id)}
            disabled={finalized}
            className={
              bookReceived
                ? "w-full border-2 border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition-colors disabled:opacity-50"
                : "w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2 px-3 rounded-lg text-sm transition-colors disabled:opacity-50"
            }
          >
            {bookReceived ? "Mark as awaiting" : "Mark as received"}
          </button>
          <div>
            <label
              htmlFor={`placement-${entry.id}`}
              className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
            >
              Set placement
            </label>
            <select
              id={`placement-${entry.id}`}
              value={placement}
              disabled={finalized}
              onChange={(e) =>
                handlePlacementChange(entry.id, e.target.value as HeadJudgePlacement)
              }
              className={`${selectClassName} w-full`}
            >
              {PLACEMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {placement !== "none" && (
              <p className="mt-1.5 text-[11px] text-slate-500 leading-snug">
                {isPrizePlacement(placement)
                  ? "Also counts toward Shortlist and Longlist."
                  : placement === "shortlist"
                    ? "Also counts toward Longlist."
                    : null}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <HeadJudgeSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Head judge dashboard</h1>
          <p className="text-base text-slate-500 mt-1">
            {judgeName} · competition overview and final placements
          </p>
          <p className="text-sm text-slate-400 mt-0.5">{judgeEmail}</p>
        </div>
        <DashboardHeaderActions
          role="head_judge"
          onSignOut={onSignOut}
          onDemoDataReset={onDemoDataReset}
        />
      </div>

      {finalized && (
        <div
          className="border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-base text-emerald-800"
          role="status"
        >
          Final results are locked. Placements can no longer be changed.
        </div>
      )}

      {/* Sub-judge submission status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sub-judge submissions</h2>
          <p className="text-base text-slate-500 mt-0.5">
            {submittedCount} of {HEAD_JUDGE_TOTAL_SUB_JUDGES} sub-judges have submitted
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {subJudges.map((judge) => (
            <li
              key={judge.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            >
              <span className="font-medium text-slate-800">{judge.name}</span>
              <span
                className={
                  judge.submitted
                    ? "font-semibold text-emerald-700"
                    : "font-semibold text-amber-800"
                }
              >
                {judge.submitted ? "Submitted" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* All competition entries */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">All entries</h2>
            <p className="text-base text-slate-500 mt-0.5">
              {allEntries.length} books across the competition
            </p>
            <p className="text-base font-medium text-slate-800 mt-1.5" role="status">
              {booksReceivedCount} of {advancedEntries.length} advanced books received
            </p>
          </div>
          <p
            className="text-base font-semibold text-slate-900 tabular-nums"
            role="status"
          >
            {formatGBP(collectedGBP)} collected so far
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2 text-xs font-semibold"
          role="status"
          aria-label="Placement capacity"
        >
          <CapChip
            label={`Longlist: ${membership.longlist}/${LONGLIST_CAP}`}
            full={membership.longlist >= LONGLIST_CAP}
          />
          <CapChip
            label={`Shortlist: ${membership.shortlist}/${SHORTLIST_CAP}`}
            full={membership.shortlist >= SHORTLIST_CAP}
          />
          <CapChip
            label={`1st Prize: ${membership.first_prize}/${PRIZE_CAP}`}
            full={membership.first_prize >= PRIZE_CAP}
          />
          <CapChip
            label={`2nd Prize: ${membership.second_prize}/${PRIZE_CAP}`}
            full={membership.second_prize >= PRIZE_CAP}
          />
          <CapChip
            label={`3rd Prize: ${membership.third_prize}/${PRIZE_CAP}`}
            full={membership.third_prize >= PRIZE_CAP}
          />
          <CapChip
            label={`Children's: ${membership.childrens_prize}/${PRIZE_CAP}`}
            full={membership.childrens_prize >= PRIZE_CAP}
          />
        </div>

        {incompleteSubmissions && (
          <div
            className="rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            Some judges haven&apos;t submitted yet — final decisions may be incomplete.
          </div>
        )}

        {capWarning && (
          <div
            className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 flex flex-wrap items-start justify-between gap-2"
            role="alert"
          >
            <p>{capWarning}</p>
            <button
              type="button"
              onClick={() => setCapWarning(null)}
              className="text-xs font-semibold underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label htmlFor="head-judge-search" className="sr-only">
              Search entries
            </label>
            <input
              id="head-judge-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, reference, book title, or judge"
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label
                htmlFor="filter-judge"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
              >
                Assigned judge
              </label>
              <select
                id="filter-judge"
                value={judgeFilter}
                onChange={(e) => setJudgeFilter(e.target.value)}
                className={`${selectClassName} w-full`}
              >
                <option value="all">All judges</option>
                <option value="unassigned">Unassigned</option>
                {MOCK_ORGANISER_SUB_JUDGES.map((judge) => (
                  <option key={judge.id} value={judge.id}>
                    {judge.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-stage"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
              >
                Stage
              </label>
              <select
                id="filter-stage"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as StageFilter)}
                className={`${selectClassName} w-full`}
              >
                {ORGANISER_STAGE_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-placement"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
              >
                Placement
              </label>
              <select
                id="filter-placement"
                value={placementFilter}
                onChange={(e) => setPlacementFilter(e.target.value as PlacementFilter)}
                className={`${selectClassName} w-full`}
              >
                <option value="all">All</option>
                {PLACEMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-received"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
              >
                Received status
              </label>
              <select
                id="filter-received"
                value={receivedFilter}
                onChange={(e) => setReceivedFilter(e.target.value as ReceivedFilter)}
                className={`${selectClassName} w-full`}
              >
                <option value="all">All</option>
                <option value="received">Received</option>
                <option value="awaiting">Awaiting book</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-entries"
                className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
              >
                Sort by
              </label>
              <select
                id="sort-entries"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className={`${selectClassName} w-full`}
              >
                <option value="date_received">Entered date (oldest first)</option>
                <option value="book_title">Book title (A–Z)</option>
                <option value="applicant_name">Applicant name (A–Z)</option>
                <option value="payment">Payment (high–low)</option>
                <option value="placement">Placement (highest first)</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Showing {filteredEntries.length} of {allEntries.length} entries
        </p>

        <JudgingEntriesTable
          rows={tableRows}
          variant="head_judge"
          emptyMessage="No entries match your filters"
          renderExpanded={renderExpanded}
        />
      </div>

      {/* Finalize */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Finalize decisions</h2>
          <p className="text-base text-slate-500 mt-0.5">
            {placedCount === 0
              ? "No placements set yet."
              : `${placedCount} ${placedCount === 1 ? "entry has" : "entries have"} a placement.`}
          </p>
        </div>

        {incompleteSubmissions && !finalized && (
          <div
            className="rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            Finalize is unavailable until all {HEAD_JUDGE_TOTAL_SUB_JUDGES} sub-judges have
            submitted. Deciding on incomplete data risks overlooking strong entries.
          </div>
        )}

        {!finalized && (
          <button
            type="button"
            disabled={!allSubmitted || placedCount === 0}
            onClick={() => setReviewOpen(true)}
            className="border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-[#23100A] font-bold py-2.5 px-5 rounded-lg text-base transition-colors"
          >
            Review and finalize results
          </button>
        )}
      </div>

      {reviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setReviewOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-results-title"
          >
            <h3 id="review-results-title" className="text-lg font-semibold text-slate-900 mb-1">
              Review placements
            </h3>
            <p className="text-base text-slate-500 mb-5">
              Confirm the placements below before locking in the final results.
            </p>

            <PlacementGroup title="1st Prize" entries={placedByTier.first_prize} />
            <PlacementGroup title="2nd Prize" entries={placedByTier.second_prize} />
            <PlacementGroup title="3rd Prize" entries={placedByTier.third_prize} />
            <PlacementGroup
              title="Children's Prize"
              entries={placedByTier.childrens_prize}
            />
            <PlacementGroup
              title="Shortlist (exact — not also a prize)"
              entries={placedByTier.shortlist}
            />
            <PlacementGroup
              title="Longlist (exact — not also shortlisted)"
              entries={placedByTier.longlist}
            />
            <p className="text-sm text-slate-500 mb-4">
              Nested totals: Longlist {membership.longlist}/{LONGLIST_CAP} · Shortlist{" "}
              {membership.shortlist}/{SHORTLIST_CAP}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  setReviewOpen(false);
                  setConfirmFinalizeOpen(true);
                }}
                className="flex-1 border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Continue to confirm
              </button>
              <button
                type="button"
                onClick={() => setReviewOpen(false)}
                className="flex-1 border-2 border-[#23100A] bg-transparent hover:bg-[#23100A]/5 text-[#23100A] font-semibold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmFinalizeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirmFinalizeOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-finalize-title"
          >
            <h3 id="confirm-finalize-title" className="text-lg font-semibold text-slate-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-base text-slate-600 leading-relaxed mb-5">
              This will lock in the final results. Placements won&apos;t be editable
              afterwards.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={finalizeResults}
                className="flex-1 border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Yes, finalize results
              </button>
              <button
                type="button"
                onClick={() => setConfirmFinalizeOpen(false)}
                className="flex-1 border-2 border-[#23100A] bg-transparent hover:bg-[#23100A]/5 text-[#23100A] font-semibold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingPrizeReplace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPendingPrizeReplace(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="replace-prize-title"
          >
            <h3 id="replace-prize-title" className="text-lg font-semibold text-slate-900 mb-2">
              Replace current {placementLabel(pendingPrizeReplace.prize)}?
            </h3>
            <p className="text-base text-slate-600 leading-relaxed mb-5">
              Only one book can hold {placementLabel(pendingPrizeReplace.prize)}. This will
              move{" "}
              <strong>
                {entryById.get(pendingPrizeReplace.previousEntryId)?.applicantName ??
                  "the previous entry"}
              </strong>{" "}
              down to Shortlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={confirmReplacePrize}
                className="flex-1 border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Yes, replace
              </button>
              <button
                type="button"
                onClick={() => setPendingPrizeReplace(null)}
                className="flex-1 border-2 border-[#23100A] bg-transparent hover:bg-[#23100A]/5 text-[#23100A] font-semibold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CapChip({ label, full }: { label: string; full: boolean }) {
  return (
    <span
      className={
        full
          ? "inline-flex rounded-md border border-slate-400 bg-slate-100 px-2.5 py-1 text-slate-800"
          : "inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700"
      }
    >
      {label}
    </span>
  );
}

function PlacementGroup({
  title,
  entries,
}: {
  title: string;
  entries: MockOrganiserEntry[];
}) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">
        {title}
      </h4>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400 italic">None selected</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-slate-900">{entry.applicantName}</span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span className="italic text-slate-700">{entry.bookTitle}</span>
              <span className="block text-slate-500 mt-0.5 tracking-wide">
                {entry.reference}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HeadJudgeSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <span
          className="h-5 w-5 rounded-full border-2 border-[#23100A] border-t-transparent animate-spin"
          aria-hidden
        />
        <span className="text-base text-slate-500">Loading head judge dashboard…</span>
      </div>
      <div className="h-8 w-64 rounded-lg bg-slate-200/80 animate-pulse" />
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3 shadow-sm">
        <div className="h-5 w-40 rounded bg-slate-200/80 animate-pulse" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-11 rounded-lg bg-slate-50 border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="h-5 w-48 rounded bg-slate-200/80 animate-pulse" />
        <div className="h-11 rounded-lg bg-slate-100 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-slate-50 border border-slate-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
