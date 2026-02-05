"use client";

import { useState } from "react";
import Link from "next/link";

type Step = 1 | 2 | 3;

export default function EnterPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bookCount: 1,
    cardNumber: "",
    expiry: "",
    cvc: "",
    street: "",
    postcode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const pricePerBook = formData.bookCount >= 2 ? 35 : 40;
  const totalPrice = pricePerBook * formData.bookCount;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setCurrentStep(3);
  };

  const stepClasses = (step: Step) => {
    const base = "w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-all";
    if (step === currentStep) return `${base} bg-primary border-primary text-white shadow-md`;
    if (step < currentStep) return `${base} bg-slate-100 border-primary text-primary cursor-pointer hover:bg-slate-200`;
    return `${base} bg-white border-slate-200 text-slate-400`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[140px] bg-slate-50 border-b border-slate-200 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider uppercase text-accent mb-2">Submit Your</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Book Entry</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 bg-white">
        <div className="max-w-xl mx-auto px-6">
          {/* Wizard Steps */}
          <div className="mb-10">
            <div className="flex items-start justify-between relative">
              {/* Lines */}
              <div className={`absolute top-8 md:top-12 left-[calc(16.67%+32px)] right-[calc(50%+16px)] h-0.5 ${currentStep > 1 ? "bg-primary" : "bg-slate-200"}`} />
              <div className={`absolute top-8 md:top-12 left-[calc(50%+16px)] right-[calc(16.67%+32px)] h-0.5 ${currentStep > 2 ? "bg-primary" : "bg-slate-200"}`} />

              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={stepClasses(1)}
                  onClick={() => currentStep > 1 && setCurrentStep(1)}
                >
                  1
                </div>
                <p className="text-xs md:text-sm text-slate-500 mt-2 text-center">Entry Details</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={stepClasses(2)}
                  onClick={() => currentStep > 2 && setCurrentStep(2)}
                >
                  2
                </div>
                <p className="text-xs md:text-sm text-slate-500 mt-2 text-center">Payment</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1">
                <div className={stepClasses(3)}>3</div>
                <p className="text-xs md:text-sm text-slate-500 mt-2 text-center">Shipping</p>
              </div>
            </div>
          </div>

          {/* Step 1: Entry Details */}
          {currentStep === 1 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Entry Details</h3>
              <p className="text-sm text-slate-500 mb-6">
                Tell us about yourself and how many books you&apos;re entering.
              </p>

              <form className="space-y-4" onSubmit={handleStep1Submit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Number of Books</label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <label key={num} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="bookCount"
                          value={num}
                          checked={formData.bookCount === num}
                          onChange={() => setFormData({ ...formData, bookCount: num })}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-slate-700">
                          {num} {num === 1 ? "book" : "books"} — {num >= 2 ? "£35" : "£40"}/book = £{num * (num >= 2 ? 35 : 40)}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Enter 2+ books to receive our discounted rate of £35/book
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Continue to Payment — £{totalPrice}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-sm text-slate-500 hover:text-primary mb-4 flex items-center gap-1"
              >
                ← Back to Entry Details
              </button>

              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Payment Details</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Total: £{totalPrice} for {formData.bookCount} {formData.bookCount === 1 ? "book" : "books"}
                </p>

                <form className="space-y-4" onSubmit={handleStep2Submit}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="expiry">
                        Expiry Date
                      </label>
                      <input
                        id="expiry"
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        required
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="cvc">
                        Security Code
                      </label>
                      <input
                        id="cvc"
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        required
                        value={formData.cvc}
                        onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="street">
                        Billing Street Address
                      </label>
                      <input
                        id="street"
                        type="text"
                        name="street"
                        placeholder="123 Main Street"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="postcode">
                      Billing Postcode
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      name="postcode"
                      placeholder="CF10 1AA"
                      required
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full max-w-[200px] px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary hover:bg-primary-light disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing && (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Pay £{totalPrice}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Step 3: Shipping Label */}
          {currentStep === 3 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Payment Successful!</h3>
              <p className="text-sm text-slate-500 mb-6">
                Thank you for your entry. Please send your {formData.bookCount === 1 ? "book" : `${formData.bookCount} books`} to the address below.
              </p>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Shipping Address</h4>
                  <p className="text-slate-600 leading-relaxed">
                    <strong>Maya Poetry Book Awards</strong>
                    <br />
                    c/o Dave Lewis
                    <br />
                    123 Poetry Lane
                    <br />
                    Cardiff
                    <br />
                    CF10 1AA
                    <br />
                    United Kingdom
                  </p>
                </div>
                <div className="w-28 h-28 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-500 shrink-0">
                  QR Code
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                Reference: MAYA-{new Date().getFullYear()}-{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-primary hover:bg-primary-light text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
                >
                  Print This Page
                </button>
                <Link
                  href="/"
                  className="border border-slate-200 hover:border-slate-300 text-slate-700 font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
