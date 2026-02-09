import type { ImageField, KeyTextField, RichTextField } from "@prismicio/client";

// ---------------------------------------------------------------------------
// Prismic Slice Component Props
// All slices receive this shape from SliceZone. Only `slice` is typically used.
// ---------------------------------------------------------------------------

export interface SliceComponentProps<T> {
  slice: T;
  index: number;
  slices: PrismicSlice[];
  context: Record<string, unknown>;
}

// Base shape shared by every Prismic slice
export interface PrismicSlice {
  id: string;
  slice_type: string;
  variation: string;
  primary: Record<string, unknown>;
  items?: Record<string, unknown>[];
}

// ---------------------------------------------------------------------------
// Prismic Document Data (returned by client queries)
// ---------------------------------------------------------------------------

export interface PrismicDocument<T = Record<string, unknown>> {
  id: string;
  uid?: string;
  type: string;
  data: T;
}

export interface PrismicMetaFields {
  meta_title?: string;
  meta_description?: string;
  meta_image?: ImageField;
}

// ---------------------------------------------------------------------------
// Slice Types — one per slice component
// ---------------------------------------------------------------------------

export interface HeroSliceData extends PrismicSlice {
  slice_type: "hero";
  primary: {
    title: RichTextField;
    subtitle?: RichTextField;
    cta_text?: string;
    cta_link?: string;
    secondary_cta_text?: string;
    secondary_cta_link?: string;
    variant?: "default" | "home" | "small";
  };
}

export interface RichTextSliceData extends PrismicSlice {
  slice_type: "rich_text";
  primary: {
    content: RichTextField;
  };
}

export interface FaqSliceData extends PrismicSlice {
  slice_type: "faq";
  primary: {
    title: RichTextField;
    items?: Array<{
      question: string;
      answer: RichTextField;
    }>;
  };
}

export interface PrizeTableSliceData extends PrismicSlice {
  slice_type: "prize_table";
  primary: {
    items?: Array<{
      level: string;
      amount: string;
    }>;
    note?: string;
  };
}

export interface WinnersGridSliceData extends PrismicSlice {
  slice_type: "winners_grid";
  primary: {
    year?: number;
    items?: Array<{
      prize_level: string;
      book_title: string;
      author: string;
      author_2?: string;
      location?: string;
      cover_image?: ImageField;
      amazon_url?: string;
    }>;
  };
}

export interface JudgeProfileSliceData extends PrismicSlice {
  slice_type: "judge_profile";
  primary: {
    name?: string;
    title?: string;
    location?: string;
    portrait?: ImageField;
    bio?: RichTextField;
    entrepreneurial_history?: RichTextField;
    literary_history?: RichTextField;
    books?: Array<{
      book_title?: string;
      book_image?: ImageField;
      book_amazon_url?: string;
      book_description?: string;
    }>;
  };
}

export interface NewsletterSliceData extends PrismicSlice {
  slice_type: "newsletter";
  primary: {
    title?: string;
    description?: RichTextField;
  };
}

export interface ContactCardSliceData extends PrismicSlice {
  slice_type: "contact_card";
  primary: {
    title?: string;
    description?: RichTextField;
  };
}

export interface NavigationMenuSliceData extends PrismicSlice {
  slice_type: "navigation_menu";
  primary: {
    brand_name?: string;
    brand_logo?: ImageField;
    nav_links?: Array<{
      label: string;
      url: string;
    }>;
    past_winners_years?: Array<{
      year: number;
    }>;
  };
}

export interface FooterSliceData extends PrismicSlice {
  slice_type: "footer";
  primary: {
    copyright_text?: string;
    delivered_by_text?: string;
    delivered_by_url?: string;
  };
}

export interface AboutSectionSliceData extends PrismicSlice {
  slice_type: "about_section";
  primary: {
    about_title?: string;
    about_subtitle?: string;
    intro?: RichTextField;
    background?: RichTextField;
    funding?: RichTextField;
    partnerships?: RichTextField;
    sign_off_name?: string;
    sign_off_role?: string;
  };
}

// ---------------------------------------------------------------------------
// Past Winners Year — document-level fields (not slices)
// ---------------------------------------------------------------------------

export interface PastWinnersYearData extends PrismicMetaFields {
  year?: number;
  slices: PrismicSlice[];
  winners?: WinnerEntry[];
  shortlist?: ListEntry[];
  longlist?: ListEntry[];
}

export interface WinnerEntry {
  prize_level: string;
  book_title: string;
  author: string;
  author_2?: string;
  location?: string;
  cover_image?: ImageField;
  amazon_url?: string;
}

export interface ListEntry {
  book_title: string;
  author: string;
  location?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PRIZE_ORDER = ["1st Place", "2nd Place", "3rd Place", "Children's"] as const;

export const DEFAULT_YEARS = [2025, 2024, 2023, 2022, 2021, 2020];
