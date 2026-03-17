"use client";
<<<<<<< HEAD
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";

import React, { useState, useEffect, useRef } from 'react';
=======

import React from 'react';
>>>>>>> 9bfd81b (my second git push)
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: "Manage cashflow seamlessly",
<<<<<<< HEAD
      description: "The billing software by Vyapar helps automate management. It is done to prevent mistakes in accounting. By investing in this billing software, you can manage your business cash flow effortlessly.",
      extraDescription: "With real-time tracking and automated reminders, you'll never miss a payment again. The dashboard provides clear insights into your accounts receivable and payable, helping you make informed financial decisions.",
      image: "/image/gst1.png",
=======
      description: "The billing software by Vyapar helps automate management. It is done to prevent mistakes in accounting. By investing in this billing software, you can manage your business cash flow effortlessly. This all-in-one software makes managing cash transactions possible. It comes with features like bank withdrawals and deposits tracking.",
      image: "/images/feature1.jpg",
>>>>>>> 9bfd81b (my second git push)
      reverse: false
    },
    {
      title: "Online/Offline GST billing",
      description: "The Vyapar app helps you generate invoices for your customers without requiring you to stay online. You can rely on our business accounting software to validate your transactions and update your database when connecting it to the internet.",
<<<<<<< HEAD
      extraDescription: "Automatic GST calculations ensure compliance with the latest tax rates. The software generates GSTR-1, GSTR-3B reports instantly, saving hours of manual work during filing season.",
      image: "/image/invoice.png",
=======
      image: "/images/feature2.jpg",
>>>>>>> 9bfd81b (my second git push)
      reverse: true
    },
    {
      title: "Provide multiple payment options",
      description: "Choose the perfect convenience for customers; the biggest comfort you can provide is allowing them to choose how they pay you. Using the Vyapar invoicing app, you can create invoices that include multiple payment options for your business.",
<<<<<<< HEAD
      extraDescription: "Accept payments via UPI, credit/debit cards, net banking, and digital wallets. The system automatically marks invoices as paid when payment is received, reducing manual reconciliation work.",
      image: "/image/payments.png",
=======
      image: "/images/feature3.jpg",
>>>>>>> 9bfd81b (my second git push)
      reverse: false
    },
    {
      title: "Track your business status",
      description: "With free GST billing software and invoicing tools, you can manage your business using a mobile. Accounting in your business becomes quite simple and efficient with this free software. As all data is stored during invoicing.",
<<<<<<< HEAD
      extraDescription: "Get real-time insights into your business performance with interactive charts and graphs. Monitor sales trends, top products, and customer behavior to make data-driven decisions.",
      image: "/image/trace.png",
=======
      image: "/images/feature4.jpg",
>>>>>>> 9bfd81b (my second git push)
      reverse: true
    }
  ];

