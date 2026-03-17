"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-md z-[1000] h-16 md:h-20 flex items-center">
      
      {/* Container - Responsive padding */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Logo - Responsive sizing */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 transition-transform duration-300 hover:scale-105"
        >
          <span className="bg-blue-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-xl sm:text-2xl lg:text-3xl font-bold">
            B
          </span>
          <span className="text-slate-800 text-xl sm:text-2xl lg:text-3xl font-bold">
            Billora
          </span>
        </Link>

        {/* Mobile Button - Better click area */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none hover:bg-gray-100 rounded-lg transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>

        {/* Menu - Responsive */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-lg md:shadow-none p-5 md:p-0 z-50`}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 items-start md:items-center">
            
            {/* Navigation Links with Hover Effects */}
            <li className="w-full md:w-auto">
              <Link 
                href="/" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/trymobile" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Try Mobile
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/carrers" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Careers
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/partner" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Partner
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/solution" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Solution
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/about" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/pricing" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
            </li>
            
            <li className="w-full md:w-auto">
              <Link 
                href="/contact" 
                className="block py-2 md:py-0 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 border-b md:border-b-0 border-gray-100 md:border-transparent md:hover:border-blue-600 md:pb-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>

            {/* CTA Buttons with Hover Effects */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Link
                href="/bookdemo"
                className="px-4 sm:px-5 py-2.5 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:from-blue-600 hover:to-purple-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Demo
              </Link>

              <Link
                href="/login"
                className="px-4 sm:px-5 py-2.5 sm:py-2 bg-blue-600 text-white rounded-full text-sm font-semibold text-center hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
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