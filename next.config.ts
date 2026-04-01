import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
    ],
  },

  async redirects() {
    const permanent = true;
    return [
      // About Us → Home
      { source: "/about-us", destination: "/", permanent },
      { source: "/about-us/", destination: "/", permanent },

      // Rules → Enter
      { source: "/rules", destination: "/enter", permanent },
      { source: "/rules/", destination: "/enter", permanent },

      // FAQs → Home #faq
      { source: "/faqs", destination: "/#faq", permanent },
      { source: "/faqs/", destination: "/#faq", permanent },

      // Newsletter → Home #newsletter
      { source: "/newsletter", destination: "/#newsletter", permanent },
      { source: "/newsletter/", destination: "/#newsletter", permanent },

      // Winners listing → Past Winners
      { source: "/winners", destination: "/past-winners", permanent },
      { source: "/winners/", destination: "/past-winners", permanent },

      // Winners by year (covers 2020–2025 and beyond)
      { source: "/winners-:year", destination: "/past-winners/:year", permanent },
      { source: "/winners-:year/", destination: "/past-winners/:year", permanent },

      // Children's Prize → Home
      { source: "/childrens-prize", destination: "/", permanent },
      { source: "/childrens-prize/", destination: "/", permanent },

      // Children's Prize by year → Past Winners by year
      { source: "/childrens-prize-:year", destination: "/past-winners/:year", permanent },
      { source: "/childrens-prize-:year/", destination: "/past-winners/:year", permanent },

      // Links → Home
      { source: "/links", destination: "/", permanent },
      { source: "/links/", destination: "/", permanent },

      // Contact Us → Home #contact-form
      { source: "/contact-us", destination: "/#contact-form", permanent },
      { source: "/contact-us/", destination: "/#contact-form", permanent },
    ];
  },
};

export default nextConfig;
