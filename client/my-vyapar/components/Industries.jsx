// components/Industries.jsx
"use client";
import SectionTitle from "../components/SectionTitle";
import React, { useState, useEffect, useRef } from 'react';

const Industries = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const timeoutRef = useRef(null);

  // 11 panels total (6 old + 5 new)
  const leftCards = [
    // Original 6 panels
    { text: 'Drive Innovation', image: 'innovation', color: '#7fa1d0' },
    { text: 'Empower Growth', image: 'growth', color: '#6366f1' },
    { text: 'GSTR Filing', image: 'gstr', color: '#7bb2cc' },
    { text: 'Unite Industries', image: 'unite', color: '#0ea5e9' },
    { text: 'Expand Reach', image: 'expand', color: '#22c55e' },
    { text: 'Boost Resilience', image: 'resilience', color: '#f97316' },
    
    // 5 New panels
    { text: 'Retail Solutions', image: 'retail', color: '#ec4899' },
    { text: 'Manufacturing Hub', image: 'manufacturing', color: '#8b5cf6' },
    { text: 'Healthcare Plus', image: 'healthcare', color: '#10b981' },
    { text: 'Education Suite', image: 'education', color: '#ef4444' },
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
    <section className="relative w-full py-8 sm:py-12 md:py-16 lg:py-[100px] bg-gradient-to-b from-[#f8fafc] to-white font-['Inter',sans-serif] overflow-hidden">
      <style jsx>{`
        .panel {
          position: absolute;
          width: 100%;
          height: 90px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          color: white;
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          left: 0;
          right: 0;
          margin: 0 auto;
          max-width: 90%;
        }

        @media (min-width: 640px) {
          .panel {
            height: 100px;
            font-size: 22px;
            max-width: 400px;
          }
        }

        @media (min-width: 768px) {
          .panel {
            height: 110px;
            font-size: 24px;
            max-width: 420px;
          }
        }

        @media (min-width: 1024px) {
          .panel {
            height: 110px;
            font-size: 26px;
            max-width: 450px;
          }
        }

        .panel.prev {
          top: 0;
          opacity: 0.45;
          transform: scale(0.95);
          z-index: 1;
        }

        .panel.active {
          top: 100px;
          transform: scale(1.05);
          z-index: 3;
          box-shadow: 0 20px 35px rgba(59, 130, 246, 0.3);
          border: 3px solid #3B82F6;
        }

        @media (min-width: 640px) {
          .panel.active {
            top: 115px;
            transform: scale(1.06);
          }
        }

        @media (min-width: 768px) {
          .panel.active {
            top: 120px;
            transform: scale(1.07);
          }
        }

        @media (min-width: 1024px) {
          .panel.active {
            top: 125px;
            transform: scale(1.08);
          }
        }

        .panel.next {
          top: 200px;
          opacity: 0.45;
          transform: scale(0.95);
          z-index: 1;
        }

        @media (min-width: 640px) {
          .panel.next {
            top: 230px;
          }
        }

        @media (min-width: 768px) {
          .panel.next {
            top: 240px;
          }
        }

        @media (min-width: 1024px) {
          .panel.next {
            top: 250px;
          }
        }

        .panel.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .arrow-button {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(145deg, #3B82F6, #2563EB);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.25s ease;
          border: 1px solid rgba(255,255,255,0.3);
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .arrow-button {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }

        @media (min-width: 1024px) {
          .arrow-button {
            width: 55px;
            height: 55px;
            font-size: 22px;
          }
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
          height: 300px;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .cards-container {
            height: 340px;
          }
        }

        @media (min-width: 768px) {
          .cards-container {
            height: 350px;
          }
        }

        @media (min-width: 1024px) {
          .cards-container {
            height: 360px;
          }
        }
      `}</style>

      <div className="text-center max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-[60px] relative">

        {/* SECTION TITLE COMPONENT */}
        <SectionTitle
          title="Supporting businesses from a wide range of industries"
          description="We understand your unique billing and accounting needs, Vyapar India billing software is specially designed for Indian SMBs."
        />
        <p className="text-[#475569] text-base sm:text-lg md:text-xl max-w-[600px] mx-auto mt-4 sm:mt-5 md:mt-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          Get started with Billora in three simple steps
        </p>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-[60px] items-center justify-between mt-8 sm:mt-10 md:mt-12 lg:mt-20">
          {/* LEFT PANEL - Panel Stack */}
          <div
            className="flex-1 relative py-4 sm:py-5 md:py-[20px] max-w-[500px] max-lg:max-w-full max-lg:w-full w-full px-2 sm:px-4"
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* UP ARROW */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <button 
                onClick={handlePrev}
                className="arrow-button"
                aria-label="Previous panel"
              >
                ▲
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
                    <span className="text-white font-semibold text-center px-2">
                      {card.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* DOWN ARROW */}
            <div className="flex justify-center mt-3 sm:mt-4">
              <button 
                onClick={handleNext}
                className="arrow-button"
                aria-label="Next panel"
              >
                ▼
              </button>
            </div>

            {/* Panel count indicator - visible on all screens */}
            <div className="text-center mt-4 sm:mt-5 text-xs sm:text-sm text-gray-500">
              {currentIndex + 1} of {leftCards.length} industries
            </div>
          </div>

          {/* RIGHT PANEL - Image with content */}
          <div
            className="flex-1 h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] lg:rounded-[40px] overflow-hidden relative transition-all duration-500 shadow-[0_20px_35px_rgba(0,0,0,0.2)] max-w-[600px] max-lg:max-w-full w-full mx-2 sm:mx-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: getRightPanelImage(),
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 flex items-end p-4 sm:p-5 md:p-6 lg:p-[40px]">
              <div className="text-white w-full">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-bold mb-2 sm:mb-3 lg:mb-4 drop-shadow-lg">
                  {leftCards[currentIndex].text}
                </h3>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 leading-relaxed drop-shadow max-w-[450px]">
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
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {tagCloud.slice(0, 4).map((tag, i) => (
                    <span key={i} className="text-[10px] sm:text-xs md:text-sm lg:text-[15px] px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-white/20 backdrop-blur-[8px] rounded-full border border-white/40 text-white font-medium transition-all duration-300 hover:bg-[#3b82f699] hover:-translate-y-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SECTION - Navigation Dots (Visible on mobile only) */}
        <div className="lg:hidden mt-6 sm:mt-8">
          <div className="flex justify-center gap-2 flex-wrap max-w-[300px] mx-auto">
            {leftCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-6 sm:w-7 h-1.5 sm:h-2 bg-blue-600 rounded-full"
                    : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 rounded-full hover:bg-gray-400"
                }`}
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