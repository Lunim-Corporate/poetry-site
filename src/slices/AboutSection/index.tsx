import { PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";
import Link from "next/link";
import type { AboutSectionSliceData, SliceComponentProps } from "@/types";

const proseClasses =
  "prose prose-slate max-w-none prose-p:text-[#333333] prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-primary prose-a:underline hover:prose-a:text-primary-light prose-li:text-slate-600";

function hasContent(field: RichTextField | undefined): boolean {
  if (!field || !Array.isArray(field)) return false;
  return field.some(
    (block) => "text" in block && typeof block.text === "string" && block.text.trim().length > 0
  );
}

export default function AboutSection({ slice }: SliceComponentProps<AboutSectionSliceData>) {
  const {
    about_title,
    about_subtitle,
    intro,
    background,
    funding,
    partnerships,
    sign_off_name,
    sign_off_role,
  } = slice.primary;

  return (
    <div className="space-y-10">
      {/* Title */}
      {(about_title || about_subtitle) && (
        <div>
          {about_title && (
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {about_title}
            </h2>
          )}
          {about_subtitle && (
            <p className="text-md font-semibold text-[#333333]">{about_subtitle}</p>
          )}
        </div>
      )}

      {/* Intro - rendered bold to stand out */}
      {hasContent(intro) && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div
            className={`${proseClasses} prose-p:text-slate-700 prose-p:font-medium`}
          >
            <PrismicRichText field={intro} />
          </div>
        </div>
      )}

      {/* Background */}
      {hasContent(background) && (
        <div>
          <h3 className="text-2xl font-bold text-[#333333] mb-3 pb-2 border-b border-slate-200">
            Background
          </h3>
          <div className={proseClasses}>
            <PrismicRichText field={background} />
          </div>
        </div>
      )}

      {/* Funding */}
      {hasContent(funding) && (
        <div>
          <h3 className="text-2xl font-bold text-[#333333] mb-3 pb-2 border-b border-slate-200">
            Funding
          </h3>
          <div className={proseClasses}>
            <PrismicRichText field={funding} />
          </div>
        </div>
      )}

      {/* Partnerships */}
      {hasContent(partnerships) && (
        <div>
          <h3 className="text-2xl font-bold text-[#333333] mb-3 pb-2 border-b border-slate-200">
            Partnerships
          </h3>
          <div className={proseClasses}>
            <PrismicRichText field={partnerships} />
          </div>
        </div>
      )}

      {/* Sign-off */}
      {sign_off_name && (
        <div className="pt-2">
          <p className="text-[#333333] font-bold italic">
            {sign_off_name}
            {sign_off_role && (
              <span className="text-[#333333] font-bold">
                {" "}
                ({sign_off_role})
              </span>
            )}
          </p>
        </div>
      )}

      {/* CTA */}
      <div>
        <Link
          href="/enter"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold text-sm border-2 border-[#23100A] bg-[#FFE169] text-[#23100A] hover:bg-[#23100A] hover:text-[#FFE169] transition-colors"
        >
          Enter Your Book
        </Link>
      </div>
    </div>
  );
}
