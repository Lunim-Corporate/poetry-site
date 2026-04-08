"use client";

import { PrismicText } from "@prismicio/react";
import type { ListingSliceData, SliceComponentProps } from "@/types";

export default function Listing({ slice }: SliceComponentProps<ListingSliceData>) {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            <PrismicText field={slice.primary.title} />
          </h2>

          <ol className="list-decimal list-outside pl-5 space-y-3 text-base text-slate-600 font-normal">
            {(slice.primary.items ?? [])
              .map((i) => String(i.text ?? "").trim())
              .filter(Boolean)
              .map((text, index) => (
                <li key={index} className="leading-relaxed">
                  {text}
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

