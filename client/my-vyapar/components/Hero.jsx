"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../components/Container";
import { useAuthStore } from "../store/authStoreZustand";
import {
  FaStar,
  FaUsers,
  FaChartBar,
  FaArrowRight,
  FaCheckCircle,
  FaRocket,
} from "react-icons/fa";

const Hero = () => {
  // Get user auth state
  const { user, isLoggedIn } = useAuthStore();

  // Calculate hasActivePlan directly from user data
  const hasActivePlan = user?.is_active === 1 || false;

  const [screenState, setScreenState] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isDesktop, setIsDesktop] = useState(true);
  const heroRef = useRef(null);

  // Check screen size for mouse tracking
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  useEffect(() => {
    // Only add mouse move listener on desktop screens
    if (!isDesktop) return;
    
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== MODERN HERO SECTION WITH SLIGHTLY DARKER BACKGROUND ===== */}
      <section
        ref={heroRef}
        className="relative min-h-[100vh] flex items-center pt-24 pb-[10rem] lg:pb-[8rem] overflow-hidden bg-hero-gradient"
      >
        {/* Animated gradient orbs - only show on desktop */}
        {isDesktop && (
          <>
            <div
              className="absolute w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] rounded-full blur-80px sm:blur-100px md:blur-120px opacity-30 transition-all duration-300 ease-out pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, var(--gradient-indigo-600), #38bdf8)",
                top: `${mousePosition.y * 0.5}%`,
                left: `${mousePosition.x * 0.5}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
            <div className="absolute top-20 right-5 sm:right-10 w-60 h-60 sm:w-80 sm:h-80 rounded-full blur-80px sm:blur-100px opacity-25 bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-100px sm:blur-120px opacity-15 bg-gradient-to-r from-sky-400 to-indigo-400" />
          </>
        )}

        {/* Static gradient orbs for mobile (no mouse tracking) */}
        {!isDesktop && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-100px opacity-20 bg-gradient-to-r from-indigo-500 to-cyan-500" />
            <div className="absolute top-20 right-5 w-60 h-60 rounded-full blur-80px opacity-25 bg-gradient-to-r from-cyan-500 to-purple-500" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-100px opacity-15 bg-gradient-to-r from-sky-400 to-indigo-400" />
          </>
        )}

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <Container size="default">
          <div className="relative z-30 w-full flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20">
            {/* --- TEXT CONTENT --- */}
            <div className="flex-1 text-center lg:text-left px-4 sm:px-6 lg:px-0 w-full">
              <h1 className="text-h1-xs sm:text-h1-sm md:text-h1-md lg:text-h1-xl xl:text-h1-2xl font-bold text-text-slate-800 leading-[1.2] mb-4 sm:mb-6 tracking-tight animate-fade-in-up max-w-[850px] mx-auto lg:mx-0">
                Best Readymade{" "}
                <span className="bg-gradient-secondary bg-clip-text text-transparent whitespace-normal">
                  Inventory Management
                </span>{" "}
                and GST Billing Software
              </h1>
              <p className="text-p-xs sm:text-p-sm md:text-p-md xl:text-p-lg text-text-slate-700 leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-[680px] mx-auto lg:mx-0 animate-fade-in-up">
                Now calculate CGST, SGST, & IGST faster, generate GST invoices
                instantly, and track stock levels & outstandings securely
                without penalties.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center lg:justify-start items-center animate-fade-in-up">
                {isLoggedIn && hasActivePlan ? (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000"}/dashboard`}
                    className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary rounded-full text-white font-semibold text-text-sm sm:text-text-md shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50 transition-all duration-300 hover:scale-105 active:scale-95"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="flex items-center gap-2">
                      Go to Dashboard
                      <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/start-free-trial"
                      className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-primary rounded-full text-white font-semibold text-text-sm sm:text-text-md shadow-lg shadow-sky-600/30 hover:shadow-sky-600/50 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <span className="flex items-center gap-2">
                        Start Free Trial
                        <FaRocket className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </Link>
                    <Link
                      href="/bookdemo"
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-white/80 lg:backdrop-blur-sm border border-border-gray-300 rounded-full text-text-slate-700 font-semibold text-text-sm sm:text-text-md hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Book Free Demo →
                    </Link>
                  </>
                )}
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 border-t border-gray-300/50">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-text-slate-700 text-text-xs sm:text-text-sm">
                    No Credit Card Required
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-text-slate-700 text-text-xs sm:text-text-sm">
                    14 Days Free Trial
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-text-slate-700 text-text-xs sm:text-text-sm">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>

            {/* --- DEVICE SHOWCASE WITH GRAYISH BORDERS --- */}
            <div className="flex-1 relative w-full xl:max-w-[550px] max-w-[390px] mt-8 lg:mt-0">
              {/* Desktop Monitor Container - Grayish border */}
              <div className="relative z-10 transform transition-all duration-500 hover:scale-[1.02]">
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 lg:backdrop-blur-sm md:rounded-3xl p-[3px] rounded-[14px] md:rounded-[20px] shadow-xl border border-border-gray-500/40">
                  {/* Monitor bezel */}
                  <div className="relative bg-device-darker rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-inner border border-gray-600/30">
                    {/* Screen Content */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-device-dark to-device-darker">
                      {screenState === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-device-dark to-device-darker">
                          <div className="animate-pulse">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 flex items-center justify-center">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white/20 animate-ping"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {screenState === 1 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-device-dark to-device-darker">
                          <div className="text-reveal">
                            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-h3-sm sm:text-h3-md md:text-h3-lg lg:text-h3-xl font-bold shadow-xl inline-block transform scale-110">
                              TFB
                            </span>
                          </div>
                        </div>
                      )}

                      {screenState === 2 && (
                        <div className="absolute inset-0 fade-in">
                          <Image
                            src="/image/dashboard.webp"
                            alt="PC Dashboard"
                            fill
                            className="object-fill object-top"
                            priority
                            unoptimized={true}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Monitor stand */}
                <div className="relative w-12 sm:w-14 md:w-16 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-gray-600 to-gray-700 mx-auto -mt-2 rounded-b-lg shadow-md border-x border-border-gray-500/30"></div>
                <div className="relative w-24 sm:w-28 md:w-32 h-1 bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 mx-auto rounded-full shadow-inner"></div>
              </div>

              {/* Mobile Container - Grayish border */}
              <div
                className="absolute -bottom-6 sm:-bottom-8 md:-bottom-10 lg:-bottom-12 -left-1 xxs:-left-3 sm:-left-4 md:-left-6 lg:-left-8 z-20 transform rotate-[-8deg] hover:rotate-0 transition-all duration-500 hover:scale-105"
                style={{
                  filter: "drop-shadow(0 20px 20px rgb(0 0 0 / 0.15))",
                }}
              >
                <div className="relative w-[65px]  xxs:w-[70px] md:w-[100px] xl:w-[140px] bg-gradient-to-br from-gray-800/90 to-gray-900/90 lg:backdrop-blur-sm p-[2px] rounded-[10px] sm:rounded-[18px] lg:p-[2px] xl:p-[3px] border border-border-gray-500/40">
                  <div className="relative bg-device-darker rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden aspect-[9/16] border border-gray-600/30">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 xl:w-20 h-2 xl:h-3 bg-device-darker rounded-b-lg z-10 border-x border-b border-gray-600/30"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      {screenState === 0 && (
                        <div className="w-full h-full bg-gradient-to-br from-device-dark to-device-darker"></div>
                      )}

                      {screenState === 1 && (
                        <div className="w-full h-full bg-gradient-to-br from-device-dark to-device-darker flex items-center justify-center">
                          <div className="text-reveal">
                            <span className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl text-text-sm sm:text-text-md font-bold flex items-center justify-center shadow-lg">
                              TFB
                            </span>
                          </div>
                        </div>
                      )}

                      {screenState === 2 && (
                        <div className="relative w-full h-full">
                          <Image
                            src="/image/mobile-image.webp"
                            alt="Mobile App"
                            fill
                            className="object-fill object-top"
                            unoptimized={true}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Badges - Responsive positioning */}
              <div className="absolute top-[5%] sm:top-[8%] md:top-[10%] -right-1 sm:-right-2 md:-right-3 lg:-right-6 z-30 animate-float-1">
                <div className="bg-white/90 lg:backdrop-blur-md rounded-full p-[5px_6px] border border-border-gray-300 shadow-md">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-feature-amber to-orange-600 flex items-center justify-center">
                      <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <span className="text-text-slate-700 font-semibold text-[10px] sm:text-text-xs md:text-text-sm whitespace-nowrap">
                      Easy to Use
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-[25%] sm:bottom-[28%] md:bottom-[30%] -right-2 sm:-right-3 md:-right-4 lg:-right-8 z-30 animate-float-2"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="bg-white/90 lg:backdrop-blur-md rounded-full p-[5px_6px] border border-border-gray-300 shadow-md">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-feature-purple to-pink-600 flex items-center justify-center">
                      <FaUsers className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <span className="text-text-slate-700 font-semibold text-[10px] sm:text-text-xs md:text-text-sm whitespace-nowrap">
                      Collaborative
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="absolute top-[20%] sm:top-[35%] md:top-[29%] -left-3 sm:-left-4 md:-left-6 lg:-left-10 z-30 animate-float-3"
                style={{ animationDelay: "1s" }}
              >
                <div className="bg-white/90 lg:backdrop-blur-md rounded-full p-[5px_6px] border border-border-gray-300 shadow-md">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-feature-emerald to-teal-600 flex items-center justify-center">
                      <FaChartBar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-white" />
                    </div>
                    <span className="text-text-slate-700 font-semibold text-[10px] sm:text-text-xs md:text-text-sm whitespace-nowrap">
                      Analytics
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 z-40 px-4 pb-16">
        <div className="relative max-w-6xl mx-auto">
          {/* Main Features Card */}
          <div className="relative bg-gradient-to-br from-white to-gray-100/80 lg:backdrop-blur-md rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-xl overflow-hidden border border-border-gray-300/50">
            {/* Decorative top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-tertiary"></div>

            <div className="p-6 sm:p-8 md:p-10 lg:p-16">
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="text-h2-xs sm:text-h2-sm md:text-h2-md lg:text-h2-xl font-bold text-text-slate-800 mb-3 sm:mb-4">
                  Made smarter,{" "}
                  <span className="bg-gradient-secondary bg-clip-text text-transparent">
                    faster
                  </span>{" "}
                  & user-friendly
                </h2>
              </div>

              {/* Feature Pills - Responsive wrapping */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12">
                {[
                  { icon: FaStar, name: "Easy to Use", color: "amber" },
                  { icon: FaUsers, name: "Collaborative", color: "purple" },
                  {
                    icon: FaChartBar,
                    name: "Activity Stream",
                    color: "emerald",
                  },
                ].map((feature) => (
                  <span
                    key={feature.name}
                    className="group px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-white rounded-full border border-gray-200 text-text-slate-700 font-medium text-text-xs sm:text-text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                  >
                    <feature.icon
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 inline mr-1.5 sm:mr-2 text-${feature.color}-500`}
                    />
                    {feature.name}
                  </span>
                ))}
              </div>

              {/* Floating CTA Card - Fully responsive */}
              <div className="relative mt-6 sm:mt-8 bg-gradient-tertiary rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-white/10 rounded-full blur-2xl sm:blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-purple-400/20 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-text-sm sm:text-text-md">
                        TFB
                      </div>
                      <span className="font-bold text-white text-text-lg sm:text-text-xl">
                        {process.env.NEXT_PUBLIC_APP_NAME || "The Fast Bill"}
                      </span>
                    </div>
                    <h3 className="text-h3-xs sm:text-h3-sm md:text-h3-md font-extrabold text-white mb-2">
                      Best Billing & Inventory Software
                    </h3>
                    <p className="text-indigo-100 text-text-sm sm:text-text-md mb-4 sm:mb-6">
                      Automate invoicing and inventory in seconds.
                    </p>
                    <Link href="/start-free-trial">
                      <span className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-white text-gradient-sky-700 rounded-full font-bold text-text-sm sm:text-text-md hover:bg-sky-50 transition-colors shadow-lg">
                        Get Started Free
                        <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                    </Link>
                  </div>
                  <div className="flex-1 w-full max-w-[280px] sm:max-w-sm">
                    <div className="relative aspect-video bg-white/10 rounded-lg sm:rounded-xl overflow-hidden border border-white/20 shadow-xl">
                      <Image
                        src="/image/dashboard.webp"
                        alt="Dashboard"
                        fill
                        className="object-fill opacity-90 hover:opacity-100 transition-opacity"
                        unoptimized={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-8px) translateX(-5px);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-12px) translateX(3px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .text-reveal {
          animation: textReveal 0.5s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-float-1 {
          animation: float1 4s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float2 4.5s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float3 3.5s ease-in-out infinite;
        }

        /* Responsive text adjustments */
        @media (max-width: 640px) {
          .animate-fade-in-up {
            animation-duration: 0.6s;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;