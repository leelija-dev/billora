// bookdemo/page.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Phone, 
  Building, 
  MessageSquare,
  CheckCircle,
  Clock,
  CalendarDays,
  RotateCw,
  Globe,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Client-side only wrapper component to prevent hydration mismatch
const ClientTimeOnly = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <span className="text-sm sm:text-base font-mono font-semibold text-[#0F172A]">--:--:-- --</span>;
  }

  return <>{children}</>;
};

const AppointmentPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showTimeZonePicker, setShowTimeZonePicker] = useState(false);
  const [showEnquiryDropdown, setShowEnquiryDropdown] = useState(false);
  const [realTimeCurrentDate, setRealTimeCurrentDate] = useState(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState("Asia/Kolkata");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    businessName: "",
    enquiryType: "Product demo"
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const enquiryDropdownRef = useRef(null);

  // Time zones list
  const timeZones = [
    { name: "India Standard Time (IST)", value: "Asia/Kolkata", offset: "+5:30" },
    { name: "Eastern Time (ET)", value: "America/New_York", offset: "-4:00" },
    { name: "Pacific Time (PT)", value: "America/Los_Angeles", offset: "-7:00" },
    { name: "Central Time (CT)", value: "America/Chicago", offset: "-5:00" },
    { name: "Mountain Time (MT)", value: "America/Denver", offset: "-6:00" },
    { name: "Greenwich Mean Time (GMT)", value: "Europe/London", offset: "+1:00" },
    { name: "Central European Time (CET)", value: "Europe/Paris", offset: "+2:00" },
    { name: "Eastern European Time (EET)", value: "Europe/Athens", offset: "+3:00" },
    { name: "Gulf Standard Time (GST)", value: "Asia/Dubai", offset: "+4:00" },
    { name: "Singapore Time (SGT)", value: "Asia/Singapore", offset: "+8:00" },
    { name: "Australia Eastern Time (AET)", value: "Australia/Sydney", offset: "+10:00" },
    { name: "New Zealand Time (NZT)", value: "Pacific/Auckland", offset: "+12:00" }
  ];

  // Enquiry types for custom dropdown
  const enquiryTypes = [
    { value: "Product demo", icon: "🚀", color: "#4461F2" },
    { value: "Pricing enquiry", icon: "💰", color: "#10B981" },
    { value: "Technical support", icon: "🔧", color: "#F59E0B" },
    { value: "Partnership", icon: "🤝", color: "#9E5CF2" },
    { value: "Other", icon: "❓", color: "#6B7280" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (enquiryDropdownRef.current && !enquiryDropdownRef.current.contains(event.target)) {
        setShowEnquiryDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update real-time current date every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock booked dates
  const bookedDates = [1, 2, 3, 10, 11, 16, 17, 20, 21, 24];
  
  // Mock available dates - requires 1 day advance booking
  const getAvailableDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Create tomorrow's date (requires 1 day advance booking)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const available = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(year, month, day);
      dateToCheck.setHours(0, 0, 0, 0);
      
      // Only allow dates from tomorrow onwards
      if (dateToCheck >= tomorrow) {
        if (!bookedDates.includes(day)) {
          available.push(day);
        }
      }
    }
    
    return available;
  };

  const availableDates = getAvailableDates();
  
  // Base time slots in IST
  const baseTimeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Convert time to different time zone
  const convertTimeToTimeZone = (timeStr, fromZone, toZone) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const getOffset = (zone) => {
      const offsets = {
        'Asia/Kolkata': 330,
        'America/New_York': -240,
        'America/Los_Angeles': -420,
        'America/Chicago': -300,
        'America/Denver': -360,
        'Europe/London': 60,
        'Europe/Paris': 120,
        'Europe/Athens': 180,
        'Asia/Dubai': 240,
        'Asia/Singapore': 480,
        'Australia/Sydney': 600,
        'Pacific/Auckland': 720
      };
      return offsets[zone] || 0;
    };
    
    const fromOffset = getOffset(fromZone);
    const toOffset = getOffset(toZone);
    
    const utcHours = hours - (fromOffset / 60);
    let targetHours = utcHours + (toOffset / 60);
    
    if (targetHours < 0) targetHours += 24;
    if (targetHours >= 24) targetHours -= 24;
    
    const targetPeriod = targetHours >= 12 ? 'PM' : 'AM';
    let displayHours = targetHours % 12;
    displayHours = displayHours === 0 ? 12 : displayHours;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${targetPeriod}`;
  };

  const getTimeSlotsForZone = () => {
    return baseTimeSlots.map(slot => 
      convertTimeToTimeZone(slot, 'Asia/Kolkata', selectedTimeZone)
    );
  };

  const timeSlots = getTimeSlotsForZone();

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    // Note: We don't reset selections when changing month
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    // Note: We don't reset selections when changing month
  };

  const handleResetToCurrent = () => {
    // ONLY reset the calendar view to current month/year
    // Does NOT affect selected date, time, form, or any other state
    setCurrentDate(new Date());
    setShowMonthPicker(false);
    // Keep all other state intact:
    // - selectedDate remains the same
    // - selectedTime remains the same
    // - showForm remains the same
    // - formData remains the same
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
    // Note: We don't reset selections when changing month via picker
  };

  const handleYearChange = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    if (availableDates.includes(day)) {
      setSelectedDate(day);
      setSelectedTime(null);
      setShowForm(false);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleProceedToForm = () => {
    if (selectedDate && selectedTime) {
      setShowForm(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnquirySelect = (type) => {
    setFormData(prev => ({
      ...prev,
      enquiryType: type
    }));
    setShowEnquiryDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setShowForm(false);
      setFormData({
        name: "",
        mobile: "",
        businessName: "",
        enquiryType: "Product demo"
      });
    }, 3000);
  };

  const isAvailable = (day) => {
    return day ? availableDates.includes(day) : false;
  };

  const isBooked = (day) => {
    if (!day) return false;
    
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dateToCheck >= today && bookedDates.includes(day);
  };

  const isPastDate = (day) => {
    if (!day) return false;
    
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Consider today as past for booking (need 1 day advance)
    return dateToCheck <= today;
  };

  const isCurrentDate = (day) => {
    if (!day) return false;
    return day === realTimeCurrentDate.getDate() && 
           currentDate.getMonth() === realTimeCurrentDate.getMonth() && 
           currentDate.getFullYear() === realTimeCurrentDate.getFullYear();
  };

  const days = getMonthData();

  const formattedCurrentDate = realTimeCurrentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatTimeInZone = (date, timeZone) => {
    return date.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: '2-digit',
      hour12: true
    });
  };

  const currentTimeZone = timeZones.find(tz => tz.value === selectedTimeZone) || timeZones[0];
  const selectedEnquiry = enquiryTypes.find(e => e.value === formData.enquiryType) || enquiryTypes[0];

  // Calculate tomorrow's date for display
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F0F7FF] relative">
      <Navbar />
      
      <div className="py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">

        <style jsx>{`
          .ripple-hover {
            position: relative;
            overflow: hidden;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
          }

          .ripple-hover::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
            transition: transform 0.6s, opacity 0.6s;
            pointer-events: none;
            z-index: 0;
          }

          .ripple-hover:hover::before {
            transform: translate(-50%, -50%) scale(10);
            opacity: 1;
          }

          .ripple-hover span {
            position: relative;
            z-index: 1;
          }
        `}</style>
        
        <div className="max-w-7xl xl:max-w-screen-xl mx-auto">
          
          {/* Header with Real-time Date/Time */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] mb-3">
              Book Your Free Demo
            </h1>
            
            {/* Real-time Current Date/Time Display */}
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center justify-center gap-3 bg-white px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-md border border-[#4461F2] mb-4 max-w-[95%] sm:max-w-full mx-auto"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#4461F2]" />
                <span className="text-sm sm:text-base font-semibold text-[#0F172A]">
                  {formattedCurrentDate}
                </span>
              </div>
              <div className="w-px h-5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#9E5CF2]" />
                {/* Use ClientTimeOnly wrapper to prevent hydration mismatch */}
                <ClientTimeOnly>
                  <span className="text-sm sm:text-base font-mono font-semibold text-[#0F172A]">
                    {formatTimeInZone(realTimeCurrentDate, selectedTimeZone)}
                  </span>
                </ClientTimeOnly>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-[#4461F2] rounded-full"
              />
            </motion.div>
            
            {/* 1-Day Advance Booking Notice */}
            <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg max-w-2xl mx-auto">
              <AlertCircle size={18} />
              <p className="text-sm sm:text-base font-medium">
                Bookings require 1 day advance notice. Today's slots are unavailable.
              </p>
            </div>
          </motion.div>

          {/* Simple 3-Step Process - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] text-center mb-4">
              Simple 3-Step Process
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              {/* Step 1 */}
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-gray-200 w-full sm:w-auto">
                <div className="w-12 h-12 bg-[#4461F2] bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Pick Date</h3>
                  <p className="text-sm text-gray-600">Choose from available dates</p>
                </div>
              </div>

              {/* Arrow for desktop */}
              <div className="hidden sm:block text-2xl text-[#4461F2]">→</div>

              {/* Step 2 */}
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-gray-200 w-full sm:w-auto">
                <div className="w-12 h-12 bg-[#9E5CF2] bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Choose Time</h3>
                  <p className="text-sm text-gray-600">Select your preferred slot</p>
                </div>
              </div>

              {/* Arrow for desktop */}
              <div className="hidden sm:block text-2xl text-[#9E5CF2]">→</div>

              {/* Step 3 */}
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-md border border-gray-200 w-full sm:w-auto">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4461F2] to-[#9E5CF2] bg-opacity-10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Get Demo</h3>
                  <p className="text-sm text-gray-600">Live demo with our expert</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Container - 60/40 Split */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* Left Side - Calendar (60%) - Made smaller */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:w-[60%] bg-white rounded-xl shadow-lg p-4 sm:p-5 border border-gray-200"
            >
              {/* Calendar Header - More compact */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-1">
                    <CalendarDays size={20} className="text-[#4461F2]" />
                    <span>Select Date</span>
                  </h2>
                  
                  {/* Time Zone Selector - Smaller */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTimeZonePicker(!showTimeZonePicker)}
                      className="flex items-center gap-1 px-2 py-1.5 bg-[#F0F7FF] rounded-lg text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-[#4461F2] hover:text-white transition-colors group"
                    >
                      <Globe size={14} className="group-hover:text-white" />
                      <span className="hidden md:inline">{currentTimeZone.name}</span>
                      <span className="md:hidden">{currentTimeZone.offset}</span>
                      <ChevronDown size={12} className={`transition-transform ${showTimeZonePicker ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Time Zone Picker Popup */}
                    <AnimatePresence>
                      {showTimeZonePicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-20 min-w-[220px] max-h-60 overflow-y-auto"
                        >
                          {timeZones.map((tz) => (
                            <button
                              key={tz.value}
                              onClick={() => {
                                setSelectedTimeZone(tz.value);
                                setShowTimeZonePicker(false);
                              }}
                              className={`
                                w-full text-left px-2 py-1.5 rounded-md text-xs font-medium transition-colors
                                ${selectedTimeZone === tz.value 
                                  ? 'bg-[#4461F2] text-white' 
                                  : 'hover:bg-[#F0F7FF] text-[#0F172A]'
                                }
                              `}
                            >
                              <div className="flex justify-between items-center">
                                <span>{tz.name}</span>
                                <span className="text-xs opacity-70">UTC{tz.offset}</span>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Month Navigation - More compact */}
                <div className="flex items-center gap-1">
                  {/* Month/Year Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMonthPicker(!showMonthPicker)}
                      className="px-3 py-1.5 bg-[#F0F7FF] rounded-lg text-sm font-semibold text-[#0F172A] hover:bg-[#4461F2] hover:text-white transition-colors min-w-[120px]"
                    >
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </button>
                    
                    {/* Month Picker Popup */}
                    <AnimatePresence>
                      {showMonthPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-20 min-w-[240px]"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <button
                              onClick={() => handleYearChange(-1)}
                              className="p-1 hover:bg-[#F0F7FF] rounded"
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <span className="font-bold text-base text-[#0F172A]">{currentDate.getFullYear()}</span>
                            <button
                              onClick={() => handleYearChange(1)}
                              className="p-1 hover:bg-[#F0F7FF] rounded"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {monthNames.map((month, index) => (
                              <button
                                key={month}
                                onClick={() => handleMonthSelect(index)}
                                className={`
                                  p-2 text-xs font-semibold rounded-lg transition-colors
                                  ${currentDate.getMonth() === index 
                                    ? 'bg-[#4461F2] text-white' 
                                    : 'hover:bg-[#F0F7FF] text-[#0F172A]'
                                  }
                                `}
                              >
                                {month.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Reset Button - Now only resets calendar view, not selections */}
                  <button
                    onClick={handleResetToCurrent}
                    className="p-1.5 bg-[#F0F7FF] rounded-lg hover:bg-[#4461F2] hover:text-white transition-colors"
                    title="Reset calendar to current month"
                  >
                    <RotateCw size={16} />
                  </button>

                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-[#F0F7FF] rounded-lg transition-colors text-[#0F172A]"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-[#F0F7FF] rounded-lg transition-colors text-[#0F172A]"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Day Names - Smaller */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-bold text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days - Smaller squares */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const available = isAvailable(day);
                  const booked = isBooked(day);
                  const past = isPastDate(day);
                  const current = isCurrentDate(day);
                  const isSelected = selectedDate === day;

                  let bgColor = "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed";
                  
                  if (available && !past) {
                    bgColor = isSelected
                      ? 'bg-[#4461F2] text-white shadow-lg scale-105 ring-2 ring-[#9E5CF2] cursor-pointer'
                      : 'bg-white text-[#0F172A] border-2 border-[#4461F2] cursor-pointer hover:bg-[#4461F2] hover:text-white font-bold ripple-hover';
                  } else if (booked || past) {
                    bgColor = 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed line-through opacity-70';
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !past && !booked && handleDateSelect(day)}
                      disabled={past || booked || !day}
                      className={`
                        relative aspect-square flex items-center justify-center rounded-lg text-sm sm:text-base font-bold
                        transition-all duration-200
                        ${!day ? 'invisible' : ''}
                        ${bgColor}
                      `}
                    >
                      <span className="relative z-10">{day}</span>
                      
                      {available && !isSelected && !past && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#4461F2] rounded-full z-10" />
                      )}
                      
                      {current && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#9E5CF2] rounded-full border-2 border-white z-10" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend - More compact */}
              <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-200">
                {[
                  { color: "bg-[#4461F2]", label: "Available" },
                  { color: "bg-[#4461F2] ring-2 ring-[#9E5CF2]", label: "Selected" },
                  { color: "bg-[#9E5CF2] w-3 h-3 rounded-full", label: "Today" },
                  { color: "bg-gray-200 line-through", label: "Booked" },
                  { color: "bg-gray-200 opacity-70", label: "Past" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className={`w-3 h-3 ${item.color} rounded-sm`}></div>
                    <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Working Panel (40%) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:w-[40%] bg-white rounded-xl shadow-lg p-5 border border-gray-200 min-h-[500px]"
            >
              <AnimatePresence mode="wait">
                {!selectedDate && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-6"
                  >
                    <Calendar className="w-14 h-14 text-[#4461F2] mb-3 opacity-50" />
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                      Pick a Date
                    </h3>
                    <p className="text-sm text-gray-600 max-w-sm">
                      Select an available date from the calendar to see time slots
                    </p>
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs font-medium text-amber-700">
                        ⏰ Next available: {formattedTomorrow}
                      </p>
                    </div>
                  </motion.div>
                )}

                {selectedDate && !selectedTime && (
                  <motion.div
                    key="time"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-1">
                        <Clock size={20} className="text-[#4461F2]" />
                        <span>Available Slots</span>
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedDate(null);
                          setSelectedTime(null);
                        }}
                        className="flex items-center gap-1 text-sm font-semibold text-[#4461F2] hover:text-[#9E5CF2] transition-colors"
                      >
                        <ChevronLeft size={18} />
                        <span>Back</span>
                      </button>
                    </div>
                    
                    <div className="mb-3 p-3 bg-[#F0F7FF] rounded-lg">
                      <p className="text-base font-bold text-[#0F172A]">
                        {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </p>
                      <p className="text-xs font-semibold text-gray-600 mt-1">
                        {currentTimeZone.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTimeSelect(time)}
                          className={`
                            py-3 px-2 rounded-lg text-sm font-bold transition-all
                            ${selectedTime === time 
                              ? 'bg-[#4461F2] text-white shadow-lg scale-105 ring-2 ring-[#9E5CF2]' 
                              : 'bg-[#F0F7FF] text-[#0F172A] border-2 border-[#4461F2] hover:bg-[#4461F2] hover:text-white'
                            }
                          `}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedDate && selectedTime && !showForm && (
                  <motion.div
                    key="proceed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">Selected Slot</h3>
                      <button
                        onClick={() => {
                          setSelectedTime(null);
                        }}
                        className="flex items-center gap-1 text-sm font-semibold text-[#4461F2] hover:text-[#9E5CF2] transition-colors"
                      >
                        <ChevronLeft size={18} />
                        <span>Back</span>
                      </button>
                    </div>

                    <div className="p-4 bg-[#F0F7FF] rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={18} className="text-[#4461F2]" />
                          <span className="text-base font-bold">{selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={18} className="text-[#4461F2]" />
                          <span className="text-base font-bold">{selectedTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 pt-2 border-t border-gray-200">
                          <Globe size={16} />
                          <span className="text-xs font-semibold">{currentTimeZone.name} ({currentTimeZone.offset})</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToForm}
                      className="w-full py-3 bg-[#4461F2] text-white rounded-lg text-base font-bold hover:bg-[#9E5CF2] transition-colors"
                    >
                      Continue →
                    </motion.button>
                  </motion.div>
                )}

                {showForm && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-1">
                        <User size={20} className="text-[#4461F2]" />
                        <span>Your Details</span>
                      </h3>
                      <button
                        onClick={() => {
                          setShowForm(false);
                        }}
                        className="flex items-center gap-1 text-sm font-semibold text-[#4461F2] hover:text-[#9E5CF2] transition-colors"
                      >
                        <ChevronLeft size={18} />
                        <span>Back</span>
                      </button>
                    </div>

                    <div className="mb-3 p-3 bg-[#F0F7FF] rounded-lg">
                      <p className="text-sm font-bold text-gray-700">
                        {selectedDate} {monthNames[currentDate.getMonth()]} at {selectedTime}
                      </p>
                      <p className="text-xs font-semibold text-gray-600 mt-1">
                        {currentTimeZone.name} ({currentTimeZone.offset})
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4461F2] focus:border-transparent"
                      />

                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        required
                        className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4461F2] focus:border-transparent"
                      />

                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Business Name"
                        required
                        className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4461F2] focus:border-transparent"
                      />

                      {/* Custom Enquiry Type Dropdown */}
                      <div className="relative" ref={enquiryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowEnquiryDropdown(!showEnquiryDropdown)}
                          className="w-full border-2 border-gray-300 px-3 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4461F2] focus:border-transparent flex items-center justify-between bg-white"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{selectedEnquiry.icon}</span>
                            <span>{selectedEnquiry.value}</span>
                          </div>
                          <ChevronDown size={18} className={`transition-transform ${showEnquiryDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {showEnquiryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-30"
                            >
                              {enquiryTypes.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => handleEnquirySelect(type.value)}
                                  className={`
                                    w-full px-3 py-2 text-left flex items-center gap-2 transition-colors
                                    ${formData.enquiryType === type.value 
                                      ? 'bg-[#F0F7FF] border-l-4 border-[#4461F2]' 
                                      : 'hover:bg-gray-50'
                                    }
                                  `}
                                >
                                  <span className="text-lg">{type.icon}</span>
                                  <span className="text-sm font-semibold flex-1">{type.value}</span>
                                  {formData.enquiryType === type.value && (
                                    <CheckCircle size={16} className="text-[#4461F2]" />
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-[#4461F2] text-white rounded-lg text-base font-bold hover:bg-[#9E5CF2] transition-colors mt-3"
                      >
                        Book Appointment
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Success Popup */}
          <AnimatePresence>
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-4 right-4 left-4 sm:left-auto bg-[#4461F2] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md mx-auto sm:mx-0"
              >
                <CheckCircle size={24} />
                <div>
                  <p className="text-lg font-bold">Demo Booked Successfully!</p>
                  <p className="text-sm opacity-90">We'll contact you shortly</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AppointmentPage;