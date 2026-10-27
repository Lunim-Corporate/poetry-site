import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { AnnouncementSectionSliceData, SliceComponentProps } from "@/types";
import FadeIn from "@/components/FadeIn";

export default function AnnouncementSection({
  slice,
}: SliceComponentProps<AnnouncementSectionSliceData>) {
  const sectionTitle = slice.primary.section_title?.trim() ?? "";
  const hasTitle = Boolean(sectionTitle);
  const hasText = isFilled.richText(slice.primary.section_text);

  if (!hasTitle && !hasText) {
    return null;
  }

  return (
    <div
      className="space-y-6"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {hasTitle && (
        <FadeIn>
          <h2 className="text-3xl font-bold text-slate-900">{sectionTitle}</h2>
        </FadeIn>
      )}

      {hasText && (
        <FadeIn delay={100}>
          <div className="prose prose-base max-w-none text-[#333333]">
            <PrismicRichText field={slice.primary.section_text} />
          </div>
        </FadeIn>
      )}
    </div>
  );
}
