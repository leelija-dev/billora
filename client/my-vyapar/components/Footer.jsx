"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '../components/Container';
import {
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaArrowRight,
  FaPhoneAlt,
  FaClock,
  FaShieldAlt,
  FaRocket,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import Image from 'next/image';

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on specific pages (same as navbar)
  const shouldHideFooter = () => {
    if (pathname === '/login' || pathname === '/register') return true;
    if (pathname === '/order-success') return true;
    if (pathname.startsWith('/products/')) return true;
    if (pathname === '/products') return true;
    if (pathname === '/forgot-password') return true;
    if (pathname === '/reset-password') return true;
    if (pathname === '/order-history') {
      return true;
    }
    return false;
  };

  if (shouldHideFooter()) return null;

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebookF, url: '#' },
    { name: 'Twitter', icon: FaTwitter, url: '#' },
    { name: 'LinkedIn', icon: FaLinkedinIn, url: '#' },
    { name: 'Instagram', icon: FaInstagram, url: '#' },
    { name: 'YouTube', icon: FaYoutube, url: '#' },
  ];

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Pricing', href: '/pricing' },
       
        { label: 'Solutions', href: '/solution' },
       
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
       
       
        { label: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Support',
      links: [
      
        { label: 'Contact Us', href: '/contact' },
      
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-service' },
        { label: 'Cookie Policy', href: '/cookie-policy' },
        { label: 'GDPR', href: '/gdpr' },

     
       
      ]
    }
  ];

  const contactInfo = {
    phone: [
      { number: "+91 7003150015", label: "Sales & Support" },
      { number: "+91 332 584 9017", label: "Landline" }
    ],
    email: "info@leelija.com",
    address: "Leelija Web Solution Pvt Ltd, Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India",
    hours: "9 AM to 7 PM (Everyday)"
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white pt-16 pb-8 overflow-hidden">
      {/* Static gradient orbs - no animations */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-100px opacity-20 bg-gradient-to-r from-cyan-500 to-purple-500" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-100px opacity-15 bg-gradient-to-r from-sky-400 to-indigo-400" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-120px opacity-10 bg-gradient-to-r from-indigo-500 to-cyan-500" />
      
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <Container size="default">
        <div className="relative z-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
            
            {/* Brand & Contact Info Section */}
            <div className="lg:col-span-5 space-y-6">
              {/* Logo and Description */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[68px] w-[68px] min-h-[68px] min-w-[68px]  overflow-hidden p-1">
                             <Image
                               src="/image/company-logo.png"
                               alt="Logo"
                               width={67}
                               height={67}
                               className="h-full w-full object-contain"
                             />
                           </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {process.env.NEXT_PUBLIC_APP_NAME || 'Billora'}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  Modern GST billing software for Indian businesses. Simplify your invoicing, 
                  stay compliant, and accelerate growth with our all-in-one platform.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-3">
                {/* Phone Numbers */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-400/30">
                    <FaPhoneAlt className="text-blue-400 text-sm" />
                  </div>
                  <div>
                    {contactInfo.phone.map((phone, idx) => (
                      <a 
                        key={idx}
                        href={`tel:${phone.number.replace(/\s/g, '')}`}
                        className="block text-gray-200 font-medium hover:text-blue-400 transition-colors text-sm mb-1"
                      >
                        {phone.number} <span className="text-gray-400 text-xs font-normal">({phone.label})</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-400/30">
                    <MdEmail className="text-purple-400 text-sm" />
                  </div>
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-200 hover:text-purple-400 transition-colors text-sm"
                  >
                    {contactInfo.email}
                  </a>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-400/30">
                    <MdLocationOn className="text-indigo-400 text-sm" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {contactInfo.address}
                  </p>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-400/30">
                    <FaClock className="text-green-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium">Support Hours</p>
                    <p className="text-gray-400 text-sm">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge - Dark theme version */}
              <div className="bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaStar className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Trusted by 1 Crore+ Indian Businesses</p>
                    <p className="text-xs text-gray-400">Join millions of happy customers</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-400 text-xs" />
                    <span>4.8/5 Rating</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    <span>24/7 Support</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaShieldAlt className="text-purple-400 text-xs" />
                    <span>100% Secure</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {footerSections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-bold text-gray-100 mb-4 uppercase tracking-wider">
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link
                            href={link.href}
                            className="text-gray-400 text-sm hover:text-blue-400 transition-colors duration-200 block py-1"
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
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Social Links */}
              <div className="flex gap-3 order-2 md:order-1">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="w-9 h-9 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:-translate-y-1 border border-gray-700"
                    aria-label={social.name}
                  >
                    <social.icon className="text-sm" />
                  </a>
                ))}
              </div>

              {/* Copyright */}
              <div className="text-gray-500 text-xs order-3 md:order-2">
                &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || 'Billora'}. All rights reserved.
              </div>

              {/* CTA Button */}
              <Link
                href="/start-free-trial"
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-200 hover:scale-105 order-1 md:order-3"
              >
                <FaRocket className="text-sm group-hover:rotate-12 transition-transform" />
                <span>Start Free Trial</span>
                <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 pt-4 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <FaShieldAlt className="text-green-400 text-xs" />
              <span>Your data is protected with enterprise-grade security</span>
            </p>
          </div>
        </div>
      </Container>

      {/* Add custom blur utilities */}
      <style jsx>{`
        .blur-100px {
          filter: blur(100px);
        }
        .blur-120px {
          filter: blur(120px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;