"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type NavigationMenuSlice = {
  slice_type: string;
  variation: string;
  primary: {
    brand_name?: string;
    brand_logo?: any;
    nav_links?: Array<{
      label: string;
      url: string;
    }>;
    past_winners_years?: Array<{
      year: number;
    }>;
  };
};

interface NavigationMenuProps {
  slice: NavigationMenuSlice;
  index: number;
  slices: any[];
  context: any;
}

export default function NavigationMenu({ slice }: NavigationMenuProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const brandName = slice.primary.brand_name || "Maya";
  const navLinks = slice.primary.nav_links || [
    { label: "Enter Your Book", url: "/enter" },
    { label: "Our Judge", url: "/judge" },
  ];
  const pastWinnersYears = slice.primary.past_winners_years?.map(y => y.year) || [2025, 2024, 2023, 2022, 2021, 2020];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isPastWinnersActive = () => {
    return pathname.startsWith("/past-winners");
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
    if (mobileNavOpen) {
      document.body.classList.add("nav-open");
    } else {
      document.body.classList.remove("nav-open");
    }
  }, [mobileNavOpen]);

  return (
    <>
      <header className="site-header" aria-label="Site header">
        <div className="container">
          <Link className="brand" href="/" aria-label={`${brandName} Poetry Book Awards home`}>
            <span className="brand__mark" aria-hidden="true">
              {slice.primary.brand_logo?.url ? (
                <Image
                  className="brand__icon"
                  src={slice.primary.brand_logo.url}
                  alt=""
                  width={25}
                  height={25}
                />
              ) : (
                <Image
                  className="brand__icon"
                  src="/red-raised-fist.png"
                  alt=""
                  width={25}
                  height={25}
                />
              )}
            </span>
            <span className="brand__name">{brandName}</span>
          </Link>

          <button
            className="navToggle"
            type="button"
            aria-controls="site-nav"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
          >
            <span className="navToggle__icon" aria-hidden="true"></span>
            <span className="navToggle__label">Menu</span>
          </button>

          <nav
            id="site-nav"
            className={`nav ${mobileNavOpen ? "is-open" : ""}`}
            aria-label="Primary"
          >
            <div className="nav__top">
              <span className="nav__title">Menu</span>
              <button
                className="navClose"
                type="button"
                onClick={() => setMobileNavOpen(false)}
              >
                Close
              </button>
            </div>

            <Link
              className={`nav__link nav__link--home ${isActive("/") ? "is-active" : ""}`}
              href="/"
              onClick={() => setMobileNavOpen(false)}
            >
              Home
            </Link>

            {navLinks.map((link, index) => (
              <Link
                key={index}
                className={`nav__link ${isActive(link.url) ? "is-active" : ""}`}
                href={link.url}
                onClick={() => setMobileNavOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className={`nav__dropdown ${dropdownOpen ? "is-open" : ""}`} ref={dropdownRef}>
              <div className={`nav__link--surround ${isPastWinnersActive() ? "is-active" : ""}`}>
                <Link href="/past-winners" onClick={() => setMobileNavOpen(false)}>
                  Past Winners
                </Link>
                <button
                  className="nav__dropdownToggle"
                  type="button"
                  aria-label="Toggle past winners years"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="nav__dropdownArrow" aria-hidden="true">
                    ▾
                  </span>
                </button>
              </div>
              <div
                className="nav__dropdownMenu"
                aria-label="Past winners years"
              >
                {pastWinnersYears.map((year) => (
                  <Link
                    key={year}
                    className="nav__sublink"
                    href={`/past-winners/${year}`}
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileNavOpen(false);
                    }}
                  >
                    {year} Winners
                  </Link>
                ))}
              </div>
            </div>

            <Link
              className="nav__link"
              href="/#faq"
              onClick={() => setMobileNavOpen(false)}
            >
              FAQ
            </Link>
            <Link
              className="nav__link"
              href="/#contact"
              onClick={() => setMobileNavOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </header>

      {mobileNavOpen && (
        <div
          className="navOverlay"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
