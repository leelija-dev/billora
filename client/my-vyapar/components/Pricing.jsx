// components/Pricing.jsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from "@/components/SectionTitle";
import Container from "@/components/Container";
import { apiRequest } from '@/utils/api'; // Import your API utility

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use your apiRequest utility to fetch plans
        const data = await apiRequest('/plans/', 'GET');
        
        // Transform API data to match your component's expected format
        const transformedPlans = data.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: {
            monthly: plan.monthly_price?.toString() || plan.price_monthly?.toString() || '0',
            yearly: plan.yearly_price?.toString() || plan.price_yearly?.toString() || '0'
          },
          description: plan.description || `Perfect for ${plan.name.toLowerCase()} businesses`,
          features: plan.features || [
            '30-day money-back guarantee',
            'Free updates',
            'Email support',
            'Priority customer support'
          ],
          color: plan.color || (plan.popular ? '#8b5cf6' : '#000000'),
          buttonText: plan.button_text || plan.cta_text || `Start ${plan.name}`,
          popular: plan.popular || false,
          productCount: plan.product_count || 0
        }));
        
        setPlans(transformedPlans);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pricing plans:', error);
        
        setError(error.message || 'Failed to load pricing plans');
        setLoading(false);
        
        // Set fallback data in case API fails
        setPlans([
          {
            id: 1,
            name: 'Basic',
            price: { monthly: '29', yearly: '290' },
            description: "Perfect for startups",
            features: [
              '30-day money-back guarantee',
              'Free updates',
              'Email support',
              'Basic analytics'
            ],
            color: '#000000',
            buttonText: 'Start Basic',
            popular: false,
            productCount: 0
          },
          {
            id: 2,
            name: 'Pro',
            price: { monthly: '99', yearly: '990' },
            description: "Perfect for growing businesses",
            features: [
              '30-day money-back guarantee',
              'Free updates',
              'Email support',
              'Priority support',
              'Advanced analytics',
              'API access'
            ],
            color: '#8b5cf6',
            buttonText: 'Start Pro',
            popular: true,
            productCount: 0
          },
          {
            id: 3,
            name: 'Enterprise',
            price: { monthly: '299', yearly: '2990' },
            description: "Perfect for large organizations",
            features: [
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
            productCount: 0
          }
        ]);
      }
    };

    fetchPricingData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchPricingData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Intersection Observer for animations
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
      <div className="py-20 bg-[#f8fafc] min-h-[90vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-[#f8fafc] min-h-[90vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4 font-semibold">{error}</p>
          <p className="text-gray-600 mb-6 text-sm">Showing fallback data while we fix the connection issue.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-[1vh] font-sans overflow-x-hidden">
      <Container size="default">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4">
            Choose the perfect plan for your business
          </p>
          <p className="text-xs text-[#8b5cf6] mt-2 font-medium">
            Live updates based on {plans.reduce((acc, p) => acc + (p.productCount || 0), 0)} catalog items
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
              key={plan.id || index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`bg-white rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative transition-all duration-300 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-10 
                ${plan.popular ? 'border-2 border-[#8b5cf6] lg:scale-[1.02] z-20 shadow-purple-100' : 'z-10'}
                hover:-translate-y-1 hover:shadow-xl hover:z-30
                ${index === plans.length - 1 && plans.length === 3 ? 'md:col-start-2 lg:col-start-auto' : ''}`}
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
                  className={`w-full py-4 rounded-full text-base font-bold transition-all duration-300 shadow-md hover:brightness-105 active:scale-95
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

          <div className="flex flex-row items-center gap-3 sm:gap-4 py-2 sm:py-3 px-4 sm:px-8 bg-white rounded-full shadow-sm border border-gray-100">
            <div className="bg-blue-50 p-1 sm:p-2 rounded-full">
              <svg width="16" height="16" className="sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm text-[#475569] font-semibold whitespace-nowrap">
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
        
        @media (min-width: 768px) and (max-width: 1023px) {
          .grid > :last-child:nth-child(3) {
            grid-column: span 2;
            justify-self: center;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Pricing;