"use client";
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";
import React, { useState, useEffect } from "react";
import { useTestimonialStore } from "../store/testimonialStore";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    testimonials,
    loading: isLoading,
    error,
    fetchTestimonials,
    clearError
  } = useTestimonialStore();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      await fetchTestimonials();
    } catch (err) {
      console.error('Error loading testimonials:', err);
      clearError('Failed to load testimonials. Please try again.');
    }
  };

  useEffect(() => {
    if (isHovered || isLoading || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, isHovered, isLoading, testimonials.length]);

  const handleNext = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index) => {
    if (isAnimating) return;
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden font-sans">
        <Container size="default">
          <div className="w-full text-center">
            <SectionTitle title="They succeeded online, now it's your turn" />
            <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">
              Deep-dive into how we empower businesses.
            </p>
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e88e5]"></div>
              </div>
              <p className="ml-3 text-slate-500">Loading testimonials...</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden font-sans">
        <Container size="default">
          <div className="w-full text-center">
            <SectionTitle title="They succeeded online, now it's your turn" />
            <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">
              Deep-dive into how we empower businesses.
            </p>
            <div className="bg-white rounded-2xl p-12 text-center max-w-md mx-auto shadow-lg border border-slate-100">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-slate-500">No testimonials yet. Be the first to share your experience!</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section 
      className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Container size="default">
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-0.5 bg-gradient-to-r from-transparent to-[#1e88e5]"></div>
              <span className="text-[#1e88e5] text-sm font-semibold uppercase tracking-wider">
                Testimonials
              </span>
              <div className="w-10 h-0.5 bg-gradient-to-l from-transparent to-[#1e88e5]"></div>
            </div>
            <SectionTitle title="They succeeded online, now it's your turn" />
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Deep-dive into how we empower businesses.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-700 rounded-lg text-sm mx-auto max-w-md">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Carousel Container */}
          <div className="relative h-auto min-h-[380px] sm:min-h-[400px] md:min-h-[420px] w-full flex items-center justify-center [perspective:1200px]">
            {testimonials.map((item, index) => {
              let position = "hidden";
              if (index === currentIndex) position = "active";
              else if (index === (currentIndex + 1) % testimonials.length) position = "next";
              else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) position = "prev";

              return (
                <div
                  key={item.id}
                  className={`absolute w-[95%] sm:w-[85%] max-w-[580px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${position === "active" ? "z-30 opacity-100 translate-x-0 scale-100" : ""}
                  ${position === "next" ? "z-10 opacity-0 sm:opacity-40 hidden sm:block translate-x-[60%] scale-90 blur-[2px]" : ""}
                  ${position === "prev" ? "z-10 opacity-0 sm:opacity-40 hidden sm:block -translate-x-[60%] scale-90 blur-[2px]" : ""}
                  ${position === "hidden" ? "opacity-0 scale-50 pointer-events-none hidden" : ""}
                  `}
                >
                  <TestimonialCard data={item} isActive={position === "active"} />
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          {testimonials.length > 0 && (
            <div className="flex flex-col items-center gap-6 mt-10">
              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={handlePrev} 
                  className="group relative w-11 h-11 rounded-full bg-white border-2 border-slate-200 hover:border-[#1e88e5] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden"
                  aria-label="Previous testimonial"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e88e5] to-[#1565c0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="relative z-10 w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  onClick={handleNext} 
                  className="group relative w-11 h-11 rounded-full bg-white border-2 border-slate-200 hover:border-[#1e88e5] shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center overflow-hidden"
                  aria-label="Next testimonial"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e88e5] to-[#1565c0] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="relative z-10 w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === currentIndex 
                        ? "w-8 bg-gradient-to-r from-[#1e88e5] to-[#1565c0]" 
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

// Modern Testimonial Card Component
const TestimonialCard = ({ data, isActive }) => (
  <div className={`group bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 transition-all duration-500 ${
    isActive ? "hover:shadow-2xl hover:-translate-y-1" : "pointer-events-none"
  }`}>
    {/* Decorative Gradient Bar */}
    <div className="h-1.5 bg-gradient-to-r from-[#1e88e5] via-[#f6c453] to-[#1e88e5]"></div>
    
    <div className="p-6 md:p-8">
      {/* Header Section with Avatar and Quote */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#1e88e5] to-[#1565c0] flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all">
              <span className="text-white font-bold text-xl md:text-2xl">
                {data.name?.charAt(0) || '?'}
              </span>
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-lg md:text-xl text-slate-900 leading-tight truncate">
              {data.name}
            </h4>
            <p className="text-[#1e88e5] font-medium text-sm truncate">
              {data.role} {data.company && `@ ${data.company}`}
            </p>
          </div>
        </div>
        
        {/* Quote Icon */}
        <div className="flex-shrink-0 ml-2">
          <svg className="w-8 h-8 text-blue-100 group-hover:text-blue-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
      </div>
      
      {/* Review Text */}
      <div className="relative mb-6">
        <p className="text-slate-600 text-[15px] md:text-base leading-relaxed line-clamp-4 min-h-[100px]">
          {data.review || data.message || data.testimonial}
        </p>
      </div>

      {/* Footer Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {/* Rating Stars */}
        {data.rating && (
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < data.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
        )}

        {/* Location and Meta Info */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-slate-500">
              {data.location || 'India'}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-[#1e88e5]">
              {data.years_with_us || 'Verified Customer'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Testimonials;