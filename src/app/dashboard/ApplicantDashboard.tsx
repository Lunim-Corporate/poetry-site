// "use client";

// import { useEffect, useState } from "react";
// import {
//   Inbox,
//   PackageCheck,
//   BookOpenCheck,
//   Trophy,
//   type LucideIcon,
// } from "lucide-react";
// import {
//   PIPELINE_STAGES,
//   bookPipelineStage,
//   formatOutcome,
//   formatOutcomeMessage,
//   stageIndex,
//   type MockApplicantEntry,
//   type PipelineStage,
// } from "@/lib/mockAuth";
// import PostingAddressSection from "@/components/PostingAddressSection";
// import DashboardHeaderActions from "@/components/DashboardHeaderActions";

// type ApplicantDashboardProps = {
//   entry: MockApplicantEntry;
//   onSignOut: () => void;
//   onDemoDataReset: () => void;
// };

// const STAGE_ICONS: Record<PipelineStage, LucideIcon> = {
//   entered: Inbox,
//   book_posted: PackageCheck,
//   in_judging: BookOpenCheck,
//   final_result: Trophy,
// };

// function StageCircleIcon({
//   stageId,
//   size,
// }: {
//   stageId: PipelineStage;
//   size: "sm" | "md";
// }) {
//   const Icon = STAGE_ICONS[stageId];
//   return (
//     <Icon
//       className={size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"}
//       strokeWidth={2}
//       aria-hidden
//     />
//   );
// }

// /** Compact five-stage tracker for a single book. */
// function BookStatusTracker({ stage }: { stage: PipelineStage }) {
//   const currentIdx = stageIndex(stage);

//   return (
//     <div>
//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
//         Status
//       </p>

//       <div className="hidden md:block">
//         <div className="relative flex items-start justify-between">
//           {PIPELINE_STAGES.slice(0, -1).map((_, connectorIndex) => {
//             const afterCompleted = connectorIndex < currentIdx;
//             const stageCount = PIPELINE_STAGES.length;
//             const pct = 100 / stageCount;
//             return (
//               <div
//                 key={connectorIndex}
//                 className={`absolute top-4 border-t-2 ${
//                   afterCompleted
//                     ? "border-solid border-[#23100A]"
//                     : "border-dashed border-slate-300"
//                 }`}
//                 style={{
//                   left: `calc(${connectorIndex * pct + pct / 2}% + 16px)`,
//                   right: `calc(${(stageCount - 1 - connectorIndex) * pct - pct / 2}% + 16px)`,
//                 }}
//                 aria-hidden
//               />
//             );
//           })}

//           {PIPELINE_STAGES.map((pipelineStage, index) => {
//             const isCompleted = index < currentIdx;
//             const isCurrent = index === currentIdx;
//             const isUpcoming = index > currentIdx;

//             return (
//               <div
//                 key={pipelineStage.id}
//                 className="flex flex-col items-center flex-1 relative z-10 px-0.5"
//               >
//                 <span
//                   className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
//                     isCurrent
//                       ? "bg-[#23100A] border-[#23100A] text-[#FFE169]"
//                       : isCompleted
//                         ? "bg-[#FFE169] border-[#23100A] text-[#23100A]"
//                         : "bg-white border-slate-300 text-slate-400"
//                   }`}
//                   aria-current={isCurrent ? "step" : undefined}
//                 >
//                   <StageCircleIcon stageId={pipelineStage.id} size="md" />
//                 </span>
//                 <p
//                   className={`text-center mt-1.5 leading-tight text-xs ${
//                     isCurrent
//                       ? "font-bold text-slate-900"
//                       : isUpcoming
//                         ? "font-medium text-slate-400"
//                         : "font-medium text-slate-700"
//                   }`}
//                 >
//                   {pipelineStage.label}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <ol className="md:hidden space-y-0">
//         {PIPELINE_STAGES.map((pipelineStage, index) => {
//           const isCompleted = index < currentIdx;
//           const isCurrent = index === currentIdx;
//           const isUpcoming = index > currentIdx;
//           const isLast = index === PIPELINE_STAGES.length - 1;
//           const connectorCompleted = index < currentIdx;

