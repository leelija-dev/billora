// about/page.jsx
"use client";

import { useState, useEffect } from "react";
import { 
  FaSeedling, FaChartLine, FaMoneyBillWave, FaMapMarkerAlt, 
  FaBullseye, FaHeart, FaBalanceScale, FaTrophy, FaStar,
  FaUsers, FaBuilding, FaRupeeSign, FaRocket, FaPlay,
  FaArrowRight, FaCheckCircle, FaAward, FaClock,
  FaMedal, FaCalendarAlt, FaRegSmile, FaHandshake,
  FaQuoteLeft, FaQuoteRight, FaLinkedin, FaTwitter,
  FaEnvelope, FaPhone, FaGlobe, FaChartBar, FaStore,
  FaUtensils, FaPills, FaWrench, FaMobile
} from 'react-icons/fa';
import { 
  MdVerified, MdEmojiEvents, MdLocationOn, MdPeople,
  MdBusinessCenter, MdAttachMoney, MdTimeline, MdStar,
  MdStarHalf, MdStars
} from 'react-icons/md';
import { 
  RiTeamLine, RiUserStarLine, RiLightbulbFlashLine,
  RiShieldStarLine, RiAwardLine, RiCalendarTodoLine,
  RiArrowRightSLine
} from 'react-icons/ri';



