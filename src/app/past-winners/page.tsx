import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";

export const revalidate = 60;

const defaultYears = [2025, 2024, 2023, 2022, 2021, 2020];

export default async function PastWinnersPage() {
  const client = createClient();
  const doc = await (client as any)
    .getSingle("past_winners_page")
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
            <p className="eyebrow">Browse Our</p>
            <h1 className="hero__title">Past Winners</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="after-hero">
        <div className="container">
          <div className="content sketch-card">
            <h2>Winners by Year</h2>
            <p>
              Explore the exceptional poetry collections that have been recognized
              by the Maya Poetry Book Awards over the years.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              {defaultYears.map((year) => (
                <Link
                  key={year}
                  href={`/past-winners/${year}`}
                  className="btn btn--ghost"
                  style={{ textAlign: "center", padding: "1rem 1.5rem" }}
                >
                  <span className="btn__label">{year} Winners</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const doc = await (client as any)
    .getSingle("past_winners_page")
    .catch(() => null);

  if (doc?.data) {
    return {
      title: doc.data.meta_title || "Past Winners",
      description: doc.data.meta_description || "Explore the exceptional poetry collections recognized by the Maya Poetry Book Awards.",
    };
  }

  return {
    title: "Past Winners",
    description: "Explore the exceptional poetry collections recognized by the Maya Poetry Book Awards over the years.",
  };
}
