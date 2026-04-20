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
      benefits: ["30% commission", "Marketing support", "Dedicated account manager"],
      color: "blue"
    },
    {
      title: "Technology Partner",
      icon: "💻",
      description: "Integrate your product with Billora",
      benefits: ["API access", "Technical support", "Co-marketing opportunities"],
      color: "purple"
    },
    {
      title: "Consulting Partner",
      icon: "📊",
      description: "Provide implementation services",
      benefits: ["Lead sharing", "Training programs", "Revenue share"],
      color: "emerald"
    },
    {
      title: "Affiliate Partner",
      icon: "📢",
      description: "Promote Billora to your audience",
      benefits: ["Recurring commissions", "Marketing materials", "Performance bonuses"],
      color: "orange"
    }
  ];

  const stats = [
    { value: "50,000+", label: "Businesses using Billora" },
    { value: "₹10,000 Cr+", label: "Annual transaction volume" },
    { value: "100+", label: "Active partners" },
    { value: "28 States", label: "Pan India presence" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section - Split Layout */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
                <span className="text-yellow-400 text-xl">⚡</span>
                <span className="text-sm font-medium text-white">Limited Slots Available</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Grow Your Business
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  With Billora
                </span>
              </h1>
              <p className="text-lg text-indigo-200 mb-8 leading-relaxed">
                Join India's fastest-growing business platform and unlock new revenue streams. 
                Get exclusive benefits, dedicated support, and grow together.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  Become a Partner
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300">
                  Watch Video →
                </button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/20">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 border-2 border-white flex items-center justify-center text-xs font-bold">
                      👤
                    </div>
                  ))}
                </div>
                <div className="text-sm text-indigo-200">
                  Trusted by <span className="font-bold text-white">500+ partners</span> across India
                </div>
              </div>
            </div>
            
            {/* Right Column - Floating Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-2">Partner Benefits</h3>
                <ul className="space-y-3">
                  {["High Commission Rates", "Priority Support", "Marketing Materials", "Training Programs"].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-indigo-100">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32L48 42.7C96 53.3 192 74.7 288 74.7C384 74.7 480 53.3 576 42.7C672 32 768 32 864 42.7C960 53.3 1056 74.7 1152 74.7C1248 74.7 1344 53.3 1392 42.7L1440 32V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V32Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats - Masonry Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Types - Bento Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 rounded-full px-4 py-1 text-sm font-semibold text-indigo-600 mb-4">
            Partnership Programs
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Multiple ways to partner with us and grow your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerTypes.map((partner, idx) => (
            <div key={idx} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${partner.color === 'blue' ? '#3b82f6' : partner.color === 'purple' ? '#8b5cf6' : partner.color === 'emerald' ? '#10b981' : '#f59e0b'}, transparent)` }}>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                    {partner.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${partner.color}-100 text-${partner.color}-600`}>
                    Popular
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{partner.title}</h3>
                <p className="text-gray-600 mb-4">{partner.description}</p>
                <ul className="space-y-2 mb-6">
                  {partner.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="text-sm text-gray-700 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works - Timeline Style */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-gray-600 text-lg">Get started in no time</p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 hidden md:block"></div>
            
            <div className="space-y-12">
              {[
                { step: "01", title: "Apply Online", desc: "Fill out our quick application form with your details", icon: "📝", side: "left" },
                { step: "02", title: "Get Reviewed", desc: "Our team reviews and schedules a discovery call", icon: "✅", side: "right" },
                { step: "03", title: "Start Growing", desc: "Get trained, access resources, and start earning", icon: "🚀", side: "left" },
              ].map((item, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-5xl font-bold text-indigo-200 mb-2">{item.step}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-all duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories - Carousel Style Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-pink-100 rounded-full px-4 py-1 text-sm font-semibold text-pink-600 mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Partners Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real partners, real results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: "Rajesh Kumar", company: "Tech Solutions India", revenue: "+245%", quote: "Billora transformed our business. The support team is incredible!", image: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Priya Sharma", company: "Digital Growth Partners", revenue: "+180%", quote: "Best decision we made. Our clients love the platform.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
          ].map((story, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100" />
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{story.name}</h3>
                  <p className="text-gray-500 text-sm">{story.company}</p>
                </div>
                <div className="ml-auto text-5xl text-indigo-200">"</div>
              </div>
              <p className="text-gray-600 mb-4 italic leading-relaxed">"{story.quote}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">Revenue Growth</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {story.revenue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section - Split Layout */}
      <div id="partner-form" className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white">
              <div className="text-6xl mb-6">🤝</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Grow Together?
              </h2>
              <p className="text-indigo-200 text-lg mb-6">
                Join our partner network and unlock new opportunities. Fill out the form and our team will reach out within 48 hours.
              </p>
              <div className="space-y-4">
                {[
                  "✓ Dedicated partner success manager",
                  "✓ Marketing & sales collateral",
                  "✓ Priority technical support",
                  "✓ Performance bonuses"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Partner Application</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    required
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    required
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    required
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name *"
                    required
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                  <select
                    name="partnerType"
                    required
                    onChange={handleChange}
                    className="sm:col-span-2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
                  >
                    <option value="">Select Partnership Type *</option>
                    <option value="channel">Channel Partner</option>
                    <option value="technology">Technology Partner</option>
                    <option value="consulting">Consulting Partner</option>
                    <option value="affiliate">Affiliate Partner</option>
                  </select>
                  <textarea
                    name="message"
                    placeholder="Tell us about your business..."
                    rows="3"
                    onChange={handleChange}
                    className="sm:col-span-2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Submit Application →
                </button>
                <p className="text-center text-xs text-gray-500">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}