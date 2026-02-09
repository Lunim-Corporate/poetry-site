import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { generateMetaDataInfo } from "@/utils/generateMetaDataInfo";
import type {
  PrismicSlice,
  PastWinnersYearData,
  WinnerEntry,
  ListEntry,
} from "@/types";
import { PRIZE_ORDER, DEFAULT_YEARS } from "@/types";

interface PageProps {
  params: Promise<{ year: string }>;
}

export const revalidate = 60;

export default async function WinnersYearPage({ params }: PageProps) {
  const { year } = await params;
  const client = createClient();

  const doc = await client.getByUID("past_winners_year", year).catch(() => null);

  if (doc) {
    const data = doc.data as unknown as PastWinnersYearData;
    const heroSlices = (data.slices ?? []).filter(
      (s: PrismicSlice) => s.slice_type === "hero"
    );

    const winners: WinnerEntry[] = data.winners ?? [];
    const shortlist: ListEntry[] = data.shortlist ?? [];
    const longlist: ListEntry[] = data.longlist ?? [];

    return (
      <>
        {heroSlices.length > 0 ? (
          <SliceZone slices={heroSlices} components={components} />
        ) : (
          <section className="min-h-[140px] bg-slate-50 border-b border-slate-200 flex items-center">
            <div className="w-full max-w-6xl mx-auto px-6 py-8">
              <div className="text-center">
                <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">{year}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Winners</h1>
              </div>
            </div>
          </section>
        )}

        <TwoColumnLayout>
          <div className="space-y-10">
            {/* Winners Grid */}
            {winners.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  {data.year ?? year} Award Winners
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {PRIZE_ORDER.map((level) => {
                    const winner = winners.find(
                      (w) => w.prize_level === level
                    );

                    return (
                      <div key={level} className="text-center">
                        <p
                          className={`text-sm font-semibold mb-3 ${
                            level === "1st Place"
                              ? "text-accent-dark"
                              : "text-slate-500"
                          }`}
                        >
                          {level}
                        </p>

                        {winner?.cover_image?.url ? (
                          <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md border border-slate-200 mb-3">
                            {winner.amazon_url ? (
                              <Link
                                href={winner.amazon_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <PrismicNextImage
                                  field={winner.cover_image}
                                  className="w-full h-full object-cover"
                                  fallbackAlt=""
                                />
                              </Link>
                            ) : (
                              <PrismicNextImage
                                field={winner.cover_image}
                                className="w-full h-full object-cover"
                                fallbackAlt=""
                              />
                            )}
                          </div>
                        ) : (
                          <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-md mb-3 flex items-center justify-center">
                            <span className="text-xs text-slate-400">TBD</span>
                          </div>
                        )}

                        {winner ? (
                          <p className="text-sm">
                            <span className="font-semibold text-slate-900 block">
                              {winner.book_title}
                            </span>
                            <em className="text-slate-600">
                              {[winner.author, winner.author_2]
                                .filter(Boolean)
                                .join(" & ")}
                            </em>
                            {winner.location && (
                              <>
                                <br />
                                <span className="text-slate-500">
                                  {winner.location}
                                </span>
                              </>
                            )}
                          </p>
                        ) : (
                          <p className="text-sm text-slate-400">TBD</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Shortlist */}
            {shortlist.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Shortlist
                </h3>
                <ul className="space-y-2">
                  {shortlist.map((entry, index) => (
                    <li key={index} className="text-slate-600">
                      <strong className="text-slate-900">
                        {entry.book_title}
                      </strong>{" "}
                      — <em>{entry.author}</em>
                      {entry.location && (
                        <span className="text-slate-500">
                          , {entry.location}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Longlist */}
            {longlist.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Longlist
                </h3>
                <ul className="space-y-2">
                  {longlist.map((entry, index) => (
                    <li key={index} className="text-slate-600">
                      <strong className="text-slate-900">
                        {entry.book_title}
                      </strong>{" "}
                      — <em>{entry.author}</em>
                      {entry.location && (
                        <span className="text-slate-500">
                          , {entry.location}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation */}
            <div className="pt-4 border-t border-slate-200">
              <Link
                href="/past-winners"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                ← Back to All Years
              </Link>
            </div>
          </div>
        </TwoColumnLayout>
      </>
    );
  }

  // Fallback
  return (
    <>
      <section className="min-h-[140px] bg-slate-50 border-b border-slate-200 flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">{year}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Winners</h1>
          </div>
        </div>
      </section>

      <TwoColumnLayout>
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">{year} Award Winners</h2>
          <p className="text-slate-500">Winners data is not yet available for this year.</p>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link
              href="/past-winners"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              ← Back to All Years
            </Link>
          </div>
        </div>
      </TwoColumnLayout>
    </>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const docs = await client.getAllByType("past_winners_year").catch(() => []);

  if (docs.length > 0) {
    return docs.map((doc) => ({ year: doc.uid }));
  }

  return DEFAULT_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const client = createClient();

  const doc = await client.getByUID("past_winners_year", year).catch(() => null);

  return generateMetaDataInfo(
    doc?.data as PastWinnersYearData | undefined,
    `${year} Winners`,
    `View the ${year} Maya Poetry Book Awards winners, shortlist, and longlist.`
  );
}
