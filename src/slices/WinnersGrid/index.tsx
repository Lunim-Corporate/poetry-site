import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import type { WinnersGridSliceData, SliceComponentProps } from "@/types";
import { PRIZE_ORDER } from "@/types";

const proseClasses =
  "prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-primary prose-a:underline hover:prose-a:text-primary-light";

export default function WinnersGrid({ slice }: SliceComponentProps<WinnersGridSliceData>) {
  const winners = slice.primary.items || [];
  const firstPlace = winners.find(w => w.prize_level === "1st Prize");
  const remainingWinners = winners.filter(w => w.prize_level !== "1st Prize");
  const remainingOrder = PRIZE_ORDER.filter(l => l !== "1st Prize");

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* 1st Place Winner Spotlight */}
      {firstPlace && (
        <div className="winnersSpotlight mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">1st Prize</h2>

          {firstPlace.book_title && (
            <h3 className="text-xl font-semibold text-slate-700 mb-6">
              {firstPlace.book_title}
              {firstPlace.author && (
                <>: {firstPlace.author}{firstPlace.author_2 && ` & ${firstPlace.author_2}`}</>
              )}
              {firstPlace.location && `, ${firstPlace.location}`}
            </h3>
          )}

          {(firstPlace.cover_image?.url || firstPlace.portrait_image?.url) && (
            <div className="bookCovers mb-6">
              {firstPlace.cover_image?.url && (
                firstPlace.amazon_url ? (
                  <a
                    href={firstPlace.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookCovers__link"
                  >
                    <PrismicNextImage
                      field={firstPlace.cover_image}
                      className="bookCovers__img"
                      fallbackAlt=""
                    />
                  </a>
                ) : (
                  <PrismicNextImage
                    field={firstPlace.cover_image}
                    className="bookCovers__img"
                    fallbackAlt=""
                  />
                )
              )}
              {firstPlace.portrait_image?.url && (
                <PrismicNextImage
                  field={firstPlace.portrait_image}
                  className="bookCovers__img"
                  fallbackAlt=""
                />
              )}
            </div>
          )}

          {firstPlace.winner_details && (
            <div className={proseClasses}>
              <p>{firstPlace.winner_details}</p>
            </div>
          )}

          {firstPlace.literary_history && (
            <div className={`${proseClasses} prose-em:text-slate-700 mt-6`}>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200 not-prose">
                Literary History
              </h3>
              <p>{firstPlace.literary_history}</p>
            </div>
          )}

          {firstPlace.amazon_url && (
            <p className="mt-4">
              <strong>
                <a
                  href={firstPlace.amazon_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary-light"
                >
                  Purchase a copy of {firstPlace.book_title}
                </a>
              </strong>
            </p>
          )}
        </div>
      )}

      {/* Remaining winners grid (2nd, 3rd, Children's) */}
      {remainingWinners.length > 0 && (
        <div className="winnersGrid">
          {/* Header row */}
          {remainingOrder.map((level, index) => (
            <div key={`header-${index}`} className="winnersGrid__cell">
              <h3>{level}</h3>
            </div>
          ))}

          {/* Winner cells */}
          {remainingOrder.map((level, index) => {
            const winner = remainingWinners.find(w => w.prize_level === level);

            if (!winner) {
              return (
                <div key={`winner-${index}`} className="winnersGrid__cell">
                  <p className="winnersGrid__caption--small">TBD</p>
                </div>
              );
            }

            const authors = [winner.author, winner.author_2].filter(Boolean).join(" & ");

            return (
              <div key={`winner-${index}`} className="winnersGrid__cell">
                {winner.cover_image?.url && (
                  <PrismicNextImage
                    field={winner.cover_image}
                    className="winnersGrid__img"
                    fallbackAlt=""
                  />
                )}
                <p className="winnersGrid__caption--small">
                  <span>{winner.book_title}</span>
                  <br />
                  {authors}
                  {winner.location && (
                    <>
                      <br />
                      {winner.location}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Fallback: show full grid if no 1st place winner is set */}
      {!firstPlace && (
        <div className="winnersGrid">
          {PRIZE_ORDER.map((level, index) => (
            <div key={`header-${index}`} className="winnersGrid__cell">
              <h3>{level}</h3>
            </div>
          ))}
          {PRIZE_ORDER.map((level, index) => {
            const winner = winners.find(w => w.prize_level === level);
            if (!winner) {
              return (
                <div key={`winner-${index}`} className="winnersGrid__cell">
                  <p className="winnersGrid__caption--small">TBD</p>
                </div>
              );
            }
            const authors = [winner.author, winner.author_2].filter(Boolean).join(" & ");
            const isFirst = index === 0;
            return (
              <div key={`winner-${index}`} className="winnersGrid__cell">
                {winner.cover_image?.url && (
                  <PrismicNextImage
                    field={winner.cover_image}
                    className="winnersGrid__img"
                    fallbackAlt=""
                  />
                )}
                <p className={isFirst ? "winnersGrid__caption" : "winnersGrid__caption--small"}>
                  <span>{winner.book_title}</span>
                  <br />
                  {authors}
                  {winner.location && (
                    <>
                      <br />
                      {winner.location}
                    </>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
