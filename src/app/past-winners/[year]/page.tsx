import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import Link from "next/link";

interface PageProps {
  params: Promise<{ year: string }>;
}

export const revalidate = 60;

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

  const doc = await (client as any)
    .getByUID("past_winners_year", year)
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
            <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">{year}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Winners</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">{year} Award Winners</h2>

            {/* Winners Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(["1st Place", "2nd Place", "3rd Place", "Children's"] as const).map((place) => {
                const winner = sampleWinners[place];
                return (
                  <div key={place} className="text-center">
                    <p className={`text-sm font-semibold mb-3 ${place === "1st Place" ? "text-accent-dark" : "text-slate-500"}`}>
                      {place}
                    </p>
                    <div className="aspect-[5/7] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-md mb-3" />
                    <p className="text-sm">
                      <span className="font-semibold text-slate-900 block">{winner.title}</span>
                      {"author" in winner ? winner.author : winner.authors.join(" & ")}
                      <br />
                      <span className="text-slate-500">{winner.location}</span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Shortlist */}
            <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Shortlist</h3>
            <ul className="space-y-2 text-slate-600">
              {shortlist.map((entry, index) => (
                <li key={index}>
                  <strong className="text-slate-900">{entry.title}</strong> by {entry.author} ({entry.location})
                </li>
              ))}
            </ul>

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <Link
                href="/past-winners"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                ← Back to All Years
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

  const docs = await (client as any)
    .getAllByType("past_winners_year")
    .catch(() => []);

  if (docs.length > 0) {
    return docs.map((doc: any) => ({ year: doc.uid }));
  }

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
