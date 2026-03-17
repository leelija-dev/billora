"use client";

<<<<<<< HEAD
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import Container from "../components/Container";
import SectionTitle from "./SectionTitle";

const INDUSTRY_DATA = [
  {
    id: 1,
    tag: "Innovation",
    title: "Drive Innovation",
    description: "Transform your business with cutting-edge billing solutions designed for the modern era of digital commerce.",
    buttonText: "Learn More",
    buttonLink: "/solutions/innovation",
    icon: "🚀",
    color: "#7fa1d0",
    lightColor: "#f0f4f9",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    tag: "Growth",
    title: "Empower Growth",
    description: "Scale your business with powerful accounting tools that provide deep insights into your financial health.",
    buttonText: "Scale Now",
    buttonLink: "/solutions/growth",
    icon: "📈",
    color: "#6366f1",
    lightColor: "#eef2ff",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    tag: "Compliance",
    title: "GSTR Filing",
    description: "Simplify GST returns with automated filing systems that ensure accuracy and save hours of manual work.",
    buttonText: "Start Filing",
    buttonLink: "/solutions/gstr",
    icon: "📑",
    color: "#7bb2cc",
    lightColor: "#f1f7f9",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    tag: "Operations",
    title: "Unite Industries",
    description: "Connect all your business operations seamlessly in one unified platform, from inventory to final sale.",
    buttonText: "Connect All",
    buttonLink: "/solutions/unite",
    icon: "🔗",
    color: "#4b5563",
    lightColor: "#f3f4f6",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    tag: "Reach",
    title: "Expand Reach",
    description: "Grow your customer base with professional digital invoices and integrated payment gateways.",
    buttonText: "Grow Reach",
    buttonLink: "/solutions/expand",
    icon: "🌍",
    color: "#4b22c5",
    lightColor: "#eeebf9",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
  },
];

