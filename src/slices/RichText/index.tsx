import { PrismicRichText } from "@prismicio/react";
import type { RichTextSliceData, SliceComponentProps } from "@/types";

export default function RichText({ slice }: SliceComponentProps<RichTextSliceData>) {
  return (
    <section
      className="content sketch-card"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicRichText field={slice.primary.content} />
    </section>
  );
}
