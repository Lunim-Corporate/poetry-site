/**
 * PROTOTYPE-ONLY competition book mock data.
 * Shared by the head-judge dashboard (all entries + capacity).
 */

import type { PipelineStage, PostingStatus } from "@/lib/mockAuth";
import { MOCK_HEAD_SUB_JUDGES, getMockHeadJudgeState } from "@/lib/mockHeadJudgeData";

export const ORGANISER_SUB_JUDGE_CAPACITY = 20;

export type OrganiserPipelineStage = PipelineStage;

export type OrganiserException = "none" | "withdrawn" | "late";

export type MockOrganiserEntry = {
  id: string;
  applicantName: string;
  reference: string;
  bookTitle: string;
  dateReceived: string;
  /** null when unassigned */
  subJudgeId: string | null;
  subJudgeName: string | null;
  stage: OrganiserPipelineStage;
  /** Mirrors applicant-facing postingStatus for reassignment warnings. */
  postingStatus: PostingStatus;
  /** Set when stage is final_result — counts toward "finalized" metric. */
  hasPlacement: boolean;
  exception: OrganiserException;
  /** Entry fee attributed to this book (prototype). */
  paymentAmountGBP: number;
  /** Sub-judge review when the book has been advanced to the head judge. */
  subJudgeReview?: string;
};

export type MockOrganiserSubJudge = {
  id: string;
  name: string;
  capacity: number;
};

export type OrganiserCapacityStatus =
  | "available"
  | "near_capacity"
  | "full"
  | "over_capacity";

export type OrganiserJudgeCapacityRow = {
  id: string;
  name: string;
  role: "sub_judge" | "head_judge";
  assigned: number;
  capacity: number;
  /** For head judge: books physically received. */
  received?: number;
  /** For head judge: advanced books still awaiting. */
  awaiting?: number;
  status: OrganiserCapacityStatus;
  statusLabel: string;
  unavailable?: boolean;
};

export type OrganiserSummaryMetrics = {
  totalReceived: number;
  unassigned: number;
  inJudging: number;
  advancedToHeadJudge: number;
  finalized: number;
};

const FIRST_NAMES = [
  "Priya",
  "Marcus",
  "Elena",
  "Aisha",
  "Jonah",
  "Mei",
  "Daniel",
  "Sophie",
  "Ibrahim",
  "Clara",
  "Noah",
  "Freya",
  "Luis",
  "Amara",
  "Theo",
  "Nia",
  "Owen",
  "Leila",
  "Haruto",
  "Ines",
  "Grace",
  "Yusuf",
  "Helena",
  "Kai",
  "Rosa",
  "Anika",
  "Felix",
  "Zara",
  "Hugo",
  "Mina",
];

const LAST_NAMES = [
  "Sharma",
  "Webb",
  "Vasquez",
  "Rahman",
  "Keller",
  "Chen",
  "Okonkwo",
  "Laurent",
  "Hassan",
  "Jensen",
  "Patel",
  "Nilsson",
  "Fernández",
  "Okeke",
  "Brennan",
  "Sato",
  "Duarte",
  "Khan",
  "Osei",
  "Novak",
  "Adeyemi",
  "Morales",
  "Singh",
  "Kowalski",
  "Berg",
  "Costa",
  "Murphy",
  "Yamamoto",
  "Ibrahim",
  "Walsh",
];

const BOOK_TITLES = [
  "Monsoon Letters",
  "Saltwater Hymns",
  "Glass Orchard",
  "Harbour Lights",
  "Northern Windows",
  "Olive Grove Psalms",
  "Frost Line",
  "River Mouth",
  "Drumskin and Dust",
  "Paper Lanterns, Still Burning",
  "The Quiet Hours",
  "Maps Without Borders",
  "Winter Tables",
  "Plaza de los Olvidos",
  "Field Notes from Nowhere",
  "A Brief Inventory of Rain",
  "Night Buses Home",
  "The Soft Architecture of Grief",
  "What the Tide Keeps",
  "Rue des Étoiles",
  "Bone China Weather",
  "Second-Hand Stars",
  "The Long Corridor",
  "Cinder Grammar",
  "Blue Kitchen Voices",
  "Atlas of Small Exiles",
  "Orchard After Dark",
  "Thin Ice Psalms",
  "Letters to the Harbour",
  "A Geography of Silence",
  "Waiting on the Tide",
  "Cedar and Smoke",
  "The Last Trolley Stop",
  "Window Seat, Eastbound",
  "After the Festival",
];

