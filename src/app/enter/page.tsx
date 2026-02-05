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
    // Payment fields
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
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setCurrentStep(3);
  };

  const getStepClass = (step: Step) => {
    if (step === currentStep) return "wizardStep__circle wizardStep__circle--active";
    if (step < currentStep) return "wizardStep__circle wizardStep__circle--visited wizardStep__circle--clickable";
    return "wizardStep__circle";
  };

  const getLineClass = (lineNum: 1 | 2) => {
    if (lineNum === 1 && currentStep > 1) return "wizardSteps__line wizardSteps__line1 wizardSteps__line--complete";
    if (lineNum === 2 && currentStep > 2) return "wizardSteps__line wizardSteps__line2 wizardSteps__line--complete";
    return `wizardSteps__line wizardSteps__line${lineNum}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero hero--small">
        <div className="container">
          <div className="hero__inner">
            <p className="eyebrow">Submit Your</p>
            <h1 className="hero__title">Book Entry</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="after-hero">
        <div className="container">
          {/* Wizard Steps */}
          <div className="wizardSteps">
            <div className="wizardSteps__circles">
              <div className={getLineClass(1)} />
              <div className={getLineClass(2)} />

              <div className="wizardStep">
                <div
                  className={getStepClass(1)}
                  onClick={() => currentStep > 1 && setCurrentStep(1)}
                >
                  1
                </div>
                <p className="wizardStep__label">Entry Details</p>
              </div>

              <div className="wizardStep">
                <div
                  className={getStepClass(2)}
                  onClick={() => currentStep > 2 && setCurrentStep(2)}
                >
                  2
                </div>
                <p className="wizardStep__label">Payment</p>
              </div>

              <div className="wizardStep">
                <div className={getStepClass(3)}>3</div>
                <p className="wizardStep__label">Shipping</p>
              </div>
            </div>
          </div>

          {/* Step 1: Entry Details */}
          {currentStep === 1 && (
            <div className="formContainer">
              <div className="content sketch-card">
                <h3>Entry Details</h3>
                <p className="muted">
                  Tell us about yourself and how many books you&apos;re entering.
                </p>

                <form className="form" onSubmit={handleStep1Submit}>
                  <div className="formRow">
                    <label className="label" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="formRow">
                    <label className="label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="formRow">
                    <label className="label">Number of Books</label>
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <label key={num} className="checkRow">
                          <input
                            type="radio"
                            name="bookCount"
                            value={num}
                            checked={formData.bookCount === num}
                            onChange={() =>
                              setFormData({ ...formData, bookCount: num })
                            }
                          />
                          {num} {num === 1 ? "book" : "books"} —{" "}
                          {num >= 2 ? "£35" : "£40"}/book = £
                          {num * (num >= 2 ? 35 : 40)}
                        </label>
                      ))}
                    </div>
                    <p className="fineprint">
                      Enter 2+ books to receive our discounted rate of £35/book
                    </p>
                  </div>

                  <button type="submit" className="btn btn--full">
                    <span className="btn__label">
                      Continue to Payment — £{totalPrice}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="formContainer">
              <a
                href="#"
                className="wizardSteps__back"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep(1);
                }}
              >
                ← Back to Entry Details
              </a>

              <div className="content sketch-card">
                <h3>Payment Details</h3>
                <p className="muted">
                  Total: £{totalPrice} for {formData.bookCount}{" "}
                  {formData.bookCount === 1 ? "book" : "books"}
                </p>

                <form className="form" onSubmit={handleStep2Submit}>
                  <div className="formRow">
                    <label className="label" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={formData.cardNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, cardNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="formRow formRow--split">
                    <div>
                      <label className="label" htmlFor="expiry">
                        Expiry Date
                      </label>
                      <input
                        id="expiry"
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        required
                        value={formData.expiry}
                        onChange={(e) =>
                          setFormData({ ...formData, expiry: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="cvc">
                        Security Code
                      </label>
                      <input
                        id="cvc"
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        required
                        value={formData.cvc}
                        onChange={(e) =>
                          setFormData({ ...formData, cvc: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="formSpacer" />

                  <div className="formRow">
                    <label className="label" htmlFor="street">
                      Billing Street Address
                    </label>
                    <input
                      id="street"
                      type="text"
                      name="street"
                      placeholder="123 Main Street"
                      required
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                    />
                  </div>

                  <div className="formRow">
                    <label className="label" htmlFor="postcode">
                      Billing Postcode
                    </label>
                    <input
                      id="postcode"
                      type="text"
                      name="postcode"
                      placeholder="CF10 1AA"
                      required
                      className="input--half"
                      value={formData.postcode}
                      onChange={(e) =>
                        setFormData({ ...formData, postcode: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn btn--full ${isProcessing ? "is-loading" : ""}`}
                    disabled={isProcessing}
                  >
                    <span className="btn__spinner" aria-hidden="true"></span>
                    <span className="btn__label">Pay £{totalPrice}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Shipping Label */}
          {currentStep === 3 && (
            <div className="formContainer">
              <div className="content sketch-card">
                <h3>Payment Successful!</h3>
                <p className="muted">
                  Thank you for your entry. Please send your{" "}
                  {formData.bookCount === 1
                    ? "book"
                    : `${formData.bookCount} books`}{" "}
                  to the address below.
                </p>

                <div className="wizardSteps__labelRow">
                  <div className="wizardSteps__labelInfo">
                    <h3>Shipping Address</h3>
                    <p>
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
                  <div className="wizardSteps__qr">
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        background: "var(--paper)",
                        border: "2px dashed var(--stroke-soft)",
                        borderRadius: "var(--radius)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                      }}
                    >
                      QR Code
                    </div>
                  </div>
                </div>

                <p className="fineprint">
                  Reference: MAYA-{new Date().getFullYear()}-
                  {Math.random().toString(36).substring(2, 8).toUpperCase()}
                </p>

                <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => window.print()}
                  >
                    <span className="btn__label">Print This Page</span>
                  </button>
                  <Link href="/" className="btn btn--ghost">
                    <span className="btn__label">Return Home</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
