import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { partitionSlices } from "@/utils/slices";
import { generateMetaDataInfo } from "@/utils/generateMetaDataInfo";
import type { PrismicMetaFields, PrismicSlice } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  const client = createClient();
  const doc = await client.getSingle("homepage").catch(() => null);

  if (!doc) return <></>;

  const slices: PrismicSlice[] = (doc.data as Record<string, unknown>).slices as PrismicSlice[] ?? [];
  const { hero, content, extra: faq } = partitionSlices(slices, ["faq"]);

  return (
    <>
      <SliceZone slices={hero} components={components} />
      <TwoColumnLayout>
        <SliceZone slices={content} components={components} />
      </TwoColumnLayout>
      <SliceZone slices={faq} components={components} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const doc = await client.getSingle("homepage").catch(() => null);

  return generateMetaDataInfo(
    doc?.data as PrismicMetaFields | undefined,
    "Maya Poetry Book Awards - Celebrating Excellence in Poetry",
    "The Maya Poetry Book Awards honour outstanding poetry collections that push boundaries and inspire readers globally."
  );
}
