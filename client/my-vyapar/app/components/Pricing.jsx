"use client";

import React, { useEffect, useRef, useState } from 'react';

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
      color: '#000000',
      buttonText: 'Start Basic',
      popular: false
    },
    {
      name: 'Pro',
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
      color: '#8b5cf6',
      buttonText: 'Start Pro',
      popular: true
    },
    {
      name: 'Enterprise',
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
      color: '#000000',
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="py-[60px] px-[30px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans max-md:py-10 max-md:px-5">
      <div className="text-center mb-10">
        <h1 className="text-[42px] font-bold text-[#1a237e] mb-4 relative inline-block after:content-[''] after:absolute after:bottom-[-12px] after:left-1/2 after:-translate-x-1/2 after:w-[100px] after:h-1 after:bg-gradient-to-r after:from-[#3b82f6] after:via-[#8b5cf6] after:to-[#10b981] after:rounded-[2px] max-md:text-3xl max-sm:text-2xl">
          Simple, Transparent Pricing
        </h1>
        <p className="text-[#475569] text-xl max-w-[600px] mx-auto mt-6 max-md:text-lg max-sm:text-base">
          Choose the perfect plan for your business
        </p>
      </div>

      {/* Billing Toggle */}
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

      {/* Pricing Container */}
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-3 gap-[30px] mb-10 max-lg:grid-cols-2 max-md:grid-cols-1">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={el => cardRefs.current[index] = el}
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

        {/* Money-back guarantee */}
        <div className="flex items-center justify-center gap-2.5 p-5 bg-white rounded-[50px] max-w-[500px] mx-auto shadow-[0_5px_15px_rgba(0,0,0,0.05)] max-sm:flex-col max-sm:text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" />
            <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] text-[#475569] font-medium">30-day money-back guarantee • No questions asked</span>
        </div>
      </div>

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