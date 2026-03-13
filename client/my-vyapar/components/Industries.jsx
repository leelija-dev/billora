// components/Industries.jsx
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

  // 11 panels total (6 old + 5 new)
  const leftCards = [
    // Original 6 panels
    { text: 'Drive Innovation', image: 'innovation', color: '#7fa1d0' },
    { text: 'Empower Growth', image: 'growth', color: '#6366f1' },
    { text: 'GSTR Filing', image: 'gstr', color: '#7bb2cc' },
    { text: 'Unite Industries', image: 'unite', color: '#edf3f6' },
    { text: 'Expand Reach', image: 'expand', color: '#4b22c5' },
    { text: 'Boost Resilience', image: 'resilience', color: '#3287ab' },
    
    // 5 New panels
    { text: 'Retail Solutions', image: 'retail', color: '#8148ec' },
    { text: 'Manufacturing Hub', image: 'manufacturing', color: '#5cb8f6' },
    { text: 'Healthcare Plus', image: 'healthcare', color: '#1d3bd2' },
    { text: 'Education Suite', image: 'education', color: '#9b9bdd' },
    { text: 'Real Estate Pro', image: 'realestate', color: '#3b82f6' }
  ];

  const tagCloud = [
    'downtown', 'shop local', 'support', 'local economy', 'business',
    'partnership', 'brick and mortar', 'service', 'mom and pop', 'buy local',
    'small', 'main street', 'retail', 'wholesale', 'manufacturing',
    'hospitality', 'healthcare', 'education', 'real estate', 'transport'
  ];

  // Clean up function for intervals and timeouts
  const clearAllTimers = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Start auto-play only if not hovering
  useEffect(() => {
    clearAllTimers();
    
    if (isPlaying && !isHovering) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % leftCards.length);
      }, 3000);
    }

    return clearAllTimers;
  }, [isPlaying, isHovering, leftCards.length]);

  const getRightPanelImage = () => {
    switch (leftCards[currentIndex].image) {
      // Original images
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
      
      // New images
      case 'retail':
        return 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'manufacturing':
        return 'url("https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'healthcare':
        return 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'education':
        return 'url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      case 'realestate':
        return 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
      default:
        return 'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")';
    }
  };

  const handleCardClick = (index) => {
    setCurrentIndex(index);
    
    // Clear any existing timers
    clearAllTimers();
    
    // Stop auto-play
    setIsPlaying(false);
    
    // Resume auto-play after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsPlaying(false); // ALWAYS stop auto-play when hovering
    clearAllTimers(); // Clear any running timers
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsPlaying(true); // ALWAYS resume auto-play when not hovering
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % leftCards.length);
    
    clearAllTimers();
    setIsPlaying(false);
    
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + leftCards.length) % leftCards.length);
    
    clearAllTimers();
    setIsPlaying(false);
    
    // Set timeout to resume playing after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    
    clearAllTimers();
    setIsPlaying(false);
    
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  // Get previous and next indices
  const prevIndex = (currentIndex - 1 + leftCards.length) % leftCards.length;
  const nextIndex = (currentIndex + 1) % leftCards.length;

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-[100px] bg-gradient-to-b from-[#f8fafc] to-white font-['Inter',sans-serif] overflow-hidden">
      <style jsx>{`
        .panel {
          position: absolute;
          width: 100%;
          height: 110px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          font-weight: 600;
          color: white;
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          left: 0;
          right: 0;
          margin: 0 auto;
          max-width: 450px;
        }

        .panel.prev {
          top: 0;
          opacity: 0.45;
          transform: scale(0.95);
          z-index: 1;
        }

        .panel.active {
          top: 125px;
          transform: scale(1.08);
          z-index: 3;
          box-shadow: 0 20px 35px rgba(59, 130, 246, 0.3);
          border: 3px solid #3B82F6;
        }

        .panel.next {
          top: 250px;
          opacity: 0.45;
          transform: scale(0.95);
          z-index: 1;
        }

        .panel.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .arrow-button {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: linear-gradient(145deg, #3B82F6, #2563EB);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.25s ease;
          border: 1px solid rgba(255,255,255,0.3);
          margin: 0 auto;
        }

        .arrow-button:hover {
          transform: scale(1.1);
          box-shadow: 0 15px 25px rgba(37, 99, 235, 0.3);
        }

        .arrow-button:active {
          transform: scale(0.95);
        }

        .cards-container {
          position: relative;
          height: 360px;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
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
          {/* LEFT PANEL - Panel Stack */}
          <div
            className="flex-1 relative py-[20px] max-w-[500px] max-lg:max-w-full max-lg:w-full"
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* UP ARROW */}
            <div className="flex justify-center mb-4">
              <button 
                onClick={handlePrev}
                className="arrow-button"
                aria-label="Previous panel"
              >
                <span className="text-lg">▲</span>
              </button>
            </div>

            {/* Cards Stack */}
            <div className="cards-container">
              {leftCards.map((card, index) => {
                let positionClass = 'hidden';
                
                if (index === prevIndex) {
                  positionClass = 'prev';
                } else if (index === currentIndex) {
                  positionClass = 'active';
                } else if (index === nextIndex) {
                  positionClass = 'next';
                }

                return (
                  <div
                    key={index}
                    className={`panel ${positionClass}`}
                    style={{ backgroundColor: card.color }}
                    onClick={() => handleCardClick(index)}
                  >
                    <span className="text-white font-semibold">
                      {card.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* DOWN ARROW */}
            <div className="flex justify-center mt-4">
              <button 
                onClick={handleNext}
                className="arrow-button"
                aria-label="Next panel"
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
                  
                  {/* New panel descriptions */}
                  {leftCards[currentIndex].text === 'Retail Solutions' && 'Complete POS and inventory management for retail stores'}
                  {leftCards[currentIndex].text === 'Manufacturing Hub' && 'Streamline production with smart manufacturing tools'}
                  {leftCards[currentIndex].text === 'Healthcare Plus' && 'Secure billing and patient management solutions'}
                  {leftCards[currentIndex].text === 'Education Suite' && 'Simplify fee collection and academic administration'}
                  {leftCards[currentIndex].text === 'Real Estate Pro' && 'Manage properties, rentals, and commissions easily'}
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

        {/* MOBILE SECTION - Navigation Dots */}
        <div className="lg:hidden mt-8 sm:mt-10">
          <div className="flex justify-center gap-2 flex-wrap max-w-[300px] mx-auto">
            {leftCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 sm:w-9 h-2 sm:h-2.5 bg-blue-600 rounded-full"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 rounded-full hover:bg-gray-400"
                }`}
                aria-label={`View ${leftCards[idx].text}`}
              />
            ))}
          </div>
          
          Panel count for mobile
          <div className="text-center text-sm text-gray-500 mt-4">
            {currentIndex + 1} of {leftCards.length} industries
          </div>

          Mobile active panel name
           <div className="text-center mt-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-600">
              {leftCards[currentIndex].text}
            </h3>
          </div> 
        </div>
      </div>
    </section>
  );
};


export default Industries;


