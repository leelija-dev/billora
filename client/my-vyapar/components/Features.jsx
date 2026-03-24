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
      // threshold: 0.1 is critical for 480px height to trigger animations early
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
    /* py-4 for mobile/short screens ensures the header is visible immediately */
    <section className="py-4 sm:py-12 md:py-20 lg:py-24 bg-white font-sans overflow-hidden relative">
      
      {/* Background Decor - Lowered opacity to keep focus on text */}
      <div className="hidden md:block absolute top-10 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-30 -z-10"></div>

      <Container>
        <div className="relative z-10">
          
          {/* Header Section: mb-4 is tight enough to prevent the 'cut' on 480px viewports */}
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
                    <div className="w-full max-w-[380px] lg:max-w-[500px] overflow-hidden rounded-xl shadow-md border border-gray-50">
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
                      className="inline-flex items-center gap-1 mt-3 text-[#2f5fa5] font-bold text-xs sm:text-base hover:underline"
                    >
                      {expandedItems[index] ? 'Show less' : 'Read more'}
                      <svg 
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${expandedItems[index] ? 'rotate-180' : ''}`} 
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
    </section>
  );
};

export default Features;