"use client";

import React, { useState, useEffect, useRef } from 'react';

const Industries = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  const leftCards = [
    { text: 'Drive Innovation', opacity: 0.18, image: 'innovation' },
    { text: 'Empower Growth', opacity: 0.64, image: 'growth' },
    { text: 'GSTR Filing', opacity: 1, isHighlighted: true, image: 'gstr' },
    { text: 'Unite Industries', opacity: 1, image: 'unite' },
    { text: 'Expand Reach', opacity: 0.52, image: 'expand' },
    { text: 'Boost Resilience', opacity: 0.18, image: 'resilience' }
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
    const images = {
      innovation: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
      growth: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
      gstr: 'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
      unite: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
      expand: 'url("https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")',
      resilience: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")'
    };
    return images[leftCards[currentIndex].image] || images.gstr;
  };

  const handleCardClick = (index) => {
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
        .industries__card--center {
          transform: scale(1.05);
          box-shadow: 0 25px 45px rgba(59, 130, 246, 0.35),
                      0 0 0 3px #3B82F6,
                      0 0 40px rgba(59, 130, 246, 0.6);
          border: none;
          z-index: 10;
          position: relative;
        }
        .industries__card--center::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border-radius: 22px;
          z-index: -1;
          opacity: 0.4;
          filter: blur(12px);
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-[60px] relative max-lg:px-10 max-md:px-[30px] max-sm:px-5">
        {/* Gradient Line */}
        <div className="w-[200px] h-1 bg-gradient-to-r from-[#3B82F6] to-[#234C90] mx-auto mb-[30px] rounded-[2px]"></div>

        {/* Main Heading */}
        <h2 className="text-5xl font-extrabold leading-[1.2] text-center max-w-[1000px] mx-auto mb-5 bg-gradient-to-r from-[#3A80F2] to-[#234C90] bg-clip-text text-transparent max-lg:text-[42px] max-md:text-4xl max-sm:text-3xl">
          Supporting businesses from a wide range of industries
        </h2>

        {/* Subheading */}
        <p className="text-xl text-[#475569] text-center max-w-[900px] mx-auto mb-[60px] leading-[1.6] font-light max-lg:text-lg max-md:text-base max-sm:mb-10">
          We understand your unique billing and accounting needs, Vyapar India billing software 
          is specially designed for Indian SMBs.
        </p>

        {/* Two Column Layout */}
        <div className="flex gap-[60px] items-center justify-between max-lg:flex-col max-lg:gap-[50px]">
          {/* Left Side - Auto-sliding Panel */}
          <div 
            className="flex-1 relative py-[30px] max-w-[550px] max-lg:max-w-full max-lg:w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="h-[450px] overflow-hidden rounded-[30px] bg-transparent py-[15px] relative max-md:h-[400px]">
              <div 
                className="h-full overflow-y-auto scrollbar-hide scroll-smooth px-[30px]"
                ref={sliderRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {infiniteCards.map((card, index) => {
                  const originalIndex = index % leftCards.length;
                  const isCenter = originalIndex === currentIndex && 
                    index >= leftCards.length && 
                    index < leftCards.length * 2;
                  
                  return (
                    <div
                      key={index}
                      className={`w-full max-w-[450px] h-[110px] bg-white border border-[#E0E2E7] shadow-[0_8px_15px_rgba(0,0,0,0.05)] rounded-[20px] flex items-center pl-[35px] mx-auto mb-[25px] transition-all duration-300 cursor-pointer relative z-10 hover:translate-x-2 hover:shadow-[0_12px_25px_rgba(255,255,255,0.2)] hover:border-red-500 ${
                        isCenter ? 'industries__card--center' : ''
                      }`}
                      style={{ 
                        opacity: isCenter ? 1 : card.opacity,
                      }}
                      onClick={() => handleCardClick(originalIndex)}
                    >
                      <span className={`text-2xl font-semibold text-[#1e293b] whitespace-nowrap transition-all duration-300 max-md:text-[22px] max-sm:text-xl ${
                        isCenter ? '!text-[#3B82F6] font-bold text-[26px] max-md:text-2xl' : ''
                      }`}>
                        {card.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Image Panel */}
          <div 
            className="flex-1 h-[550px] rounded-[45px] overflow-hidden relative transition-all duration-500 shadow-[0_30px_50px_rgba(0,0,0,0.2)] max-w-[650px] max-lg:max-w-full max-lg:w-full max-md:h-[450px] max-sm:h-[400px]"
            style={{ backgroundImage: getRightPanelImage(), backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-black/80 via-black/50 to-black/30 flex items-end p-[50px] max-md:p-[30px] max-sm:p-5">
              <div className="text-white w-full">
                <h3 className="text-[38px] font-bold mb-4 text-shadow-[0_4px_15px_rgba(0,0,0,0.4)] max-md:text-3xl max-sm:text-2xl">
                  {leftCards[currentIndex].text}
                </h3>
                <p className="text-lg mb-6 opacity-95 leading-[1.6] text-shadow-[0_2px_8px_rgba(0,0,0,0.3)] max-md:text-base max-sm:text-sm">
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
      </div>
    </section>
  );
};

export default Industries;