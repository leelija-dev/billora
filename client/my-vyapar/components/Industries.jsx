"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Link from "next/link";

const INDUSTRY_DATA = [
  {
    id: 1,
    tag: "Retail",
    title: "Retail Revolution",
    description: "Complete POS and inventory management for retail stores. Track sales, manage stock, and delight customers with faster billing.",
    buttonText: "Explore Retail",
    buttonLink: "/industries/retail",
    icon: "🏪",
    color: "#3b82f6",
    lightColor: "#eff6ff",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    tag: "Manufacturing",
    title: "Manufacturing Hub",
    description: "Smart manufacturing tools that optimize production lines, track raw materials, reduce waste, and improve efficiency by 40%.",
    buttonText: "Explore Manufacturing",
    buttonLink: "/industries/manufacturing",
    icon: "🏭",
    color: "#8b5cf6",
    lightColor: "#f5f3ff",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    tag: "Healthcare",
    title: "Healthcare Plus",
    description: "Secure billing and patient management solutions. HIPAA-compliant, easy-to-use, and reliable for clinics and hospitals.",
    buttonText: "Explore Healthcare",
    buttonLink: "/industries/healthcare",
    icon: "🏥",
    color: "#10b981",
    lightColor: "#f0fdf4",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    tag: "Education",
    title: "Education Suite",
    description: "Simplify fee collection, track student progress, manage academics, and communicate with parents effortlessly.",
    buttonText: "Explore Education",
    buttonLink: "/industries/education",
    icon: "📚",
    color: "#ef4444",
    lightColor: "#fef2f2",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    tag: "Real Estate",
    title: "Real Estate Pro",
    description: "Manage properties, track rentals, handle commissions, and grow your real estate business with smart tools.",
    buttonText: "Explore Real Estate",
    buttonLink: "/industries/real-estate",
    icon: "🏢",
    color: "#f59e0b",
    lightColor: "#fffbeb",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  },
];

const IndustrySection = () => {
  const containerRef = useRef(null);
  const [windowHeight, setWindowHeight] = useState(0);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 lg:px-10">
        
        {/* Title Section - Responsive text sizes */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 max-w-3xl px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4 tracking-tight">
            Supporting businesses from a wide range of industries
          </h2>
          <p className="text-sm sm:text-base text-slate-500">Scroll to explore our specialized solutions</p>
        </div>

        {/* Cards Container - Responsive heights */}
        <div className="relative w-full max-w-6xl h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
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

        {/* Progress Bar - Responsive positioning and sizing */}
        <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 flex items-center gap-2 sm:gap-3 md:gap-4">
          <span className="text-xs sm:text-sm font-bold text-slate-400">01</span>
          <div className="flex gap-1 sm:gap-2">
            {INDUSTRY_DATA.map((_, i) => (
              <ProgressBarItem key={i} index={i} progress={smoothProgress} total={INDUSTRY_DATA.length} />
            ))}
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">05</span>
        </div>
      </div>
    </section>
  );
};

const IndustryCard = ({ item, index, total, progress }) => {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  // Responsive Y position - smaller offset for mobile
  const y = useTransform(progress, [start - step, start, end], [300, 0, 0]);
  
  const scale = useTransform(progress, [start, end, end + step], [1, 1, 0.96]);
  const opacity = useTransform(progress, [start - step * 0.5, start, end, end + step], [0, 1, 1, 0.8]);

  return (
    <motion.div
      style={{ y, scale, opacity, zIndex: index + 10 }}
      className="absolute inset-0 w-full h-full"
    >
      <div 
        className="w-full h-full bg-white rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col md:flex-row overflow-hidden"
        style={{ borderColor: `${item.color}20` }}
      >
        {/* Content Side - Responsive padding */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center order-2 md:order-1">
          
          {/* Icon and Tag - Responsive sizing */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
            <span className="text-3xl sm:text-4xl md:text-5xl">{item.icon}</span>
            <span 
              className="px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: item.lightColor, color: item.color }}
            >
              {item.tag}
            </span>
          </div>

          {/* Title - Responsive text */}
          <h3 
            className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight"
            style={{ color: item.color }}
          >
            {item.title}
          </h3>

          {/* Description - Responsive text */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-5 sm:mb-6 md:mb-7 lg:mb-8 leading-relaxed max-w-md">
            {item.description}
          </p>

          {/* Button - Responsive sizing */}
          <Link href={item.buttonLink}>
            <button 
              className="group px-5 sm:px-6 md:px-7 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg sm:rounded-xl font-bold transition-all flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
              style={{ backgroundColor: item.color, color: 'white' }}
            >
              {item.buttonText}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>

        {/* Image Side - Hidden on mobile, visible on tablet and up */}
        <div className="hidden md:block flex-1 relative order-1 md:order-2">
          <img 
            src={item.image} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

const ProgressBarItem = ({ index, progress, total }) => {
  const step = 1 / total;
  const width = useTransform(progress, [index * step, (index + 1) * step], ["0%", "100%"]);
  const backgroundColor = useTransform(progress, [index * step, (index + 1) * step], ["#e2e8f0", "#3b82f6"]);
  
  return (
    <div className="w-6 sm:w-8 md:w-10 lg:w-12 h-1 sm:h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div style={{ width, backgroundColor }} className="h-full" />
    </div>
  );
};

export default IndustrySection;