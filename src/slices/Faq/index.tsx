"use client";

import { PrismicRichText } from "@prismicio/react";
import { useState } from "react";

type FaqSlice = {
  slice_type: string;
  variation: string;
  primary: {
    title: any;
    items?: Array<{
      question: string;
      answer: any;
    }>;
  };
};

export default function Faq({ slice }: { slice: FaqSlice }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="content sketch-card faqCard"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <h2 className="cardTitle">
        <PrismicRichText field={slice.primary.title} />
      </h2>

      <div className="faq__list">
        {slice.primary.items?.map((item, index) => (
          <details
            key={index}
            className="faq__item"
            open={openIndex === index}
            onClick={(e) => {
              e.preventDefault();
              handleToggle(index);
            }}
          >
            <summary>{item.question}</summary>
            <PrismicRichText field={item.answer} />
          </details>
        ))}
      </div>
    </section>
  );
}
