import { PrismicNextImage } from "@prismicio/next";

type WinnersGridSlice = {
  slice_type: string;
  variation: string;
  primary: {
    year?: number;
    items?: Array<{
      prize_level: string;
      book_title: string;
      author: string;
      author_2?: string;
      location?: string;
      cover_image?: any;
      amazon_url?: string;
    }>;
  };
};

export default function WinnersGrid({ slice }: { slice: WinnersGridSlice }) {
  const winners = slice.primary.items || [];
  const prizeOrder = ["1st Place", "2nd Place", "3rd Place", "Children's"];

  return (
    <div
      className="winnersGrid"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Header row */}
      {prizeOrder.map((level, index) => (
        <div key={`header-${index}`} className="winnersGrid__cell">
          <h3>{level}</h3>
        </div>
      ))}

      {/* Winner cells */}
      {prizeOrder.map((level, index) => {
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
