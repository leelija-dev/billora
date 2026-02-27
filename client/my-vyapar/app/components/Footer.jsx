"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
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
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Press', href: '#press' },
        { label: 'Blog', href: '#blog' }
      ]
    },
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Integrations', href: '#integrations' },
        { label: 'Roadmap', href: '#roadmap' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Documentation', href: '#docs' },
        { label: 'API', href: '#api' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
        { label: 'GDPR', href: '#gdpr' }
      ]
    }
  ];

  return (
    <footer className="bg-[#0f172a] text-white py-16 px-6 max-lg:py-12 max-lg:px-5 max-md:py-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-[1.5fr_2.5fr] gap-16 mb-12 max-lg:grid-cols-1 max-lg:gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-[28px] font-bold text-white mb-4 tracking-tight">
              GSTBilling
            </h3>
            <p className="text-[#94a3b8] leading-[1.6] max-w-[300px] max-lg:max-w-full">
              Modern GST billing software for Indian businesses. Simplify your invoicing and compliance.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-base font-semibold text-white mb-5 uppercase tracking-[0.5px]">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-[#94a3b8] text-sm no-underline transition-colors duration-200 hover:text-white"
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
        <div className="pt-8 border-t border-[#1e293b] flex justify-between items-center flex-wrap gap-4 max-md:flex-col max-md:text-center">
          <div className="text-[#94a3b8] text-sm">
            &copy; 2026 GSTBilling. All rights reserved by ASHMIT.
          </div>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="w-9 h-9 bg-[#1e293b] text-white rounded-full flex items-center justify-center no-underline transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-1"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;