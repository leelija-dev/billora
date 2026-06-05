"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";

const Features = () => {
  const features = [
    {
      title: "Accelerate Billing Seamlessly",
      description: "With Fast Bill, you can automate invoice generation with pre-filled GST rates and serve your customers faster. By integrating these digital payment gateways, you can now seamlessly speed up your payments.",
      extraDescription: "The Fast Bill GST billing & stock management software comes with automated reminder features and reduces your manual workload significantly. With reduced paper usage, you can now save money for other administrative resources.",
      image: "/image/gst1.png",
      reverse: false,
    },
    {
      title: "100% Tax Compliance & Inventory Management",
      description: "Ensure 100% tax compliance with reduced penalties with automated, faster, & accurate GST filing and instant regulatory updates. Fast Bill maintains audit-ready, tamper-proof records for easy and compliant inspections.",
      extraDescription: "Also, get real-time insights into product turnover, eliminate stockouts with low-stock alerts, and manage supplier information & purchase bills in one place. Now optimize your stock levels and streamline your operational workflows with Fast Bill.",
      image: "/image/invoice.png",
      reverse: true,
    },
    {
      title: "Data-Driven Business Insights",
      description: "This invoice and inventory management software comes with real-time analytics and comprehensive reporting specifications that feature live dashboards and let you make rapid yet data-driven decisions on sales & profitability.",
      extraDescription: "Our online billing software provides in-depth performance analysis, enables your business to scale efficiently, and manages growth without any significant increase in your overall cost.",
      image: "/image/payments.png",
      reverse: false,
    },
    {
      title: "Personalized Brand-Specific Invoices",
      description: "this inventory management and billing software, you can transform the boring professional invoices into customized ones by creating personalized logos, colors, and layouts that reflect your unique brand voice.",
      extraDescription: "You can also create custom messages and branded designs for a consistent brand identity, efficient communication, and tailor them anytime according to the industry needs for added credibility and customer loyalty.",
      image: "/image/trace.png",
      reverse: true,
    },
  ];

  const [expandedItems, setExpandedItems] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = entry.target.dataset.index;
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleReadMore = (index) => {
    setExpandedItems(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="py-4 sm:py-12 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-white font-sans overflow-hidden relative">
      
      {/* Floating Blob Bubbles - Animated Background (disabled on mobile/tablet) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 - Top Left - Purple/Blue */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-purple-200/50 to-blue-200/50 rounded-full mix-blend-multiply blur-3xl lg:animate-blob"></div>
        
        {/* Blob 2 - Top Right - Yellow/Pink */}
        <div className="absolute top-0 -right-20 w-96 h-96 bg-gradient-to-br from-yellow-200/40 to-pink-200/40 rounded-full mix-blend-multiply blur-3xl lg:animate-blob lg:animation-delay-2000"></div>
        
        {/* Blob 3 - Center - Blue/Indigo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full mix-blend-multiply blur-3xl lg:animate-blob lg:animation-delay-4000"></div>
        
        {/* Blob 4 - Bottom Left - Green/Teal */}
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-gradient-to-br from-green-200/40 to-teal-200/40 rounded-full mix-blend-multiply blur-3xl lg:animate-blob lg:animation-delay-3000"></div>
        
        {/* Blob 5 - Bottom Right - Orange/Red */}
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full mix-blend-multiply blur-3xl lg:animate-blob lg:animation-delay-5000"></div>
        
        {/* Blob 6 - Left Center - Indigo/Purple */}
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full mix-blend-multiply blur-3xl lg:animate-blob lg:animation-delay-1000"></div>
        
        {/* Blob 7 - Right Center - Pink/Rose */}
        <div className="absolute top-2/3 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full mix-blend-multiply blur-3xl lg:animate-blob lg:animation-delay-6000"></div>
        
        {/* Small Floating Bubbles */}
        <div className="absolute top-20 left-[10%] w-16 h-16 bg-blue-300/30 rounded-full blur-xl lg:animate-float"></div>
        <div className="absolute top-40 right-[15%] w-24 h-24 bg-purple-300/30 rounded-full blur-xl lg:animate-float lg:animation-delay-1000"></div>
        <div className="absolute bottom-32 left-[20%] w-20 h-20 bg-pink-300/30 rounded-full blur-xl lg:animate-float lg:animation-delay-2000"></div>
        <div className="absolute bottom-48 right-[25%] w-28 h-28 bg-indigo-300/30 rounded-full blur-xl lg:animate-float lg:animation-delay-3000"></div>
        <div className="absolute top-1/2 left-[5%] w-12 h-12 bg-teal-300/30 rounded-full blur-lg lg:animate-float lg:animation-delay-4000"></div>
        <div className="absolute top-3/4 right-[10%] w-32 h-32 bg-amber-300/30 rounded-full blur-xl lg:animate-float lg:animation-delay-1500"></div>
      </div>

      <Container>
        <div className="relative z-10">
          
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-16 max-w-[800px] mx-auto">
            <SectionTitle title="Streamline Your Invoicing Maximize Cash Flow" />
          </div>

          <div className="w-full">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  data-index={index}
                  className={`flex flex-col lg:flex-row items-center gap-6 sm:gap-12 mb-10 sm:mb-20 transition-all duration-700 ${
                    feature.reverse ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Container - disabled slide animations on mobile */}
                  <div
                    className={`w-full lg:flex-1 flex justify-center items-center transition-all duration-1000 px-4 ${
                      visibleItems[index]
                        ? 'lg:opacity-100 lg:translate-x-0'
                        : isEven ? 'lg:opacity-0 lg:-translate-x-10' : 'lg:opacity-0 lg:translate-x-10'
                    }`}
                  >
                    <div className="w-full max-w-[380px] lg:max-w-[500px] overflow-hidden rounded-xl shadow-lg border border-gray-100 bg-white/80 backdrop-blur-sm">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={300}
                        className="w-full transition-transform duration-500 lg:hover:scale-105"
                        style={{ width: '100%', height: 'auto' }}
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  {/* Text Content - disabled slide animations on mobile */}
                  <div
                    className={`w-full lg:flex-1 text-center lg:text-left px-6 transition-all duration-1000 ${
                      visibleItems[index] ? 'lg:opacity-100 lg:translate-y-0' : 'lg:opacity-0 lg:translate-y-10'
                    }`}
                  >
                    <h3 className="text-lg sm:text-2xl lg:text-3xl text-slate-900 mb-2 font-bold leading-tight">
                      {feature.title}
                    </h3>
                    
                    <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {expandedItems[index] && (
                      <p className="text-xs sm:text-base text-slate-500 mt-3 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-1">
                        {feature.extraDescription}
                      </p>
                    )}

                    <button
                      onClick={() => toggleReadMore(index)}
                      className="inline-flex items-center gap-1 mt-3 text-[#2f5fa5] font-bold text-xs sm:text-base hover:underline transition-all duration-300 lg:hover:scale-105"
                    >
                      {expandedItems[index] ? 'Show less' : 'Read more'}
                      <svg 
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 ${expandedItems[index] ? 'rotate-180' : ''}`} 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
        
        @media (min-width: 1024px) {
          .animate-blob {
            animation: blob 15s infinite ease-in-out;
          }
          
          .animate-float {
            animation: float 8s infinite ease-in-out;
          }
          
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          
          .animation-delay-1500 {
            animation-delay: 1.5s;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-3000 {
            animation-delay: 3s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .animation-delay-5000 {
            animation-delay: 5s;
          }
          
          .animation-delay-6000 {
            animation-delay: 6s;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;