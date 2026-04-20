"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";  // Only one import of Link
import { useRouter } from "next/navigation";
// hei

const Nav2 = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogoClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

 const goToCart = () => {
  router.push('/products/cart');
  setIsMenuOpen(false);
};

  return (
    <nav className="sticky top-0 bg-white shadow-md z-[1000] h-20 flex items-center px-5 lg:px-10">
      <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center h-full">

        {/* Left Section - Logo and Cart */}
        <div className="flex items-center gap-4">
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
              {process.env.NEXT_PUBLIC_APP_NAME || 'Billora'}
            </span>
          </Link>

          
        </div>

        {/* Desktop Navigation - Right Side */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Navigation Links */}
          <Link
            href="/products"
            className="text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1"
          >
            Contact Us
          </Link>
           <Link
            href="/order"
            className="text-slate-500 font-medium text-sm transition-colors hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 pb-1"
          >
            Orders
          </Link>

          {/* CTA Buttons */}
          {/* Cart Button - Desktop */}
          {/* <button
            onClick={goToCart}
            className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
          >
            <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button> */}

          <Link
            href="/login"
            className="px-6 h-10 bg-blue-600 text-white rounded-full font-semibold text-sm transition-all hover:bg-blue-700 hover:-translate-y-0.5 flex items-center justify-center"
          >
            Login
          </Link>

          
        </div>

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

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed lg:hidden top-20 left-0 right-0 bg-white
          flex flex-col items-stretch gap-5
          px-5 py-5 transition-all duration-300 shadow-lg
          ${isMenuOpen
              ? "max-h-[600px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible overflow-hidden"
            }`}
        >
          {/* Cart Button for Mobile */}
        <button
  onClick={goToCart}
  className="flex items-center justify-between py-3 border-b border-slate-100"
>
  <span className="text-slate-500 font-medium text-sm">Cart</span>

  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-gray-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>

    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {cartCount}
      </span>
    )}
  </div>
</button>

          {/* Mobile Navigation Links */}
          <Link
            href="/products"
            className="block py-3 text-slate-500 font-medium text-sm border-b border-slate-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            href="/about"
            className="block py-3 text-slate-500 font-medium text-sm border-b border-slate-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="block py-3 text-slate-500 font-medium text-sm border-b border-slate-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
            <Link
            href="/order"
            className="block py-3 text-slate-500 font-medium text-sm border-b border-slate-100 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            orders
          </Link>

          {/* Mobile CTA Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {/* <Link
              href="/bookdemo"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5"
              onClick={() => setIsMenuOpen(false)}
            >
              Book free demo
            </Link> */}
            <Link
              href="/login"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-semibold text-sm transition-all hover:bg-blue-700 flex items-center justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav2;