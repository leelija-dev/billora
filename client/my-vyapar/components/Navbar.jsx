"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isNavAction, setIsNavAction] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  const isHovering = useRef(false);
  const updateTimeoutRef = useRef(null);
  const activeTabRef = useRef(0);
  const animationFrameRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const pathname = usePathname();

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

  const isNavPage = (path) => {
    return routeMap.hasOwnProperty(path?.replace(/\/$/, ""));
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const updateActiveIndicator = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      const current = navRefs.current[activeTabRef.current];
      const parent = containerRef.current;

      if (!current || !parent || activeTabRef.current === -1) return;

      const parentRect = parent.getBoundingClientRect();
      const rect = current.getBoundingClientRect();

      const left = rect.left - parentRect.left;
      const width = rect.width;

      const snapEasing = "cubic-bezier(0.2, 0.9, 0.4, 1.1)";
      const transition = firstLoad.current ? "none" : `all 0.45s ${snapEasing}`;

      const commonStyle = {
        width: `${width}px`,
        transform: `translate3d(${left}px, 0, 0)`,
        opacity: 1,
        transition,
      };

      setActiveSliderStyle(commonStyle);
      setActiveLineStyle(commonStyle);
    });
  };

  const handleMouseEnter = (index) => {
    if (!isNavAction || index === activeTabRef.current) {
      return;
    }
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    isHovering.current = true;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
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
        opacity: 0.3,
        transition: "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
      });
    });
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHovering.current) {
        setHoverStyle((prev) => ({
          ...prev,
          opacity: 0,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        }));
      }
    }, 30);
  };

  const handleNavClick = (index) => {
    activeTabRef.current = index;
    setActiveTab(index);
    setIsNavAction(true);
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHoverStyle({
      ...hoverStyle,
      opacity: 0,
    });
    
    setTimeout(() => {
      updateActiveIndicator();
    }, 0);
  };

  const handleExternalClick = () => {
    setIsNavAction(false);
    setActiveTab(-1);
    activeTabRef.current = -1;
    
    setActiveSliderStyle(prev => ({ 
      ...prev, 
      opacity: 0,
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    }));
    setActiveLineStyle(prev => ({ 
      ...prev, 
      opacity: 0,
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
    }));
    
    setHoverStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  useEffect(() => {
    const cleanPath = pathname?.replace(/\/$/, "");
    const isNav = isNavPage(cleanPath);
    
    setIsNavAction(isNav);
    
    if (isNav) {
      const newActiveTab = routeMap[cleanPath] ?? 0;
      activeTabRef.current = newActiveTab;
      setActiveTab(newActiveTab);
      
      setActiveSliderStyle(prev => ({ ...prev, opacity: 1 }));
      setActiveLineStyle(prev => ({ ...prev, opacity: 1 }));
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        updateActiveIndicator();
      }, 10);
    } else {
      activeTabRef.current = -1;
      setActiveTab(-1);
      
      setActiveSliderStyle(prev => ({ ...prev, opacity: 0 }));
      setActiveLineStyle(prev => ({ ...prev, opacity: 0 }));
    }
    
    setHoverStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
    
  }, [pathname]);

  useLayoutEffect(() => {
    if (isNavAction && activeTab !== -1) {
      if (firstLoad.current) {
        const timeout = setTimeout(() => {
          updateActiveIndicator();
          firstLoad.current = false;
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        updateActiveIndicator();
      }
    }
  }, [activeTab, isNavAction]);

  useEffect(() => {
    let resizeTimeout;
    
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isNavAction && activeTab !== -1) {
          updateActiveIndicator();
        }
      }, 50);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (isNavAction && activeTab !== -1) {
        updateActiveIndicator();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);
    
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setTimeout(() => {
          if (isNavAction && activeTab !== -1) {
            updateActiveIndicator();
          }
        }, 30);
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isNavAction, activeTab]);

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
    <>
      <nav
        className={`sticky top-0 bg-white z-[1000] h-16 md:h-20 flex items-center px-4 sm:px-6 transition-all duration-300 ${
          scrolled ? "shadow-lg border-b border-gray-100" : "shadow-sm"
        }`}
      >
        <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
            onClick={() => handleNavClick(0)}
          >
            <span className="bg-blue-600 text-white px-1.5 sm:px-2 py-1 rounded text-xl sm:text-2xl font-bold transition-all duration-200 group-hover:scale-105 group-hover:shadow-md">
              B
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-all duration-200">
              Billora
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <div 
              ref={containerRef} 
              className="relative flex items-center"
              onMouseLeave={handleMouseLeave}
            >
              {/* Hover Preview */}
              <div
                className="absolute top-2 h-[36px] bg-blue-100/40 rounded-md pointer-events-none will-change-transform"
                style={{
                  ...hoverStyle,
                  opacity: hoverStyle.opacity,
                  transition: hoverStyle.transition || "all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                }}
              />

              {/* Active Background */}
              <div
                className="absolute top-2 h-[36px] bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-md pointer-events-none will-change-transform"
                style={{
                  ...activeSliderStyle,
                  transition: activeSliderStyle.transition || "all 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                }}
              />

              {/* Active Bottom Line */}
              <div
                className="absolute bottom-0 h-[2.5px] bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full pointer-events-none will-change-transform"
                style={{
                  ...activeLineStyle,
                  boxShadow: "0 0 6px rgba(59,130,246,0.5)",
                  transition: activeLineStyle.transition || "all 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
                  backgroundSize: "200% 100%",
                }}
              />

              <ul className="flex relative z-10">
                {navItems.map((item, index) => (
                  <li
                    key={index}
                    ref={(el) => (navRefs.current[index] = el)}
                    className="px-3 xl:px-4"
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(index)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      className={`block py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isNavAction && activeTab === index
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
            
            <Link
              href="/bookdemo"
              onClick={handleExternalClick}
              className="px-4 sm:px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold transition-all duration-200 hover:from-indigo-600 hover:to-purple-600 hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Book Free Demo
            </Link>

            <Link
              href="/login"
              onClick={handleExternalClick}
              className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-all duration-200 z-20 relative"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Backdrop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[999] lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu - Slide from Right */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[320px] sm:max-w-[380px] bg-white shadow-2xl z-[1000] lg:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link 
              href="/" 
              className="flex items-center gap-2"
              onClick={() => {
                handleNavClick(0);
                setIsMobileMenuOpen(false);
              }}
            >
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xl font-bold">
                B
              </span>
              <span className="text-xl font-bold text-slate-800">
                Billora
              </span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => {
                  handleNavClick(index);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-6 py-4 text-base font-medium transition-all duration-200 ${
                  isNavAction && activeTab === index
                    ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                    : "text-slate-600 hover:text-blue-500 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="p-6 border-t border-gray-100 space-y-3">
            <Link
              href="/bookdemo"
              onClick={() => {
                handleExternalClick();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:from-indigo-600 hover:to-purple-600 active:scale-95"
            >
              Book Free Demo
            </Link>
            <Link
              href="/login"
              onClick={() => {
                handleExternalClick();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-center px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-blue-700 active:scale-95"
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