const IndustrySection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // More responsive spring for smoother animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, // Increased from 70 for faster response
    damping: 25,    // Adjusted for smoother movement
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative h-[800vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
        <div className="h-[30vh] flex items-end justify-center pb-12 z-20">
          <Container size="full">
            <div className="text-center max-w-5xl mx-auto">
              <SectionTitle title="Supporting Businesses  from a wide range of industries" />
            </div>
          </Container>
        </div>

        <div className="h-[60vh] flex items-center justify-center z-10">
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 relative h-full">
            {INDUSTRY_DATA.map((industry, index) => (
              <IndustryCard
                key={industry.id}
                item={industry}
                index={index}
                total={INDUSTRY_DATA.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>

        <div className="h-[10vh]"></div>
=======
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
        <div className="w-[200px] h-1 bg-gradient-to-r from-[#3B82F6] to-[#234C90] mx-auto mb-[30px] rounded-[2px]"></div>

        <h2 className="text-5xl font-extrabold leading-[1.2] text-center max-w-[1000px] mx-auto mb-5 bg-gradient-to-r from-[#3A80F2] to-[#234C90] bg-clip-text text-transparent max-lg:text-[42px] max-md:text-4xl max-sm:text-3xl">
          Supporting businesses from a wide range of industries
        </h2>

        <p className="text-xl text-[#475569] text-center max-w-[900px] mx-auto mb-[60px] leading-[1.6] font-light max-lg:text-lg max-md:text-base max-sm:mb-10">
          We understand your unique billing and accounting needs, Vyapar India billing software 
          is specially designed for Indian SMBs.
        </p>

        <div className="flex gap-[60px] items-center justify-between max-lg:flex-col max-lg:gap-[50px]">
          <div 
            className="flex-1 relative py-[30px] max-w-[550px] max-lg:max-w-full max-lg:w-full"
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

          <div 
            className="flex-1 h-[550px] rounded-[45px] overflow-hidden relative transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.15)] max-w-[650px] max-lg:max-w-full max-lg:w-full max-md:h-[450px] max-sm:h-[400px]"
            style={{ backgroundImage: getRightPanelImage(), backgroundSize: 'cover', backgroundPosition: 'center' }}
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
>>>>>>> 9bfd81b (my second git push)
      </div>
    </section>
  );
};

<<<<<<< HEAD
const IndustryCard = ({ item, index, total, progress }) => {
  // Adjusted scroll space - each card gets less space for faster transitions
  const cardScrollSpace = 0.12; // Reduced from 0.15
  const start = index * cardScrollSpace;
  const end = (index + 1) * cardScrollSpace;
  
  // Cards start appearing earlier and transition faster
  const appearStart = start;
  const appearEnd = start + 0.06; // Faster appearance (was 0.12)
  
  // Cards start disappearing earlier
  const disappearStart = end - 0.04; // Earlier disappearance (was end - 0.03)
  const disappearEnd = end + 0.02; // Faster disappearance (was end + 0.07)

  const isLast = index === total - 1;

  // Animation Transforms - smoother curves
  const yIn = useTransform(
    progress, 
    [appearStart, appearEnd], 
    index === 0 ? [0, 0] : [150, 0] // Reduced from 200 for smoother entry
  );
  
  const scaleIn = useTransform(
    progress, 
    [appearStart, appearEnd], 
    index === 0 ? [1, 1] : [0.7, 1] // Less dramatic scale (was 0.6)
  );
  
  const opacityIn = useTransform(
    progress, 
    [appearStart, appearEnd], 
    index === 0 ? [1, 1] : [0, 1]
  );
  
  const yOut = useTransform(
    progress, 
    [disappearStart, disappearEnd], 
    [0, -80] // Less dramatic exit (was -100)
  );
  
  const opacityOut = useTransform(
    progress, 
    [disappearStart, disappearEnd], 
    [1, 0]
  );

  // For non-last cards
  if (!isLast) {
    const currentY = progress.get() > disappearStart ? yOut : yIn;
    const currentOpacity = progress.get() > disappearStart ? opacityOut : opacityIn;

    return (
      <motion.div
        style={{
          y: currentY,
          scale: scaleIn,
          opacity: currentOpacity,
          zIndex: index + 10,
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease-out' // Smooth transition
        }}
      >
        <CardContent item={item} />
      </motion.div>
    );
  }

  // For last card - smoother exit
  const lastCardStart = index * cardScrollSpace;
  const lastCardAppearEnd = lastCardStart + 0.06;
  const lastCardHoldEnd = 0.88; // Hold until 88% (was 0.95)
  const lastCardExitEnd = 0.96; // Exit faster (was 1.0)

  const yLast = useTransform(progress, [lastCardStart, lastCardAppearEnd], [150, 0]);
  const scaleLast = useTransform(progress, [lastCardStart, lastCardAppearEnd], [0.7, 1]);
  const opacityLast = useTransform(progress, [lastCardStart, lastCardAppearEnd], [0, 1]);
  
  const holdY = useTransform(progress, [lastCardAppearEnd, lastCardHoldEnd], [0, 0]);
  const holdOpacity = useTransform(progress, [lastCardAppearEnd, lastCardHoldEnd], [1, 1]);
  
  const exitOpacity = useTransform(progress, [lastCardHoldEnd, lastCardExitEnd], [1, 0]);

  const currentY = progress.get() < lastCardAppearEnd ? yLast : holdY;
  const currentOpacity = progress.get() < lastCardAppearEnd ? opacityLast : 
                         progress.get() < lastCardHoldEnd ? holdOpacity : exitOpacity;

  return (
    <motion.div
      style={{
        y: currentY,
        scale: scaleLast,
        opacity: currentOpacity,
        zIndex: index + 10,
        position: 'absolute',
        inset: 0,
        margin: 'auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease-out'
      }}
    >
      <CardContent item={item} />
    </motion.div>
  );
};

const CardContent = ({ item }) => (
  <div 
    className="w-full max-w-6xl bg-white flex flex-col md:flex-row mx-auto overflow-hidden rounded-[40px]" 
    style={{ height: 'min(600px, 75vh)' }}
  >
    <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center order-2 md:order-1 bg-white">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl">{item.icon}</span>
        <span
          className="px-5 py-2 rounded-full text-xs font-[900] uppercase tracking-[0.2em]"
          style={{ backgroundColor: item.lightColor, color: item.color }}
        >
          {item.tag}
        </span>
      </div>
      
      <h3 className="text-4xl lg:text-[64px] font-[900] text-[#0f172a] mb-8 leading-[1] tracking-[-0.04em]">
        {item.title}
      </h3>
      
      <p className="text-lg lg:text-xl text-slate-500 mb-10 leading-relaxed max-w-[90%]">
        {item.description}
      </p>
      
      <Link href={item.buttonLink}>
        <button 
          className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-[900] transition-all hover:scale-105 active:scale-95 text-white w-fit text-xl"
          style={{ 
            backgroundColor: item.color,
            boxShadow: `0 20px 40px -10px ${item.color}66`
          }}
        >
          <span>{item.buttonText}</span>
          <span className="group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </Link>
    </div>

    {/* Image Side - With Faded White Border Effect */}
    <div className="h-64 md:h-full md:flex-[1.2] relative order-1 md:order-2 overflow-hidden bg-slate-50">
      
      {/* Main image with mask for fade effect on all edges */}
      <div 
        className="relative w-full h-full"
        style={{
          WebkitMaskImage: `
            linear-gradient(to bottom, transparent, black 10%, black 90%, transparent),
            linear-gradient(to right, transparent, black 10%, black 90%, transparent)
          `,
          maskImage: `
            linear-gradient(to bottom, transparent, black 10%, black 90%, transparent),
            linear-gradient(to right, transparent, black 10%, black 90%, transparent)
          `,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Soft white glow overlay for dreamy effect */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 100%)',
        }}
      />

      {/* Very subtle vignette for depth */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 50px rgba(255,255,255,0.3)',
          borderRadius: 'inherit'
        }}
      />
    </div>
  </div>
);

export default IndustrySection;
=======
export default Industries;
>>>>>>> 9bfd81b (my second git push)
