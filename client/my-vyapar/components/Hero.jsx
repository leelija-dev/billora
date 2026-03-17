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
      setScreenState(1); // Show Billora text after 100ms (during slide)
    }, 100);

    const timer2 = setTimeout(() => {
      setScreenState(2); // Show actual images after 1300ms (after slide completes)
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== ANIMATED HERO SECTION ===== */}
      <section className="relative z-10 min-h-[100vh] flex items-center pb-32 pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 overflow-hidden">
        
        <style>{`
          @keyframes fadeInUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          @keyframes custom-bounce { 
            0%, 100% { transform: translateY(0); } 
            50% { transform: translateY(-15px); } 
          }
          @keyframes heroicSlidePC {
            0% { opacity: 0; transform: translateY(-100px); }
            30% { opacity: 0.3; transform: translateY(-70px); }
            70% { opacity: 0.7; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes heroicSlidePhone {
            0% { opacity: 0; transform: translateY(100px); }
            30% { opacity: 0.3; transform: translateY(70px); }
            70% { opacity: 0.7; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
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
          .liquid-btn-container::before {
            content: "";
            position: absolute;
            width: 140%;
            height: 300%;
            background: conic-gradient(from 0deg, transparent 0%, #3b82f6 10%, #8b5cf6 20%, #10b981 30%, transparent 40%);
            animation: liquid-flow 3s linear infinite;
          }
          .billora-btn {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            border-radius: 50px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: white; font-weight: 700; display: flex; align-items: center; justify-content: center;
          }
          
          .heroic-slide-pc { animation: heroicSlidePC 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .heroic-slide-phone { animation: heroicSlidePhone 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards; }
          .heroic-slide-badge1 { 
            animation: fadeInUp 1s ease-out 0.4s forwards, custom-bounce 3s ease-in-out 1.4s infinite; 
            opacity: 0; 
          }
          .heroic-slide-badge2 { 
            animation: fadeInUp 1s ease-out 0.6s forwards, custom-bounce 3.2s ease-in-out 1.6s infinite; 
            opacity: 0; 
          }
          .heroic-slide-badge3 { 
            animation: fadeInUp 1s ease-out 0.8s forwards, custom-bounce 2.8s ease-in-out 1.8s infinite; 
            opacity: 0; 
          }
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
          .text-reveal { animation: textReveal 0.6s ease-out forwards; }
          .fade-in { animation: fadeIn 0.5s ease-out forwards; }
        `}</style>

        <Container size="default">
          <div className="relative z-30 w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            {/* --- TEXT CONTENT --- */}
            <div className="flex-1 text-center lg:text-left px-4 sm:px-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-black text-[#0f172a] leading-[1.15] mb-6 tracking-tight animate-fadeInUp max-w-[750px]">
                GST Billing Software for <span className="text-indigo-600">Small Businesses in India</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed mb-10 max-w-[650px] mx-auto lg:mx-0 animate-fadeInUp">
                Manage your business professionally with Billora, India's leading
                small business software for billing, inventory, and accounting.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center animate-fadeInUp">
                <Link href="/start-free-trial" className="liquid-btn-container">
                  <button className="billora-btn">Start Free Trial →</button>
                </Link>
                <Link href="/bookdemo" className="liquid-btn-container">
                  <button className="billora-btn">Book Free Demo →</button>
                </Link>
              </div>
            </div>

            {/* --- IMAGE CONTAINER WITH SYNCED LOADING SEQUENCE --- */}
            <div className="flex-1 relative min-h-[400px] w-full max-w-[650px] mt-12 lg:mt-0 flex flex-col items-center">
              
              {/* PC Monitor Model - Slides in from top */}
              <div className="relative w-full z-10 heroic-slide-pc">
                {/* Monitor Screen */}
                <div className="relative aspect-[16/10] bg-slate-900 rounded-[20px] p-2.5 shadow-2xl border border-slate-700/50">
                  <div className="w-full h-full bg-slate-800 rounded-xl overflow-hidden relative shadow-inner">
                    {/* Top bar with dots - always visible */}
                    <div className="h-7 bg-slate-700/50 flex items-center px-4 gap-2 border-b border-slate-600/30">
                      <span className="w-2 h-2 rounded-full bg-red-500/60"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-500/60"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500/60"></span>
                    </div>
                    
                    {/* Screen Content with Loading States */}
                    <div className="absolute inset-0 top-7 flex items-center justify-center bg-slate-800">
                      {/* State 0: Blank Black - During initial slide */}
                      {screenState === 0 && (
                        <div className="w-full h-full bg-black"></div>
                      )}
                      
                      {/* State 1: Blue B Logo Reveal - Appears during slide */}
                      {screenState === 1 && (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <div className="text-reveal">
                            <span className="bg-blue-600 text-white px-6 py-3 rounded-lg text-5xl font-bold shadow-xl inline-block">
                              B
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* State 2: Actual Image - After slide completes */}
                      {screenState === 2 && (
                        <div className="w-full h-full fade-in">
                          <Image 
                            src="/image/desktop.png" 
                            alt="PC Dashboard" 
                            fill 
                            className="object-cover" 
                            priority 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* PC Stand */}
                <div className="relative w-16 h-8 bg-gradient-to-b from-slate-700 to-slate-800 mx-auto -mt-1 shadow-lg"></div>
                <div className="relative w-40 h-3 bg-slate-800 rounded-t-xl mx-auto shadow-2xl border-t border-slate-600"></div>
              </div>

              {/* Floating Mobile Image - Slides in from bottom */}
              <div className="absolute left-0 bottom-4 w-[125px] h-[250px] bg-slate-800 rounded-[35px] p-2 shadow-2xl z-30 hidden sm:block heroic-slide-phone border border-slate-700">
                <div className="w-full h-full bg-slate-900 rounded-[30px] overflow-hidden relative border-2 border-slate-800">
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
                          <span className="bg-blue-600 text-white w-10 h-10 rounded-lg text-2xl font-bold flex items-center justify-center shadow-lg">
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
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-[10%] -right-4 bg-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl border border-blue-100 text-blue-600 z-40 hidden md:block heroic-slide-badge1">
                ✨ Easy to Use
              </div>
              <div className="absolute bottom-[35%] -right-8 bg-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl border border-purple-100 text-purple-600 z-40 hidden md:block heroic-slide-badge2">
                👥 Collaborative
              </div>
              <div className="absolute top-[40%] -left-12 bg-white px-5 py-2.5 rounded-full font-bold text-sm shadow-xl border border-emerald-100 text-emerald-600 z-40 hidden md:block heroic-slide-badge3">
                📊 Activity Stream
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- SUPERB FEATURES SECTION --- */}
      <section className="relative -mt-24 w-full mx-auto z-40 px-4 md:px-0 mb-48 hidden md:block">
        <div className="relative bg-[#0f172a] rounded-[40px] pt-[100px] pb-[100px] max-w-[1100px] mx-auto shadow-2xl border border-white/10 overflow-visible"
             style={{ 
               backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", 
               backgroundSize: "24px 24px" 
             }}>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <h2 className="text-3xl md:text-[42px] font-bold text-white text-center mb-8 relative z-20 leading-tight">
            We made it <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">superb</span> & usable
          </h2>

          <div className="flex justify-center gap-3 md:gap-5 mb-12 flex-wrap relative z-20 px-4">
            {["Easy to Use", "Collaborative", "Activity Stream"].map((pill) => (
              <span key={pill} className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white/90 font-medium text-sm">
                {pill}
              </span>
            ))}
          </div>

          <div className="group absolute -bottom-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[30px] p-6 md:p-10 border border-slate-200 shadow-2xl z-50 transition-transform duration-500 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                  <span className="font-bold text-slate-800 text-lg">Billora Premium</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">GST Billing Software</h3>
                <p className="text-slate-500 mb-6 text-base">Automate your invoicing and inventory in seconds.</p>
                <Link href="/start-free-trial">
                  <button className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-full text-base font-bold hover:bg-blue-600 transition-colors">
                    Get Started Free
                  </button>
                </Link>
              </div>
              <div className="flex-1 w-full">
                <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                  <Image src="/image/desktop.png" alt="Dashboard" width={500} height={300} className="w-full h-full object-cover" />
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