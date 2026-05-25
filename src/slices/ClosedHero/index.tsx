import { PrismicRichText } from "@prismicio/react";
import Image from "next/image";
import type { ClosedHeroSliceData, SliceComponentProps } from "@/types";

type ClosedHeroVariant = NonNullable<ClosedHeroSliceData["primary"]["variant"]>;

export default function ClosedHero({
  slice,
}: SliceComponentProps<ClosedHeroSliceData>) {
  const variant: ClosedHeroVariant = slice.primary.variant || "default";

  const sectionClasses: Record<ClosedHeroVariant, string> = {
    home: "min-h-[640px] bg-gradient-to-br from-[#7a3520] to-[#451e10] text-white flex items-stretch",
    small: "min-h-[140px] bg-gradient-to-br from--[#7a3520] to-[#451e10] text-white flex items-center",
    default: "min-h-[320px] bg-gradient-to-br from-[#451E10] to-[#451e10] text-white flex items-center",
  };

  const titleClasses: Record<ClosedHeroVariant, string> = {
    home: "font-sans text-3xl md:text-4xl lg:text-5xl font-bold leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]",
    small: "font-sans text-2xl md:text-3xl font-bold [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]",
    default: "font-sans text-2xl md:text-3xl lg:text-4xl font-bold [text-shadow:0_2px_24px_rgba(0,0,0,0.9)]",
  };

  const subtitleClasses: Record<ClosedHeroVariant, string> = {
    home: "font-sans font-semibold text-xl text-white/85 mt-4 max-w-3xl mx-auto [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]",
    small: "font-sans text-white/85 mt-2 [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]",
    default: "font-sans font-semibold text-lg text-white/85 mt-4 max-w-3xl mx-auto [text-shadow:0_2px_18px_rgba(0,0,0,0.85)]",
  };

  const heroImage = slice.primary.hero_image;

  return (
    <section
      className={`relative ${sectionClasses[variant]}`}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {heroImage?.url && (
        <Image
          src={heroImage.url}
          alt={heroImage.alt ?? ""}
          fill
          className="object-cover"
          priority
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "home"
              ? "linear-gradient(to right, #23100A 0%, transparent 30%, transparent 70%, #23100A 100%)"
              : "linear-gradient(to right, #23100A 0%, rgba(35,16,10,0.4) 30%, rgba(35,16,10,0.4) 70%, #23100A 100%)",
        }}
      />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8 flex">
        <div className="text-center max-w-4xl mx-auto flex flex-col w-full">
          <div className={`${titleClasses[variant]} animate-fade-in-up`}>
            <PrismicRichText field={slice.primary.title} />
          </div>
          {slice.primary.subtitle && (
            <PrismicRichText
              field={slice.primary.subtitle}
              components={{
                paragraph: ({ children }) => (
                  <p
                    className={`${subtitleClasses[variant]} animate-fade-in-up`}
                    style={{ animationDelay: "150ms" }}
                  >
                    {children}
                  </p>
                ),
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
