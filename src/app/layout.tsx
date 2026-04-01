import type { Metadata } from "next";
import localFont from "next/font/local";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import NavigationMenu from "@/slices/NavigationMenu";
import FooterSlice from "@/slices/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import type { NavigationMenuSliceData, FooterSliceData, PrismicSlice } from "@/types";
import { DEFAULT_YEARS } from "@/types";
import "./globals.css";

const sourceSerifPro = localFont({
  src: [
    { path: "../../public/fonts/SourceSerifPro-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/SourceSerifPro-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../../public/fonts/SourceSerifPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/SourceSerifPro-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/SourceSerifPro-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/SourceSerifPro-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../../public/fonts/SourceSerifPro-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/SourceSerifPro-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const workSans = localFont({
  src: [
    { path: "../../public/fonts/WorkSans-VariableFont_wght.ttf", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/WorkSans-Italic-VariableFont_wght.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Maya Poetry Book Awards",
    default: "Maya Poetry Book Awards",
  },
  description: "Celebrating excellence in poetry from around the world",
  keywords: "poetry, awards, competition, books, literature, Welsh poetry",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Maya Poetry Book Awards",
  },
};

const defaultNavigationSlice: NavigationMenuSliceData = {
  id: "default-nav",
  slice_type: "navigation_menu",
  variation: "default",
  primary: {
    brand_name: "Maya",
    nav_links: [
      { label: "Enter Your Book", url: "/enter" },
      { label: "Our Judge", url: "/judge" },
    ],
    past_winners_years: DEFAULT_YEARS.map((year) => ({ year })),
  },
};

const defaultFooterSlice: FooterSliceData = {
  id: "default-footer",
  slice_type: "footer",
  variation: "default",
  primary: {
    copyright_text: "Maya Poetry Book Awards",
    delivered_by_text: "Surim",
    delivered_by_url: "https://surim.io",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();

  // Fetch navigation
  const primaryNav = await client.getSingle("primary_navigation").catch(() => null);
  const navigationSlices: PrismicSlice[] = (primaryNav as any)?.data?.slices || [];
  const navigationMenu = navigationSlices.find(
    (s) => s.slice_type === "navigation_menu"
  ) as NavigationMenuSliceData | undefined;

  // Fetch footer
  const footer = await client.getSingle("footer").catch(() => null);
  const footerSlices: PrismicSlice[] = (footer as any)?.data?.slices || [];
  const footerSlice = footerSlices.find(
    (s) => s.slice_type === "footer"
  ) as FooterSliceData | undefined;

  return (
    <html lang="en" className={`${sourceSerifPro.variable} ${workSans.variable}`}>
      <body>
        <PrismicPreview repositoryName={repositoryName}>
          <ScrollToTop />
          <NavigationMenu
            slice={navigationMenu || defaultNavigationSlice}
            index={0}
            slices={navigationSlices}
            context={{}}
          />
          <main>{children}</main>
          <FooterSlice
            slice={footerSlice || defaultFooterSlice}
            index={0}
            slices={footerSlices}
            context={{}}
          />
        </PrismicPreview>
      </body>
    </html>
  );
}
