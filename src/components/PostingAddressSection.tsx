"use client";

import { type ReactNode } from "react";
import type { MockApplicantBookPosting } from "@/lib/mockAuth";
import ShippingAddressPanel from "@/components/ShippingAddressPanel";

export type PostingAddressSectionProps = {
  book: MockApplicantBookPosting;
  /** Shared entry reference shown with the address / QR. */
  reference?: string;
  qrDataUrl?: string;
  /** Show the Print label control under the reference column. */
  showPrintButton?: boolean;
  /** Optional id for print CSS targeting when multiple labels are on one page. */
  printLabelId?: string;
  /** Compact card chrome for dashboard lists. */
  variant?: "embedded" | "card";
};

function StatusShell({
  variant,
  title,
  children,
}: {
  variant: "embedded" | "card";
  title?: string;
  children: ReactNode;
}) {
  if (variant === "card") {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 shadow-sm space-y-3">
        {title ? (
          <h3 className="text-lg font-semibold text-slate-900">
            <span className="italic font-normal text-slate-800">{title}</span>
          </h3>
        ) : null}
        {children}
      </div>
    );
  }
  return <div className="space-y-3">{children}</div>;
}

/**
 * Single unconditional posting view: current judge address + QR + Print label.
 * Assignment is instant; no waiting / reassignment / self-report states.
 */
export default function PostingAddressSection({
  book,
  reference,
  qrDataUrl,
  showPrintButton = true,
  printLabelId,
  variant = "embedded",
}: PostingAddressSectionProps) {
  const heading = book.bookTitle || undefined;
  const shipping = book.shipping;

  if (!shipping) {
    return (
      <StatusShell variant={variant} title={heading}>
        <p className="text-base text-slate-500">Posting address unavailable for this book.</p>
      </StatusShell>
    );
  }

  return (
    <StatusShell variant={variant} title={heading}>
      <p className="text-base text-slate-500">
        Post your book to the address below. Include your entry reference on the parcel.
      </p>
      <ShippingAddressPanel
        shipping={shipping}
        reference={reference}
        qrDataUrl={qrDataUrl}
        showPrintButton={showPrintButton && Boolean(reference && qrDataUrl)}
        printLabelId={printLabelId}
      />
    </StatusShell>
  );
}
