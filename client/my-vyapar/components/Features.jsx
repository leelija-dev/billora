"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";

const Features = () => {
  const features = [
    {
      title: "Manage cashflow seamlessly",
      description: "The billing software by Vyapar helps automate management. It is done to prevent mistakes in accounting. By investing in this billing software, you can manage your business cash flow effortlessly.",
      extraDescription: "With real-time tracking and automated reminders, you'll never miss a payment again. The dashboard provides clear insights into your accounts receivable and payable, helping you make informed financial decisions.",
      image: "/image/gst1.png",
      reverse: false,
    },
    {
      title: "Choose the perfect convenience for customers",
      description: "Choose the perfect convenience for customers; the biggest comfort you can provide is allowing them to choose how they pay you. Using the Vyapar invoicing app, you can create invoices that include multiple payment options for your business.",
      extraDescription: "Accept payments via UPI, credit/debit cards, net banking, and digital wallets. The system automatically marks invoices as paid when payment is received, reducing manual reconciliation work.",
      image: "/image/invoice.png",
      reverse: true,
    },
    {
      title: "Track your business status",
      description: "With free GST billing software and invoicing tools, you can manage your business using a mobile. Accounting in your business becomes quite simple and efficient with this free software. As all data is stored during invoicing.",
      extraDescription: "Get real-time insights into your business performance with interactive charts and graphs. Monitor sales trends, top products, and customer behavior to make data-driven decisions.",
      image: "/image/payments.png",
      reverse: false,
    },
    {
      title: "Customized Professional Invoices",
      description: "Create and send professional GST invoices that reflect your brand identity. Our tool allows you to customize colors, logos, and fields to meet your specific business requirements while staying fully compliant.",
      extraDescription: "Choose from multiple templates designed for various industries. Include terms and conditions, bank details, and digital signatures automatically on every invoice you generate.",
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
      
      {/* Floating Blob Bubbles - Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 - Top Left - Purple/Blue */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-purple-200/50 to-blue-200/50 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
        
        {/* Blob 2 - Top Right - Yellow/Pink */}
        <div className="absolute top-0 -right-20 w-96 h-96 bg-gradient-to-br from-yellow-200/40 to-pink-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
        
        {/* Blob 3 - Center - Blue/Indigo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Blob 4 - Bottom Left - Green/Teal */}
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-gradient-to-br from-green-200/40 to-teal-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-3000"></div>
        
        {/* Blob 5 - Bottom Right - Orange/Red */}
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-red-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-5000"></div>
        
        {/* Blob 6 - Left Center - Indigo/Purple */}
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-1000"></div>
        
        {/* Blob 7 - Right Center - Pink/Rose */}
        <div className="absolute top-2/3 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200/40 to-rose-200/40 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-6000"></div>
        
        {/* Small Floating Bubbles */}
        <div className="absolute top-20 left-[10%] w-16 h-16 bg-blue-300/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-[15%] w-24 h-24 bg-purple-300/30 rounded-full blur-xl animate-float animation-delay-1000"></div>
        <div className="absolute bottom-32 left-[20%] w-20 h-20 bg-pink-300/30 rounded-full blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute bottom-48 right-[25%] w-28 h-28 bg-indigo-300/30 rounded-full blur-xl animate-float animation-delay-3000"></div>
        <div className="absolute top-1/2 left-[5%] w-12 h-12 bg-teal-300/30 rounded-full blur-lg animate-float animation-delay-4000"></div>
        <div className="absolute top-3/4 right-[10%] w-32 h-32 bg-amber-300/30 rounded-full blur-xl animate-float animation-delay-1500"></div>
      </div>

      <Container>
        <div className="relative z-10">
          
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-16 max-w-[800px] mx-auto">
            <SectionTitle title="Powerful features to grow your business" />
            <p className="hidden xs:block text-xs sm:text-base lg:text-lg text-[#666] px-4 mt-1">
              Everything you need to manage your business professionally
            </p>
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
                  {/* Image Container */}
                  <div
                    className={`w-full lg:flex-1 flex justify-center items-center transition-all duration-1000 px-4 ${
                      visibleItems[index]
                        ? 'opacity-100 translate-x-0'
                        : isEven ? 'opacity-0 -translate-x-10' : 'opacity-0 translate-x-10'
                    }`}
                  >
                    <div className="w-full max-w-[380px] lg:max-w-[500px] overflow-hidden rounded-xl shadow-lg border border-gray-100 bg-white/80 backdrop-blur-sm">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={300}
                        className="w-full h-auto transition-transform duration-500 hover:scale-105"
                        priority={index === 0}
                      />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div
                    className={`w-full lg:flex-1 text-center lg:text-left px-6 ${
                      visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                      className="inline-flex items-center gap-1 mt-3 text-[#2f5fa5] font-bold text-xs sm:text-base hover:underline transition-all duration-300 hover:scale-105"
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
      `}</style>
    </section>
  );
};

export default Features;