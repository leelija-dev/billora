"use client";

import React, { useState, useEffect } from "react";
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
  Home
} from "lucide-react";
import { useRouter } from "next/navigation";

const AppointmentPage = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [showTimeZonePicker, setShowTimeZonePicker] = useState<boolean>(false);
  const [realTimeCurrentDate, setRealTimeCurrentDate] = useState<Date>(new Date());
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>("Asia/Kolkata");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    businessName: "",
    enquiryType: "Product demo"
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

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

  // Update real-time current date every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock booked dates
  const bookedDates: number[] = [1, 2, 3, 10, 11, 16, 17, 20, 21, 24];
  
  // Mock available dates
  const getAvailableDates = (): number[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    const available: number[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(year, month, day);
      
      if (dateToCheck >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        if (!bookedDates.includes(day)) {
          available.push(day);
        }
      }
    }
    
    return available;
  };

  const availableDates = getAvailableDates();
  
  // Base time slots in IST
  const baseTimeSlots: string[] = [
    "9:00 AM", "10:00 AM", "11:00 AM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  // Convert time to different time zone
  const convertTimeToTimeZone = (timeStr: string, fromZone: string, toZone: string): string => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const getOffset = (zone: string): number => {
      const offsets: { [key: string]: number } = {
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

  const getTimeSlotsForZone = (): string[] => {
    return baseTimeSlots.map(slot => 
      convertTimeToTimeZone(slot, 'Asia/Kolkata', selectedTimeZone)
    );
  };

  const timeSlots = getTimeSlotsForZone();

  const getMonthData = (): (number | null)[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleResetToCurrent = (): void => {
    setCurrentDate(new Date());
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
    setShowMonthPicker(false);
  };

  const handleMonthSelect = (monthIndex: number): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleYearChange = (increment: number): void => {
    setCurrentDate(new Date(currentDate.getFullYear() + increment, currentDate.getMonth(), 1));
  };

  const handleDateSelect = (day: number | null): void => {
    if (!day) return;
    if (availableDates.includes(day)) {
      setSelectedDate(day);
      setSelectedTime(null);
      setShowForm(false);
    }
  };

  const handleTimeSelect = (time: string): void => {
    setSelectedTime(time);
  };

  const handleProceedToForm = (): void => {
    if (selectedDate && selectedTime) {
      setShowForm(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
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

  const isAvailable = (day: number | null): boolean => {
    return day ? availableDates.includes(day) : false;
  };

  const isBooked = (day: number | null): boolean => {
    if (!day) return false;
    
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dateToCheck >= today && bookedDates.includes(day);
  };

  const isPastDate = (day: number | null): boolean => {
    if (!day) return false;
    
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dateToCheck < today;
  };

  const isCurrentDate = (day: number | null): boolean => {
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

  const formatTimeInZone = (date: Date, timeZone: string): string => {
    return date.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: '2-digit',
      hour12: true
    });
  };

  const currentTimeZone = timeZones.find(tz => tz.value === selectedTimeZone) || timeZones[0];

  return (
    <div className="min-h-screen bg-[#F0F7FF] py-2 sm:py-3 md:py-4 lg:py-5 px-2 sm:px-3 md:px-4 lg:px-5 relative">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-[#0F172A] font-medium border border-gray-200"
      >
        <Home size={18} className="text-[#4461F2]" />
        <span className="hidden sm:inline">Home</span>
      </button>

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
      
      <div className="max-w-5xl xl:max-w-6xl mx-auto">
        
        {/* Header with Real-time Date/Time */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-5"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-[#0F172A] mb-1 lg:mb-2">
            Book Your Free Demo
          </h1>
          
          {/* Real-time Current Date/Time Display */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 bg-white px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full shadow-sm border border-[#4461F2] mb-2 lg:mb-3 max-w-[95%] sm:max-w-full mx-auto"
          >
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-[#4461F2]" />
              <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#0F172A] truncate max-w-[120px] sm:max-w-[150px] lg:max-w-none">
                {formattedCurrentDate}
              </span>
            </div>
            <div className="w-px h-2 sm:h-3 lg:h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-[#9E5CF2]" />
              <span className="text-[10px] sm:text-xs lg:text-sm font-mono text-[#0F172A]">
                {formatTimeInZone(realTimeCurrentDate, selectedTimeZone)}
              </span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-[#4461F2] rounded-full"
            />
          </motion.div>
          
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Experience seamless billing with a personalized demo
          </p>
        </motion.div>

        {/* Simple 3-Step Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 sm:mb-3 md:mb-4 lg:mb-5"
        >
          <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-[#0F172A] text-center mb-1 sm:mb-2">
            Simple 3-Step Process
          </h2>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 lg:gap-3 px-1 sm:px-2">
            {[
              { icon: "📅", title: "Pick Date", desc: "Choose from available dates" },
              { icon: "⏰", title: "Choose Time", desc: "Select your preferred slot" },
              { icon: "🚀", title: "Get Demo", desc: "Live demo with our expert" }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-lg p-1.5 sm:p-2 lg:p-3 border border-gray-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-sm sm:text-base lg:text-lg xl:text-xl">{step.icon}</span>
                  <div>
                    <h3 className="font-medium text-[#0F172A] text-[10px] sm:text-xs lg:text-sm">{step.title}</h3>
                    <p className="text-[8px] sm:text-[10px] lg:text-xs text-gray-500 hidden xs:block">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-5 items-start">
          
          {/* Left Side - Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-2 sm:p-3 md:p-4 lg:p-4 xl:p-5 border border-gray-200"
          >
            {/* Calendar Header */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-0 mb-2 sm:mb-3">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <h2 className="text-xs sm:text-sm lg:text-base font-semibold text-[#0F172A] flex items-center gap-1">
                  <CalendarDays size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-[#4461F2]" />
                  <span className="hidden xs:inline">Select Date</span>
                  <span className="xs:hidden">Date</span>
                </h2>
                
                {/* Time Zone Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowTimeZonePicker(!showTimeZonePicker)}
                    className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-1 bg-[#F0F7FF] rounded-md text-[8px] sm:text-[10px] lg:text-xs text-[#0F172A] hover:bg-[#4461F2] hover:text-white transition-colors group"
                  >
                    <Globe size={8} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 group-hover:text-white" />
                    <span className="hidden sm:inline max-w-[60px] lg:max-w-[80px] truncate">{currentTimeZone.name}</span>
                    <span className="sm:hidden">{currentTimeZone.offset}</span>
                    <ChevronDown size={6} className="sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5" />
                  </button>

                  {/* Time Zone Picker Popup */}
                  <AnimatePresence>
                    {showTimeZonePicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 z-20 min-w-[180px] sm:min-w-[220px] lg:min-w-[250px] max-h-40 sm:max-h-48 lg:max-h-60 overflow-y-auto"
                      >
                        {timeZones.map((tz) => (
                          <button
                            key={tz.value}
                            onClick={() => {
                              setSelectedTimeZone(tz.value);
                              setShowTimeZonePicker(false);
                            }}
                            className={`
                              w-full text-left px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md text-[9px] sm:text-[10px] lg:text-xs transition-colors
                              ${selectedTimeZone === tz.value 
                                ? 'bg-[#4461F2] text-white' 
                                : 'hover:bg-[#F0F7FF] text-[#0F172A]'
                              }
                            `}
                          >
                            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-0.5">
                              <span className="truncate">{tz.name}</span>
                              <span className="text-[7px] sm:text-[8px] lg:text-[10px] opacity-70">UTC{tz.offset}</span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between xs:justify-end gap-0.5 sm:gap-1">
                {/* Month/Year Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#F0F7FF] rounded-md text-[9px] sm:text-[10px] lg:text-xs font-medium text-[#0F172A] hover:bg-[#4461F2] hover:text-white transition-colors"
                  >
                    <span className="hidden xs:inline">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <span className="xs:hidden">{monthNames[currentDate.getMonth()].slice(0,3)} {currentDate.getFullYear()}</span>
                  </button>
                  
                  {/* Month Picker Popup */}
                  <AnimatePresence>
                    {showMonthPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 sm:p-2 z-20 min-w-[160px] sm:min-w-[200px] lg:min-w-[240px]"
                      >
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <button
                            onClick={() => handleYearChange(-1)}
                            className="p-0.5 hover:bg-[#F0F7FF] rounded"
                          >
                            <ChevronLeft size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                          </button>
                          <span className="font-medium text-[9px] sm:text-[10px] lg:text-xs text-[#0F172A]">{currentDate.getFullYear()}</span>
                          <button
                            onClick={() => handleYearChange(1)}
                            className="p-0.5 hover:bg-[#F0F7FF] rounded"
                          >
                            <ChevronRight size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-0.5">
                          {monthNames.map((month, index) => (
                            <button
                              key={month}
                              onClick={() => handleMonthSelect(index)}
                              className={`
                                p-1 text-[8px] sm:text-[9px] lg:text-[10px] rounded-md transition-colors
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

                {/* Reset Button */}
                <button
                  onClick={handleResetToCurrent}
                  className="p-0.5 sm:p-1 bg-[#F0F7FF] rounded-md hover:bg-[#4461F2] hover:text-white transition-colors group"
                  title="Back to Current Month"
                >
                  <RotateCw size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
                </button>

                <button
                  onClick={handlePrevMonth}
                  className="p-0.5 sm:p-1 hover:bg-[#F0F7FF] rounded-md transition-colors text-[#0F172A]"
                >
                  <ChevronLeft size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-0.5 sm:p-1 hover:bg-[#F0F7FF] rounded-md transition-colors text-[#0F172A]"
                >
                  <ChevronRight size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-0.5 mb-0.5 sm:mb-1">
              {dayNames.map((day: string) => (
                <div key={day} className="text-center text-[8px] sm:text-[9px] lg:text-[10px] font-medium text-gray-500 py-0.5">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((day: number | null, index: number) => {
                const available = isAvailable(day);
                const booked = isBooked(day);
                const past = isPastDate(day);
                const current = isCurrentDate(day);
                const isSelected = selectedDate === day;

                let bgColor = "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed";
                
                if (available && !past) {
                  bgColor = isSelected
                    ? 'bg-[#4461F2] text-white shadow-sm scale-105 ring-1 ring-[#9E5CF2] cursor-pointer'
                    : current
                      ? 'bg-[#9E5CF2] text-white font-bold cursor-pointer border border-[#4461F2] ripple-hover'
                      : 'bg-white text-[#0F172A] border border-[#4461F2] cursor-pointer hover:bg-[#4461F2] hover:text-white ripple-hover';
                } else if (booked) {
                  bgColor = 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed line-through opacity-70';
                } else if (past) {
                  bgColor = 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-50';
                }

                return (
                  <button
                    key={index}
                    onClick={() => !past && !booked && handleDateSelect(day)}
                    disabled={past || booked || !day}
                    className={`
                      relative aspect-square flex items-center justify-center rounded-md text-[9px] sm:text-[10px] lg:text-xs
                      transition-all duration-200
                      ${!day ? 'invisible' : ''}
                      ${bgColor}
                    `}
                  >
                    <span className="relative z-10">{day}</span>
                    
                    {available && !current && !isSelected && !past && (
                      <span className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-[#4461F2] rounded-full z-10" />
                    )}
                    
                    {booked && (
                      <span className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-gray-500 rounded-full z-10" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Simple Legend */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3 pt-1 sm:pt-2 border-t border-gray-100">
              {[
                { color: "bg-[#4461F2]", label: "Available" },
                { color: "bg-[#4461F2] border border-[#9E5CF2]", label: "Selected" },
                { color: "bg-[#9E5CF2]", label: "Today" },
                { color: "bg-gray-200 line-through", label: "Booked" },
                { color: "bg-gray-100", label: "Past" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-0.5">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${item.color} rounded-xs`}></div>
                  <span className="text-[7px] sm:text-[8px] lg:text-[9px] text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Working Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4 lg:p-4 xl:p-5 border border-gray-200 min-h-[300px] sm:min-h-[350px] lg:min-h-[380px]"
          >
            <AnimatePresence mode="wait">
              {!selectedDate && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-2 sm:py-4"
                >
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#4461F2] mb-1 sm:mb-2 opacity-50" />
                  <h3 className="text-xs sm:text-sm lg:text-base font-medium text-[#0F172A] mb-0.5">
                    Pick a Date
                  </h3>
                  <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 max-w-xs px-2">
                    Select an available date from the calendar
                  </p>
                </motion.div>
              )}

              {selectedDate && !selectedTime && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#0F172A] flex items-center gap-1">
                      <Clock size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-[#4461F2]" />
                      <span>Available Slots</span>
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedDate(null);
                        setSelectedTime(null);
                      }}
                      className="flex items-center gap-0.5 text-[8px] sm:text-[9px] lg:text-[10px] text-[#4461F2] hover:text-[#9E5CF2] transition-colors"
                    >
                      <ChevronLeft size={8} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3" />
                      <span>Back</span>
                    </button>
                  </div>
                  
                  <div className="mb-1 sm:mb-2 p-1.5 sm:p-2 bg-[#F0F7FF] rounded-lg">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs text-[#0F172A]">
                      {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </p>
                    <p className="text-[7px] sm:text-[8px] lg:text-[9px] text-gray-500 mt-0.5">
                      {currentTimeZone.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                    {timeSlots.map((time: string, index: number) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          py-3 sm:py-4 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all
                          ${selectedTime === time 
                            ? 'bg-[#4461F2] text-white shadow-lg scale-105 ring-2 ring-[#9E5CF2]' 
                            : 'bg-[#F0F7FF] text-[#0F172A] border-2 border-[#4461F2] hover:bg-[#4461F2] hover:text-white hover:shadow-lg'
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
                  className="space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#0F172A]">Selected Slot</h3>
                    <button
                      onClick={() => {
                        setSelectedTime(null);
                      }}
                      className="flex items-center gap-0.5 text-[8px] sm:text-[9px] lg:text-[10px] text-[#4461F2] hover:text-[#9E5CF2] transition-colors"
                    >
                      <ChevronLeft size={8} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="p-2 sm:p-3 bg-[#F0F7FF] rounded-lg">
                    <div className="space-y-0.5 text-[9px] sm:text-[10px] lg:text-xs">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={8} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-[#4461F2]" />
                        <span>{selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={8} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-[#4461F2]" />
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-[7px] sm:text-[8px] lg:text-[9px] mt-0.5">
                        <Globe size={6} className="sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5" />
                        <span>{currentTimeZone.name} ({currentTimeZone.offset})</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToForm}
                    className="w-full py-1.5 sm:py-2 bg-[#4461F2] text-white rounded-lg text-[9px] sm:text-[10px] lg:text-xs font-medium hover:bg-[#9E5CF2] transition-colors"
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
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-[10px] sm:text-xs lg:text-sm font-medium text-[#0F172A] flex items-center gap-1">
                      <User size={10} className="sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 text-[#4461F2]" />
                      <span>Your Details</span>
                    </h3>
                    <button
                      onClick={() => {
                        setShowForm(false);
                      }}
                      className="flex items-center gap-0.5 text-[8px] sm:text-[9px] lg:text-[10px] text-[#4461F2] hover:text-[#9E5CF2] transition-colors"
                    >
                      <ChevronLeft size={8} className="sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3" />
                      <span>Back</span>
                    </button>
                  </div>

                  <div className="mb-1 sm:mb-2 p-1.5 sm:p-2 bg-[#F0F7FF] rounded-lg text-[9px] sm:text-[10px] lg:text-xs">
                    <span className="text-gray-600">{selectedDate} {monthNames[currentDate.getMonth()]} at {selectedTime}</span>
                    <span className="text-[7px] sm:text-[8px] lg:text-[9px] text-gray-500 block mt-0.5">
                      {currentTimeZone.name} ({currentTimeZone.offset})
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-1 sm:space-y-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                      className="w-full border border-gray-200 px-1.5 sm:px-2 py-1 rounded-lg text-[9px] sm:text-[10px] lg:text-xs focus:outline-none focus:ring-1 focus:ring-[#4461F2]"
                    />

                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Mobile Number"
                      required
                      className="w-full border border-gray-200 px-1.5 sm:px-2 py-1 rounded-lg text-[9px] sm:text-[10px] lg:text-xs focus:outline-none focus:ring-1 focus:ring-[#4461F2]"
                    />

                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Business Name"
                      required
                      className="w-full border border-gray-200 px-1.5 sm:px-2 py-1 rounded-lg text-[9px] sm:text-[10px] lg:text-xs focus:outline-none focus:ring-1 focus:ring-[#4461F2]"
                    />

                    <select
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-200 px-1.5 sm:px-2 py-1 rounded-lg text-[9px] sm:text-[10px] lg:text-xs focus:outline-none focus:ring-1 focus:ring-[#4461F2]"
                    >
                      <option>Product demo</option>
                      <option>Pricing enquiry</option>
                      <option>Technical support</option>
                      <option>Partnership</option>
                    </select>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-1.5 sm:py-2 bg-[#4461F2] text-white rounded-lg text-[9px] sm:text-[10px] lg:text-xs font-medium hover:bg-[#9E5CF2] transition-colors mt-1"
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
              className="fixed bottom-2 right-2 left-2 sm:left-auto bg-[#4461F2] text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg flex items-center gap-1 max-w-[90%] sm:max-w-sm mx-auto sm:mx-0"
            >
              <CheckCircle size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              <span className="text-[9px] sm:text-[10px] lg:text-xs font-medium">Demo Booked Successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentPage;