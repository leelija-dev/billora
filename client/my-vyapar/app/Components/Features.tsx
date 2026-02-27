
"use client";

import React from 'react';
import Image from 'next/image';

const Features = () => {
  const features = [
    {
      title: "Manage cashflow seamlessly",
      description: "The billing software by Vyapar helps automate management. It is done to prevent mistakes in accounting. By investing in this billing software, you can manage your business cash flow effortlessly. This all-in-one software makes managing cash transactions possible. It comes with features like bank withdrawals and deposits tracking.",
      image: "/images/feature1.jpg",
      reverse: false
    },
    {
      title: "Online/Offline GST billing",
      description: "The Vyapar app helps you generate invoices for your customers without requiring you to stay online. You can rely on our business accounting software to validate your transactions and update your database when connecting it to the internet.",
      image: "/images/feature2.jpg",
      reverse: true
    },
    {
      title: "Provide multiple payment options",
      description: "Choose the perfect convenience for customers; the biggest comfort you can provide is allowing them to choose how they pay you. Using the Vyapar invoicing app, you can create invoices that include multiple payment options for your business.",
      image: "/images/feature3.jpg",
      reverse: false
    },
    {
      title: "Track your business status",
      description: "With free GST billing software and invoicing tools, you can manage your business using a mobile. Accounting in your business becomes quite simple and efficient with this free software. As all data is stored during invoicing.",
      image: "/images/feature4.jpg",
      reverse: true
    }
  ];

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
    </section>
  );
};

export default Features;