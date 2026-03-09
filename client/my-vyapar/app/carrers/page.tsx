
"use client";

import Link from 'next/link';
import React, { useState } from 'react';

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState('all');

  const jobs = [
    {
      title: 'Senior Full Stack Developer',
      dept: 'engineering',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '5+ years',
      icon: '👨‍💻',
      featured: true
    },
    {
      title: 'Product Manager',
      dept: 'product',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '4+ years',
      icon: '📱',
      featured: false
    },
    {
      title: 'UI/UX Designer',
      dept: 'design',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      icon: '🎨',
      featured: false
    },
    {
      title: 'Customer Success Manager',
      dept: 'support',
      location: 'Delhi',
      type: 'Full-time',
      experience: '2+ years',
      icon: '🤝',
      featured: false
    },
    {
      title: 'DevOps Engineer',
      dept: 'engineering',
      location: 'Bangalore',
      type: 'Full-time',
      experience: '4+ years',
      icon: '⚙️',
      featured: false
    },
    {
      title: 'Marketing Specialist',
      dept: 'marketing',
      location: 'Mumbai',
      type: 'Full-time',
      experience: '3+ years',
      icon: '📢',
      featured: false
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'product', name: 'Product' },
    { id: 'design', name: 'Design' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'support', name: 'Customer Support' },
  ];

  const filteredJobs = selectedDept === 'all'
    ? jobs
    : jobs.filter(job => job.dept === selectedDept);

  const perks = [
    { icon: '💰', title: 'Competitive Salary', desc: 'Best in industry compensation' },
    { icon: '🏥', title: 'Health Insurance', desc: 'Coverage for you and family' },
    { icon: '🏠', title: 'Remote Friendly', desc: 'Work from anywhere' },
    { icon: '📚', title: 'Learning Budget', desc: 'Annual education allowance' },
    { icon: '⚡', title: 'Stock Options', desc: 'ESOPs for all employees' },
    { icon: '🎉', title: 'Fun Culture', desc: 'Regular team outings & events' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Home Button */}
      <div className="fixed top-24 left-4 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-gray-200 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Build the future of business management with us
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Link
              href="#openings"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              View Openings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-2xl p-8">
          {[
            { value: '200+', label: 'Team Members' },
            { value: '10M+', label: 'Users' },
            { value: '4.9', label: 'Rating' },
            { value: '6', label: 'Offices' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Perks */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Join Vyapar?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We take care of our team like family with comprehensive benefits and a culture that celebrates success
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className="group p-6 bg-gray-50 rounded-2xl hover:shadow-xl transition-all hover:-translate-y-2 cursor-default border border-gray-100"
            >
              <span className="text-4xl mb-4 block">{perk.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{perk.title}</h3>
              <p className="text-gray-600">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div id="openings" className="bg-gray-50 py-24 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-gray-600 text-lg">Find your perfect role and make an impact</p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedDept === dept.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border ${
                  job.featured ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{job.icon}</span>
                  {job.featured && (
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{job.title}</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>📍</span> {job.location}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <span>⏰</span> {job.type} · {job.experience}
                  </p>
                </div>
                <button className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all text-center">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-16 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't see your role?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1">
            Send Open Application
          </button>
        </div>
      </div>
    </div>
  );
}