export default function AboutPage() {
  const [activeCard, setActiveCard] = useState(null);

  const milestones = [
    { year: "2020", title: "The problem was personal", description: "We saw it firsthand. Small businesses, big billing pain, and we built the fix ourself.", icon: <FaSeedling className="text-3xl" />, stat: "Founded, 2020" },
    { year: "10,000+", title: "India said yes — fast", description: "Word spread without ads. Businesses switched because it worked. 10,000+ users. Year one done.", icon: <FaChartLine className="text-3xl" />, stat: "10,000+ active businesses" },
    { year: "$1M", title: "Capital to match the ambition", description: "Proof secured the funding. $1M raised to scale fast. Product deepened. Team grew.", icon: <FaMoneyBillWave className="text-3xl" />, stat: "$1M raised" },
    { year: "28 states", title: "Pan-India. No state left behind", description: "From Ludhiana to Chennai. 28 states. Every market. Bharat wasn't a tagline — it was the plan.", icon: <FaMapMarkerAlt className="text-3xl" />, stat: "28 states covered" },
    { year: "1M+", title: "A number that speaks for itself", description: "1M+ transactions. Every month. 70,000+ businesses. ₹15,000 Cr moved. The mission became the milestone.", icon: <FaBullseye className="text-3xl" />, stat: "1M+ transactions / month" },
  ];

  const team = [
    { name: "Rajesh Sharma", role: "Founder & CEO", image: "👨‍💼", bio: "Ex-Google, IIT Bombay", expertise: "Product & Strategy", years: "15+" },
    { name: "Priya Patel", role: "CTO", image: "👩‍💻", bio: "Ex-Amazon, Stanford", expertise: "AI & Cloud", years: "12+" },
    { name: "Amit Kumar", role: "Head of Sales", image: "👨‍💼", bio: "15+ years in B2B SaaS", expertise: "Revenue Growth", years: "15+" },
    { name: "Neha Singh", role: "Customer Success", image: "👩‍💼", bio: "Passionate about businesses", expertise: "Client Relations", years: "10+" },
  ];

  const industries = [
    { name: "Restaurants", icon: <FaUtensils className="text-4xl" />, count: "15,000+", growth: "+45%", bg: "bg-blue-50" },
    { name: "Retail Stores", icon: <FaStore className="text-4xl" />, count: "20,000+", growth: "+62%", bg: "bg-cyan-50" },
    { name: "Pharmacies", icon: <FaPills className="text-4xl" />, count: "8,000+", growth: "+38%", bg: "bg-indigo-50" },
    { name: "Stock Market", icon: <FaChartLine className="text-4xl" />, count: "5,000+", growth: "+89%", bg: "bg-sky-50" },
    { name: "Services", icon: <FaWrench className="text-4xl" />, count: "12,000+", growth: "+51%", bg: "bg-blue-50" },
    { name: "Others", icon: <FaBuilding className="text-4xl" />, count: "10,000+", growth: "+43%", bg: "bg-cyan-50" },
  ];

  const impact = [
    { number: "70,000+", label: "Businesses Empowered", icon: <FaBuilding className="text-3xl" />, trend: "+156%" },
    { number: "28", label: "States Covered", icon: <FaGlobe className="text-3xl" />, trend: "Pan India" },
    { number: "₹15,000 Cr+", label: "Transaction Value", icon: <FaRupeeSign className="text-3xl" />, trend: "+89%" },
    { number: "500+", label: "Team Members", icon: <FaUsers className="text-3xl" />, trend: "+200%" },
  ];

  const values = [
    { title: "Simplicity", desc: "Constantly pushing boundaries to bring cutting-edge solutions", icon: <RiLightbulbFlashLine className="text-3xl" />, color: "blue" },
    { title: "Customer-centric", desc: "Our customers' success is our success", icon: <FaHeart className="text-3xl" />, color: "red" },
    { title: "Accuracy", desc: "Transparency and honesty in everything we do", icon: <FaBalanceScale className="text-3xl" />, color: "green" },
    { title: "Compliance", desc: "Striving for the highest quality in every aspect", icon: <FaTrophy className="text-3xl" />, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Professional Design */}
      <div className="relative bg-gradient-to-r from-blue-700 to-cyan-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-[1]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">Est. 2020</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
               Digitalizing Small 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Businesses Across 
                </span>
                The Nation
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Accelerating India’s SMBs with intuitive, accessible, affordable, and real-time inventory management software
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Our Story
                  <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                  <FaPlay className="w-4 h-4" />
                  Watch Video
                </button>
              </div>
            </div>
            
            {/* Right Column - Stats Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {impact.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="text-white mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-blue-100 text-xs mt-1">{stat.label}</div>
                    <div className="text-green-400 text-xs font-semibold mt-2">{stat.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission/Vision/Values - Interactive Cards */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 rounded-lg px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
          Our Mission, Vision, & Values
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
           What Matters to Us
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
           Powered by Intent, Designed to Deliver
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission Card */}
          <div 
            className="group relative cursor-pointer"
            onMouseEnter={() => setActiveCard('mission')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl transition-all duration-500 ${activeCard === 'mission' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-xl p-8 shadow-md border border-gray-100 transition-all duration-500 hover:shadow-xl ${activeCard === 'mission' ? 'transform -translate-y-2' : ''}`}>
              <div className="text-blue-600 mb-4">
                <FaBullseye className="text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
               To empower Indian SMBs with an automated & compliant digital invoicing & stock control program for simplified financial management & complete regulatory adherence. 
              </p>
              <div className={`mt-4 text-blue-600 font-semibold transition-all duration-300 flex items-center gap-2 ${activeCard === 'mission' ? 'opacity-100' : 'opacity-0'}`}>
                Learn more <FaArrowRight className="text-sm" />
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div 
            className="group relative cursor-pointer"
            onMouseEnter={() => setActiveCard('vision')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl transition-all duration-500 ${activeCard === 'vision' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-xl p-8 shadow-md border border-gray-100 transition-all duration-500 hover:shadow-xl ${activeCard === 'vision' ? 'transform -translate-y-2' : ''}`}>
              <div className="text-blue-600 mb-4">
                <RiAwardLine className="text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                Bridging the gap between compliance & business insights with zero effort technology that transforms manual accounting and stock management operations into data-driven automation.
              </p>
              <div className={`mt-4 text-blue-600 font-semibold transition-all duration-300 flex items-center gap-2 ${activeCard === 'vision' ? 'opacity-100' : 'opacity-0'}`}>
                Learn more <FaArrowRight className="text-sm" />
              </div>
            </div>
          </div>

          {/* Values Card */}
          <div 
            className="group relative cursor-pointer"
            onMouseEnter={() => setActiveCard('values')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl transition-all duration-500 ${activeCard === 'values' ? 'opacity-100 scale-105' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-xl p-8 shadow-md border border-gray-100 transition-all duration-500 hover:shadow-xl ${activeCard === 'values' ? 'transform -translate-y-2' : ''}`}>
              <div className="text-blue-600 mb-4">
                <MdStars className="text-5xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Values</h3>
              <div className="space-y-3">
                {values.map((value, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm group/item hover:translate-x-1 transition-all duration-300 cursor-pointer">
                    <div className={`text-${value.color === 'blue' ? 'blue' : value.color === 'red' ? 'red' : value.color === 'green' ? 'green' : 'purple'}-500`}>
                      {value.icon}
                    </div>
                    <span>{value.title}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-4 text-blue-600 font-semibold transition-all duration-300 flex items-center gap-2 ${activeCard === 'values' ? 'opacity-100' : 'opacity-0'}`}>
                Explore values <FaArrowRight className="text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industries We Serve */}
      <div className="bg-blue-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-4 py-1 text-sm font-semibold text-blue-600 mb-4 shadow-sm">
              <FaChartBar className="text-sm" /> Our Industry Expertise  
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted Across The 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
               Indian Business Landscape
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {industries.map((industry, idx) => (
              <div key={idx} className="group text-center">
                <div className={`${industry.bg} rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 cursor-pointer`}>
                  <div className="text-blue-600 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {industry.icon}
                  </div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{industry.name}</div>
                  <div className="text-xl font-bold text-blue-600">{industry.count}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">{industry.growth}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300">
              <FaTrophy className="text-2xl text-yellow-500" />
              <span className="text-gray-700">Trusted by <span className="font-bold text-blue-600">70,000+</span> businesses across India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey - Timeline */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 rounded-lg px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
            Our Timeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
           The Fast Bill story
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
           5 years. 1 mission. Built for India.
          </p>
        </div>

        <div className="relative">
          {milestones.map((milestone, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-blue-600">
                      {milestone.icon}
                    </div>
                    <div>
                      <div className="text-blue-600 font-bold text-sm">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600">{milestone.description}</p>
                  <div className="mt-3 inline-block bg-blue-50 rounded-lg px-3 py-1 text-xs font-semibold text-blue-600">
                    {milestone.stat}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10 relative">
                  {idx + 1}
                </div>
                {idx < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
                )}
              </div>
              <div className="flex-1 hidden md:block"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Leadership Team */}
      {/* <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 rounded-lg px-4 py-1 text-sm font-semibold text-blue-600 mb-4">
              Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              Passionate experts dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <div className="relative bg-white rounded-xl p-6 text-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="relative inline-block">
                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">{member.image}</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs mb-3">{member.bio}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block bg-gray-100 rounded-lg px-2 py-1 text-xs text-gray-600">
                      {member.expertise}
                    </span>
                    <span className="inline-block bg-blue-50 rounded-lg px-2 py-1 text-xs text-blue-600">
                      {member.years} exp
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FaRocket className="text-5xl text-yellow-400 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready for The Ultimate Business Automation?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
               Streamline GST return filing & inventory management with our integrated billing and inventory software
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-2">
                  <FaStar className="text-yellow-400 text-2xl" />
                  <FaStar className="text-yellow-400 text-2xl" />
                  <FaStar className="text-yellow-400 text-2xl" />
                  <FaStar className="text-yellow-400 text-2xl" />
                  <FaStar className="text-yellow-400 text-2xl" />
                </div>
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-blue-100 text-xs mt-1">500+ reviews</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                <FaClock className="text-3xl text-white mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-blue-100 text-xs mt-1">Uptime SLA</div>
                <div className="text-blue-100 text-xs">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}