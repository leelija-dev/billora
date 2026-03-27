"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Separate states for active indicator and hover preview
  const [activeSliderStyle, setActiveSliderStyle] = useState({
    width: 0,
    transform: "translate3d(0px, 0, 0)",
    opacity: 1,
  });
  const [activeLineStyle, setActiveLineStyle] = useState({
    width: 0,
    transform: "translate3d(0px, 0, 0)",
    opacity: 1,
  });
  
  const [hoverStyle, setHoverStyle] = useState({
    width: 0,
    transform: "translate3d(0px, 0, 0)",
    opacity: 0,
  });

  const navRefs = useRef([]);
  const containerRef = useRef(null);
  const firstLoad = useRef(true);
  const hoverTimeoutRef = useRef(null);

  const pathname = usePathname();

  // Route mapping
  const routeMap = {
    "/": 0,
    "/trymobile": 1,
    "/carrers": 2,
    "/partner": 3,
    "/solution": 4,
    "/about": 5,
    "/pricing": 6,
    "/contact": 7,
  };

  useEffect(() => {
    setActiveTab(routeMap[pathname] ?? 0);
  }, [pathname]);

  // Update active indicator position
  const updateActiveIndicator = () => {
    const current = navRefs.current[activeTab];
    const parent = containerRef.current;

    if (!current || !parent) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = current.getBoundingClientRect();

    const left = rect.left - parentRect.left;
    const width = rect.width;

    const transition = firstLoad.current
      ? "none"
      : "all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)";

    const commonStyle = {
      width: `${width}px`,
      transform: `translate3d(${left}px, 0, 0)`,
      opacity: 1,
      transition,
    };

    setActiveSliderStyle(commonStyle);
    setActiveLineStyle(commonStyle);
  };

  // Handle hover preview
  const handleMouseEnter = (index) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const element = navRefs.current[index];
    const parent = containerRef.current;

    if (!element || !parent) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = element.getBoundingClientRect();

    const left = rect.left - parentRect.left;
    const width = rect.width;

    setHoverStyle({
      width: `${width}px`,
      transform: `translate3d(${left}px, 0, 0)`,
      opacity: 0.5,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    });
  };

  const handleMouseLeave = () => {
    // Delay hiding hover to prevent flickering when moving between items
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }));
    }, 50);
  };

  // Update indicator on active tab change and resize
  useLayoutEffect(() => {
    updateActiveIndicator();
    firstLoad.current = false;
  }, [activeTab]);

  // Handle window resize and font loading
  useEffect(() => {
    const handleResize = () => {
      updateActiveIndicator();
    };

    // Use ResizeObserver for dynamic content changes
    const resizeObserver = new ResizeObserver(() => {
      updateActiveIndicator();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);
    
    // Handle font loading
    if (document.fonts) {
      document.fonts.ready.then(() => {
        updateActiveIndicator();
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Try Mobile", href: "/trymobile" },
    { name: "Carrers", href: "/carrers" },
    { name: "Partner", href: "/partner" },
    { name: "Solution", href: "/solution" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 bg-white z-[1000] h-20 flex items-center px-6 transition-all duration-300 ${
        scrolled ? "shadow-lg border-b border-gray-100" : "shadow-sm"
      }`}
    >
      <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center">
        {/* Logo with hover effect */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
        >
          <span className="bg-blue-600 text-white px-2 py-1 rounded text-2xl font-bold transition-transform group-hover:scale-105">
            B
          </span>
          <span className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
            Billora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div 
            ref={containerRef} 
            className="relative flex items-center"
            onMouseLeave={handleMouseLeave}
          >
            {/* Hover Preview Slider - Semi-transparent */}
            <div
              className="absolute top-2 h-[36px] bg-blue-100 rounded-md pointer-events-none"
              style={{
                ...hoverStyle,
                opacity: hoverStyle.opacity,
                transition: hoverStyle.transition || "all 0.25s ease",
              }}
            />

            {/* Active Background Slider */}
            <div
              className="absolute top-2 h-[36px] bg-blue-100 rounded-md pointer-events-none"
              style={activeSliderStyle}
            />

            {/* Active Bottom Line Indicator */}
            <div
              className="absolute bottom-0 h-[3px] bg-blue-600 rounded-full pointer-events-none shadow-sm"
              style={{
                ...activeLineStyle,
                boxShadow: "0 0 6px rgba(59,130,246,0.4)",
              }}
            />

            {/* Navigation Links */}
            <ul className="flex relative z-10">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  ref={(el) => (navRefs.current[index] = el)}
                  className="px-4"
                >
                  <Link
                    href={item.href}
                    onClick={() => setActiveTab(index)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    className={`block py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === index
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-blue-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Login Button with hover animation */}
          <Link
            href="/login"
            className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:scale-105 active:scale-95"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button - Placeholder for future mobile implementation */}
        <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;