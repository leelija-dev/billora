// join-team/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaTags, 
  FaMoneyBillWave, FaArrowRight, FaRocket, FaHeart, 
  FaHome, FaChartLine, FaUserFriends, FaLightbulb,
  FaShieldAlt, FaHandshake, FaSmile, FaStar, FaStarHalfAlt,
  FaUsers, FaGlobe, FaClock, FaCalendarAlt, FaFilter,
  FaSearch, FaChevronRight, FaBuilding, FaLaptopCode,
  FaTrophy, FaGift, FaPlane, FaBookOpen, FaMedkit,
  FaRegSmile, FaAward, FaLeaf, FaMicrophone, FaVideo,
  FaCoffee, FaPaintBrush, FaChartBar, FaCode, FaCloud,
  FaDatabase, FaMobile, FaServer, FaTools, FaWhatsapp,
  FaLinkedin, FaTwitter, FaGithub, FaYoutube, FaInstagram
} from 'react-icons/fa';
import { 
  HiOutlineLocationMarker, HiOutlineOfficeBuilding, HiOutlineUserGroup 
} from 'react-icons/hi';
import { 
  MdLocationOn, MdWork, MdSchool, MdAttachMoney, MdArrowForward,
  MdStar, MdStarHalf, MdPeople, MdLanguage, MdAccessTime,
  MdEvent, MdFilterList, MdSearch, MdChevronRight, MdBusinessCenter,
  MdComputer, MdEmojiEvents, MdCardGiftcard, MdFlightTakeoff,
  MdMenuBook, MdHealthAndSafety, MdSentimentSatisfied, MdEmojiObjects,
  MdVerified, MdPark, MdMic, MdVideocam, MdFreeBreakfast,
  MdBrush, MdBarChart, MdCode, MdCloud, MdStorage, MdPhoneAndroid,
  MdDevices, MdBuild, MdChat
} from 'react-icons/md';
import { 
  RiRemoteControlLine, RiTeamLine, RiUserStarLine, RiLightbulbFlashLine,
  RiShieldStarLine, RiHandHeartLine, RiSmileLine, RiStarSmileFill,
  RiGroupLine, RiGlobalLine, RiTimeLine, RiCalendarTodoLine,
  RiFilterLine, RiSearchLine, RiArrowRightSLine, RiBuildingLine,
  RiComputerLine, RiTrophyLine, RiGiftLine, RiPlaneLine, RiBookOpenLine,
  RiHospitalLine, RiEmotionHappyLine, RiAwardLine, RiLeafLine,
  RiMicrophoneLine, RiVideoLine, RiCupLine, RiPaletteLine, RiBarChartLine,
  RiCodeBoxLine, RiCloudLine, RiDatabaseLine, RiSmartphoneLine,
  RiDeviceLine, RiSettingsLine, RiWhatsappLine, RiLinkedinBoxLine,
  RiTwitterXLine, RiGithubLine, RiYoutubeLine, RiInstagramLine
} from 'react-icons/ri';
import { SiGooglemaps } from 'react-icons/si';