const SUB_JUDGE_REVIEWS = [
  "This collection opens with remarkable clarity and holds a distinctive voice through to the closing sequence. The imagery is precise without becoming ornamental, and several poems linger long after reading. A confident shortlist choice.",
  "The opening poems are exceptional and immediately distinctive, though the middle third feels uneven in pacing and focus. Even so, the strongest pieces demonstrate a mature control of tone that justifies advancing this book.",
  "There is clear thematic coherence across the collection, with motifs of home and exile handled with restraint. The formal choices support rather than distract from the emotional argument. I would shortlist this without hesitation.",
  "Formally inventive without losing emotional clarity — a rare balance. Line breaks and white space are used purposefully, and the quieter poems are as persuasive as the more ambitious ones. Strongly recommended for the final round.",
  "A quiet collection that rewards a second reading. What first appears understated gradually reveals careful architecture and a consistent moral intelligence. Not flashy, but deeply considered and worthy of shortlisting.",
  "The title poem is outstanding and sets a high bar for the rest of the book. Surrounding pieces are solid rather than dazzling, yet the overall craft and emotional honesty make this a credible Top 10 contender.",
  "Original imagery distinguishes this voice, though later sections occasionally overwrite and dilute the earlier precision. Still, the best poems are memorable enough that I would argue for inclusion in the shortlist.",
  "One of the most distinctive voices in my pile — idiosyncratic without becoming opaque. The collection takes risks that mostly land, and the weaker poems do not undermine the overall impression of genuine originality.",
  "Technically assured throughout, with clean prosody and careful diction. The subject matter sometimes feels familiar, but the execution is confident enough that this remains a serious candidate for advancement.",
  "I would argue for this in the final discussion. It combines accessibility with depth, and several poems have the kind of lasting charge that marks lasting work. A clear shortlist recommendation from this judge.",
];

/** Prototype single-book entry fee (matches enter form default). */
export const MOCK_BOOK_PAYMENT_GBP = 40;

/**
 * Uneven loads across 8 judges (nominal capacity 20 each).
 * A few sit over capacity so Full / Near capacity / Over capacity / Available all appear.
 * Sum = 172; + 8 unassigned = 180.
 */
const ASSIGNED_COUNTS = [25, 24, 23, 22, 21, 20, 19, 18] as const;
const UNASSIGNED_COUNT = 8;
const TOTAL_ENTRIES =
  ASSIGNED_COUNTS.reduce((a, b) => a + b, 0) + UNASSIGNED_COUNT;

function padRef(n: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  let x = n * 7919 + 104729;
  for (let i = 0; i < 8; i++) {
    code += alphabet[x % alphabet.length];
    x = Math.floor(x / alphabet.length) + (i + 1) * 37;
  }
  return `MAYA-2026-${code}`;
}

function stageForAssignedIndex(indexInJudge: number, judgeLoad: number): {
  stage: OrganiserPipelineStage;
  hasPlacement: boolean;
  postingStatus: PostingStatus;
  exception: OrganiserException;
} {
  const ratio = judgeLoad <= 1 ? 0 : indexInJudge / (judgeLoad - 1);

  // Sprinkle a few late / withdrawn demos across the pile
  if (indexInJudge === 3 && judgeLoad > 10) {
    return {
      stage: "entered",
      hasPlacement: false,
      postingStatus: "assigned_not_posted",
      exception: "late",
    };
  }
  if (indexInJudge === 7 && judgeLoad > 12) {
    return {
      stage: "in_judging",
      hasPlacement: false,
      postingStatus: "posted",
      exception: "withdrawn",
    };
  }

  if (ratio < 0.08) {
    return {
      stage: "entered",
      hasPlacement: false,
      postingStatus: "assigned_not_posted",
      exception: "none",
    };
  }
  if (ratio < 0.2) {
    return {
      stage: "book_posted",
      hasPlacement: false,
      postingStatus: "posted",
      exception: "none",
    };
  }
  if (ratio < 0.62) {
    return {
      stage: "in_judging",
      hasPlacement: false,
      postingStatus: "posted",
      exception: "none",
    };
  }
  // Formerly "shortlisted" pipeline stage — now final result (longlist / shortlist / prizes)
  return {
    stage: "final_result",
    hasPlacement: true,
    postingStatus: "posted",
    exception: "none",
  };
}

