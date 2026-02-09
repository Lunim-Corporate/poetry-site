import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import type { JudgeProfileSliceData, SliceComponentProps } from "@/types";

const proseClasses =
  "prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-primary prose-a:underline hover:prose-a:text-primary-light";

export default function JudgeProfile({ slice }: SliceComponentProps<JudgeProfileSliceData>) {
  const books = slice.primary.books || [];

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Name & Title */}
      <div className="mb-8">
        {slice.primary.name && (
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            {slice.primary.name}
          </h2>
        )}
        {(slice.primary.title || slice.primary.location) && (
          <p className="text-slate-500 mt-1">
            {[slice.primary.title, slice.primary.location]
              .filter(Boolean)
              .join(" | ")}
          </p>
        )}
      </div>

      {/* Bio + Portrait */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {slice.primary.portrait?.url && (
          <div className="shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <PrismicNextImage
                field={slice.primary.portrait}
                className="w-full h-full object-cover"
                fallbackAlt=""
              />
            </div>
          </div>
        )}
        {slice.primary.bio && (
          <div className={proseClasses}>
            <PrismicRichText field={slice.primary.bio} />
          </div>
        )}
      </div>

      {/* Entrepreneurial History */}
      {slice.primary.entrepreneurial_history && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            Entrepreneurial History
          </h3>
          <div className={proseClasses}>
            <PrismicRichText field={slice.primary.entrepreneurial_history} />
          </div>
        </div>
      )}

      {/* Literary History */}
      {slice.primary.literary_history && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            Literary History
          </h3>
          <div className={`${proseClasses} prose-em:text-slate-700`}>
            <PrismicRichText field={slice.primary.literary_history} />
          </div>
        </div>
      )}

      {/* Books Grid */}
      {books.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
            Books
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {books.map((book, index) => (
              <Link
                key={index}
                href={book.book_amazon_url || "#"}
                className="group block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {book.book_image?.url && (
                  <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md border border-slate-200 group-hover:shadow-lg transition-shadow">
                    <PrismicNextImage
                      field={book.book_image}
                      className="w-full h-full object-cover"
                      fallbackAlt=""
                    />
                  </div>
                )}
                {book.book_title && (
                  <p className="mt-2 text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                    {book.book_title}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-10">
        <Link
          href="/enter"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm bg-primary hover:bg-primary-light text-white transition-colors"
        >
          Enter Your Book
        </Link>
      </div>
    </div>
  );
}
