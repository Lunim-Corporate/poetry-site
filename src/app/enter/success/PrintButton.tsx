"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border-2 border-[#23100A] bg-transparent hover:bg-[#23100A]/5 text-[#23100A] font-semibold py-2 px-3.5 rounded-lg text-sm transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 13.25 8h-6.5A1.75 1.75 0 0 1 5 6.25v-3.5Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h6.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25h-6.5ZM4.75 9.5A2.75 2.75 0 0 0 2 12.25v2A2.75 2.75 0 0 0 4.75 17h.5a.75.75 0 0 0 0-1.5h-.5c-.69 0-1.25-.56-1.25-1.25v-2c0-.69.56-1.25 1.25-1.25h10.5c.69 0 1.25.56 1.25 1.25v2c0 .69-.56 1.25-1.25 1.25h-.5a.75.75 0 0 0 0 1.5h.5A2.75 2.75 0 0 0 18 14.25v-2A2.75 2.75 0 0 0 15.25 9.5H4.75ZM7 15.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
          clipRule="evenodd"
        />
      </svg>
      Print label
    </button>
  );
}
