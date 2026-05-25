import type { ImageField, RichTextField } from "@prismicio/client";

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

export interface AboutIntroSliceData extends PrismicSlice {
  slice_type: "about_intro";
  primary: {
    title?: string;
    subtitle?: RichTextField;
  };
}

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
    hero_image?: ImageField;
  };
}

export interface ClosedHeroSliceData extends PrismicSlice {
  slice_type: "closed_hero";
  primary: {
    title: RichTextField;
    subtitle?: RichTextField;
    variant?: "default" | "home" | "small";
    hero_image?: ImageField;
  };
}

export interface RichTextSliceData extends PrismicSlice {
  slice_type: "rich_text";
  primary: {
    content: RichTextField;
  };
}

export interface ListingSliceData extends PrismicSlice {
  slice_type: "listing";
  primary: {
    title?: RichTextField;
    copy?: RichTextField;
    items?: Array<{
      text: string;
    }>;
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
      portrait_image?: ImageField;
      amazon_url?: string;
      winner_bio?: string;
      winner_details?: string;
      literary_history?: string;
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

export interface PrizeSectionSliceData extends PrismicSlice {
  slice_type: "prize_section";
  primary: {
    section_title?: string;
    intro_text?: RichTextField;
    prizes?: Array<{
      prize_title?: string;
      prize_amount?: number;
    }>;
    childrens_prize_title?: string;
    childrens_prize_amount?: number;
    childrens_prize_description?: RichTextField;
    benefits_title?: string;
    benefits?: Array<{
      benefit?: string;
    }>;
    note?: RichTextField;
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
// Enter Page — document-level fields (not slices)
// ---------------------------------------------------------------------------

export interface EnterPageSettings {
  price_single_book?: number;
  price_multiple_books?: number;
  shipping_name?: string;
  shipping_street?: string;
  shipping_town?: string;
  shipping_postcode?: string;
  shipping_country?: string;
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
  press_media_heading?: string;
  press_media_link_url?: string;
  judge_section_heading?: string;
  judge_name?: string;
  judge_biog?: RichTextField;
  judges_comments_heading?: string;
  judges_comments_overview?: RichTextField;
  judges_comments_first_prize?: RichTextField;
  judges_comments_second_prize?: RichTextField;
  judges_comments_third_prize?: RichTextField;
  judges_comments_children_prize?: RichTextField;
   results_paragraph?: RichTextField;
   enter_cta_label?: string;
   enter_cta_url?: string;
}

export interface WinnerEntry {
  prize_level: string;
  book_title: string;
  author: string;
  author_2?: string;
  location?: string;
  cover_image?: ImageField;
  author_image?: ImageField;
  book_link?: string;
  amazon_url?: string;
  winner_bio?: RichTextField;
  winner_details?: RichTextField; // legacy field, prefer winner_bio
  literary_history?: RichTextField;
}

export interface ListEntry {
  book_title: string;
  book_link?: string;
  author: string;
  location?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PRIZE_ORDER = ["1st Prize", "2nd Prize", "3rd Prize", "Children's Prize"] as const;

export const DEFAULT_YEARS = [2025, 2024, 2023, 2022, 2021, 2020];