function buildOrganiserEntries(): MockOrganiserEntry[] {
  const entries: MockOrganiserEntry[] = [];
  let seq = 0;
  const judges = MOCK_HEAD_SUB_JUDGES;

  judges.forEach((judge, judgeIndex) => {
    const load = ASSIGNED_COUNTS[judgeIndex] ?? 0;
    for (let k = 0; k < load; k++) {
      const i = seq++;
      const first = FIRST_NAMES[i % FIRST_NAMES.length];
      const last = LAST_NAMES[(i * 5 + judgeIndex) % LAST_NAMES.length];
      const title = BOOK_TITLES[(i * 3 + k) % BOOK_TITLES.length];
      const day = 1 + (i % 28);
      const month = i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3;
      const { stage, hasPlacement, postingStatus, exception } =
        stageForAssignedIndex(k, load);

      entries.push({
        id: `org-book-${String(i + 1).padStart(3, "0")}`,
        applicantName: `${first} ${last}`,
        reference: padRef(i + 101),
        bookTitle: title,
        dateReceived: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        subJudgeId: judge.id,
        subJudgeName: judge.name,
        stage,
        postingStatus,
        hasPlacement,
        exception,
        paymentAmountGBP: MOCK_BOOK_PAYMENT_GBP,
        subJudgeReview:
          stage === "final_result"
            ? SUB_JUDGE_REVIEWS[i % SUB_JUDGE_REVIEWS.length]
            : undefined,
      });
    }
  });

  for (let u = 0; u < UNASSIGNED_COUNT; u++) {
    const i = seq++;
    const first = FIRST_NAMES[(i * 7) % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 11) % LAST_NAMES.length];
    const title = BOOK_TITLES[(i * 13) % BOOK_TITLES.length];
    const day = 10 + u;
    entries.push({
      id: `org-book-${String(i + 1).padStart(3, "0")}`,
      applicantName: `${first} ${last}`,
      reference: padRef(i + 901),
      bookTitle: title,
      dateReceived: `2026-03-${String(day).padStart(2, "0")}`,
      subJudgeId: null,
      subJudgeName: null,
      stage: "entered",
      postingStatus: "not_yet_assigned",
      hasPlacement: false,
      exception: "none",
      paymentAmountGBP: MOCK_BOOK_PAYMENT_GBP,
    });
  }

  return entries;
}

export const MOCK_ORGANISER_SUB_JUDGES: MockOrganiserSubJudge[] =
  MOCK_HEAD_SUB_JUDGES.map((j) => ({
    id: j.id,
    name: j.name,
    capacity: ORGANISER_SUB_JUDGE_CAPACITY,
  }));

export const MOCK_ORGANISER_ENTRIES: MockOrganiserEntry[] = buildOrganiserEntries();

export const ORGANISER_HEAD_JUDGE = {
  id: "organiser-head-judge",
  name: "Sam Rivera",
};

export function capacityStatus(
  assigned: number,
  capacity: number
): { status: OrganiserCapacityStatus; statusLabel: string } {
  if (assigned > capacity) {
    return { status: "over_capacity", statusLabel: "Over capacity" };
  }
  if (assigned === capacity) {
    return { status: "full", statusLabel: "Full" };
  }
  // Near capacity from 90% up to (but not including) full
  if (assigned >= Math.ceil(capacity * 0.9)) {
    return { status: "near_capacity", statusLabel: "Near capacity" };
  }
  return { status: "available", statusLabel: "Available" };
}

/** Active entries for metrics — withdrawn are excluded. */
export function activeOrganiserEntries(
  entries: MockOrganiserEntry[]
): MockOrganiserEntry[] {
  return entries.filter((e) => e.exception !== "withdrawn");
}

export function getOrganiserSummaryMetrics(
  entries: MockOrganiserEntry[]
): OrganiserSummaryMetrics {
  const active = activeOrganiserEntries(entries);
  return {
    totalReceived: active.length,
    unassigned: active.filter((e) => e.subJudgeId === null).length,
    inJudging: active.filter((e) => e.stage === "in_judging").length,
    advancedToHeadJudge: active.filter((e) => e.stage === "final_result").length,
    finalized: active.filter((e) => e.hasPlacement || e.stage === "final_result")
      .length,
  };
}

export function getOrganiserJudgeCapacityRows(
  entries: MockOrganiserEntry[],
  unavailableJudgeIds: string[] = []
): OrganiserJudgeCapacityRow[] {
  const unavailable = new Set(unavailableJudgeIds);
  const active = activeOrganiserEntries(entries);

  const subRows: OrganiserJudgeCapacityRow[] = MOCK_ORGANISER_SUB_JUDGES.map(
    (judge) => {
      const assigned = active.filter((e) => e.subJudgeId === judge.id).length;
      const { status, statusLabel } = capacityStatus(assigned, judge.capacity);
      const isUnavailable = unavailable.has(judge.id);
      return {
        id: judge.id,
        name: judge.name,
        role: "sub_judge" as const,
        assigned,
        capacity: judge.capacity,
        status,
        statusLabel: isUnavailable
          ? assigned > 0
            ? `Unavailable — ${assigned} ${assigned === 1 ? "entry" : "entries"} still assigned`
            : "Unavailable"
          : statusLabel,
        unavailable: isUnavailable,
      };
    }
  );

  const headState = getMockHeadJudgeState();
  const advanced = active.filter((e) => e.stage === "final_result");
  const advancedTotal = advanced.length;
  const received = headState.receivedIds.filter((id) =>
    advanced.some((e) => e.id === id)
  ).length;
  const awaiting = Math.max(0, advancedTotal - received);
  const { status, statusLabel } = capacityStatus(received, advancedTotal || 1);

  const headRow: OrganiserJudgeCapacityRow = {
    id: ORGANISER_HEAD_JUDGE.id,
    name: ORGANISER_HEAD_JUDGE.name,
    role: "head_judge",
    assigned: received,
    capacity: advancedTotal,
    received,
    awaiting,
    status,
    statusLabel,
  };

  return [...subRows, headRow];
}

