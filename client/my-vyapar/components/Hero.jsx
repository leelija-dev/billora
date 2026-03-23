"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../components/Container";

const Hero = () => {
  const [screenState, setScreenState] = useState(0); // 0: blank black, 1: show Billora, 2: show images

  useEffect(() => {
    // Start sequence when component mounts
    const timer1 = setTimeout(() => {
      setScreenState(1); // Show Billora text after 100ms (during flight)
    }, 100);

    const timer2 = setTimeout(() => {
      setScreenState(2); // Show actual images after 1300ms (after flight completes)
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-[100vh] flex items-center pb-32 pt-10 lg:pb-20 lg:pt-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">
        <style>{`
          @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          @keyframes custom-bounce { 
            0%, 100% { transform: translateY(0); } 
            50% { transform: translateY(-15px); } 
          }
          
          /* Responsive flight animations - adjusted for all devices */
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

          /* Mobile-specific flight animation (simpler) */
          @media (max-width: 640px) {
            @keyframes flightInPC {
              0% { opacity: 0; transform: translateY(-100px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          }

          @keyframes liquid-flow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
          @keyframes pulse-glow {
            0% { box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.3); }
            50% { box-shadow: 0 10px 40px -5px rgba(99, 102, 241, 0.8); }
            100% { box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.3); }
          }

          /* Desktop-only animations (1024px and above) */
          @media (min-width: 1024px) {
            .liquid-btn-container {
              position: relative;
              width: 260px;
              height: 64px;
              border-radius: 50px;
              background: #fff;
              box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.3);
              padding: 3px;
              overflow: hidden;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .liquid-btn-container:hover {
              transform: scale(1.05);
              animation: pulse-glow 2s infinite;
            }
            .liquid-btn-container::before {
              content: "";
              position: absolute;
              width: 140%;
              height: 300%;
              background: conic-gradient(from 0deg, transparent 0%, #3b82f6 10%, #8b5cf6 20%, #10b981 30%, transparent 40%);
              animation: liquid-flow 3s linear infinite;
              transition: opacity 0.3s ease;
            }
            .liquid-btn-container:hover::before {
              opacity: 1.2;
              filter: brightness(1.2);
            }
            .billora-btn {
              position: relative;
              z-index: 2;
              width: 100%;
              height: 100%;
              border-radius: 50px;
              background: linear-gradient(135deg, #6366f1, #a855f7);
              color: white; 
              font-weight: 700; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              transition: all 0.3s ease;
            }
            .liquid-btn-container:hover .billora-btn {
              background: linear-gradient(135deg, #4f46e5, #9333ea);
              letter-spacing: 1px;
            }
          }

          /* Tablet styles (768px to 1023px) */
          @media (min-width: 768px) and (max-width: 1023px) {
            .liquid-btn-container {
              width: 240px;
              height: 58px;
              border-radius: 40px;
              background: linear-gradient(135deg, #6366f1, #a855f7);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            }
            .liquid-btn-container:active {
              transform: scale(0.98);
              opacity: 0.9;
            }
            .billora-btn {
              width: 100%;
              height: 100%;
              border-radius: 40px;
              background: transparent;
              color: white;
              font-weight: 700;
              font-size: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          /* Mobile styles (below 768px) */
          @media (max-width: 767px) {
            .liquid-btn-container {
              width: 220px;
              height: 52px;
              border-radius: 40px;
              background: linear-gradient(135deg, #6366f1, #a855f7);
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            }
            .liquid-btn-container:active {
              transform: scale(0.96);
              opacity: 0.9;
            }
            .billora-btn {
              width: 100%;
              height: 100%;
              border-radius: 40px;
              background: transparent;
              color: white;
              font-weight: 700;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          
          /* Simple flight animations - applied to all devices */
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
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-center lg:justify-start items-center animate-fadeInUp">
                <Link href="/start-free-trial" className="liquid-btn-container w-full sm:w-auto">
                  <button className="billora-btn">Start Free Trial →</button>
                </Link>
                <Link href="/bookdemo" className="liquid-btn-container w-full sm:w-auto">
                  <button className="billora-btn">Book Free Demo →</button>
                </Link>
              </div>
            </div>

            {/* --- IMAGE CONTAINER - Responsive sizing for all devices --- */}
            <div className="flex-1 relative min-h-[300px] sm:min-h-[350px] md:min-h-[100px] w-full max-w-[550px] sm:max-w-[600px] md:max-w-[550px] lg:max-w-[700px] xl:max-w-[750px] mt-8 sm:mt-10 lg:mt-0 flex flex-col items-center px-4 sm:px-0">
              
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
                      {/* State 0: Blank Black - During initial flight */}
                      {screenState === 0 && (
                        <div className="w-full h-full bg-black"></div>
                      )}
                      
                      {/* State 1: Blue B Logo Reveal - Appears during flight */}
                      {screenState === 1 && (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <div className="text-reveal">
                            <span className="bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg text-2xl sm:text-3xl md:text-5xl font-bold shadow-xl inline-block">
                              B
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* State 2: Actual Image - After flight completes */}
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

             <div className="absolute left-0 xl:top-[50%] xl:left-3 sm:left-2 md:left-4 top-[30%] sm:top-[50%] md:top-[40%] lg:top-[40%] w-[90px] sm:w-[105px] md:w-[80px] lg:w-[125px] h-[180px] sm:h-[210px] md:h-[160px] lg:h-[250px] bg-slate-800 rounded-[20px] sm:rounded-[25px] md:rounded-[20px] lg:rounded-[35px] p-1.5 sm:p-2 md:p-1.5 lg:p-2 shadow-2xl z-30 hidden sm:block flight-phone border border-slate-700">
  <div className="w-full h-full bg-slate-900 rounded-[16px] sm:rounded-[20px] md:rounded-[16px] lg:rounded-[30px] overflow-hidden relative border-2 border-slate-800">
    {/* Screen Content with Loading States */}
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
      {/* State 0: Blank Black */}
      {screenState === 0 && (
        <div className="w-full h-full bg-black"></div>
      )}
                    
                    {/* State 1: Blue B Logo Reveal */}
                    {screenState === 1 && (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <div className="text-reveal">
                          <span className="bg-blue-600 text-white w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 rounded-lg text-sm sm:text-lg md:text-2xl font-bold flex items-center justify-center shadow-lg">
                            B
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* State 2: Actual Image */}
                    {screenState === 2 && (
                      <div className="w-full h-full fade-in">
                        <Image 
                          src="/image/Mobile.png" 
                          alt="Mobile App" 
                          fill 
                          className="object-cover"
                          sizes="125px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges - Responsive positioning, hidden on mobile */}
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

      {/* --- SUPERB FEATURES SECTION - Responsive for all devices --- */}
     <section className="relative hidden md:block lg:w-[92%] md:w-[85%] -mt-10 sm:-mt-20 md:-mt-28 lg:-mt-20 w-full mx-auto z-50 px-4 md:px-0 mb-32 sm:mb-40 md:mb-48">
        <div className="relative bg-[#0f172a] rounded-[24px] sm:rounded-[30px] md:rounded-[40px]   lg:rounded-[45px] pt-[60px] sm:pt-[80px] md:pt-[100px]   lg:pt-[110px]  pb-[80px] sm:pb-[90px] md:pb-[100px]   lg:pb-[110px]  max-w-[90%] sm:max-w-[85%] md:max-w-[1100px]  lg:max-w-[1200px]   mx-auto shadow-2xl border border-white/10 overflow-visible"
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

          {/* Floating CTA Card - Responsive */}
          <div className="group absolute  hidden md:block xl:-bottom-30    lg:-bottom-20 md:-bottom-15 left-1/2 -translate-x-1/2 w-[95%] sm:w-[92%] md:w-[90%]  bg-white rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-6 lg:p-10 border border-slate-200 shadow-2xl z-50 transition-transform duration-500 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-7 md:gap-8 lg:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-3 sm:mb-4 justify-center md:justify-start">
                  <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg">B</div>
                  <span className="font-bold text-slate-800 text-base sm:text-lg md:text-lg">Billora Premium</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1 sm:mb-2">GST Billing Software</h3>
                <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-5 md:mb-6">Automate your invoicing and inventory in seconds.</p>
                <Link href="/start-free-trial" className="block w-full md:w-auto">
                  <button className="w-full md:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 bg-slate-900 text-white rounded-full text-sm sm:text-base font-bold hover:bg-blue-600 transition-colors">
                    Get Started Free
                  </button>
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