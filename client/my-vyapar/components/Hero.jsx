"use client";
import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-screen md:min-h-[90vh] flex items-center px-4 sm:px-5 md:px-20 pb-16 sm:pb-32 pt-6 sm:pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">

        {/* GST Fading Icons Background - IMPROVED VISIBILITY */}
        <style>{`
          @keyframes fade-gst-icon-1 {
            0%, 100% { opacity: 0.05; transform: translate(0, 0) scale(0.9); }
            50% { opacity: 0.35; transform: translate(20px, -20px) scale(1.1); }
          }
          @keyframes fade-gst-icon-2 {
            0%, 100% { opacity: 0.04; transform: translate(0, 0) scale(0.9); }
            50% { opacity: 0.32; transform: translate(-30px, 30px) scale(1.1); }
          }
          @keyframes fade-gst-icon-3 {
            0%, 100% { opacity: 0.05; transform: translate(0, 0) scale(0.9); }
            50% { opacity: 0.35; transform: translate(40px, 20px) scale(1.1); }
          }
          @keyframes fade-gst-icon-4 {
            0%, 100% { opacity: 0.045; transform: translate(0, 0) scale(0.9); }
            50% { opacity: 0.33; transform: translate(-20px, -40px) scale(1.1); }
          }
          @keyframes fade-gst-icon-5 {
            0%, 100% { opacity: 0.048; transform: translate(0, 0) scale(0.9); }
            50% { opacity: 0.34; transform: translate(25px, 35px) scale(1.1); }
          }
          @keyframes fade-gst-icon-6 {
            0%, 100% { opacity: 0.04; transform: translate(0, 0) scale(0.9); }
            50% { opacity: 0.32; transform: translate(-35px, -25px) scale(1.1); }
          }
          .fade-gst-1 { animation: fade-gst-icon-1 10s ease-in-out infinite; }
          .fade-gst-2 { animation: fade-gst-icon-2 12s ease-in-out infinite 1s; }
          .fade-gst-3 { animation: fade-gst-icon-3 11s ease-in-out infinite 2s; }
          .fade-gst-4 { animation: fade-gst-icon-4 13s ease-in-out infinite 0.5s; }
          .fade-gst-5 { animation: fade-gst-icon-5 14s ease-in-out infinite 1.5s; }
          .fade-gst-6 { animation: fade-gst-icon-6 12.5s ease-in-out infinite 2.5s; }
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
    

        {/* Main Content */}
        <div className="relative z-30 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-16">
          
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-tight mb-6 sm:mb-8 tracking-tight animate-fadeInUp">
              GST Billing Software for Small Businesses in India
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-10 max-w-[550px] mx-auto lg:mx-0 animate-fadeInUp" style={{animationDelay: "0.2s"}}>
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
          <div className="flex-1 relative min-h-[250px] sm:min-h-[350px] md:min-h-[500px] w-full max-w-[600px]">
            
            {/* Laptop Mockup */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-t-[15px] sm:rounded-t-[20px] p-1.5 sm:p-2 shadow-2xl z-10 animate-fadeInUp" style={{animationDelay: "0.3s"}}>
              <div className="w-full h-full bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden">
                <div className="h-6 sm:h-8 bg-slate-700 flex items-center px-3 sm:px-4 gap-2">
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
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full"
                    priority={true}
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-[100px] sm:w-[150px] md:w-[200px] h-2 sm:h-3 bg-slate-700 rounded-b-lg sm:rounded-b-xl"></div>
            </div>

            {/* Phone Mockup */}
            <div className="absolute -left-2 sm:-left-4 md:-left-8 -bottom-3 sm:-bottom-5 w-[70px] sm:w-[100px] md:w-[130px] h-[140px] sm:h-[200px] md:h-[280px] bg-slate-800 rounded-[20px] sm:rounded-[30px] p-1 sm:p-1.5 shadow-xl z-20 hidden sm:block animate-fadeInUp" style={{animationDelay: "0.45s"}}>
              <div className="w-full h-full bg-slate-900 rounded-[16px] sm:rounded-[25px] overflow-hidden relative">
                
                {/* Mobile Image */}
                <Image
                  src="/image/mobail.png"
                  alt="Mobail Interface"
                  fill
                  sizes="(max-width: 640px) 70px, (max-width: 768px) 100px, 130px"
                  className="object-cover w-full h-full rounded-[15px] sm:rounded-[20px]"
                  priority={true}
                />
              </div>
            </div>

            {/* Floating Badges with Animations */}
            <div className="absolute top-[15%] -right-2 sm:-right-4 bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg border border-blue-100 text-blue-600 z-30 hidden md:block animate-bounce">
              ✨ Easy to Use
            </div>
            <div className="absolute bottom-[35%] right-1 sm:right-4 bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg border border-purple-100 text-purple-600 z-30 hidden md:block animate-bounce" style={{animationDelay: "0.5s"}}>
              👥 Collaborative
            </div>
            <div className="absolute top-[35%] -left-2 sm:-left-4 bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg border border-emerald-100 text-emerald-600 z-30 hidden md:block animate-bounce" style={{animationDelay: "1s"}}>
              📊 Activity Stream
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPERB FEATURES SECTION ===== */}
      <section className="relative -mt-12 max-w-full mx-auto z-10 px-4 sm:px-6 md:px-8 lg:px-10">

        {/* Dark Card Container */}
        <div className="relative bg-[#0f172a] rounded-2xl sm:rounded-3xl md:rounded-4xl pt-8 sm:pt-12 md:pt-16 pb-0 px-6 sm:px-10 md:px-16 max-w-[1200px] mx-auto shadow-2xl border border-white/10 overflow-hidden">

          {/* Background Animations */}
          <style>{`
        @keyframes floatIcons {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(8deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

.float-icon {
  font-size: 48px;
  animation: floatIcons 8s ease-in-out infinite;
}

.delay-2 {
  animation-delay: 2s;
}

.delay-3 {
  animation-delay: 3s;
}

.delay-4 {
  animation-delay: 4s;
}

.delay-5 {
  animation-delay: 5s;
}
          `}</style>

          {/* Animated Blob Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-full blur-3xl blob-float-dark-1 glow-pulse-dark"></div>
            <div className="absolute -bottom-32 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-full blur-3xl blob-float-dark-2 glow-pulse-dark"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-cyan-500/25 to-cyan-600/15 rounded-full blur-3xl blob-float-dark-3 glow-pulse-dark"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-slow-dark"></div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)] opacity-40"></div>
          </div>

          {/* Blur Glow */}
          <div className="absolute -top-5 left-6 right-6 sm:left-10 sm:right-10 h-10 bg-[rgba(15,23,42,0.3)] blur-2xl rounded-full -z-10"></div>

          {/* Title */}
          <div className="relative z-20 text-center mb-6 sm:mb-8 md:mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              We made it{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                superb
              </span>
              {" "}& usability
            </h2>
          </div>

          {/* Pills */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16 flex-wrap relative z-20 px-4">
            {["Easy to Use", "Collaborative", "Activity Stream"].map((pill) => (
              <span
                key={pill}
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:-translate-y-1"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* White Card - Dashboard Section */}
          <div className="relative z-20 bg-white rounded-2xl sm:rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl">
            
            {/* Card Content */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-14">
              
              {/* Header/Navbar */}
              <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">
                    V
                  </div>
                  <span className="text-gray-900 font-bold text-sm sm:text-base md:text-lg">Vyapar</span>
                </div>

                <div className="hidden md:flex gap-6 lg:gap-10">
                  <span className="text-gray-600 text-sm font-medium cursor-pointer hover:text-blue-600 transition">Features</span>
                  <span className="text-gray-600 text-sm font-medium cursor-pointer hover:text-blue-600 transition">Pricing</span>
                  <span className="text-gray-600 text-sm font-medium cursor-pointer hover:text-blue-600 transition">About</span>
                </div>
              </div>

              {/* Main Content - Flex */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
                
                {/* Left - Text Content */}
                <div className="flex-1 w-full">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5">
                    GST Billing Software for Small Businesses in India
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
                    Manage your business professionally with Vyapar. Create invoices, track inventory, and handle accounting effortlessly with India's #1 billing software.
                  </p>

                  <button className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto">
                    Download Now
                  </button>
                </div>

                {/* Right - Dashboard Screenshot */}
                <div className="flex-1 w-full hidden sm:block">
                  <div className="relative bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/image/dekstop.png"
                      alt="GST Billing Software Dashboard"
                      width={600}
                      height={400}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Screenshot - Shows on mobile only */}
              <div className="block sm:hidden w-full mt-6">
                <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/image/dekstop.png"
                    alt="GST Billing Software Dashboard"
                    width={400}
                    height={250}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Spacing */}
          <div className="h-8 sm:h-12 md:h-16"></div>

        </div>

        {/* Dotted Background */}
        <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] bg-[size:25px_25px]"></div>

      </section>
    </div>
  );
};

export default Hero;