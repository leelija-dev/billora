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
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white opacity-5 rounded-full animate-ping"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Let's <span className="text-yellow-300">Connect</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                We're here to help you 24/7. Reach out to us anytime!
              </p>
              
              {/* Breadcrumb */}
              <div className="flex items-center justify-center md:justify-start gap-2 mt-6 text-sm text-blue-200">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>›</span>
                <span className="text-white">Contact Us</span>
              </div>
            </div>
            
            {/* Free Trial Button */}
            <Link href="/start-free-trial">
              <button className="group relative bg-white text-blue-600 hover:text-blue-700 px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Start Free Trial
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT SIDE - CONTACT FORM */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mt-2">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
                <div className="flex gap-2 mt-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <div className="w-4 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                    <span className="group-focus-within:text-blue-600 transition-colors">Full Name *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Phone Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Email Address *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Subject *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📝</span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Your Message *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-5 text-gray-400">💬</span>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full border border-gray-200 pl-11 pr-4 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all bg-gray-50 focus:bg-white resize-none"
                      placeholder="Tell us more about your query..."
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {formStatus.loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                  <span className="text-green-500">✓</span> Your information is secure with us
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT INFO */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get In <span className="text-blue-600">Touch</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Have questions? We'd love to hear from you. Here's how you can reach us.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-6">
              {/* Phone Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    📞
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-1">Call Us Anytime</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">704-314-6478</p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      9 AM To 7 PM (Everyday)
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                    ✉️
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-semibold mb-1">Email Us</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">help@billora.com</p>
                    <p className="text-sm text-gray-500">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 font-semibold mb-2">Visit Us</p>
                    <p className="font-bold text-gray-900 mb-2">Lelija Technolabs Pvt. Ltd.</p>
                    <p className="text-gray-600 leading-relaxed">
                      B-426 Sumel Business Park 7,<br />
                      Near Soni Ni Chali, Barasat,<br />
                      West Bengal - 700121
                    </p>

                    {/* Business Details */}
                    <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        <span className="font-semibold text-gray-700">GSTIN:</span>
                        <span className="text-gray-600">24AAFCF7281A1ZX</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                        <span className="font-semibold text-gray-700">CIN:</span>
                        <span className="text-gray-600">U62091GJ2023PTC146763</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-48 bg-gray-800 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">📍</span>
                  </div>
                  <p className="text-white font-semibold">Find us on Google Maps</p>
                  <button className="mt-3 px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Open Map
                  </button>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link href="#" className="group relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="text-lg font-bold">f</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="text-lg">📸</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="text-lg font-bold">in</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="text-lg font-bold">X</span>
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <span className="text-lg">▶</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
                  ⭐
                </div>
                <div>
                  <p className="font-bold text-gray-900">Trusted by 1 Crore+ Indian Businesses</p>
                  <p className="text-sm text-gray-600">Join millions of happy customers</p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 text-sm text-gray-600">
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