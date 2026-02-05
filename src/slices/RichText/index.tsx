import { PrismicRichText } from "@prismicio/react";

type RichTextSlice = {
  slice_type: string;
  variation: string;
  primary: {
    content: any;
  };
};

export default function RichText({ slice }: { slice: RichTextSlice }) {
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
