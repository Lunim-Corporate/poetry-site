import { PrismicRichText } from "@prismicio/react";
import type { PrizeSectionSliceData, SliceComponentProps } from "@/types";

export default function PrizeSection({ slice }: SliceComponentProps<PrizeSectionSliceData>) {
  const {
    section_title,
    intro_text,
    prizes,
    childrens_prize_title,
    childrens_prize_amount,
    childrens_prize_description,
    benefits_title,
    benefits,
    note,
  } = slice.primary;

  return (
    <div
      className="space-y-6"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Section Title */}
      {section_title && (
        <h2 className="text-3xl font-bold text-slate-900">{section_title}</h2>
      )}

      {/* Intro */}
      {intro_text && (
        <div className="prose prose-base max-w-none text-[#333333]">
          <PrismicRichText field={intro_text} />
        </div>
      )}

      {/* Main Prizes */}
      {prizes && prizes.length > 0 && (
        <div className="rounded-lg overflow-hidden border border-[#FFE169]">
          <table className="w-full border-collapse">
            <tbody>
              {prizes.map((prize, i) => (
                <tr key={i} className="bg-[#23100A] border-b border-[#FFE169]">
                  <td className={`px-5 py-3 text-base font-bold w-1/2 border-r border-[#FFE169] ${i === 0 ? "text-[#FFE169]" : "text-white"}`}>
                    {prize.prize_title}
                  </td>
                  <td className={`px-5 py-3 text-base font-bold w-1/2 text-left ${i === 0 ? "text-[#FFE169]" : "text-white"}`}>
                    £{prize.prize_amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Children's Prize Description */}
      {childrens_prize_description && (
        <div className="prose prose-base max-w-none text-[#333333]">
          <PrismicRichText field={childrens_prize_description} />
        </div>
      )}

      {/* Children's Prize Row */}
      {childrens_prize_title && (
        <div className="rounded-lg overflow-hidden border border-[#FFE169]">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="bg-[#23100A]">
                <td className="px-5 py-3 text-base font-bold text-[#FFE169] w-1/2 border-r border-[#FFE169]">
                  {childrens_prize_title}
                </td>
                <td className="px-5 py-3 text-base font-bold text-[#FFE169] w-1/2 text-left">
                  {childrens_prize_amount != null ? `£${childrens_prize_amount}` : ""}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Winner Benefits */}
      {benefits && benefits.length > 0 && (
        <div>
          {benefits_title && (
            <p className="text-base text-[#333333] mb-3">{benefits_title}</p>
          )}
          <ul className="space-y-2">
            {benefits.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-[#333333]">
                <span className="mt-0.5 shrink-0">•</span>
                <span>{item.benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Note */}
      {note && (
        <div className="prose prose-base max-w-none text-[#333333]">
          <PrismicRichText field={note} />
        </div>
      )}
    </div>
  );
}
