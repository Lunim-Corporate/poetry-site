import type { Metadata } from "next";
import type { PrismicMetaFields } from "@/types";

/**
 * Generates Next.js Metadata from Prismic document fields with fallback defaults.
 */
export function generateMetaDataInfo(
  docData: PrismicMetaFields | null | undefined,
  defaultTitle: string,
  defaultDescription: string
): Metadata {
  if (!docData) {
    return { title: defaultTitle, description: defaultDescription };
  }

  return {
    title: docData.meta_title || defaultTitle,
    description: docData.meta_description || defaultDescription,
    openGraph: docData.meta_image?.url
      ? { images: [{ url: docData.meta_image.url }] }
      : undefined,
  };
}
