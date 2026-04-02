"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function scrollToHashElement(): boolean {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return true;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return true;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  return false;
}

/**
 * Next.js client navigation to `/#id` loads `/` but does not scroll to the anchor.
 * Retry until the target exists (slices may paint after the first frame).
 */
export default function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 60;

    const tick = () => {
      if (cancelled) return;
      if (scrollToHashElement()) return;
      attempts += 1;
      if (attempts < maxAttempts) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(tick));

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.pathname !== "/") return;
      requestAnimationFrame(() => {
        scrollToHashElement();
      });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
