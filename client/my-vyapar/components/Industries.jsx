"use client";
import React, { useState, useEffect, useRef } from 'react';

const Industries = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

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
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % leftCards.length);
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, leftCards.length]);

  useEffect(() => {
    if (sliderRef.current) {
      const cardHeight = 120;
      const containerHeight = 400;
      const scrollPosition = (currentIndex + leftCards.length) * cardHeight - (containerHeight / 2) + (cardHeight / 2);
      
      sliderRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, leftCards.length]);

  const getRightPanelImage = () => {
    switch(leftCards[currentIndex].image) {
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
    setTimeout(() => setIsPlaying(true), 5000);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 5000);
  };

  const handleMouseEnter = () => {
    setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative w-full py-[100px] bg-gradient-to-b from-[#f8fafc] to-white font-['Inter',sans-serif] overflow-hidden max-md:py-[70px] max-sm:py-[50px]">
      <style jsx>{`
        /* Center card highlight - clean and subtle */
        .industries__card--center {
          transform: scale(1.02);
          border: 2px solid #3B82F6;
          background: white;
          z-index: 10;
          position: relative;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
        }
        
        /* Hide scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-[60px] relative max-lg:px-10 max-md:px-[30px] max-sm:px-5">
        
        <h2 className="text-5xl font-extrabold leading-[1.2] text-center max-w-[1000px] mx-auto mb-5 bg-gradient-to-r from-[#3A80F2] to-[#234C90] bg-clip-text text-transparent max-lg:text-[42px] max-md:text-4xl max-sm:text-3xl">
          Supporting businesses from a wide range of industries
        </h2>
        <div className="w-[200px] h-1 bg-gradient-to-r from-[#3B82F6] to-[#234C90] mx-auto mb-[30px] rounded-[2px]"></div>

        <p className="text-xl text-[#475569] text-center max-w-[900px] mx-auto mb-[60px] leading-[1.6] font-light max-lg:text-lg max-md:text-base max-sm:mb-10">
          We understand your unique billing and accounting needs, Vyapar India billing software 
          is specially designed for Indian SMBs.
        </p>

        <div className="flex gap-[60px] items-center justify-between max-lg:flex-col max-lg:gap-[50px]">
          {/* LEFT PANEL - Hidden on mobile, visible on desktop */}
          <div 
            className="flex-1 relative py-[30px] max-w-[550px] max-lg:max-w-full max-lg:w-full hidden md:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="h-[450px] overflow-hidden rounded-[30px] bg-transparent py-[15px] relative max-md:h-[400px]">
              <div 
                className="h-full overflow-y-auto scroll-smooth px-[30px]"
                ref={sliderRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                      className={`w-full max-w-[450px] h-[110px] bg-white border border-[#E0E2E7] rounded-[20px] flex items-center pl-[35px] mx-auto mb-[25px] transition-all duration-300 cursor-pointer relative hover:translate-x-2 hover:shadow-md ${
                        isCenter ? 'industries__card--center' : 'shadow-sm'
                      }`}
                      style={{ 
                        opacity: opacity,
                      }}
                      onClick={() => handleCardClick(originalIndex)}
                    >
                      <span className={`text-2xl font-semibold text-[#1e293b] whitespace-nowrap transition-all duration-300 max-md:text-[22px] max-sm:text-xl ${
                        isCenter ? 'text-[#3B82F6] font-bold' : ''
                      }`}>
                        {card.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL - Image with content, full width on mobile */}
          <div 
            className="flex-1 h-[550px] rounded-[45px] overflow-hidden relative transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.15)] max-w-[650px] max-lg:max-w-full max-lg:w-full max-md:h-[450px] max-sm:h-[400px] max-sm:w-full"
            style={{ 
              backgroundImage: getRightPanelImage(), 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-black/70 via-black/40 to-black/20 flex items-end p-[50px] max-md:p-[30px] max-sm:p-5">
              <div className="text-white w-full">
                <h3 className="text-[38px] font-bold mb-4 drop-shadow-lg max-md:text-3xl max-sm:text-2xl">
                  {leftCards[currentIndex].text}
                </h3>
                <p className="text-lg mb-6 leading-[1.6] drop-shadow max-md:text-base max-sm:text-sm">
                  {leftCards[currentIndex].text === 'Drive Innovation' && 'Transform your business with cutting-edge billing solutions'}
                  {leftCards[currentIndex].text === 'Empower Growth' && 'Scale your business with powerful accounting tools'}
                  {leftCards[currentIndex].text === 'GSTR Filing' && 'Simplify GST returns with automated filing'}
                  {leftCards[currentIndex].text === 'Unite Industries' && 'Connect all your business operations seamlessly'}
                  {leftCards[currentIndex].text === 'Expand Reach' && 'Grow your customer base with digital invoices'}
                  {leftCards[currentIndex].text === 'Boost Resilience' && 'Build a resilient business with smart financial management'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {tagCloud.slice(0, 6).map((tag, i) => (
                    <span key={i} className="text-[15px] px-5 py-2 bg-white/20 backdrop-blur-[8px] rounded-[35px] border border-white/40 text-white font-medium transition-all duration-300 hover:bg-[#3b82f699] hover:-translate-y-1 max-sm:text-xs max-sm:px-3 max-sm:py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE SECTION - Only visible on mobile, shows current selection and dots */}
        <div className="md:hidden mt-8 space-y-4">
          {/* Current viewing text */}
          <p className="text-center text-base text-gray-700">
             <h1><span className="font-bold text-blue-600">{leftCards[currentIndex].text}</span></h1>
          </p>
          
          {/* Navigation dots - clicking these changes the image AND content */}
          <div className="flex justify-center gap-3">
            {leftCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-10 h-2.5 bg-blue-600 rounded-full' 
                    : 'w-2.5 h-2.5 bg-gray-300 rounded-full hover:bg-gray-400'
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