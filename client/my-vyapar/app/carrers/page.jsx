// join-team/page.jsx
"use client";

import { useState } from "react";

export default function JoinTeamPage() {
  const [activeTab, setActiveTab] = useState("openings");
  const [hoveredJob, setHoveredJob] = useState(null);

  const openings = [
    {
      title: "Senior Full Stack Developer",
      type: "Full-time",
      location: "Remote / Bangalore",
      experience: "5+ years",
      description: "Looking for an experienced developer with expertise in React, Node.js, and cloud technologies.",
      tags: ["React", "Node.js", "AWS", "MongoDB"],
      salary: "₹25L - ₹35L",
      urgent: true
    },
    {
      title: "Product Manager",
      type: "Full-time",
      location: "Mumbai",
      experience: "4+ years",
      description: "Lead product development for our SaaS platform. Experience in B2B products preferred.",
      tags: ["Product Strategy", "Agile", "SaaS", "Analytics"],
      salary: "₹20L - ₹30L",
      urgent: false
    },
    {
      title: "UX/UI Designer",
      type: "Full-time",
      location: "Remote",
      experience: "3+ years",
      description: "Create beautiful and intuitive interfaces for our multi-business platform.",
      tags: ["Figma", "User Research", "Prototyping", "Design Systems"],
      salary: "₹15L - ₹25L",
      urgent: false
    },
    {
      title: "Sales Executive",
      type: "Full-time",
      location: "Multiple Locations",
      experience: "2+ years",
      description: "Drive growth by acquiring new businesses across India.",
      tags: ["B2B Sales", "CRM", "Negotiation", "Hindi/English"],
      salary: "₹12L - ₹18L + Incentives",
      urgent: true
    },
    {
      title: "Customer Success Specialist",
      type: "Full-time",
      location: "Remote",
      experience: "1+ years",
      description: "Help our clients succeed with Billora platform.",
      tags: ["Communication", "Problem Solving", "Tech Savvy", "Patience"],
      salary: "₹8L - ₹12L",
      urgent: false
    },
    {
      title: "Marketing Intern",
      type: "Internship",
      location: "Bangalore",
      experience: "Fresher",
      description: "Learn and grow with our marketing team. Create content and manage social media.",
      tags: ["Content Writing", "Social Media", "SEO", "Creativity"],
      salary: "₹25k - ₹35k/month",
      urgent: false
    }
  ];

  const benefits = [
    { icon: "🏠", title: "Remote First", desc: "Work from anywhere", color: "from-blue-500 to-cyan-500" },
    { icon: "💰", title: "Competitive Salary", desc: "Best in industry", color: "from-emerald-500 to-teal-500" },
    { icon: "📈", title: "ESOPs", desc: "Own the company", color: "from-purple-500 to-pink-500" },
    { icon: "🏥", title: "Health Insurance", desc: "For you and family", color: "from-red-500 to-orange-500" },
    { icon: "🎓", title: "Learning Budget", desc: "$1000/year for courses", color: "from-indigo-500 to-blue-500" },
    { icon: "🌴", title: "Unlimited PTO", desc: "Take time when needed", color: "from-rose-500 to-pink-500" },
  ];

  const values = [
    { title: "Customer First", desc: "Everything we do is for our customers", icon: "", color: "bg-blue-50" },
    { title: "Innovation", desc: "Constantly improve and innovate", icon: "", color: "bg-purple-50" },
    { title: "Integrity", desc: "Do the right thing, always", icon: "", color: "bg-emerald-50" },
    { title: "Teamwork", desc: "Together we achieve more", icon: "", color: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">We're hiring! 10+ positions open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Join Our Team
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Help us empower millions of small businesses across India
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              View Openings
              <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Curved bottom separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32L48 42.7C96 53.3 192 74.7 288 74.7C384 74.7 480 53.3 576 42.7C672 32 768 32 864 42.7C960 53.3 1056 74.7 1152 74.7C1248 74.7 1344 53.3 1392 42.7L1440 32V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V32Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      {/* Stats Section with Enhanced Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: "50+", label: "Team Members", icon: "", gradient: "from-blue-600 to-cyan-600" },
            { value: "10+", label: "Open Roles", icon: "", gradient: "from-purple-600 to-pink-600" },
            { value: "4.9", label: "Glassdoor Rating", icon: "", gradient: "from-yellow-500 to-orange-500" },
            { value: "100%", label: "Remote Friendly", icon: "", gradient: "from-emerald-500 to-teal-500" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-5 text-center transform hover:scale-105 transition-all duration-300 border border-gray-100">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section with Enhanced Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">The Billora Way</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Our Core Values
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <div key={idx} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{value.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section with Enhanced Cards */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Benefits & Perks
            </h2>
            <p className="text-gray-600 text-lg">We believe happy teams build great products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Openings Section with Enhanced Job Cards */}
      <div id="openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Current Openings
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join us in our mission to transform small businesses across India
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {openings.map((job, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredJob(idx)}
              onMouseLeave={() => setHoveredJob(null)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.type === 'Internship' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {job.type}
                    </span>
                    {job.urgent && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full animate-pulse">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>
                
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Skills & Technologies</div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Expected Salary</div>
                    <div className="text-sm font-semibold text-gray-900">{job.salary || "Competitive"}</div>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Apply Now →
                  </button>
                </div>
              </div>
              
              {/* Hover gradient effect */}
              <div className={`h-1 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${hoveredJob === idx ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section with Enhanced Design - FIXED VERSION */}
      <div className="relative mx-4 sm:mx-6 lg:mx-auto max-w-6xl rounded-3xl overflow-hidden my-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        {/* Fixed: Removed the problematic SVG data URL and replaced with a cleaner pattern */}
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-6 py-14 md:py-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't see the right role?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8 text-lg">
            We're always looking for talented people. Send us your resume and we'll reach out when something matches.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
            Submit General Application
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}