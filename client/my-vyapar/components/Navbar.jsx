"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // (unused but kept as you said don't remove anything)
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
    <>
      <nav className="sticky top-0 bg-white shadow-md z-[1000] h-20 flex items-center px-5 lg:px-10">
        <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center h-full">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-105"
            onClick={handleLogoClick}
          >
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-2xl lg:text-3xl font-bold leading-none">
              B
            </span>
            <span className="text-slate-800 text-2xl lg:text-3xl font-bold leading-none">
              Billora
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="flex lg:hidden flex-col gap-1.5 p-2 z-[1001] focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <span className="w-6 h-0.5 bg-slate-800" />
            <span className="w-6 h-0.5 bg-slate-800" />
            <span className="w-6 h-0.5 bg-slate-800" />
          </button>

          {/* DESKTOP MENU ONLY */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex flex-row list-none gap-5 m-0 p-0 items-center">
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Home
  </Link>
</li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/trymobile"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Try Mobile App
  </Link>
</li>
             <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/carrers"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Carrers
  </Link>
</li>
             <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/partner"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Partner
  </Link>
</li>
             <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/solution"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Solution
  </Link>
</li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/about"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    About Us
  </Link>
</li>
              <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/pricing"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Pricing
  </Link>
</li>
            <li className="w-full lg:w-auto border-b lg:border-none border-slate-100">
  <Link
    href="/contact"
    className="block py-4 lg:py-0 text-slate-500 font-medium text-sm transition-colors 
    hover:text-blue-600 lg:border-b-2 lg:border-transparent lg:hover:border-blue-600 
    capitalize whitespace-nowrap w-full text-left"
  >
    Contact Us
  </Link>
</li>
            </ul>

            <div className="flex items-center gap-4">
              <Link
                href="/bookdemo"
                className="px-4 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-semibold text-sm flex items-center justify-center"
              >
                Book free demo
              </Link>

              <Link
                href="/login"
                className="px-6 h-10 bg-blue-600 text-white rounded-full font-semibold text-sm flex items-center justify-center"
              >
                Login
              </Link>
              
            </div>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[999]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (MOBILE) */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[1000] shadow-xl transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>✕</button>
        </div>

        {/* MENU ITEMS */}
        <div className="flex flex-col gap-4 p-5 text-sm font-medium">
          
          <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/trymobile" onClick={() => setIsMenuOpen(false)}>Try Mobile App</Link>
          <Link href="/carrers" onClick={() => setIsMenuOpen(false)}>Carrers</Link>
          <Link href="/partner" onClick={() => setIsMenuOpen(false)}>Partner</Link>
          <Link href="/solution" onClick={() => setIsMenuOpen(false)}>Solution</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>

          {/* CTA */}
          <Link
  href="/bookdemo"
  className="mt-4 px-4 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white 
  rounded-full text-sm font-semibold flex items-center justify-center 
  backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
  onClick={() => setIsMenuOpen(false)}
>
  Book free demo
</Link>

<Link
  href="/login"
  className="px-4 h-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white 
  rounded-full text-sm font-semibold flex items-center justify-center 
  backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
  onClick={() => setIsMenuOpen(false)} 
>
  Login
</Link>

        </div>
      </div>
    </>
  );
};

export default Navbar;