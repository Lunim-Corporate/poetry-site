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

  if (doc) {
    return (
      <SliceZone slices={doc.data.slices} components={components} />
    );
  }

  // Fallback
  return (
    <>
      <section className="min-h-[140px] bg-slate-50 border-b border-slate-200 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">Browse Our</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Past Winners</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Winners by Year</h2>
            <p className="text-slate-600 mb-6">
              Explore the exceptional poetry collections that have been recognized
              by the Maya Poetry Book Awards over the years.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {defaultYears.map((year) => (
                <Link
                  key={year}
                  href={`/past-winners/${year}`}
                  className="text-center px-4 py-3 border border-slate-200 rounded-lg font-medium text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  {year} Winners
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
