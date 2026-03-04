"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleLinkClick = (section) => {
    if (typeof window !== "undefined") {
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-white shadow-md z-[1000] h-20 flex items-center px-5 lg:px-10">
      <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center h-full">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-105"
          onClick={handleLogoClick}
        >
          <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-2xl lg:text-3xl font-bold leading-none">
            V
          </span>
          <span className="text-slate-800 text-2xl lg:text-3xl font-bold leading-none">
            Vyapar
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="flex lg:hidden flex-col gap-1.5 p-2 z-[1001] focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`w-6 h-0.5 bg-slate-800 transition-all ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-slate-800 transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-slate-800 transition-all ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Navigation Menu */}
        <div
          className={`fixed lg:static top-20 left-0 right-0 bg-white lg:bg-transparent
          flex flex-col lg:flex-row items-stretch lg:items-center gap-5 lg:gap-8
          px-5 py-5 lg:p-0 transition-all duration-300 shadow-lg lg:shadow-none
          ${isMenuOpen
              ? "max-h-[600px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible lg:max-h-none lg:opacity-100 lg:visible"
            }`}
        >
          {/* try-mobile-app Link */}

              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/try-mobile-app"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Try Mobile App
                </Link>
              </li>
          <ul className="flex flex-col lg:flex-row list-none gap-0 lg:gap-5 m-0 p-0 items-start lg:items-center">
            {["try-mobile-app",  "desktop", "careers"].map(
              (item) => (
                <li key={item} className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                  <button
                    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                    onClick={() => handleLinkClick(item)}
                  >
                    {item.replace(/-/g, " ")}
                  </button>
                </li>
              )
            )}
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              <Link
                href="/partner"
                className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Partner
              </Link>
            </li>

            {/* About Us Link */}
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              <Link
                href="/solution"
                className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Solution
              </Link>
            </li>

            {/* About Us Link */}
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              <Link
                href="/about"
                className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </li>

          
            {/* Dektop Link */}
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              <Link
                href="/desktop"
                className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Desktop
              </Link>
            </li>

            

            {/* Carrers Link */}
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              <Link
                href="/carrers"
                className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 capitalize whitespace-nowrap w-full text-left"
                onClick={() => setIsMenuOpen(false)}
              >
                Careers
              </Link>
            </li>

            {/* Pricing Link */}
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
              <button
                onClick={() => {
                  router.push("/pricing");
                  setIsMenuOpen(false);
                }}
                className="block py-4 lg:py-0 text-slate-500 font-medium text-sm hover:text-blue-600 w-full text-left"
              >
                Pricing
              </button>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row items-center gap-4 mt-5 lg:mt-0">
            <button
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(59,130,246,0.3)] whitespace-nowrap"
              onClick={() => handleLinkClick("gst-calculator")}
            >
              🧮 GST Calculator
            </button>

            <button
              className="w-full lg:w-auto px-6 h-10 bg-blue-600 text-white rounded-full font-semibold text-sm transition-all hover:bg-blue-700 hover:-translate-y-0.5"
              onClick={() => {
                router.push("/login");
                setIsMenuOpen(false);
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;