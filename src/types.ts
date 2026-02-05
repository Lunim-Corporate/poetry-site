import type { ImageField, KeyTextField, RichTextField } from "@prismicio/client";

// Domain Models

export interface Prize {
  level: "1st" | "2nd" | "3rd" | "Children";
  amount: string;
  note?: string;
}

export interface Winner {
  year: number;
  prizeLevel: "1st" | "2nd" | "3rd" | "Children";
  bookTitle: string;
  authors: string[];
  location: string;
  coverImage: ImageField;
  amazonUrl?: string;
}

export interface ShortlistEntry {
  bookTitle: string;
  authors: string[];
  location: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Book {
  title: string;
  image: ImageField;
  amazonUrl?: string;
  description?: string;
}

export interface JudgeProfile {
  name: string;
  title?: string;
  location?: string;
  bio: string;
  portrait: ImageField;
  entrepreneurialHistory?: string;
  literaryHistory?: string;
  books: Book[];
}

export interface PricingTier {
  quantity: number;
  pricePerBook: number;
  totalPrice: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  town: string;
  postcode: string;
  country: string;
}

// Prismic Slice Types

export interface HeroSlice {
  slice_type: "hero";
  primary: {
    title: RichTextField;
    subtitle: RichTextField;
    cta_text: KeyTextField;
    cta_link: KeyTextField;
    variant: "default" | "home" | "small";
  };
}

export interface RichTextSlice {
  slice_type: "rich_text";
  primary: {
    content: RichTextField;
  };
}

export interface FAQSlice {
  slice_type: "faq";
  primary: {
    title: RichTextField;
  };
  items: {
    question: KeyTextField;
    answer: RichTextField;
  }[];
}

export interface PrizeTableSlice {
  slice_type: "prize_table";
  items: {
    level: KeyTextField;
    amount: KeyTextField;
    note: KeyTextField;
  }[];
}

export interface WinnersGridSlice {
  slice_type: "winners_grid";
  primary: {
    year: number;
  };
  items: {
    prize_level: KeyTextField;
    book_title: KeyTextField;
    author: KeyTextField;
    author_2: KeyTextField;
    location: KeyTextField;
    cover_image: ImageField;
    amazon_url: KeyTextField;
  }[];
}

export interface JudgeProfileSlice {
  slice_type: "judge_profile";
  primary: {
    name: KeyTextField;
    title: KeyTextField;
    location: KeyTextField;
    portrait: ImageField;
    bio: RichTextField;
    entrepreneurial_history: RichTextField;
    literary_history: RichTextField;
  };
  items: {
    book_title: KeyTextField;
    book_image: ImageField;
    book_amazon_url: KeyTextField;
    book_description: KeyTextField;
  }[];
}

export interface NewsletterSlice {
  slice_type: "newsletter";
  primary: {
    title: KeyTextField;
    description: RichTextField;
  };
}

export interface ContactCardSlice {
  slice_type: "contact_card";
  primary: {
    title: KeyTextField;
    description: RichTextField;
  };
}

export interface TwoColumnSlice {
  slice_type: "two_column";
  primary: {
    variant: "default" | "home";
  };
  items: {
    content: RichTextField;
  }[];
}
