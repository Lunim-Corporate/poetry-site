import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";

interface PageProps {
  params: Promise<{ year: string }>;
}

export const revalidate = 60;

// Sample winner data - in production this would come from Prismic
const sampleWinners = {
  "1st Place": {
    title: "Taplash Meditations",
    author: "Sarah Chen",
    location: "London, UK",
  },
  "2nd Place": {
    title: "Wheels Within Wheels",
    author: "Michael O'Brien",
    location: "Dublin, Ireland",
  },
  "3rd Place": {
    title: "Meet Us and Eat Us",
    author: "Priya Sharma",
    location: "Mumbai, India",
  },
  "Children's": {
    title: "Inside the Elephant",
    authors: ["Vilma Bharatan", "Liz Kendall"],
    location: "Cardiff, Wales",
  },
};

const shortlist = [
  { title: "The Quiet Hours", author: "Emma Thompson", location: "Edinburgh, Scotland" },
  { title: "Borderlands", author: "Carlos Mendez", location: "Los Angeles, USA" },
  { title: "River Songs", author: "Anika Patel", location: "Birmingham, UK" },
  { title: "Winter Fragments", author: "James O'Neill", location: "Belfast, Northern Ireland" },
  { title: "Urban Hymns", author: "Lisa Chang", location: "Singapore" },
  { title: "The Last Garden", author: "Robert Williams", location: "Sydney, Australia" },
  { title: "Nightfall Verses", author: "Maria Santos", location: "Lisbon, Portugal" },
  { title: "Coastal Dreams", author: "David Park", location: "Vancouver, Canada" },
];

export default async function WinnersYearPage({ params }: PageProps) {
  const { year } = await params;
  const client = createClient();

  // Try to fetch from Prismic
  const doc = await (client as any)
    .getByUID("past_winners_year", year)
    .catch(() => null);

  // If we have Prismic content, use SliceZone
  if (doc) {
    return (
      <SliceZone slices={doc.data.slices} components={components} />
    );
  }

  // Fallback to static content
  return (
    <>
      {/* Hero Section */}
      <section className="hero hero--small">
        <div className="container">
          <div className="hero__inner">
            <p className="eyebrow">{year}</p>
            <h1 className="hero__title">Winners</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="after-hero">
        <div className="container">
          <div className="content sketch-card">
            <h2>{year} Award Winners</h2>

            {/* Winners Grid */}
            <div className="winnersGrid">
              {/* Header Row */}
              <div className="winnersGrid__cell">
                <h3>1st Place</h3>
              </div>
              <div className="winnersGrid__cell">
                <h3>2nd Place</h3>
              </div>
              <div className="winnersGrid__cell">
                <h3>3rd Place</h3>
              </div>
              <div className="winnersGrid__cell">
                <h3>Children&apos;s</h3>
              </div>

              {/* Winner Cells */}
              <div className="winnersGrid__cell">
                <div
                  style={{
                    width: "100%",
                    paddingTop: "140%",
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <p className="winnersGrid__caption">
                  <span>{sampleWinners["1st Place"].title}</span>
                  <br />
                  {sampleWinners["1st Place"].author}
                  <br />
                  {sampleWinners["1st Place"].location}
                </p>
              </div>
              <div className="winnersGrid__cell">
                <div
                  style={{
                    width: "100%",
                    paddingTop: "140%",
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <p className="winnersGrid__caption--small">
                  <span>{sampleWinners["2nd Place"].title}</span>
                  <br />
                  {sampleWinners["2nd Place"].author}
                  <br />
                  {sampleWinners["2nd Place"].location}
                </p>
              </div>
              <div className="winnersGrid__cell">
                <div
                  style={{
                    width: "100%",
                    paddingTop: "140%",
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <p className="winnersGrid__caption--small">
                  <span>{sampleWinners["3rd Place"].title}</span>
                  <br />
                  {sampleWinners["3rd Place"].author}
                  <br />
                  {sampleWinners["3rd Place"].location}
                </p>
              </div>
              <div className="winnersGrid__cell">
                <div
                  style={{
                    width: "100%",
                    paddingTop: "140%",
                    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <p className="winnersGrid__caption--small">
                  <span>{sampleWinners["Children's"].title}</span>
                  <br />
                  {sampleWinners["Children's"].authors.join(" & ")}
                  <br />
                  {sampleWinners["Children's"].location}
                </p>
              </div>
            </div>

            {/* Shortlist */}
            <h3>Shortlist</h3>
            <ul>
              {shortlist.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.title}</strong> by {entry.author} ({entry.location})
                </li>
              ))}
            </ul>

            {/* Navigation */}
            <div style={{ marginTop: "2rem" }}>
              <Link href="/past-winners" className="btn btn--ghost">
                <span className="btn__label">← Back to All Years</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  // Try to fetch years from Prismic
  const docs = await (client as any)
    .getAllByType("past_winners_year")
    .catch(() => []);

  if (docs.length > 0) {
    return docs.map((doc: any) => ({ year: doc.uid }));
  }

  // Fallback to default years
  return [
    { year: "2025" },
    { year: "2024" },
    { year: "2023" },
    { year: "2022" },
    { year: "2021" },
    { year: "2020" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params;
  const client = createClient();

  const doc = await (client as any)
    .getByUID("past_winners_year", year)
    .catch(() => null);

  if (doc?.data) {
    return {
      title: doc.data.meta_title || `${year} Winners`,
      description: doc.data.meta_description || `View the ${year} Maya Poetry Book Awards winners.`,
    };
  }

  return {
    title: `${year} Winners`,
    description: `View the ${year} Maya Poetry Book Awards winners, shortlist, and longlist.`,
  };
}
