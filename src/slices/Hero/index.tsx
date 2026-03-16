import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import Image from "next/image";
import type { HeroSliceData, SliceComponentProps } from "@/types";

type HeroVariant = NonNullable<HeroSliceData["primary"]["variant"]>;

export default function Hero({ slice }: SliceComponentProps<HeroSliceData>) {
  const variant: HeroVariant = slice.primary.variant || "default";

  const sectionClasses: Record<HeroVariant, string> = {
    home: "min-h-[640px] bg-gradient-to-br from-primary to-primary-dark text-white flex items-stretch",
    small: "min-h-[140px] bg-[#FFFDF5] border-b border-slate-200 flex items-center",
    default: "min-h-[320px] bg-[#FFFDF5] border-b border-slate-200 flex items-center",
  };

  const titleClasses: Record<HeroVariant, string> = {
    home: "font-sans text-3xl md:text-4xl lg:text-5xl font-bold leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]",
    small: "font-sans text-2xl md:text-3xl font-bold text-slate-900",
    default: "font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900",
  };

  const subtitleClasses: Record<HeroVariant, string> = {
    home: "font-sans font-semibold text-lg text-white/85 mt-4 max-w-2xl mx-auto [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]",
    small: "font-sans text-slate-600 mt-2",
    default: "font-sans text-lg text-slate-600 mt-4 max-w-2xl mx-auto",
  };

  const heroImage = slice.primary.hero_image;

  return (
    <section
      className={`relative ${sectionClasses[variant]}`}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {heroImage?.url && (
        <>
          <Image
            src={heroImage.url}
            alt={heroImage.alt ?? ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #23100A 0%, transparent 30%, transparent 70%, #23100A 100%)" }} />
        </>
      )}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex">
        <div className="text-center max-w-3xl mx-auto flex flex-col w-full">
          <div className={titleClasses[variant]}>
            <PrismicRichText field={slice.primary.title} />
          </div>
          {slice.primary.subtitle && (
            <div className={subtitleClasses[variant]}>
              <PrismicRichText field={slice.primary.subtitle} />
            </div>
          )}
          {(slice.primary.cta_text || slice.primary.secondary_cta_text) && (
            <div className="flex flex-wrap gap-3 justify-center mt-auto mb-30">
              {slice.primary.cta_text && (
                <Link
                  href={slice.primary.cta_link || (variant === "home" ? "/enter" : "#")}
                  className={`font-sans inline-flex items-center justify-center rounded-lg font-bold transition-colors ${
                    variant === "home"
                      ? "px-8 py-4 text-base bg-[#FFE169] hover:bg-[#FFE169]/90 text-slate-900"
                      : "px-6 py-3 text-sm bg-primary hover:bg-primary-light text-white"
                  }`}
                >
                  {slice.primary.cta_text}
                </Link>
              )}
              {slice.primary.secondary_cta_text && (
                <Link
                  href={slice.primary.secondary_cta_link || "#"}
                  className={`font-sans inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border transition-colors ${
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
