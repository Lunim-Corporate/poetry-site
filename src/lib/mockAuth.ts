/**
 * PROTOTYPE-ONLY mock auth.
 * Not real authentication — hardcoded credentials for design/demo purposes.
 * Replace with a real auth provider before production.
 */

export type MockRole = "applicant" | "sub_judge" | "head_judge";

export type PipelineStage =
  | "entered"
  | "book_posted"
  | "in_judging"
  | "final_result";

/**
 * Narrowest final-result tier for a book.
 * Nested: prize ⊂ shortlist ⊂ longlist.
 * `not_selected` = results announced, not longlisted.
 */
export type FinalResultOutcome =
  | "first_prize"
  | "second_prize"
  | "third_prize"
  | "childrens_prize"
  | "shortlisted"
  | "longlisted"
  | "not_selected";

export type PostingStatus =
  | "not_yet_assigned"
  | "assigned_not_posted"
  | "posted"
  | "reassigned_after_posting";

export type MockShippingAddress = {
  name: string;
  street: string;
  town: string;
  postcode: string;
  country: string;
};

/** Per-book posting / judge-assignment state for the applicant dashboard demos. */
export type MockApplicantBookPosting = {
  id: string;
  bookTitle: string;
  /**
   * @deprecated Prefer presence of `shipping` — assignment is instant.
   * Kept for organiser / legacy call sites.
   */
  postingStatus: PostingStatus;
  /**
   * Optional pipeline stage. When unset, defaults to "entered".
   */
  stage?: PipelineStage;
  /** Only used when this book's stage === "final_result". */
  outcome?: FinalResultOutcome;
  /** Current assigned judge address — always set once assignment is complete. */
  shipping?: MockShippingAddress;
  /** @deprecated Mid-flow reassignment UI removed. */
  judgeChangedBeforePosting?: boolean;
  /** @deprecated Mid-flow reassignment UI removed. */
  postedToShipping?: MockShippingAddress;
  /** @deprecated Mid-flow reassignment UI removed. */
  reassignedToShipping?: MockShippingAddress;
  /** @deprecated Applicant self-report posting removed. */
  postedAt?: string;
};

export type MockApplicantEntry = {
  name: string;
  email: string;
  bookCount: number;
  reference: string;
  submittedAt: string; // ISO date
  /**
   * @deprecated Entry-level stage — pipeline is now per book via books[].stage /
   * bookPipelineStage(). Kept for older call sites / fallbacks.
   */
  stage: PipelineStage;
  /** @deprecated Prefer books[].outcome when a book reaches final_result. */
  outcome?: FinalResultOutcome;
  /** @deprecated Prefer books[].shipping — kept for email/success fallbacks. */
  shipping: MockShippingAddress;
  /** One record per book — each has a current judge address ready to show. */
  books: MockApplicantBookPosting[];
};

export type MockSession = {
  email: string;
  role: MockRole;
  name: string;
};

type MockAccount = {
  email: string;
  password: string;
  role: MockRole;
  name: string;
};

const JUDGE_ALEX: MockShippingAddress = {
  name: "Alex Morgan",
  street: "14 Chapel Street",
  town: "Cardiff",
  postcode: "CF10 2AB",
  country: "United Kingdom",
};

const JUDGE_RILEY: MockShippingAddress = {
  name: "Riley Quinn",
  street: "22 Mill Lane",
  town: "Swansea",
  postcode: "SA1 3AB",
  country: "United Kingdom",
};

const JUDGE_CASEY: MockShippingAddress = {
  name: "Casey Nguyen",
  street: "8 Harbour View",
  town: "Newport",
  postcode: "NP20 1DA",
  country: "United Kingdom",
};

// ---------------------------------------------------------------------------
// Hardcoded prototype accounts — DO NOT use in production
// ---------------------------------------------------------------------------
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    email: "applicant@demo.maya",
    password: "Demo1234",
    role: "applicant",
    name: "Jordan Ellis",
  },
  {
    email: "subjudge@demo.maya",
    password: "Demo1234",
    role: "sub_judge",
    name: "Alex Morgan",
  },
  {
    email: "headjudge@demo.maya",
    password: "Demo1234",
    role: "head_judge",
    name: "Sam Rivera",
  },
];

