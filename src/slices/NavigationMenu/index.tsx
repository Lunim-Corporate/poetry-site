"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { NavigationMenuSliceData, SliceComponentProps } from "@/types";
import { DEFAULT_YEARS } from "@/types";

export default function NavigationMenu({ slice }: SliceComponentProps<NavigationMenuSliceData>) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] max-[899px]:h-16 flex items-center border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-slate-900 hover:text-primary transition-colors"
          >
            <span className="w-10 h-10 flex items-center justify-center bg-primary rounded-lg shadow-sm">
              {slice.primary.brand_logo?.url ? (
                <Image
                  src={slice.primary.brand_logo.url}
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              ) : (
                <Image
                  src="/red-raised-fist.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              )}
            </span>
            <span>{brandName}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="max-[899px]:flex hidden items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:border-slate-300 transition-colors ml-auto"
            onClick={() => setMobileNavOpen(true)}
          >
            <span className="w-4 h-3 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-current rounded" />
              <span className="w-full h-0.5 bg-current rounded" />
              <span className="w-full h-0.5 bg-current rounded" />
            </span>
            Menu
          </button>

          {/* Desktop nav */}
          <nav className="hidden min-[900px]:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.url)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                  className={`px-4 py-2 rounded-l-lg text-sm font-medium transition-colors ${
                    isPastWinnersActive()
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  Past Winners
                </Link>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`px-2 py-2 rounded-r-lg text-sm transition-colors border-l border-slate-200 ${
                    isPastWinnersActive()
                      ? "bg-primary/10 text-primary"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`inline-block transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
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
                      className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {year} Winners
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#faq"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/#contact"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Contact
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
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-2">
                  <span className="font-bold text-slate-900">Menu</span>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="px-3 py-1.5 text-sm font-semibold border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    Close
                  </button>
                </div>

                <Link
                  href="/"
                  onClick={() => setMobileNavOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive("/")
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Home
                </Link>

                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    onClick={() => setMobileNavOpen(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(link.url)
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100"
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
                      className={`flex-1 px-4 py-3 rounded-l-lg font-medium transition-colors ${
                        isPastWinnersActive()
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Past Winners
                    </Link>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="px-4 py-3 rounded-r-lg border-l border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                      <span
                        className={`inline-block transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </button>
                  </div>
                  {dropdownOpen && (
                    <div className="ml-4 p-2 border border-slate-200 rounded-lg space-y-1">
                      {pastWinnersYears.map((year) => (
                        <Link
                          key={year}
                          href={`/past-winners/${year}`}
                          onClick={() => {
                            setDropdownOpen(false);
                            setMobileNavOpen(false);
                          }}
                          className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          {year} Winners
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/#faq"
                  onClick={() => setMobileNavOpen(false)}
                  className="px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setMobileNavOpen(false)}
                  className="px-4 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </>
          )}
        </div>
      </header>
    </>
  );
}
