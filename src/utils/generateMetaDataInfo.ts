import type { Metadata } from "next";

interface MetaData {
  meta_title?: string;
  meta_description?: string;
  meta_image?: { url?: string };
}

export const generateMetaDataInfo = (
  docData: MetaData | null,
  defaultTitle: string,
  defaultDescription: string
): Metadata => {
  if (!docData) {
    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }

  return {
    title: docData.meta_title || defaultTitle,
    description: docData.meta_description || defaultDescription,
    openGraph: docData.meta_image?.url
      ? {
          images: [{ url: docData.meta_image.url }],
        }
      : undefined,
  };
};
