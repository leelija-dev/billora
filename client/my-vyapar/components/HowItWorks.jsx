"use client";

import React, { useEffect, useRef } from 'react';
import Container from "../components/Container";
import SectionTitle from './SectionTitle';
import { FaEnvelope, FaBolt, FaRocket } from "react-icons/fa";

const HowItWorks = () => {
    const stepRefs = useRef([]);

    useEffect(() => {
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('step-visible');
            });
        }, observerOptions);

        stepRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            number: '01',
            title: 'Create Account',
            description: 'Sign up for free with your email address. Simply enter your business details & set up your account to get access to all basic features.',
            icon: <FaEnvelope className="w-6 h-6" />,
            color: '#3b82f6',
            buttonText: 'Sign Up Now'
        },
        {
            number: '02',
            title: 'Choose Plan',
            description: 'Determine your business needs & select a plan that fits your budget. Free trials & easy cancellations available',
            icon: <FaBolt className="w-6 h-6" />,
            color: '#8b5cf6',
            buttonText: 'View Plans'
        },
        {
            number: '03',
            title: 'Start Billing',
            description: 'Start creating customized invoices quickly by entering product & client details.  Also, calculate GST faster with your team members.',
            icon: <FaRocket className="w-6 h-6" />,
            color: '#10b981',
            buttonText: 'Get Started'
        }
    ];

    return (
        /* FIX FOR 1024x600: 
           - Reduced pt-24 to pt-12 (on small height/mobile) to pull content up.
           - Reduced overall padding to ensure it fits better in shorter viewports.
        */
        <div className="pt-12 pb-12 md:pt-20 md:pb-20 lg:pt-24 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-sans overflow-hidden">
            <Container size="default">
                
                {/* Header Section: Reduced mb-12 to mb-8 for tighter spacing */}
                <div className="text-center mb-8 lg:mb-12 xl:mb-16 px-4">
                    <SectionTitle title="The Setup Process" />
                    <p className="text-[#475569] text-sm md:text-base lg:text-lg max-w-[600px] mx-auto mt-4 animate-[fadeInUp_0.8s_ease-out_0.2s_both] leading-relaxed">
                       3 Simple Steps to Get Personalized & Effortless GST Invoices
                    </p>
                </div>

                {/* Steps Section */}
                <div className="w-full relative px-4 sm:px-0">
                    <div className="relative flex flex-col lg:flex-row justify-between items-stretch gap-8 lg:gap-4 xl:gap-8">

                        {/* Desktop Horizontal Line */}
                        <div className="hidden lg:block absolute bottom-[200px] left-0 right-0 h-1 bg-gray-200 z-[1] rounded-full">
                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#10b981] opacity-30"></div>
                        </div>

                        {/* Step Cards */}
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                ref={el => stepRefs.current[index] = el}
                                className="flex-1 relative z-[2] opacity-0 translate-y-[40px] transition-all duration-700 ease-out step-item"
                                style={{ transitionDelay: `${0.2 * index}s` }}
                            >
                                <div
                                    /* Reduced vertical padding (py-10 instead of py-16) and min-height for short screens */
                                    className="bg-white rounded-[32px] px-6 py-10 xl:py-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative border border-black/5 h-full min-h-[400px] xl:min-h-[480px] flex flex-col items-center text-center hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-500 group"
                                    style={{ '--step-color': step.color }}
                                >
                                    {/* Number Badge */}
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl border-4 border-white"
                                         style={{ background: step.color }}>
                                        {step.number}
                                    </div>

                                    {/* Icon Circle: Reduced size slightly (w-20 vs w-24) */}
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 mt-2"
                                         style={{ background: `${step.color}15` }}>
                                        {step.icon}
                                    </div>

                                    <h3 className="text-xl xl:text-2xl font-bold text-[#1e293b] mb-4">{step.title}</h3>
                                    <p className="text-xs xl:text-sm text-[#64748b] leading-relaxed mb-8 flex-grow px-2">{step.description}</p>

                                    <button className="px-8 py-3 rounded-full text-white font-bold text-xs xl:text-sm transition-all duration-300 shadow-lg hover:brightness-110 active:scale-95 w-full max-w-[180px]"
                                            style={{ background: step.color, boxShadow: `0 10px 25px ${step.color}40` }}>
                                        {step.buttonText}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            <style jsx>{`
                .step-visible { opacity: 1 !important; transform: translateY(0) !important; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default HowItWorks;