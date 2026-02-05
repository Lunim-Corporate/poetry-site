import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import NavigationMenu from "@/slices/NavigationMenu";
import FooterSlice from "@/slices/Footer";
import "./globals.css";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = createClient();

  // Fetch navigation
  let navigationMenu: any = null;
  let navigationSlices: any[] = [];

  const primaryNav = await (client as any)
    .getSingle("primary_navigation")
    .catch(() => null);

  if (primaryNav) {
    navigationSlices = primaryNav?.data?.slices || [];
    navigationMenu = navigationSlices.find(
      (slice: any) => slice.slice_type === "navigation_menu"
    );
  }

  // Fetch footer
  let footerSlice: any = null;
  let footerSlices: any[] = [];

  const footer = await (client as any)
    .getSingle("footer")
    .catch(() => null);

  if (footer) {
    footerSlices = footer?.data?.slices || [];
    footerSlice = footerSlices.find(
      (slice: any) => slice.slice_type === "footer"
    );
  }

  // Default navigation slice if none found in Prismic
  const defaultNavigationSlice = {
    slice_type: "navigation_menu",
    variation: "default",
    primary: {
      brand_name: "Maya",
      nav_links: [
        { label: "Enter Your Book", url: "/enter" },
        { label: "Our Judge", url: "/judge" },
      ],
      past_winners_years: [
        { year: 2025 },
        { year: 2024 },
        { year: 2023 },
        { year: 2022 },
        { year: 2021 },
        { year: 2020 },
      ],
    },
  };

  // Default footer slice if none found in Prismic
  const defaultFooterSlice = {
    slice_type: "footer",
    variation: "default",
    primary: {
      copyright_text: "Maya Poetry Book Awards",
      delivered_by_text: "Lunim",
      delivered_by_url: "https://lunim.io",
    },
  };

  return (
    <html lang="en">
      <body>
        <PrismicPreview repositoryName={repositoryName}>
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
