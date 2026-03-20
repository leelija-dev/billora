"use client";

import React, { useEffect, useRef } from 'react';
import Container from "../components/Container";
import SectionTitle from './SectionTitle';

const HowItWorks = () => {
    const stepRefs = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('step-visible');
                }
            });
        }, observerOptions);

        stepRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            number: '01',
            title: 'Create Account',
            description: 'Sign up for free in under 2 minutes. No credit card required. Get instant access to all basic features.',
            icon: '📝',
            color: '#3b82f6',
            buttonText: 'Sign Up Now'
        },
        {
            number: '02',
            title: 'Choose Plan',
            description: 'Select the plan that fits your business needs. Upgrade, downgrade, or cancel anytime with no questions asked.',
            icon: '⚡',
            color: '#8b5cf6',
            buttonText: 'View Plans'
        },
        {
            number: '03',
            title: 'Start Billing',
            description: 'Begin creating professional GST invoices immediately. Invite your team and start managing your business.',
            icon: '🚀',
            color: '#10b981',
            buttonText: 'Get Started'
        }
    ];

    return (
        <div className="py-12 sm:py-16 md:py-20 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans overflow-x-hidden">
            <Container size="default">
                
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-[60px] px-4 sm:px-0">
                    <SectionTitle title="How It Works" />
                    <p className="text-[#475569] text-base sm:text-base md:text-lg lg:text-xl max-w-[600px] mx-auto mt-4 sm:mt-6 md:mt-8 lg:mt-4 animate-[fadeInUp_0.8s_ease-out_0.2s_both] leading-relaxed px-2">
                        Get started with Billora in three simple steps
                    </p>
                </div>

                {/* Top CTA Card */}
                <div className="max-w-[900px] mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-[fadeInUp_0.8s_ease-out_0.3s_both] px-4 sm:px-0">
                    <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] p-6 sm:p-6 md:p-8 lg:p-[25px_35px] shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row md:flex-row items-center justify-between gap-4 sm:gap-4 md:gap-6 lg:gap-6 border border-[#3b82f61A] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(59,130,246,0.12)] hover:border-[#3b82f633]">
                        <div className="flex-1 text-center sm:text-left md:text-left w-full sm:w-auto">
                            <h2 className="text-xl sm:text-xl md:text-2xl lg:text-[22px] font-bold text-[#1e293b] mb-3 sm:mb-2.5 md:mb-3 lg:mb-3 tracking-[-0.3px]">
                                Start Your Journey Today
                            </h2>
                            <p className="text-[#64748b] text-sm sm:text-sm md:text-base lg:text-[15px] flex flex-col sm:flex-row md:flex-row items-center justify-center sm:justify-start md:justify-start gap-1 sm:gap-1.5 md:gap-2">
                                <span className="text-sm sm:text-sm md:text-base opacity-70">✨</span>
                                <span>No credit card required • Free forever plan</span>
                            </p>
                        </div>
                        <button className="w-full sm:w-auto md:w-auto px-6 sm:px-8 md:px-8 lg:px-10 py-3 sm:py-2.5 md:py-3 lg:py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-none rounded-full text-sm sm:text-sm md:text-base lg:text-[15px] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_8px_20px_rgba(59,130,246,0.25)] whitespace-nowrap relative overflow-hidden tracking-[0.3px] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_25px_rgba(59,130,246,0.35)] hover:bg-gradient-to-r hover:from-[#2563eb] hover:to-[#1d4ed8] active:translate-y-0 active:scale-98 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full">
                            Get Started Free
                        </button>
                    </div>
                </div>
 
                {/* Steps Section */}
                <div className="w-full relative px-4 sm:px-0">
                    <div className="relative flex flex-col lg:flex-row justify-between items-stretch gap-8 sm:gap-6 md:gap-8 lg:gap-[30px] py-6 sm:py-8 md:py-10 lg:py-[60px]">

                        {/* Desktop Horizontal Line */}
                        <div className="hidden lg:block absolute bottom-[200px] left-0 right-0 h-1 bg-gray-200 z-[1] rounded overflow-hidden">
                            <div className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#blue] rounded animate-[progressFill_2s_ease-out_forwards] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                        </div>

                        {/* Mobile/Tablet Vertical Line */}
                        <div className="lg:hidden absolute left-1/2 top-12 bottom-0 w-1 bg-gradient-to-b from-gray-200 to-gray-100 z-[1] rounded overflow-hidden transform -translate-x-1/2">
                            <div className="absolute top-0 left-0 w-full h-0 bg-gradient-to-b from-[#3b82f6] via-[#8b5cf6] to-[#blue] rounded animate-[progressFillVertical_2.5s_ease-out_forwards] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                        </div>

                        {/* Step Cards */}
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                ref={el => stepRefs.current[index] = el}
                                className="flex-1 relative z-[2] opacity-0 translate-y-[30px] transition-all duration-600 ease-in step-item"
                                style={{ transitionDelay: `${0.1 + index * 0.2}s` }}
                            >
                                <div
                                    className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[30px] p-6 sm:p-6 md:p-8 lg:p-[45px_30px_35px] shadow-[0_10px_25px_rgba(0,0,0,0.06)] md:shadow-[0_15px_30px_rgba(0,0,0,0.08)] lg:shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-black/5 h-full w-full flex flex-col items-center text-center hover:-translate-y-2 hover:scale-105 hover:shadow-[0_30px_60px_rgba(59,130,246,0.15)] group"
                                    style={{ '--step-color': step.color }}
                                >
                                    {/* Circle Number Badge */}
                                    <div
                                        className="absolute -top-5 sm:-top-6 md:-top-7 lg:-top-5 left-1/2 lg:left-6 transform lg:transform-none -translate-x-1/2 lg:translate-x-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[50px] lg:h-[50px] rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl lg:text-xl shadow-[0_8px_16px_rgba(0,0,0,0.1)] md:shadow-[0_10px_20px_rgba(0,0,0,0.15)] lg:shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-3 border-white z-[3] animate-[pulse_2s_infinite] flex-shrink-0"
                                        style={{ background: step.color }}
                                    >
                                        <span>{step.number}</span>
                                    </div>

                                    {/* Icon Circle */} 
                                    <div
                                        className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-[90px] lg:h-[90px] rounded-full flex items-center justify-center mb-4 sm:mb-4 md:mb-6 lg:mb-6 text-3xl sm:text-3xl md:text-4xl lg:text-5xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-5 mt-4 sm:mt-4 md:mt-6 lg:mt-6"
                                        style={{ background: `${step.color}15` }}
                                    >
                                        <span>{step.icon}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-lg md:text-2xl lg:text-2xl font-bold text-[#1e293b] mb-3 sm:mb-3 md:mb-4 lg:mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-6px] sm:after:bottom-[-8px] md:after:bottom-[-8px] lg:after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-6 sm:after:w-8 md:after:w-10 lg:after:w-10 after:h-[2px] sm:after:h-[3px] md:after:h-[3px] lg:after:h-[3px] after:bg-[var(--step-color)] after:opacity-50 after:transition-all after:duration-300 group-hover:after:w-12 md:group-hover:after:w-16 lg:group-hover:after:w-[60px]">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm sm:text-sm md:text-base lg:text-[15px] text-[#475569] leading-relaxed sm:leading-[1.5] md:leading-[1.6] lg:leading-[1.7] mb-4 sm:mb-4 md:mb-6 lg:mb-6 flex-grow px-2">
                                        {step.description}
                                    </p>

                                    {/* Button */}
                                    <button
                                        className="px-6 sm:px-6 md:px-8 lg:px-[30px] py-3 sm:py-2 md:py-3 lg:py-3 border-none rounded-full text-white font-semibold text-sm sm:text-sm md:text-base lg:text-[15px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-full max-w-[160px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[180px] mt-2 sm:mt-3 md:mt-4 lg:mt-6 relative overflow-hidden hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-95 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                                        style={{
                                            background: step.color,
                                            boxShadow: `0 5px 15px ${step.color}40`
                                        }}
                                    >
                                        {step.buttonText}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            <style jsx>{`
                .step-visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
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
                
                @keyframes progressFill {
                    0% { width: 0%; }
                    50% { width: 50%; }
                    100% { width: 100%; }
                }

                @keyframes progressFillVertical {
                    0% { height: 0%; }
                    50% { height: 50%; }
                    100% { height: 100%; }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                    }
                    50% {
                        box-shadow: 0 15px 30px rgba(59, 130, 246, 0.3);
                    }
                }
            `}</style>
        </div>
    );
};

export default HowItWorks;