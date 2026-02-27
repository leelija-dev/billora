"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.hash = '';
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleLinkClick = (section) => {
    window.location.hash = section;
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const handleCalculatorClick = () => {
    window.location.hash = 'gst-calculator';
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { href: '#try-mobile-app', label: 'Try mobile app', route: '/try-mobile-app' },
    { href: '#solution', label: 'Solution', route: '/solution' },
    { href: '#pricing', label: 'Pricing', route: '/pricing' },
    { href: '#about-us', label: 'About Us', route: '/about-us' },
    { href: '#desktop', label: 'Desktop', route: '/desktop' },
    { href: '#partner', label: 'Partner with us', route: '/partner' },
    { href: '#careers', label: 'Careers', route: '/careers' },
  ];

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.05)] z-50 h-20 flex items-center border-b border-[rgba(67,97,238,0.1)]">
      <div className="max-w-[1400px] w-full mx-auto px-10 xl:px-8 lg:px-6 md:px-5 flex justify-between items-center h-full">
        {/* Logo */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          className="no-underline flex items-center h-full transition-all duration-300 hover:scale-105 relative group"
        >
          <div className="flex items-center gap-2.5 cursor-pointer relative">
            <span className="bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] text-white px-3 py-2 rounded-xl text-2xl font-bold inline-block leading-none shadow-[0_4px_10px_rgba(67,97,238,0.3)] transition-all duration-300 group-hover:rotate-3 group-hover:scale-105 group-hover:shadow-[0_6px_15px_rgba(67,97,238,0.4)]">
              V
            </span>
            <span className="text-[#1e293b] text-2xl font-bold leading-none bg-gradient-to-r from-[#1e293b] to-[#4361ee] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#4361ee] group-hover:to-[#8b5cf6]">
              Vyapar
            </span>
          </div>
        </a>

        {/* Mobile Toggle Button */}
        <button 
          className={`hidden max-md:flex flex-col gap-1.5 bg-none border-none cursor-pointer p-2 z-[1001] relative group ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] transition-all duration-300 rounded-sm group-hover:first:translate-y-[-2px] group-hover:last:translate-y-[2px] ${
            isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] transition-all duration-300 rounded-sm ${
            isMenuOpen ? 'opacity-0 translate-x-[-10px]' : ''
          }`}></span>
          <span className={`w-6 h-0.5 bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] transition-all duration-300 rounded-sm ${
            isMenuOpen ? '-rotate-45 translate-y-[-6px]' : ''
          }`}></span>
        </button>

        {/* Menu */}
        <div className={`flex items-center gap-8 h-full max-md:fixed max-md:top-20 max-md:left-0 max-md:right-0 max-md:bg-white/98 max-md:backdrop-blur-md max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:p-0 max-md:h-auto max-md:overflow-hidden max-md:transition-all max-md:duration-400 max-md:ease-[cubic-bezier(0.4,0,0.2,1)] max-md:shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-md:border-b max-md:border-[rgba(67,97,238,0.1)] ${
          isMenuOpen 
            ? 'max-md:max-h-[600px] max-md:opacity-100 max-md:visible max-md:py-5 max-md:px-8' 
            : 'max-md:max-h-0 max-md:opacity-0 max-md:invisible'
        }`}>
          {/* Navigation Links */}
          <ul className="flex list-none gap-2.5 m-0 p-0 h-full items-center max-md:flex-col max-md:items-stretch max-md:gap-1 max-md:w-full max-md:h-auto">
            {navLinks.map((link, index) => (
              <li 
                key={index}
                className="h-full flex items-center relative max-md:w-full max-md:h-auto max-md:opacity-0 max-md:translate-y-5 max-md:transition-all max-md:duration-300"
                style={{
                  transitionDelay: isMenuOpen ? `${0.1 + index * 0.1}s` : '0s'
                }}
              >
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(link.route);
                  }}
                  className="relative px-4 py-2.5 text-gray-700 no-underline font-medium text-sm transition-colors duration-300 hover:text-[#4361ee] cursor-pointer whitespace-nowrap flex items-center h-full tracking-wide max-md:w-full max-md:text-base max-md:px-5 max-md:py-3.5 max-md:rounded-lg max-md:justify-start max-md:hover:bg-gradient-to-r max-md:hover:from-[rgba(67,97,238,0.05)] max-md:hover:to-[rgba(139,92,246,0.05)] max-md:hover:translate-x-1 group/link"
                >
                  {link.label}
                  {/* Double underline effect */}
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#4361ee] transition-all duration-300 ease-out group-hover/link:w-[30px] max-md:bottom-2.5"></span>
                  <span className="absolute bottom-5 right-1/2 translate-x-1/2 w-0 h-0.5 bg-[#4361ee] transition-all duration-300 ease-out delay-100 group-hover/link:w-[30px] max-md:bottom-2.5"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Group */}
          <div className={`flex items-center gap-4 h-full max-md:flex-col max-md:w-full max-md:h-auto max-md:mt-5 max-md:gap-2.5 max-md:opacity-0 max-md:translate-y-5 max-md:transition-all max-md:duration-300 max-md:delay-700 ${
            isMenuOpen ? 'max-md:opacity-100 max-md:translate-y-0' : ''
          }`}>
            {/* GST Calculator Button */}
            <button 
              onClick={handleCalculatorClick}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] text-white border-none rounded-full font-semibold text-sm cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap h-[42px] relative overflow-hidden shadow-[0_4px_15px_rgba(67,97,238,0.3)] tracking-wide hover:translate-y-[-3px] hover:scale-105 hover:shadow-[0_8px_25px_rgba(67,97,238,0.4)] active:translate-y-[-1px] active:scale-98 group/calculator max-md:w-full max-md:justify-center max-md:h-12"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover/calculator:left-full"></span>
              <span className="text-base transition-transform duration-300 group-hover/calculator:rotate-10 group-hover/calculator:scale-110">🧮</span>
              GST Calculator
            </button>

            {/* Login Button */}
            <button 
              onClick={() => router.push('/login')}
              className="px-7 py-2 bg-transparent text-[#4361ee] border-2 border-[#4361ee] rounded-full font-semibold text-sm cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] whitespace-nowrap h-[42px] flex items-center justify-center relative overflow-hidden z-10 tracking-wide hover:text-white hover:border-transparent hover:translate-y-[-3px] hover:scale-105 hover:shadow-[0_8px_20px_rgba(67,97,238,0.3)] active:translate-y-[-1px] active:scale-98 group/login max-md:w-full max-md:justify-center max-md:h-12"
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 bg-gradient-to-r from-[#4361ee] to-[#8b5cf6] rounded-full transition-all duration-500 group-hover/login:w-[300%] group-hover/login:h-[300%] -z-10"></span>
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;