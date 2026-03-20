"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // (unused but kept as you said don't remove anything)
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effect for better UX
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <nav className={`sticky top-0 bg-white z-[1000] h-20 flex items-center px-4 md:px-6 lg:px-8 xl:px-10 transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center h-full">

          {/* Logo - Responsive sizing */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 transition-transform hover:scale-105 flex-shrink-0"
            onClick={handleLogoClick}
          >
            <span className="bg-blue-600 text-white px-2 sm:px-2.5 py-1 rounded text-xl sm:text-2xl lg:text-3xl font-bold leading-none">
              B
            </span>
            <span className="text-slate-800 text-xl sm:text-2xl lg:text-3xl font-bold leading-none">
              Billora
            </span>
          </Link>

          {/* Mobile Toggle Button - Only visible on mobile/tablet */}
          <button
            className="flex lg:hidden flex-col gap-1.5 p-2 z-[1001] focus:outline-none focus:ring-2 focus:ring-blue-600 rounded hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <span className="w-6 h-0.5 bg-slate-800 transition-all" />
            <span className="w-6 h-0.5 bg-slate-800 transition-all" />
            <span className="w-6 h-0.5 bg-slate-800 transition-all" />
          </button>

          {/* DESKTOP MENU - Hidden on mobile/tablet, visible on lg and up */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4 xl:gap-8">
            {/* Navigation Links - Responsive spacing for different large screens */}
            <ul className="flex flex-row list-none gap-2 xl:gap-5 m-0 p-0 items-center">
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Home
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/trymobile"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Try Mobile App
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/carrers"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Carrers
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/partner"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Partner
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/solution"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Solution
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/about"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  About Us
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/pricing"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Pricing
                </Link>
              </li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
                <Link
                  href="/contact"
                  className="block py-4 lg:py-0 text-slate-500 font-medium text-xs xl:text-sm transition-colors 
                  hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
                  capitalize whitespace-nowrap w-full text-left px-2 xl:px-0"
                >
                  Contact Us
                </Link>
              </li>
            </ul>

            {/* CTA Buttons - Responsive for different screen sizes */}
            <div className="flex items-center gap-2 xl:gap-4 flex-shrink-0">
              <Link
                href="/bookdemo"
                className="px-3 xl:px-4 h-9 xl:h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-semibold text-xs xl:text-sm flex items-center justify-center whitespace-nowrap hover:shadow-lg transition-all"
              >
                Book free demo
              </Link>

              <Link
                href="/login"
                className="px-4 xl:px-6 h-9 xl:h-10 bg-blue-600 text-white rounded-full font-semibold text-xs xl:text-sm flex items-center justify-center whitespace-nowrap hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* OVERLAY - For mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (MOBILE/TABLET) - Optimized for all mobile sizes */}
      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-white z-[1000] shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-600">Menu</h2>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* MENU ITEMS - Scrollable if needed */}
        <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 text-sm sm:text-base font-medium overflow-y-auto max-h-[calc(100vh-80px)]">
          
          <Link 
            href="/" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Home
          </Link>
          
          <Link 
            href="/trymobile" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Try Mobile App
          </Link>
          
          <Link 
            href="/carrers" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Carrers
          </Link>
          
          <Link 
            href="/partner" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Partner
          </Link>
          
          <Link 
            href="/solution" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Solution
          </Link>
          
          <Link 
            href="/about" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            About Us
          </Link>
          
          <Link 
            href="/pricing" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Pricing
          </Link>
          
          <Link 
            href="/contact" 
            onClick={() => setIsMenuOpen(false)}
            className="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Contact Us
          </Link>

          {/* CTA Buttons in Mobile Menu */}
          <div className="mt-4 space-y-3">
            <Link
              href="/bookdemo"
              className="w-full px-4 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white 
              rounded-full text-sm font-semibold flex items-center justify-center 
              backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Book free demo
            </Link>

            <Link
              href="/login"
              className="w-full px-4 h-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white 
              rounded-full text-sm font-semibold flex items-center justify-center 
              backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
              onClick={() => setIsMenuOpen(false)} 
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;