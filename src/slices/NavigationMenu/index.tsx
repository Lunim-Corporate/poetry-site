"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { NavigationMenuSliceData, SliceComponentProps } from "@/types";
import { DEFAULT_YEARS } from "@/types";
import {
  ENTER_MAIN_NAV_EVENT,
  ENTER_MAIN_NAV_STORAGE_KEY,
  ENTER_MAIN_NAV_RULES_EVENT,
  ENTER_MAIN_NAV_RULES_STORAGE_KEY,
} from "@/app/enter/constants";

export default function NavigationMenu({ slice }: SliceComponentProps<NavigationMenuSliceData>) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [rulesStepParam, setRulesStepParam] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const brandName = slice.primary.brand_name || "Maya";
  const navLinks = slice.primary.nav_links || [
    { label: "Enter Your Book", url: "/enter" },
    { label: "Our Judge", url: "/judge" },
  ];
  const pastWinnersYears =
    slice.primary.past_winners_years?.map((y) => y.year) || DEFAULT_YEARS;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isPastWinnersActive = () => pathname.startsWith("/past-winners");
  const isRulesStage = pathname === "/enter" && (!rulesStepParam || rulesStepParam === "1");

  const closeMobileNav = () => {
    setMobileNavOpen(false);
    setMobileDropdownOpen(false);
  };

  /** On the home page, Next.js does not navigate for `href="/"`, so scrolling + hash must be handled here. */
  const goToHomeTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
  };

  /** Main nav "The Rules": always `/enter?step=1` + scroll to stepper (including when already on /enter). */
  const handleRulesNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMobileNav();
    try {
      sessionStorage.setItem(ENTER_MAIN_NAV_RULES_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(ENTER_MAIN_NAV_RULES_EVENT));
    router.replace("/enter?step=1", { scroll: false });
  };

  /** Main nav "Enter Your Book": always step 1 + instant scroll to top (including when already on /enter). */
  const handleEnterBookNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMobileNav();
    try {
      sessionStorage.setItem(ENTER_MAIN_NAV_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent(ENTER_MAIN_NAV_EVENT));
    router.replace("/enter", { scroll: false });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", mobileNavOpen);
  }, [mobileNavOpen]);

  useEffect(() => {
    const syncRulesStep = () => {
      const nextUrl = new URL(window.location.href);
      setRulesStepParam(nextUrl.searchParams.get("step"));
    };

    const handleWizardStepChanged = (event: Event) => {
      setRulesStepParam((event as CustomEvent<string>).detail);
    };

    syncRulesStep();
    window.addEventListener("popstate", syncRulesStep);
    window.addEventListener("enter-wizard-step-changed", handleWizardStepChanged);

    return () => {
      window.removeEventListener("popstate", syncRulesStep);
      window.removeEventListener("enter-wizard-step-changed", handleWizardStepChanged);
    };
  }, []);


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] max-[899px]:h-16 flex items-center border-b bg-gradient-to-r from-[#451E10] via-[#7a3520] to-[#451E10] backdrop-blur-sm">
        <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between gap-8">
          <Link
            href="/"
            onClick={goToHomeTop}
            className="flex items-center gap-3 font-bold text-white hover:text-primary transition-colors"
          >
            <span className="flex items-center justify-center">
              {slice.primary.brand_logo?.url ? (
                <Image
                  src={slice.primary.brand_logo.url}
                  alt=""
                  width={32}
                  height={32}
                  className="md:w-8 md:h-8 w-6 h-6"
                />
              ) : (
                <Image
                  src="/logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="md:w-8 md:h-8 w-6 h-6"
                />
              )}
            </span>
            <span className="text-[#FFE169] md:text-xl text-lg">{brandName}</span>
          </Link>

          {/* Mobile menu button + Contact Us */}
          <div className="max-[899px]:flex hidden items-center gap-4 ml-auto">
            <Link
              href="/#contact-form"
              className="text-base font-medium text-white hover:text-white/80 transition-colors"
            >
              Contact Us
            </Link>
            <button
              className="flex items-center p-1 text-white transition-colors"
              onClick={() => setMobileNavOpen(true)}
            >
              <span className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-white rounded" />
                <span className="w-full h-0.5 bg-white rounded" />
                <span className="w-full h-0.5 bg-white rounded" />
              </span>
            </button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden min-[900px]:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                onClick={link.url === "/enter" ? handleEnterBookNavClick : undefined}
                className={`px-4 py-2 text-base font-medium transition-colors ${
                  isActive(link.url)
                    ? "text-[#FFE169] underline underline-offset-4 decoration-[#FFE169]"
                    : "text-white hover:underline hover:underline-offset-4 hover:decoration-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Past Winners Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center">
                <Link
                  href="/past-winners"
                  className={`px-4 py-2 text-base font-medium transition-colors ${
                    isPastWinnersActive()
                      ? "text-[#FFE169] underline underline-offset-4 decoration-[#FFE169]"
                      : "text-white hover:underline hover:underline-offset-4 hover:decoration-white"
                  }`}
                >
                  Past Winners
                </Link>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-2 py-2 transition-colors border-l border-white/20 ${
                    isPastWinnersActive() ? "text-[#FFE169]" : "text-white"
                  }`}
                >
                  <span
                    className={`inline-block text-2xl leading-none transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
              </div>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 min-w-[180px] p-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
                  {pastWinnersYears.map((year) => (
                    <Link
                      key={year}
                      href={`/past-winners/${year}`}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3 py-2 text-base text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {year} Winners
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/enter?step=1"
              className={`px-4 py-2 text-base font-medium transition-colors ${
                isRulesStage
                  ? "text-[#FFE169] underline underline-offset-4 decoration-[#FFE169]"
                  : "text-white hover:underline hover:underline-offset-4 hover:decoration-white"
              }`}
              onClick={handleRulesNavClick}
            >
              The Rules
            </Link>
            <Link
              href="/#faq"
              className="px-4 py-2 text-base font-medium text-white hover:underline hover:underline-offset-4 hover:decoration-white transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/#contact-form"
              className="px-4 py-2 text-base font-medium text-white hover:underline hover:underline-offset-4 hover:decoration-white transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          {/* Mobile nav */}
          {mobileNavOpen && (
            <>
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                onClick={() => setMobileNavOpen(false)}
              />
              <nav className="fixed top-4 right-4 w-[min(360px,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] p-5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 flex flex-col gap-2 overflow-y-auto">
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 text-base font-semibold border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  Close
                </button>
                <div className="pb-4 border-b border-slate-200 mb-2">
                  <span className="font-bold text-slate-900">Menu</span>
                </div>

                <Link
                  href="/"
                  onClick={(e) => {
                    goToHomeTop(e);
                    setMobileNavOpen(false);
                  }}
                  className={`px-4 py-3 font-medium transition-colors ${
                    isActive("/")
                      ? "text-primary underline underline-offset-4"
                      : "text-slate-600 hover:text-primary hover:underline hover:underline-offset-4"
                  }`}
                >
                  Home
                </Link>

                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    onClick={link.url === "/enter" ? handleEnterBookNavClick : () => setMobileNavOpen(false)}
                    className={`px-4 py-3 font-medium transition-colors ${
                      isActive(link.url)
                        ? "text-primary underline underline-offset-4"
                        : "text-slate-600 hover:text-primary hover:underline hover:underline-offset-4"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      href="/past-winners"
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex-1 px-4 py-3 font-medium transition-colors ${
                        isPastWinnersActive()
                          ? "text-primary underline underline-offset-4"
                          : "text-slate-600 hover:text-primary hover:underline hover:underline-offset-4"
                      }`}
                    >
                      Past Winners
                    </Link>
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className="px-4 py-3 rounded-r-lg border-l border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                      <span
                        className={`inline-block transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </button>
                  </div>
                  {mobileDropdownOpen && (
                    <div className="ml-4 p-2 border border-slate-200 rounded-lg space-y-1">
                      {pastWinnersYears.map((year) => (
                        <Link
                          key={year}
                          href={`/past-winners/${year}`}
                          onClick={() => {
                            setMobileDropdownOpen(false);
                            setMobileNavOpen(false);
                          }}
                          className="block px-3 py-2 text-base text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          {year} Winners
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/enter?step=1"
                  onClick={handleRulesNavClick}
                  className={`px-4 py-3 font-medium transition-colors ${
                    isRulesStage
                      ? "text-primary underline underline-offset-4"
                      : "text-slate-600 hover:text-primary hover:underline hover:underline-offset-4"
                  }`}
                >
                  The Rules
                </Link>
                <Link
                  href="/#faq"
                  onClick={() => setMobileNavOpen(false)}
                  className="px-4 py-3 font-medium text-slate-600 hover:text-primary hover:underline hover:underline-offset-4 transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/#contact-form"
                  onClick={() => setMobileNavOpen(false)}
                  className="px-4 py-3 font-medium text-slate-600 hover:text-primary hover:underline hover:underline-offset-4 transition-colors"
                >
                  Contact Us
                </Link>
              </nav>
            </>
          )}
        </div>
      </header>
    </>
  );
}
