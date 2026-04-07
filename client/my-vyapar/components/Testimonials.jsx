"use client";
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";
import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const testimonials = [
    { name: 'Jayanta Barman', role: 'Team Leader', company: 'Leelija Web Solutions', review: 'Vyapar has revolutionized our billing process. The GST compliance features are saved us countless hours.', yearsWithUs: '3+ years', location: 'Kolkata' },
    { name: 'Sahel Qureshi', role: 'Frontend Developer', company: 'Leelija Web Solutions'  , review: 'The reporting features are comprehensive. Filing GST returns has never been easier.', yearsWithUs: '2+ years', location: 'Kolkata' },
    { name: 'Lakshman Pal', role: ' LARAVEL , DJANGO , PYTHON Developer', company: 'Leelija Web Solutions'  , review: 'Inventory tracking is extremely smooth and reliable. This software transformed our workflow.', yearsWithUs: '4+ years', location: 'Kolkata' },
    { name: 'Susmita Ghosh', role: 'Backend Developer', company: 'Leelija Web Solutions'  , review: 'Billing is extremely fast and easy. The interface is intuitive and saves us time.', yearsWithUs: '2+ years', location: 'Kolkata' },
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => { handleNext(); }, 5000);
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
      // REDUCED: Changed py-8 to py-4 and lg:py-18 to lg:py-10 to fix the "green part" height
      className="py-4 sm:py-8 md:py-4 lg:py-10 bg-[#f8fafc] overflow-hidden font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container size="default">
        <div className="w-full text-center">
          <SectionTitle title="They succeeded online, now it's your turn" />
          <p className="text-slate-500 text-base lg:text-lg mb-6 sm:mb-12">
            Deep-dive into how we empower businesses.
          </p>

          {/* FIX: Removed rigid min-heights that squish content on mobile */}
          <div className="relative h-auto min-h-[380px] sm:min-h-[400px] md:min-h-[320px] w-full flex items-center justify-center [perspective:1200px]">
            {testimonials.map((item, index) => {
              let position = "hidden";
              if (index === currentIndex) position = "active";
              else if (index === (currentIndex + 1) % testimonials.length) position = "next";
              else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) position = "prev";

              return (
                <div
                  key={index}
                  // FIX: Changed w-full to w-[95%] and removed px-4 to give card more breathing room
                  className={`absolute w-[95%] sm:w-[85%] max-w-[550px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${position === "active" ? "z-30 opacity-100 translate-x-0" : ""}
                  ${position === "next" ? "z-10 opacity-40 hidden sm:block translate-x-[60%] scale-90 blur-[2px]" : ""}
                  ${position === "prev" ? "z-10 opacity-40 hidden sm:block -translate-x-[60%] scale-90 blur-[2px]" : ""}
                  ${position === "hidden" ? "opacity-0 scale-50 pointer-events-none hidden" : ""}
                  `}
                >
                  <Card data={item} isActive={position === "active"} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex gap-4">
              <button onClick={handlePrev} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-blue-600 group transition-all">
                <span className="group-hover:text-white">←</span>
              </button> 
              <button onClick={handleNext} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-blue-600 group transition-all">
                <span className="group-hover:text-white">→</span>
              </button>
            </div>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => !isAnimating && setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${i === currentIndex ? "w-10 bg-blue-600" : "w-2 bg-slate-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const Card = ({ data, isActive }) => (
  // FIX: Reduced padding from p-6 to p-5 and adjusted text sizes for mobile
  <div className={`bg-white rounded-2xl p-5 sm:p-8 text-left border border-slate-100 shadow-xl transition-all ${!isActive && "pointer-events-none"}`}>
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-100 flex-shrink-0">
        {data.avatar}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-lg sm:text-2xl text-slate-900 leading-tight truncate">{data.name}</h4>
        <p className="text-blue-600 font-medium text-xs sm:text-base truncate">{data.role} @ {data.company}</p>
      </div>
    </div>
    
    <div className="relative">
      <span className="absolute -top-3 -left-1 text-4xl text-slate-100 font-serif leading-none">"</span>
      <p className="relative z-10 text-slate-600 text-[15px] sm:text-lg leading-relaxed italic pl-3">
        {data.review}
      </p>
    </div>

    <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center">
      <span className="text-[11px] sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">
        📍 {data.location}
      </span>
      <span className="bg-blue-50 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-blue-600">
        {data.yearsWithUs}
      </span>
    </div>
  </div>
);

export default Testimonials;