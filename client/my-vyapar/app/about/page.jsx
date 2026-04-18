// about/page.jsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutPage() {
  const [activeCard, setActiveCard] = useState(null);

  const milestones = [
    { year: "2020", title: "The Beginning", description: "Started with a vision to empower small businesses", icon: "🌱", stat: "0→1" },
    { year: "2021", title: "Early Traction", description: "Reached milestone of 10,000 active businesses", icon: "📈", stat: "10k+" },
    { year: "2022", title: "Funding Round", description: "Raised $10M to expand operations", icon: "💰", stat: "$10M" },
    { year: "2023", title: "Nationwide Expansion", description: "Expanded to 28 states across India", icon: "🇮🇳", stat: "28 States" },
    { year: "2024", title: "The Milestone", description: "Processed over 1 million transactions monthly", icon: "🎯", stat: "1M+" },
  ];

  const team = [
    { name: "Rajesh Sharma", role: "Founder & CEO", image: "👨‍💼", bio: "Ex-Google, IIT Bombay", expertise: "Product & Strategy", years: "15+" },
    { name: "Priya Patel", role: "CTO", image: "👩‍💻", bio: "Ex-Amazon, Stanford", expertise: "AI & Cloud", years: "12+" },
    { name: "Amit Kumar", role: "Head of Sales", image: "👨‍💼", bio: "15+ years in B2B SaaS", expertise: "Revenue Growth", years: "15+" },
    { name: "Neha Singh", role: "Customer Success", image: "👩‍💼", bio: "Passionate about businesses", expertise: "Client Relations", years: "10+" },
  ];

  const industries = [
    { name: "Restaurants", icon: "🍽️", count: "15,000+", growth: "+45%", bg: "bg-blue-50" },
    { name: "Retail Stores", icon: "🛍️", count: "20,000+", growth: "+62%", bg: "bg-cyan-50" },
    { name: "Pharmacies", icon: "💊", count: "8,000+", growth: "+38%", bg: "bg-indigo-50" },
    { name: "Stock Market", icon: "📈", count: "5,000+", growth: "+89%", bg: "bg-sky-50" },
    { name: "Services", icon: "🔧", count: "12,000+", growth: "+51%", bg: "bg-blue-50" },
    { name: "Others", icon: "🏢", count: "10,000+", growth: "+43%", bg: "bg-cyan-50" },
  ];

  const impact = [
    { number: "70,000+", label: "Businesses Empowered", icon: "🏢", trend: "+156%" },
    { number: "28", label: "States Covered", icon: "🗺️", trend: "Pan India" },
    { number: "₹15,000 Cr+", label: "Transaction Value", icon: "💰", trend: "+89%" },
    { number: "500+", label: "Team Members", icon: "👥", trend: "+200%" },
  ];

  const values = [
    { title: "Innovation", desc: "Constantly pushing boundaries to bring cutting-edge solutions", icon: "💡", color: "blue" },
    { title: "Customer First", desc: "Our customers' success is our success", icon: "❤️", color: "red" },
    { title: "Integrity", desc: "Transparency and honesty in everything we do", icon: "⚖️", color: "green" },
    { title: "Excellence", desc: "Striving for the highest quality in every aspect", icon: "🎯", color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Floating Cards Layout */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-sm font-semibold text-blue-700">Est. 2020</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Small
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Businesses Across India
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're on a mission to digitize every small business in India, providing them with 
                enterprise-grade tools that are accessible, affordable, and easy to use.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Our Story
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                  Watch Video
                </button>
              </div>
            </div>
            
            {/* Right Column - Floating Stats */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {impact.map((stat, idx) => (
                  <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-xs mt-1">{stat.label}</div>
                    <div className="text-green-600 text-xs font-semibold mt-2">{stat.trend}</div>
                  </div>
                ))}
              </div>
              {/* Floating decorative element */}
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-blue-500 rounded-full opacity-20 blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission/Vision/Values - Interactive Flip Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Core Identity
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Driven by purpose, guided by values
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Card */}
          <div 
            className="group relative cursor-pointer"
            onMouseEnter={() => setActiveCard('mission')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl transition-all duration-500 ${activeCard === 'mission' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 ${activeCard === 'mission' ? 'transform -translate-y-2' : ''}`}>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize technology for small businesses across India, making enterprise-grade tools accessible, 
                affordable, and easy to use for every entrepreneur.
              </p>
              <div className={`mt-4 text-blue-600 font-semibold transition-all duration-300 ${activeCard === 'mission' ? 'opacity-100' : 'opacity-0'}`}>
                Learn more →
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div 
            className="group relative cursor-pointer"
            onMouseEnter={() => setActiveCard('vision')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl transition-all duration-500 ${activeCard === 'vision' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 ${activeCard === 'vision' ? 'transform -translate-y-2' : ''}`}>
              <div className="text-5xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Create an ecosystem where every small business in India can thrive digitally, 
                contributing to India's $5 trillion economy goal.
              </p>
              <div className={`mt-4 text-blue-600 font-semibold transition-all duration-300 ${activeCard === 'vision' ? 'opacity-100' : 'opacity-0'}`}>
                Learn more →
              </div>
            </div>
          </div>

          {/* Values Card */}
          <div 
            className="group relative cursor-pointer"
            onMouseEnter={() => setActiveCard('values')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl transition-all duration-500 ${activeCard === 'values' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 ${activeCard === 'values' ? 'transform -translate-y-2' : ''}`}>
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Values</h3>
              <div className="space-y-2">
                {values.map((value, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                    <span>{value.icon}</span> {value.title}
                  </div>
                ))}
              </div>
              <div className={`mt-4 text-blue-600 font-semibold transition-all duration-300 ${activeCard === 'values' ? 'opacity-100' : 'opacity-0'}`}>
                Explore values →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industries We Serve - Circular Stats */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4 shadow-sm">
              <span>📊</span> Industries We Serve
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Businesses From
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                Every Sector
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, idx) => (
              <div key={idx} className="group text-center">
                <div className={`${industry.bg} rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2`}>
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{industry.icon}</div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{industry.name}</div>
                  <div className="text-xl font-bold text-blue-600">{industry.count}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">{industry.growth}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <span className="text-2xl">🏆</span>
              <span className="text-gray-700">Trusted by <span className="font-bold text-blue-600">70,000+</span> businesses across India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey - Zigzag Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
            Our Timeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            The Billora Story
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            5 years of innovation and growth
          </p>
        </div>

        <div className="relative">
          {milestones.map((milestone, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{milestone.icon}</div>
                    <div>
                      <div className="text-blue-600 font-bold text-sm">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600">{milestone.description}</p>
                  <div className="mt-3 inline-block bg-blue-50 rounded-full px-3 py-1 text-xs font-semibold text-blue-600">
                    {milestone.stat}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10 relative">
                  {idx + 1}
                </div>
                {idx < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
                )}
              </div>
              <div className="flex-1"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Team - Radial Cards */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
              Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate experts dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative bg-white rounded-2xl p-6 text-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <div className="relative inline-block">
                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">{member.image}</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs mb-3">{member.bio}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600">
                      {member.expertise}
                    </span>
                    <span className="inline-block bg-blue-50 rounded-full px-2 py-1 text-xs text-blue-600">
                      {member.years} exp
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Split with Stats - FIXED: Removed SVG pattern */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-700"></div>
        {/* Simple overlay instead of SVG pattern */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Join thousands of businesses already using Billora to grow and succeed
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-yellow-400 text-sm">★★★★★</div>
                <div className="text-blue-100 text-xs mt-1">500+ reviews</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-blue-100 text-xs mt-1">Uptime SLA</div>
                <div className="text-blue-100 text-xs">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}