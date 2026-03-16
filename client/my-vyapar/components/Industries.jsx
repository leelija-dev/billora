"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import Container from "../components/Container";

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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative h-[1100vh] bg-white mt-20 first:mt-0">
      {/* Added mt-20 to push down from previous section */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-start pt-24 sm:pt-28 md:pt-32 overflow-hidden">
        {/* Added pt-* for top padding and changed justify-center to justify-start */}
        
        {/* Header Section - Now with proper top spacing */}
        <Container>
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight break-words">
              Supporting businesses from a<br className="hidden sm:block" /> 
              wide range of industries
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-500">
              Scroll to explore our specialized solutions
            </p>
          </div>
        </Container>

        {/* Cards Container */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex-1 flex items-center">
          <div className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px]">
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

        {/* Progress Bar */}
        <div className="absolute bottom-8 sm:bottom-10 flex items-center gap-3 sm:gap-4">
          <span className="text-xs font-bold text-slate-400">01</span>
          <div className="flex gap-1.5 sm:gap-2">
            {INDUSTRY_DATA.map((_, i) => (
              <ProgressBarItem key={i} index={i} progress={smoothProgress} total={INDUSTRY_DATA.length} />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400">05</span>
        </div>
      </div>
    </section>
  );
};

const IndustryCard = ({ item, index, total, progress }) => {
  const step = 1 / total;
  const start = index * step;
  const end = (index + 1) * step;

  const y = useTransform(progress, [start - step, start, end], [500, 0, 0]);
  const scale = useTransform(progress, [start, end, end + step], [1, 1, 0.95]);
  const opacity = useTransform(progress, [start - step * 0.5, start, end, end + step], [0, 1, 1, 0.7]);

  return (
    <motion.div
      style={{ y, scale, opacity, zIndex: index + 10 }}
      className="absolute inset-0 w-full h-full"
    >
      <div className="w-full h-full bg-white rounded-2xl sm:rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-xl">
        
        {/* Content Side */}
        <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center order-2 md:order-1">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="text-3xl sm:text-4xl md:text-5xl">{item.icon}</span>
            <span 
              className="px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: item.lightColor, color: item.color }}
            >
              {item.tag}
            </span>
          </div>
          
          <h3 
            className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 leading-tight break-words"
            style={{ color: item.color }}
          >
            {item.title}
          </h3>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed break-words max-w-xl">
            {item.description}
          </p>
          
          <Link href={item.buttonLink}>
            <button 
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all hover:opacity-90 text-white w-fit"
              style={{ backgroundColor: item.color }}
            >
              <span>{item.buttonText}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>

        {/* Image Side */}
        <div className="h-48 sm:h-56 md:h-auto md:flex-1 relative order-1 md:order-2">
          <img 
            src={item.image} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

const ProgressBarItem = ({ index, progress, total }) => {
  const step = 1 / total;
  const width = useTransform(progress, [index * step, (index + 1) * step], ["0%", "100%"]);
  
  return (
    <div className="w-6 sm:w-8 md:w-10 h-1 bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        style={{ width, backgroundColor: "#3b82f6" }} 
        className="h-full rounded-full"
      />
    </div>
  );
};

export default IndustrySection;