"use client";

import React, { useEffect, useRef, useState } from 'react';
<<<<<<< HEAD
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";
=======
>>>>>>> 9bfd81b (my second git push)

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const cardRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: 'Basic',
<<<<<<< HEAD
      price: { monthly: '999', yearly: '9,999' },
      description: 'Perfect for small businesses just getting started',
      features: ['Up to 100 invoices/month', 'Basic GST reports', 'Single user', 'Email support', 'Cloud backup', 'Basic inventory'],
=======
      price: {
        monthly: '999',
        yearly: '9,999'
      },
      description: 'Perfect for small businesses just getting started',
      features: [
        'Up to 100 invoices/month',
        'Basic GST reports',
        'Single user',
        'Email support',
        'Cloud backup',
        'Basic inventory'
      ],
>>>>>>> 9bfd81b (my second git push)
      color: '#000000',
      buttonText: 'Start Basic',
      popular: false
    },
    {
      name: 'Pro',
<<<<<<< HEAD
      price: { monthly: '1,999', yearly: '19,999' },
      description: 'Ideal for growing businesses with advanced needs',
      features: ['Unlimited invoices', 'Advanced GST reports', 'Up to 5 users', 'Priority support', 'Advanced inventory', 'Multi-user access', 'API access', 'Custom reports'],
=======
      price: {
        monthly: '1,999',
        yearly: '19,999'
      },
      description: 'Ideal for growing businesses with advanced needs',
      features: [
        'Unlimited invoices',
        'Advanced GST reports',
        'Up to 5 users',
        'Priority support',
        'Advanced inventory',
        'Multi-user access',
        'API access',
        'Custom reports'
      ],
>>>>>>> 9bfd81b (my second git push)
      color: '#8b5cf6',
      buttonText: 'Start Pro',
      popular: true
    },
    {
      name: 'Enterprise',
<<<<<<< HEAD
      price: { monthly: '3,999', yearly: '39,999' },
      description: 'For large organizations with custom requirements',
      features: ['Unlimited everything', 'Custom integrations', 'Unlimited users', '24/7 phone support', 'Dedicated manager', 'SLA guarantee', 'Custom training', 'On-premise option'],
=======
      price: {
        monthly: '3,999',
        yearly: '39,999'
      },
      description: 'For large organizations with custom requirements',
      features: [
        'Unlimited everything',
        'Custom integrations',
        'Unlimited users',
        '24/7 phone support',
        'Dedicated manager',
        'SLA guarantee',
        'Custom training',
        'On-premise option'
      ],
>>>>>>> 9bfd81b (my second git push)
      color: '#000000',
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
<<<<<<< HEAD
    <div className="py-10 sm:py-[60px] md:py-12 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans">
      <Container size="default">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-8 lg:mb-12 px-4 sm:px-0">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-base sm:text-lg md:text-sm lg:text-xl max-w-[600px] mx-auto mt-4 sm:mt-6 md:mt-3 lg:mt-4">
            {/* Tablet: md:text-sm (14px) */}
            Choose the perfect plan for your business
          </p>
        </div>

        {/* Toggle */}
        <div className="flex flex-row justify-center items-center gap-2 mb-8 sm:mb-[50px] md:mb-8 lg:mb-12 bg-white p-1.5 rounded-[60px] max-w-[340px] md:max-w-[280px] lg:max-w-[340px] mx-auto shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
          <button
            className={`px-4 sm:px-[30px] md:px-4 lg:px-[30px] py-3 sm:py-3 md:py-2 lg:py-3 border-none rounded-[40px] text-sm sm:text-base md:text-xs lg:text-base font-semibold cursor-pointer transition-all duration-300 flex-1 whitespace-nowrap ${
              billingCycle === 'monthly' ? 'bg-[#3b82f6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]' : 'bg-transparent text-[#1e293b]'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 sm:px-[30px] md:px-4 lg:px-[30px] py-3 sm:py-3 md:py-2 lg:py-3 border-none rounded-[40px] text-sm sm:text-base md:text-xs lg:text-base font-semibold cursor-pointer transition-all duration-300 flex-1 whitespace-nowrap ${
              billingCycle === 'yearly' ? 'bg-[#3b82f6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]' : 'bg-transparent text-[#1e293b]'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="bg-white/20 py-1 px-2 sm:py-1 sm:px-2 rounded-[20px] text-xs sm:text-xs md:text-[9px] lg:text-xs font-medium ml-1 sm:ml-2">Save 20%</span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="w-full px-4 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4 lg:gap-8 mb-10 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`bg-white rounded-[30px] p-6 sm:p-8 md:p-4 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative transition-all duration-500 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-5 card-visible hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] 
                  ${index === 2 ? "sm:col-span-2 lg:col-span-1 sm:max-w-[450px] sm:mx-auto lg:max-w-full" : ""} 
                  ${plan.popular ? 'border-2 border-[#8b5cf6] scale-105 z-10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 text-white px-4 sm:px-5 md:px-2 lg:px-5 py-1.5 rounded-[30px] text-xs sm:text-sm md:text-[9px] lg:text-sm font-semibold whitespace-nowrap shadow-lg" style={{ background: plan.color }}>
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6 pb-6 md:mb-3 md:pb-3 lg:mb-6 lg:pb-6 border-b border-[#e2e8f0]">
                  <h3 className="text-2xl sm:text-2xl md:text-lg lg:text-3xl font-bold text-[#1e293b] mb-4 md:mb-2 lg:mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4 md:mb-2 lg:mb-4 flex-wrap px-2">
                    <span className="text-xl sm:text-xl md:text-base lg:text-xl font-semibold text-[#64748b]">₹</span>
                    <span className="text-4xl sm:text-4xl md:text-2xl lg:text-5xl font-extrabold" style={{ color: plan.color }}>
                      {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-base sm:text-lg md:text-xs lg:text-lg text-[#64748b]">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <p className="text-sm sm:text-sm md:text-[10px] lg:text-base text-[#64748b] leading-relaxed px-2">{plan.description}</p>
                </div>

                <div className="flex-1 mb-8 md:mb-4 lg:mb-8">
                  <h4 className="text-sm sm:text-sm md:text-[10px] lg:text-sm font-semibold text-[#1e293b] mb-4 md:mb-2 lg:mb-4 uppercase tracking-wider px-2">What's included:</h4>
                  <ul className="space-y-4 md:space-y-1 lg:space-y-4 px-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 md:gap-2 lg:gap-3 text-sm sm:text-sm md:text-[9px] lg:text-base text-[#475569]">
                        <svg className="w-5 h-5 md:w-3 md:h-3 lg:w-5 lg:h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto px-2">
                  <button
                    className={`w-full py-4 md:py-2 lg:py-4 rounded-[50px] text-base sm:text-base md:text-[10px] lg:text-base font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 active:translate-y-0
                      ${plan.popular ? 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed] shadow-[#8b5cf6]/20' : 'bg-transparent border-2 hover:text-white relative overflow-hidden group'}`}
                    style={{
                      color: plan.popular ? 'white' : plan.color,
                      borderColor: plan.color
                    }}
                  >
                    {!plan.popular && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[#6f86d6] to-[#4facfe] translate-y-full transition-transform duration-300 group-hover:translate-y-0 -z-10"></span>
                    )}
                    <span className="relative z-10">{plan.buttonText}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* GUARANTEE BOX */}
          <div className="flex flex-row items-center justify-center gap-3 p-4 sm:p-5 md:p-2 lg:p-5 bg-white rounded-[50px] max-w-[500px] md:max-w-[350px] lg:max-w-[500px] mt-12 sm:mt-16 md:mt-10 lg:mt-16 mx-auto shadow-[0_5px_20px_rgba(0,0,0,0.04)] border border-[#e2e8f0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 w-6 h-6 md:w-4 md:h-4 lg:w-6 lg:h-6">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" />
              <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm sm:text-sm md:text-[9px] lg:text-base text-[#475569] font-medium leading-tight">
              30-day money-back guarantee • No questions asked
            </span>
          </div>
        </div>
      </Container>
=======
    <div className="py-[60px] px-[30px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans max-md:py-10 max-md:px-5">
      <div className="text-center mb-10">
        <h1 className="text-[42px] font-bold text-[#1a237e] mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-1 after:bg-gradient-to-r after:from-[#3b82f6] after:via-[#8b5cf6] after:to-[#10b981] after:rounded-[2px] max-md:text-3xl max-sm:text-2xl">
          Simple, Transparent Pricing
        </h1>
        <p className="text-[#475569] text-xl max-w-[600px] mx-auto mt-6 max-md:text-lg max-sm:text-base">
          Choose the perfect plan for your business
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 mb-[50px] bg-white p-2 rounded-[60px] max-w-[350px] mx-auto shadow-[0_5px_15px_rgba(0,0,0,0.05)] max-md:max-w-[300px] max-sm:flex-col max-sm:bg-transparent max-sm:shadow-none max-sm:gap-2.5">
        <button
          className={`px-[30px] py-3 border-none rounded-[40px] text-base font-semibold cursor-pointer transition-all duration-300 flex-1 whitespace-nowrap max-sm:w-full max-sm:bg-white max-sm:text-[#1e293b] max-sm:border max-sm:border-[#e2e8f0] ${
            billingCycle === 'monthly' 
              ? 'bg-[#3b82f6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)] max-sm:bg-[#3b82f6] max-sm:text-white max-sm:border-[#3b82f6]' 
              : 'bg-transparent text-[#1e293b]'
          }`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`px-[30px] py-3 border-none rounded-[40px] text-base font-semibold cursor-pointer transition-all duration-300 flex-1 whitespace-nowrap max-sm:w-full max-sm:bg-white max-sm:text-[#1e293b] max-sm:border max-sm:border-[#e2e8f0] ${
            billingCycle === 'yearly' 
              ? 'bg-[#3b82f6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)] max-sm:bg-[#3b82f6] max-sm:text-white max-sm:border-[#3b82f6]' 
              : 'bg-transparent text-[#1e293b]'
          }`}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly <span className="bg-white/20 py-1 px-2 rounded-[20px] text-xs font-medium ml-2">Save 20%</span>
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-3 gap-[30px] mb-10 max-lg:grid-cols-2 max-md:grid-cols-1">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className={`bg-white rounded-[30px] p-10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative transition-all duration-300 border border-[#e2e8f0] flex flex-col h-full min-h-[600px] opacity-0 translate-y-5 card-visible hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] max-lg:min-h-[550px] max-md:p-8 ${
                plan.popular 
                  ? 'border-2 border-[#8b5cf6] shadow-[0_30px_50px_rgba(139,92,246,0.15)] scale-105 z-[2] hover:scale-105 hover:-translate-y-2 max-lg:col-span-2 max-lg:max-w-[500px] max-lg:mx-auto max-md:col-auto max-md:scale-100' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div 
                  className="absolute top-[-12px] left-1/2 -translate-x-1/2 text-white px-5 py-1.5 rounded-[30px] text-sm font-semibold whitespace-nowrap shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                  style={{ background: plan.color }}
                >
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6 pb-5 border-b border-[#e2e8f0]">
                <h3 className="text-[28px] font-bold text-[#1e293b] mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-0.5 mb-4">
                  <span className="text-2xl font-semibold text-[#64748b] self-start mt-1">₹</span>
                  <span className="text-5xl font-extrabold leading-none" style={{ color: plan.color }}>
                    {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-lg text-[#64748b] self-end mb-1">/{billingCycle === 'monthly' ? 'month' : 'yr'}</span>
                </div>
                <p className="text-[15px] text-[#64748b] leading-[1.5] min-h-[45px]">{plan.description}</p>
              </div>

              <div className="flex-1 mb-[30px]">
                <h4 className="text-base font-semibold text-[#1e293b] mb-5">What's included:</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[15px] text-[#475569]">
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center mt-auto">
                {plan.popular ? (
                  <button
                    className="w-full py-4 rounded-[50px] text-base font-semibold cursor-pointer transition-all duration-300 bg-[#8b5cf6] text-white border-none shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:bg-[#7c3aed] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(139,92,246,0.4)] active:translate-y-0"
                  >
                    {plan.buttonText}
                  </button>
                ) : (
                  <button
                    className="w-full py-4 text-base font-bold tracking-wide border-none rounded-[40px] cursor-pointer relative overflow-hidden z-10 transition-all duration-400 shadow-[0_10px_25px_rgba(72,198,239,0.4)] uppercase hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_35px_rgba(72,198,239,0.6)] active:translate-y-0 active:scale-98 before:content-[''] before:absolute before:top-[-50%] before:left-[-50%] before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-[#6f86d6] before:via-[#48c6ef] before:to-[#4facfe] before:skew-x-[-25deg] before:-translate-x-full before:transition-transform before:duration-700 before:ease-[cubic-bezier(0.34,1.56,0.64,1)] before:z-[-1] hover:before:translate-x-0"
                    style={{
                      color: plan.color,
                      border: `2px solid ${plan.color}`,
                      background: 'transparent'
                    }}
                  >
                    {plan.buttonText}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
<br />
<br />

        <div className="flex items-center justify-center gap-2.5 p-5 bg-white rounded-[50px] max-w-[500px] mx-auto shadow-[0_5px_15px_rgba(0,0,0,0.05)] max-sm:flex-col max-sm:text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" />
            <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] text-[#475569] font-medium">30-day money-back guarantee • No questions asked</span>
        </div>
      </div>
>>>>>>> 9bfd81b (my second git push)

      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default Pricing;