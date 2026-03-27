"use client";

import React, { useEffect, useRef, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "../../components/SectionTitle";
import Container from "../../components/Container";
import { getPlans } from '@/services/pricingService';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [subscribeMessage, setSubscribeMessage] = useState(null);
  const cardRefs = useRef([]);

  // Fetch plans from Laravel API - SHOW ALL PLANS
 useEffect(() => {
   const fetchPlans = async () => {
     try {
       setLoading(true);
 
       const data = await getPlans();
 
       if (data.status === true && data.data) {
         const allPlans = data.data;
        const limitedPlans = allPlans; // show ALL plans
 
         const transformedPlans = limitedPlans.map((plan, index) => {
       const features = plan.features || [];
 
           const monthlyPrice = parseFloat(plan.price);
           const yearlyPrice = monthlyPrice * 10;
 
           return {
             id: plan.id,
             name: plan.name,
             price: {
               monthly: monthlyPrice.toLocaleString('en-IN'),
               yearly: yearlyPrice.toLocaleString('en-IN')
             },
             description: plan.description
   ? plan.description.replace(/<[^>]*>?/gm, "")
   : "",
             features: features,
             color: index === 1 ? '#8b5cf6' : '#000000',
             buttonText: `Start ${plan.name}`,
             popular: index === 1,
           };
         });
 
         setPlans(transformedPlans);
       } else {
         setError(data.message || "Failed to fetch plans");
       }
     } catch (error) {
       console.error('Error fetching plans:', error);
       setError("Something went wrong");
     } finally {
       setLoading(false);
     }
   };
 
   fetchPlans();
 }, []);

  // Handle subscription
  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    setSubscribeMessage(null);
    
    try {
    const data = await response.json();
console.log("SUBSCRIBE RESPONSE:", data);
      
      if (data.status === true) {
        setSubscribeMessage({
          type: 'success',
          text: data.message || 'Subscription successful! Redirecting to dashboard...'
        });
        
        // Save subscription info to localStorage
        if (data.data) {
          localStorage.setItem('subscription', JSON.stringify(data.data));
        }
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setSubscribeMessage({
          type: 'error',
          text: data.message || 'Subscription failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setSubscribing(null);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscribeMessage(null);
      }, 5000);
    }
  };

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
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Plans</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (plans.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Plans Available</h3>
            <p className="text-gray-600">Please check back later for pricing plans.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans">
        <Container size="default">
          
          {/* Success/Error Message */}
          {subscribeMessage && (
            <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${
              subscribeMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              <p className="font-medium">{subscribeMessage.text}</p>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center mb-12">
            <SectionTitle title="Simple, Transparent Pricing" />
            <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4">
              Choose the perfect plan for your business
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
              Yearly <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Save 20%</span>
            </button>
          </div>

          {/* Pricing Cards Grid - SHOW ALL PLANS */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(plans.length, 3)} gap-8 mb-16 items-stretch px-4`}>
            {plans.map((plan, index) => {
              const isPopular = index === 1; // Make second plan popular
              
              return (
                <div
                  key={plan.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`bg-white rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative transition-all duration-300 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-10 
                    ${isPopular ? 'border-2 border-[#8b5cf6] lg:scale-[1.02] z-20 shadow-purple-100' : 'z-10'}
                    hover:-translate-y-1 hover:shadow-xl hover:z-30`}
                >
                  {isPopular && (
                    <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg bg-[#8b5cf6]">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-8 pb-8 border-b border-gray-50">
                    <h3 className="text-2xl font-bold text-[#1e293b] mb-4">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-xl font-semibold text-gray-400">₹</span>
                      <span className="text-5xl font-extrabold" style={{ color: isPopular ? '#8b5cf6' : '#000000' }}>
                        {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                      </span>
                      <span className="text-gray-400 text-sm font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    <p className="text-sm text-[#64748b] mt-4 font-medium">{plan.description}</p>
                    {plan.duration_days && (
                      <p className="text-xs text-gray-400 mt-2">{plan.duration_days} days validity</p>
                    )}
                  </div>

                  <div className="flex-1 mb-8">
                    <h4 className="text-[10px] font-black text-[#1e293b] mb-6 uppercase tracking-[0.2em]">What's included:</h4>
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#475569]">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke={isPopular ? '#8b5cf6' : '#000000'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={subscribing === plan.id}
                      className={`w-full py-4 rounded-full text-base font-bold transition-all duration-300 shadow-md hover:brightness-105 active:scale-95
                        ${isPopular ? 'bg-[#8b5cf6] text-white' : 'bg-white border-2 hover:bg-gray-50'}
                        ${subscribing === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{
                        color: isPopular ? 'white' : '#000000',
                        borderColor: isPopular ? 'transparent' : '#000000'
                      }}
                    >
                      {subscribing === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        plan.buttonText
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
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
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <span>Need Help?</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

        </Container>
      </div>
      <Footer />

      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Pricing;