//           return (
//             <li key={pipelineStage.id} className="flex gap-2.5">
//               <div className="flex flex-col items-center">
//                 <span
//                   className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
//                     isCurrent
//                       ? "bg-[#23100A] border-[#23100A] text-[#FFE169]"
//                       : isCompleted
//                         ? "bg-[#FFE169] border-[#23100A] text-[#23100A]"
//                         : "bg-white border-slate-300 text-slate-400"
//                   }`}
//                   aria-current={isCurrent ? "step" : undefined}
//                 >
//                   <StageCircleIcon stageId={pipelineStage.id} size="sm" />
//                 </span>
//                 {!isLast && (
//                   <span
//                     className={`w-0 flex-1 min-h-[1.25rem] my-0.5 border-l-2 ${
//                       connectorCompleted
//                         ? "border-solid border-[#23100A]"
//                         : "border-dashed border-slate-300"
//                     }`}
//                     aria-hidden
//                   />
//                 )}
//               </div>
//               <div className={isLast ? "pb-0" : "pb-3"}>
//                 <p
//                   className={`text-sm leading-7 ${
//                     isCurrent
//                       ? "font-bold text-slate-900"
//                       : isUpcoming
//                         ? "font-medium text-slate-400"
//                         : "font-medium text-slate-700"
//                   }`}
//                 >
//                   {pipelineStage.label}
//                 </p>
//               </div>
//             </li>
//           );
//         })}
//       </ol>
//     </div>
//   );
// }

// export default function ApplicantDashboard({
//   entry,
//   onSignOut,
//   onDemoDataReset,
// }: ApplicantDashboardProps) {
//   const books = entry.books;
//   const [qrByBookId, setQrByBookId] = useState<Record<string, string>>({});
//   const bookLabel = entry.bookCount === 1 ? "book" : "books";
//   const submittedLabel = new Date(entry.submittedAt).toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   useEffect(() => {
//     let cancelled = false;
//     async function generateQrs() {
//       const QRCode = (await import("qrcode")).default;
//       const next: Record<string, string> = {};
//       for (const book of books) {
//         const payload = `${entry.reference}:${book.id}`;
//         next[book.id] = await QRCode.toDataURL(payload, {
//           width: 224,
//           margin: 1,
//           color: { dark: "#0f172a", light: "#ffffff" },
//         });
//       }
//       if (!cancelled) setQrByBookId(next);
//     }
//     void generateQrs();
//     return () => {
//       cancelled = true;
//     };
//   }, [books, entry.reference]);

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Your dashboard</h1>
//           <p className="text-base text-slate-500 mt-1">
//             Track your Maya Poetry Book Awards entry.
//           </p>
//         </div>
//         <DashboardHeaderActions
//           role="applicant"
//           onSignOut={onSignOut}
//           onDemoDataReset={onDemoDataReset}
//         />
//       </div>

//       {/* Submission details — entry-level only */}
//       <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm">
//         <h2 className="text-lg font-semibold text-slate-900 mb-4">Submission details</h2>
//         <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base">
//           <div>
//             <dt className="text-slate-500">Name</dt>
//             <dd className="font-medium text-slate-900">{entry.name}</dd>
//           </div>
//           <div>
//             <dt className="text-slate-500">Email</dt>
//             <dd className="font-medium text-slate-900 break-all">{entry.email}</dd>
//           </div>
//           <div>
//             <dt className="text-slate-500">Books entered</dt>
//             <dd className="font-medium text-slate-900">
//               {entry.bookCount} {bookLabel}
//             </dd>
//           </div>
//           <div>
//             <dt className="text-slate-500">Date submitted</dt>
//             <dd className="font-medium text-slate-900">{submittedLabel}</dd>
//           </div>
//           <div className="sm:col-span-2">
//             <dt className="text-slate-500">Entry reference</dt>
//             <dd className="font-extrabold text-slate-900 tracking-wide">{entry.reference}</dd>
//           </div>
//         </dl>
//       </div>

//       {/* Per-book: title → status → posting */}
//       <div className="space-y-3">
//         <div>
//           <h2 className="text-lg font-semibold text-slate-900">Your books</h2>
//           <p className="text-base text-slate-500 mt-0.5">
//             Status, posting address, and progress for each book in your entry.
//           </p>
//         </div>

//         <div className="space-y-4">
//           {books.map((book) => {
//             const stage = bookPipelineStage(book);
//             const showResult = stage === "final_result" && book.outcome;

//             return (
//               <div
//                 key={book.id}
//                 className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-5"
//               >
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   <span className="italic font-normal text-slate-800">{book.bookTitle}</span>
//                 </h3>

//                 <BookStatusTracker stage={stage} />

//                 {showResult && book.outcome && (
//                   <div
//                     className={
//                       book.outcome === "not_selected"
//                         ? "border-2 border-slate-300 rounded-xl bg-slate-50 px-4 py-3"
//                         : "border-2 border-emerald-400 rounded-xl bg-emerald-50 px-4 py-3"
//                     }
//                   >
//                     <p
//                       className={
//                         book.outcome === "not_selected"
//                           ? "text-sm font-semibold text-slate-700 mb-0.5"
//                           : "text-sm font-semibold text-emerald-900 mb-0.5"
//                       }
//                     >
//                       {formatOutcome(book.outcome)}
//                     </p>
//                     <p
//                       className={
//                         book.outcome === "not_selected"
//                           ? "text-base text-slate-700 leading-relaxed"
//                           : "text-base text-emerald-900 leading-relaxed"
//                       }
//                     >
//                       {formatOutcomeMessage(book.outcome)}
//                     </p>
//                   </div>
//                 )}

