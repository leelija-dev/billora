"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-[1vh] flex items-center px-5 md:px-20 pb-32 pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">
        {/* Ultra Animated Background */}
        <style>{`
          @keyframes float-blob-1 { 0%, 100% { transform: translate(0px, 0px) scale(1); } 25% { transform: translate(40px, -50px) scale(1.1); } 50% { transform: translate(-30px, 40px) scale(0.95); } 75% { transform: translate(50px, 30px) scale(1.05); } }
          @keyframes float-blob-2 { 0%, 100% { transform: translate(0px, 0px) scale(1); } 25% { transform: translate(-40px, 50px) scale(0.95); } 50% { transform: translate(35px, -45px) scale(1.1); } 75% { transform: translate(-45px, -35px) scale(1.05); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes floatIcons { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-25px) rotate(8deg); } }
          @keyframes custom-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-custom-bounce { animation: custom-bounce 3s ease-in-out infinite; }
          .blob-float-1 { animation: float-blob-1 12s ease-in-out infinite; }
          .blob-float-2 { animation: float-blob-2 14s ease-in-out infinite 1s; }
          .float-icon { animation: floatIcons 8s ease-in-out infinite; font-size: 48px; position: absolute; }
          .delay-1 { animation-delay: 0.5s; }
          .delay-2 { animation-delay: 1s; }
          .delay-3 { animation-delay: 1.5s; }
        `}</style>

        {/* Fading GST Icons Container */}
        {/* Floating Business Icons Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Invoice */}
          <div className="absolute top-[12%] left-[8%] float-icon opacity-20">
            📄
          </div>

          {/* Rupee */}
          <div className="absolute top-[65%] left-[15%] float-icon delay-2 opacity-20">
            ₹
          </div>

          {/* Chart */}
          <div className="absolute top-[30%] right-[12%] float-icon delay-3 opacity-20">
            📊
          </div>

          {/* Calculator */}
          <div className="absolute bottom-[20%] right-[18%] float-icon delay-4 opacity-20">
            🧮
          </div>

          {/* Bill */}
          <div className="absolute top-[50%] left-[40%] float-icon delay-5 opacity-20">
            🧾
          </div>
        </div>

        {/* Gradient Overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 
                        bg-gradient-to-t from-slate-50/80 to-transparent 
                        pointer-events-none z-20"
        ></div>

        {/* Main Content */}
        <div className="relative z-30 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-tight mb-8 tracking-tight animate-fadeInUp">
              GST Billing Software for Small Businesses in India
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-10 max-w-[550px] mx-auto lg:mx-0 animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              Manage your business professionally with Billora, India's leading
              small business software for billing, inventory, and accounting.
              Join 1 Cr+ satisfied SMEs in India who trust Billora.
            </p>
            <div className="flex flex-row gap-7 justify-center lg:justify-start flex-wrap">
              <Link href="/start-free-trial">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md transition-all hover:-translate-y-1">
                  Start Free Trial
                </button>
              </Link>

              <Link href="/bookdemo">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md transition-all hover:-translate-y-1">
                  Book free demo
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Images Container */}
          <div className="flex-1 relative min-h-[350px] md:min-h-[500px] w-full max-w-[600px]">
            {/* Laptop Mockup */}
            <div
              className="relative w-full aspect-[16/9] bg-slate-900 rounded-t-[20px] p-2 shadow-2xl z-10 animate-fadeInUp"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-full h-full bg-slate-800 rounded-xl overflow-hidden">
                <div className="h-8 bg-slate-700 flex items-center px-4 gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>

                {/* Desktop Image */}
                <div className="relative w-full h-[250px] md:h-[350px] bg-slate-800 overflow-hidden">
                  <Image
                    src="/image/desktop.png"
                    alt="Desktop Interface"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                    priority={true}
                  />
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[150px] md:w-[200px] h-3 bg-slate-700 rounded-b-xl"></div>
            </div>

            {/* Phone Mockup */}
            <div
              className="absolute -left-4 md:-left-8 -bottom-5 w-[100px] md:w-[130px] h-[200px] md:h-[280px] bg-slate-800 rounded-[30px] p-1.5 shadow-xl z-20 hidden sm:block animate-fadeInUp"
              style={{ animationDelay: "0.45s" }}
            >
              <div className=" w-full h-full bg-slate-900 rounded-[25px] overflow-hidden relative">
                {/* Mobile Image */}
                <Image
                  src="/image/Mobile.png"
                  alt="Mobile Interface"
                  fill
                  sizes="(max-width: 768px) 100vw, 130px"
                  className="object-cover w-full h-full rounded-[20px]"
                  priority={true}
                />
              </div>
            </div>

            {/* JUMPING THREE BADGES */}
            <div className="absolute top-[20%] -right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-blue-100 text-blue-600 z-30 hidden md:block animate-custom-bounce">
              ✨ Easy to Use
            </div>
            <div
              className="absolute bottom-[40%] right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-purple-100 text-purple-600 z-30 hidden md:block animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              👥 Collaborative
            </div>
            <div
              className="absolute top-[40%] -left-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-emerald-100 text-emerald-600 z-30 hidden md:block animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              📊 Activity Stream
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPERB FEATURES SECTION (BLACK CARD) ===== */}
      <section className="relative -mt-24 w-full mx-auto z-40 px-4 md:px-0 mb-48 hidden sm:block animate-slideUp">
        <div
          className="relative bg-[#0f172a] rounded-[40px] pt-[100px] pb-[100px] px-[20px] md:px-[40px] max-w-[1000px] mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 overflow-visible"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Internal Glow for depth */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <h2 className="text-3xl md:text-[42px] font-bold text-white text-center mb-8 relative z-20 leading-tight">
            We made it{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              superb
            </span>{" "}
            & usable
          </h2>

          <div className="flex justify-center gap-3 md:gap-5 mb-12 flex-wrap relative z-20">
            {["Easy to Use", "Collaborative", "Activity Stream"].map((pill) => (
              <span
                key={pill}
                className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white/90 font-medium text-xs md:text-sm"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* THE "HANGING" WHITE CARD */}
          {/* -bottom-24 pushes it out of the black section for the hanging effect */}
          {/* <div className="group absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[30px] p-6 md:p-10 border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-50 transition-transform duration-500 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    B
                  </div>
                  <span className="font-bold text-slate-800">
                    Billora Premium
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                  GST Billing Software
                </h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Automate your invoicing and inventory in seconds.
                </p>
                <Link href="/start-free-trial">
                  <button className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors">
                    Get Started Free
                  </button>
                </Link>
              </div>
              <div className="flex-1 w-full">
                <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <Image
                    src="/image/desktop.png"
                    alt="Dashboard"
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div> */}
          <div className="group absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[30px] p-8 md:p-12 border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-50 transition-transform duration-500 hover:-translate-y-2 min-h-[320px] md:min-h-[360px]">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 h-full">
              <div className="flex-1 text-center md:text-left h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    B
                  </div>
                  <span className="font-bold text-slate-800">
                    Billora Premium
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
                  GST Billing Software
                </h3>
                <p className="text-slate-500 mb-8 text-base md:text-lg">
                  Automate your invoicing and inventory in seconds.
                </p>
                <Link href="/start-free-trial">
                  <button className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-full text-base font-bold hover:bg-blue-600 transition-colors">
                    Get Started Free
                  </button>
                </Link>
              </div>
              <div className="flex-1 w-full h-full flex items-center">
                <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner min-h-[200px] md:min-h-[240px]">
                  <Image
                    src="/image/desktop.png"
                    alt="Dashboard"
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;