import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";

type HeroSlice = {
  slice_type: string;
  variation: string;
  primary: {
    title: any;
    subtitle?: any;
    cta_text?: string;
    cta_link?: string;
    variant?: "default" | "home" | "small";
  };
};

export default function Hero({ slice }: { slice: HeroSlice }) {
  const variant = slice.primary.variant || "default";
  const heroClass = `hero ${variant === "home" ? "hero--home" : variant === "small" ? "hero--small" : ""}`;

  return (
    <section className={heroClass} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container">
        <div className="hero__inner">
          <div className="hero__title">
            <PrismicRichText field={slice.primary.title} />
          </div>
          {slice.primary.subtitle && (
            <div className="hero__subtitle">
              <PrismicRichText field={slice.primary.subtitle} />
            </div>
          )}
          {slice.primary.cta_text && slice.primary.cta_link && (
            <div className="hero__ctaRow">
              <Link href={slice.primary.cta_link} className="btn">
                <span className="btn__label">{slice.primary.cta_text}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
