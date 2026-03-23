"use client";

import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from "@/components/SectionTitle";
import Container from "@/components/Container";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);
        
        const transformedPlans = [
          {
            name: 'Basic',
            price: { monthly: '16', yearly: '160' },
            description: "Perfect for men's clothing businesses",
            features: [
              'Rating: 3.9 ★ (120 reviews)',
              '30-day money-back guarantee',
              'Free updates',
              'Email support',
              'Priority customer support',
              'Advanced analytics'
            ],
            color: '#000000',
            buttonText: 'Start Basic',
            popular: false,
            productCount: sortedProducts.filter(p => p.price < 20).length
          },
          {
            name: 'Pro',
            price: { monthly: '695', yearly: '6,950' },
            description: "Perfect for jewelery businesses",
            features: [
              'Rating: 4.1 ★ (259 reviews)',
              '30-day money-back guarantee',
              'Free updates',
              'Email support',
              'Priority support',
              'Advanced analytics',
              'API access',
              'Custom reports'
            ],
            color: '#8b5cf6',
            buttonText: 'Start Pro',
            popular: true,
            productCount: sortedProducts.filter(p => p.price >= 20 && p.price < 100).length
          },
          {
            name: 'Enterprise',
            price: { monthly: '847', yearly: '8,470' },
            description: "Perfect for enterprise organizations",
            features: [
              'Rating: 4.7 ★ (500 reviews)',
              '30-day money-back guarantee',
              'Free updates',
              'Email support',
              'Priority customer support',
              'Custom integrations',
              'SLA guarantee',
              'Dedicated manager'
            ],
            color: '#000000',
            buttonText: 'Contact Sales',
            popular: false,
            productCount: sortedProducts.filter(p => p.price >= 100).length
          }
        ];

        setPlans(transformedPlans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pricing:', error);
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [plans]);

  if (loading) {
    return (
      <div className="py-20 bg-[#f8fafc] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans overflow-x-hidden">
      <Container size="default">

        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4">
            Choose the perfect plan for your business
          </p>
          <p className="text-xs text-[#8b5cf6] mt-2 font-medium">
            Live updates based on {plans.reduce((acc, p) => acc + p.productCount, 0)} catalog items
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center mb-12 bg-white p-1.5 rounded-full max-w-[340px] mx-auto shadow-sm border border-gray-100">
          <button
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-1 ${
              billingCycle === 'monthly' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#1e293b]'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-1 ${
              billingCycle === 'yearly' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#1e293b]'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded"></span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`bg-white rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative transition-all duration-500 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-10 
                ${plan.popular ? 'border-2 border-[#8b5cf6] lg:scale-105 z-20 shadow-purple-100' : 'z-10'}
                hover:-translate-y-2 hover:shadow-2xl hover:z-30`}
            >
              {plan.popular && (
                <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg" style={{ background: plan.color }}>
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8 pb-8 border-b border-gray-50">
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">{plan.name} Plan</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xl font-semibold text-gray-400">₹</span>
                  <span className="text-5xl font-extrabold" style={{ color: plan.color }}>
                    {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-sm text-[#64748b] mt-4 font-medium">{plan.description}</p>
              </div>

              <div className="flex-1 mb-8">
                <h4 className="text-[10px] font-black text-[#1e293b] mb-6 uppercase tracking-[0.2em]">What's included:</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#475569]">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button
                  className={`w-full py-4 rounded-full text-base font-bold transition-all duration-300 shadow-lg hover:brightness-110 active:scale-95
                    ${plan.popular ? 'bg-[#8b5cf6] text-white' : 'bg-white border-2 hover:bg-gray-50'}`}
                  style={{
                    color: plan.popular ? 'white' : plan.color,
                    borderColor: plan.popular ? 'transparent' : plan.color
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 border-t border-gray-100 pt-12">
          <div className="hidden lg:block w-[150px]" />

          <div className="flex flex-row items-center gap-4 py-3 px-8 bg-white rounded-full shadow-sm border border-gray-100">
            <div className="bg-blue-50 p-2 rounded-full">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm text-[#475569] font-semibold whitespace-nowrap">
              30-day money-back guarantee • No questions asked
            </span>
          </div>

          <a
            href="/pricing"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
          >
            <span>View All Plans</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

      </Container>

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