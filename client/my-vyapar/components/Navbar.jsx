"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-md z-[1000] h-20 flex items-center">
      
      {/* ✅ Fixed Container (same width everywhere) */}
      <div className="w-full max-w-[1400px] mx-auto px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:scale-105 transition"
        >
          <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-2xl font-bold">
            B
          </span>
          <span className="text-slate-800 text-2xl font-bold">
            Billora
          </span>
        </Link>

        {/* Mobile Button */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`w-6 h-0.5 bg-black ${isMenuOpen && "rotate-45 translate-y-2"}`} />
          <span className={`w-6 h-0.5 bg-black ${isMenuOpen && "opacity-0"}`} />
          <span className={`w-6 h-0.5 bg-black ${isMenuOpen && "-rotate-45 -translate-y-2"}`} />
        </button>

        {/* Menu */}
        <div
          className={`absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent 
          transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <ul className="flex flex-col md:flex-row gap-6 md:items-center p-5 md:p-0">
            
            <li><Link href="/">Home</Link></li>
            <li><Link href="/trymobile">Try Mobile</Link></li>
            <li><Link href="/carrers">Careers</Link></li>
            <li><Link href="/partner">Partner</Link></li>
            <li><Link href="/solution">Solution</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/contact">Contact</Link></li>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              <Link
                href="/bookdemo"
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm"
              >
                Book Demo
              </Link>

              <Link
                href="/login"
                className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm"
              >
                Login
              </Link>
            </div>

          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;