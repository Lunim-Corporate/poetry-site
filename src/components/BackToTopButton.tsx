"use client";

import { useCallback, useEffect, useState } from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="w-full flex justify-center px-6 py-4">
      <button
        type="button"
        aria-label="Back to top"
        onClick={onClick}
        className={[
          "h-12 px-6 rounded-full shadow-lg",
          "bg-accent text-primary-dark font-bold",
          "inline-flex items-center justify-center gap-2",
          "transition-opacity duration-200 hover:opacity-90",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        ].join(" ")}
      >
        <span>Back to top</span>
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  );
}