/** Demo entry payload for the applicant account. Pipeline stage is per book. */
export const MOCK_APPLICANT_ENTRY: MockApplicantEntry = {
  name: "Jordan Ellis",
  email: "applicant@demo.maya",
  bookCount: 10,
  reference: "MAYA-2026-A1B2C3D4",
  submittedAt: "2026-03-12",
  stage: "entered",
  shipping: JUDGE_ALEX,
  // Every book has a current judge address; stages/outcomes vary for tracker demos
  books: [
    {
      id: "app-book-entered-1",
      bookTitle: "Waiting on the Tide",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_ALEX,
      stage: "entered",
    },
    {
      id: "app-book-entered-2",
      bookTitle: "Monsoon Letters",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_RILEY,
      stage: "entered",
    },
    {
      id: "app-book-in-judging",
      bookTitle: "Glass Orchard",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_ALEX,
      stage: "in_judging",
    },
    {
      id: "app-book-first-prize",
      bookTitle: "Northern Windows",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_CASEY,
      stage: "final_result",
      outcome: "first_prize",
    },
    {
      id: "app-book-second-prize",
      bookTitle: "Saltwater Hymns",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_ALEX,
      stage: "final_result",
      outcome: "second_prize",
    },
    {
      id: "app-book-shortlisted",
      bookTitle: "Harbour Lights",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_RILEY,
      stage: "final_result",
      outcome: "shortlisted",
    },
    {
      id: "app-book-longlisted",
      bookTitle: "Olive Grove Psalms",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_CASEY,
      stage: "final_result",
      outcome: "longlisted",
    },
    {
      id: "app-book-not-selected",
      bookTitle: "Frost Line",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_ALEX,
      stage: "final_result",
      outcome: "not_selected",
    },
    {
      id: "app-book-third-prize",
      bookTitle: "River Mouth",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_RILEY,
      stage: "final_result",
      outcome: "third_prize",
    },
    {
      id: "app-book-childrens-prize",
      bookTitle: "Paper Lanterns, Still Burning",
      postingStatus: "assigned_not_posted",
      shipping: JUDGE_CASEY,
      stage: "final_result",
      outcome: "childrens_prize",
    },
  ],
};

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: "entered", label: "Entered" },
  { id: "book_posted", label: "Book posted" },
  { id: "in_judging", label: "In judging" },
  { id: "final_result", label: "Final result" },
];

const SESSION_KEY = "maya_prototype_session";

export function loginWithMockCredentials(
  email: string,
  password: string
): { ok: true; session: MockSession } | { ok: false; error: string } {
  const normalised = email.trim().toLowerCase();
  const account = MOCK_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === normalised && a.password === password
  );

  if (!account) {
    return { ok: false, error: "Incorrect email or password. Please try again." };
  }

  const session: MockSession = {
    email: account.email,
    role: account.role,
    name: account.name,
  };
  persistSession(session);
  return { ok: true, session };
}

/** Prototype signup: always creates an applicant session (no real account store). */
export function signupWithMockCredentials(
  email: string,
  password: string,
  entryReference: string
): { ok: true; session: MockSession } | { ok: false; error: string } {
  if (password.length < 8) {
    return { ok: false, error: "Please choose a password with at least 8 characters." };
  }

  const ref = entryReference.trim().toUpperCase();
  if (!/^MAYA-\d{4}-[A-Z0-9]+$/i.test(ref)) {
    return {
      ok: false,
      error:
        "That entry reference number doesn’t look valid. Check your confirmation email and try again.",
    };
  }

  const known = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  const session: MockSession = {
    email: email.trim().toLowerCase(),
    role: "applicant",
    name: known?.name ?? email.trim().split("@")[0] ?? "Entrant",
  };
  persistSession(session);
  return { ok: true, session };
}

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MockSession;
  } catch {
    return null;
  }
}

