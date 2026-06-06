"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Container from "../components/Container";
import SectionTitle from "./SectionTitle";
import { FaChartLine, FaFileInvoice, FaLink, FaRocket, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

const INDUSTRY_DATA = [
  {
    id: 1,
    tag: "Innovation",
    title: "Seamless ITC Claims",
    description: "Fast Bill store management software maximizes Input Tax Credit by automatically reconciling purchase invoices with GSTR-2B & identifying missing or unmatched records.",
    fullDescription: "Fast Bill store management software maximizes Input Tax Credit by automatically reconciling purchase invoices with GSTR-2B & identifying missing or unmatched records. This not only ensures precise, error-free claiming and prevents missed credits but also improves cash flow that efficiently frees up your capital for business growth.",
    buttonLink: "/solutions/innovation",
    icon: <FaFileInvoice className="text-2xl" />,
    color: "#7fa1d0",
    lightColor: "#f0f4f9",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    tag: "Growth",
    title: "Operational Expansion",
    description: "Manual billing is error-prone and labor-intensive. Fast Bill's top inventory management software automates compliance, tax calculations, & e-way bill generation.",
    fullDescription: "Manual billing is error-prone and labor-intensive. Fast Bill's top inventory management software automates compliance, tax calculations, & e-way bill generation. Advanced features like barcode scanning & customer autofill further accelerate the invoicing process, resulting in reduced workload, sales growth, and improved customer satisfaction.",
    buttonLink: "/solutions/growth",
    icon: <FaRocket className="text-2xl" />,
    color: "#6366f1",
    lightColor: "#eef2ff",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    tag: "Compliance",
    title: "Zero Penalties",
    description: "Constantly changing the GST regulations poses greater penalty risks. Fast Bill billing inventory management software ensures zero penalties.",
    fullDescription: "Constantly changing the GST regulations poses greater penalty risks. Fast Bill billing inventory management software ensures zero penalties by automating compliance, eliminating human error in calculations, & ensuring real-time data accuracy with Government regulations.",
    buttonLink: "/solutions/compliance",
    icon: <FaChartLine className="text-2xl" />,
    color: "#7bb2cc",
    lightColor: "#f1f7f9",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    tag: "Operations",
    title: "Actionable Data",
    description: "Fast Bill is the best billing and inventory management software for retail shops in India because it acts as a mini-ERP that provides you with comprehensive reports.",
    fullDescription: "Fast Bill is the best billing software for retail shops in India because it acts as a mini-ERP that provides you with comprehensive reports on sales, inventory, & tax. By monitoring stock & customer payments via detailed dashboards, you can now make data-driven decisions on pricing & procurements for optimized profits and accelerated business growth.",
    buttonLink: "/solutions/operations",
    icon: <FaLink className="text-2xl" />,
    color: "#4b5563",
    lightColor: "#f3f4f6",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    tag: "Reach",
    title: "Increased Reputation",
    description: "This billing and stock management software eliminates complex, pre-GST interstate trade barriers by automating IGST calculators, generating instant E-way bills.",
    fullDescription: "This billing and stock management software eliminates complex, pre-GST interstate trade barriers by automating IGST calculators, generating instant E-way bills, & producing compliant financial reports. By facilitating seamless logistics and boosting brand credibility, Fast Bill helps Indian business owners expand their brands nationwide and secure unstoppable growth funding.",
    buttonLink: "/solutions/reach",
    icon: <FiLink className="text-2xl" />,
    color: "#4b22c5",
    lightColor: "#eeebf9",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80"
  },
];

const IndustrySection = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  // For mobile/tablet, show static cards without sliding
  if (isMobile) {
    return (
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <Container>
          <div className="text-center max-w-4xl mx-auto px-4 mb-12 sm:mb-16">
            <SectionTitle title="Driving Success for Businesses from Every Sector" />
          </div>
          <div className="space-y-8 sm:space-y-10">
            {INDUSTRY_DATA.map((item) => (
              <StaticCard key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // Desktop version with sliding effect
  return (
    <section ref={containerRef} className=" h-[500vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden container mx-auto">
        <div className="h-[25vh] flex items-center justify-center pb-4 z-20">
          <Container size="full">
            <div className="text-center max-w-4xl mx-auto px-4">
              <SectionTitle title="Driving Success for Businesses from Every Sector" />
            </div>
          </Container>
        </div>

        <div className="h-[65vh] flex items-center justify-center z-10">
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 relative h-full">
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
      </div>
    </section>
  );
};

const IndustryCard = ({ item, index, total, progress }) => {
  const scrollRangePerCard = 1 / total;
  const start = index * scrollRangePerCard;
  const end = (index + 1) * scrollRangePerCard;

  const enterStart = start;
  const enterEnd = start + 0.12;
  const exitStart = end - 0.12;
  const exitEnd = end;

  const isLast = index === total - 1;

  const yIn = useTransform(progress, [enterStart, enterEnd], index === 0 ? [0, 0] : [200, 0]);
  const scaleIn = useTransform(progress, [enterStart, enterEnd], index === 0 ? [1, 1] : [0.8, 1]);
  const opacityIn = useTransform(progress, [enterStart, enterEnd], index === 0 ? [1, 1] : [0, 1]);
  const yOut = useTransform(progress, [exitStart, exitEnd], [0, -150]);
  const scaleOut = useTransform(progress, [exitStart, exitEnd], [1, 0.8]);
  const opacityOut = useTransform(progress, [exitStart, exitEnd], [1, 0]);

  const isExiting = progress.get() > exitStart && !isLast;
  const currentY = isExiting ? yOut : yIn;
  const currentScale = isExiting ? scaleOut : scaleIn;
  const currentOpacity = isExiting ? opacityOut : opacityIn;

  return (
    <motion.div style={{
      y: currentY, scale: currentScale, opacity: currentOpacity,
      zIndex: 10 + index, position: 'absolute', inset: 0,
      margin: 'auto', width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <CardContent item={item} />
    </motion.div>
  );
};

const CardContent = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="w-full max-w-[1440px] bg-white flex flex-col md:flex-row mx-auto overflow-hidden   hover:shadow-3xl transition-shadow duration-500 rounded-[32px] border border-gray-200"
      style={{ height: 'min(650px, 75vh)' }}
    >
      {/* TEXT AREA */}
      <div className="flex-1 px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-12 flex flex-col justify-center order-2 md:order-1 bg-white overflow-y-auto custom-scrollbar">
        {/* Tag Badge */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: item.lightColor, color: item.color }}
          >
            {item.icon}
          </div>
          <span 
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: item.lightColor, color: item.color }}
          >
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl lg:text-[28px] xl:text-[32px] font-extrabold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">
          {item.title}
        </h3>

        {/* Description */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
            {isExpanded ? item.fullDescription : item.description}
          </p>

          {/* Read More Button */}
          {item.fullDescription && item.fullDescription.length > item.description.length && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-base font-semibold mt-3 inline-flex items-center gap-1 transition-all duration-300 hover:gap-2"
              style={{ color: item.color }}
              type="button"
            >
              {isExpanded ? "Show less" : "Read more"}
              <FaArrowRight className={`text-sm transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

       
      </div>

      {/* IMAGE AREA */}
      <div className="h-64 sm:h-72 md:h-full md:flex-[1.3] relative order-1 md:order-2 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div
          className="relative w-full h-full"
         
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Overlay Effects */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.1)', borderRadius: 'inherit' }} />
      </div>
    </div>
  );
};

// Static Card Component for Mobile/Tablet (no sliding animations)
const StaticCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg  transition-all duration-300 border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${item.color}20`, color: item.color,  }}
          >
            {item.tag}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: item.lightColor, color: item.color }}
          >
            {item.icon}
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight">
            {item.title}
          </h3>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
          {isExpanded ? item.fullDescription : item.description}
        </p>

        {item.fullDescription && item.fullDescription.length > item.description.length && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold inline-flex items-center gap-1 transition-all duration-300 hover:gap-2 mb-4"
            style={{ color: item.color }}
          >
            {isExpanded ? "Show less" : "Read more"}
            <FaArrowRight className={`text-xs transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}

     
      </div>
    </div>
  );
};

export default IndustrySection;