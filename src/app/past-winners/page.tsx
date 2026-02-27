import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { generateMetaDataInfo } from "@/utils/generateMetaDataInfo";
import type {
  PrismicMetaFields,
  PrismicSlice,
  PastWinnersYearData,
  WinnerEntry,
} from "@/types";
import { DEFAULT_YEARS, PRIZE_ORDER } from "@/types";

export const revalidate = 60;

export default async function PastWinnersPage() {
  const client = createClient();
  const doc = await client.getSingle("past_winners_page").catch(() => null);

  const yearDocs = await client.getAllByType("past_winners_year").catch(() => []);

  const parsedYearDocs =
    yearDocs.length > 0
      ? yearDocs
          .map((doc) => {
            const yearNumber = Number(doc.uid);
            if (Number.isNaN(yearNumber)) return null;
            return {
              yearNumber,
              data: doc.data as unknown as PastWinnersYearData,
            };
          })
          .filter(
            (
              entry
            ): entry is {
              yearNumber: number;
              data: PastWinnersYearData;
            } => entry !== null
          )
          .sort((a, b) => b.yearNumber - a.yearNumber)
      : [];

  const years =
    parsedYearDocs.length > 0
      ? parsedYearDocs.map((entry) => entry.yearNumber)
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
        <div className="space-y-10">
          {parsedYearDocs.length > 0 ? (
            parsedYearDocs.map(({ yearNumber, data }) => {
              const winners: WinnerEntry[] = data.winners ?? [];

              return (
                <section
                  key={yearNumber}
                  className="bg-[#F9F5EF] border border-slate-300 rounded-2xl p-6 md:p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    {yearNumber} Winners
                  </h2>

                  <div className="border border-slate-300 rounded-2xl overflow-hidden bg-[#F9F5EF]">
                    {/* Header row */}
                    <div className="grid grid-cols-4 border-b border-slate-300 text-center text-sm font-semibold text-slate-800 bg-[#FFFEFA]">
                      {PRIZE_ORDER.map((level) => (
                        <div key={level} className="py-3">
                          {level}
                        </div>
                      ))}
                    </div>

                    {/* Winners row */}
                    <div className="grid grid-cols-4 divide-x divide-dashed divide-slate-300 bg-[#F9F5EF]">
                      {PRIZE_ORDER.map((level, index) => {
                        const winner = winners.find(
                          (w) => w.prize_level === level
                        );

                        const authors = winner
                          ? [winner.author, winner.author_2]
                              .filter(Boolean)
                              .join(" & ")
                          : "";

                        const isFirst = index === 0;

                        return (
                          <div
                            key={level}
                            className="px-4 py-4 flex flex-col items-center"
                          >
                            {winner?.cover_image?.url ? (
                              <div
                                className={`w-full max-w-[170px] aspect-[2/3] mb-3 rounded-md overflow-hidden shadow-md border border-slate-200 ${
                                  isFirst ? "bg-[#f5e9d4]" : "bg-white"
                                }`}
                              >
                                <PrismicNextImage
                                  field={winner.cover_image}
                                  className="w-full h-full object-cover"
                                  fallbackAlt=""
                                />
                              </div>
                            ) : (
                              <div className="w-full max-w-[170px] aspect-[2/3] mb-3 rounded-md bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                TBD
                              </div>
                            )}

                            {winner ? (
                              <p className="text-sm text-center leading-snug">
                                <span className="font-semibold text-slate-900 block">
                                  {winner.book_title}
                                </span>
                                {authors && (
                                  <em className="text-slate-600 block">
                                    {authors}
                                  </em>
                                )}
                                {winner.location && (
                                  <span className="text-slate-500 block">
                                    {winner.location}
                                  </span>
                                )}
                              </p>
                            ) : (
                              <p className="text-sm text-slate-400 text-center">
                                Winner to be announced
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <Link
                      href={`/past-winners/${yearNumber}`}
                      className="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                    >
                      More details plus the {yearNumber} shortlist &raquo;
                    </Link>
                  </div>
                </section>
              );
            })
          ) : (
            <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Winners by Year
              </h2>
              <p className="text-slate-600 mb-6">
                Explore the exceptional poetry collections that have been
                recognized by the Maya Poetry Book Awards over the years.
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
            </section>
          )}
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
