"use client";

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
    </section>
  );
};

const Card = ({ data, isActive }) => (
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
        {data.review}
      </p>
    </div>

    <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400">
      <span className="flex items-center gap-2">📍 {data.location}</span>
      <span className="bg-slate-50 px-3 py-1 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
        {data.yearsWithUs}
      </span>
    </div>
  </div>
);

export default Testimonials;