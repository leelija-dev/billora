"use client";

import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "Is GST supported for all business types?",
      answer:
        "Yes, our software supports all types of GST registrations including regular, composition, and casual taxpayers. We handle B2B and B2C invoices with proper tax calculations.",
    },
    {
      question: "How easy is it to file GST returns?",
      answer:
        "Yes, the platform is flexible and works for traders, manufacturers, service providers and more. Filing GST returns is now just a few clicks away.",
    },
    {
      question: "Does it support inventory management?",
      answer:
        "Absolutely. It supports complete compliance and reporting features along with real-time inventory tracking.",
    },
    {
      question: "How is GST calculated automatically?",
      answer:
        "Yes, the system automatically calculates GST based on your selected configuration and product/service tax rates.",
    },
    {
      question: "Can I generate detailed reports?",
      answer:
        "We provide detailed invoice and tax breakdown for every transaction with customizable reports.",
    },
    {
      question: "Is data security assured?",
      answer:
        "The software ensures accurate GST filing, reconciliation support, and enterprise-grade data security.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="px-4 sm:px-6 md:px-8 lg:px-[30px] xl:px-[100px] py-12 sm:py-16 md:py-20 lg:py-24 bg-[#eef3f9] font-sans">
      <div className="flex flex-col lg:flex-row justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-[50px]">
        
        {/* LEFT SIDE */}
        <div className="flex-1 mb-6 sm:mb-8 md:mb-0">
          <h4 className="text-[#1e88e5] mb-2 sm:mb-3 text-sm sm:text-base font-semibold uppercase tracking-wide">
            Questions & Answers
          </h4>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
            Frequently asked
            <br className="hidden sm:block" />
            <span className="block sm:inline bg-[#f6c453] px-2 sm:px-3 py-0 sm:py-1 rounded-sm">
              Questions
            </span>
          </h2>

          <div className="flex items-center mb-8 sm:mb-10">
            <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-black mr-2 sm:mr-2.5"></div>
          </div>

          <div className="message">
            <p className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 text-slate-900 font-semibold">
              Don't get Answer?
            </p>
            <a 
              href="#contact" 
              className="text-[#1e88e5] text-lg sm:text-xl md:text-2xl no-underline hover:underline transition-all hover:text-blue-700 inline-block font-medium"
            >
              Leave us a Message
            </a>
          </div>
        </div>

        {/* RIGHT SIDE - FAQ Cards */}
        <div className="flex-1 w-full lg:max-w-[600px]">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4 md:mb-5 transition-all duration-300 ease-in border border-[#e0e0e0] hover:border-[#1e88e5] ${
                activeIndex === index 
                  ? "shadow-[0_8px_20px_rgba(30,136,229,0.15)] border-[#1e88e5]" 
                  : "hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div
                className="flex justify-between items-start sm:items-center cursor-pointer gap-3 sm:gap-4 group"
                onClick={() => toggleFAQ(index)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    toggleFAQ(index);
                  }
                }}
                aria-expanded={activeIndex === index}
              >
                <p className={`text-sm sm:text-base md:text-lg font-semibold text-slate-900 leading-relaxed transition-colors ${
                  activeIndex === index ? "text-[#1e88e5]" : "group-hover:text-[#1e88e5]"
                }`}>
                  {item.question}
                </p>
                <span
                  className={`text-xl sm:text-2xl md:text-3xl text-[#1e88e5] transition-transform duration-300 flex-shrink-0 font-light ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>

              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  activeIndex === index 
                    ? "max-h-[300px] sm:max-h-[350px] pt-3 sm:pt-4 md:pt-5" 
                    : "max-h-0 pt-0"
                }`}
              >
                <div className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed sm:leading-[1.7] border-t border-[#e0e0e0] pt-3 sm:pt-4">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10 md:mt-12 text-center lg:text-left">
            <button className="w-full sm:w-auto bg-[#1e88e5] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95">
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;