// partner/page.jsx
"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    partnerType: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your interest! Our partnership team will contact you within 48 hours.");
  };

  const partnerTypes = [
    {
      title: "Channel Partner",
      icon: "🤝",
      description: "Resell Billora to your clients",
      benefits: ["30% commission", "Marketing support", "Dedicated account manager"]
    },
    {
      title: "Technology Partner",
      icon: "💻",
      description: "Integrate your product with Billora",
      benefits: ["API access", "Technical support", "Co-marketing opportunities"]
    },
    {
      title: "Consulting Partner",
      icon: "📊",
      description: "Provide implementation services",
      benefits: ["Lead sharing", "Training programs", "Revenue share"]
    },
    {
      title: "Affiliate Partner",
      icon: "📢",
      description: "Promote Billora to your audience",
      benefits: ["Recurring commissions", "Marketing materials", "Performance bonuses"]
    }
  ];

  const stats = [
    { value: "50,000+", label: "Businesses using Billora" },
    { value: "₹10,000 Cr+", label: "Annual transaction volume" },
    { value: "100+", label: "Active partners" },
    { value: "28 States", label: "Pan India presence" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1 text-sm mb-4">
              🤝 Grow Together
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Partner with Billora
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 mb-6">
              Join India's fastest-growing business platform and unlock new revenue streams
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
              >
                Become a Partner →
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Partner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Why Partner with Billora?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our ecosystem and help small businesses digitize their operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerTypes.map((partner, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {partner.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{partner.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
              <ul className="space-y-2">
                {partner.benefits.map((benefit, bidx) => (
                  <li key={bidx} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
            How Partnership Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Apply", desc: "Fill out the partnership application form" },
              { step: "2", title: "Review", desc: "Our team reviews and connects with you" },
              { step: "3", title: "Onboard", desc: "Get trained and start onboarding clients" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Success Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-12">
          Partner Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Tech Solutions India", revenue: "₹25 Lakhs", years: "2 years", quote: "Billora has been a game-changer for our business. The support is outstanding!" },
            { name: "Digital Growth Partners", revenue: "₹40 Lakhs", years: "1.5 years", quote: "Best decision we made. Our clients love Billora's ease of use." },
          ].map((story, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                  👥
                </div>
                <div>
                  <h3 className="font-semibold">{story.name}</h3>
                  <p className="text-sm text-gray-500">{story.years} of partnership</p>
                </div>
              </div>
              <p className="text-gray-600 mb-3 italic">"{story.quote}"</p>
              <div className="text-green-600 font-semibold">Revenue: {story.revenue}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Form */}
      <div id="partner-form" className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <h2 className="text-2xl font-bold">Ready to Partner?</h2>
              <p>Fill out the form and our partnership team will reach out</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  required
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  required
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name *"
                  required
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <select
                  name="partnerType"
                  required
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"
                >
                  <option value="">Select Partnership Type *</option>
                  <option value="channel">Channel Partner</option>
                  <option value="technology">Technology Partner</option>
                  <option value="consulting">Consulting Partner</option>
                  <option value="affiliate">Affiliate Partner</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Tell us about your business and how you'd like to partner..."
                  rows="4"
                  onChange={handleChange}
                  className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 md:col-span-2"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Submit Application →
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}