"use client";
import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-screen sm:min-h-[90vh] flex items-center px-4 sm:px-6 md:px-10 lg:px-20 pb-20 sm:pb-32 pt-20 sm:pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">

        {/* Gradient Overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40  git 
                        bg-gradient-to-t from-slate-50/80 to-transparent 
                        pointer-events-none z-20"></div>

        {/* Professional Animated Background */}
        <style>{`
          @keyframes float-up-1 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-30px) translateX(10px); }
          }
          @keyframes float-up-2 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-40px) translateX(-15px); }
          }
          @keyframes float-up-3 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-25px) translateX(20px); }
          }
          @keyframes rotate-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .float-card-1 { animation: float-up-1 8s ease-in-out infinite; }
          .float-card-2 { animation: float-up-2 10s ease-in-out infinite 1s; }
          .float-card-3 { animation: float-up-3 9s ease-in-out infinite 0.5s; }
          .rotate-icon { animation: rotate-slow 20s linear infinite; }
          
          @media (max-width: 640px) {
            .float-card-1, .float-card-2, .float-card-3 { opacity: 0.08 !important; }
          }
        `}</style>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          
          {/* Floating Card 1 - Invoice */}
          <div className="absolute top-10 sm:top-20 left-2 sm:left-10 w-24 sm:w-32 h-28 sm:h-40 float-card-1 opacity-10 sm:opacity-15 hidden sm:block">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-2 sm:p-4 h-full shadow-xl">
              <div className="w-full h-1 bg-white/30 rounded mb-2 sm:mb-3"></div>
              <div className="w-3/4 h-1 bg-white/20 rounded mb-1 sm:mb-2"></div>
              <div className="w-full h-1 bg-white/20 rounded mb-2 sm:mb-4"></div>
              <div className="w-full h-8 sm:h-12 bg-white/15 rounded"></div>
              <div className="mt-2 sm:mt-4 flex gap-1 sm:gap-2">
                <div className="flex-1 h-2 bg-white/15 rounded"></div>
                <div className="flex-1 h-2 bg-white/15 rounded"></div>
              </div>
            </div>
          </div>

          {/* Floating Card 2 - Analytics */}
          <div className="absolute top-20 sm:top-32 right-1 sm:right-12 w-28 sm:w-36 h-28 sm:h-36 float-card-2 opacity-10 sm:opacity-12 hidden sm:block">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-2 sm:p-4 h-full shadow-xl flex flex-col justify-center items-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-white/30 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-white/20 rounded-full rotate-icon"></div>
              </div>
              <div className="w-12 sm:w-16 h-1 bg-white/20 rounded"></div>
            </div>
          </div>

          {/* Floating Card 3 - Security */}
          <div className="absolute bottom-24 sm:bottom-32 left-1/4 w-24 sm:w-32 h-28 sm:h-40 float-card-3 opacity-10 sm:opacity-14 hidden sm:block">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-2 sm:p-4 h-full shadow-xl">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/25 rounded-xl mx-auto mb-2 sm:mb-4"></div>
              <div className="w-full h-1 bg-white/20 rounded mb-2 sm:mb-3"></div>
              <div className="w-5/6 h-1 bg-white/15 rounded mb-2 sm:mb-4"></div>
              <div className="space-y-1 sm:space-y-2">
                <div className="h-1 bg-white/15 rounded"></div>
                <div className="h-1 bg-white/15 rounded w-4/5"></div>
              </div>
            </div>
          </div>

          {/* Floating Card 4 - GST Badge */}
          <div className="absolute bottom-16 sm:bottom-20 right-3 sm:right-16 w-20 sm:w-28 h-20 sm:h-28 float-card-1 opacity-10 sm:opacity-16 hidden sm:block">
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-full h-full shadow-lg flex items-center justify-center">
              <div className="text-white font-bold text-lg sm:text-2xl">GST</div>
            </div>
          </div>

        </div>

        {/* Main Content */}
        <div className="relative z-30 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] font-extrabold text-slate-900 leading-tight mb-6 sm:mb-8 tracking-tight animate-fadeInUp">
              GST Billing Software for Small Businesses in India
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-8 sm:mb-10 max-w-[550px] mx-auto lg:mx-0 animate-fadeInUp" style={{animationDelay: "0.2s"}}>
              Manage your business professionally with Vyapar, India's leading small business software for billing, inventory, and accounting. Join 1 Cr+ satisfied SMEs in India who trust Vyapar.
            </p>
            <button className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-sm sm:text-lg font-semibold shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(59,130,246,0.4)] animate-fadeInUp w-full sm:w-auto" style={{animationDelay: "0.4s"}}>
              Download Vyapar Now!
            </button>
          </div>

          {/* Hero Images Container */}
          <div className="flex-1 relative min-h-[250px] sm:min-h-[350px] md:min-h-[500px] w-full max-w-[600px]">
            
            {/* Laptop Mockup */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-t-[12px] sm:rounded-t-[20px] p-1 sm:p-2 shadow-2xl z-10 animate-fadeInUp" style={{animationDelay: "0.3s"}}>
              <div className="w-full h-full bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden">
                <div className="h-6 sm:h-8 bg-slate-700 flex items-center px-2 sm:px-4 gap-1 sm:gap-2">
                  <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-500"></span>
                  <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-amber-500"></span>
                  <span className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-emerald-500"></span>
                </div>
                
                {/* Desktop Image */}
                <div className="relative w-full h-[150px] sm:h-[250px] md:h-[350px] bg-slate-800 overflow-hidden">
                  <Image
                    src="/image/dekstop.png"
                    alt="Dekstop Interface"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                    priority={true}
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[100px] sm:w-[150px] md:w-[200px] h-2 bg-slate-700 rounded-b-lg sm:rounded-b-xl"></div>
            </div>

            {/* Phone Mockup */}
            <div className="absolute -left-3 sm:-left-4 md:-left-8 -bottom-4 sm:-bottom-5 w-[80px] sm:w-[100px] md:w-[130px] h-[160px] sm:h-[200px] md:h-[280px] bg-slate-800 rounded-[20px] sm:rounded-[30px] p-1 shadow-xl z-20 hidden sm:block animate-fadeInUp" style={{animationDelay: "0.45s"}}>
              <div className="w-full h-full bg-slate-900 rounded-[18px] sm:rounded-[25px] overflow-hidden relative">
                
                {/* Mobile Image */}
                <Image
                  src="/image/mobail.png"
                  alt="Mobail Interface"
                  fill
                  sizes="(max-width: 768px) 100vw, 130px"
                  className="object-cover w-full h-full rounded-[15px] sm:rounded-[20px]"
                  priority={true}
                />
              </div>
            </div>

            {/* Floating Badges with Animations */}
            <div className="absolute top-[15%] -right-2 sm:-right-4 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg border border-blue-100 text-blue-600 z-30 hidden md:block animate-bounce">
              ✨ Easy to Use
            </div>
            <div className="absolute bottom-[35%] right-2 sm:right-4 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg border border-purple-100 text-purple-600 z-30 hidden md:block animate-bounce" style={{animationDelay: "0.5s"}}>
              👥 Collaborative
            </div>
            <div className="absolute top-[35%] -left-2 sm:-left-4 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg border border-emerald-100 text-emerald-600 z-30 hidden md:block animate-bounce" style={{animationDelay: "1s"}}>
              📊 Activity Stream
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPERB FEATURES SECTION ===== */}
      <section className="relative -mt-8 sm:-mt-12 max-w-[1100px] mx-auto z-10 px-4 sm:px-6">

        {/* Dark Pocket Card with Ultra Animated Background */}
        <div className="relative
                        bg-[#0f172a] 
                        rounded-[30px_30px_20px_20px] sm:rounded-[40px_40px_30px_30px]
                        pt-[20px] sm:pt-[30px] pb-[5px] px-[20px] sm:px-[40px]
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
            <div className="absolute -top-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 
                            bg-gradient-to-br from-blue-500/30 to-blue-600/20 
                            rounded-full blur-3xl blob-float-dark-1 glow-pulse-dark"></div>
            
            {/* Blob 2 - Purple */}
            <div className="absolute -bottom-32 -right-40 w-72 sm:w-96 h-72 sm:h-96 
                            bg-gradient-to-br from-purple-500/30 to-purple-600/20 
                            rounded-full blur-3xl blob-float-dark-2 glow-pulse-dark"></div>
            
            {/* Blob 3 - Cyan */}
            <div className="absolute top-1/3 right-1/4 w-56 sm:w-72 h-56 sm:h-72 
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
          <div className="absolute -top-5 left-[15px] right-[15px] sm:left-[30px] sm:right-[30px] h-[40px] 
                          bg-[rgba(15,23,42,0.3)] blur-[15px] 
                          rounded-full -z-10" />

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-[42px] font-bold text-white text-center mb-[20px] sm:mb-[30px] relative z-20 px-2">
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
          <div className="flex justify-center gap-2 sm:gap-[20px] mb-[30px] sm:mb-[50px] flex-wrap relative z-20 px-2">
            {["Easy to Use","Collaborative","Activity Stream"].map((pill)=>(
              <span key={pill}
                className="px-[16px] sm:px-[32px] py-[10px] sm:py-[14px]
                           bg-white/10 backdrop-blur-sm
                           border border-white/20
                           rounded-full
                           text-white font-semibold text-[12px] sm:text-[16px]
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
          <div className="group relative top-[20px] sm:top-[40px]
                         min-h-[400px] sm:min-h-[500px]
                          bg-white
                          rounded-[30px_30px_20px_20px] sm:rounded-[40px_40px_30px_30px]
                         p-[12px] sm:p-[16px]
                          border border-white/80
                          shadow-[0_-10px_30px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.15)]
                          transition-transform duration-300
                          hover:-translate-y-[5px]
                          z-30">

            {/* Mini Navbar */}
            <div className="flex justify-between items-center
                            mb-[20px] sm:mb-[30px] pb-[15px] sm:pb-[20px]
                            border-b border-[#e2e8f0]">

              <div className="flex items-center gap-2">
                <div className="w-[28px] sm:w-[35px] h-[28px] sm:h-[35px]
                                bg-gradient-to-br from-blue-500 to-purple-500
                                text-white flex items-center justify-center
                                rounded-[6px] sm:rounded-[8px] font-bold text-[14px] sm:text-[18px]">
                  V
                </div>
                <span className="text-[#1e293b] font-bold text-[14px] sm:text-[16px]">
                  Vyapar
                </span>
              </div>

              <div className="hidden md:flex gap-[25px]">
                <span className="text-[#64748b] text-[14px] font-medium hover:text-blue-500 transition-colors">Features</span>
                <span className="text-[#64748b] text-[14px] font-medium hover:text-blue-500 transition-colors">Pricing</span>
                <span className="text-[#64748b] text-[14px] font-medium hover:text-blue-500 transition-colors">About</span>
              </div>
            </div>

            {/* Mini Hero */}
            <div className="flex flex-col sm:flex-row items-center gap-[20px] sm:gap-[30px]">

              <div className="flex-1">
                <h3 className="text-[18px] sm:text-[24px] font-extrabold text-[#0f172a] mb-[8px] sm:mb-[10px]">
                  GST Billing Software
                </h3>

                <p className="text-[12px] sm:text-[14px] text-[#475569] mb-[15px] sm:mb-[20px] leading-[1.5]">
                  Manage your business professionally
                </p>

                <button className="px-[16px] sm:px-[22px] py-[6px] sm:py-[8px]
                                   bg-gradient-to-r from-blue-500 to-purple-500
                                   text-white rounded-[30px]
                                   text-[11px] sm:text-[13px] font-semibold
                                   shadow-[0_4px_10px_rgba(59,130,246,0.3)]
                                   w-full sm:w-auto">
                  Download Now
                </button>
              </div>

              {/* Mini Mockup */}
              <div className="flex-1 relative min-h-[100px] sm:min-h-[120px] w-full sm:w-auto">

                <div className="w-[140px] sm:w-[200px] h-[70px] sm:h-[100px]
                                bg-[#1e293b]
                                rounded-t-[8px] sm:rounded-t-[12px]
                                p-[3px] sm:p-[5px]
                                shadow-[0_10px_20px_rgba(0,0,0,0.1)]
                                mx-auto sm:mx-0">

                  <div className="w-full h-full bg-[#0f172a] rounded-[6px] sm:rounded-[8px] overflow-hidden">

                    <div className="h-[12px] sm:h-[16px] bg-[#334155] flex items-center px-[6px] sm:px-[8px] gap-[3px] sm:gap-[4px]">
                      <div className="w-[4px] sm:w-[6px] h-[4px] sm:h-[6px] bg-red-500 rounded-full"></div>
                      <div className="w-[4px] sm:w-[6px] h-[4px] sm:h-[6px] bg-amber-500 rounded-full"></div>
                      <div className="w-[4px] sm:w-[6px] h-[4px] sm:h-[6px] bg-emerald-500 rounded-full"></div>
                    </div>

                    <div className="h-[28px] sm:h-[40px] m-[6px] sm:m-[8px]
                                    bg-gradient-to-r from-blue-500 to-purple-500
                                    opacity-30 rounded-[3px] sm:rounded-[4px]"></div>
                  </div>
                </div>

                {/* Floating Labels */}
                <div className="absolute -top-[8px] sm:-top-[10px] right-[10px] sm:right-[20px]
                                px-[8px] sm:px-[10px] py-[3px] sm:py-[4px]
                                bg-white rounded-[20px]
                                text-[8px] sm:text-[10px] font-semibold text-[#1e293b]
                                border border-[#e2e8f0]
                                shadow-[0_3px_8px_rgba(0,0,0,0.1)] whitespace-nowrap">
                  Inventory
                </div>

                <div className="absolute bottom-[15px] sm:bottom-[20px] right-0
                                px-[8px] sm:px-[10px] py-[3px] sm:py-[4px]
                                bg-white rounded-[20px]
                                text-[8px] sm:text-[10px] font-semibold text-[#1e293b]
                                border border-[#e2e8f0]
                                shadow-[0_3px_8px_rgba(0,0,0,0.1)] whitespace-nowrap">
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