"use client";
<<<<<<< HEAD
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";
=======
>>>>>>> 9bfd81b (my second git push)

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
<<<<<<< HEAD
      className="py-12 sm:py-16 md:py-14 lg:py-24 bg-[#f8fafc] overflow-hidden font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container size="default">
        <div className="w-full text-center px-4 sm:px-0">
          {/* Header */}
          <SectionTitle 
            title="They succeeded online, now it's your turn"
          />
          <p className="text-slate-500 text-base sm:text-base md:text-sm lg:text-lg mb-8 sm:mb-12 md:mb-8 lg:mb-16">
            {/* Tablet: md:text-sm (14px) */}
            Deep-dive into how we empower businesses.
          </p>

          {/* Testimonial Carousel */}
          <div className="relative h-auto min-h-[450px] sm:min-h-[450px] md:min-h-[380px] lg:min-h-[500px] w-full flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
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
          <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-5 lg:gap-8 mt-8 sm:mt-10 md:mt-6 lg:mt-12">
            
            {/* Navigation Buttons */}
            <div className="flex gap-4 sm:gap-4 md:gap-2 lg:gap-4">
              <button 
                onClick={handlePrev}
                className="group p-3 sm:p-3 md:p-1.5 lg:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm hover:bg-blue-600 transition-all duration-300 active:scale-95"
                aria-label="Previous testimonial"
              >
                <span className="text-base sm:text-base md:text-xs lg:text-base text-slate-600 group-hover:text-white transition-colors">←</span>
              </button> 
              <button   
                onClick={handleNext}
                className="group p-3 sm:p-3 md:p-1.5 lg:p-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm hover:bg-blue-600 transition-all duration-300 active:scale-95"
                aria-label="Next testimonial"
              >
                <span className="text-base sm:text-base md:text-xs lg:text-base text-slate-600 group-hover:text-white transition-colors">→</span>
              </button>
            </div>
            
            {/* Dot Indicators */}
            <div className="flex gap-2 sm:gap-3 md:gap-1.5 lg:gap-3 justify-center flex-wrap">
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
                  className={`h-2 sm:h-2 md:h-1 lg:h-2 rounded-full transition-all duration-500 outline-none focus:ring-2 focus:ring-blue-600 ${
                    i === currentIndex ? "w-8 sm:w-12 md:w-5 lg:w-12 bg-blue-600" : "w-2 sm:w-3 md:w-1 lg:w-3 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={i === currentIndex}
                />
              ))}
            </div>

            {/* Mobile: Show counter */}
            <div className="sm:hidden text-sm text-slate-500 font-medium">
              {currentIndex + 1} of {testimonials.length}
            </div>
          </div>
        </div>
      </Container>
=======
      className="py-24 bg-[#f8fafc] overflow-hidden font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Client Success Stories
        </h2>
        <p className="text-slate-500 text-lg mb-16">Deep-dive into how we empower businesses.</p>

        <div className="relative h-[450px] w-full flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
          {testimonials.map((item, index) => {
            let position = "hidden";
            if (index === currentIndex) position = "active";
            else if (index === (currentIndex + 1) % testimonials.length) position = "next";
            else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) position = "prev";

            return (
              <div
                key={index}
                className={`absolute w-[90%] max-w-[550px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] 
                ${position === "active" ? "z-30 opacity-100 [transform:translateX(0)_translateZ(0)_rotateY(0deg)]" : ""}
                ${position === "next" ? "z-10 opacity-40 [transform:translateX(60%)_translateZ(-200px)_rotateY(-35deg)] blur-[2px]" : ""}
                ${position === "prev" ? "z-10 opacity-40 [transform:translateX(-60%)_translateZ(-200px)_rotateY(35deg)] blur-[2px]" : ""}
                ${position === "hidden" ? "opacity-0 scale-50 pointer-events-none" : ""}
                `}
              >
                <Card data={item} isActive={position === "active"} />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-8 mt-12">
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              className="group p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-blue-600 transition-all duration-300"
            >
              <span className="text-slate-600 group-hover:text-white transition-colors">←</span>
            </button> 
            <button   
              onClick={handleNext}
              className="group p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-blue-600 transition-all duration-300"
            >
              <span className="text-slate-600 group-hover:text-white transition-colors">→</span>
            </button>
          </div>
          
          <div className="flex gap-3">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-12 bg-blue-600" : "w-3 bg-slate-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
>>>>>>> 9bfd81b (my second git push)
    </section>
  );
};

const Card = ({ data, isActive }) => (
<<<<<<< HEAD
  <div className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-5 lg:p-10 text-left border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all ${!isActive && "pointer-events-none"}`}>
    
    {/* Avatar & Info */}
    <div className="flex items-center gap-4 sm:gap-4 md:gap-2 lg:gap-4 mb-6 sm:mb-8 md:mb-4 lg:mb-8">
      <div className="w-14 h-14 sm:w-14 sm:h-14 md:w-9 md:h-9 lg:w-16 lg:h-16 rounded-lg sm:rounded-2xl bg-blue-600 flex items-center justify-center text-3xl sm:text-3xl md:text-lg lg:text-3xl shadow-lg shadow-blue-200 flex-shrink-0">
        {data.avatar}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-xl sm:text-xl md:text-sm lg:text-2xl text-slate-900 leading-tight truncate">{data.name}</h4>
        <p className="text-blue-600 font-medium text-sm sm:text-sm md:text-[10px] lg:text-base truncate">{data.role} @ {data.company}</p>
      </div>
    </div>
    
    {/* Review Text */}
    <div className="relative">
      <span className="absolute -top-3 sm:-top-4 md:-top-2 lg:-top-4 -left-1 sm:-left-2 md:-left-1 lg:-left-2 text-5xl sm:text-5xl md:text-3xl lg:text-6xl text-slate-100 font-serif leading-none">"</span>
      <p className="relative z-10 text-slate-600 text-base sm:text-base md:text-sm lg:text-lg leading-relaxed italic pl-2">
=======
  <div className={`bg-white rounded-[2.5rem] p-10 text-left border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] ${!isActive && "pointer-events-none"}`}>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-200">
        {data.avatar}
      </div>
      <div>
        <h4 className="font-bold text-xl text-slate-900 leading-tight">{data.name}</h4>
        <p className="text-blue-600 font-medium text-sm">{data.role} @ {data.company}</p>
      </div>
    </div>
    
    <div className="relative">
      <span className="absolute -top-4 -left-2 text-6xl text-slate-100 font-serif leading-none">“</span>
      <p className="relative z-10 text-slate-600 text-lg leading-relaxed italic">
>>>>>>> 9bfd81b (my second git push)
        {data.review}
      </p>
    </div>

<<<<<<< HEAD
    {/* Footer Info */}
    <div className="mt-6 sm:mt-8 md:mt-4 lg:mt-8 pt-6 sm:pt-8 md:pt-4 lg:pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 md:gap-1 lg:gap-4">
      <span className="flex items-center gap-1.5 sm:gap-2 md:gap-1 lg:gap-2 text-sm sm:text-sm md:text-[9px] lg:text-sm text-slate-400">
        📍 <span className="truncate">{data.location}</span>
      </span>
      <span className="bg-slate-50 px-3 sm:px-3 md:px-1.5 lg:px-3 py-1.5 rounded-full text-xs sm:text-xs md:text-[8px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
=======
    <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400">
      <span className="flex items-center gap-2">📍 {data.location}</span>
      <span className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
>>>>>>> 9bfd81b (my second git push)
        {data.yearsWithUs}
      </span>
    </div>
  </div>
);

export default Testimonials;