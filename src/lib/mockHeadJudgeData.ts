/**
 * PROTOTYPE-ONLY head-judge mock data.
 * Not real competition data — for dashboard design/demo only.
 */

export type HeadJudgePlacement =
  | "none"
  | "longlist"
  | "shortlist"
  | "first_prize"
  | "second_prize"
  | "third_prize"
  | "childrens_prize";

export type HeadJudgePrizePlacement = Extract<
  HeadJudgePlacement,
  "first_prize" | "second_prize" | "third_prize" | "childrens_prize"
>;

export type MockHeadJudgeAdvancedEntry = {
  id: string;
  applicantName: string;
  reference: string;
  bookTitle: string;
  bookCount: number;
  dateReceived: string;
  subJudgeId: string;
  subJudgeName: string;
  /** Review paragraph written by the advancing sub-judge (visible to head judge). */
  privateNote: string;
};

export type MockHeadSubJudge = {
  id: string;
  name: string;
  submitted: boolean;
};

const SUB_JUDGE_DEFS: { id: string; name: string; submitted: boolean }[] = [
  { id: "hj-sj-01", name: "Alex Morgan", submitted: true },
  { id: "hj-sj-02", name: "Riley Quinn", submitted: true },
  { id: "hj-sj-03", name: "Jordan Blake", submitted: true },
  { id: "hj-sj-04", name: "Casey Nguyen", submitted: true },
  { id: "hj-sj-05", name: "Morgan Ellis", submitted: true },
  { id: "hj-sj-06", name: "Taylor Brooks", submitted: true },
  { id: "hj-sj-07", name: "Jamie Ortiz", submitted: false },
  { id: "hj-sj-08", name: "Priya Kapoor", submitted: false },
];

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
];

