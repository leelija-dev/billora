"use client";

import React, { useRef, useState } from "react";
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
    fullDescription: "Transform your business with cutting-edge billing solutions designed for the modern era of digital commerce. Our innovative platform leverages AI and machine learning to automate complex billing processes, reduce errors, and provide real-time insights. Experience seamless integration with your existing systems and unlock new levels of efficiency that drive business growth and customer satisfaction.",
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
    fullDescription: "Scale your business with powerful accounting tools that provide deep insights into your financial health. Our comprehensive suite includes advanced analytics, forecasting capabilities, and customizable dashboards that help you make data-driven decisions. Track key metrics, identify trends, and optimize your financial strategy to accelerate growth and maximize profitability.",
    buttonText: "Learn More",
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
    fullDescription: "Simplify GST returns with automated filing systems that ensure accuracy and save hours of manual work. Our intelligent platform automatically extracts data from invoices, validates entries, and generates error-free returns. Stay compliant with the latest tax regulations, reduce audit risks, and focus on your core business while we handle the complexities of GST filing.",
    buttonText: "Learn More",
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
    fullDescription: "Connect all your business operations seamlessly in one unified platform, from inventory to final sale. Break down silos between departments with integrated workflows, real-time synchronization, and automated processes. Manage inventory, track orders, handle customer relationships, and process payments all from a single, intuitive dashboard that provides complete visibility across your organization.",
    buttonText: "Learn More",
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
    fullDescription: "Grow your customer base with professional digital invoices and integrated payment gateways. Our platform enables you to send branded, professional invoices that enhance your company's image. Offer multiple payment options, automate payment reminders, and provide a seamless checkout experience that reduces friction and improves cash flow. Expand globally with multi-currency support and localized payment methods.",
    buttonText: "Learn More",
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
    stiffness: 150,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">

        {/* Header Area - INCREASED HEIGHT for text to fit properly */}
        <div className="h-[25vh] flex items-center justify-center pb-4 z-20">
          <Container size="full">
            <div className="text-center max-w-7xl mx-auto px-4">
              <SectionTitle title="Supporting Businesses from a wide range of industries" />
            </div>
          </Container>
        </div>

        {/* Cards Display Area - Adjusted height */}
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

        {/* Bottom Spacer */}
        <div className="h-[10vh]"></div>
      </div>
    </section>
  );
};

const IndustryCard = ({ item, index, total, progress }) => {
  const totalCards = total;
  const scrollRangePerCard = 1 / totalCards;
  
  const start = index * scrollRangePerCard;
  const end = (index + 1) * scrollRangePerCard;
  
  const enterStart = start;
  const enterEnd = start + 0.12;
  
  const exitStart = end - 0.12;
  const exitEnd = end;

  const isLast = index === total - 1;

  const yIn = useTransform(
    progress,
    [enterStart, enterEnd],
    index === 0 ? [0, 0] : [200, 0]
  );

  const scaleIn = useTransform(
    progress,
    [enterStart, enterEnd],
    index === 0 ? [1, 1] : [0.8, 1]
  );

  const opacityIn = useTransform(
    progress,
    [enterStart, enterEnd],
    index === 0 ? [1, 1] : [0, 1]
  );

  const yOut = useTransform(
    progress,
    [exitStart, exitEnd],
    [0, -150]
  );

  const scaleOut = useTransform(
    progress,
    [exitStart, exitEnd],
    [1, 0.8]
  );

  const opacityOut = useTransform(
    progress,
    [exitStart, exitEnd],
    [1, 0]
  );

  if (!isLast) {
    const isExiting = progress.get() > exitStart;
    
    const currentY = isExiting ? yOut : yIn;
    const currentScale = isExiting ? scaleOut : scaleIn;
    const currentOpacity = isExiting ? opacityOut : opacityIn;

    return (
      <motion.div
        style={{
          y: currentY,
          scale: currentScale,
          opacity: currentOpacity,
          zIndex: isExiting ? 1 : 10 + index,
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CardContent item={item} />
      </motion.div>
    );
  }

  const lastCardEnterEnd = start + 0.12;
  const lastCardHoldStart = lastCardEnterEnd;
  const lastCardHoldEnd = 0.85;
  const lastCardExitEnd = 0.98;

  const yLastEnter = useTransform(progress, [start, lastCardEnterEnd], [200, 0]);
  const scaleLastEnter = useTransform(progress, [start, lastCardEnterEnd], [0.8, 1]);
  const opacityLastEnter = useTransform(progress, [start, lastCardEnterEnd], [0, 1]);

  const yHold = useTransform(progress, [lastCardHoldStart, lastCardHoldEnd], [0, 0]);
  const scaleHold = useTransform(progress, [lastCardHoldStart, lastCardHoldEnd], [1, 1]);
  const opacityHold = useTransform(progress, [lastCardHoldStart, lastCardHoldEnd], [1, 1]);

  const yLastExit = useTransform(progress, [lastCardHoldEnd, lastCardExitEnd], [0, -150]);
  const scaleLastExit = useTransform(progress, [lastCardHoldEnd, lastCardExitEnd], [1, 0.8]);
  const opacityLastExit = useTransform(progress, [lastCardHoldEnd, lastCardExitEnd], [1, 0]);

  const currentY = progress.get() < lastCardEnterEnd ? yLastEnter : 
                   progress.get() < lastCardHoldEnd ? yHold : yLastExit;
  
  const currentScale = progress.get() < lastCardEnterEnd ? scaleLastEnter :
                       progress.get() < lastCardHoldEnd ? scaleHold : scaleLastExit;
  
  const currentOpacity = progress.get() < lastCardEnterEnd ? opacityLastEnter :
                         progress.get() < lastCardHoldEnd ? opacityHold : opacityLastExit;

  return (
    <motion.div
      style={{
        y: currentY,
        scale: currentScale,
        opacity: currentOpacity,
        zIndex: 10 + index,
        position: 'absolute',
        inset: 0,
        margin: 'auto',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CardContent item={item} />
    </motion.div>
  );
};

const CardContent = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="w-full max-w-[1440px] bg-white flex flex-col md:flex-row mx-auto overflow-hidden rounded-[40px]"
      style={{ height: 'min(650px, 75vh)' }}
    >
      <div className="flex-1 px-8 lg:px-16 py-12 flex flex-col justify-center order-2 md:order-1 bg-white overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-5xl">{item.icon}</span>
          <span
            className="px-5 py-2 rounded-full text-xs font-[900] uppercase tracking-[0.2em]"
            style={{ backgroundColor: item.lightColor, color: item.color }}
          >
            {item.tag}
          </span>
        </div>

        <h3 className="text-2xl sm:text-2xl md:text-xl lg:text-[30px] font-[900] text-[#0f172a] mb-6 leading-[1.1] tracking-[-0.04em]">
          {item.title}
        </h3>

        <div className="mb-8">
          <p className="text-lg lg:text-xl text-slate-500 leading-relaxed max-w-[500px]">
            {isExpanded ? item.fullDescription : item.description}
          </p>
          
          {/* Read More/Less Link */}
          {item.fullDescription && item.fullDescription !== item.description && (
            <button
              onClick={toggleReadMore}
              className="text-lg font-semibold mt-3 transition-colors hover:opacity-80"
              style={{ color: item.color }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* <Link href={item.buttonLink}>
          <button
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-[900] transition-all hover:scale-105 active:scale-95 text-white w-fit text-lg"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 20px 40px -10px ${item.color}66`
            }}
          >
            <span>{item.buttonText}</span>
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </button>
        </Link> */}
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