export default function JoinTeamPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("openings");
  const [hoveredJob, setHoveredJob] = useState(null);

  // Benefits data
  const benefits = [
    { icon: <FaHome className="text-3xl lg:text-4xl" />, title: "Remote First", desc: "Work from anywhere", color: "from-blue-500 to-cyan-500" },
    { icon: <FaMoneyBillWave className="text-3xl lg:text-4xl" />, title: "Competitive Salary", desc: "Best in industry", color: "from-emerald-500 to-teal-500" },
    { icon: <FaChartLine className="text-3xl lg:text-4xl" />, title: "ESOPs", desc: "Own the company", color: "from-purple-500 to-pink-500" },
    { icon: <FaMedkit className="text-3xl lg:text-4xl" />, title: "Health Insurance", desc: "For you and family", color: "from-red-500 to-orange-500" },
    { icon: <FaBookOpen className="text-3xl lg:text-4xl" />, title: "Learning Budget", desc: "₹1000/year for courses", color: "from-indigo-500 to-blue-500" },
    { icon: <FaPlane className="text-3xl lg:text-4xl" />, title: "Unlimited PTO", desc: "Take time when needed", color: "from-rose-500 to-pink-500" },
  ];

  // Values data
  const values = [
    { title: "Customer First", desc: "Everything we do is for our customers", icon: <FaHeart className="text-xl lg:text-2xl" />, color: "bg-blue-50" },
    { title: "Innovation", desc: "Constantly improve and innovate", icon: <FaLightbulb className="text-xl lg:text-2xl" />, color: "bg-purple-50" },
    { title: "Integrity", desc: "Do the right thing, always", icon: <FaShieldAlt className="text-xl lg:text-2xl" />, color: "bg-emerald-50" },
    { title: "Teamwork", desc: "Together we achieve more", icon: <FaUsers className="text-xl lg:text-2xl" />, color: "bg-amber-50" },
  ];

  // Stats data
  const stats = [
    { value: "50+", label: "Team Members", icon: <FaUsers className="text-2xl lg:text-3xl" />, gradient: "from-blue-600 to-cyan-600" },
    { value: "0", label: "Open Roles", icon: <FaBriefcase className="text-2xl lg:text-3xl" />, gradient: "from-purple-600 to-pink-600" },
    { value: "4.9", label: "Glassdoor Rating", icon: <FaStar className="text-2xl lg:text-3xl" />, gradient: "from-yellow-500 to-orange-500" },
    { value: "100%", label: "Remote Friendly", icon: <FaGlobe className="text-2xl lg:text-3xl" />, gradient: "from-emerald-500 to-teal-500" }
  ];

  const handleContactClick = () => {
    router.push("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 overflow-x-hidden">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        {/* Animated background elements - disabled on mobile/tablet */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl lg:animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl lg:animate-pulse lg:delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 rounded-full blur-3xl lg:animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
            <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
              <span className="lg:animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-green-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium">We're hiring! Join our team</span>
          </div>
          <h1 className="text-h1-xs sm:text-h1-sm md:text-h1-md lg:text-h1-lg xl:text-h1-2xl font-bold mb-4 sm:mb-6 leading-tight">
            Join Our Team
          </h1>
          <p className="text-p-xs sm:text-p-sm md:text-p-md text-blue-100 max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
            Help us empower millions of small businesses across India
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <button 
              onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-white text-gray-900 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 lg:transform lg:hover:scale-105 flex items-center justify-center gap-2 text-a-sm sm:text-a-md"
            >
              View Openings
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:group-hover:translate-x-1 transition" />
            </button>
            <button className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 text-a-sm sm:text-a-md">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Curved bottom separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 32L48 42.7C96 53.3 192 74.7 288 74.7C384 74.7 480 53.3 576 42.7C672 32 768 32 864 42.7C960 53.3 1056 74.7 1152 74.7C1248 74.7 1344 53.3 1392 42.7L1440 32V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V32Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      {/* Stats Section with Enhanced Cards - disabled hover animations on mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-12 sm:mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-4 md:p-5 text-center lg:transform lg:hover:scale-105 transition-all duration-300 border border-gray-100">
              <div className="flex justify-center mb-1 sm:mb-2 text-blue-600">
                {stat.icon}
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-text-xs sm:text-text-sm font-medium mt-0.5 sm:mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section with Enhanced Cards - disabled hover animations on mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="text-blue-600 font-semibold text-text-xs sm:text-text-sm uppercase tracking-wider">The Billora Way</span>
          <h2 className="text-h2-xs sm:text-h2-sm md:text-h2-md lg:text-h2-xl font-bold text-gray-900 mt-2 mb-3 sm:mb-4">
            Our Core Values
          </h2>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {values.map((value, idx) => (
            <div key={idx} className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 lg:transform lg:hover:-translate-y-1 border border-gray-100">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${value.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 lg:group-hover:scale-110 transition-transform duration-300 text-blue-600`}>
                {value.icon}
              </div>
              <h3 className="text-h3-xs sm:text-h3-sm font-bold mb-1.5 sm:mb-2 text-gray-900">{value.title}</h3>
              <p className="text-text-xs sm:text-text-sm text-gray-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section with Enhanced Cards - disabled hover animations on mobile */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-h2-xs sm:text-h2-sm md:text-h2-md lg:text-h2-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Benefits & Perks
            </h2>
            <p className="text-text-sm sm:text-text-md text-gray-600 max-w-2xl mx-auto">We believe happy teams build great products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="group relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 lg:group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 lg:transform lg:group-hover:scale-110 transition-transform duration-300 inline-block text-blue-600">
                    {benefit.icon}
                  </div>
                  <h3 className="text-h4-xs sm:text-h4-sm font-bold mb-1.5 sm:mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-text-xs sm:text-text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Openings Section with No Posts Available */}
      <div id="openings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-h2-xs sm:text-h2-sm md:text-h2-md lg:text-h2-xl font-bold text-gray-900 mb-2 sm:mb-3">
            Current Openings
          </h2>
          <p className="text-text-sm sm:text-text-md text-gray-600 max-w-2xl mx-auto">
            Join us in our mission to transform small businesses across India
          </p>
        </div>

        {/* No Posts Available Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
          <div className="px-5 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
              <FaBriefcase className="text-3xl sm:text-4xl text-gray-400" />
            </div>
            <h3 className="text-h3-xs sm:text-h3-sm md:text-h3-md font-semibold text-gray-900 mb-2 sm:mb-3">
              No Open Positions Available
            </h3>
            <p className="text-text-xs sm:text-text-sm text-gray-500 max-w-md mx-auto mb-6 sm:mb-8">
              We don't have any open positions right now, but we're always interested in hearing from talented individuals.
            </p>
            <button 
              onClick={handleContactClick}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-a-sm sm:text-a-md"
            >
              Contact Us
              <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section with Enhanced Design - disabled hover animations on mobile */}
      <div className="relative mx-4 sm:mx-6 lg:mx-auto max-w-6xl rounded-2xl sm:rounded-3xl overflow-hidden my-12 sm:my-16 lg:my-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-5 sm:px-8 py-10 sm:py-12 md:py-14 lg:py-16 text-center text-white">
          <h2 className="text-h3-xs sm:text-h3-sm md:text-h3-lg lg:text-h3-xl font-bold mb-3 sm:mb-4">
            Don't see the right role?
          </h2>
          <p className="text-text-xs sm:text-text-sm md:text-text-md text-blue-100 max-w-xl mx-auto mb-6 sm:mb-8">
            We're always looking for talented people. Send us your resume and we'll reach out when something matches.
          </p>
          <button 
            onClick={handleContactClick}
            className="bg-white text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 lg:transform lg:hover:scale-105 inline-flex items-center gap-2 text-a-sm sm:text-a-md"
          >
            Contact Us Now
            <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}