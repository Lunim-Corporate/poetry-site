import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import type { JudgeProfileSliceData, SliceComponentProps } from "@/types";

/** Rich text blocks — explicit selectors: `prose` requires @tailwindcss/typography (not installed). */
const richTextClasses =
  "max-w-none [&_p]:text-slate-600 [&_p]:leading-relaxed [&_p+p]:mt-6 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_li]:text-slate-600 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary-light [&_em]:italic [&_em]:text-slate-700";

export default function JudgeProfile({ slice }: SliceComponentProps<JudgeProfileSliceData>) {
  const books = slice.primary.books || [];
  const preliminaryJudgesHeading = slice.primary.preliminary_judges_heading?.trim() ?? "";
  const preliminaryJudges = slice.primary.preliminary_judges ?? [];

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
          <div className={richTextClasses}>
            <PrismicRichText field={slice.primary.bio} />
          </div>
        )}
      </div>

      {/* Entrepreneurial History */}
      {isFilled.richText(slice.primary.entrepreneurial_history) && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            {slice.primary.entrepreneurial_history_heading?.trim() ||
              "Entrepreneurial History"}
          </h3>
          <div className={richTextClasses}>
            <PrismicRichText field={slice.primary.entrepreneurial_history} />
          </div>
        </div>
      )}

      {/* Literary History */}
      {isFilled.richText(slice.primary.literary_history) && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-200">
            {slice.primary.literary_history_heading?.trim() || "Literary History"}
          </h3>
          <div className={richTextClasses}>
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
                  <p className="mt-2 text-base font-medium text-slate-700 group-hover:text-primary transition-colors">
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
          className="font-sans inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold text-base border-2 border-[#23100A] bg-[#FFE169] text-[#23100A] hover:bg-[#23100A] hover:text-[#FFE169] transition-all duration-300"
        >
          Enter Your Book
        </Link>
      </div>

      {(preliminaryJudgesHeading || preliminaryJudges.length > 0) && (
        <section className="mt-12 pt-8 border-t border-slate-200 space-y-8">
          {preliminaryJudgesHeading && (
            <h2 className="text-2xl font-bold text-[#333333] mb-3 pb-2 border-b border-slate-200">
              {preliminaryJudgesHeading}
            </h2>
          )}

          {preliminaryJudges.map((judge, index) => {
            const hasPhoto = isFilled.image(judge.profile_picture);
            const hasName = isFilled.keyText(judge.name);
            const hasBio = isFilled.richText(judge.biography);

            if (!hasPhoto && !hasName && !hasBio) return null;

            return (
              <article
                key={`${judge.name ?? "judge"}-${index}`}
                className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6"
              >
                {hasPhoto && (
                  <div className="shrink-0 w-[120px] h-[120px] md:w-[140px] md:h-[140px] aspect-square rounded-full overflow-hidden border border-slate-200 bg-white">
                    <PrismicNextImage
                      field={judge.profile_picture}
                      className="w-full h-full object-cover"
                      fallbackAlt=""
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-3">
                  {hasName && (
                    <h3 className="text-xl font-semibold text-slate-800">
                      {judge.name}
                    </h3>
                  )}
                  {hasBio && (
                    <div className={richTextClasses}>
                      <PrismicRichText field={judge.biography} />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
