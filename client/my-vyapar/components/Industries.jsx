"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from "../components/SectionTitle";

const Industries = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isMobileAutoPlaying, setIsMobileAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  const mobileAutoPlayRef = useRef(null);
  const timeoutRef = useRef(null);
  const mobileContainerRef = useRef(null);

  const leftCards = [
    { text: 'Drive Innovation', image: 'innovation', color: '#7fa1d0', desc: 'Transform your business with cutting-edge billing solutions' },
    { text: 'Empower Growth', image: 'growth', color: '#6366f1', desc: 'Scale your business with powerful accounting tools' },
    { text: 'GSTR Filing', image: 'gstr', color: '#7bb2cc', desc: 'Simplify GST returns with automated filing' },
    { text: 'Unite Industries', image: 'unite', color: '#edf3f6', desc: 'Connect all your business operations seamlessly' },
    { text: 'Expand Reach', image: 'expand', color: '#4b22c5', desc: 'Grow your customer base with digital invoices' },
    { text: 'Boost Resilience', image: 'resilience', color: '#3287ab', desc: 'Build a resilient business with smart financial management' },
    { text: 'Retail Solutions', image: 'retail', color: '#8148ec', desc: 'Complete POS and inventory management for retail stores' },
    { text: 'Manufacturing Hub', image: 'manufacturing', color: '#5cb8f6', desc: 'Streamline production with smart manufacturing tools' },
    { text: 'Healthcare Plus', image: 'healthcare', color: '#1d3bd2', desc: 'Secure billing and patient management solutions' },
    { text: 'Education Suite', image: 'education', color: '#9b9bdd', desc: 'Simplify fee collection and academic administration' },
    { text: 'Real Estate Pro', image: 'realestate', color: '#3b82f6', desc: 'Manage properties, rentals, and commissions easily' }
  ];

  const tagCloud = [
    'downtown', 'shop local', 'support', 'local economy', 'business',
    'partnership', 'brick and mortar', 'service', 'mom and pop', 'buy local',
    'small', 'main street', 'retail', 'wholesale', 'manufacturing',
    'hospitality', 'healthcare', 'education', 'real estate', 'transport'
  ];

  // Desktop auto-play logic
  useEffect(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    
    if (isPlaying && !isHovering) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % leftCards.length);
      }, 4000);
    }
    return () => clearInterval(autoPlayRef.current);
  }, [isPlaying, isHovering, leftCards.length]);

  // Mobile auto-play logic
  useEffect(() => {
    if (mobileAutoPlayRef.current) clearInterval(mobileAutoPlayRef.current);
    
    if (isMobileAutoPlaying) {
      mobileAutoPlayRef.current = setInterval(() => {
        setMobileIndex(prev => (prev + 1) % leftCards.length);
      }, 3000);
    }
    return () => clearInterval(mobileAutoPlayRef.current);
  }, [isMobileAutoPlaying, leftCards.length]);

  const handleManualNav = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPlaying(true), 5000);
  };

  const handleMobilePrev = () => {
    setIsMobileAutoPlaying(false);
    setMobileIndex(prev => (prev === 0 ? leftCards.length - 1 : prev - 1));
  };

  const handleMobileNext = () => {
    setIsMobileAutoPlaying(false);
    setMobileIndex(prev => (prev + 1) % leftCards.length);
  };

  const handleMobileDotClick = (index) => {
    setIsMobileAutoPlaying(false);
    setMobileIndex(index);
  };

  const handleMobileHover = () => {
    setIsMobileAutoPlaying(false);
  };

  const handleMobileLeave = () => {
    setIsMobileAutoPlaying(true);
  };

  const getImageUrl = (key) => {
    const urls = {
      innovation: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      growth: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      gstr: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      unite: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      expand: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
      resilience: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      retail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      manufacturing: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=1200&q=80",
      healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      education: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
      realestate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
    };
    return urls[key];
  };

  const prevIndex = (currentIndex - 1 + leftCards.length) % leftCards.length;
  const nextIndex = (currentIndex + 1) % leftCards.length;

  return (
  <section className="relative w-full py-16 lg:py-24 bg-[#f8fafc] overflow-hidden font-['Inter']">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center max-w-3xl mx-auto">
      <SectionTitle
        title="Supporting businesses from a wide range of industries"
      />

  </div>

        {/* DESKTOP/TV VIEW - Visible on lg screens and above */}
        <div className="hidden lg:block">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between mt-16">
            
            {/* LEFT SIDE: The Panel Stack */}
            <div 
              className="w-full lg:w-1/2 flex flex-col items-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <button 
                onClick={() => handleManualNav(prevIndex)}
                className="mb-8 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all z-10 border border-slate-100"
              >
                ▲
              </button>

              <div className="relative h-[350px] w-full max-w-[450px]">
                <AnimatePresence initial={false}>
                  {leftCards.map((card, index) => {
                    const isActive = index === currentIndex;
                    const isPrev = index === prevIndex;
                    const isNext = index === nextIndex;

                    if (!isActive && !isPrev && !isNext) return null;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: isActive ? 1 : 0.4,
                          y: isActive ? 120 : (isPrev ? 0 : 240),
                          scale: isActive ? 1.05 : 0.9,
                          zIndex: isActive ? 20 : 10,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        onClick={() => handleManualNav(index)}
                        className="absolute inset-x-0 mx-auto h-[100px] rounded-[24px] flex items-center justify-center cursor-pointer shadow-xl"
                        style={{ backgroundColor: card.color }}
                      >
                        <span className="text-white text-xl md:text-2xl font-bold px-4 text-center">
                          {card.text}
                        </span>
                        {isActive && (
                          <motion.div 
                            layoutId="activeBorder"
                            className="absolute inset-0 rounded-[24px] border-4 border-blue-500/50"
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => handleManualNav(nextIndex)}
                className="mt-8 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all z-10 border border-slate-100"
              >
                ▼
              </button>
              <p className="mt-4 text-slate-400 text-sm font-medium">{currentIndex + 1} of {leftCards.length} Industries</p>
            </div>

            {/* RIGHT SIDE: The Animated Showcase */}
            <div className="w-full lg:w-1/2">
              <div className="relative h-[450px] lg:h-[550px] w-full rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] overflow-hidden bg-slate-200">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ x: -150, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 150, opacity: 0, scale: 1.1 }}
                    transition={{ 
                      x: { type: "spring", stiffness: 100, damping: 20 },
                      opacity: { duration: 0.4 }
                    }}
                    className="absolute inset-0"
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-110"
                      style={{ backgroundImage: `url(${getImageUrl(leftCards[currentIndex].image)})` }}
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 lg:p-12">
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-white text-3xl lg:text-5xl font-bold mb-4 drop-shadow-md">
                          {leftCards[currentIndex].text}
                        </h3>
                        <p className="text-slate-200 text-base lg:text-xl mb-6 max-w-lg leading-relaxed">
                          {leftCards[currentIndex].desc}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {tagCloud.slice(currentIndex, currentIndex + 4).map((tag, i) => (
                            <span 
                              key={i} 
                              className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs lg:text-sm border border-white/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE/TABLET VIEW - Visible below lg screens */}
        <div className="lg:hidden mt-8">
          <div className="relative max-w-md mx-auto">
            {/* Carousel Container with hover pause */}
            <div 
              className="overflow-hidden rounded-xl"
              ref={mobileContainerRef}
              onMouseEnter={handleMobileHover}
              onMouseLeave={handleMobileLeave}
            >
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {leftCards.map((industry, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      {/* Image - wider than tall (16:9 aspect ratio) */}
                      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(industry.image)}
                          alt={industry.text}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Name below image */}
                      <h3 className="text-lg font-semibold text-center mt-3" 
                          style={{ color: industry.color }}>
                        {industry.text}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handleMobilePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all border border-gray-200"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={handleMobileNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all border border-gray-200"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {leftCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleMobileDotClick(index)}
                  className={`transition-all duration-300 ${
                    index === mobileIndex
                      ? "w-6 h-2 bg-blue-600 rounded-full"
                      : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Current index indicator */}
            <p className="text-center text-sm text-gray-500 mt-3">
              {mobileIndex + 1} of {leftCards.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;