import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { partitionSlices } from "@/utils/slices";
import { generateMetaDataInfo } from "@/utils/generateMetaDataInfo";
import type { PrismicMetaFields, PrismicSlice, EnterPageSettings } from "@/types";
import EnterPageClient from "./EnterPageClient";

export const revalidate = 60;

export default async function EnterPage() {
  const client = createClient();
  const doc = await client.getSingle("enter_page").catch(() => null);

  const data = (doc?.data ?? {}) as Record<string, unknown>;
  const slices: PrismicSlice[] = (data.slices as PrismicSlice[]) ?? [];
  const { hero } = partitionSlices(slices);

  const settings: EnterPageSettings = {
    price_single_book: data.price_single_book as number | undefined,
    price_multiple_books: data.price_multiple_books as number | undefined,
    shipping_name: data.shipping_name as string | undefined,
    shipping_street: data.shipping_street as string | undefined,
    shipping_town: data.shipping_town as string | undefined,
    shipping_postcode: data.shipping_postcode as string | undefined,
    shipping_country: data.shipping_country as string | undefined,
  };

  return (
    <>
      {hero.length > 0 && (
        <SliceZone slices={hero} components={components} />
      )}
      <EnterPageClient settings={settings} />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const doc = await client.getSingle("enter_page").catch(() => null);

  return generateMetaDataInfo(
    doc?.data as PrismicMetaFields | undefined,
    "Enter Competition - Maya Poetry Book Awards",
    "Enter your poetry book into the Maya Poetry Book Awards competition."
  );
}
