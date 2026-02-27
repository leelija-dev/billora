
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
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="px-[100px] py-20 bg-[#eef3f9] font-sans max-lg:px-[60px] max-md:px-[30px] max-sm:px-5">
      <div className="flex justify-between gap-[50px] max-lg:flex-col">
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE */}
        <div className="flex-1.2">
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
                <p>{item.question}</p>
                <span
                  className={`text-[22px] transition-transform duration-300 ${
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
        </div>
      </div>
    </section>
  );
};

export default FAQ;