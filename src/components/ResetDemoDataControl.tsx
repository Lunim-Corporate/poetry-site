"use client";

import { useState } from "react";
import type { MockRole } from "@/lib/mockAuth";
import { resetMockDemoData } from "@/lib/resetMockDemoData";

type ResetDemoDataControlProps = {
  role: MockRole;
  /** Called after storage is cleared so the parent can remount the dashboard. */
  onReset: () => void;
};

/**
 * PROTOTYPE-ONLY control to wipe mock workspace state for the current role.
 * Not a production feature — styled as a muted utility link.
 */
export default function ResetDemoDataControl({
  role,
  onReset,
}: ResetDemoDataControlProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirm() {
    resetMockDemoData(role);
    setConfirmOpen(false);
    onReset();
  }

  return (
    <>
      <div className="flex flex-col items-end gap-0.5">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="text-xs text-slate-400 underline decoration-slate-300 hover:text-slate-500 hover:decoration-slate-400"
        >
          Reset demo data
        </button>
        <span className="text-[10px] leading-tight text-slate-400/80">
          Prototype only
        </span>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-demo-title"
        >
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5 md:p-6 space-y-4 border border-slate-200">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Prototype
              </p>
              <h2
                id="reset-demo-title"
                className="text-lg font-semibold text-slate-900"
              >
                Reset all demo data?
              </h2>
              <p className="text-base text-slate-600 mt-2 leading-relaxed">
                This can&apos;t be undone. Reviews, shortlists, posting marks, and other
                saved progress for this role will return to the original starting state.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="text-sm font-medium text-slate-600 underline hover:text-slate-800 px-2 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="border-2 border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Reset demo data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
