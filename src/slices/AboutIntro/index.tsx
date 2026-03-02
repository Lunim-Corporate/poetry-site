import { PrismicRichText } from "@prismicio/react";
import type { AboutIntroSliceData, SliceComponentProps } from "@/types";

export default function AboutIntro({ slice }: SliceComponentProps<AboutIntroSliceData>) {
  const { title, subtitle } = slice.primary;

  return (
    <div
      className="space-y-2"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {title && (
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      )}
      {subtitle && (
        <div className="prose prose-sm max-w-none text-[#333333]">
          <PrismicRichText field={subtitle} />
        </div>
      )}
    </div>
  );
}
