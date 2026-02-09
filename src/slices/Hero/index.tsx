import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import type { HeroSliceData, SliceComponentProps } from "@/types";

type HeroVariant = NonNullable<HeroSliceData["primary"]["variant"]>;

export default function Hero({ slice }: SliceComponentProps<HeroSliceData>) {
  const variant: HeroVariant = slice.primary.variant || "default";

  const sectionClasses: Record<HeroVariant, string> = {
    home: "min-h-[480px] bg-gradient-to-br from-primary to-primary-dark text-white flex items-center",
    small: "min-h-[140px] bg-slate-50 border-b border-slate-200 flex items-center",
    default: "min-h-[320px] bg-slate-50 border-b border-slate-200 flex items-center",
  };

  const titleClasses: Record<HeroVariant, string> = {
    home: "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
    small: "text-2xl md:text-3xl font-bold text-slate-900",
    default: "text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900",
  };

  const subtitleClasses: Record<HeroVariant, string> = {
    home: "text-lg text-white/85 mt-4 max-w-2xl mx-auto",
    small: "text-slate-600 mt-2",
    default: "text-lg text-slate-600 mt-4 max-w-2xl mx-auto",
  };

  return (
    <section
      className={sectionClasses[variant]}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className={titleClasses[variant]}>
            <PrismicRichText field={slice.primary.title} />
          </div>
          {slice.primary.subtitle && (
            <div className={subtitleClasses[variant]}>
              <PrismicRichText field={slice.primary.subtitle} />
            </div>
          )}
          {(slice.primary.cta_text || slice.primary.secondary_cta_text) && (
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              {slice.primary.cta_text && slice.primary.cta_link && (
                <Link
                  href={slice.primary.cta_link}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    variant === "home"
                      ? "bg-accent hover:bg-accent-light text-slate-900"
                      : "bg-primary hover:bg-primary-light text-white"
                  }`}
                >
                  {slice.primary.cta_text}
                </Link>
              )}
              {slice.primary.secondary_cta_text && slice.primary.secondary_cta_link && (
                <Link
                  href={slice.primary.secondary_cta_link}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border transition-colors ${
                    variant === "home"
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {slice.primary.secondary_cta_text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
