type FooterSlice = {
  slice_type: string;
  variation: string;
  primary: {
    copyright_text?: string;
    delivered_by_text?: string;
    delivered_by_url?: string;
  };
};

interface FooterProps {
  slice: FooterSlice;
  index: number;
  slices: any[];
  context: any;
}

export default function Footer({ slice }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = slice.primary.copyright_text || "Maya Poetry Book Awards";
  const deliveredByText = slice.primary.delivered_by_text || "Lunim";
  const deliveredByUrl = slice.primary.delivered_by_url || "https://lunim.io";

  return (
    <footer className="py-8 border-t border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-slate-500">
          © {currentYear} {copyrightText}. Delivered by{" "}
          <a
            href={deliveredByUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 underline underline-offset-2 hover:text-primary transition-colors"
          >
            {deliveredByText}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
