import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export const revalidate = 60;

export default async function JudgePage() {
  const client = createClient();
  const doc = await (client as any)
    .getSingle("judge_page")
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
            <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">Meet Our</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Judge</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
            <div className="md:sticky md:top-24">
              <div className="aspect-square bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shadow-md">
                <svg className="w-12 h-12 text-slate-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="24" cy="16" r="10" />
                  <path d="M6 44c0-10 8-18 18-18s18 8 18 18" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Dave Lewis</h2>
              <p className="text-slate-500 mb-6">Author, Entrepreneur | Cardiff, Wales</p>

              <div className="prose prose-slate max-w-none">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Dave Lewis is a celebrated Welsh author, entrepreneur, and
                    dedicated advocate for poetry and the arts. With decades of
                    experience in both the literary and business worlds, Dave
                    brings a unique perspective to judging the Maya Poetry Book
                    Awards.
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-0">
                    His deep appreciation for craftsmanship in poetry, combined
                    with his understanding of what makes writing resonate with
                    readers, makes him an ideal steward for identifying
                    exceptional poetry collections.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Entrepreneurial History</h3>
                <p className="text-slate-600 leading-relaxed">
                  Dave has founded and led multiple successful ventures throughout
                  his career. His business acumen has enabled him to support
                  creative endeavors and provide platforms for emerging voices in
                  literature.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-3">Literary History</h3>
                <p className="text-slate-600 leading-relaxed">
                  As an author, Dave has published several acclaimed works spanning
                  poetry and prose. His writing explores themes of identity,
                  landscape, and the human experience, drawing deeply on his Welsh
                  heritage.
                </p>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-md flex items-center justify-center">
                    <span className="text-sm text-slate-500">Book Cover</span>
                  </div>
                  <div className="aspect-[2/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-md flex items-center justify-center">
                    <span className="text-sm text-slate-500">Book Cover</span>
                  </div>
                </div>
              </div>
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
    .getSingle("judge_page")
    .catch(() => null);

  if (doc?.data) {
    return {
      title: doc.data.meta_title || "Our Judge",
      description: doc.data.meta_description || "Meet Dave Lewis, the judge for the Maya Poetry Book Awards.",
    };
  }

  return {
    title: "Our Judge",
    description: "Meet Dave Lewis, the judge for the Maya Poetry Book Awards. An acclaimed author and entrepreneur bringing decades of literary expertise.",
  };
}
