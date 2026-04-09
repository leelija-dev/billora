// join-team/page.jsx
"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function JoinTeamPage() {
  const [activeTab, setActiveTab] = useState("openings");

  const openings = [
    {
      title: "Senior Full Stack Developer",
      type: "Full-time",
      location: "Remote / Bangalore",
      experience: "5+ years",
      description: "Looking for an experienced developer with expertise in React, Node.js, and cloud technologies.",
      tags: ["React", "Node.js", "AWS", "MongoDB"]
    },
    {
      title: "Product Manager",
      type: "Full-time",
      location: "Mumbai",
      experience: "4+ years",
      description: "Lead product development for our SaaS platform. Experience in B2B products preferred.",
      tags: ["Product Strategy", "Agile", "SaaS", "Analytics"]
    },
    {
      title: "UX/UI Designer",
      type: "Full-time",
      location: "Remote",
      experience: "3+ years",
      description: "Create beautiful and intuitive interfaces for our multi-business platform.",
      tags: ["Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      title: "Sales Executive",
      type: "Full-time",
      location: "Multiple Locations",
      experience: "2+ years",
      description: "Drive growth by acquiring new businesses across India.",
      tags: ["B2B Sales", "CRM", "Negotiation", "Hindi/English"]
    },
    {
      title: "Customer Success Specialist",
      type: "Full-time",
      location: "Remote",
      experience: "1+ years",
      description: "Help our clients succeed with Billora platform.",
      tags: ["Communication", "Problem Solving", "Tech Savvy", "Patience"]
    },
    {
      title: "Marketing Intern",
      type: "Internship",
      location: "Bangalore",
      experience: "Fresher",
      description: "Learn and grow with our marketing team. Create content and manage social media.",
      tags: ["Content Writing", "Social Media", "SEO", "Creativity"]
    }
  ];

  const benefits = [
    { icon: "🏠", title: "Remote First", desc: "Work from anywhere" },
    { icon: "💰", title: "Competitive Salary", desc: "Best in industry" },
    { icon: "📈", title: "ESOPs", desc: "Own the company" },
    { icon: "🏥", title: "Health Insurance", desc: "For you and family" },
    { icon: "🎓", title: "Learning Budget", desc: "$1000/year for courses" },
    { icon: "🌴", title: "Unlimited PTO", desc: "Take time when needed" },
  ];

  const values = [
    { title: "Customer First", desc: "Everything we do is for our customers" },
    { title: "Innovation", desc: "Constantly improve and innovate" },
    { title: "Integrity", desc: "Do the right thing, always" },
    { title: "Teamwork", desc: "Together we achieve more" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Join Our Team
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Help us empower millions of small businesses across India
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              View Openings
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">50+</div>
            <div className="text-gray-600">Team Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">10+</div>
            <div className="text-gray-600">Open Roles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">4.8</div>
            <div className="text-gray-600">Glassdoor Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-gray-600">Remote Friendly</div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            Benefits & Perks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Openings Section */}
      <div id="openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4">
          Current Openings
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Join us in our mission to transform small businesses
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {openings.map((job, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  job.type === 'Internship' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {job.type}
                </span>
              </div>
              <div className="flex gap-4 mb-3 text-sm text-gray-500">
                <span>📍 {job.location}</span>
                <span>💼 {job.experience}</span>
              </div>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
                Apply Now →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mt-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Don't see the right role?
          </h2>
          <p className="text-blue-100 mb-6">
            We're always looking for talented people. Send us your resume and we'll reach out when something matches.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition">
            Submit General Application
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}