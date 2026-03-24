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
                  className="bg-[#F9F5EF] border border-[#B7A08F] rounded-2xl p-4 md:p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-semibold text-slate-900 mb-0 md:mb-4 text-left">
                    {yearNumber} Winners
                  </h2>

                  <div className="md:border md:border-[#B7A08F] rounded-2xl overflow-hidden bg-[#F9F5EF]">
                    {/* Header row */}
                      <div className="hidden md:grid md:grid-cols-4 lg:[grid-template-columns:1.4fr_1fr_1fr_1fr] border-b border-[#B7A08F] text-center text-sm bg-[#FFFEFA]">
                        {PRIZE_ORDER.map((level, index) => (
                          <div
                            key={level}
                            className={`py-3 ${
                              index === 0
                                ? "font-bold text-slate-900"
                                : "font-semibold text-slate-700"
                            }`}
                          >
                            {level}
                          </div>
                        ))}
                      </div>

                    {/* Winners row */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-8 md:gap-0 md:grid-cols-4 [grid-template-columns:1.4fr_1fr_1fr_1fr] md:divide-x md:divide-dashed md:divide-slate-300 bg-[#F9F5EF]">
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
                          <div key={level} className="contents">
                            <div
                              className="py-3 md:px-4 md:py-4 flex flex-col items-center md:pt-4"
                            >
                            {/* Mobile-only: keep heading directly above cover */}
                            <p
                              className={`md:hidden mb-2 text-left w-full text-base sm:text-lg ${
                                isFirst
                                  ? "font-bold text-slate-900"
                                  : "font-semibold text-slate-700"
                              }`}
                            >
                              {level}
                            </p>

                            {winner?.cover_image?.url ? (
                              isFirst ? (
                                // 1st Prize: wider and taller cream panel with centered cover
                                <div className="w-full md:max-w-[280px] mb-2 md:mb-3 rounded-md bg-[#f5e9d4] border border-slate-200 flex items-center justify-center overflow-hidden shadow-md">
                                  <PrismicNextImage
                                    field={winner.cover_image}
                                    className="h-full w-auto object-contain"
                                    fallbackAlt=""
                                  />
                                </div>
                              ) : (
                                // Other prizes: smaller standard cover cards
                                <div className="w-full md:max-w-[140px] mb-2 md:mb-3 rounded-md overflow-hidden shadow-md border border-slate-200 bg-white">
                                  <PrismicNextImage
                                    field={winner.cover_image}
                                    className="h-full w-auto object-contain"
                                    fallbackAlt=""
                                  />
                                </div>
                              )
                            ) : isFirst ? (
                              <div className="w-full md:max-w-[280px] mb-2 md:mb-3 rounded-md bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                TBD
                              </div>
                            ) : (
                              <div className="w-full md:max-w-[140px] mb-2 md:mb-3 rounded-md bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                                TBD
                              </div>
                            )}

                            {winner ? (
                              <p className="text-[15px] md:text-sm text-left md:text-center leading-snug w-full">
                                <span className="font-semibold text-slate-900 block text-base md:text-sm">
                                  {winner.book_title}
                                </span>
                                {authors && (
                                  <em className="text-slate-600 block text-[15px] md:text-sm">
                                    {authors}
                                  </em>
                                )}
                                {winner.location && (
                                  <span className="text-slate-500 block text-[15px] md:text-sm">
                                    {winner.location}
                                  </span>
                                )}
                              </p>
                            ) : (
                              <p className="text-[15px] text-slate-400 text-left md:text-center w-full">
                                Winner to be announced
                              </p>
                            )}

                            </div>

                            {index === 1 && (
                              <div className="col-span-2 md:hidden my-1 grid grid-cols-2 gap-4 px-4">
                                <div className="border-t border-dashed border-slate-300" />
                                <div className="border-t border-dashed border-slate-300" />
                              </div>
                            )}
                            {index === 3 && (
                              <div className="col-span-2 md:hidden my-1 grid grid-cols-2 gap-4 px-4">
                                <div className="border-t border-dashed border-slate-300" />
                                <div className="border-t border-dashed border-slate-300" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 text-right">
                    <Link
                      href={`/past-winners/${yearNumber}`}
                      className="text-md font-medium text-slate-700 hover:text-primary transition-colors underline underline-offset-2"
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
