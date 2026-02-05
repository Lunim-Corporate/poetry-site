import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";

type JudgeProfileSlice = {
  slice_type: string;
  variation: string;
  primary: {
    name?: string;
    title?: string;
    location?: string;
    portrait?: any;
    bio?: any;
    entrepreneurial_history?: any;
    literary_history?: any;
    books?: Array<{
      book_title?: string;
      book_image?: any;
      book_amazon_url?: string;
      book_description?: string;
    }>;
  };
};

export default function JudgeProfile({ slice }: { slice: JudgeProfileSlice }) {
  const books = slice.primary.books || [];

  return (
    <section
      className="content content--plain"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="profileLayout">
        <div className="profileSquare">
          {slice.primary.portrait?.url ? (
            <PrismicNextImage
              field={slice.primary.portrait}
              className="profileSquare__img"
            />
          ) : (
            <svg
              className="profileSquare__icon"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="16" r="10" />
              <path d="M6 44c0-10 8-18 18-18s18 8 18 18" />
            </svg>
          )}
        </div>

        <div>
          <h2>{slice.primary.name}</h2>
          {slice.primary.title && (
            <p className="muted">{slice.primary.title}</p>
          )}

          <div className="content">
            <PrismicRichText field={slice.primary.bio} />
          </div>

          {slice.primary.entrepreneurial_history && (
            <>
              <h3>Entrepreneurial History</h3>
              <PrismicRichText field={slice.primary.entrepreneurial_history} />
            </>
          )}

          {slice.primary.literary_history && (
            <>
              <h3>Literary History</h3>
              <PrismicRichText field={slice.primary.literary_history} />
            </>
          )}

          {books.length > 0 && (
            <div className="bookCovers">
              {books.map((book, index) => (
                <Link
                  key={index}
                  href={book.book_amazon_url || "#"}
                  className="bookCovers__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {book.book_image?.url && (
                    <PrismicNextImage
                      field={book.book_image}
                      className="bookCovers__img"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
