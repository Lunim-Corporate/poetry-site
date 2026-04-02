import type { FooterSliceData, SliceComponentProps } from "@/types";

export default function Footer({ slice }: SliceComponentProps<FooterSliceData>) {
  const currentYear = new Date().getFullYear();
  const copyrightText = slice.primary.copyright_text || "Maya Poetry Book Awards";
  const deliveredByText = slice.primary.delivered_by_text || "Surim";
  const deliveredByUrl = slice.primary.delivered_by_url || "https://surim.io";

  return (
    <footer className="py-8 bg-gradient-to-r from-[#451E10] via-[#7a3520] to-[#451E10]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-white/70">
          © {currentYear} {copyrightText}. Delivered by{" "}
          <a
            href={deliveredByUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-2 hover:text-[#FFE169] transition-colors"
          >
            {deliveredByText}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
