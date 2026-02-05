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
            <p className="eyebrow">Meet Our</p>
            <h1 className="hero__title">Judge</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="after-hero">
        <div className="container">
          <div className="content content--plain">
            <div className="profileLayout">
              <div className="profileSquare">
                <svg
                  className="profileSquare__icon"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="16" r="10" />
                  <path d="M6 44c0-10 8-18 18-18s18 8 18 18" />
                </svg>
              </div>

              <div>
                <h2>Dave Lewis</h2>
                <p className="muted">Author, Entrepreneur | Cardiff, Wales</p>

                <div className="content sketch-card">
                  <p>
                    Dave Lewis is a celebrated Welsh author, entrepreneur, and
                    dedicated advocate for poetry and the arts. With decades of
                    experience in both the literary and business worlds, Dave
                    brings a unique perspective to judging the Maya Poetry Book
                    Awards.
                  </p>
                  <p>
                    His deep appreciation for craftsmanship in poetry, combined
                    with his understanding of what makes writing resonate with
                    readers, makes him an ideal steward for identifying
                    exceptional poetry collections.
                  </p>
                </div>

                <h3>Entrepreneurial History</h3>
                <p>
                  Dave has founded and led multiple successful ventures throughout
                  his career. His business acumen has enabled him to support
                  creative endeavors and provide platforms for emerging voices in
                  literature.
                </p>

                <h3>Literary History</h3>
                <p>
                  As an author, Dave has published several acclaimed works spanning
                  poetry and prose. His writing explores themes of identity,
                  landscape, and the human experience, drawing deeply on his Welsh
                  heritage.
                </p>

                <div className="bookCovers">
                  <div className="bookCovers__link">
                    <div
                      style={{
                        width: "100%",
                        paddingTop: "150%",
                        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                        borderRadius: "10px",
                        position: "relative",
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#64748b",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                      }}>
                        Book Cover
                      </span>
                    </div>
                  </div>
                  <div className="bookCovers__link">
                    <div
                      style={{
                        width: "100%",
                        paddingTop: "150%",
                        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                        borderRadius: "10px",
                        position: "relative",
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#64748b",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                      }}>
                        Book Cover
                      </span>
                    </div>
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
