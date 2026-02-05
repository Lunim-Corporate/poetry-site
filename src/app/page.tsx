import { Metadata, ResolvingMetadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const client = createClient();
  const doc = await (client as any)
    .getSingle("homepage")
    .catch(() => null);

  // If we have Prismic content, use SliceZone
  if (doc) {
    return (
      <SliceZone slices={doc.data.slices} components={components} />
    );
  }

  // Fallback to static content while Prismic is being set up
  return (
    <>
      {/* Hero Section */}
      <section className="hero hero--home">
        <div className="container">
          <div className="hero__inner">
            <h1 className="hero__title">
              Celebrating Excellence in Poetry from Around the World
            </h1>
            <p className="hero__subtitle">
              The Maya Poetry Book Awards honour outstanding poetry collections
              that push boundaries and inspire readers globally.
            </p>
            <div className="hero__ctaRow">
              <Link href="/enter" className="btn">
                <span className="btn__label">Enter Your Book</span>
              </Link>
              <Link href="/past-winners" className="btn btn--ghost">
                <span className="btn__label">View Past Winners</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="after-hero after-hero--home">
        <div className="container">
          <div className="two-col two-col--home">
            <div className="homeMainTitle">
              <h2>About the Awards</h2>
              <p className="homeMainTitle__subtitle">
                Recognizing exceptional poetry collections since 2004
              </p>
            </div>

            <div className="contentStack">
              <div className="content sketch-card aboutCard">
                <p>
                  <strong>
                    The Maya Poetry Book Awards is an annual international
                    competition celebrating exceptional poetry collections from
                    established and emerging poets worldwide.
                  </strong>
                </p>

                <table className="prizeTable">
                  <tbody>
                    <tr>
                      <th>1st Place</th>
                      <td>£800</td>
                    </tr>
                    <tr>
                      <th>2nd Place</th>
                      <td>£400</td>
                    </tr>
                    <tr>
                      <th>3rd Place</th>
                      <td>£200</td>
                    </tr>
                    <tr>
                      <th>Best Children&apos;s Book</th>
                      <td>£200</td>
                    </tr>
                    <tr className="prizeTable__note">
                      <td colSpan={2}>
                        All winners receive a certificate, press coverage, and
                        promotional support.
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h3>What Winners Receive</h3>
                <ul>
                  <li>Cash prizes as listed above</li>
                  <li>Featured book review on our website</li>
                  <li>Winner&apos;s certificate and digital badge</li>
                  <li>Inclusion in our press releases</li>
                  <li>Promotion across our social media channels</li>
                </ul>

                <div className="aboutColumns">
                  <div className="aboutCol">
                    <h3>Background</h3>
                    <p>
                      For over 20 years, the International Welsh Poetry
                      Competition has celebrated poetic excellence. The Maya
                      Poetry Book Awards extends this legacy to honour complete
                      poetry collections.
                    </p>
                  </div>
                  <div className="aboutCol">
                    <h3>Self-Funded</h3>
                    <p>
                      The awards are entirely self-funded with no grants or
                      external sponsorship, ensuring complete independence in our
                      judging process.
                    </p>
                  </div>
                </div>

                <div className="contentCta">
                  <Link href="/enter" className="btn">
                    <span className="btn__label">Enter Your Book Now</span>
                  </Link>
                </div>
              </div>

              {/* FAQ Section */}
              <div id="faq" className="content sketch-card faqCard">
                <h2 className="cardTitle">Frequently Asked Questions</h2>

                <div className="faq__list">
                  <details className="faq__item">
                    <summary>Who can enter the competition?</summary>
                    <p>
                      The competition is open to poets worldwide. Both
                      traditionally published and self-published poetry
                      collections are eligible.
                    </p>
                  </details>

                  <details className="faq__item">
                    <summary>What types of poetry books are eligible?</summary>
                    <p>
                      We accept poetry collections in English. The book must have
                      been published within the last 3 years and contain at least
                      20 poems.
                    </p>
                  </details>

                  <details className="faq__item">
                    <summary>How much does it cost to enter?</summary>
                    <p>
                      Entry costs £40 per book. If you enter 2 or more books, the
                      price is reduced to £35 per book.
                    </p>
                  </details>

                  <details className="faq__item">
                    <summary>When is the deadline?</summary>
                    <p>
                      The entry deadline is typically in late autumn. Please check
                      our entry page for the current year&apos;s specific deadline.
                    </p>
                  </details>

                  <details className="faq__item">
                    <summary>How are winners selected?</summary>
                    <p>
                      All entries are read and evaluated by our experienced judge.
                      Winners are selected based on originality, craft, emotional
                      impact, and overall quality of the collection.
                    </p>
                  </details>

                  <details className="faq__item">
                    <summary>When are winners announced?</summary>
                    <p>
                      Winners are typically announced in early spring of the
                      following year. All entrants will be notified by email.
                    </p>
                  </details>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="rightCol">
              <div className="newsletter">
                <h3 className="cardTitle">Newsletter</h3>
                <p className="muted">
                  Stay updated with award news, deadlines, and winner
                  announcements.
                </p>
                <form className="form">
                  <label className="label" htmlFor="newsletter-email">
                    Email
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                  <button type="submit" className="btn btn--full">
                    <span className="btn__label">Subscribe</span>
                  </button>
                </form>
              </div>

              <div id="contact" className="contactCard">
                <h3 className="cardTitle">Contact Us</h3>
                <p className="muted">
                  Have questions? We&apos;re here to help.
                </p>
                <form className="form">
                  <div className="formRow formRow--split">
                    <div>
                      <label className="label" htmlFor="contact-name">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="contact-email">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="formRow">
                    <label className="label" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="How can we help?"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="checkRow">
                    <input
                      id="contact-newsletter"
                      type="checkbox"
                      name="newsletter"
                    />
                    <label htmlFor="contact-newsletter">
                      Also sign me up for the newsletter
                    </label>
                  </div>
                  <button type="submit" className="btn btn--full">
                    <span className="btn__label">Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateMetadata(
  _context: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const client = createClient();
  const doc = await (client as any)
    .getSingle("homepage")
    .catch(() => null);

  if (doc?.data) {
    return {
      title: doc.data.meta_title || "Maya Poetry Book Awards - Celebrating Excellence in Poetry",
      description: doc.data.meta_description || "The Maya Poetry Book Awards honour outstanding poetry collections that push boundaries and inspire readers globally.",
    };
  }

  return {
    title: "Maya Poetry Book Awards - Celebrating Excellence in Poetry",
    description: "The Maya Poetry Book Awards honour outstanding poetry collections that push boundaries and inspire readers globally. Enter your book today.",
  };
}
