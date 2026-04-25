// partner/page.jsx
"use client";

import { useState } from "react";
import { 
  FaHandshake, 
  FaLaptopCode, 
  FaChartLine, 
  FaBullhorn, 
  FaArrowRight, 
  FaPlay, 
  FaCheck, 
  FaUsers, 
  FaStar, 
  FaRocket, 
  FaFileAlt, 
  FaCheckCircle, 
  FaHeadset, 
  FaChartBar,
  FaAward,
  FaTrophy,
  FaUserFriends,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaComments,
  FaGift,
  FaQuoteLeft,
  FaQuoteRight,
  FaShieldAlt,
  FaClock,
  FaGlobe
} from "react-icons/fa";
import { MdVerified, MdSecurity, MdSupportAgent } from "react-icons/md";

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
      icon: <FaHandshake className="w-12 h-12" />,
      description: "Resell Billora to your clients",
      benefits: ["30% commission", "Marketing support", "Dedicated account manager"],
      color: "blue"
    },
    {
      title: "Technology Partner",
      icon: <FaLaptopCode className="w-12 h-12" />,
      description: "Integrate your product with Billora",
      benefits: ["API access", "Technical support", "Co-marketing opportunities"],
      color: "purple"
    },
    {
      title: "Consulting Partner",
      icon: <FaChartLine className="w-12 h-12" />,
      description: "Provide implementation services",
      benefits: ["Lead sharing", "Training programs", "Revenue share"],
      color: "emerald"
    },
    {
      title: "Affiliate Partner",
      icon: <FaBullhorn className="w-12 h-12" />,
      description: "Promote Billora to your audience",
      benefits: ["Recurring commissions", "Marketing materials", "Performance bonuses"],
      color: "orange"
    }
  ];

  const stats = [
    { value: "50,000+", label: "Businesses using Billora", icon: <FaUsers className="text-2xl" /> },
    { value: "₹10,000 Cr+", label: "Annual transaction volume", icon: <FaChartBar className="text-2xl" /> },
    { value: "100+", label: "Active partners", icon: <FaHandshake className="text-2xl" /> },
    { value: "28 States", label: "Pan India presence", icon: <FaGlobe className="text-2xl" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Professional Design */}
      <div className="relative bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mb-6 hover:bg-white/20 transition-all duration-300">
                <span className="text-yellow-400 text-xl">⚡</span>
                <span className="text-sm font-medium">Limited Slots Available</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
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
                  className="group bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  Become a Partner
                  <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                  <FaPlay className="w-4 h-4" />
                  Watch Video
                </button>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/20">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 border-2 border-white flex items-center justify-center">
                      <FaUserFriends className="w-4 h-4 text-white" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-indigo-200">
                  Trusted by <span className="font-bold text-white">500+ partners</span> across India
                </div>
              </div>
            </div>
            
            {/* Right Column - Benefits Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="text-6xl mb-4">
                  <FaAward className="text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Partner Benefits</h3>
                <ul className="space-y-3">
                  {["High Commission Rates", "Priority Support", "Marketing Materials", "Training Programs"].map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-indigo-100 hover:translate-x-2 transition-all duration-300">
                      <FaCheck className="w-5 h-5 text-yellow-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100">
              <div className="flex justify-center mb-3 text-indigo-600 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-600 text-xs sm:text-sm mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Types - Bento Grid Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-100 rounded-lg px-4 py-1 text-sm font-semibold text-indigo-600 mb-4">
            Partnership Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            Multiple ways to partner with us and grow your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {partnerTypes.map((partner, idx) => (
            <div key={idx} className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-${partner.color === 'blue' ? 'blue' : partner.color === 'purple' ? 'purple' : partner.color === 'emerald' ? 'green' : 'orange'}-600 transform group-hover:scale-110 transition-transform duration-300`}>
                    {partner.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    partner.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
                    partner.color === 'purple' ? 'bg-purple-100 text-purple-600' : 
                    partner.color === 'emerald' ? 'bg-green-100 text-green-600' : 
                    'bg-orange-100 text-orange-600'
                  }`}>
                    Popular
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                  {partner.title}
                </h3>
                <p className="text-gray-600 mb-4">{partner.description}</p>
                <ul className="space-y-2 mb-6">
                  {partner.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="text-sm text-gray-700 flex items-center gap-2">
                      <FaCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 rounded-lg border-2 border-gray-200 font-semibold text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                  Learn More <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works - Professional Timeline */}
      <div className="bg-indigo-50 py-20 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-4">Get started in no time</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Apply Online", desc: "Fill out our quick application form with your details", icon: <FaFileAlt className="w-8 h-8" />, color: "from-blue-500 to-cyan-500" },
              { step: "02", title: "Get Reviewed", desc: "Our team reviews and schedules a discovery call", icon: <MdVerified className="w-8 h-8" />, color: "from-purple-500 to-pink-500" },
              { step: "03", title: "Start Growing", desc: "Get trained, access resources, and start earning", icon: <FaRocket className="w-8 h-8" />, color: "from-orange-500 to-red-500" },
            ].map((item, idx) => (
              <div key={idx} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-200 mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-pink-100 rounded-lg px-4 py-1 text-sm font-semibold text-pink-600 mb-4">
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Partners Say
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-600 to-purple-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Real partners, real results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Rajesh Kumar", company: "Tech Solutions India", revenue: "+245%", quote: "Billora transformed our business. The support team is incredible!", image: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Priya Sharma", company: "Digital Growth Partners", revenue: "+180%", quote: "Best decision we made. Our clients love the platform.", image: "https://randomuser.me/api/portraits/women/68.jpg" },
          ].map((story, idx) => (
            <div key={idx} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 relative overflow-hidden p-6">
              <FaQuoteLeft className="absolute text-indigo-50 w-12 h-12 bottom-4 right-4" />
              <div className="flex items-center gap-4 mb-6">
                <img src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover border-4 border-indigo-100 group-hover:border-indigo-300 transition-all duration-300" />
                <div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {story.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{story.company}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">"{story.quote}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">Revenue Growth</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent flex items-center gap-1">
                  <FaChartBar className="w-5 h-5" />
                  {story.revenue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Section - Professional */}
      <div id="partner-form" className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white">
              <FaHandshake className="text-yellow-400 text-6xl mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Grow Together?
              </h2>
              <p className="text-indigo-200 text-lg mb-6">
                Join our partner network and unlock new opportunities. Fill out the form and our team will reach out within 48 hours.
              </p>
              <div className="space-y-3">
                {[
                  "Dedicated partner success manager",
                  "Marketing & sales collateral",
                  "Priority technical support",
                  "Performance bonuses"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    <FaCheckCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Partner Application</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <FaUserFriends className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name *"
                      required
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                  <div className="relative sm:col-span-2">
                    <select
                      name="partnerType"
                      required
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white appearance-none"
                    >
                      <option value="">Select Partnership Type *</option>
                      <option value="channel">Channel Partner</option>
                      <option value="technology">Technology Partner</option>
                      <option value="consulting">Consulting Partner</option>
                      <option value="affiliate">Affiliate Partner</option>
                    </select>
                    <FaHandshake className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative sm:col-span-2">
                    <FaComments className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                    <textarea
                      name="message"
                      placeholder="Tell us about your business..."
                      rows="3"
                      onChange={handleChange}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Submit Application 
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <p className="text-center text-xs text-gray-500">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}