"use client";

import { PrismicRichText, PrismicText } from "@prismicio/react";
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
      className="py-12 bg-white"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            <PrismicText field={slice.primary.title} />
          </h2>

          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {slice.primary.items?.map((item, index) => (
              <details
                key={index}
                className="group"
                open={openIndex === index}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(index);
                }}
              >
                <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer font-medium text-slate-900 hover:text-primary transition-colors list-none">
                  <span>{item.question}</span>
                  <span className="text-slate-400 text-xl font-light shrink-0">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </summary>
                <div className="pb-4 pr-8 text-slate-600 leading-relaxed prose prose-sm max-w-none">
                  <PrismicRichText field={item.answer} />
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