<<<<<<< HEAD
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
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const toggleReadMore = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  return (
    <section className="py-20 sm:py-24 md:py-[100px] bg-white font-sans overflow-hidden relative">

      {/* Animated Circular Background */}
      <style>{`
        @keyframes float-circle-1 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.15; }
          50% { transform: translate(30px, 30px); opacity: 0.25; }
        }
        @keyframes float-circle-2 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.15; }
          50% { transform: translate(-25px, 25px); opacity: 0.25; }
        }
        @keyframes float-circle-3 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.15; }
          50% { transform: translate(25px, -30px); opacity: 0.25; }
        }
        @keyframes float-circle-4 {
          0%, 100% { transform: translate(0px, 0px); opacity: 0.15; }
          50% { transform: translate(-30px, -25px); opacity: 0.25; }
        }
        .circle-float-1 { animation: float-circle-1 8s ease-in-out infinite; }
        .circle-float-2 { animation: float-circle-2 10s ease-in-out infinite 1s; }
        .circle-float-3 { animation: float-circle-3 12s ease-in-out infinite 2s; }
        .circle-float-4 { animation: float-circle-4 9s ease-in-out infinite 1.5s; }
      `}</style>

      {/* Animated Circle Elements */}
      <div className="hidden sm:block absolute top-20 left-10 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full circle-float-1"></div>
      <div className="hidden md:block absolute top-1/3 right-20 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-br from-purple-400 to-purple-200 rounded-full circle-float-2"></div>
      <div className="hidden sm:block absolute bottom-40 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-gradient-to-br from-indigo-400 to-indigo-200 rounded-full circle-float-3"></div>
      <div className="hidden md:block absolute bottom-10 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400 to-cyan-200 rounded-full circle-float-4"></div>

      {/* Content */}
      <Container>
        <div className="relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-[60px] max-w-[800px] mx-auto">
           <SectionTitle title="Powerful features to grow your business" />
            <p className="text-base sm:text-base md:text-sm lg:text-lg text-[#666] px-4 sm:px-0">
              {/* Tablet: md:text-sm (14px) - smaller than mobile but balanced */}
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
                  className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12 lg:gap-[60px] mb-16 sm:mb-20 md:mb-[100px] transition-all duration-1000 ${feature.reverse ? 'lg:flex-row-reverse' : ''
                    }`}
                >
                  {/* Image with left-right animation */}
                  <div
                    className={`w-full lg:flex-1 flex justify-center items-center transition-all duration-1000 px-4 sm:px-0 ${visibleItems[index]
                        ? 'opacity-100 translate-x-0'
                        : isEven
                          ? 'opacity-0 -translate-x-20'
                          : 'opacity-0 translate-x-20'
                      }`}
                  >
                    <div className="w-full max-w-[500px] overflow-hidden rounded-lg sm:rounded-2xl md:rounded-[20px]">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={300}
                        className="w-full h-auto transition-all duration-500 hover:scale-110 hover:shadow-2xl"
                        priority={false}
                      />
                    </div>
                  </div>

                  {/* Content with opposite left-right animation */}
                  <div
                    className={`w-full lg:flex-1 text-center lg:text-left transition-all duration-1000 delay-200 px-4 sm:px-2 md:px-5 ${visibleItems[index]
                        ? 'opacity-100 translate-x-0'
                        : isEven
                          ? 'opacity-0 translate-x-20'
                          : 'opacity-0 -translate-x-20'
                      }`}
                  >
                    <h3 className="text-2xl sm:text-2xl md:text-xl lg:text-[28px] text-black mb-4 sm:mb-4 md:mb-5 font-semibold leading-snug transition-colors duration-300 hover:text-[#2f5fa5]">
                      {/* Tablet: md:text-xl (20px) - smaller than mobile's 24px */}
                      {feature.title}
                    </h3>
                    
                    <p className="text-base sm:text-base md:text-base lg:text-base text-[#555] leading-relaxed sm:leading-[1.7] md:leading-[1.6] lg:leading-[1.8] m-0">
                      {/* Tablet: md:text-sm (14px) */}
                      {feature.description}
                    </p>

                    {/* Extra paragraph that appears when expanded */}
                    {expandedItems[index] && (
                      <p className="text-base sm:text-base md:text-base lg:text-base text-[#555] leading-relaxed sm:leading-[1.7] md:leading-[1.6] lg:leading-[1.8] mt-4 sm:mt-4 pt-4 sm:pt-4 border-t border-[#2f5fa5]/20 animate-in slide-in-from-top duration-500">
                        {/* Tablet: md:text-sm (14px) */}
                        {feature.extraDescription}
                      </p>
                    )}

                    {/* Clickable read more/less link */}
                    <button
                      onClick={() => toggleReadMore(index)}
                      className="inline-flex items-center gap-2 mt-4 sm:mt-4 md:mt-5 text-[#2f5fa5] font-medium text-base sm:text-base md:text-base lg:text-base group hover:cursor-pointer bg-transparent border-none p-0 transition-all duration-300 hover:gap-3 justify-center lg:justify-start"
                    >
                      <span className="relative">
                        {expandedItems[index] ? 'Show less' : 'Read more'}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2f5fa5] transition-all duration-300 group-hover:w-full"></span>
                      </span>
                      <svg
                        className={`w-4 h-4 sm:w-4 sm:h-4 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 transition-all duration-300 ${expandedItems[index] ? 'rotate-180' : 'group-hover:translate-x-1'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={expandedItems[index] ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
=======
  return (
    <section className="py-[100px] bg-[#f3f6fb] font-sans max-md:py-[60px] max-sm:py-10">
      <div className="text-center mb-[60px] max-w-[800px] mx-auto px-5">
        <h2 className="text-4xl text-[#2f5fa5] mb-4 font-bold max-md:text-3xl max-sm:text-2xl">
          Features of GST Billing and Accounting Software
        </h2>
        <p className="text-[#666] text-lg max-md:text-base">
          Everything you need to manage your business professionally
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex items-center gap-[60px] mb-[100px] max-lg:flex-col max-lg:gap-10 max-lg:mb-20 ${
              feature.reverse ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="flex-1 flex justify-center items-center">
              <div className="w-full max-w-[500px]">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex-1 p-5 max-lg:text-center max-lg:p-0">
              <h3 className="text-[28px] text-black mb-5 font-semibold max-md:text-2xl max-sm:text-[22px]">
                {feature.title}
              </h3>
              <p className="text-base text-[#555] leading-[1.8] m-0 max-sm:text-sm max-sm:leading-[1.6]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
>>>>>>> 9bfd81b (my second git push)
    </section>
  );
};

export default Features;