export function clearMockSession(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

function persistSession(session: MockSession): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function roleDashboardLabel(role: MockRole): string {
  switch (role) {
    case "applicant":
      return "Applicant";
    case "sub_judge":
      return "Sub-judge";
    case "head_judge":
      return "Head judge";
  }
}

export function pipelineStageLabel(stage: PipelineStage): string {
  return PIPELINE_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

/** Short label for tables / badges. */
export function formatOutcome(outcome: FinalResultOutcome): string {
  switch (outcome) {
    case "first_prize":
      return "1st Prize";
    case "second_prize":
      return "2nd Prize";
    case "third_prize":
      return "3rd Prize";
    case "childrens_prize":
      return "Children's Prize";
    case "shortlisted":
      return "Shortlisted";
    case "longlisted":
      return "Longlisted";
    case "not_selected":
      return "Not selected this year";
  }
}

/**
 * Warm informing message shown on the applicant dashboard once results are announced.
 * Outcome is the narrowest tier; prizes imply shortlist and longlist membership.
 */
export function formatOutcomeMessage(outcome: FinalResultOutcome): string {
  switch (outcome) {
    case "first_prize":
      return "Congratulations — your book won 1st Prize!";
    case "second_prize":
      return "Congratulations — your book won 2nd Prize!";
    case "third_prize":
      return "Congratulations — your book won 3rd Prize!";
    case "childrens_prize":
      return "Congratulations — your book won the Children's Prize!";
    case "shortlisted":
      return "Your book was shortlisted — one of our top 10 entries this year.";
    case "longlisted":
      return "Your book made our longlist of 25 standout entries.";
    case "not_selected":
      return "Thank you for sharing your work with us. It wasn't selected for this year's lists, but we're grateful you entered and hope you'll consider entering again.";
  }
}

/** Whether this outcome includes longlist membership (nested tiers). */
export function outcomeIncludesLonglist(outcome: FinalResultOutcome): boolean {
  return outcome !== "not_selected";
}

/** Whether this outcome includes shortlist membership (nested tiers). */
export function outcomeIncludesShortlist(outcome: FinalResultOutcome): boolean {
  return (
    outcome === "shortlisted" ||
    outcome === "first_prize" ||
    outcome === "second_prize" ||
    outcome === "third_prize" ||
    outcome === "childrens_prize"
  );
}

export function stageIndex(stage: PipelineStage): number {
  return PIPELINE_STAGES.findIndex((s) => s.id === stage);
}

/**
 * Per-book pipeline stage for the applicant dashboard tracker.
 * Uses books[].stage when set; otherwise "entered".
 */
export function bookPipelineStage(book: MockApplicantBookPosting): PipelineStage {
  if (book.stage && stageIndex(book.stage) >= 0) {
    return book.stage;
  }
  return "entered";
}

const APPLICANT_POSTING_KEY = "maya_prototype_applicant_posting";

export type ApplicantPostingOverride = {
  postingStatus: PostingStatus;
  postedAt?: string;
  stage?: PipelineStage;
};

export function getApplicantPostingOverrides(): Record<string, ApplicantPostingOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(APPLICANT_POSTING_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, ApplicantPostingOverride>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function persistApplicantPostingOverrides(
  overrides: Record<string, ApplicantPostingOverride>
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(APPLICANT_POSTING_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function markApplicantBookPosted(bookId: string): ApplicantPostingOverride {
  const overrides = getApplicantPostingOverrides();
  const next: ApplicantPostingOverride = {
    postingStatus: "posted",
    postedAt: new Date().toISOString().slice(0, 10),
    stage: "book_posted",
  };
  overrides[bookId] = next;
  persistApplicantPostingOverrides(overrides);
  return next;
}

/** Build a synthetic book posting record (safe for server + client). */
export function postingBookFromShipping(
  shipping: MockShippingAddress | undefined,
  status: PostingStatus,
  id = "success-entry"
): MockApplicantBookPosting {
  return {
    id,
    bookTitle: "",
    postingStatus: status,
    shipping,
  };
}

export function mergeApplicantBooksWithOverrides(
  books: MockApplicantBookPosting[]
): MockApplicantBookPosting[] {
  const overrides = getApplicantPostingOverrides();
  return books.map((book) => {
    const override = overrides[book.id];
    if (!override) return book;
    return {
      ...book,
      postingStatus: override.postingStatus,
      postedAt: override.postedAt ?? book.postedAt,
      stage: override.stage ?? book.stage,
    };
  });
}

export function formatShippingOneLine(shipping: MockShippingAddress): string {
  const street = shipping.street.replace(/\n/g, ", ");
  return `${shipping.name}, ${street}, ${shipping.town}, ${shipping.postcode}, ${shipping.country}`;
}

// ---------------------------------------------------------------------------
// Sub-judge queue — PROTOTYPE-ONLY mock data (assigned to Alex Morgan only)
// Judging is per book; applicants with multiple books share one entry reference.
// ---------------------------------------------------------------------------

export type MockSubJudgeBook = {
  id: string;
  applicantName: string;
  /** Shared across all books from the same payment/entry. */
  reference: string;
  bookTitle: string;
  dateReceived: string;
  /** Total books from this applicant in the queue (for grouping cue). */
  booksFromApplicant: number;
  /** 1-based index among this applicant's books. */
  bookIndexFromApplicant: number;
  /** Pipeline stage for the shared judging table. */
  stage: PipelineStage;
};

/** @deprecated Use MockSubJudgeBook — kept as alias during transition. */
export type MockSubJudgeEntry = MockSubJudgeBook;

type SubJudgeApplicantSeed = {
  reference: string;
  applicantName: string;
  dateReceived: string;
  bookTitles: string[];
};

const SUB_JUDGE_APPLICANT_SEEDS: SubJudgeApplicantSeed[] = [
  {
    reference: "MAYA-2026-P8K2M1QX",
    applicantName: "Priya Sharma",
    dateReceived: "2026-02-03",
    bookTitles: ["Monsoon Letters"],
  },
  {
    reference: "MAYA-2026-R4T9N2LW",
    applicantName: "Marcus Webb",
    dateReceived: "2026-02-05",
    bookTitles: ["Saltwater Hymns", "Night Buses Home"],
  },
  {
    reference: "MAYA-2026-H7C3B5YD",
    applicantName: "Elena Vasquez",
    dateReceived: "2026-02-08",
    bookTitles: ["The Soft Architecture of Grief"],
  },
  {
    reference: "MAYA-2026-K1F6Z8AP",
    applicantName: "Tomás O’Brien",
    dateReceived: "2026-02-11",
    bookTitles: ["Harbour Lights", "Field Notes from Nowhere", "A Brief Inventory of Rain"],
  },
  {
    reference: "MAYA-2026-M2Q9V4JE",
    applicantName: "Aisha Rahman",
    dateReceived: "2026-02-14",
    bookTitles: ["Glass Orchard"],
  },
  {
    reference: "MAYA-2026-D5W1X7ST",
    applicantName: "Jonah Keller",
    dateReceived: "2026-02-18",
    bookTitles: ["Maps Without Borders", "The Quiet Hours"],
  },
  {
    reference: "MAYA-2026-G8N4C2UR",
    applicantName: "Mei Lin Chen",
    dateReceived: "2026-02-21",
    bookTitles: ["Paper Lanterns, Still Burning"],
  },
  {
    reference: "MAYA-2026-B3H9L6FK",
    applicantName: "Daniel Okonkwo",
    dateReceived: "2026-02-24",
    bookTitles: ["Drumskin and Dust"],
  },
  {
    reference: "MAYA-2026-Y6P2A1NM",
    applicantName: "Sophie Laurent",
    dateReceived: "2026-02-28",
    bookTitles: ["Rue des Étoiles", "Winter Tables"],
  },
  {
    reference: "MAYA-2026-T9E5R3QW",
    applicantName: "Ibrahim Hassan",
    dateReceived: "2026-03-02",
    bookTitles: ["Olive Grove Psalms"],
  },
  {
    reference: "MAYA-2026-V4S8D7ZX",
    applicantName: "Clara Jensen",
    dateReceived: "2026-03-05",
    bookTitles: ["Northern Windows"],
  },
  {
    reference: "MAYA-2026-L7J1K9HC",
    applicantName: "Noah Patel",
    dateReceived: "2026-03-08",
    bookTitles: ["River Mouth", "What the Tide Keeps"],
  },
  {
    reference: "MAYA-2026-W2M6P4BG",
    applicantName: "Freya Nilsson",
    dateReceived: "2026-03-10",
    bookTitles: ["Frost Line"],
  },
  {
    reference: "MAYA-2026-C5A9T8YD",
    applicantName: "Luis Fernández",
    dateReceived: "2026-03-12",
    bookTitles: ["Plaza de los Olvidos"],
  },
];

function buildSubJudgeBooks(seeds: SubJudgeApplicantSeed[]): MockSubJudgeBook[] {
  const books: MockSubJudgeBook[] = [];
  let seq = 0;
  for (const seed of seeds) {
    const total = seed.bookTitles.length;
    seed.bookTitles.forEach((bookTitle, index) => {
      seq += 1;
      books.push({
        id: `sj-book-${String(seq).padStart(2, "0")}`,
        applicantName: seed.applicantName,
        reference: seed.reference,
        bookTitle,
        dateReceived: seed.dateReceived,
        booksFromApplicant: total,
        bookIndexFromApplicant: index + 1,
        stage: "in_judging",
      });
    });
  }
  return books;
}

/** Individual books assigned to the demo sub-judge (subjudge@demo.maya). */
export const MOCK_SUB_JUDGE_ENTRIES: MockSubJudgeBook[] = buildSubJudgeBooks(
  SUB_JUDGE_APPLICANT_SEEDS
);

const SUB_JUDGE_STATE_KEY = "maya_prototype_sub_judge_state_v3";

/** Head judge postal address for sub-judge → head-judge physical book posting (prototype). */
export const MOCK_HEAD_JUDGE_SHIPPING = {
  name: "Sam Rivera",
  street: "3 Cathedral Road",
  town: "Cardiff",
  postcode: "CF11 9HA",
  country: "United Kingdom",
};

export type MockSubJudgeWorkspaceState = {
  reviewedIds: string[];
  starredIds: string[];
  submitted: boolean;
  /** Required review paragraphs keyed by book id — visible to head judge when shortlisted. */
  notes: Record<string, string>;
};

export function getMockSubJudgeState(): MockSubJudgeWorkspaceState {
  const empty: MockSubJudgeWorkspaceState = {
    reviewedIds: [],
    starredIds: [],
    submitted: false,
    notes: {},
  };
  if (typeof window === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(SUB_JUDGE_STATE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as MockSubJudgeWorkspaceState;
    return {
      reviewedIds: Array.isArray(parsed.reviewedIds) ? parsed.reviewedIds : [],
      starredIds: Array.isArray(parsed.starredIds) ? parsed.starredIds : [],
      submitted: Boolean(parsed.submitted),
      notes:
        parsed.notes && typeof parsed.notes === "object" && !Array.isArray(parsed.notes)
          ? parsed.notes
          : {},
    };
  } catch {
    return empty;
  }
}

export function persistMockSubJudgeState(state: MockSubJudgeWorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SUB_JUDGE_STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** Clear applicant posting overrides (seed books restore on remount). */
export function clearApplicantDemoData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(APPLICANT_POSTING_KEY);
  } catch {
    /* ignore */
  }
}

/** Clear sub-judge workspace (reviews, Top 10, submit flag). */
export function clearSubJudgeDemoData(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SUB_JUDGE_STATE_KEY);
    // Legacy keys from earlier prototype iterations
    sessionStorage.removeItem("maya_prototype_sub_judge_state");
    sessionStorage.removeItem("maya_prototype_sub_judge_state_v2");
  } catch {
    /* ignore */
  }
}
