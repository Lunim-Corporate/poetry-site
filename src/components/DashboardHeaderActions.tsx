"use client";

/**
 * Shared header actions for prototype dashboards: Sign out + Reset demo data.
 */
import ResetDemoDataControl from "@/components/ResetDemoDataControl";
import type { MockRole } from "@/lib/mockAuth";

type DashboardHeaderActionsProps = {
  role: MockRole;
  onSignOut: () => void;
  onDemoDataReset: () => void;
};

export default function DashboardHeaderActions({
  role,
  onSignOut,
  onDemoDataReset,
}: DashboardHeaderActionsProps) {
  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <button
        type="button"
        onClick={onSignOut}
        className="text-sm text-slate-500 underline hover:text-slate-700"
      >
        Sign out
      </button>
      <ResetDemoDataControl role={role} onReset={onDemoDataReset} />
    </div>
  );
}
