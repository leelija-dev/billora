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

  // Fetch testimonials from backend on component mount
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

  // Auto-rotate carousel
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
      <section className="py-4 sm:py-8 md:py-4 lg:py-10 bg-[#f8fafc] overflow-hidden font-sans">
        <Container size="default">
          <div className="w-full text-center">
            <SectionTitle title="They succeeded online, now it's your turn" />
            <p className="text-slate-500 text-base lg:text-lg mb-6 sm:mb-12">
              Deep-dive into how we empower businesses.
            </p>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-slate-500">Loading testimonials...</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-4 sm:py-8 md:py-4 lg:py-10 bg-[#f8fafc] overflow-hidden font-sans">
        <Container size="default">
          <div className="w-full text-center">
            <SectionTitle title="They succeeded online, now it's your turn" />
            <p className="text-slate-500 text-base lg:text-lg mb-6 sm:mb-12">
              Deep-dive into how we empower businesses.
            </p>
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto">
              <i className="fas fa-comment-dots text-4xl text-slate-300 mb-3"></i>
              <p className="text-slate-500">No testimonials yet. Be the first to share your experience!</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section 
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

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm mx-auto max-w-md">
              <i className="fas fa-info-circle mr-2"></i> {error}
            </div>
          )}

          <div className="relative h-auto min-h-[380px] sm:min-h-[400px] md:min-h-[320px] w-full flex items-center justify-center [perspective:1200px]">
            {testimonials.map((item, index) => {
              let position = "hidden";
              if (index === currentIndex) position = "active";
              else if (index === (currentIndex + 1) % testimonials.length) position = "next";
              else if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) position = "prev";

              return (
                <div
                  key={item.id}
                  className={`absolute w-[95%] sm:w-[85%] max-w-[550px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                  ${position === "active" ? "z-30 opacity-100 translate-x-0 scale-100" : ""}
                  ${position === "next" ? "z-10 opacity-0 sm:opacity-40 hidden sm:block translate-x-[60%] scale-90 blur-[2px]" : ""}
                  ${position === "prev" ? "z-10 opacity-0 sm:opacity-40 hidden sm:block -translate-x-[60%] scale-90 blur-[2px]" : ""}
                  ${position === "hidden" ? "opacity-0 scale-50 pointer-events-none hidden" : ""}
                  `}
                >
                  <Card data={item} isActive={position === "active"} />
                </div>
              );
            })}
          </div>

          {testimonials.length > 0 && (
            <div className="flex flex-col items-center gap-6 mt-8">
              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handlePrev} 
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-blue-600 group transition-all"
                  aria-label="Previous testimonial"
                >
                  <span className="group-hover:text-white text-slate-600 text-xl">←</span>
                </button> 
                <button 
                  onClick={handleNext} 
                  className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-blue-600 group transition-all"
                  aria-label="Next testimonial"
                >
                  <span className="group-hover:text-white text-slate-600 text-xl">→</span>
                </button>
              </div>
              
              {/* Dots Indicator */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === currentIndex ? "w-8 bg-blue-600" : "w-2 bg-slate-300"
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

// Card Component - Displays review from backend
const Card = ({ data, isActive }) => (
  <div className={`bg-white rounded-2xl p-5 sm:p-8 text-left border border-slate-100 shadow-xl transition-all ${!isActive && "pointer-events-none"}`}>
    {/* Avatar and Name */}
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-100 flex-shrink-0">
        <span className="text-white font-bold text-xl sm:text-2xl">
          {data.name?.charAt(0) || '?'}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-lg sm:text-2xl text-slate-900 leading-tight truncate">{data.name}</h4>
        <p className="text-blue-600 font-medium text-xs sm:text-base truncate">
          {data.role} {data.company ? `@ ${data.company}` : ''}
        </p>
      </div>
    </div>
    
    {/* Review Text */}
    <div className="relative">
      <span className="absolute -top-3 -left-1 text-4xl text-slate-100 font-serif leading-none">"</span>
      <p className="relative z-10 text-slate-600 text-[15px] sm:text-lg leading-relaxed italic pl-3 line-clamp-4">
        {data.review || data.message || data.testimonial}
      </p>
    </div>

    {/* Rating Stars */}
    {data.rating && (
      <div className="flex gap-1 mt-3 justify-start">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < data.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
    )}

    {/* Footer Info */}
    <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center">
      <span className="text-[11px] sm:text-sm text-slate-400 uppercase tracking-wider font-semibold">
        📍 {data.location || 'India'}
      </span>
      <span className="bg-blue-50 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-blue-600">
        {data.years_with_us || 'Customer'}
      </span>
    </div>
  </div>
);

export default Testimonials;