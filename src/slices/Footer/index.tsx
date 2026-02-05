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
    <footer className="site-footer" aria-label="Footer">
      <div className="container">
        <p className="footer__text">
          © {currentYear} {copyrightText}. Delivered by{" "}
          <a href={deliveredByUrl} target="_blank" rel="noopener noreferrer">
            {deliveredByText}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
