"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '../components/Container';

const Footer = () => {
  const pathname = usePathname();
  
  // Hide footer on specific pages (same as navbar)
  const shouldHideFooter = () => {
    // Check for exact matches
    if (pathname === '/login' || pathname === '/register') {
      return true;
    }
    
    // Check for order-success page
    if (pathname === '/order-success') {
      return true;
    }
    
    // Check for products page with dynamic ID (e.g., /products/16)
    if (pathname.startsWith('/products/')) {
      return true;
    }
    
    // Also hide on the base products page if needed
    if (pathname === '/products') {
      return true;
    }

      if (pathname === '/forgot-password') {
      return true;
    }
    if (pathname === '/reset-password') {
      return true;
    }
    
    return false;
  };
  
  // Return null to hide footer completely on specified pages
  if (shouldHideFooter()) {
    return null;
  }

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'LinkedIn', icon: 'in', url: '#' },
    { name: 'Facebook', icon: 'f', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' }
  ];

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Integrations', href: '/integrations' },
        { label: 'Roadmap', href: '/roadmap' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Documentation', href: '/docs' },
        { label: 'API', href: '/api' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' }
      ]
    }
  ];

  return (
    <footer className="bg-[#0f172a] text-white py-12 sm:py-16 md:py-12 lg:py-20">
      <Container size="default">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_2.5fr] gap-10 lg:gap-16 md:gap-6 mb-10 lg:mb-12 md:mb-6">
          
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 md:mb-3">
              <span className="bg-blue-600 text-white px-3 py-1.5 rounded text-xl md:text-base lg:text-xl font-bold leading-none">
                B
              </span>
              <span className="text-white text-xl md:text-base lg:text-xl font-bold leading-none">
                {process.env.NEXT_PUBLIC_APP_NAME || 'Billora'}
              </span>
            </div>
            <p className="text-[#94a3b8] text-sm sm:text-base md:text-xs lg:text-base leading-relaxed max-w-[300px] mx-auto lg:mx-0">
              Modern GST billing software for Indian businesses. Simplify your invoicing and compliance.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-3 lg:gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx} className="text-center sm:text-left">
                <h4 className="text-sm sm:text-base md:text-xs lg:text-base font-semibold text-white mb-4 sm:mb-5 md:mb-2 lg:mb-5 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3 md:space-y-1 lg:space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-[#94a3b8] text-xs sm:text-sm md:text-[10px] lg:text-sm no-underline transition-colors duration-200 hover:text-white block py-1 md:py-0.5 lg:py-1"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 md:pt-4 border-t border-[#1e293b] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 md:gap-3">
          <div className="text-[#94a3b8] text-xs sm:text-sm md:text-[10px] lg:text-sm order-2 sm:order-1">
            &copy; 2026 {process.env.NEXT_PUBLIC_APP_NAME || 'Billora'}. All rights reserved.
          </div>
          <div className="flex gap-3 sm:gap-4 md:gap-1.5 lg:gap-4 order-1 sm:order-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="w-10 h-10 sm:w-9 sm:h-9 md:w-6 md:h-6 lg:w-9 lg:h-9 bg-[#1e293b] text-white rounded-full flex items-center justify-center no-underline transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-1 text-base sm:text-sm md:text-[8px] lg:text-sm"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;