const PRIVATE_NOTES = [
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

function buildAdvancedEntries(): MockHeadJudgeAdvancedEntry[] {
  const entries: MockHeadJudgeAdvancedEntry[] = [];
  let seq = 0;

  for (const judge of SUB_JUDGE_DEFS) {
    if (!judge.submitted) continue;

    for (let rank = 0; rank < 10; rank++) {
      const i = seq++;
      const first = FIRST_NAMES[i % FIRST_NAMES.length];
      const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
      const title = BOOK_TITLES[i % BOOK_TITLES.length];
      const day = 3 + (i % 26);
      const month = i % 2 === 0 ? 2 : 3;

      entries.push({
        id: `hj-adv-${String(i + 1).padStart(2, "0")}`,
        applicantName: `${first} ${last}`,
        reference: padRef(i + 11),
        bookTitle: title,
        bookCount: (i % 5 === 0 ? 2 : 1) as 1 | 2,
        dateReceived: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        subJudgeId: judge.id,
        subJudgeName: judge.name,
        privateNote: PRIVATE_NOTES[i % PRIVATE_NOTES.length],
      });
    }
  }

  return entries;
}

/** 8 sub-judges reporting to the head judge (6 submitted → 60 advanced entries). */
export const MOCK_HEAD_SUB_JUDGES: MockHeadSubJudge[] = SUB_JUDGE_DEFS.map((j) => ({
  id: j.id,
  name: j.name,
  submitted: j.submitted,
}));

export const MOCK_HEAD_ADVANCED_ENTRIES: MockHeadJudgeAdvancedEntry[] =
  buildAdvancedEntries();

export const HEAD_JUDGE_TOTAL_SUB_JUDGES = MOCK_HEAD_SUB_JUDGES.length;

export const LONGLIST_CAP = 25;
export const SHORTLIST_CAP = 10;
export const PRIZE_CAP = 1;

export const PLACEMENT_OPTIONS: { value: HeadJudgePlacement; label: string }[] = [
  { value: "none", label: "No placement" },
  { value: "longlist", label: "Longlist" },
  { value: "shortlist", label: "Shortlist" },
  { value: "first_prize", label: "1st Prize" },
  { value: "second_prize", label: "2nd Prize" },
  { value: "third_prize", label: "3rd Prize" },
  { value: "childrens_prize", label: "Children's Prize" },
];

export const PRIZE_PLACEMENTS: HeadJudgePrizePlacement[] = [
  "first_prize",
  "second_prize",
  "third_prize",
  "childrens_prize",
];

export function placementLabel(placement: HeadJudgePlacement): string {
  return PLACEMENT_OPTIONS.find((o) => o.value === placement)?.label ?? "No placement";
}

export function isPrizePlacement(
  placement: HeadJudgePlacement
): placement is HeadJudgePrizePlacement {
  return PRIZE_PLACEMENTS.includes(placement as HeadJudgePrizePlacement);
}

/** Nested: prizes ⊂ shortlist ⊂ longlist. */
export function countsAsLonglist(placement: HeadJudgePlacement): boolean {
  return placement !== "none";
}

export function countsAsShortlist(placement: HeadJudgePlacement): boolean {
  return placement === "shortlist" || isPrizePlacement(placement);
}

export function countPlacementMembership(
  placements: Record<string, HeadJudgePlacement>
): {
  longlist: number;
  shortlist: number;
  first_prize: number;
  second_prize: number;
  third_prize: number;
  childrens_prize: number;
} {
  let longlist = 0;
  let shortlist = 0;
  let first_prize = 0;
  let second_prize = 0;
  let third_prize = 0;
  let childrens_prize = 0;

  for (const p of Object.values(placements)) {
    if (countsAsLonglist(p)) longlist += 1;
    if (countsAsShortlist(p)) shortlist += 1;
    if (p === "first_prize") first_prize += 1;
    if (p === "second_prize") second_prize += 1;
    if (p === "third_prize") third_prize += 1;
    if (p === "childrens_prize") childrens_prize += 1;
  }

  return {
    longlist,
    shortlist,
    first_prize,
    second_prize,
    third_prize,
    childrens_prize,
  };
}

/**
 * Whether filter matches an entry's placement, treating longlist/shortlist as nested.
 */
export function placementMatchesFilter(
  placement: HeadJudgePlacement,
  filter: HeadJudgePlacement | "all"
): boolean {
  if (filter === "all") return true;
  if (filter === "longlist") return countsAsLonglist(placement);
  if (filter === "shortlist") return countsAsShortlist(placement);
  return placement === filter;
}

const HEAD_JUDGE_STATE_KEY = "maya_prototype_head_judge_state_v4";

export type MockHeadJudgeWorkspaceState = {
  /** entryId → narrowest placement */
  placements: Record<string, HeadJudgePlacement>;
  finalized: boolean;
  /** Advanced books the head judge has physically received. */
  receivedIds: string[];
  /** Head judge's own notes keyed by entry id. */
  headNotes: Record<string, string>;
};

export function getMockHeadJudgeState(): MockHeadJudgeWorkspaceState {
  const empty: MockHeadJudgeWorkspaceState = {
    placements: {},
    finalized: false,
    receivedIds: [],
    headNotes: {},
  };
  if (typeof window === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(HEAD_JUDGE_STATE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as MockHeadJudgeWorkspaceState;
    const validValues = new Set(PLACEMENT_OPTIONS.map((o) => o.value));
    const placements: Record<string, HeadJudgePlacement> = {};
    if (parsed.placements && typeof parsed.placements === "object") {
      for (const [id, p] of Object.entries(parsed.placements)) {
        if (validValues.has(p as HeadJudgePlacement)) {
          placements[id] = p as HeadJudgePlacement;
        }
      }
    }
    return {
      placements,
      finalized: Boolean(parsed.finalized),
      receivedIds: Array.isArray(parsed.receivedIds) ? parsed.receivedIds : [],
      headNotes:
        parsed.headNotes && typeof parsed.headNotes === "object" && !Array.isArray(parsed.headNotes)
          ? parsed.headNotes
          : {},
    };
  } catch {
    return empty;
  }
}

export function persistMockHeadJudgeState(state: MockHeadJudgeWorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(HEAD_JUDGE_STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** Clear head-judge workspace (placements, received marks, notes, finalize). */
export function clearHeadJudgeDemoData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(HEAD_JUDGE_STATE_KEY);
    sessionStorage.removeItem("maya_prototype_head_judge_state_v3");
    sessionStorage.removeItem("maya_prototype_head_judge_state_v2");
    sessionStorage.removeItem("maya_prototype_head_judge_state");
  } catch {
    /* ignore */
  }
}
