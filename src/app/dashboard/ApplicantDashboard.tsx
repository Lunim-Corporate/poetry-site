"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  PackageCheck,
  BookOpenCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import {
  PIPELINE_STAGES,
  bookPipelineStage,
  formatOutcome,
  formatOutcomeMessage,
  stageIndex,
  type MockApplicantEntry,
  type PipelineStage,
} from "@/lib/mockAuth";
import PostingAddressSection from "@/components/PostingAddressSection";
import DashboardHeaderActions from "@/components/DashboardHeaderActions";

type ApplicantDashboardProps = {
  entry: MockApplicantEntry;
  onSignOut: () => void;
  onDemoDataReset: () => void;
};

const STAGE_ICONS: Record<PipelineStage, LucideIcon> = {
  entered: Inbox,
  book_posted: PackageCheck,
  in_judging: BookOpenCheck,
  final_result: Trophy,
};

function StageCircleIcon({
  stageId,
  size,
}: {
  stageId: PipelineStage;
  size: "sm" | "md";
}) {
  const Icon = STAGE_ICONS[stageId];
  return (
    <Icon
      className={size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"}
      strokeWidth={2}
      aria-hidden
    />
  );
}

/** Compact five-stage tracker for a single book. */
function BookStatusTracker({ stage }: { stage: PipelineStage }) {
  const currentIdx = stageIndex(stage);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
        Status
      </p>

      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {PIPELINE_STAGES.slice(0, -1).map((_, connectorIndex) => {
            const afterCompleted = connectorIndex < currentIdx;
            const stageCount = PIPELINE_STAGES.length;
            const pct = 100 / stageCount;
            return (
              <div
                key={connectorIndex}
                className={`absolute top-4 border-t-2 ${
                  afterCompleted
                    ? "border-solid border-[#23100A]"
                    : "border-dashed border-slate-300"
                }`}
                style={{
                  left: `calc(${connectorIndex * pct + pct / 2}% + 16px)`,
                  right: `calc(${(stageCount - 1 - connectorIndex) * pct - pct / 2}% + 16px)`,
                }}
                aria-hidden
              />
            );
          })}

          {PIPELINE_STAGES.map((pipelineStage, index) => {
            const isCompleted = index < currentIdx;
            const isCurrent = index === currentIdx;
            const isUpcoming = index > currentIdx;

            return (
              <div
                key={pipelineStage.id}
                className="flex flex-col items-center flex-1 relative z-10 px-0.5"
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isCurrent
                      ? "bg-[#23100A] border-[#23100A] text-[#FFE169]"
                      : isCompleted
                        ? "bg-[#FFE169] border-[#23100A] text-[#23100A]"
                        : "bg-white border-slate-300 text-slate-400"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <StageCircleIcon stageId={pipelineStage.id} size="md" />
                </span>
                <p
                  className={`text-center mt-1.5 leading-tight text-xs ${
                    isCurrent
                      ? "font-bold text-slate-900"
                      : isUpcoming
                        ? "font-medium text-slate-400"
                        : "font-medium text-slate-700"
                  }`}
                >
                  {pipelineStage.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <ol className="md:hidden space-y-0">
        {PIPELINE_STAGES.map((pipelineStage, index) => {
          const isCompleted = index < currentIdx;
          const isCurrent = index === currentIdx;
          const isUpcoming = index > currentIdx;
          const isLast = index === PIPELINE_STAGES.length - 1;
          const connectorCompleted = index < currentIdx;

          return (
            <li key={pipelineStage.id} className="flex gap-2.5">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    isCurrent
                      ? "bg-[#23100A] border-[#23100A] text-[#FFE169]"
                      : isCompleted
                        ? "bg-[#FFE169] border-[#23100A] text-[#23100A]"
                        : "bg-white border-slate-300 text-slate-400"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <StageCircleIcon stageId={pipelineStage.id} size="sm" />
                </span>
                {!isLast && (
                  <span
                    className={`w-0 flex-1 min-h-[1.25rem] my-0.5 border-l-2 ${
                      connectorCompleted
                        ? "border-solid border-[#23100A]"
                        : "border-dashed border-slate-300"
                    }`}
                    aria-hidden
                  />
                )}
              </div>
              <div className={isLast ? "pb-0" : "pb-3"}>
                <p
                  className={`text-sm leading-7 ${
                    isCurrent
                      ? "font-bold text-slate-900"
                      : isUpcoming
                        ? "font-medium text-slate-400"
                        : "font-medium text-slate-700"
                  }`}
                >
                  {pipelineStage.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ApplicantDashboard({
  entry,
  onSignOut,
  onDemoDataReset,
}: ApplicantDashboardProps) {
  const books = entry.books;
  const [qrByBookId, setQrByBookId] = useState<Record<string, string>>({});
  const bookLabel = entry.bookCount === 1 ? "book" : "books";
  const submittedLabel = new Date(entry.submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    let cancelled = false;
    async function generateQrs() {
      const QRCode = (await import("qrcode")).default;
      const next: Record<string, string> = {};
      for (const book of books) {
        const payload = `${entry.reference}:${book.id}`;
        next[book.id] = await QRCode.toDataURL(payload, {
          width: 224,
          margin: 1,
          color: { dark: "#0f172a", light: "#ffffff" },
        });
      }
      if (!cancelled) setQrByBookId(next);
    }
    void generateQrs();
    return () => {
      cancelled = true;
    };
  }, [books, entry.reference]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your dashboard</h1>
          <p className="text-base text-slate-500 mt-1">
            Track your Maya Poetry Book Awards entry.
          </p>
        </div>
        <DashboardHeaderActions
          role="applicant"
          onSignOut={onSignOut}
          onDemoDataReset={onDemoDataReset}
        />
      </div>

      {/* Submission details — entry-level only */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Submission details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base">
          <div>
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{entry.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900 break-all">{entry.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Books entered</dt>
            <dd className="font-medium text-slate-900">
              {entry.bookCount} {bookLabel}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Date submitted</dt>
            <dd className="font-medium text-slate-900">{submittedLabel}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Entry reference</dt>
            <dd className="font-extrabold text-slate-900 tracking-wide">{entry.reference}</dd>
          </div>
        </dl>
      </div>

      {/* Per-book: title → status → posting */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your books</h2>
          <p className="text-base text-slate-500 mt-0.5">
            Status, posting address, and progress for each book in your entry.
          </p>
        </div>

        <div className="space-y-4">
          {books.map((book) => {
            const stage = bookPipelineStage(book);
            const showResult = stage === "final_result" && book.outcome;

            return (
              <div
                key={book.id}
                className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-5"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  <span className="italic font-normal text-slate-800">{book.bookTitle}</span>
                </h3>

                <BookStatusTracker stage={stage} />

                {showResult && book.outcome && (
                  <div
                    className={
                      book.outcome === "not_selected"
                        ? "border-2 border-slate-300 rounded-xl bg-slate-50 px-4 py-3"
                        : "border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3"
                    }
                  >
                    <p
                      className={
                        book.outcome === "not_selected"
                          ? "text-sm font-semibold text-slate-700 mb-0.5"
                          : "text-sm font-semibold text-emerald-900 mb-0.5"
                      }
                    >
                      {formatOutcome(book.outcome)}
                    </p>
                    <p
                      className={
                        book.outcome === "not_selected"
                          ? "text-base text-slate-700 leading-relaxed"
                          : "text-base text-emerald-900 leading-relaxed"
                      }
                    >
                      {formatOutcomeMessage(book.outcome)}
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-4">
                  <PostingAddressSection
                    book={book}
                    reference={entry.reference}
                    qrDataUrl={qrByBookId[book.id]}
                    showPrintButton
                    printLabelId={`print-label-${book.id}`}
                    variant="embedded"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
