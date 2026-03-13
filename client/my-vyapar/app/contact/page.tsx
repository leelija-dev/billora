
"use client";
import Navbar from "@/components/Navbar";  
import Footer from "@/components/Footer" ;

import React, { useState } from "react";

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
        <Navbar/>

      {/* Top Banner */}
      <div className="bg-blue-500 text-white py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <h2 className="text-lg md:text-xl font-semibold">
            Lifetime FREE GST Billing Software
          </h2>

          <button className="bg-orange-400 hover:bg-orange-500 px-6 py-2 rounded text-white font-semibold">
            Create Your Account
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">

        {/* LEFT SIDE - CONTACT FORM */}
        <div>

          <p className="text-sm text-gray-400 mb-3">
            Home › Contact Us
          </p>

          <h1 className="text-3xl font-semibold mb-4">
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
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Your Message</label>
              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900"
            >
              Submit
            </button>

          </form>
        </div>


        {/* RIGHT SIDE - CONTACT INFO */}
        <div>

          <h2 className="text-2xl font-semibold mb-8">
            Get In Touch
          </h2>

          <div className="space-y-6 text-gray-700">

            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-lg font-medium">
                  704-314-6478
                </p>
                <p className="text-sm text-gray-500">
                  (9 AM To 7 PM - Everyday)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">✉️</span>
              <p className="text-lg">
                help@billora.com
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="font-semibold">
                  Lelija Technolabs Pvt. Ltd.
                </p>

                <p className="text-gray-600 mt-2">
                  B-426 Sumel Business Park 7,<br />
                  Near Soni Ni Chali, Barasat,<br />
                  west bengal - 700121
                </p>

                <p className="mt-3">
                  GSTIN : 24AAFCF7281A1ZX
                </p>

                <p className="mt-1">
                  CIN: U62091GJ2023PTC146763
                </p>
              </div>
            </div>

          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mt-10">

            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center">
              f
            </div>

            <div className="w-10 h-10 bg-pink-500 text-white flex items-center justify-center">
              ig
            </div>

            <div className="w-10 h-10 bg-blue-700 text-white flex items-center justify-center">
              in
            </div>

            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center">
              X
            </div>

            <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center">
              ▶
            </div>

          </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
}

