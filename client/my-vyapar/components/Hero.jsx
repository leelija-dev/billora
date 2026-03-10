"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-[90vh] flex items-center px-5 md:px-20 pb-32 pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">

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
        <div className="absolute bottom-0 left-0 right-0 h-40 
                        bg-gradient-to-t from-slate-50/80 to-transparent 
                        pointer-events-none z-20"></div>

        {/* Main Content */}
        <div className="relative z-30 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-tight mb-8 tracking-tight animate-fadeInUp">
              GST Billing Software for Small Businesses in India
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-10 max-w-[550px] mx-auto lg:mx-0 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              Manage your business professionally with Billora, India's leading small business software for billing, inventory, and accounting. Join 1 Cr+ satisfied SMEs in India who trust Billora.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">

              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md transition-all hover:-translate-y-1">
                Start Free Trial
              </button>

              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md transition-all hover:-translate-y-1">
                Book free demo
              </button>

            </div>
          </div>

          {/* Hero Images Container */}
          <div className="flex-1 relative min-h-[350px] md:min-h-[500px] w-full max-w-[600px]">

            {/* Laptop Mockup */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-t-[20px] p-2 shadow-2xl z-10 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
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

            {/* MOBILE BUTTONS (Visible only on Mobile, right below image) */}
            <div className="lg:hidden mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{animationDelay: "0.5s"}}>
              <Link href="/bookdemo" className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md text-center">
                Start Free Trial
              </Link>
              <Link href="/bookdemo" className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-full text-sm font-semibold shadow-sm text-center">
                Book free demo
              </Link>
            </div>

            {/* Phone Mockup */}
            <div className="absolute -left-4 md:-left-8 -bottom-5 w-[100px] md:w-[130px] h-[200px] md:h-[280px] bg-slate-800 rounded-[30px] p-1.5 shadow-xl z-20 hidden sm:block animate-fadeInUp" style={{ animationDelay: "0.45s" }}>
              <div className=" w-full h-full bg-slate-900 rounded-[25px] overflow-hidden relative">

                {/* Mobile Image */}
                <Image
                  src="/image/mobail.png"
                  alt="Mobail Interface"
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
            <div className="absolute bottom-[40%] right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-purple-100 text-purple-600 z-30 hidden md:block animate-bounce" style={{ animationDelay: "0.5s" }}>
              👥 Collaborative
            </div>
            <div className="absolute top-[40%] -left-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-emerald-100 text-emerald-600 z-30 hidden md:block animate-bounce" style={{ animationDelay: "1s" }}>
              📊 Activity Stream
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPERB FEATURES SECTION (BLACK CARD) ===== */}
      <section className="relative -mt-12 w-full mx-auto z-10 hidden md:block"> 
        <div className="relative bg-[#0f172a] rounded-[40px_40px_30px_30px] pt-[30px] pb-[5px] px-[40px] max-w-[900px] mx-auto shadow-2xl border border-white/10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">

            {/* Blob 1 - Blue */}
            <div className="absolute -top-40 -left-40 w-80 h-80 
                            bg-gradient-to-br from-blue-500/30 to-blue-600/20 
                            rounded-full blur-3xl blob-float-dark-1 glow-pulse-dark"></div>

            {/* Blob 2 - Purple */}
            <div className="absolute -bottom-32 -right-40 w-96 h-96 
                            bg-gradient-to-br from-purple-500/30 to-purple-600/20 
                            rounded-full blur-3xl blob-float-dark-2 glow-pulse-dark"></div>

            {/* Blob 3 - Cyan */}
            <div className="absolute top-1/3 right-1/4 w-72 h-72 
                            bg-gradient-to-br from-cyan-500/25 to-cyan-600/15 
                            rounded-full blur-3xl blob-float-dark-3 glow-pulse-dark"></div>

            {/* Additional Rotating Gradient Ring */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 
                              bg-gradient-to-r from-transparent via-blue-500/20 to-transparent 
                              rotate-slow-dark"></div>
            </div>

            {/* Animated Grid Background */}
            <div className="absolute inset-0 
                            bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]
                            opacity-40"></div>
          </div>

          <h2 className="text-[42px] font-bold text-white text-center mb-[30px] relative z-20">
            We made it <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">superb</span> & usability
          </h2>

          {/* Pills */}
          <div className="flex justify-center gap-[20px] mb-[50px] flex-wrap relative z-20">
            {["Easy to Use", "Collaborative", "Activity Stream"].map((pill) => (
              <span key={pill}
                className="px-[32px] py-[14px]
                           bg-white/10 backdrop-blur-sm
                           border border-white/20
                           rounded-full
                           text-white font-semibold text-[16px]
                           shadow-[0_5px_15px_rgba(0,0,0,0.2)]
                           transition-all duration-300
                           hover:bg-blue-500/30
                           hover:-translate-y-[3px]
                           hover:border-blue-500">
                {pill}
              </span>
            ))}
          </div>

          {/* Mini White Card Mockup */}
          <div className="group relative top-[40px] min-h-[500px] bg-white rounded-[40px_40px_30px_30px] p-[16px] border border-white/80 shadow-2xl z-30">
            <div className="flex justify-between items-center mb-[30px] pb-[20px] border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center rounded-lg font-bold">B</div>
                <span className="text-slate-800 font-bold">Billora</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">GST Billing Software</h3>
                <p className="text-slate-500 mb-4">Manage your business professionally.</p>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm font-semibold">Download Now</button>
              </div>
              <div className="flex-1 relative">
                <div className="w-full aspect-video bg-slate-900 rounded-lg p-2">
                   <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center text-white/20 font-bold">MOCKUP</div>
                </div>
                <div className="absolute -top-4 right-4 px-3 py-1 bg-white shadow-md border rounded-full text-[10px] font-bold">Inventory</div>
                <div className="absolute -bottom-4 right-0 px-3 py-1 bg-white shadow-md border rounded-full text-[10px] font-bold">GST Ready</div>
              </div>
        
            </div>
          </div>
       
        </div>
                      {/* Dotted Background */}
        <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none
                        bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)]
                        bg-[size:25px_25px]">
        </div>
      </section>
    </div>
  );
};

export default Hero;