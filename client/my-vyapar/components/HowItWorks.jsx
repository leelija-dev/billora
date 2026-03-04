"use client";

import React, { useEffect, useRef } from 'react';

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
        <div className="py-[60px] px-[30px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans overflow-x-hidden max-md:py-10 max-md:px-5">
            <div className="text-center mb-2.5">
                <h1 className="text-[42px] font-bold text-[#1a237e] mb-4 relative inline-block animate-[fadeInDown_0.8s_ease-out] after:content-[''] after:absolute after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-1 after:bg-gradient-to-r after:from-[#3b82f6] after:via-[#8b5cf6] after:to-[#10b981] after:rounded-[2px] max-md:text-3xl max-sm:text-2xl">
                    How It Works
                </h1>
                <p className="text-[#475569] text-xl max-w-[600px] mx-auto mt-6 animate-[fadeInUp_0.8s_ease-out_0.2s_both] max-md:text-lg max-sm:text-base">
                    Get started with Vyapar in three simple steps
                </p>
            </div>

            {/* Top CTA Card */}
            <div className="max-w-[900px] mx-auto mb-10 px-5 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
                <div className="bg-gradient-to-br from-white to-[#f8fafc] rounded-[20px] p-[25px_35px] shadow-[0_15px_30px_rgba(0,0,0,0.05)] flex items-center justify-between gap-5 border border-[#3b82f61A] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(59,130,246,0.12)] hover:border-[#3b82f633] max-md:flex-col max-md:text-center max-md:p-6">
                    <div className="flex-1">
                        <h2 className="text-[22px] font-bold text-[#1e293b] mb-1 tracking-[-0.3px] max-md:text-xl max-sm:text-lg">
                            Start Your Journey Today
                        </h2>
                        <p className="text-[#64748b] text-sm flex items-center gap-1 max-md:justify-center">
                            <span className="text-sm opacity-70">✨</span>
                            No credit card required • Free forever plan available
                        </p>
                    </div>
                    <button className="px-8 py-3 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-none rounded-[40px] text-[15px] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-[0_8px_20px_rgba(59,130,246,0.25)] whitespace-nowrap relative overflow-hidden tracking-[0.3px] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_25px_rgba(59,130,246,0.35)] hover:bg-gradient-to-r hover:from-[#2563eb] hover:to-[#1d4ed8] active:translate-y-0 active:scale-98 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full max-md:w-full max-md:max-w-[200px] max-md:mx-auto">
                        Get Started Free
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                <div className="relative flex justify-between items-stretch gap-[30px] py-[60px] px-0 max-lg:flex-col max-lg:gap-[60px]">
                    {/* Animated Connecting Line - Desktop Only */}
                    <div className="absolute bottom-[200px] left-0 right-0 h-1 bg-[#blue] z-[1] rounded overflow-hidden max-lg:hidden">
                        <div className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#10b981] rounded animate-[progressFill_2s_ease-out_forwards] shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                    </div>

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            ref={el => stepRefs.current[index] = el}
                            className="flex-1 relative z-[2] opacity-0 translate-y-[30px] transition-all duration-600 ease-in step-item max-lg:flex-auto"
                            style={{ transitionDelay: `${0.1 + index * 0.2}s` }}
                        >
                            <div 
                                className="bg-white rounded-[30px] p-[45px_30px_35px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] border border-black/5 h-full w-full flex flex-col items-center text-center hover:-translate-y-2 hover:scale-105 hover:shadow-[0_30px_60px_rgba(59,130,246,0.15)] max-lg:max-w-[500px] max-lg:mx-auto max-md:p-10 max-sm:p-8"
                                style={{ '--step-color': step.color }}
                            >
                                <div 
                                    className="absolute top-[-20px] left-[30px] w-[50px] h-[50px] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-3 border-white z-[3] animate-[pulse_2s_infinite] max-sm:w-10 max-sm:h-10 max-sm:text-base max-sm:left-5"
                                    style={{ background: step.color }}
                                >
                                    <span>{step.number}</span>
                                </div>

                                <div 
                                    className="w-[90px] h-[90px] rounded-full flex items-center justify-center mb-6 text-4xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-5 max-sm:w-[70px] max-sm:h-[70px] max-sm:text-3xl"
                                    style={{ background: `${step.color}15` }}
                                >
                                    <span>{step.icon}</span>
                                </div>

                                <h3 className="text-2xl font-bold text-[#1e293b] mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-[3px] after:bg-[var(--step-color)] after:opacity-50 after:transition-all after:duration-300 group-hover:after:w-[60px] max-md:text-xl max-sm:text-lg">
                                    {step.title}
                                </h3>

                                <p className="text-[15px] text-[#475569] leading-[1.7] mb-6 flex-grow max-md:text-sm">
                                    {step.description}
                                </p>

                                <button
                                    className="px-[30px] py-3 border-none rounded-[50px] text-white font-semibold text-[15px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-full max-w-[180px] mt-2.5 relative overflow-hidden hover:-translate-y-1 hover:scale-105 hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] active:translate-y-0 active:scale-98 before:content-[''] before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full max-md:max-w-[160px] max-sm:py-2.5 max-sm:text-sm"
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