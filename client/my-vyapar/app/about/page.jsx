// about/page.jsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("mission");

  const milestones = [
    { year: "2020", title: "Founded", description: "Started with a vision to empower small businesses" },
    { year: "2021", title: "First 10,000 Users", description: "Reached milestone of 10,000 active businesses" },
    { year: "2022", title: "Series A Funding", description: "Raised $10M to expand operations" },
    { year: "2023", title: "Pan India Presence", description: "Expanded to 28 states across India" },
    { year: "2024", title: "1 Million+ Transactions", description: "Processed over 1 million transactions monthly" },
  ];

  const team = [
    { name: "Rajesh Sharma", role: "Founder & CEO", image: "👨‍💼", bio: "Ex-Google, IIT Bombay alumni" },
    { name: "Priya Patel", role: "CTO", image: "👩‍💻", bio: "Ex-Amazon, Stanford graduate" },
    { name: "Amit Kumar", role: "Head of Sales", image: "👨‍💼", bio: "15+ years in B2B SaaS" },
    { name: "Neha Singh", role: "Customer Success", image: "👩‍💼", bio: "Passionate about helping businesses grow" },
  ];

  const industries = [
    { name: "Restaurants", icon: "🍽️", count: "15,000+" },
    { name: "Retail Stores", icon: "🛍️", count: "20,000+" },
    { name: "Pharmacies", icon: "💊", count: "8,000+" },
    { name: "Stock Market", icon: "📈", count: "5,000+" },
    { name: "Services", icon: "🔧", count: "12,000+" },
    { name: "Others", icon: "🏢", count: "10,000+" },
  ];

  const impact = [
    { number: "70,000+", label: "Businesses Empowered" },
    { number: "28", label: "States Covered" },
    { number: "₹15,000 Cr+", label: "Transaction Value" },
    { number: "500+", label: "Team Members" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 opacity-30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Empowering Small Businesses
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              Across India
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to digitize every small business in India, providing them with the tools they need to succeed in the digital age.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {impact.map((stat, idx) => (
            <div key={idx}>
              <div className="text-2xl font-bold text-orange-600">{stat.number}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-full inline-flex">
            {["mission", "vision", "values"].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  activeSection === section 
                    ? "bg-white text-orange-600 shadow-md" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-8 text-center">
          {activeSection === "mission" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                To democratize technology for small businesses across India, making enterprise-grade tools accessible, affordable, and easy to use for every entrepreneur.
              </p>
            </div>
          )}
          {activeSection === "vision" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Create an ecosystem where every small business in India can thrive digitally, contributing to India's $5 trillion economy goal.
              </p>
            </div>
          )}
          {activeSection === "values" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {["Innovation", "Integrity", "Customer First", "Excellence"].map((value) => (
                  <div key={value} className="bg-white p-3 rounded-lg shadow-sm">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Tailored solutions for diverse business needs
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {industries.map((industry, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-2">{industry.icon}</div>
                <div className="font-semibold text-sm">{industry.name}</div>
                <div className="text-xs text-gray-500">{industry.count}+</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Journey */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Our Journey
        </h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-orange-400 to-red-400 h-full"></div>
          <div className="space-y-8">
            {milestones.map((milestone, idx) => (
              <div key={idx} className={`relative flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="w-5/12">
                  <div className={`bg-white p-4 rounded-lg shadow-md ${idx % 2 === 0 ? 'mr-4' : 'ml-4'}`}>
                    <div className="text-orange-600 font-bold">{milestone.year}</div>
                    <h3 className="font-semibold">{milestone.title}</h3>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4">
            Meet Our Leadership
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Passionate team dedicated to your success
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
                <div className="text-6xl mb-3">{member.image}</div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-orange-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-500 text-xs">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-orange-100 mb-6">
            Join thousands of businesses already using Billora
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

      <Footer />
    </div>
  );
}