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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form Submitted:", formData);

    alert("Your message has been submitted!");

    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: ""
    });
  };


  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Navbar />

     
      

      {/* Top Banner - Updated to Billora theme */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 mt-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-center sm:text-left">
            Lifetime FREE GST Billing Software
          </h2>

          <Link href="/start-free-trial">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition-all hover:scale-105 shadow-md">
              Create Your Account
            </button>
          </Link>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">

        {/* LEFT SIDE - CONTACT FORM */}
        <div>

          <p className="text-sm text-gray-400 mb-3">
            Home › Contact Us
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            For any questions or support simply complete the form
            below and a member of our support team will review
            and respond promptly to your request.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            *All fields are required
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Submit
            </button>

          </form>
        </div>

        {/* RIGHT SIDE - CONTACT INFO */}
        <div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Get In Touch
          </h2>

          <div className="space-y-6 text-gray-700">

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📞</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  704-314-6478
                </p>
                <p className="text-sm text-gray-500">
                  (9 AM To 7 PM - Everyday)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">✉️</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                help@billora.com
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Lelija Technolabs Pvt. Ltd.
                </p>

                <p className="text-gray-600 mt-2 leading-relaxed">
                  B-426 Sumel Business Park 7,<br />
                  Near Soni Ni Chali, Barasat,<br />
                  West Bengal - 700121
                </p>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">GSTIN:</span> 24AAFCF7281A1ZX
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">CIN:</span> U62091GJ2023PTC146763
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Social Icons - Updated to Billora theme */}
          <div className="flex gap-3 mt-10">
            <Link href="#" className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-lg hover:bg-blue-700 hover:scale-110 transition-all">
              f
            </Link>
            <Link href="#" className="w-10 h-10 bg-pink-500 text-white flex items-center justify-center rounded-lg hover:bg-pink-600 hover:scale-110 transition-all">
              ig
            </Link>
            <Link href="#" className="w-10 h-10 bg-blue-700 text-white flex items-center justify-center rounded-lg hover:bg-blue-800 hover:scale-110 transition-all">
              in
            </Link>
            <Link href="#" className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg hover:bg-gray-900 hover:scale-110 transition-all">
              X
            </Link>
            <Link href="#" className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-lg hover:bg-red-700 hover:scale-110 transition-all">
              ▶
            </Link>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-blue-600 text-lg">✓</span>
              Trusted by 1 Cr+ Indian businesses
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}