import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { generateMetaDataInfo } from "@/utils/generateMetaDataInfo";
import type { PrismicMetaFields, PrismicSlice } from "@/types";
import { DEFAULT_YEARS } from "@/types";

export const revalidate = 60;

export default async function PastWinnersPage() {
  const client = createClient();
  const doc = await client.getSingle("past_winners_page").catch(() => null);

  const yearDocs = await client.getAllByType("past_winners_year").catch(() => []);

  const years =
    yearDocs.length > 0
      ? yearDocs
          .map((d) => Number(d.uid))
          .filter((y) => !isNaN(y))
          .sort((a, b) => b - a)
      : DEFAULT_YEARS;

  const heroSlices: PrismicSlice[] = doc
    ? ((doc.data as Record<string, unknown>).slices as PrismicSlice[] ?? []).filter(
        (s) => s.slice_type === "hero"
      )
    : [];

  const heroFallback = (
    <section className="min-h-[140px] bg-slate-50 border-b border-slate-200 flex items-center">
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">Browse Our</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Past Winners</h1>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {heroSlices.length > 0 ? (
        <SliceZone slices={heroSlices} components={components} />
      ) : (
        heroFallback
      )}

      <TwoColumnLayout>
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Winners by Year</h2>
          <p className="text-slate-600 mb-6">
            Explore the exceptional poetry collections that have been recognized
            by the Maya Poetry Book Awards over the years.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {years.map((year) => (
              <Link
                key={year}
                href={`/past-winners/${year}`}
                className="text-center px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
              >
                {year} Winners
              </Link>
            ))}
          </div>
        </div>
      </TwoColumnLayout>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const doc = await client.getSingle("past_winners_page").catch(() => null);

  return generateMetaDataInfo(
    doc?.data as PrismicMetaFields | undefined,
    "Past Winners",
    "Explore the exceptional poetry collections recognized by the Maya Poetry Book Awards over the years."
  );
}
