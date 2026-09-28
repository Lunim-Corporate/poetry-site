"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import {
  MOCK_HEAD_JUDGE_SHIPPING,
  MOCK_SUB_JUDGE_ENTRIES,
  getMockSubJudgeState,
  persistMockSubJudgeState,
  pipelineStageLabel,
  type MockSubJudgeBook,
} from "@/lib/mockAuth";
import ShippingAddressPanel from "@/components/ShippingAddressPanel";
import DashboardHeaderActions from "@/components/DashboardHeaderActions";
import JudgingEntriesTable, {
  type JudgingTableRow,
} from "@/components/JudgingEntriesTable";

type EntriesFilter = "all" | "shortlisted" | "not_reviewed" | "reviewed";

type SubJudgeDashboardProps = {
  judgeName: string;
  judgeEmail: string;
  onSignOut: () => void;
  onDemoDataReset: () => void;
};

const TOP10_LIMIT = 10;
const MIN_REVIEW_WORDS = 40;

const selectClassName =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A]";

const textareaClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A] min-h-[112px] resize-y";

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function reviewMeetsMinimum(text: string): boolean {
  return countWords(text) >= MIN_REVIEW_WORDS;
}

function bookToRow(book: MockSubJudgeBook): JudgingTableRow {
  return {
    id: book.id,
    applicantName: book.applicantName,
    bookTitle: book.bookTitle,
    reference: book.reference,
    enteredDate: book.dateReceived,
    stageLabel: pipelineStageLabel(book.stage),
  };
}

