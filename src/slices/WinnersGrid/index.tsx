import { PrismicNextImage } from "@prismicio/next";
import type { WinnersGridSliceData, SliceComponentProps } from "@/types";
import { PRIZE_ORDER } from "@/types";

export default function WinnersGrid({ slice }: SliceComponentProps<WinnersGridSliceData>) {
  const winners = slice.primary.items || [];

  return (
    <div
      className="winnersGrid"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Header row */}
      {PRIZE_ORDER.map((level, index) => (
        <div key={`header-${index}`} className="winnersGrid__cell">
          <h3>{level}</h3>
        </div>
      ))}

      {/* Winner cells */}
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
  );
}
