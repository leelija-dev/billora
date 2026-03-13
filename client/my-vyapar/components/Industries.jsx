"use client";
import SectionTitle from "../components/SectionTitle";
import React, { useState, useEffect, useRef } from 'react';

const Industries = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false); // Starts paused
  const [isHovering, setIsHovering] = useState(false); // Track if hovering
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const timeoutRef = useRef(null); // For tracking setTimeout

  const leftCards = [
    { text: 'Drive Innovation', opacity: 0.4, image: 'innovation' },
    { text: 'Empower Growth', opacity: 0.6, image: 'growth' },
    { text: 'GSTR Filing', opacity: 1, image: 'gstr' },
    { text: 'Unite Industries', opacity: 1, image: 'unite' },
    { text: 'Expand Reach', opacity: 0.6, image: 'expand' },
    { text: 'Boost Resilience', opacity: 0.4, image: 'resilience' }
  ];

  const infiniteCards = [...leftCards, ...leftCards, ...leftCards];

  const tagCloud = [
    'downtown', 'shop local', 'support', 'local economy', 'business',
    'partnership', 'brick and mortar', 'service', 'mom and pop', 'buy local',
    'small', 'main street', 'retail', 'wholesale', 'manufacturing',
    'hospitality', 'healthcare', 'education', 'real estate', 'transport'
  ];

  useEffect(() => {
    // Only auto-play if not hovering and isPlaying is true
    if (isPlaying && !isHovering) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % leftCards.length);
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, isHovering, leftCards.length]);

  useEffect(() => {
    if (sliderRef.current) {
      const cardHeight = 140;
      const containerHeight = 500;
      const scrollPosition = (currentIndex + leftCards.length) * cardHeight - (containerHeight / 2) + (cardHeight / 2);

      sliderRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, leftCards.length]);

  const getRightPanelImage = () => {
    switch (leftCards[currentIndex].image) {
      case 'innovation':
        return 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'growth':
        return 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'gstr':
        return 'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'unite':
        return 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'expand':
        return 'url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'resilience':
        return 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      default:
        return 'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
    }
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setIsHovering(true); // Set hovering to true to prevent auto-scroll
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout to resume playing after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
      setIsHovering(false);
    }, 5000);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setIsHovering(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
      setIsHovering(false);
    }, 5000);
  };

  const handleMouseEnter = () => {
    setIsPlaying(false);
    setIsHovering(true);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsPlaying(false);
      setIsHovering(true);
      
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsPlaying(true);
        setIsHovering(false);
      }, 5000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleUpClick = () => {
    const prevIndex = (currentIndex - 1 + leftCards.length) % leftCards.length;
    setCurrentIndex(prevIndex);
    setIsPlaying(false);
    setIsHovering(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
      setIsHovering(false);
    }, 5000);
  };

  const handleDownClick = () => {
    const nextIndex = (currentIndex + 1) % leftCards.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(false);
    setIsHovering(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
      setIsHovering(false);
    }, 5000);
  };

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-[100px] bg-gradient-to-b from-[#f8fafc] to-white font-['Inter',sans-serif] overflow-hidden">
      <style jsx>{`
        .industries__card--center {
          transform: scale(1.05);
          border: 3px solid #3B82F6;
          background: white;
          z-index: 10;
          position: relative;
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.2);
        }
        
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="text-center max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[60px] relative">

        {/* SECTION TITLE COMPONENT */}
        <SectionTitle
          title="Supporting businesses from a wide range of industries"
          description="We understand your unique billing and accounting needs, Vyapar India billing software is specially designed for Indian SMBs."
        />
        <p className="text-[#475569] text-xl max-w-[600px] mx-auto mt-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both] max-md:text-lg max-sm:text-base">
          Get started with Billora in three simple steps
        </p>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-[60px] items-center justify-between mt-12 sm:mt-14 md:mt-16 lg:mt-20">
          {/* LEFT PANEL - Hidden on mobile, visible on desktop */}
          <div
            className="flex-1 relative py-[30px] max-w-[550px] max-lg:max-w-full max-lg:w-full hidden lg:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* UP/DOWN ARROW BUTTONS - Now positioned at bottom */}
            <div className="flex justify-end gap-3 mb-3 px-[30px]">
              <button 
                onClick={handleUpClick}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                aria-label="Previous card"
              >
                <span className="text-lg">▲</span>
              </button>
            </div>

            <div className="h-[500px] overflow-hidden rounded-[30px] bg-transparent py-[15px] relative max-md:h-[400px]">
              <div
                className="h-full overflow-y-auto scroll-smooth px-[30px]"
                ref={sliderRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {infiniteCards.map((card, index) => {
                  const originalIndex = index % leftCards.length;
                  const isCenter = originalIndex === currentIndex &&
                    index >= leftCards.length &&
                    index < leftCards.length * 2;

                  let opacity = card.opacity;
                  if (isCenter) {
                    opacity = 1;
                  } else if (Math.abs(index - (currentIndex + leftCards.length)) <= 2) {
                    opacity = 0.8;
                  } else {
                    opacity = 0.4;
                  }

                  return (
                    <div
                      key={index}
                      className={"w-full max-w-[450px] h-[130px] bg-white border border-[#E0E2E7] rounded-[20px] flex items-center pl-[35px] mx-auto mb-[25px] transition-all duration-300 cursor-pointer relative hover:translate-x-2 hover:shadow-md " + (isCenter ? 'industries__card--center' : 'shadow-sm')}
                      style={{
                        opacity: opacity,
                      }}
                      onClick={() => handleCardClick(originalIndex)}
                    >
                      <span className={"text-3xl font-semibold text-[#1e293b] whitespace-nowrap transition-all duration-300 max-md:text-2xl max-sm:text-xl " + (isCenter ? 'text-[#3B82F6] font-bold' : '')}>
                        {card.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* DOWN ARROW - Now at the bottom of slider */}
            <div className="flex justify-end gap-3 mt-3 px-[30px]">
              <button 
                onClick={handleDownClick}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-1"
                aria-label="Next card"
              >
                <span className="text-lg">▼</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL - Image with content */}
          <div
            className="flex-1 h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] rounded-[30px] sm:rounded-[40px] md:rounded-[45px] overflow-hidden relative transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.15)] max-w-[650px] max-lg:max-w-full w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: getRightPanelImage(),
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 flex items-end p-6 sm:p-8 md:p-10 lg:p-[50px]">
              <div className="text-white w-full">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold mb-3 sm:mb-4 md:mb-5 drop-shadow-lg">
                  {leftCards[currentIndex].text}
                </h3>
                <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed drop-shadow">
                  {leftCards[currentIndex].text === 'Drive Innovation' && 'Transform your business with cutting-edge billing solutions'}
                  {leftCards[currentIndex].text === 'Empower Growth' && 'Scale your business with powerful accounting tools'}
                  {leftCards[currentIndex].text === 'GSTR Filing' && 'Simplify GST returns with automated filing'}
                  {leftCards[currentIndex].text === 'Unite Industries' && 'Connect all your business operations seamlessly'}
                  {leftCards[currentIndex].text === 'Expand Reach' && 'Grow your customer base with digital invoices'}
                  {leftCards[currentIndex].text === 'Boost Resilience' && 'Build a resilient business with smart financial management'}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {tagCloud.slice(0, 6).map((tag, i) => (
                    <span key={i} className="text-xs sm:text-sm md:text-[16px] px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-white/20 backdrop-blur-[8px] rounded-full border border-white/40 text-white font-medium transition-all duration-300 hover:bg-[#3b82f699] hover:-translate-y-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SECTION */}
        <div className="lg:hidden mt-8 sm:mt-10 space-y-5 sm:space-y-6">

          {/* Mobile Image Card */}
          <div
            className="w-full h-[280px] rounded-[25px] overflow-hidden relative shadow-lg"
            style={{
              backgroundImage: getRightPanelImage(),
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 flex items-end p-5">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {leftCards[currentIndex].text}
                </h3>

                <p className="text-base leading-relaxed">
                  {leftCards[currentIndex].text === 'Drive Innovation' && 'Transform your business with cutting-edge billing solutions'}
                  {leftCards[currentIndex].text === 'Empower Growth' && 'Scale your business with powerful accounting tools'}
                  {leftCards[currentIndex].text === 'GSTR Filing' && 'Simplify GST returns with automated filing'}
                  {leftCards[currentIndex].text === 'Unite Industries' && 'Connect all your business operations seamlessly'}
                  {leftCards[currentIndex].text === 'Expand Reach' && 'Grow your customer base with digital invoices'}
                  {leftCards[currentIndex].text === 'Boost Resilience' && 'Build a resilient business with smart financial management'}
                </p>
              </div>
            </div>
          </div>

          {/* Current viewing text */}
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-blue-600">
              {leftCards[currentIndex].text}
            </h3>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {leftCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={idx === currentIndex
                    ? "w-8 sm:w-10 h-2.5 sm:h-3 bg-blue-600 rounded-full"
                    : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 rounded-full hover:bg-gray-400"
                  }
                aria-label={`View ${leftCards[idx].text}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};


export default Industries;


