"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Container from "../components/Container";
import SectionTitle from "./SectionTitle";
import { FaChartLine, FaFileInvoice, FaLink, FaRocket } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

const INDUSTRY_DATA = [
  {
    id: 1,
    tag: "Innovation",
    title: "Seamless ITC Claims",
    description: "Fast Bill store management software maximizes Input Tax Credit by automatically reconciling purchase invoices with GSTR-2B & identifying missing or unmatched records.",
    fullDescription: "Fast Bill store management software maximizes Input Tax Credit by automatically reconciling purchase invoices with GSTR-2B & identifying missing or unmatched records. This not only ensures precise, error-free claiming and prevents missed credits but also improves cash flow that efficiently frees up your capital for business growth.",
    buttonLink: "/solutions/innovation",

    color: "#7fa1d0",
    lightColor: "#f0f4f9",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    tag: "Growth",
    title: "Operational Expansion",
    description: "Manual billing is error-prone and labor-intensive. Fast Bill’s top inventory management software automates compliance, tax calculations, & e-way bill generation.",
    fullDescription: "Manual billing is error-prone and labor-intensive. Fast Bill’s top inventory management software automates compliance, tax calculations, & e-way bill generation. Advanced features like barcode scanning & customer autofill further accelerate the invoicing process, resulting in reduced workload, sales growth, and improved customer satisfaction.",

    color: "#6366f1",
    lightColor: "#eef2ff",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    tag: "Compliance",
    title: "Zero Penalties",
    description: "Constantly changing the GST regulations poses greater penalty risks.",
    fullDescription: "Constantly changing the GST regulations poses greater penalty risks. Fast Bill billing inventory management software ensures zero penalties by automating compliance, eliminating human error in calculations, & ensuring real-time data accuracy with Government regulations.",
    buttonLink: "/solutions/gstr",

    color: "#7bb2cc",
    lightColor: "#f1f7f9",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    tag: "Operations",
    title: "Actionable Data",
    description: "Fast Bill is the best billing and inventory management software for retail shops in India because it acts as a mini-ERP that provides you with comprehensive reports on sales,",
    fullDescription: "Fast Bill is the best billing software for retail shops in India because it acts as a mini-ERP that provides you with comprehensive reports on sales, inventory, & tax. By monitoring stock & customer payments via detailed dashboards, you can now make data-driven decisions on pricing & procurements for optimized profits and accelerated business growth. ",
    buttonLink: "/solutions/unite",

    color: "#4b5563",
    lightColor: "#f3f4f6",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    tag: "Reach",
    title: "Increased Reputation",
    description: "TThis billing and stock management software eliminates complex, pre-GST interstate trade barriers by automating IGST calculators, generating instant E-way bills, & producing compliant financial reports.",
    fullDescription: "This billing and stock management software eliminates complex, pre-GST interstate trade barriers by automating IGST calculators, generating instant E-way bills, & producing compliant financial reports. By facilitating seamless logistics and boosting brand credibility, Fast Bill helps Indian business owners expand their brands nationwide and secure unstoppable growth funding.",
    buttonLink: "/solutions/expand",

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
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-white">
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
      className="w-full max-w-[1440px] bg-white flex flex-col md:flex-row mx-auto overflow-hidden rounded-[40px]"
      style={{ height: 'min(650px, 75vh)' }}
    >
      {/* TEXT AREA */}
      <div className="flex-1 px-8 lg:px-16 py-12 flex flex-col justify-center order-2 md:order-1 bg-white overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-4 mb-6">

          <span className="px-5 py-2 rounded-full text-xs font-[900] uppercase tracking-[0.2em]"
            style={{ backgroundColor: item.lightColor, color: item.color }}>
            {item.tag}
          </span>
        </div>

        <h3 className="text-2xl lg:text-[30px] font-[900] text-[#0f172a] mb-6 leading-[1.1] tracking-[-0.04em]">
          {item.title}
        </h3>

        <div className="mb-8">
          <p className="text-lg lg:text-xl text-slate-500 leading-relaxed max-w-[500px]">
            {isExpanded ? item.fullDescription : item.description}
          </p>

          {/* Show button if fullDescription exists AND it's longer than description */}
          {item.fullDescription && item.fullDescription.length > item.description.length && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-lg font-semibold mt-3 px-2 py-1 cursor-pointer relative z-10 hover:opacity-70 transition-opacity"
              style={{ color: item.color }}
              type="button"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      <div className="h-72 md:h-full md:flex-[1.4] relative order-1 md:order-2 overflow-hidden bg-slate-50">
        <div
          className="relative w-full h-full"
          style={{
            WebkitMaskImage: `
              linear-gradient(to bottom, transparent, black 8%, black 92%, transparent),
              linear-gradient(to right, transparent, black 8%, black 92%, transparent)
            `,
            maskImage: `
              linear-gradient(to bottom, transparent, black 8%, black 92%, transparent),
              linear-gradient(to right, transparent, black 8%, black 92%, transparent)
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

        <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0.2)_100%)]" />
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(255,255,255,0.2)', borderRadius: 'inherit' }} />
      </div>
    </div>
  );
};

export default IndustrySection;