export default function SubJudgeDashboard({
  judgeName,
  judgeEmail,
  onSignOut,
  onDemoDataReset,
}: SubJudgeDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [books] = useState<MockSubJudgeBook[]>(MOCK_SUB_JUDGE_ENTRIES);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [starWarning, setStarWarning] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesFilter, setEntriesFilter] = useState<EntriesFilter>("all");
  const [reviews, setReviews] = useState<Record<string, string>>({});
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = getMockSubJudgeState();
      setReviewedIds(new Set(saved.reviewedIds));
      setStarredIds(saved.starredIds);
      setSubmitted(saved.submitted);
      setReviews(saved.notes);
      setReviewDrafts(saved.notes);
      setLoading(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    persistMockSubJudgeState({
      reviewedIds: Array.from(reviewedIds),
      starredIds,
      submitted,
      notes: reviews,
    });
  }, [reviewedIds, starredIds, submitted, reviews, loading]);

  const reviewedCount = useMemo(
    () => books.filter((b) => reviewedIds.has(b.id)).length,
    [books, reviewedIds]
  );

  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return books.filter((book) => {
      const isReviewed = reviewedIds.has(book.id);
      const isShortlisted = starredIds.includes(book.id);
      if (entriesFilter === "shortlisted" && !isShortlisted) return false;
      if (entriesFilter === "reviewed" && !isReviewed) return false;
      if (entriesFilter === "not_reviewed" && isReviewed) return false;

      if (!q) return true;
      if (book.bookTitle.toLowerCase().includes(q)) return true;
      if (book.applicantName.toLowerCase().includes(q)) return true;
      if (book.reference.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [books, searchQuery, entriesFilter, reviewedIds, starredIds]);

  const shortlisted = useMemo(
    () =>
      starredIds
        .map((id) => books.find((b) => b.id === id))
        .filter((b): b is MockSubJudgeBook => Boolean(b)),
    [books, starredIds]
  );

  const tableRows = useMemo(
    () => filteredBooks.map(bookToRow),
    [filteredBooks]
  );

  const top10Full = starredIds.length >= TOP10_LIMIT;
  const canSubmit = starredIds.length === TOP10_LIMIT && !submitted;

  function getReviewText(bookId: string): string {
    return reviewDrafts[bookId] ?? reviews[bookId] ?? "";
  }

  function toggleReviewed(id: string) {
    if (submitted) return;
    const alreadyReviewed = reviewedIds.has(id);
    if (!alreadyReviewed && !reviewMeetsMinimum(getReviewText(id))) return;

    setReviewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleStar(id: string) {
    if (submitted) return;
    setStarWarning("");

    setStarredIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (!reviewMeetsMinimum(getReviewText(id))) {
        setStarWarning("Write a review before shortlisting");
        return prev;
      }
      if (prev.length >= TOP10_LIMIT) {
        setStarWarning("Your shortlist is full — remove one to add another");
        return prev;
      }
      return [...prev, id];
    });
  }

  function saveReview(id: string, draft: string) {
    const trimmed = draft.trim();
    setReviews((prev) => {
      const next = { ...prev };
      if (trimmed) next[id] = trimmed;
      else delete next[id];
      return next;
    });
  }

  function handleReviewChange(id: string, value: string) {
    setReviewDrafts((prev) => ({ ...prev, [id]: value }));
  }

  function handleReviewBlur(id: string) {
    saveReview(id, reviewDrafts[id] ?? "");
  }

  function confirmSubmit() {
    setSubmitted(true);
    setConfirmOpen(false);
  }

  const shortlistParcelReference = "MAYA-2026-SJ-SHORTLIST";

  useEffect(() => {
    if (!submitted || shortlisted.length === 0) return;
    let cancelled = false;
    async function generateQr() {
      const QRCode = (await import("qrcode")).default;
      const payload = shortlisted.map((b) => `${b.reference}:${b.id}`).join("|");
      const dataUrl = await QRCode.toDataURL(payload, {
        width: 224,
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      if (!cancelled) setQrDataUrl(dataUrl);
    }
    void generateQr();
    return () => {
      cancelled = true;
    };
  }, [submitted, shortlisted]);

  if (loading) {
    return <SubJudgeSkeleton />;
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Post books to head judge</h1>
            <p className="text-base text-slate-500 mt-1">
              {judgeName} · next step after submitting your shortlist
            </p>
          </div>
          <DashboardHeaderActions
            role="sub_judge"
            onSignOut={onSignOut}
            onDemoDataReset={onDemoDataReset}
          />
        </div>

        <div
          className="border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3 font-medium text-base text-emerald-800"
          role="status"
        >
          Your shortlist has been submitted. Please post these books to the head judge.
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Print label and post</h2>
          <p className="text-base text-slate-500">
            Click &ldquo;Print label&rdquo;, stick the label on the parcel, and send all{" "}
            {shortlisted.length} books to the head judge. Include each book&apos;s entry
            reference on the parcel.
          </p>
          <ShippingAddressPanel
            shipping={MOCK_HEAD_JUDGE_SHIPPING}
            reference={shortlistParcelReference}
            qrDataUrl={qrDataUrl}
            showPrintButton={Boolean(qrDataUrl)}
            printLabelId="print-label-head-judge"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Books to post</h2>
          <p className="text-base text-slate-500">
            Your shortlist of {shortlisted.length} books for the head judge.
          </p>
          <ol className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {shortlisted.map((book, index) => (
              <li key={book.id} className="flex items-start gap-3 px-4 py-3.5 bg-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFE169] border-2 border-[#23100A] text-xs font-bold text-[#23100A]">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 italic">{book.bookTitle}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{book.applicantName}</p>
                  <p className="text-sm font-semibold text-slate-700 tracking-wide mt-0.5">
                    {book.reference}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  function renderBookDetail(row: JudgingTableRow) {
    const book = books.find((b) => b.id === row.id);
    if (!book) return null;

    const reviewed = reviewedIds.has(book.id);
    const starred = starredIds.includes(book.id);
    const reviewText = getReviewText(book.id);
    const wordCount = countWords(reviewText);
    const reviewReady = reviewMeetsMinimum(reviewText);
    const reviewBlocked = !reviewReady && !starred;
    const starDisabled = !starred && (top10Full || !reviewReady);
    const reviewDisabled = !reviewed && !reviewReady;
    const multiBook = book.booksFromApplicant > 1;

    return (
      <div className="space-y-4 max-w-2xl">
        {multiBook && (
          <p className="text-xs font-medium text-slate-500">
            {book.bookIndexFromApplicant} of {book.booksFromApplicant} from this applicant
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleReviewed(book.id)}
            disabled={reviewDisabled}
            title={
              !reviewed && !reviewReady
                ? "Write a review before marking as reviewed"
                : undefined
            }
            className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              reviewed
                ? "border-[#23100A] bg-[#23100A] text-[#FFE169]"
                : "border-[#23100A] bg-transparent text-[#23100A] hover:bg-[#23100A]/5"
            }`}
          >
            {reviewed ? "Reviewed" : "Mark as reviewed"}
          </button>
          <button
            type="button"
            onClick={() => toggleStar(book.id)}
            disabled={starDisabled}
            title={
              starred
                ? "Remove from shortlist"
                : !reviewReady
                  ? "Write a review before shortlisting"
                  : top10Full
                    ? "Shortlist is full"
                    : "Add to shortlist"
            }
            aria-pressed={starred}
            aria-label={
              starred
                ? `Remove ${book.bookTitle} from shortlist`
                : `Add ${book.bookTitle} to shortlist`
            }
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              starred
                ? "border-[#23100A] bg-[#FFE169] text-[#23100A]"
                : "border-slate-300 text-slate-400 hover:border-[#23100A] hover:text-[#23100A]"
            }`}
          >
            <Star
              className="w-5 h-5"
              fill={starred ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
          <span
            className={`inline-flex text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded ${
              reviewed
                ? "bg-emerald-50 text-emerald-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {reviewed ? "Reviewed" : "Not yet reviewed"}
          </span>
          {reviewBlocked && (
            <p className="text-xs text-slate-500">Write a review before shortlisting</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`review-${book.id}`}
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Review
          </label>
          <textarea
            id={`review-${book.id}`}
            value={reviewText}
            onChange={(e) => handleReviewChange(book.id, e.target.value)}
            onBlur={() => handleReviewBlur(book.id)}
            placeholder="Write a short paragraph on this book (required before shortlisting)."
            className={textareaClassName}
          />
          <p
            className={`mt-1.5 text-xs ${
              reviewReady ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {wordCount} / {MIN_REVIEW_WORDS} words minimum
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sub-judge dashboard</h1>
          <p className="text-base text-slate-500 mt-1">
            {judgeName} · books assigned to you only
          </p>
          <p className="text-sm text-slate-400 mt-0.5">{judgeEmail}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <DashboardHeaderActions
            role="sub_judge"
            onSignOut={onSignOut}
            onDemoDataReset={onDemoDataReset}
          />
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => setConfirmOpen(true)}
            className="border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-200 disabled:border-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-[#23100A] font-bold py-2.5 px-5 rounded-lg text-base transition-colors"
          >
            Submit the shortlist
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        Shortlist {starredIds.length}/{TOP10_LIMIT}
        {starredIds.length > 0 && starredIds.length < TOP10_LIMIT
          ? ` — select ${TOP10_LIMIT - starredIds.length} more to enable submission`
          : null}
        {" · "}
        {reviewedCount} of {books.length} books reviewed
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">My entries</h2>
          <p className="text-base text-slate-500 mt-0.5">
            Expand a row to write a review, mark as reviewed, or shortlist.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="sub-judge-search" className="sr-only">
              Search books
            </label>
            <input
              id="sub-judge-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, reference number, or book title"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#23100A]/20 focus:border-[#23100A]"
            />
          </div>
          <div className="min-w-[11rem] max-w-xs">
            <label
              htmlFor="sub-judge-entries-filter"
              className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1"
            >
              Show
            </label>
            <select
              id="sub-judge-entries-filter"
              value={entriesFilter}
              onChange={(e) => setEntriesFilter(e.target.value as EntriesFilter)}
              className={`${selectClassName} w-full`}
            >
              <option value="all">All</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="not_reviewed">Not yet reviewed</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Showing {filteredBooks.length} of {books.length} books
        </p>

        {(starWarning || top10Full) && (
          <div
            className="rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            {starWarning || "Your shortlist is full — remove one to add another"}
          </div>
        )}

        <JudgingEntriesTable
          rows={tableRows}
          variant="sub_judge"
          emptyMessage="No books match your filters"
          renderExpanded={renderBookDetail}
        />
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-shortlist-title"
          >
            <h3
              id="submit-shortlist-title"
              className="text-lg font-semibold text-slate-900 mb-2"
            >
              Submit your shortlist?
            </h3>
            <p className="text-base text-slate-600 leading-relaxed mb-5">
              This will send your shortlist of 10 books to the head judge. You won&apos;t
              be able to change it afterwards.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={confirmSubmit}
                className="flex-1 border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-base transition-colors"
              >
                Yes, submit shortlist
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
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

function SubJudgeSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex items-center gap-3">
        <span
          className="h-5 w-5 rounded-full border-2 border-[#23100A] border-t-transparent animate-spin"
          aria-hidden
        />
        <span className="text-base text-slate-500">Loading your entries…</span>
      </div>
      <div className="h-8 w-56 rounded-lg bg-slate-200/80 animate-pulse" />
      <div className="h-12 rounded-lg bg-slate-100 animate-pulse" />
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="h-5 w-40 rounded bg-slate-200/80 animate-pulse" />
        <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-slate-50 border border-slate-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
