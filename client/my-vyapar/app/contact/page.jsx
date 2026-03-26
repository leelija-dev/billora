"use client";
import Navbar from "@/components/Navbar";  
import Footer from "@/components/Footer" ;
import React, { useState } from "react";
import Link from "next/link";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    loading: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ ...formStatus, loading: true });

    // Simulate API call
    setTimeout(() => {
      console.log("Form Submitted:", formData);
      setFormStatus({ submitted: true, loading: false });
      
      alert("✨ Your message has been submitted successfully! Our team will get back to you within 24 hours.");
      
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: ""
      });

      // Reset submitted status after 3 seconds
      setTimeout(() => {
        setFormStatus({ submitted: false, loading: false });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Navbar />

      {/* Hero Banner - Modern Design */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 sm:py-14 md:py-16 lg:py-16 xl:py-20 2xl:py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-48 sm:w-56 md:w-64 lg:w-64 xl:w-72 2xl:w-96 h-48 sm:h-56 md:h-64 lg:h-64 xl:h-72 2xl:h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 sm:w-80 md:w-96 lg:w-96 xl:w-[450px] 2xl:w-[600px] h-72 sm:h-80 md:h-96 lg:h-96 xl:h-[450px] 2xl:h-[600px] bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 sm:w-40 md:w-48 lg:w-48 xl:w-56 2xl:w-72 h-36 sm:h-40 md:h-48 lg:h-48 xl:h-56 2xl:h-72 bg-white opacity-5 rounded-full animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 2xl:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16">
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in">
                Let's <span className="text-yellow-300">Connect</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl text-blue-100 max-w-2xl">
                We're here to help you 24/7. Reach out to us anytime!
              </p>
              
              {/* Breadcrumb */}
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-blue-200">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>›</span>
                <span className="text-white">Contact Us</span>
              </div>
            </div>
            
            {/* Free Trial Button */}
            <Link href="/start-free-trial">
              <button className="group relative bg-white text-blue-600 hover:text-blue-700 px-6 sm:px-7 md:px-8 lg:px-8 xl:px-9 2xl:px-10 py-3 sm:py-3.5 md:py-4 lg:py-4 xl:py-4.5 2xl:py-5 rounded-xl sm:rounded-2xl font-semibold transition-all hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base md:text-base lg:text-base xl:text-lg 2xl:text-xl">
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  🚀 Start Free Trial
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 2xl:px-12 py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 2xl:py-24">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24">
          
          {/* LEFT SIDE - CONTACT FORM */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-20 sm:w-24 md:w-24 lg:w-24 xl:w-28 2xl:w-32 h-20 sm:h-24 md:h-24 lg:h-24 xl:h-28 2xl:h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-24 sm:w-28 md:w-28 lg:w-28 xl:w-32 2xl:w-40 h-24 sm:h-28 md:h-28 lg:h-28 xl:h-32 2xl:h-40 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>
            
            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-7 lg:p-8 xl:p-8 2xl:p-10 border border-gray-100">
              <div className="mb-6 sm:mb-7 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Send us a Message
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-2">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
                <div className="flex gap-2 mt-3 sm:mt-4">
                  <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <div className="w-3 sm:w-4 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    <span className="group-focus-within:text-blue-600 transition-colors">Full Name *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">👤</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">Phone Number *</label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">📱</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">Email Address *</label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">✉️</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">Subject *</label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base">📝</span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">Your Message *</label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-4 sm:top-5 text-gray-400 text-sm sm:text-base">💬</span>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white resize-none text-sm sm:text-base"
                      placeholder="Tell us more about your query..."
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden text-sm sm:text-base"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {formStatus.loading ? (
                      <>
                        <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : formStatus.submitted ? (
                      <>
                        <span>✓</span>
                        <span>Message Sent!</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                {/* Trust Badge */}
                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <span className="text-green-500 text-xs sm:text-sm">✓</span> Your information is secure with us
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT INFO */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Get In <span className="text-blue-600">Touch</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                Have questions? We'd love to hear from you. Here's how you can reach us.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-4 sm:gap-5 md:gap-6">
              {/* Phone Card */}
              <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-blue-600 font-semibold mb-1">Call Us Anytime</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">704-314-6478</p>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                      9 AM To 7 PM (Everyday)
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
                <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-purple-600 font-semibold mb-1">Email Us</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">help@billora.com</p>
                    <p className="text-xs sm:text-sm text-gray-500">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex gap-3 sm:gap-4 md:gap-5">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-indigo-600 font-semibold mb-1 sm:mb-2">Visit Us</p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">Lelija Technolabs Pvt. Ltd.</p>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                      B-426 Sumel Business Park 7,<br />
                      Near Soni Ni Chali, Barasat,<br />
                      West Bengal - 700121
                    </p>

                    {/* Business Details */}
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full"></span>
                        <span className="font-semibold text-gray-700">GSTIN:</span>
                        <span className="text-gray-600 text-xs sm:text-sm">24AAFCF7281A1ZX</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-600 rounded-full"></span>
                        <span className="font-semibold text-gray-700">CIN:</span>
                        <span className="text-gray-600 text-xs sm:text-sm">U62091GJ2023PTC146763</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-36 sm:h-40 md:h-48 bg-gray-800 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"></div>
                <div className="relative z-10 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">📍</span>
                  </div>
                  <p className="text-white font-semibold text-sm sm:text-base">Find us on Google Maps</p>
                  <button className="mt-2 sm:mt-3 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-white text-gray-900 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Open Map
                  </button>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-0.5 sm:w-1 h-4 sm:h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                    <span className="font-bold">f</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                    <span>📸</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-blue-800 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                    <span className="font-bold">in</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                    <span className="font-bold">X</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg">
                    <span>▶</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-md">
                  ⭐
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">Trusted by 1 Crore+ Indian Businesses</p>
                  <p className="text-xs sm:text-sm text-gray-600">Join millions of happy customers</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1">✓ 4.8/5 Rating</span>
                <span className="flex items-center gap-1">✓ 24/7 Support</span>
                <span className="flex items-center gap-1">✓ 100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}