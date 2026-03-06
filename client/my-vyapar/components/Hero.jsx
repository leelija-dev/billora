"use client";
import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-[90vh] flex items-center px-5 md:px-20 pb-32 pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">
        
        {/* Ultra Animated Background */}
        <style>{`
          @keyframes float-blob-1 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(40px, -50px) scale(1.1); }
            50% { transform: translate(-30px, 40px) scale(0.95); }
            75% { transform: translate(50px, 30px) scale(1.05); }
          }
          @keyframes float-blob-2 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(-40px, 50px) scale(0.95); }
            50% { transform: translate(35px, -45px) scale(1.1); }
            75% { transform: translate(-45px, -35px) scale(1.05); }
          }
          @keyframes float-blob-3 {
            0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
            25% { transform: translate(50px, 25px) rotate(90deg); }
            50% { transform: translate(-40px, -50px) rotate(180deg); }
            75% { transform: translate(30px, -40px) rotate(270deg); }
          }
          @keyframes float-blob-4 {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(-50px, -30px) scale(1.15); }
            66% { transform: translate(45px, 45px) scale(0.9); }
          }
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.25; filter: blur(40px); }
            50% { opacity: 0.5; filter: blur(50px); }
          }
          @keyframes rotate-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .blob-float-1 { animation: float-blob-1 12s ease-in-out infinite; }
          .blob-float-2 { animation: float-blob-2 14s ease-in-out infinite 1s; }
          .blob-float-3 { animation: float-blob-3 16s ease-in-out infinite 2s; }
          .blob-float-4 { animation: float-blob-4 18s ease-in-out infinite 1.5s; }
          .glow-pulse { animation: glow-pulse 6s ease-in-out infinite; }
          .rotate-slow { animation: rotate-slow 25s linear infinite; }
          .shimmer-bg { animation: shimmer 4s ease-in-out infinite; }
          .gradient-shift { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        `}</style>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          
          {/* Blob 1 - Blue */}
          <div className="absolute top-10 left-20 w-96 h-96 
                          bg-gradient-to-br from-blue-400/40 via-blue-500/30 to-blue-600/20 
                          rounded-full blur-3xl blob-float-1 glow-pulse"></div>
          
          {/* Blob 2 - Purple */}
          <div className="absolute bottom-20 right-40 w-80 h-80 
                          bg-gradient-to-br from-purple-400/40 via-purple-500/30 to-purple-600/20 
                          rounded-full blur-3xl blob-float-2 glow-pulse"></div>
          
          {/* Blob 3 - Cyan */}
          <div className="absolute top-1/2 right-20 w-72 h-72 
                          bg-gradient-to-br from-cyan-400/35 via-cyan-500/25 to-cyan-600/15 
                          rounded-full blur-3xl blob-float-3 glow-pulse"></div>

          {/* Blob 4 - Indigo */}
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 
                          bg-gradient-to-br from-indigo-400/35 via-indigo-500/25 to-indigo-600/15 
                          rounded-full blur-3xl blob-float-4 glow-pulse"></div>

          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 
                          bg-gradient-to-r from-blue-200/10 via-purple-200/10 to-cyan-200/10 
                          gradient-shift opacity-60"></div>

          {/* Rotating Ring */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute inset-0 rounded-full 
                            border-2 border-transparent 
                            bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 
                            rotate-slow"
                 style={{borderImage: "linear-gradient(90deg, rgba(59,130,246,0.3), rgba(168,85,247,0.3), rgba(34,211,238,0.3)) 1"}}></div>
          </div>

          {/* Shimmer Lines */}
          <div className="absolute top-0 left-0 right-0 h-0.5 
                          bg-gradient-to-r from-transparent via-blue-300 to-transparent 
                          shimmer-bg"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 
                          bg-gradient-to-r from-transparent via-purple-300 to-transparent 
                          shimmer-bg" style={{animationDelay: "2s"}}></div>

          {/* Animated Grid Particles - FIXED */}
          {[...Array(15)].map((_, i) => (
            <div key={i} 
              className="absolute w-1 h-1 bg-blue-300/30 rounded-full shimmer-bg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`
              }}></div>
          ))}
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
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 max-w-[550px] mx-auto lg:mx-0 animate-fadeInUp" style={{animationDelay: "0.2s"}}>
              Manage your business professionally with Vyapar, India's leading small business software for billing, inventory, and accounting. Join 1 Cr+ satisfied SMEs in India who trust Vyapar.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-lg font-semibold shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(59,130,246,0.4)] animate-fadeInUp" style={{animationDelay: "0.4s"}}>
              Download Vyapar Now!
            </button>
          </div>

          {/* Hero Images Container */}
          <div className="flex-1 relative min-h-[350px] md:min-h-[500px] w-full max-w-[600px]">
            
            {/* Laptop Mockup */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-t-[20px] p-2 shadow-2xl z-10 animate-fadeInUp" style={{animationDelay: "0.3s"}}>
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
            <div className="absolute -left-4 md:-left-8 -bottom-5 w-[100px] md:w-[130px] h-[200px] md:h-[280px] bg-slate-800 rounded-[30px] p-1.5 shadow-xl z-20 hidden sm:block animate-fadeInUp" style={{animationDelay: "0.45s"}}>
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

            {/* Floating Badges with Animations */}
            <div className="absolute top-[20%] -right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-blue-100 text-blue-600 z-30 hidden md:block animate-bounce">
              ✨ Easy to Use
            </div>
            <div className="absolute bottom-[40%] right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-purple-100 text-purple-600 z-30 hidden md:block animate-bounce" style={{animationDelay: "0.5s"}}>
              👥 Collaborative
            </div>
            <div className="absolute top-[40%] -left-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-emerald-100 text-emerald-600 z-30 hidden md:block animate-bounce" style={{animationDelay: "1s"}}>
              📊 Activity Stream
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPERB FEATURES SECTION ===== */}
      <section className="relative -mt-12 max-w-[1100px] mx-auto z-10">

        {/* Dark Pocket Card with Ultra Animated Background */}
        <div className="relative
                        bg-[#0f172a] 
                        rounded-[40px_40px_30px_30px]
                        pt-[30px] pb-[5px] px-[40px] 
                        max-w-[900px] mx-auto
                        shadow-[0_20px_30px_rgba(0,0,0,0.3)]
                        border border-white/10
                        overflow-hidden">

          {/* Ultra Animated Background Styles */}
          <style>{`
            @keyframes float-blob-dark-1 {
              0%, 100% { transform: translate(0px, 0px); }
              25% { transform: translate(30px, -30px); }
              50% { transform: translate(-20px, 20px); }
              75% { transform: translate(25px, 15px); }
            }
            @keyframes float-blob-dark-2 {
              0%, 100% { transform: translate(0px, 0px); }
              25% { transform: translate(-25px, 35px); }
              50% { transform: translate(20px, -25px); }
              75% { transform: translate(-15px, -20px); }
            }
            @keyframes float-blob-dark-3 {
              0%, 100% { transform: translate(0px, 0px); }
              25% { transform: translate(20px, 20px); }
              50% { transform: translate(-30px, -15px); }
              75% { transform: translate(15px, -30px); }
            }
            @keyframes glow-pulse-dark {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.6; }
            }
            @keyframes rotate-slow-dark {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .blob-float-dark-1 { animation: float-blob-dark-1 8s ease-in-out infinite; }
            .blob-float-dark-2 { animation: float-blob-dark-2 10s ease-in-out infinite 1s; }
            .blob-float-dark-3 { animation: float-blob-dark-3 12s ease-in-out infinite 2s; }
            .glow-pulse-dark { animation: glow-pulse-dark 4s ease-in-out infinite; }
            .rotate-slow-dark { animation: rotate-slow-dark 20s linear infinite; }
          `}</style>

          {/* Animated Blob Background Elements */}
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

          {/* Blur Glow Top */}
          <div className="absolute -top-5 left-[30px] right-[30px] h-[40px] 
                          bg-[rgba(15,23,42,0.3)] blur-[15px] 
                          rounded-full -z-10" />

          {/* Title */}
          <h2 className="text-[42px] font-bold text-white text-center mb-[30px] relative z-20">
            We made it{" "}
            <span className="relative bg-gradient-to-r from-blue-500 to-purple-500 
                             bg-clip-text text-transparent">
              superb
              <span className="absolute left-0 -bottom-[5px] w-full h-[3px] 
                               bg-gradient-to-r from-blue-500 to-purple-500 
                               rounded-full opacity-30"></span>
            </span>{" "}
            & usability
          </h2>

          {/* Pills */}
          <div className="flex justify-center gap-[20px] mb-[50px] flex-wrap relative z-20">
            {["Easy to Use","Collaborative","Activity Stream"].map((pill)=>(
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

          {/* Mini White Card */}
          <div className="group relative top-[40px]
                         min-h-[500px]
                          bg-white
                          rounded-[40px_40px_30px_30px]
                         p-[16px]
                          border border-white/80
                          shadow-[0_-10px_30px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.15)]
                          transition-transform duration-300
                          hover:-translate-y-[5px]
                          z-30">

            {/* Mini Navbar */}
            <div className="flex justify-between items-center
                            mb-[30px] pb-[20px]
                            border-b border-[#e2e8f0]">

              <div className="flex items-center gap-2">
                <div className="w-[35px] h-[35px]
                                bg-gradient-to-br from-blue-500 to-purple-500
                                text-white flex items-center justify-center
                                rounded-[8px] font-bold text-[18px]">
                  B
                </div>
                <span className="text-[#1e293b] font-bold text-[16px]">
                  Billora
                </span>
              </div>

              <div className="hidden md:flex gap-[25px]">
                <span className="text-[#64748b] text-[14px] font-medium hover:text-blue-500 transition-colors">Features</span>
                <span className="text-[#64748b] text-[14px] font-medium hover:text-blue-500 transition-colors">Pricing</span>
                <span className="text-[#64748b] text-[14px] font-medium hover:text-blue-500 transition-colors">About</span>
              </div>
            </div>

            {/* Mini Hero */}
            <div className="flex items-center gap-[30px]">

              <div className="flex-1">
                <h3 className="text-[24px] font-extrabold text-[#0f172a] mb-[10px]">
                  GST Billing Software
                </h3>

                <p className="text-[14px] text-[#475569] mb-[20px] leading-[1.5]">
                  Manage your business professionally
                </p>

                <button className="px-[22px] py-[8px]
                                   bg-gradient-to-r from-blue-500 to-purple-500
                                   text-white rounded-[30px]
                                   text-[13px] font-semibold
                                   shadow-[0_4px_10px_rgba(59,130,246,0.3)]">
                  Download Now
                </button>
              </div>

              {/* Mini Mockup */}
              <div className="flex-1 relative min-h-[120px]">

                <div className="w-[200px] h-[100px]
                                bg-[#1e293b]
                                rounded-t-[12px]
                                p-[5px]
                                shadow-[0_10px_20px_rgba(0,0,0,0.1)]">

                  <div className="w-full h-full bg-[#0f172a] rounded-[8px] overflow-hidden">

                    <div className="h-[16px] bg-[#334155] flex items-center px-[8px] gap-[4px]">
                      <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
                      <div className="w-[6px] h-[6px] bg-amber-500 rounded-full"></div>
                      <div className="w-[6px] h-[6px] bg-emerald-500 rounded-full"></div>
                    </div>

                    <div className="h-[40px] m-[8px]
                                    bg-gradient-to-r from-blue-500 to-purple-500
                                    opacity-30 rounded-[4px]"></div>
                  </div>
                </div>

                {/* Floating Labels */}
                <div className="absolute -top-[10px] right-[20px]
                                px-[10px] py-[4px]
                                bg-white rounded-[20px]
                                text-[10px] font-semibold text-[#1e293b]
                                border border-[#e2e8f0]
                                shadow-[0_3px_8px_rgba(0,0,0,0.1)]">
                  Inventory
                </div>

                <div className="absolute bottom-[20px] right-0
                                px-[10px] py-[4px]
                                bg-white rounded-[20px]
                                text-[10px] font-semibold text-[#1e293b]
                                border border-[#e2e8f0]
                                shadow-[0_3px_8px_rgba(0,0,0,0.1)]">
                  GST Ready
                </div>

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