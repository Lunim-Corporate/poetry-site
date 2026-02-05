import { Metadata, ResolvingMetadata } from "next";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
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
      <section className="min-h-[480px] bg-gradient-to-br from-primary to-primary-dark text-white flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Celebrating Excellence in Poetry from Around the World
            </h1>
            <p className="text-lg text-white/85 mt-4 max-w-2xl mx-auto">
              The Maya Poetry Book Awards honour outstanding poetry collections
              that push boundaries and inspire readers globally.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link
                href="/enter"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm bg-accent hover:bg-accent-light text-slate-900 transition-colors"
              >
                Enter Your Book
              </Link>
              <Link
                href="/past-winners"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-colors"
              >
                View Past Winners
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  About the Awards
                </h2>
                <p className="text-lg text-slate-500">
                  Recognizing exceptional poetry collections since 2004
                </p>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">
                    The Maya Poetry Book Awards is an annual international
                    competition celebrating exceptional poetry collections from
                    established and emerging poets worldwide.
                  </strong>
                </p>

                <div className="my-6 overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">1st Place</th>
                        <td className="px-4 py-3 text-primary font-bold text-lg">£800</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">2nd Place</th>
                        <td className="px-4 py-3 text-primary font-bold text-lg">£400</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">3rd Place</th>
                        <td className="px-4 py-3 text-primary font-bold text-lg">£200</td>
                      </tr>
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-900">Best Children&apos;s Book</th>
                        <td className="px-4 py-3 text-primary font-bold text-lg">£200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-slate-500">
                  All winners receive a certificate, press coverage, and promotional support.
                </p>

                <h3 className="text-lg font-semibold text-slate-900 mt-8 mb-3">What Winners Receive</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>Cash prizes as listed above</li>
                  <li>Featured book review on our website</li>
                  <li>Winner&apos;s certificate and digital badge</li>
                  <li>Inclusion in our press releases</li>
                  <li>Promotion across our social media channels</li>
                </ul>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Background</h3>
                    <p className="text-slate-600">
                      For over 20 years, the International Welsh Poetry
                      Competition has celebrated poetic excellence. The Maya
                      Poetry Book Awards extends this legacy to honour complete
                      poetry collections.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Self-Funded</h3>
                    <p className="text-slate-600">
                      The awards are entirely self-funded with no grants or
                      external sponsorship, ensuring complete independence in our
                      judging process.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/enter"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm bg-primary hover:bg-primary-light text-white transition-colors"
                  >
                    Enter Your Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Newsletter Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Newsletter</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Stay updated with award news, deadlines, and winner announcements.
                </p>
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="newsletter-email">
                      Email
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Contact Card */}
              <div id="contact" className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Contact Us</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Have questions? We&apos;re here to help.
                </p>
                <form className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="How can we help?"
                      rows={4}
                      required
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="contact-newsletter"
                      type="checkbox"
                      name="newsletter"
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <label htmlFor="contact-newsletter" className="text-xs text-slate-600">
                      Also sign me up for the newsletter
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-slate-200 border-t border-slate-200">
              {[
                {
                  q: "Who can enter the competition?",
                  a: "The competition is open to poets worldwide. Both traditionally published and self-published poetry collections are eligible.",
                },
                {
                  q: "What types of poetry books are eligible?",
                  a: "We accept poetry collections in English. The book must have been published within the last 3 years and contain at least 20 poems.",
                },
                {
                  q: "How much does it cost to enter?",
                  a: "Entry costs £40 per book. If you enter 2 or more books, the price is reduced to £35 per book.",
                },
                {
                  q: "When is the deadline?",
                  a: "The entry deadline is typically in late autumn. Please check our entry page for the current year's specific deadline.",
                },
                {
                  q: "How are winners selected?",
                  a: "All entries are read and evaluated by our experienced judge. Winners are selected based on originality, craft, emotional impact, and overall quality of the collection.",
                },
                {
                  q: "When are winners announced?",
                  a: "Winners are typically announced in early spring of the following year. All entrants will be notified by email.",
                },
              ].map((item, index) => (
                <details key={index} className="group">
                  <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer font-medium text-slate-900 hover:text-primary transition-colors list-none">
                    <span>{item.q}</span>
                    <span className="text-slate-400 text-xl font-light shrink-0 group-open:hidden">+</span>
                    <span className="text-slate-400 text-xl font-light shrink-0 hidden group-open:inline">−</span>
                  </summary>
                  <p className="pb-4 pr-8 text-slate-600 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
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
