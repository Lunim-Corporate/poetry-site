import PrintButton from "@/app/enter/success/PrintButton";

export type ShippingAddress = {
  name: string;
  street: string;
  town: string;
  postcode: string;
  country: string;
};

type ShippingAddressPanelProps = {
  shipping: ShippingAddress;
  /** When set with qrDataUrl, shows the reference column (success-page print label). */
  reference?: string;
  qrDataUrl?: string;
  /** Show the secondary Print label control under the reference column. */
  showPrintButton?: boolean;
  /** Optional id for print CSS targeting (defaults to print-label when QR is shown). */
  printLabelId?: string;
  className?: string;
};

export default function ShippingAddressPanel({
  shipping,
  reference,
  qrDataUrl,
  showPrintButton = false,
  printLabelId = "print-label",
  className = "",
}: ShippingAddressPanelProps) {
  const showReference = Boolean(reference && qrDataUrl);

  return (
    <div
      className={`p-4 border-2 border-dashed border-slate-400/60 rounded-lg ${className}`.trim()}
    >
      <div
        id={showReference ? printLabelId : undefined}
        className={
          showReference
            ? "grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] print:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6"
            : undefined
        }
      >
        <div>
          <h3 className="text-base font-semibold text-slate-700 mt-0 mb-2">Address</h3>
          <p className="text-base text-slate-600 leading-relaxed">
            <strong>{shipping.name}</strong>
            <br />
            {shipping.street.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
            {shipping.town}
            <br />
            {shipping.postcode}
            <br />
            {shipping.country}
          </p>
        </div>

        {showReference && (
          <div>
            <h3 className="text-base font-semibold text-slate-700 mt-0 mb-3">Reference</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="QR code linking to this entry in Google Sheets"
              width={112}
              height={112}
              className="rounded"
            />
            <p className="text-base font-extrabold text-slate-900 mt-3">{reference}</p>
          </div>
        )}
      </div>

      {showPrintButton && showReference && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6">
          <div className="hidden md:block" aria-hidden="true" />
          <div>
            <PrintButton />
          </div>
        </div>
      )}
    </div>
  );
}
