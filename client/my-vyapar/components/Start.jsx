"use client";

import React from 'react';

export default function BilloraUniversalHero() {
  return (
    <section className="relative w-full min-h-[450px] lg:h-[40vh] lg:min-h-[450px] bg-gradient-to-b from-[#f8faff] to-white px-4 md:px-10 lg:px-20 overflow-hidden flex items-center py-10 lg:py-0">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-12">
        
        {/* LEFT SIDE */}
        <div className="z-20 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2">
          <h1 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Start using <br />
            <span className="text-[#1e266e]">myBillora today</span>
          </h1>

          {/* INPUT BAR */}
          <div className="flex w-full max-w-[320px] sm:max-w-[400px] md:max-w-md bg-white border border-gray-200 rounded-full p-1 md:p-1.5 shadow-md mb-6 transition-all focus-within:ring-2 focus-within:ring-blue-100">
            <div className="flex items-center px-3 md:px-4 py-1.5 md:py-2 flex-grow">
              <span className="text-gray-400 mr-2 text-[12px] md:text-[14px] font-medium">+91</span>
              <input 
                type="tel" 
                placeholder="Mobile number" 
                className="outline-none text-[12px] md:text-[14px] w-full bg-transparent text-slate-700 font-medium"
              />
            </div>
            <button className="bg-[#2563eb] text-white px-4 sm:px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold text-[10px] sm:text-[12px] whitespace-nowrap hover:bg-blue-700 transition-colors">
              Start Free Trial →
            </button>
          </div>

          {/* DOWNLOAD CONTAINER */}
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-3">Download app on</p>
            <div className="w-24 md:w-28 lg:w-32 cursor-pointer hover:scale-105 transition-transform">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Google Play" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Desktop Fix implemented here */}
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-center items-center h-[280px] sm:h-[320px] lg:h-[400px]">
          {/* Changed lg:absolute to lg:relative to stay within the max-w-7xl container on desktop */}
          <div className="relative flex items-end lg:scale-110 xl:scale-125 transition-transform">
            
            {/* Back Mockup (Phone2) */}
            <div className="absolute bottom-4 right-16 sm:right-20 lg:right-24 w-20 h-[150px] sm:w-28 sm:h-[210px] lg:w-36 lg:h-[260px] bg-[#5a6b8d] rounded-[1rem] border-[1.5px] sm:border-[2px] border-[#2c3344] shadow-lg -rotate-6 z-0 overflow-hidden">
               <img 
                src="/image/Phone2.png" 
                alt="App Screenshot 2" 
                className="w-full h-full object-cover"
               />
            </div>
            
            {/* Front Mockup (Phone1) */}
            <div className="relative w-24 h-[190px] sm:w-32 sm:h-[250px] lg:w-44 lg:h-[320px] bg-white rounded-[1.2rem] border-[4px] sm:border-[6px] lg:border-[3px] border-[#1e266e] shadow-2xl rotate-3 z-10 flex flex-col items-center overflow-hidden">
               <div className="w-1/4 h-0.5 bg-gray-200 rounded-full absolute top-1 sm:top-2 z-20"></div>
               <img 
                src="/image/Phone1.png" 
                alt="App Screenshot 1" 
                className="w-full h-full object-cover"
               />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}