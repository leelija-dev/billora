// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
// JUST USED A DUMMY API ''FOR CHECKING THE PRICE PAGE LAYOUT ALOS ADDED IN THE COMPONENT PRICING PAGE AS WELL
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "../../components/SectionTitle";
import Container from "../../components/Container";

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
        
        // Transform API data to match your pricing card design
        const transformedPlans = products.map((product, index) => {
          // Make some plans popular (every 3rd item)
          const isPopular = (index + 1) % 3 === 0;
          
          // Alternate colors
          const colors = ['#000000', '#8b5cf6', '#000000', '#8b5cf6'];
          const buttonTexts = ['Start Basic', 'Start Pro', 'Contact Sales', 'Choose Plan'];
          
          // Generate features based on product data
          const features = [
            `Premium ${product.category}`,
            `Includes: ${product.title.substring(0, 25)}...`,
            `Rating: ${product.rating.rate} ★ (${product.rating.count} reviews)`,
            `30-day money-back guarantee`,
            `Free updates`,
            `Email support`,
          ];
          
          // Add more features for some plans
          if (product.price > 50) {
            features.push('Priority customer support');
          }
          if (product.price > 100) {
            features.push('Advanced analytics');
          }
          if (product.price > 500) {
            features.push('API access');
            features.push('Custom integrations');
          }
          
          return {
            id: product.id,
            name: product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Plan',
            price: {
              monthly: Math.round(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              yearly: Math.round(product.price * 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            },
            description: `Perfect for ${product.category} businesses`,
            features: features.slice(0, 8), // Keep 6-8 features like your design
            color: colors[index % colors.length],
            buttonText: buttonTexts[index % buttonTexts.length],
            popular: isPopular
          };
        });
        
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="py-10 sm:py-[60px] md:py-12 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading pricing plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-10 sm:py-[60px] md:py-12 lg:py-[60px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans">
        <Container size="default">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-8 lg:mb-12 px-4 sm:px-0">
            <SectionTitle title="Simple, Transparent Pricing" />
            <p className="text-[#475569] text-base sm:text-lg md:text-sm lg:text-xl max-w-[600px] mx-auto mt-4 sm:mt-6 md:mt-3 lg:mt-4">
              Choose the perfect plan for your business
            </p>
            <p className="text-sm text-[#8b5cf6] mt-2">{plans.length} plans available</p>
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

          {/* Pricing Cards - Dynamic grid that adjusts based on number of plans */}
          <div className="w-full px-4 sm:px-0">
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
              plans.length > 6 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
            } gap-6 md:gap-4 lg:gap-6 mb-10 items-stretch`}>
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
                  className={`bg-white rounded-[30px] p-6 sm:p-8 md:p-5 lg:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative transition-all duration-500 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-5 card-visible hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] 
                    ${plan.popular ? 'border-2 border-[#8b5cf6] scale-105 z-10' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 text-white px-4 sm:px-5 md:px-3 lg:px-4 py-1.5 rounded-[30px] text-xs sm:text-sm md:text-[10px] lg:text-xs font-semibold whitespace-nowrap shadow-lg" style={{ background: plan.color }}>
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-6 pb-6 md:mb-4 md:pb-4 lg:mb-5 lg:pb-5 border-b border-[#e2e8f0]">
                    <h3 className="text-2xl sm:text-2xl md:text-xl lg:text-2xl font-bold text-[#1e293b] mb-4 md:mb-3 lg:mb-3">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1 mb-4 md:mb-3 lg:mb-3 flex-wrap px-2">
                      <span className="text-xl sm:text-xl md:text-lg lg:text-xl font-semibold text-[#64748b]">₹</span>
                      <span className="text-4xl sm:text-4xl md:text-3xl lg:text-4xl font-extrabold" style={{ color: plan.color }}>
                        {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                      </span>
                      <span className="text-base sm:text-lg md:text-sm lg:text-base text-[#64748b]">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <p className="text-sm sm:text-sm md:text-xs lg:text-sm text-[#64748b] leading-relaxed px-2">{plan.description}</p>
                  </div>

                  <div className="flex-1 mb-8 md:mb-6 lg:mb-6">
                    <h4 className="text-sm sm:text-sm md:text-xs lg:text-sm font-semibold text-[#1e293b] mb-4 md:mb-3 lg:mb-3 uppercase tracking-wider px-2">What's included:</h4>
                    <ul className="space-y-4 md:space-y-3 lg:space-y-3 px-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 md:gap-2 lg:gap-2 text-sm sm:text-sm md:text-xs lg:text-sm text-[#475569]">
                          <svg className="w-5 h-5 md:w-4 md:h-4 lg:w-4 lg:h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto px-2">
                    <button
                      className={`w-full py-4 md:py-3 lg:py-3 rounded-[50px] text-base sm:text-base md:text-sm lg:text-base font-bold transition-all duration-300 shadow-lg hover:-translate-y-1 active:translate-y-0
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
            <div className="flex flex-row items-center justify-center gap-3 p-4 sm:p-5 md:p-3 lg:p-4 bg-white rounded-[50px] max-w-[500px] md:max-w-[400px] lg:max-w-[450px] mt-12 sm:mt-16 md:mt-12 lg:mt-14 mx-auto shadow-[0_5px_20px_rgba(0,0,0,0.04)] border border-[#e2e8f0]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 w-6 h-6 md:w-5 md:h-5 lg:w-5 lg:h-5">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-sm sm:text-sm md:text-xs lg:text-sm text-[#475569] font-medium leading-tight">
                30-day money-back guarantee • No questions asked
              </span>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </>
  );
};

export default Pricing;