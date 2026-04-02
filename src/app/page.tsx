import type { Metadata } from "next";
import type React from "react";
import { Fragment } from "react";
import { SliceZone } from "@prismicio/react";
import Image from "next/image";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import HomeHashScroll from "@/components/HomeHashScroll";
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
      <HomeHashScroll />
      <SliceZone slices={hero} components={components} />
      <TwoColumnLayout>
        {content.map((slice, index) => {
          const Component = components[slice.slice_type as keyof typeof components] as React.ComponentType<{ slice: PrismicSlice; index: number; slices: PrismicSlice[]; context: Record<string, unknown> }> | undefined;
          return (
            <Fragment key={slice.id}>
              {index > 0 && (
                <div className="flex justify-center py-2">
                  <Image src="/divider.svg" alt="" width={800} height={4} />
                </div>
              )}
              {Component && (
                <Component slice={slice} index={index} slices={content} context={{}} />
              )}
            </Fragment>
          );
        })}
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
