"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { EnterPageSettings } from "@/types";
import { WIZARD_STEPS, DEFAULT_PRICE_SINGLE, DEFAULT_PRICE_MULTIPLE } from "./constants";

const PaymentForm = dynamic(() => import("./PaymentForm"), { ssr: false });

type Step = 1 | 2 | 3;

const RULES = [
  "This is an international competition and we accept poetry books & pamphlets from anywhere in the world provided all submissions are in English. The competition is open to anyone aged 18 or over at the time of entering.",
  "Each book must only be sent once. We only accept physical copies (i.e. paperbacks or pamphlets) as we then donate your book(s) to local libraries (RCT), Storyville Books (free library/bookshop), and Tesco (free books) each autumn/Christmas.",
  "Only poetry books published by small, truly independent presses and self-published books are eligible to enter. Publishers that receive grants from arts councils, universities and other sponsorships are not considered independent.",
  "Only individual poets are eligible to enter (although if a book is co-authored we may bend the rules \u2013 please contact us first). The poet must be living. We do not accept anthologies. Translations of other poets\u2019 works are not accepted.",
  "Entry fees are payable via credit or debit card. Unfortunately, we can no longer accept UK cheques due to our bank charging excessive fees.",
  "You may enter the competition as many times as you wish, as long as each submission is accompanied by an entry fee.",
  "There is no publication date requirement but books should not be out of print.",
  "Only books under 200 pages are eligible. If in doubt, please email us first.",
  "Unpublished manuscripts are not accepted and will not be returned. No refund will be issued.",
  "Entries cannot be returned but all books will be donated to local libraries in south Wales, so your book will have the chance to be read by even more people.",
  "The Maya Poetry Book Awards holds no responsibility for incomplete or ineligible entries.",
  "It is your responsibility to ensure the correct postage is applied to your parcel and to pay for it. Incorrect postage could result in your package being returned to you and possibly in you missing the deadline.",
  "If posting from overseas (outside the UK), it is exclusively your responsibility to fill out any customs forms and declarations that may be needed.",
  "All prizes will be paid in pounds sterling by card. The Poetry Book Awards cannot be held responsible for any payment processing or currency conversion fees.",
  "By entering, you agree that if you win one of our awards, you will send us a photo and short biography for us to post on our website, to share on social media, as well as for any other advertising/press releases.",
  "The judge(s) will read all entries. Their decision is final and no correspondence will be entered into.",
  "The competition organisers reserve the right to change the judge(s) without notice.",
  "No feedback is offered and no personal comments regarding entries will be given.",
  "No refunds will be given.",
  "Entrants will be signed up for the newsletter to be kept informed of changes in announcement dates, judges, winners, etc.",
  "Winners will be awarded a cash prize and emailed a certificate and logo to use for publicity, and will also receive a review from us on the relevant Goodreads and Amazon UK web pages, if your book is listed on these platforms.",
  "Any entries received after the closing date will automatically be put forward for the following year\u2019s competition. No returns will be given.",
  "You retain all rights to your work.",
  "By entering this competition, each entrant agrees to be bound by these rules.",
];

const PHONE_COUNTRY_CODES = [
  { value: "+44", label: "United Kingdom (+44)" },
  { value: "+1", label: "United States/Canada (+1)" },
  { value: "+353", label: "Ireland (+353)" },
  { value: "+61", label: "Australia (+61)" },
  { value: "+64", label: "New Zealand (+64)" },
  { value: "+27", label: "South Africa (+27)" },
  { value: "+91", label: "India (+91)" },
  { value: "+92", label: "Pakistan (+92)" },
  { value: "+880", label: "Bangladesh (+880)" },
  { value: "+81", label: "Japan (+81)" },
  { value: "+82", label: "South Korea (+82)" },
  { value: "+86", label: "China (+86)" },
  { value: "+65", label: "Singapore (+65)" },
  { value: "+60", label: "Malaysia (+60)" },
  { value: "+63", label: "Philippines (+63)" },
  { value: "+971", label: "United Arab Emirates (+971)" },
  { value: "+49", label: "Germany (+49)" },
  { value: "+33", label: "France (+33)" },
  { value: "+34", label: "Spain (+34)" },
  { value: "+39", label: "Italy (+39)" },
  { value: "+31", label: "Netherlands (+31)" },
  { value: "+32", label: "Belgium (+32)" },
  { value: "+41", label: "Switzerland (+41)" },
  { value: "+46", label: "Sweden (+46)" },
  { value: "+47", label: "Norway (+47)" },
  { value: "+45", label: "Denmark (+45)" },
  { value: "+358", label: "Finland (+358)" },
  { value: "+48", label: "Poland (+48)" },
  { value: "+351", label: "Portugal (+351)" },
  { value: "+30", label: "Greece (+30)" },
  { value: "+420", label: "Czech Republic (+420)" },
  { value: "+36", label: "Hungary (+36)" },
  { value: "+40", label: "Romania (+40)" },
  { value: "+7", label: "Kazakhstan/Russia (+7)" },
  { value: "+55", label: "Brazil (+55)" },
  { value: "+52", label: "Mexico (+52)" },
  { value: "+54", label: "Argentina (+54)" },
  { value: "+56", label: "Chile (+56)" },
  { value: "+57", label: "Colombia (+57)" },
  { value: "+234", label: "Nigeria (+234)" },
  { value: "+254", label: "Kenya (+254)" },
  { value: "+20", label: "Egypt (+20)" },
];

