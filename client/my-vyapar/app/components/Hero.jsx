"use client";

import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] px-20 pb-[120px] pt-10 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0f2fe] flex items-center relative z-10 max-lg:px-[60px] max-md:px-[30px] max-md:pb-20 max-sm:px-5 max-sm:pb-[60px] max-sm:pt-5">
        <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-transparent to-[#f8fafc4D] pointer-events-none z-[2]"></div>
        
        <div className="max-w-[1400px] mx-auto flex items-center gap-[60px] w-full relative z-[3] max-lg:flex-col max-lg:text-center">
          {/* Content */}
          <div className="flex-1">
            <h1 className="text-[52px] font-extrabold text-[#0f172a] leading-[1.2] mb-[30px] tracking-[-0.02em] max-lg:text-[44px] max-md:text-4xl max-sm:text-3xl">
              Smart GST Billing Software for Your Business
            </h1>
            <p className="text-lg text-[#475569] leading-[1.6] mb-10 max-w-[550px] max-lg:mx-auto">
              Create professional GST invoices, manage inventory, and stay compliant with India's tax laws. Trusted by 50,000+ businesses.
            </p>
            <button className="px-[42px] py-4 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white border-none rounded-[50px] text-lg font-semibold cursor-pointer shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(59,130,246,0.4)] max-sm:px-8 max-sm:py-3 max-sm:text-base">
              Start Free Trial
            </button>
          </div>

          {/* Images */}
          <div className="flex-1 relative min-h-[500px] max-lg:min-h-[400px] max-md:min-h-[350px] max-sm:min-h-[300px]">
            {/* Laptop Mockup */}
            <div className="w-[550px] h-[300px] bg-[#0f172a] rounded-t-[20px] p-2 relative animate-[float_4s_ease-in-out_infinite] shadow-[0_30px_40px_rgba(0,0,0,0.2)] max-lg:w-[450px] max-lg:h-[250px] max-md:w-[400px] max-md:h-[220px] max-sm:w-[280px] max-sm:h-[160px] max-sm:mx-auto">
              <div className="w-full h-full bg-[#1e293b] rounded-xl overflow-hidden">
                <div className="h-[30px] bg-[#334155] flex items-center px-4 gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#10b981]"></span>
                </div>
                <div className="w-full h-[calc(100%-30px)] bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] opacity-20"></div>
              </div>
              <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-[200px] h-3 bg-[#334155] rounded-b-[10px]"></div>
            </div>

            {/* Phone Mockup */}
            <div className="absolute left-[-30px] bottom-[-20px] w-[130px] h-[250px] bg-[#1e293b] rounded-[30px] p-1 animate-[float_4s_ease-in-out_infinite] shadow-[20px_20px_30px_rgba(0,0,0,0.15)] max-lg:left-[-10px] max-sm:hidden">
              <div className="w-full h-full bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] rounded-[25px] opacity-30"></div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-[20%] right-[-20px] px-5 py-2.5 bg-white rounded-[40px] font-semibold text-sm shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-[#3b82f633] animate-[floatBadge_3s_ease-in-out_infinite] whitespace-nowrap text-[#3b82f6] max-md:hidden">
              ⚡ 50,000+ Users
            </div>
            <div className="absolute bottom-[40%] right-[30px] px-5 py-2.5 bg-white rounded-[40px] font-semibold text-sm shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-[#8b5cf633] animate-[floatBadge_3s_ease-in-out_infinite] animate-delay-500 whitespace-nowrap text-[#8b5cf6] max-md:hidden">
              ✓ GST Compliant
            </div>
            <div className="absolute top-[40%] left-[-30px] px-5 py-2.5 bg-white rounded-[40px] font-semibold text-sm shadow-[0_10px_25px_rgba(0,0,0,0.1)] border border-[#10b98133] animate-[floatBadge_3s_ease-in-out_infinite] animate-delay-1000 whitespace-nowrap text-[#10b981] max-md:hidden">
              🚀 Free Forever
            </div>
          </div>
        </div>
      </section>

      {/* Superb Features Section */}
      <section className="px-20 pb-[100px] bg-transparent relative z-[5] -mt-20 max-lg:px-[60px] max-lg:pb-20 max-md:px-[30px] max-md:-mt-[60px] max-md:pb-[60px] max-sm:px-5 max-sm:-mt-10 max-sm:pb-10">
        <h2 className="text-[42px] font-bold text-white text-center mb-[30px] relative z-[6] max-lg:text-4xl max-md:text-3xl max-sm:text-2xl">
          <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent relative after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#3b82f6] after:to-[#8b5cf6] after:opacity-30 after:rounded-sm">
            Superb Features
          </span>
        </h2>

        <div className="bg-[#0f172a] rounded-[60px_60px_40px_40px] p-[50px_60px_0] max-w-[1100px] mx-auto relative shadow-[0_30px_50px_rgba(0,0,0,0.3)] border border-white/10 -top-[30px] max-lg:p-10 max-md:p-[30px_30px_0] max-sm:p-5">
          <div className="flex justify-center gap-5 mb-[50px] flex-wrap">
            {['📊 Smart Reports', '⚡ Fast Invoicing', '🔒 Secure', '📱 Mobile App'].map((pill, idx) => (
              <span
                key={idx}
                className="px-8 py-3.5 bg-white/10 backdrop-blur-[5px] border border-white/20 rounded-[50px] text-white font-semibold text-base shadow-[0_5px_15px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#3b82f64D] hover:-translate-y-1 hover:border-[#3b82f6] max-sm:w-full max-sm:text-center max-sm:px-5 max-sm:py-2.5"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="h-[500px] bg-white rounded-[40px_40px_30px_30px] p-[35px] relative top-[30px] shadow-[0_-10px_30px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.15)] border border-white/80 transition-transform duration-300 hover:-translate-y-1 max-lg:h-[350px] max-md:p-6 max-sm:h-auto">
            {/* Mini Navbar */}
            <div className="flex justify-between items-center mb-[30px] pb-5 border-b border-[#e2e8f0] max-sm:flex-col max-sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="w-[35px] h-[35px] bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white flex items-center justify-center rounded-lg font-bold text-lg">
                  V
                </span>
                <span className="text-[#1e293b] font-bold text-base">Vyapar</span>
              </div>
              <div className="flex gap-6 max-sm:w-full max-sm:justify-around">
                {['Home', 'Features', 'Pricing'].map((item, idx) => (
                  <span key={idx} className="text-[#64748b] text-sm font-medium cursor-default transition-colors duration-300 hover:text-[#3b82f6]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini Hero */}
            <div className="flex items-center gap-[30px] max-sm:flex-col max-sm:text-center">
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold text-[#0f172a] mb-2.5">Smart Billing</h3>
                <p className="text-sm text-[#475569] mb-5 leading-[1.5]">
                  Create GST invoices in seconds with automatic tax calculations
                </p>
                <button className="px-5 py-2 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white border-none rounded-[30px] text-xs font-semibold shadow-[0_4px_10px_rgba(59,130,246,0.3)]">
                  Learn More
                </button>
              </div>
              <div className="flex-1 relative min-h-[120px] flex justify-center">
                <div className="w-[200px] h-[100px] bg-[#1e293b] rounded-t-xl p-1 shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                  <div className="w-full h-full bg-[#0f172a] rounded-lg overflow-hidden">
                    <div className="h-4 bg-[#334155] flex items-center px-2 gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    </div>
                    <div className="h-10 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] opacity-30 m-2 rounded"></div>
                  </div>
                </div>
                <span className="absolute top-[-10px] right-5 px-2.5 py-1 bg-white rounded-[20px] text-[10px] font-semibold text-[#1e293b] shadow-[0_3px_8px_rgba(0,0,0,0.1)] border border-[#e2e8f0] whitespace-nowrap">
                  ⚡ New Feature
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-full bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] bg-[length:25px_25px] -z-10 opacity-50 pointer-events-none"></div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, -5px); }
          50% { transform: translate(0, -10px); }
          75% { transform: translate(-5px, -5px); }
        }
        .animate-delay-500 {
          animation-delay: 0.5s;
        }
        .animate-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Hero;