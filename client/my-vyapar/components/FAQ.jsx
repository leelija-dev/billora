"use client";

import React, { useState } from "react";
import SectionTitle from "./SectionTitle";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Can one software manage multiple businesses (multi-GSTIN)?",
      answer:
        "Yes, modern inventory and billing software can efficiently manage multiple businesses under one single account. Most of these advanced billing applications let users create separate profiles for each GSTIN for generating invoices, tracking inventory, and filing GST returns separately for different businesses while maintaining consolidated records. ",
    },
    {
      question: "How to handle GST discrepancies and errors with GST billing & inventory control software?",
      answer:
        "Modern inventory billing software automatically matches your purchase records with the Government’s GSTR-2B data. They not only prevent errors by checking HSN/SAC codes or auto-filling buyer details but also help you amend errors in GSTR-1 & adjust tax amounts in GSTR-3B directly.  ",
    },
    {
      question: "Cloud-based vs. Desktop inventory software: which is better?",
      answer:
        "A cloud-based small business inventory software is generally preferred by most of the business owners as it offers auto-updates for changing tax laws and comes with lower upfront costs. Desktop inventory management software, on the other hand, helps you operate without the internet but requires extreme data control.",
    },
    {
      question: "Which software is recommended for doing inventory management?",
      answer:
        "The best inventory management software India are commonly cloud-based. You can choose any of the popular sales inventory management systems depending on your specific business size, industry, and need for barcode scanning or multi-location tracking. ",
    },
    {
      question: "Is it mandatory to use software for GST billing & sales inventory management?",
      answer:
        "Not really. It’s not mandatory, however, accounting and inventory management software is highly effective in ensuring compliance, avoiding penalties, reducing manual workload, and managing filing requirements.",
    },
    {
      question: "How often does a GST billing software update tax rules?",
      answer:
        "The best billing & inventory stock control software generally updates tax rules automatically, especially when there is a change in the law or recommendations from the GST council. However, you can expect to see minor changes once every 4 months and major updates at the start of a financial year (roughly 1st April onwards).",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#eef3f9] font-sans">
      
      {/* Container */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-[50px]">

          {/* LEFT SIDE - FIXED: SMALLER TEXT */}
                <div className="flex-1 mb-6 sm:mb-8 md:mb-0">
                <h4 className="text-[#1e88e5] mb-2 sm:mb-3 text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide">
                  Questions & Answers
                </h4>
               <SectionTitle title="FREQUENTLY ASKED QUESTIONS" >
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
                  Frequently asked
                  <br className="hidden sm:block" />
                  <span className="relative inline-block">
                  <span className="relative z-10 px-1">Questions</span>
                  <span className="absolute inset-0 bg-[#f6c453] -skew-y-1 transform rounded-sm -z-0"></span>
                  </span>
                </h2>

            
            </SectionTitle>

                <div className="flex items-center mb-8 sm:mb-10">
                  <div className="w-12 sm:w-16 h-0.5 bg-black mr-2 sm:mr-2.5"></div>
                </div>

                <div className="message">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 text-slate-900 font-semibold">
               Still Curious?

                  </p>
                  <a
                  href="#contact"
                  className="text-[#1e88e5] text-base sm:text-lg md:text-xl lg:text-2xl no-underline hover:underline transition-all hover:text-blue-700 inline-block font-medium"
                  >
                  Ask Away!
                  </a>
                </div>
                </div>

                {/* RIGHT SIDE - FIXED: SMALLER TEXT */} 
          <div className="flex-1 w-full">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg sm:rounded-xl p-5 sm:p-5 md:p-6 mb-3 sm:mb-4 md:mb-5 transition-all duration-300 ease-in border border-[#e0e0e0] hover:border-[#1e88e5] ${
                  activeIndex === index
                    ? "shadow-[0_8px_20px_rgba(30,136,229,0.15)] border-[#1e88e5]"
                    : "hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                }`}
              >
                <div
                  className="flex justify-between items-start sm:items-center cursor-pointer gap-3 sm:gap-4 group"
                  onClick={() => toggleFAQ(index)}
                >
                  <p className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-slate-900 leading-relaxed ${
                    activeIndex === index ? "text-[#1e88e5]" : "group-hover:text-[#1e88e5]"
                  }`}>
                    {item.question}
                  </p>
                  <span
                    className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#1e88e5] transition-transform duration-300 flex-shrink-0 ${
                      activeIndex === index ? "rotate-180" : ""
                    }`}
                  >
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    activeIndex === index
                      ? "max-h-[400px] sm:max-h-[350px] pt-3 sm:pt-4 md:pt-5"
                      : "max-h-0 pt-0"
                  }`}
                >
                  <div className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed sm:leading-[1.7] border-t border-[#e0e0e0] pt-3 sm:pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="mt-8 sm:mt-10 md:mt-12 text-center lg:text-left">
              <button className="w-full sm:w-auto bg-[#1e88e5] text-white px-6 sm:px-8 py-3 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg md:text-xl lg:text-2xl transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95">
                Ask a Question
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;