function buildBookPrices(priceSingle: number, priceMultiple: number) {
  const prices: Record<number, number> = {};
  for (let i = 1; i <= 6; i++) {
    prices[i] = i === 1 ? priceSingle : priceMultiple * i;
  }
  return prices;
}

function numberToWord(n: number): string {
  const words = ["One", "Two", "Three", "Four", "Five", "Six"];
  return words[n - 1] || String(n);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function getStepMessage(targetStep: number, action: string): string {
  switch (targetStep) {
    case 2:
      return `To continue to step 2, please first confirm you have read the rules then ${action} "I have read the rules \u2014 Continue" at the bottom of Step 1.`;
    case 3:
      return `To continue to step 3, please first enter your personal details and the number of books you're entering, then ${action} "Continue to payment" at the bottom of Step 2.`;
    case 4:
      return `To continue to step 4, please enter your card details in Step 3, then ${action} "Pay securely" to complete your payment.`;
    default:
      return "";
  }
}

function getFormattedPhoneNumber(countryCode: string, phoneNumber: string): string {
  const trimmedPhoneNumber = phoneNumber.trim();
  if (!trimmedPhoneNumber || !countryCode) return "";
  return `${countryCode} ${trimmedPhoneNumber}`;
}

export default function EnterPageClient({
  settings,
}: {
  settings: EnterPageSettings;
}) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [rulesConfirmed, setRulesConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCountryCode: "",
    phoneNumber: "",
    bookCount: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isFetchingIntent, setIsFetchingIntent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isWizardLocked, setIsWizardLocked] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (sessionStorage.getItem("maya_entry_complete") === "true") {
      setIsWizardLocked(true);
    }
  }, []);

  const priceSingle = settings.price_single_book ?? DEFAULT_PRICE_SINGLE;
  const priceMultiple = settings.price_multiple_books ?? DEFAULT_PRICE_MULTIPLE;
  const bookPrices = buildBookPrices(priceSingle, priceMultiple);
  const action = isMobile ? "tap" : "click";

  const bookOptions = Array.from({ length: 6 }, (_, i) => {
    const count = i + 1;
    return {
      value: count,
      label: `${numberToWord(count)} book${count > 1 ? "s" : ""}: \u00A3${bookPrices[count]} GBP`,
    };
  });

  const handleStepClick = (stepNum: number) => {
    if (stepNum === currentStep) return;
    if (stepNum < currentStep) {
      if (isWizardLocked) {
        setModalMessage("The competition entry process is now complete. You can no longer change any details.");
        return;
      }
      setCurrentStep(stepNum as Step);
      return;
    }
    // Going forward — navigate directly if prerequisites already met
    if (stepNum === 2 && rulesConfirmed) { setCurrentStep(2); return; }
    if (stepNum === 3 && clientSecret) { setCurrentStep(3); return; }
    // Otherwise show instructional modal
    setModalMessage(getStepMessage(stepNum, action));
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    if (formData.phoneNumber.trim() && !formData.phoneCountryCode)
      newErrors.phoneNumber = "Please select a country code for the phone number.";
    if (!formData.bookCount)
      newErrors.bookCount = "Please select how many books you'd like to enter.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsFetchingIntent(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: getFormattedPhoneNumber(formData.phoneCountryCode, formData.phoneNumber),
          bookCount: formData.bookCount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.clientSecret) {
        setCheckoutError(data.error || "Something went wrong. Please try again.");
        setIsFetchingIntent(false);
        return;
      }

      setClientSecret(data.clientSecret);
      setCurrentStep(3);
    } catch {
      setCheckoutError("Could not connect to payment service. Please try again.");
    } finally {
      setIsFetchingIntent(false);
    }
  };

  return (
    <section className="py-10 bg-white font-sans">
      <div className="max-w-2xl mx-auto px-6">
        {/* Wizard Steps */}
        <div className="mb-10">
          <div className="flex items-start justify-between relative">
            {[1, 2, 3].map((connectorAfterStep) => (
              <div
                key={connectorAfterStep}
                className={`absolute top-[46px] md:top-[50px] border-t-2 transition-all ${
                  currentStep > connectorAfterStep
                    ? "border-solid border-[#23100A]"
                    : "border-dashed border-slate-300"
                }`}
                style={{
                  left: `calc(${(connectorAfterStep - 1) * 25 + 12.5}% + 20px)`,
                  right: `calc(${(4 - connectorAfterStep) * 25 - 12.5}% + 20px)`,
                }}
              />
            ))}

            {WIZARD_STEPS.map((step, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;

              return (
                <div key={index} className="flex flex-col items-center flex-1 relative z-10">
                  <p className="text-sm text-slate-400 font-medium mb-1.5">
                    Step {stepNum}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleStepClick(stepNum)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isActive
                        ? "bg-[#23100A] border-[#23100A] text-[#FFE169] cursor-default"
                        : isCompleted
                        ? "bg-slate-100 border-[#23100A] text-[#23100A] cursor-pointer hover:bg-slate-200"
                        : "bg-white border-slate-200 text-slate-400 cursor-pointer hover:border-slate-300"
                    }`}
                  >
                    {stepNum}
                  </button>
                  <p className="text-center mt-1.5 leading-tight">
                    <span className="hidden md:block text-sm text-slate-500">
                      {step.label}
                      <br />
                      {step.sublabel}
                    </span>
                    <span className="md:hidden text-sm text-slate-500">{step.mobileLabel}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Read Rules */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Competition Rules</h2>
            <p className="text-sm text-slate-500 mb-6">
              Please review the competition rules before submitting your entry.
            </p>

            <ol className="list-decimal list-outside pl-5 space-y-3 text-sm text-slate-600 font-normal">
              {RULES.map((rule, index) => (
                <li key={index} className="leading-relaxed">{rule}</li>
              ))}
            </ol>

            <div className="mt-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesConfirmed}
                  onChange={(e) => setRulesConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                />
                <span className="text-sm text-slate-700">
                  I confirm I have read and understood the rules of the competition
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(2);
                  // User is starting a new entry — release any post-payment lock
                  if (isWizardLocked) {
                    setIsWizardLocked(false);
                    sessionStorage.removeItem("maya_entry_complete");
                  }
                }}
                disabled={!rulesConfirmed}
                className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-[#23100A] font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Continue to enter details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Entry Details */}
        {currentStep === 2 && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Enter Details</h2>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-sm text-slate-700 underline inline-block mb-4 mt-1 hover:text-slate-900 cursor-pointer"
              >
                &laquo; Back to step 1
              </button>
              <p className="text-sm text-slate-500 mb-6">
                Tell us about yourself and how many books you&apos;re entering.
              </p>

              <form className="space-y-4" onSubmit={handleStep2Submit} noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="entry-name">
                    Name
                  </label>
                  <input
                    id="entry-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1" role="alert">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="entry-email">
                    Email address
                  </label>
                  <input
                    id="entry-email"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1" role="alert">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="entry-phone-number">
                    Phone number (optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)] gap-3">
                    <select
                      id="entry-phone-country-code"
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={(e) => {
                        setFormData({ ...formData, phoneCountryCode: e.target.value });
                        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" });
                      }}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="">Country code</option>
                      {PHONE_COUNTRY_CODES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="entry-phone-number"
                      type="tel"
                      name="phoneNumber"
                      inputMode="tel"
                      autoComplete="tel-national"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, phoneNumber: e.target.value });
                        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" });
                      }}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-xs text-red-600 mt-1" role="alert">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Number of books you&apos;d like to enter
                  </p>
                  <div className="space-y-2">
                    {bookOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="bookCount"
                          value={option.value}
                          checked={formData.bookCount === option.value}
                          onChange={() => {
                            setFormData({ ...formData, bookCount: option.value });
                            if (errors.bookCount) setErrors({ ...errors, bookCount: "" });
                          }}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-slate-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.bookCount && (
                    <p className="text-xs text-red-600 mt-1" role="alert">{errors.bookCount}</p>
                  )}
                </div>

                {checkoutError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                    {checkoutError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isFetchingIntent}
                  className="w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] disabled:bg-slate-300 disabled:border-slate-300 disabled:text-slate-500 text-[#23100A] font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isFetchingIntent && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {isFetchingIntent ? "Preparing payment..." : "Continue to payment"}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Payment</h3>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-sm text-slate-700 underline inline-block mb-4 mt-1 hover:text-slate-900 cursor-pointer"
              >
                &laquo; Back to step 2
              </button>
              <p className="text-sm text-slate-500 mb-6">
                Total: &pound;{bookPrices[formData.bookCount]} for {formData.bookCount}{" "}
                {formData.bookCount === 1 ? "book" : "books"}
              </p>

              {clientSecret ? (
                <PaymentForm
                  clientSecret={clientSecret}
                  totalGBP={bookPrices[formData.bookCount]}
                  bookCount={formData.bookCount}
                />
              ) : (
                <div className="flex items-center justify-center py-8 text-slate-400 text-sm gap-2">
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Loading payment form...
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setModalMessage(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-slate-700 leading-relaxed">{modalMessage}</p>
            <button
              type="button"
              onClick={() => setModalMessage(null)}
              className="mt-4 w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