export const ORGANISER_STAGE_FILTER_OPTIONS: {
  value: OrganiserPipelineStage | "all";
  label: string;
}[] = [
  { value: "all", label: "All stages" },
  { value: "entered", label: "Entered" },
  { value: "book_posted", label: "Book posted" },
  { value: "in_judging", label: "In judging" },
  { value: "final_result", label: "Final result" },
];

export const ORGANISER_EXCEPTION_FILTER_OPTIONS: {
  value: "all" | OrganiserException;
  label: string;
}[] = [
  { value: "all", label: "All exceptions" },
  { value: "none", label: "None" },
  { value: "late", label: "Late" },
  { value: "withdrawn", label: "Withdrawn" },
];

export function organiserStageLabel(stage: OrganiserPipelineStage): string {
  return (
    ORGANISER_STAGE_FILTER_OPTIONS.find((o) => o.value === stage)?.label ?? stage
  );
}

/** Book has been advanced from a sub-judge Top 10 to the head judge. */
export function isAdvancedToHeadJudge(entry: MockOrganiserEntry): boolean {
  return entry.stage === "final_result";
}

/** Sum of entry fees for active (non-withdrawn) books. */
export function totalPaymentsCollectedGBP(entries: MockOrganiserEntry[]): number {
  return activeOrganiserEntries(entries).reduce(
    (sum, e) => sum + e.paymentAmountGBP,
    0
  );
}

export function bookAlreadyPosted(entry: MockOrganiserEntry): boolean {
  return (
    entry.postingStatus === "posted" ||
    entry.postingStatus === "reassigned_after_posting" ||
    entry.stage === "book_posted" ||
    entry.stage === "in_judging" ||
    entry.stage === "final_result"
  );
}

// ---------------------------------------------------------------------------
// Persisted organiser workspace (assignments, exceptions, unavailability)
// ---------------------------------------------------------------------------

const ORGANISER_STATE_KEY = "maya_prototype_organiser_state_v1";

export type OrganiserEntryOverride = {
  subJudgeId: string | null;
  subJudgeName: string | null;
  stage: OrganiserPipelineStage;
  postingStatus: PostingStatus;
  exception: OrganiserException;
};

export type MockOrganiserWorkspaceState = {
  entryOverrides: Record<string, OrganiserEntryOverride>;
  unavailableJudgeIds: string[];
};

export function getMockOrganiserState(): MockOrganiserWorkspaceState {
  const empty: MockOrganiserWorkspaceState = {
    entryOverrides: {},
    unavailableJudgeIds: [],
  };
  if (typeof window === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(ORGANISER_STATE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as MockOrganiserWorkspaceState;
    return {
      entryOverrides:
        parsed.entryOverrides && typeof parsed.entryOverrides === "object"
          ? parsed.entryOverrides
          : {},
      unavailableJudgeIds: Array.isArray(parsed.unavailableJudgeIds)
        ? parsed.unavailableJudgeIds
        : [],
    };
  } catch {
    return empty;
  }
}

export function persistMockOrganiserState(state: MockOrganiserWorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ORGANISER_STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearOrganiserDemoData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(ORGANISER_STATE_KEY);
  } catch {
    /* ignore */
  }
}

export function mergeOrganiserEntriesWithState(
  seed: MockOrganiserEntry[] = MOCK_ORGANISER_ENTRIES,
  state: MockOrganiserWorkspaceState = getMockOrganiserState()
): MockOrganiserEntry[] {
  return seed.map((entry) => {
    const override = state.entryOverrides[entry.id];
    if (!override) return entry;
    return {
      ...entry,
      subJudgeId: override.subJudgeId,
      subJudgeName: override.subJudgeName,
      stage: override.stage,
      postingStatus: override.postingStatus,
      exception: override.exception,
    };
  });
}

/** Sanity: seeded total for docs / tests. */
export const ORGANISER_ENTRY_COUNT = TOTAL_ENTRIES;
