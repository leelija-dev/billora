"use client";
import SectionTitle from "../components/SectionTitle";

import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const testimonials = [
    { name: 'Amit Patel', role: 'Owner', company: 'Patel & Sons', avatar: '👨', review: 'Vyapar has revolutionized our billing process. The GST compliance features are saved us countless hours.', yearsWithUs: '3+ years', location: 'Mumbai' },
    { name: 'Neha Gupta', role: 'Founder', company: 'Gupta Fashion', avatar: '👩‍💼', review: 'The reporting features are comprehensive. Filing GST returns has never been easier.', yearsWithUs: '2+ years', location: 'Delhi' },
    { name: 'Rajesh Kumar', role: 'Director', company: 'Kumar Electronics', avatar: '👤', review: 'Inventory tracking is extremely smooth and reliable. This software transformed our workflow.', yearsWithUs: '4+ years', location: 'Bangalore' },
    { name: 'Suresh Sharma', role: 'Owner', company: 'Sharma Traders', avatar: '👨‍💼', review: 'Billing is extremely fast and easy. The interface is intuitive and saves us time.', yearsWithUs: '2+ years', location: 'Jaipur' },
  ];

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, isHovered]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <section 
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#f8fafc] overflow-hidden font-sans px-4 sm:px-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto text-center">
        {/* Header */}
        <SectionTitle 
               title=  "They succeeded online ,  now it's your turn"
                />
        <p className="text-slate-500 text-base sm:text-lg mb-8 sm:mb-12 md:mb-16 px-2">Deep-dive into how we empower businesses.</p>

        {/* Testimonial Carousel */}
        <div className="relative h-auto min-h-[400px] sm:min-h-[450px] md:min-h-[500px] w-full flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
          {testimonials.map((item, index) => {
            let position = "hidden";
            if (index === currentIndex) position = "active";
            else if (index === (currentIndex + 1) % testimonials.length) position = "next";
            else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) position = "prev";

            return (
              <div
                key={index}
                className={`absolute w-full sm:w-[90%] max-w-[550px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] px-4 sm:px-0
                ${position === "active" ? "z-30 opacity-100 [transform:translateX(0)_translateZ(0)_rotateY(0deg)]" : ""}
                ${position === "next" ? "z-10 opacity-40 hidden sm:block [transform:translateX(60%)_translateZ(-200px)_rotateY(-35deg)] blur-[2px]" : ""}
                ${position === "prev" ? "z-10 opacity-40 hidden sm:block [transform:translateX(-60%)_translateZ(-200px)_rotateY(35deg)] blur-[2px]" : ""}
                ${position === "hidden" ? "opacity-0 scale-50 pointer-events-none hidden" : ""}
                `}
              >
                <Card data={item} isActive={position === "active"} />
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 mt-8 sm:mt-10 md:mt-12">
          
          {/* Navigation Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <button 
              onClick={handlePrev}
              className="group p-2.5 sm:p-3 md:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm hover:bg-blue-600 transition-all duration-300 active:scale-95"
              aria-label="Previous testimonial"
            >
              <span className="text-sm sm:text-base text-slate-600 group-hover:text-white transition-colors">←</span>
            </button> 
            <button   
              onClick={handleNext}
              className="group p-2.5 sm:p-3 md:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm hover:bg-blue-600 transition-all duration-300 active:scale-95"
              aria-label="Next testimonial"
            >
              <span className="text-sm sm:text-base text-slate-600 group-hover:text-white transition-colors">→</span>
            </button>
          </div>
          
          {/* Dot Indicators */}
          <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(i);
                    setTimeout(() => setIsAnimating(false), 600);
                  }
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 outline-none focus:ring-2 focus:ring-blue-600 ${
                  i === currentIndex ? "w-8 sm:w-12 bg-blue-600" : "w-2 sm:w-3 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === currentIndex}
              />
            ))}
          </div>

          {/* Mobile: Show counter */}
          <div className="sm:hidden text-xs text-slate-500 font-medium">
            {currentIndex + 1} of {testimonials.length}
          </div>
        </div>
      </div>
    </section>
  );
};

const Card = ({ data, isActive }) => (
  <div className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-left border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all ${!isActive && "pointer-events-none"}`}>
    
    {/* Avatar & Info */}
    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-2xl bg-blue-600 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-blue-200 flex-shrink-0">
        {data.avatar}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-lg sm:text-xl text-slate-900 leading-tight truncate">{data.name}</h4>
        <p className="text-blue-600 font-medium text-xs sm:text-sm truncate">{data.role} @ {data.company}</p>
      </div>
    </div>
    
    {/* Review Text */}
    <div className="relative">
      <span className="absolute -top-3 sm:-top-4 -left-1 sm:-left-2 text-4xl sm:text-5xl md:text-6xl text-slate-100 font-serif leading-none">"</span>
      <p className="relative z-10 text-slate-600 text-base sm:text-lg leading-relaxed italic">
        {data.review}
      </p>
    </div>

    {/* Footer Info */}
    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
      <span className="flex items-center gap-1.5 sm:gap-2">📍 <span className="truncate">{data.location}</span></span>
      <span className="bg-slate-50 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
        {data.yearsWithUs}
      </span>
    </div>
  </div>
);

export default Testimonials;