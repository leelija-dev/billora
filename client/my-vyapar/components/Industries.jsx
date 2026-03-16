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
    <section ref={containerRef} className="relative h-[800vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">

        <div className="h-[30vh] flex items-end justify-center pb-16 z-20">
          <Container>
            <div className="text-center px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-[#1a237e] mb-4 relative inline-block animate-[fadeInDown_0.8s_ease-out] after:content-[''] after:absolute after:bottom-[-8px] sm:after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2 after:w-16 sm:after:w-[80px] md:after:w-[100px] after:h-0.5 sm:after:h-1 after:bg-gradient-to-r after:from-[#3b82f6] after:via-[#8b5cf6] after:to-[#10b981] after:rounded-[2px]">
                Supporting businesses from a wide range of industries
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-500 mt-6">
                Scroll to explore our specialized solutions
              </p>
            </div>
          </Container>
        </div>

        <div className="h-[55vh] flex items-center justify-center z-10">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative h-full">
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

        <div className="h-[15vh]"></div>

        <style>{`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </section>
  );
};

const IndustryCard = ({ item, index, total, progress }) => {
  const cardScrollSpace = 0.15;
  const start = index * cardScrollSpace;
  const end = (index + 1) * cardScrollSpace;

  if (index < total - 1) {
    const yIn = useTransform(progress, [start, end - 0.03], index === 0 ? [0, 0] : [200, 0]);
    const scaleIn = useTransform(progress, [start, end - 0.03], index === 0 ? [1, 1] : [0.6, 1]);
    const opacityIn = useTransform(progress, [start, end - 0.03], index === 0 ? [1, 1] : [0, 1]);

    const yHold = useTransform(progress, [end - 0.03, end + 0.02], [0, 0]);
    const opacityHold = useTransform(progress, [end - 0.03, end + 0.02], [1, 1]);

    const yOut = useTransform(progress, [end + 0.02, end + 0.07], [0, -100]);
    const opacityOut = useTransform(progress, [end + 0.02, end + 0.07], [1, 0]);

    return (
      <motion.div
        style={{
          y: progress.get() < end - 0.03 ? yIn : (progress.get() < end + 0.02 ? yHold : yOut),
          scale: scaleIn,
          opacity: progress.get() < end - 0.03 ? opacityIn : (progress.get() < end + 0.02 ? opacityHold : opacityOut),
          zIndex: index + 10,
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CardContent item={item} />
      </motion.div>
    );
  }

  const lastCardStart = index * cardScrollSpace;
  const lastCardFullyVisible = 0.75;
  const y = useTransform(progress, [lastCardStart, lastCardFullyVisible], [200, 0]);
  const scale = useTransform(progress, [lastCardStart, lastCardFullyVisible], [0.6, 1]);
  const opacity = useTransform(progress, [lastCardStart, lastCardFullyVisible], [0, 1]);
  const holdY = useTransform(progress, [0.75, 0.95], [0, 0]);
  const holdOpacity = useTransform(progress, [0.75, 0.95], [1, 1]);
  const exitOpacity = useTransform(progress, [0.95, 1], [1, 0]);

  return (
    <motion.div
      style={{
        y: progress.get() < 0.75 ? y : holdY,
        scale,
        opacity: progress.get() < 0.75 ? opacity : (progress.get() < 0.95 ? holdOpacity : exitOpacity),
        zIndex: index + 10,
        position: 'absolute',
        inset: 0,
        margin: 'auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CardContent item={item} />
    </motion.div>
  );
};

const CardContent = ({ item }) => (
  <div className="w-full max-w-5xl bg-white flex flex-col md:flex-row mx-auto overflow-hidden" style={{ height: 'min(500px, 70vh)' }}>

    <div className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center order-2 md:order-1 overflow-y-auto">
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <span className="text-3xl sm:text-4xl">{item.icon}</span>
        <span
          className="px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: item.lightColor, color: item.color }}
        >
          {item.tag}
        </span>
      </div>
      <h3 className="text-2xl sm:text-3xl font-black mb-3 leading-tight break-words" style={{ color: item.color }}>
        {item.title}
      </h3>
      <p className="text-sm sm:text-base text-slate-600 mb-4 leading-relaxed break-words">
        {item.description}
      </p>
      <Link href={item.buttonLink}>
        <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:opacity-90 text-white w-fit" style={{ backgroundColor: item.color }}>
          <span>{item.buttonText}</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </Link>
    </div>

    {/* Image Side - FOGGY BORDER ON ALL 4 SIDES */}
    <div className="h-48 sm:h-56 md:h-auto md:flex-[1.2] relative order-1 md:order-2 flex items-center justify-center overflow-hidden">
      <div 
        className="relative w-full h-full"
        style={{
          // Masking creates a soft "frame" by fading top, bottom, left, and right
          WebkitMaskImage: `
            linear-gradient(to bottom, transparent, black 15%, black 85%, transparent),
            linear-gradient(to right, transparent, black 15%, black 85%, transparent)
          `,
          maskImage: `
            linear-gradient(to bottom, transparent, black 15%, black 85%, transparent),
            linear-gradient(to right, transparent, black 15%, black 85%, transparent)
          `,
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          style={{ border: 'none', display: 'block' }}
        />
      </div>

      {/* Center "Cloud" layer for depth */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0) 20%, rgba(255,255,255,0.4) 100%)',
        }}
      />
    </div>
  </div>
);

export default IndustrySection;