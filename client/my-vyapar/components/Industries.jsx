"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import Container from "../components/Container"; // Add this import

const INDUSTRY_DATA = [
  { id: 1, tag: "Innovation", title: "Drive Innovation", description: "Transform your business with cutting-edge billing solutions designed for the modern era of digital commerce.", buttonText: "Learn More", buttonLink: "/solutions/innovation", icon: "🚀", color: "#7fa1d0", lightColor: "#f0f4f9", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, tag: "Growth", title: "Empower Growth", description: "Scale your business with powerful accounting tools that provide deep insights into your financial health.", buttonText: "Scale Now", buttonLink: "/solutions/growth", icon: "📈", color: "#6366f1", lightColor: "#eef2ff", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" },
  { id: 3, tag: "Compliance", title: "GSTR Filing", description: "Simplify GST returns with automated filing systems that ensure accuracy and save hours of manual work.", buttonText: "Start Filing", buttonLink: "/solutions/gstr", icon: "📑", color: "#7bb2cc", lightColor: "#f1f7f9", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80" },
  { id: 4, tag: "Operations", title: "Unite Industries", description: "Connect all your business operations seamlessly in one unified platform, from inventory to final sale.", buttonText: "Connect All", buttonLink: "/solutions/unite", icon: "🔗", color: "#4b5563", lightColor: "#f3f4f6", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" },
  { id: 5, tag: "Reach", title: "Expand Reach", description: "Grow your customer base with professional digital invoices and integrated payment gateways.", buttonText: "Grow Reach", buttonLink: "/solutions/expand", icon: "🌍", color: "#4b22c5", lightColor: "#eeebf9", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80" },
  
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
    <section ref={containerRef} className="relative h-[1100vh] bg-white mb-5">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Content wrapped in Container */}
        <Container>
          <div className="text-center mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-3 md:mb-4 tracking-tight">
              Supporting businesses from a wide range of industries
            </h2>
            <p className="text-sm sm:text-base text-slate-500">Scroll to explore our specialized solutions</p>
          </div>

          <div className="relative w-full max-w-6xl h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] mx-auto">
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
        </Container>

        <div className="absolute bottom-10 flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">01</span>
          <div className="flex gap-1 sm:gap-1.5">
            {INDUSTRY_DATA.map((_, i) => (
              <ProgressBarItem key={i} index={i} progress={smoothProgress} total={INDUSTRY_DATA.length} />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-400">11</span>
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
      {/* Removed shadow-*, border, and borderTop */}
      <div className="w-full h-full bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center order-2 md:order-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl md:text-5xl">{item.icon}</span>
            <span 
              className="px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: item.lightColor, color: item.color }}
            >
              {item.tag}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ color: item.color }}>
            {item.title}
          </h3>
          <p className="text-sm md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed max-w-md">
            {item.description}
          </p>
          <Link href={item.buttonLink}>
            <button 
              className="group px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all flex items-center gap-2 hover:opacity-90 text-white"
              style={{ backgroundColor: item.color }}
            >
              {item.buttonText}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </div>
        <div className="h-48 md:h-auto md:flex-1 relative order-1 md:order-2">
          <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
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
    <div className="w-4 sm:w-6 md:w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
      <motion.div style={{ width, backgroundColor: "#3b82f6" }} className="h-full" />
    </div>
  );
};

export default IndustrySection;