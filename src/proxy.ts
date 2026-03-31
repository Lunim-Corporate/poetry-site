import { NextRequest, NextResponse } from "next/server";

/**
 * Known valid page routes. Anything not matching these patterns
 * gets 301-redirected to the homepage (catches legacy/unknown URLs).
 * Trailing slashes are allowed on valid routes.
 */
const VALID_PATHS = [
  /^\/$/, // homepage
  /^\/enter(\/success)?\/?$/,
  /^\/judge\/?$/,
  /^\/past-winners(\/\d{4})?\/?$/,
  /^\/slice-simulator\/?$/,
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files that slipped past the matcher (e.g. /some-image.png)
  if (/\.\w+$/.test(pathname)) return NextResponse.next();

  if (VALID_PATHS.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url), { status: 301 });
}

export const config = {
  matcher: [
    // Run on all paths except API routes, Next.js internals, and obvious static assets
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
