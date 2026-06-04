"use client";

import React, { useState } from "react";
import SectionTitle from "./SectionTitle";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Can one software manage multiple businesses (multi-GSTIN)?",
      answer:
        "Yes, modern inventory and billing software can efficiently manage multiple businesses under one single account. Most of these advanced billing applications let users create separate profiles for each GSTIN for generating invoices, tracking inventory, and filing GST returns separately for different businesses while maintaining consolidated records.",
    },
    {
      question: "How to handle GST discrepancies and errors with GST billing & inventory control software?",
      answer:
        "Modern inventory billing software automatically matches your purchase records with the Government's GSTR-2B data. They not only prevent errors by checking HSN/SAC codes or auto-filling buyer details but also help you amend errors in GSTR-1 & adjust tax amounts in GSTR-3B directly.",
    },
    {
      question: "Cloud-based vs. Desktop inventory software: which is better?",
      answer:
        "A cloud-based small business inventory software is generally preferred by most of the business owners as it offers auto-updates for changing tax laws and comes with lower upfront costs. Desktop inventory management software, on the other hand, helps you operate without the internet but requires extreme data control.",
    },
    {
      question: "Which software is recommended for doing inventory management?",
      answer:
        "The best inventory management software India are commonly cloud-based. You can choose any of the popular sales inventory management systems depending on your specific business size, industry, and need for barcode scanning or multi-location tracking.",
    },
    {
      question: "Is it mandatory to use software for GST billing & sales inventory management?",
      answer:
        "Not really. It's not mandatory, however, accounting and inventory management software is highly effective in ensuring compliance, avoiding penalties, reducing manual workload, and managing filing requirements.",
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
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans">
      
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">

          {/* LEFT SIDE */}
          <div className="flex-1 lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-0.5 bg-[#1e88e5]"></div>
                  <span className="text-[#1e88e5] text-sm font-semibold uppercase tracking-wider">
                    Support Center
                  </span>
                </div>
                
                <SectionTitle title="FREQUENTLY ASKED QUESTIONS">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                    Frequently asked
                    <br />
                    <span className="relative inline-block mt-1">
                      <span className="relative z-10">Questions</span>
                      <svg className="absolute bottom-1 left-0 w-full h-3 -z-0" preserveAspectRatio="none">
                        <path d="M0,10 Q50,0 100,10" stroke="#f6c453" strokeWidth="8" fill="none" />
                      </svg>
                    </span>
                  </h2>
                </SectionTitle>
              </div>

              <div className="h-px w-16 bg-gradient-to-r from-[#1e88e5] to-transparent"></div>

              <div className="pt-4">
                <p className="text-slate-700 text-lg font-medium mb-3">
                  Still have questions?
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-[#1e88e5] font-semibold hover:gap-3 transition-all duration-300 group"
                >
                  <span>Ask Away!</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FAQ ACCORDION */}
          <div className="flex-1">
            <div className="space-y-4">
              {faqs.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl transition-all duration-300 border border-slate-200 overflow-hidden hover:border-[#1e88e5]/30 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-5 md:p-6 flex justify-between items-start gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e88e5] focus-visible:ring-offset-2"
                  >
                    <span className={`text-base md:text-lg font-semibold leading-relaxed transition-colors duration-300 ${
                      activeIndex === index ? "text-[#1e88e5]" : "text-slate-900 group-hover:text-[#1e88e5]"
                    }`}>
                      {item.question}
                    </span>
                    
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      activeIndex === index 
                        ? "border-[#1e88e5] bg-[#1e88e5] rotate-180" 
                        : "border-slate-300 group-hover:border-[#1e88e5]"
                    }`}>
                      {activeIndex === index ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className={`w-3 h-3 transition-colors duration-300 ${
                          activeIndex === index ? "text-white" : "text-slate-400 group-hover:text-[#1e88e5]"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      activeIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="p-5 md:p-6 pt-0 border-t border-slate-100">
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-10 pt-2">
              <button className="w-full sm:w-auto bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-8 py-3.5 rounded-xl font-semibold text-base shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 active:scale-98">
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