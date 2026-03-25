"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../components/Container";

const Hero = () => {
  const [screenState, setScreenState] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setScreenState(1);
    }, 100);

    const timer2 = setTimeout(() => {
      setScreenState(2);
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-[100vh] flex items-center sm:pb-32 sm:pt-10 lg:pb-20 lg:pt-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">
        <style>{`
          @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          @keyframes custom-bounce { 
            0%, 100% { transform: translateY(0); } 
            50% { transform: translateY(-15px); } 
          }
          
          @keyframes flightInPC {
            0% { 
              opacity: 0; 
              transform: translateY(-150px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0);
            }
          }
          
          @keyframes flightInPhone {
            0% { 
              opacity: 0; 
              transform: translateY(-200px) translateX(50px);
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) translateX(0);
            }
          }

          @media (max-width: 640px) {
            @keyframes flightInPC {
              0% { opacity: 0; transform: translateY(-100px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          }

          @keyframes textReveal {
            0% { opacity: 0; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          /* ===== SIMPLE BUTTON STYLES (NO ANIMATIONS) ===== */
          .btn-simple {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: white;
            font-weight: 700;
            border-radius: 50px;
            transition: all 0.2s ease;
            border: none;
            cursor: pointer;
            font-family: inherit;
            text-decoration: none;
          }
          
          /* Simple hover effect - just opacity and slight scale */
          .btn-simple:hover {
            transform: scale(1.02);
            opacity: 0.95;
          }
          
          .btn-simple:active {
            transform: scale(0.98);
          }
          
          /* Responsive sizes */
          .btn-simple {
            width: 220px;
            min-width: 180px;
            height: 52px;
            font-size: 14px;
            padding: 0 20px;
          }
          
          @media (min-width: 768px) and (max-width: 1023px) {
            .btn-simple {
              width: 240px;
              height: 58px;
              font-size: 15px;
            }
          }
          
          @media (min-width: 1024px) {
            .btn-simple {
              width: 260px;
              height: 64px;
              font-size: 16px;
            }
          }
          
          @media (min-width: 1400px) {
            .btn-simple {
              width: 280px;
              height: 68px;
              font-size: 17px;
            }
          }
          
          /* Simple flight animations */
          .flight-pc { 
            animation: flightInPC 0.8s ease-out forwards; 
          }
          .flight-phone { 
            animation: flightInPhone 0.9s ease-out 0.1s forwards; 
          }
          
          /* Badge animations - hidden on mobile, visible on larger screens */
          .heroic-slide-badge1, .heroic-slide-badge2, .heroic-slide-badge3 { 
            opacity: 0; 
          }
          
          @media (min-width: 768px) {
            .heroic-slide-badge1 { 
              animation: fadeInUp 1s ease-out 0.4s forwards, custom-bounce 3s ease-in-out 1.4s infinite; 
            }
            .heroic-slide-badge2 { 
              animation: fadeInUp 1s ease-out 0.6s forwards, custom-bounce 3.2s ease-in-out 1.6s infinite; 
            }
            .heroic-slide-badge3 { 
              animation: fadeInUp 1s ease-out 0.8s forwards, custom-bounce 2.8s ease-in-out 1.8s infinite; 
            }
          }
          
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
          .text-reveal { animation: textReveal 0.6s ease-out forwards; }
          .fade-in { animation: fadeIn 0.5s ease-out forwards; }
          
          /* FIX: Only adjust mobile model for 1024x600 screens */
          @media (min-width: 1024px) and (max-height: 600px) {
            .mobile-model-adjust {
              width: 70px !important;
              height: 140px !important;
            }
            .mobile-model-adjust .mobile-inner {
              border-radius: 12px !important;
            }
            .mobile-model-adjust .mobile-badge {
              font-size: 10px !important;
              width: 24px !important;
              height: 24px !important;
            }
          }
        `}</style>

        <Container size="default">
          <div className="relative z-30 w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-20">
            
            {/* --- TEXT CONTENT - Responsive for all screens --- */}
            <div className="flex-1 text-center lg:text-left px-4 sm:px-6 md:px-8 lg:px-0 w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-black text-[#0f172a] leading-[1.15] mb-4 md:mb-6 tracking-tight animate-fadeInUp max-w-[750px] mx-auto lg:mx-0">
                GST Billing Software for <span className="text-indigo-600 block sm:inline">Small Businesses in India</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed mb-8 md:mb-10 max-w-[650px] mx-auto lg:mx-0 px-2 sm:px-0 animate-fadeInUp">
                Manage your business professionally with Billora, India's leading
                small business software for billing, inventory, and accounting.
              </p>
              
              {/* SIMPLE BUTTONS - No complex animations */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center lg:justify-start items-center animate-fadeInUp">
                <Link 
                  href="/start-free-trial" 
                  className="btn-simple"
                >
                  Start Free Trial →
                </Link>
                <Link 
                  href="/bookdemo" 
                  className="btn-simple"
                >
                  Book Free Demo →
                </Link>
              </div>
            </div>

            {/* --- IMAGE CONTAINER --- */}
            <div className="flex-1 relative min-h-[100px] sm:min-h-[350px] md:min-h-[100px] w-full max-w-[550px] sm:max-w-[600px] md:max-w-[550px] lg:max-w-[700px] xl:max-w-[750px] mt-8 sm:mt-10 lg:mt-0 flex flex-col items-center px-4 sm:px-0">
              
              {/* PC Monitor Model - Responsive sizing */}
              <div className="relative w-full max-w-[500px] md:max-w-[400px] lg:max-w-full z-10 flight-pc mx-auto">
                {/* Monitor Screen */}
                <div className="relative aspect-[16/10] bg-slate-900 rounded-[12px] sm:rounded-[16px] md:rounded-[20px] p-1.5 sm:p-2 md:p-2.5 shadow-2xl border border-slate-700/50">
                  <div className="w-full h-full bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden relative shadow-inner">
                    {/* Top bar with dots - always visible */}
                    <div className="h-5 sm:h-6 md:h-7 bg-slate-700/50 flex items-center px-2 sm:px-3 md:px-4 gap-1 sm:gap-2 border-b border-slate-600/30">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500/60"></span>
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-500/60"></span>
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500/60"></span>
                    </div>
                    
                    {/* Screen Content with Loading States */}
                    <div className="absolute inset-0 top-5 sm:top-6 md:top-7 flex items-center justify-center bg-slate-800">
                      {screenState === 0 && (
                        <div className="w-full h-full bg-black"></div>
                      )}
                      
                      {screenState === 1 && (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <div className="text-reveal">
                            <span className="bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg text-2xl sm:text-3xl md:text-5xl font-bold shadow-xl inline-block">
                              B
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {screenState === 2 && (
                        <div className="w-full h-full fade-in">
                          <Image 
                            src="/image/desktop.png" 
                            alt="PC Dashboard" 
                            fill 
                            className="object-cover" 
                            priority 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* PC Stand - Responsive sizing */}
                <div className="relative w-10 sm:w-12 md:w-16 h-5 sm:h-6 md:h-8 bg-gradient-to-b from-slate-700 to-slate-800 mx-auto -mt-0.5 sm:-mt-1 shadow-lg"></div>
                <div className="relative w-24 sm:w-32 md:w-40 h-2 sm:h-2.5 md:h-3 bg-slate-800 rounded-t-lg sm:rounded-t-xl mx-auto shadow-2xl border-t border-slate-600"></div>
              </div>

              {/* Mobile Model - Original design for large screens, adjusted only for 1024x600 */}
              <div className="absolute left-0 xl:top-[50%] xl:left-3 sm:left-2 md:left-4 top-[30%] sm:top-[50%] md:top-[40%] lg:top-[40%] z-30 hidden sm:block flight-phone mobile-model-adjust"
                style={{
                  width: '90px',
                  height: '200px',
                }}
              >
                <div className="relative w-full h-full bg-slate-800 rounded-[20px] p-1.5 shadow-2xl border border-slate-700 mobile-inner"
                  style={{
                    borderRadius: '20px',
                  }}
                >
                  <div className="w-full h-full bg-slate-900 rounded-[16px] overflow-hidden relative border-2 border-slate-800">
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      {screenState === 0 && (
                        <div className="w-full h-full bg-black"></div>
                      )}
                      
                      {screenState === 1 && (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <div className="text-reveal">
                            <span className="bg-blue-600 text-white w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center shadow-lg mobile-badge">
                              B
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {screenState === 2 && (
                        <div className="w-full h-full fade-in relative">
                          <Image 
                            src="/image/Mobile.png" 
                            alt="Mobile App" 
                            fill 
                            className="object-cover"
                            sizes="90px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges - Keep as is */}
              <div className="absolute top-[5%] md:top-[8%] lg:top-[10%] -right-2 md:-right-3 lg:-right-4 bg-white px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-xl border border-blue-100 text-blue-600 z-40 hidden md:block heroic-slide-badge1">
                ✨ Easy to Use
              </div>
              <div className="absolute bottom-[30%] md:bottom-[32%] lg:bottom-[49%] -right-4 md:-right-6 lg:-right-4 bg-white px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-xl border border-purple-100 text-purple-600 z-40 hidden md:block heroic-slide-badge2">
                👥 Collaborative
              </div>
              <div className="absolute top-[35%] md:top-[38%] lg:top-[20%] -left-8 md:-left-10 lg:-left-12 bg-white px-3 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-xl border border-emerald-100 text-emerald-600 z-40 hidden md:block heroic-slide-badge3">
                📊 Activity Stream
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- SUPERB FEATURES SECTION - Keep as is --- */}
      <section className="relative hidden md:block lg:w-[92%] md:w-[85%] -mt-10 sm:-mt-20 md:-mt-28 lg:-mt-20 w-full mx-auto z-50 px-4 md:px-0 mb-32 sm:mb-40 md:mb-48">
        <div className="relative bg-[#0f172a] rounded-[24px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[45px] pt-[60px] sm:pt-[80px] md:pt-[100px] lg:pt-[110px] pb-[80px] sm:pb-[90px] md:pb-[100px] lg:pb-[110px] max-w-[90%] sm:max-w-[85%] md:max-w-[1100px] lg:max-w-[1200px] mx-auto shadow-2xl border border-white/10 overflow-visible"
          style={{ 
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", 
            backgroundSize: "20px 20px sm:24px 24px" 
          }}>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <h2 className="text-2xl sm:text-3xl md:text-[42px] bottom-20 font-bold text-white text-center mb-6 sm:mb-7 md:mb-6 relative z-20 leading-tight px-4">
            We made it <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">superb</span> & usable
          </h2>

          <div className="flex justify-center bottom-25 gap-2 sm:gap-3 md:gap-5 mb-8 sm:mb-10 md:mb-12 flex-wrap relative z-20 px-4">
            {["Easy to Use", "Collaborative", "Activity Stream"].map((pill) => (
              <span key={pill} className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white/90 font-medium text-xs sm:text-sm md:text-sm">
                {pill}
              </span>
            ))} 
          </div> 

          {/* Floating CTA Card - Keep as is */}
          <div className="group absolute hidden md:block xl:-bottom-30 lg:-bottom-20 md:-bottom-15 left-1/2 -translate-x-1/2 w-[95%] sm:w-[92%] md:w-[90%] bg-white rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-6 lg:p-10 border border-slate-200 shadow-2xl z-50 transition-transform duration-500 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-7 md:gap-8 lg:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-3 sm:mb-4 justify-center md:justify-start">
                  <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">B</div>
                  <span className="font-bold text-slate-800 text-base sm:text-lg md:text-lg">Billora Premium</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1 sm:mb-2">GST Billing Software</h3>
                <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-5 md:mb-6">Automate your invoicing and inventory in seconds.</p>
                <Link href="/start-free-trial" className="block w-full md:w-auto">
                  <span className="w-full md:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 bg-slate-900 text-white rounded-full text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors inline-block text-center">
                    Get Started Free
                  </span>
                </Link>
              </div>
              <div className="flex-1 w-full">
                <div className="w-full aspect-video bg-slate-100 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <Image 
                    src="/image/desktop.png" 
                    alt="Dashboard" 
                    width={500} 
                    height={300} 
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
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