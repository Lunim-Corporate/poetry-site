"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
    >
      Print This Page
    </button>
  );
}
