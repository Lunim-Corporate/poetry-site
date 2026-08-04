import type { Metadata } from "next";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";
import TwoColumnLayout from "@/components/TwoColumnLayout";
import { generateMetaDataInfo } from "@/utils/generateMetaDataInfo";
import type { RichTextField } from "@prismicio/client";
import type {
  PrismicSlice,
  PastWinnersYearData,
  WinnerEntry,
  ListEntry,
} from "@/types";
import { DEFAULT_YEARS } from "@/types";
import { wrapCoverWithBookLink } from "@/lib/wrapCoverWithBookLink";

const proseClasses =
  "prose prose-slate max-w-none prose-p:text-[#333333] prose-p:leading-relaxed [&_p+p]:mt-6 prose-strong:text-slate-900 prose-a:text-primary prose-a:underline hover:prose-a:text-primary-light prose-li:text-slate-600";

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
    const allSlices = (data.slices ?? []) as PrismicSlice[];
    const heroSlices = allSlices
      .filter((s) => s.slice_type === "hero")
      .map((s) => ({
        ...s,
        primary: {
          ...s.primary,
          variant: "small",
        },
      }));

    const winners: WinnerEntry[] = data.winners ?? [];
    const shortlist: ListEntry[] = data.shortlist ?? [];
    const longlist: ListEntry[] = data.longlist ?? [];
    const judgesPrizeComments = [
      data.judges_comments_first_prize,
      data.judges_comments_second_prize,
      data.judges_comments_third_prize,
      data.judges_comments_children_prize,
    ].filter(Boolean) as RichTextField[];

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
            {/* Winners Grid
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
                          className={`text-base font-semibold mb-3 ${
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
                          <p className="text-base">
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
                          <p className="text-base text-slate-400">TBD</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )} */}

            {/* 1st Prize Detail */}
            {winners.length > 0 && (
              (() => {
                const firstPrize = winners.find(
                  (w) => w.prize_level === "1st Prize"
                );

                if (!firstPrize) return null;

                const authors = [firstPrize.author, firstPrize.author_2]
                  .filter(Boolean)
                  .join(" & ");

                // Use either winner_bio (new field) or winner_details (existing rich text)
                const winnerBio = firstPrize.winner_bio ?? firstPrize.winner_details;

                return (
                  <section>
                    <h2 className="text-2xl font-bold text-[#333333] mb-3 pb-2 border-b border-slate-200">
                      {firstPrize.prize_level || "1st Prize"}
                    </h2>
                    <h3 className="text-xl text-slate-800 mb-5">
                      <span className="font-semibold">
                        {wrapCoverWithBookLink(
                          firstPrize.book_link,
                          firstPrize.book_title,
                          "inline font-semibold text-inherit no-underline hover:underline"
                        )}
                      </span>
                      {": "}
                      <br className="md:hidden" />
                      <span className="italic text-slate-700">
                        {authors}
                        {firstPrize.location ? `, ${firstPrize.location}` : ""}
                      </span>
                    </h3>

                    <div className="grid gap-6 md:grid-cols-[260px,1fr] items-start">
                      <div className="w-full max-w-[260px] flex gap-4 items-top">
                        {/* Book cover in cream panel */}
                        <div className="flex-shrink-0 bg-[#F3E7D6] rounded-md border border-slate-200 p-3 flex items-center justify-center">
                          {firstPrize.cover_image?.url ? (
                            wrapCoverWithBookLink(
                              firstPrize.book_link,
                              <div className="w-[140px] md:w-[180px]">
                                <PrismicNextImage
                                  field={firstPrize.cover_image}
                                  className="w-full h-auto object-contain shadow-sm"
                                  fallbackAlt=""
                                />
                              </div>
                            )
                          ) : (
                            <div className="w-[140px] md:w-[180px] aspect-[2/3] bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                              Cover coming soon
                            </div>
                          )}
                        </div>

                        {/* Author image as separate round avatar (match cover width) */}
                        {firstPrize.author_image?.url && (
                          <div className="flex-shrink-0 w-[120px] h-[120px] md:w-[140px] md:h-[140px] aspect-square rounded-full overflow-hidden border border-slate-200 bg-white ml-[-52px] mt-[12px]">
                            <PrismicNextImage
                              field={firstPrize.author_image}  //author_image
                              className="w-full h-full object-cover"
                              fallbackAlt=""
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {/* Author details - bold / introductory text */}
                        {winnerBio && (
                          <div className={`${proseClasses} prose-p:font-semibold`}>
                            {Array.isArray(winnerBio) ? (
                              <PrismicRichText field={winnerBio as RichTextField} />
                            ) : (
                              <p>{String(winnerBio)}</p>
                            )}
                          </div>
                        )}

                        {/* Book details - normal body text */}
                        {firstPrize.literary_history && (
                          <div className={proseClasses}>
                            {Array.isArray(firstPrize.literary_history) ? (
                              <PrismicRichText field={firstPrize.literary_history} />
                            ) : (
                              <p>{String(firstPrize.literary_history)}</p>
                            )}
                          </div>
                        )}

                        {!winnerBio && !firstPrize.literary_history && (
                          <div className={proseClasses}>
                            <p>
                              Detailed information about the winning collection will appear here.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {firstPrize.amazon_url && (
                      <p className="mt-4">
                        <Link
                          href={firstPrize.amazon_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary hover:text-primary-light underline hover:no-underline underline-offset-2"
                        >
                          Purchase a copy of {firstPrize.book_title}
                        </Link>
                      </p>
                    )}
                  </section>
                );
              })()
            )}

            {/* 2nd, 3rd & Children's Prize detail sections (same format as 1st) */}
            {winners.length > 0 && (
              <div className="space-y-8">
                {["2nd Prize", "3rd Prize", "Children's Prize"].map((level) => {
                  const prizeWinner = winners.find((w) => w.prize_level === level);

                  if (!prizeWinner) return null;

                  const authors = [prizeWinner.author, prizeWinner.author_2]
                    .filter(Boolean)
                    .join(" & ");

                  const prizeBio =
                    prizeWinner.winner_bio ??
                    prizeWinner.winner_details ??
                    prizeWinner.literary_history;

                  return (
                    <section key={level}>
                      <h2 className="text-2xl font-bold text-[#333333] mb-3 pb-2 border-b border-slate-200">
                        {prizeWinner.prize_level || level}
                      </h2>
                      <h3 className="text-xl text-slate-800 mb-5">
                        <span className="font-semibold">
                          {wrapCoverWithBookLink(
                            prizeWinner.book_link,
                            prizeWinner.book_title,
                            "inline font-semibold text-inherit no-underline hover:underline"
                          )}
                        </span>
                        {": "}
                        <br className="md:hidden" />
                        <span className="italic text-slate-700">
                          {authors}
                          {prizeWinner.location ? `, ${prizeWinner.location}` : ""}
                        </span>
                      </h3>

                      <div className="grid gap-6 md:grid-cols-[260px,1fr] items-start">
                        <div className="w-full max-w-[260px] flex items-top gap-4">
                          {/* Book cover in cream panel */}
                          <div className="flex-shrink-0 bg-[#F3E7D6] rounded-md border border-slate-200 p-3 flex items-center justify-center">
                            {prizeWinner.cover_image?.url ? (
                              wrapCoverWithBookLink(
                                prizeWinner.book_link,
                                <div className="w-[140px] md:w-[180px]">
                                  <PrismicNextImage
                                    field={prizeWinner.cover_image}
                                    className="w-full h-auto object-contain shadow-sm"
                                    fallbackAlt=""
                                  />
                                </div>
                              )
                            ) : (
                              <div className="w-[140px] md:w-[180px] aspect-[2/3] bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                                Cover coming soon
                              </div>
                            )}
                          </div>

                          {/* Author image as separate round avatar (match cover width) */}
                          {prizeWinner.author_image?.url && (
                            <div className="flex-shrink-0 w-[120px] h-[120px] md:w-[140px] md:h-[140px] aspect-square rounded-full overflow-hidden border border-slate-200 bg-white ml-[-52px] mt-[12px]">
                              <PrismicNextImage
                                field={prizeWinner.author_image}
                                className="w-full h-full object-cover"
                                fallbackAlt=""
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Prize winner bio / details */}
                          {prizeBio && (
                            <div className={`${proseClasses} prose-p:font-semibold`}>
                              {Array.isArray(prizeBio) ? (
                                <PrismicRichText field={prizeBio as RichTextField} />
                              ) : (
                                <p>{String(prizeBio)}</p>
                              )}
                            </div>
                          )}

                          {/* Book details - normal body text */}
                          {prizeWinner.literary_history && (
                            <div className={proseClasses}>
                              {Array.isArray(prizeWinner.literary_history) ? (
                                <PrismicRichText field={prizeWinner.literary_history} />
                              ) : (
                                <p>{String(prizeWinner.literary_history)}</p>
                              )}
                            </div>
                          )}

                          {!prizeBio && !prizeWinner.literary_history && (
                            <div className={proseClasses}>
                              <p>
                                Detailed information about this prize-winning collection will
                                appear here.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {prizeWinner.amazon_url && (
                        <p className="mt-4 font-semibold">
                          <Link
                            href={prizeWinner.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-light underline hover:no-underline underline-offset-2"
                          >
                            Purchase a copy of {prizeWinner.book_title}
                          </Link>
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {/* For press and media */}
            {data.press_media_heading && data.press_media_link_url && (
              <section className="mt-10 pt-6 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-[#333333] mb-2">
                  {data.press_media_heading}
                </h3>
                <p className="text-base text-slate-800">
                  Press release –{" "}
                  <Link
                    href={data.press_media_link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold underline underline-offset-2"
                  >
                    click here
                  </Link>{" "}
                  <span className="text-slate-600">(For immediate release)</span>
                </p>
              </section>
            )}

            {/* Judge (our YYYY Judge) */}
            {(data.judge_section_heading ||
              data.judge_name ||
              (data.judge_biog && data.judge_biog.length > 0)) && (
              <section className="mt-10 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-semibold text-[#333333]">
                  {data.judge_section_heading
                    ? data.judge_section_heading
                    : `Judge (our ${data.year ?? year} Judge)`}
                </h3>
                {data.judge_name && (
                  <h4 className="mt-2 text-lg font-semibold text-slate-800">
                    {data.judge_name}
                  </h4>
                )}
                {data.judge_biog && data.judge_biog.length > 0 && (
                  <div className={`mt-4 ${proseClasses}`}>
                    <PrismicRichText field={data.judge_biog} />
                  </div>
                )}
              </section>
            )}

            {/* Judges comments */}
            {data.judges_comments_heading && data.judges_comments_overview && (
              <section className="mt-10 pt-6 space-y-6 border-t border-slate-200">
                <div>
                  <h3 className="text-2xl font-bold text-[#333333] mb-3 pb-2">
                    {data.judges_comments_heading}
                  </h3>
                  <div className={proseClasses}>
                    <PrismicRichText field={data.judges_comments_overview} />
                  </div>
                </div>

                {judgesPrizeComments.length > 0 && (
                  <div className="space-y-6 border-t pt-6 border-slate-200">
                    {judgesPrizeComments.map((comment, index) => (
                      <div
                        key={index}
                        className={index > 0 && comment.length > 0 ? "border-t pt-6 border-slate-200" : ""}
                      >
                        <div className={proseClasses}>
                          <PrismicRichText field={comment} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Shortlist */}
            {shortlist.length > 0 && (
              <section className="bg-[#F9F5EF] border border-[#B7A08F] rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {(data.year ?? year) as string} Shortlist
                </h3>
                <p className="text-base text-slate-600 mt-2 mb-4">
                  The shortlist celebrates a wide range of voices and styles.
                </p>

                <div className="mt-1 rounded-xl border border-[#B7A08F] bg-[#F9F5EF] px-4 py-4 md:px-5 md:py-5">
                  <ul className="space-y-2">
                    {shortlist.map((entry, index) => (
                      <li key={index} className="flex items-start gap-2 text-base">
                        <span className="mt-1 text-slate-500">•</span>
                        <p className="text-slate-700">
                          {entry.book_link ? (
                            /^https?:\/\//.test(entry.book_link) ? (
                              <a
                                href={entry.book_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-900 font-semibold underline hover:no-underline hover:text-primary transition-colors"
                              >
                                {entry.book_title}
                              </a>
                            ) : (
                              <Link
                                href={entry.book_link}
                                className="text-slate-900 font-semibold underline hover:no-underline hover:text-primary transition-colors"
                              >
                                {entry.book_title}
                              </Link>
                            )
                          ) : (
                            <strong className="text-slate-900 font-semibold">
                              {entry.book_title}
                            </strong>
                          )}{" "}
                          —{" "}
                          <em className="text-slate-700">{entry.author}</em>
                          {entry.location && (
                            <span className="text-slate-500">
                              , {entry.location}
                            </span>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Longlist */}
            {longlist.length > 0 && (
              <section className="bg-[#F9F5EF] border border-[#B7A08F] rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {(data.year ?? year) as string} Longlist
                </h3>
                <p className="text-base text-slate-600 mt-2 mb-4">
                  The longlist celebrates a wide range of voices and styles.
                </p>

                <div className="mt-1 rounded-xl border border-[#B7A08F] bg-[#F9F5EF] px-4 py-4 md:px-5 md:py-5">
                  <ul className="space-y-2">
                    {longlist.map((entry, index) => (
                      <li key={index} className="flex items-start gap-2 text-base">
                        <span className="mt-1 text-slate-500">•</span>
                        <p className="text-slate-700">
                          {entry.book_link ? (
                            /^https?:\/\//.test(entry.book_link) ? (
                              <a
                                href={entry.book_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-900 font-semibold underline hover:no-underline hover:text-primary transition-colors"
                              >
                                {entry.book_title}
                              </a>
                            ) : (
                              <Link
                                href={entry.book_link}
                                className="text-slate-900 font-semibold underline hover:no-underline hover:text-primary transition-colors"
                              >
                                {entry.book_title}
                              </Link>
                            )
                          ) : (
                            <strong className="text-slate-900 font-semibold">
                              {entry.book_title}
                            </strong>
                          )}{" "}
                          —{" "}
                          <em className="text-slate-700">{entry.author}</em>
                          {entry.location && (
                            <span className="text-slate-500">
                              , {entry.location}
                            </span>
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Results were announced... paragraph */}
            {data.results_paragraph && (
              <section className="mt-10 border-t border-slate-200">
                <div className={proseClasses}>
                  <PrismicRichText field={data.results_paragraph} />
                </div>
              </section>
            )}

            {/* Enter your book – click here. */}
            {(data.enter_cta_label || data.enter_cta_url) && (
              <section className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-base pt-6 text-slate-800">
                  <Link
                    href={data.enter_cta_url || "/enter"}
                    target="_self"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold underline underline-offset-2"
                  >
                    {data.enter_cta_label || "To enter your book, click here"}
                  </Link>{data.enter_cta_label ? "." : ""}
                </p>
              </section>
            )}

            {/* Navigation */}
            <div className="pt-4 border-t border-slate-200">
              <Link
                href="/past-winners"
                className="inline-flex items-center gap-2 text-base font-medium text-slate-600 hover:text-primary transition-colors"
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
              className="inline-flex items-center gap-2 text-base font-medium text-slate-600 hover:text-primary transition-colors"
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