//                 <div className="border-t border-slate-100 pt-4">
//                   <PostingAddressSection
//                     book={book}
//                     reference={entry.reference}
//                     qrDataUrl={qrByBookId[book.id]}
//                     showPrintButton
//                     printLabelId={`print-label-${book.id}`}
//                     variant="embedded"
//                   />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import { useState } from "react";
import {
  BookOpen,
  PackageCheck,
  Trophy,
  Inbox,
} from "lucide-react";

import type {
  EntrantDashboardData,
  EntrantDashboardBook,
} from "@/types/entrant-dashboard";

type ApplicantDashboardProps = {
  data: EntrantDashboardData;
  onSignOut: () => void;
};

const STATUS_LABELS: Record<
  EntrantDashboardBook["status"],
  string
> = {
  SUBMITTED: "Submitted",
  RECEIVED: "Received",
  SUB_SELECTED: "Selected by sub-judge",
  SUB_SENT: "Sent for main judging",
  SUB_REJECTED: "Not selected by sub-judge",
  MAIN_RECEIVED: "Received for main judging",
};

export default function ApplicantDashboard({
  data,
  onSignOut,
}: ApplicantDashboardProps) {
  const [expandedSubmission, setExpandedSubmission] =
    useState<string | null>(null);

  const totalBooks = data.submissions.reduce(
    (total, submission) => total + submission.books.length,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Your dashboard
          </h1>
          <p className="mt-1 text-base text-slate-500">
            Track your Maya Poetry Book Awards entries.
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="rounded-lg border-2 border-[#23100A] bg-[#FFE169] px-5 py-2.5 font-semibold text-[#23100A] transition-colors hover:bg-[#23100A] hover:text-[#FFE169]"
        >
          Log out
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Account details
        </h2>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">
              {data.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">Email</dt>
            <dd className="break-all font-medium text-slate-900">
              {data.email}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Total submissions
            </dt>
            <dd className="font-medium text-slate-900">
              {data.submissions.length}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Books entered
            </dt>
            <dd className="font-medium text-slate-900">
              {totalBooks}
            </dd>
          </div>
        </dl>
      </div>

      {data.submissions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <BookOpen
            className="mx-auto mb-4 h-12 w-12 text-slate-400"
            strokeWidth={1.5}
          />

          <h2 className="text-xl font-semibold text-slate-900">
            No submissions yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-base text-slate-500">
            You haven't linked or submitted a competition
            entry yet. Once an entry is associated with your
            account, your books and their progress will
            appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Your submissions
          </h2>

          {data.submissions.map((submission) => {
            const isExpanded =
              expandedSubmission === submission.id;

            return (
              <div
                key={submission.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSubmission(
                      isExpanded ? null : submission.id
                    )
                  }
                  aria-expanded={isExpanded}
                  className="w-full p-5 text-left md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {submission.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {submission.competition.name}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Submitted:{" "}
                        {new Date(
                          submission.createdAt
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-slate-600">
                      {submission.books.length}{" "}
                      {submission.books.length === 1
                        ? "book"
                        : "books"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-[#23100A]">
                    {isExpanded
                      ? "Hide books"
                      : "View books"}
                  </p>
                </button>

                {isExpanded && (
                  <div className="space-y-4 border-t border-slate-200 p-5 md:p-6">
                    {submission.books.length === 0 ? (
                      <p className="text-slate-500">
                        No books are associated with this submission.
                      </p>
                    ) : (
                      submission.books.map((book) => (
                        <div
                          key={book.id}
                          className="rounded-lg border border-slate-200 p-4"
                        >
                          <div className="mb-4 flex items-start gap-3">
                            <BookOpen className="mt-1 h-5 w-5 text-slate-500" />

                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {book.title}
                              </h4>

                              <p className="mt-1 text-sm text-slate-500">
                                Reference: {book.reference}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <PackageCheck className="h-4 w-4 text-slate-500" />

                            <span className="text-sm font-medium text-slate-700">
                              {STATUS_LABELS[book.status]}
                            </span>
                          </div>

                          {book.prize && (
                            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                              <Trophy className="h-5 w-5 text-emerald-700" />

                              <span className="font-semibold text-emerald-900">
                                {book.prize.name}
                              </span>
                            </div>
                          )}

                          <div className="mt-4 border-t border-slate-100 pt-4">
                            <div className="flex items-center gap-2">
                              <Inbox className="h-4 w-4 text-slate-400" />

                              <p className="text-sm text-slate-500">
                                Posting address unavailable for this book.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
