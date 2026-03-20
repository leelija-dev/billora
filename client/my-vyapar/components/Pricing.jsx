// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
"use client";

import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from "../components/SectionTitle";
import Container from "../components/Container";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        // Fetch from dummy API
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        
        // Sort products by price to create tiered plans
        const sortedProducts = [...products].sort((a, b) => a.price - b.price);
        
        // Calculate price ranges for 3 tiers
        const minPrice = sortedProducts[0].price;
        const maxPrice = sortedProducts[sortedProducts.length - 1].price;
        const range = maxPrice - minPrice;
        const tierSize = range / 3;
        
        // Group products into 3 tiers
        const basicTier = sortedProducts.filter(p => p.price <= minPrice + tierSize);
        const proTier = sortedProducts.filter(p => p.price > minPrice + tierSize && p.price <= minPrice + (tierSize * 2));
        const enterpriseTier = sortedProducts.filter(p => p.price > minPrice + (tierSize * 2));
        
        // Calculate average price for each tier
        const avgBasicPrice = basicTier.reduce((sum, p) => sum + p.price, 0) / basicTier.length;
        const avgProPrice = proTier.reduce((sum, p) => sum + p.price, 0) / proTier.length;
        const avgEnterprisePrice = enterpriseTier.reduce((sum, p) => sum + p.price, 0) / enterpriseTier.length;
        
        // Get unique categories for each tier
        const basicCategories = [...new Set(basicTier.map(p => p.category))];
        const proCategories = [...new Set(proTier.map(p => p.category))];
        const enterpriseCategories = [...new Set(enterpriseTier.map(p => p.category))];
        
        // Get sample products for features
        const basicSample = basicTier[0];
        const proSample = proTier[Math.floor(proTier.length / 2)];
        const enterpriseSample = enterpriseTier[enterpriseTier.length - 1];
        
        // Create exactly 3 plans matching your design
        const transformedPlans = [
          {
            name: 'Basic',
            price: {
              monthly: Math.round(avgBasicPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              yearly: Math.round(avgBasicPrice * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            description: `Perfect for ${basicCategories[0]?.split('-').join(' ') || 'small'} businesses`,
            features: [
              `Access to ${basicTier.length} premium products`,
              `Categories: ${basicCategories.slice(0, 2).join(', ')}`,
              `Featured: ${basicSample?.title.substring(0, 25)}...`,
              `Avg rating: ${(basicTier.reduce((sum, p) => sum + p.rating.rate, 0) / basicTier.length).toFixed(1)} ★`,
              `Email support`,
              `Basic inventory tracking`
            ],
            color: '#000000',
            buttonText: 'Start Basic',
            popular: false,
            productCount: basicTier.length
          },
          {
            name: 'Pro',
            price: {
              monthly: Math.round(avgProPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              yearly: Math.round(avgProPrice * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            description: `Ideal for ${proCategories[0]?.split('-').join(' ') || 'growing'} businesses`,
            features: [
              `Access to ${proTier.length} premium products`,
              `Categories: ${proCategories.slice(0, 3).join(', ')}`,
              `Featured: ${proSample?.title.substring(0, 25)}...`,
              `Avg rating: ${(proTier.reduce((sum, p) => sum + p.rating.rate, 0) / proTier.length).toFixed(1)} ★`,
              `Priority support`,
              `Advanced analytics`,
              `API access`,
              `Custom reports`
            ],
            color: '#8b5cf6',
            buttonText: 'Start Pro',
            popular: true,
            productCount: proTier.length
          },
          {
            name: 'Enterprise',
            price: {
              monthly: Math.round(avgEnterprisePrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              yearly: Math.round(avgEnterprisePrice * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            description: `For ${enterpriseCategories[0]?.split('-').join(' ') || 'enterprise'} organizations`,
            features: [
              `Access to ${enterpriseTier.length} premium products`,
              `Categories: ${enterpriseCategories.slice(0, 4).join(', ')}`,
              `Featured: ${enterpriseSample?.title.substring(0, 25)}...`,
              `Avg rating: ${(enterpriseTier.reduce((sum, p) => sum + p.rating.rate, 0) / enterpriseTier.length).toFixed(1)} ★`,
              `24/7 phone support`,
              `Dedicated manager`,
              `Custom integrations`,
              `SLA guarantee`,
              `On-premise option`
            ],
            color: '#000000',
            buttonText: 'Contact Sales',
            popular: false,
            productCount: enterpriseTier.length
          }
        ];
        
        setPlans(transformedPlans);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching pricing:', error);
        // Fallback to static data if API fails
        setPlans([
          {
            name: 'Basic',
            price: { monthly: '999', yearly: '9,999' },
            description: 'Perfect for small businesses just getting started',
            features: ['Up to 100 invoices/month', 'Basic GST reports', 'Single user', 'Email support', 'Cloud backup', 'Basic inventory'],
            color: '#000000',
            buttonText: 'Start Basic',
            popular: false
          },
          {
            name: 'Pro',
            price: { monthly: '1,999', yearly: '19,999' },
            description: 'Ideal for growing businesses with advanced needs',
            features: ['Unlimited invoices', 'Advanced GST reports', 'Up to 5 users', 'Priority support', 'Advanced inventory', 'Multi-user access', 'API access', 'Custom reports'],
            color: '#8b5cf6',
            buttonText: 'Start Pro',
            popular: true
          },
          {
            name: 'Enterprise',
            price: { monthly: '3,999', yearly: '39,999' },
            description: 'For large organizations with custom requirements',
            features: ['Unlimited everything', 'Custom integrations', 'Unlimited users', '24/7 phone support', 'Dedicated manager', 'SLA guarantee', 'Custom training', 'On-premise option'],
            color: '#000000',
            buttonText: 'Contact Sales',
            popular: false
          }
        ]);
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

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

    // Re-run observer when plans change
    setTimeout(() => {
      cardRefs.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }, 100);

    return () => observer.disconnect();
  }, [plans]);

  // Loading state
  if (loading) {
    return (
      <div className="py-10 sm:py-[60px] md:py-20 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-[60px] md:py-20 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans">
      <Container size="default">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-12 px-4 sm:px-0">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-base sm:text-lg md:text-xl lg:text-xl max-w-[600px] mx-auto mt-4 sm:mt-6 md:mt-8 lg:mt-4">
            Choose the perfect plan for your business
          </p>
          <p className="text-xs text-[#8b5cf6] mt-1">Based on {plans[0]?.productCount + plans[1]?.productCount + plans[2]?.productCount || 20} products</p>
        </div>

        {/* Toggle */}
        <div className="flex flex-row justify-center items-center gap-2 mb-8 sm:mb-[50px] md:mb-12 lg:mb-12 bg-white p-1.5 rounded-[60px] max-w-[340px] md:max-w-[380px] lg:max-w-[340px] mx-auto shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
          <button
            className={`px-4 sm:px-[30px] md:px-8 lg:px-[30px] py-3 sm:py-3 md:py-3 lg:py-3 border-none rounded-[40px] text-sm sm:text-base md:text-base lg:text-base font-semibold cursor-pointer transition-all duration-300 flex-1 whitespace-nowrap ${
              billingCycle === 'monthly' ? 'bg-[#3b82f6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]' : 'bg-transparent text-[#1e293b]'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 sm:px-[30px] md:px-8 lg:px-[30px] py-3 sm:py-3 md:py-3 lg:py-3 border-none rounded-[40px] text-sm sm:text-base md:text-base lg:text-base font-semibold cursor-pointer transition-all duration-300 flex-1 whitespace-nowrap ${
              billingCycle === 'yearly' ? 'bg-[#3b82f6] text-white shadow-[0_5px_15px_rgba(59,130,246,0.3)]' : 'bg-transparent text-[#1e293b]'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="bg-white/20 py-1 px-2 sm:py-1 sm:px-2 rounded-[20px] text-xs sm:text-xs md:text-xs lg:text-xs font-medium ml-1 sm:ml-2">Save 20%</span>
          </button>
        </div>

        {/* Pricing Cards - Exactly 3 cards */}
        <div className="w-full px-4 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8 mb-10 items-stretch">
            {plans.map((plan, index) => (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className={`bg-white rounded-[30px] p-6 sm:p-8 md:p-8 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative transition-all duration-500 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-5 card-visible hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] 
                  ${index === 2 ? "sm:col-span-2 lg:col-span-1 sm:max-w-[450px] sm:mx-auto lg:max-w-full" : ""} 
                  ${plan.popular ? 'border-2 border-[#8b5cf6] scale-105 z-10' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 text-white px-4 sm:px-5 md:px-6 lg:px-5 py-1.5 rounded-[30px] text-xs sm:text-sm md:text-sm lg:text-sm font-semibold whitespace-nowrap shadow-lg" style={{ background: plan.color }}>
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6 pb-6 md:mb-8 md:pb-8 lg:mb-6 lg:pb-6 border-b border-[#e2e8f0]">
                  <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-[#1e293b] mb-4 md:mb-6 lg:mb-4">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4 md:mb-6 lg:mb-4 flex-wrap px-2">
                    <span className="text-xl sm:text-xl md:text-2xl lg:text-xl font-semibold text-[#64748b]">₹</span>
                    <span className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold" style={{ color: plan.color }}>
                      {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-base sm:text-lg md:text-xl lg:text-lg text-[#64748b]">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <p className="text-sm sm:text-sm md:text-base lg:text-base text-[#64748b] leading-relaxed px-2">{plan.description}</p>
                  {plan.productCount && (
                    <p className="text-xs text-[#8b5cf6] mt-2 md:mt-3 lg:mt-1">{plan.productCount} products included</p>
                  )}
                </div>

                <div className="flex-1 mb-8 md:mb-10 lg:mb-8">
                  <h4 className="text-sm sm:text-sm md:text-base lg:text-sm font-semibold text-[#1e293b] mb-4 md:mb-6 lg:mb-4 uppercase tracking-wider px-2">What's included:</h4>
                  <ul className="space-y-4 md:space-y-3 lg:space-y-4 px-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 md:gap-4 lg:gap-3 text-sm sm:text-sm md:text-base lg:text-base text-[#475569]">
                        <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-5 lg:h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto px-2">
                  <button
                    className={`w-full py-4 md:py-5 lg:py-4 rounded-[50px] text-base sm:text-base md:text-lg lg:text-base font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 active:translate-y-0
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

          {/* Bottom Section - View All Plans and Guarantee in ONE ROW */}
          <div className="flex flex-col sm:flex-row md:flex-row items-center justify-between gap-4 mt-8 mb-4 px-4">
            {/* View All Plans Button - Left Side */}
            <a 
              href="/pricing" 
              className="group inline-flex items-center gap-2 px-6 md:px-8 lg:px-6 py-3 md:py-4 lg:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-sm md:text-base lg:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto md:w-auto justify-center"
            >
              <span>View All Plans</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>

            {/* GUARANTEE BOX - Right Side */}
            <div className="flex flex-row items-center justify-center   gap-3 p-4 sm:p-5 md:p-5 lg:p-5 bg-white rounded-[50px] shadow-[0_5px_20px_rgba(0,0,0,0.04)] border border-[#e2e8f0] w-full sm:w-auto md:w-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-sm sm:text-sm md:text-base lg:text-base text-[#475569] font-medium leading-tight">
                30-day money-back guarantee • No questions asked
              </span>
            </div>
          </div>
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