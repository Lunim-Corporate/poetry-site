/**
 * PROTOTYPE-ONLY: shared reset for mock dashboard workspace state.
 * Does not clear the login session.
 */

import {
  clearApplicantDemoData,
  clearSubJudgeDemoData,
  type MockRole,
} from "@/lib/mockAuth";
import { clearHeadJudgeDemoData } from "@/lib/mockHeadJudgeData";
import { clearOrganiserDemoData } from "@/lib/mockOrganiserData";

export function resetMockDemoData(role: MockRole | "all"): void {
  if (typeof window === "undefined") return;

  if (role === "applicant" || role === "all") {
    clearApplicantDemoData();
  }
  if (role === "sub_judge" || role === "all") {
    clearSubJudgeDemoData();
  }
  if (role === "head_judge" || role === "all") {
    clearHeadJudgeDemoData();
    // Competition entry overrides (legacy organiser workspace) affect head-judge capacity
    clearOrganiserDemoData();
  }
}
