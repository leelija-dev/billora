"use client";

import React, { useState } from "react";
<<<<<<< HEAD
import SectionTitle from "./SectionTitle";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Is GST supported for all business types?",
=======

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "Is GSTa supported for all business types?",
>>>>>>> 9bfd81b (my second git push)
      answer:
        "Yes, our software supports all types of GST registrations including regular, composition, and casual taxpayers. We handle B2B and B2C invoices with proper tax calculations.",
    },
    {
<<<<<<< HEAD
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
=======
      question: "Is GST supported for all business types?",
      answer:
        "Yes, the platform is flexible and works for traders, manufacturers, service providers and more.",
    },
    {
      question: "Is GST supported for all business types?",
      answer:
        "Absolutely. It supports complete compliance and reporting features.",
    },
    {
      question: "Is GST supported for all business types?",
      answer:
        "Yes, the system automatically calculates GST based on selected configuration.",
    },
    {
      question: "Is GST supported for all business types?",
      answer:
        "We provide detailed invoice and tax breakdown for every transaction.",
    },
    {
      question: "Is GST supported for all business types?",
      answer:
        "The software ensures accurate GST filing and reconciliation support.",
>>>>>>> 9bfd81b (my second git push)
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
<<<<<<< HEAD
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#eef3f9] font-sans">
      
      {/* Container */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-[50px]">

          {/* LEFT SIDE - FIXED: SMALLER TEXT */}
                <div className="flex-1 mb-6 sm:mb-8 md:mb-0">
                <h4 className="text-[#1e88e5] mb-2 sm:mb-3 text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide">
                  Questions & Answers
                </h4>
               <sectionTitle title="FREQUENTLY ASKED QUESTIONS" />
                {/* <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
                  Frequently asked
                  <br className="hidden sm:block" />
                  <span className="relative inline-block">
                  <span className="relative z-10 px-1">Questions</span>
                  <span className="absolute inset-0 bg-[#f6c453] -skew-y-1 transform rounded-sm -z-0"></span>
                  </span>
                </h2> */}

            {/* <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
              Frequently asked
              <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="relative z-10 px-1">Questions</span>
                <span className="absolute inset-0 bg-[#f6c453] -skew-y-1 transform rounded-sm -z-0"></span>
              </span>
            </h2> */}
            <SectionTitle title="Frequently Asked Questions" />

                {/* <sectionTitle title="FREQUENTLY ASKED QUESTIONS" /> */}

                <div className="flex items-center mb-8 sm:mb-10">
                  <div className="w-12 sm:w-16 h-0.5 bg-black mr-2 sm:mr-2.5"></div>
                </div>

                <div className="message">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-2 sm:mb-3 text-slate-900 font-semibold">
                  Don't get Answer?
                  </p>
                  <a
                  href="#contact"
                  className="text-[#1e88e5] text-base sm:text-lg md:text-xl lg:text-2xl no-underline hover:underline transition-all hover:text-blue-700 inline-block font-medium"
                  >
                  Leave us a Message
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

=======
    <section className="px-[100px] py-20 bg-[#eef3f9] font-sans max-lg:px-[60px] max-md:px-[30px] max-sm:px-5">
      <div className="flex justify-between gap-[50px] max-lg:flex-col">
        {/* LEFT SIDE - Keep as is */}
        <div className="flex-1">
          <h4 className="text-[#1e88e5] mb-2.5">Questions & answers</h4>
          <h2 className="text-[40px] text-[#2c3e75] mb-5 max-md:text-3xl max-sm:text-2xl">
            Frequently asked <br />
            <span className="bg-[#f6c453] px-2">Questions</span>
          </h2>

          <div className="flex items-center mb-10">
            <div className="w-20 h-0.5 bg-black mr-2.5"></div>
          </div>

          <div className="message">
            <p className="text-xl mb-1 max-md:text-lg">Don't get Answer?</p>
            <a href="#" className="text-[#1e88e5] text-[22px] no-underline max-md:text-xl">
              Leave us a Message
            </a>
          </div>
        </div>

        {/* RIGHT SIDE - Cards with reduced width */}
        <div className="flex-1 max-w-[600px]"> {/* Added max-width to control card width */}
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 mb-5 transition-all duration-300 ease-in border border-[#e0e0e0] ${
                activeIndex === index ? "shadow-[0_8px_20px_rgba(0,0,0,0.05)]" : ""
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer font-medium"
                onClick={() => toggleFAQ(index)}
              >
                <p className="pr-4">{item.question}</p> {/* Added padding right for better spacing */}
                <span
                  className={`text-[22px] transition-transform duration-300 flex-shrink-0 ${
                    activeIndex === index ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </div>

              <div
                className={`overflow-hidden transition-all duration-400 ease-in ${
                  activeIndex === index ? "max-h-[200px] pt-[15px]" : "max-h-0"
                }`}
              >
                <div className="text-[#555] text-sm leading-[1.6]">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
>>>>>>> 9bfd81b (my second git push)
        </div>
      </div>
    </section>
  );
};

export default FAQ;