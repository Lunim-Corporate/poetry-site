import { PrismicRichText } from "@prismicio/react";
import type { RichTextField } from "@prismicio/client";
import Image from "next/image";
import Link from "next/link";
import type { AboutSectionSliceData, SliceComponentProps } from "@/types";
import FadeIn from "@/components/FadeIn";

function Divider() {
  return (
    <div className="flex justify-center py-2">
      <Image src="/divider.svg" alt="" width={800} height={4} />
    </div>
  );
}

const proseClasses =
  "prose prose-slate max-w-none prose-p:text-[#333333] prose-p:leading-relaxed [&_p+p]:mt-6 prose-strong:text-slate-900 prose-a:text-primary prose-a:underline hover:prose-a:text-primary-light prose-li:text-slate-600";

function hasContent(field: RichTextField | undefined): boolean {
  if (!field || !Array.isArray(field)) return false;
  return field.some(
    (block) => "text" in block && typeof block.text === "string" && block.text.trim().length > 0
  );
}

export default function AboutSection({ slice }: SliceComponentProps<AboutSectionSliceData>) {
  const {
    intro,
    background,
    funding,
    partnerships,
    sign_off_name,
    sign_off_role,
  } = slice.primary;

  return (
    <div className="space-y-10">
      {/* Intro - rendered bold to stand out */}
      {hasContent(intro) && (
        <FadeIn>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div
              className={`${proseClasses} prose-p:text-slate-700 prose-p:font-medium`}
            >
              <PrismicRichText field={intro} />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Background */}
      {hasContent(background) && (
        <FadeIn>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-3">
              Background
            </h3>
            <div className={proseClasses}>
              <PrismicRichText field={background} />
            </div>
          </div>
        </FadeIn>
      )}

      {hasContent(funding) && <Divider />}

      {/* Funding */}
      {hasContent(funding) && (
        <FadeIn>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-3">
              Funding
            </h3>
            <div className={proseClasses}>
              <PrismicRichText field={funding} />
            </div>
          </div>
        </FadeIn>
      )}

      {hasContent(partnerships) && <Divider />}

      {/* Partnerships */}
      {hasContent(partnerships) && (
        <FadeIn>
          <div>
            <h3 className="text-2xl font-bold text-[#333333] mb-3">
              Partnerships
            </h3>
            <div className={proseClasses}>
              <PrismicRichText field={partnerships} />
            </div>
          </div>
        </FadeIn>
      )}

      {(hasContent(partnerships) || sign_off_name) && <Divider />}

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
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold text-sm border-2 border-[#23100A] bg-[#FFE169] text-[#23100A] hover:bg-[#23100A] hover:text-[#FFE169] transition-all duration-300"
        >
          Enter Your Book
        </Link>
      </div>
    </div>
  );
}
