import type { ReactNode } from "react";
import Link from "next/link";

/**
 * When `book_link` is set, wraps content in an external or internal link (same rules as shortlist titles).
 * Default `linkClassName` is `block` (covers); use e.g. `inline` + `text-inherit` for titles in headings.
 */
export function wrapCoverWithBookLink(
  bookLink: string | undefined,
  cover: ReactNode,
  linkClassName = "block"
) {
  if (!bookLink) return cover;
  return /^https?:\/\//.test(bookLink) ? (
    <a href={bookLink} target="_blank" rel="noopener noreferrer" className={linkClassName}>
      {cover}
    </a>
  ) : (
    <Link href={bookLink} target="_blank" className={linkClassName}>
      {cover}
    </Link>
  );
}
