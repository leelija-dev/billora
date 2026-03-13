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

  // Fixed centering effect - runs whenever currentIndex changes
  useEffect(() => {
    if (sliderRef.current) {
      const cardHeight = 120; // Smaller: 120px
      const containerHeight = 400; // Smaller: 400px
      
      // Find the actual index in the infinite array that corresponds to the current card
      // We want the card from the middle set (leftCards.length to leftCards.length*2)
      const targetIndex = currentIndex + leftCards.length;
      
      // Calculate position to center this card
      const scrollPosition = (targetIndex * cardHeight) - (containerHeight / 2) + (cardHeight / 2);

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
    setIsHovering(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
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
          box-shadow: 
            0 15px 30px rgba(59, 130, 246, 0.25),
            0 5px 15px rgba(0, 0, 0, 0.15),
            inset 0 -1px 3px rgba(0,0,0,0.1),
            inset 0 1px 3px rgba(255,255,255,0.8);
        }
        
        .industries__card {
          box-shadow: 
            0 8px 15px rgba(0, 0, 0, 0.1),
            0 3px 6px rgba(0, 0, 0, 0.08),
            inset 0 -1px 2px rgba(0,0,0,0.1),
            inset 0 1px 2px rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }
        
        .industries__card:hover {
          transform: translateX(5px) translateY(-1px);
          box-shadow: 
            0 15px 25px rgba(0, 0, 0, 0.15),
            0 5px 10px rgba(0, 0, 0, 0.1),
            inset 0 -1px 3px rgba(0,0,0,0.1),
            inset 0 1px 3px rgba(255,255,255,0.8);
        }
        
        div::-webkit-scrollbar {
          display: none;
        }

        .nav-button {
          width: 40px;
          height: 40px;
          background: linear-gradient(145deg, #3B82F6, #2563EB);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 8px 15px rgba(37, 99, 235, 0.25),
            0 3px 6px rgba(0, 0, 0, 0.15),
            inset 0 -1px 3px rgba(0,0,0,0.2),
            inset 0 1px 3px rgba(255,255,255,0.5);
          transition: all 0.2s ease;
          font-size: 20px;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
        }

        .nav-button:hover {
          transform: scale(1.05);
          box-shadow: 
            0 12px 20px rgba(37, 99, 235, 0.3),
            0 5px 10px rgba(0, 0, 0, 0.2),
            inset 0 -1px 3px rgba(0,0,0,0.2),
            inset 0 1px 3px rgba(255,255,255,0.6);
        }

        .nav-button:active {
          transform: scale(0.95);
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
            className="flex-1 relative py-[20px] max-w-[500px] max-lg:max-w-full max-lg:w-full hidden lg:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* UP ARROW - Centered above */}
            <div className="flex justify-center mb-3">
              <button 
                onClick={handleUpClick}
                className="nav-button"
                aria-label="Previous card"
              >
                ▲
              </button>
            </div>

            <div className="h-[400px] overflow-hidden rounded-[30px] bg-transparent py-[10px] relative">
              <div
                className="h-full overflow-y-auto scroll-smooth px-[25px]"
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
                      className={"w-full max-w-[450px] h-[120px] bg-white border border-[#E0E2E7] rounded-[20px] flex items-center pl-[30px] mx-auto mb-[20px] transition-all duration-300 cursor-pointer relative industries__card " + (isCenter ? 'industries__card--center' : '')}
                      style={{
                        opacity: opacity,
                      }}
                      onClick={() => handleCardClick(originalIndex)}
                    >
                      <span className={"text-2xl font-semibold text-[#1e293b] whitespace-nowrap transition-all duration-300 max-md:text-xl max-sm:text-lg " + (isCenter ? 'text-[#3B82F6] font-bold' : '')}>
                        {card.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* DOWN ARROW - Centered below */}
            <div className="flex justify-center mt-3">
              <button 
                onClick={handleDownClick}
                className="nav-button"
                aria-label="Next card"
              >
                ▼
              </button>
            </div>
          </div>

          {/* RIGHT PANEL - Image with content */}
          <div
            className="flex-1 h-[350px] sm:h-[380px] md:h-[400px] lg:h-[450px] rounded-[30px] sm:rounded-[35px] md:rounded-[40px] overflow-hidden relative transition-all duration-500 shadow-[0_20px_35px_rgba(0,0,0,0.2)] max-w-[600px] max-lg:max-w-full w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundImage: getRightPanelImage(),
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 flex items-end p-6 sm:p-7 md:p-8 lg:p-[40px]">
              <div className="text-white w-full">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-bold mb-3 sm:mb-4 drop-shadow-lg">
                  {leftCards[currentIndex].text}
                </h3>
                <p className="text-sm sm:text-base md:text-lg mb-4 leading-relaxed drop-shadow max-w-[450px]">
                  {leftCards[currentIndex].text === 'Drive Innovation' && 'Transform your business with cutting-edge billing solutions'}
                  {leftCards[currentIndex].text === 'Empower Growth' && 'Scale your business with powerful accounting tools'}
                  {leftCards[currentIndex].text === 'GSTR Filing' && 'Simplify GST returns with automated filing'}
                  {leftCards[currentIndex].text === 'Unite Industries' && 'Connect all your business operations seamlessly'}
                  {leftCards[currentIndex].text === 'Expand Reach' && 'Grow your customer base with digital invoices'}
                  {leftCards[currentIndex].text === 'Boost Resilience' && 'Build a resilient business with smart financial management'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tagCloud.slice(0, 6).map((tag, i) => (
                    <span key={i} className="text-xs sm:text-sm md:text-[15px] px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-[8px] rounded-full border border-white/40 text-white font-medium transition-all duration-300 hover:bg-[#3b82f699] hover:-translate-y-1">
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
            className="w-full h-[260px] rounded-[25px] overflow-hidden relative shadow-lg"
            style={{
              backgroundImage: getRightPanelImage(),
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 flex items-end p-5">
              <div className="text-white">
                <h3 className="text-xl font-bold mb-2">
                  {leftCards[currentIndex].text}
                </h3>

                <p className="text-sm leading-relaxed">
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
            <h3 className="text-lg sm:text-xl font-bold text-blue-600">
              {leftCards[currentIndex].text}
            </h3>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-3">
            {leftCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={idx === currentIndex
                    ? "w-8 sm:w-9 h-2 sm:h-2.5 bg-blue-600 rounded-full"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 rounded-full hover:bg-gray-400"
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