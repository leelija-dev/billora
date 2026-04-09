// components/Pricing.jsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from "@/components/SectionTitle";
import Container from "@/components/Container";
import { getPlans } from '@/services/pricingService';
import { useRouter } from "next/navigation";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const cardRefs = useRef([]);
  const router = useRouter();

  // Fetch plans from your Laravel API - always show only 3
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);

        const data = await getPlans();
        
        console.log('Full API Response:', data); // Debug log

        if (data.status === true && data.data) {
          const allPlans = data.data;
          console.log('All Plans:', allPlans); // Debug log
          
          // Check if business_types exists in plans
          allPlans.forEach((plan, idx) => {
            console.log(`Plan ${idx} - ${plan.name}:`, {
              hasBusinessTypes: !!plan.business_types,
              businessTypes: plan.business_types,
              discount: plan.discount,
              gst: plan.gst
            });
          });
          
          const limitedPlans = allPlans.slice(0, 3);

          // Extract all unique business types from all plans
          const businessTypesMap = new Map();
          
          limitedPlans.forEach(plan => {
            if (plan.business_types && Array.isArray(plan.business_types) && plan.business_types.length > 0) {
              console.log(`Business types for ${plan.name}:`, plan.business_types);
              plan.business_types.forEach(bt => {
                if (!businessTypesMap.has(bt.id)) {
                  businessTypesMap.set(bt.id, bt);
                }
              });
            } else {
              console.log(`No business types found for plan: ${plan.name}`);
            }
          });
          
          const uniqueBusinessTypes = Array.from(businessTypesMap.values());
          console.log('Unique Business Types:', uniqueBusinessTypes);
          setAllBusinessTypes(uniqueBusinessTypes);
          
          // Set default selected business type (first one if available)
          if (uniqueBusinessTypes.length > 0 && !selectedBusinessType) {
            setSelectedBusinessType(uniqueBusinessTypes[0]);
            console.log('Default selected business type:', uniqueBusinessTypes[0]);
          }

          const transformedPlans = limitedPlans.map((plan, index) => {
            const features = plan.features || [];

            const monthlyPrice = parseFloat(plan.price);
            const yearlyPrice = monthlyPrice * 10;
            
            // Calculate discounted prices if discount exists
            const discount = plan.discount || 0;
            const monthlyDiscountedPrice = monthlyPrice - (monthlyPrice * discount / 100);
            const yearlyDiscountedPrice = yearlyPrice - (yearlyPrice * discount / 100);
            
            // Calculate GST (default 18% if not provided)
            const gstRate = plan.gst || 18;

            // Create a map of business type ID to custom price
            const businessTypePrices = {};
            if (plan.business_types && Array.isArray(plan.business_types)) {
              plan.business_types.forEach(bt => {
                businessTypePrices[bt.id] = bt.custom_price || null;
              });
            }

            return {
              id: plan.id,
              name: plan.name,
              price: {
                monthly: monthlyPrice,
                yearly: yearlyPrice
              },
              displayPrice: {
                monthly: monthlyPrice.toLocaleString('en-IN'),
                yearly: yearlyPrice.toLocaleString('en-IN')
              },
              discountedPrice: {
                monthly: monthlyDiscountedPrice,
                yearly: yearlyDiscountedPrice
              },
              displayDiscountedPrice: {
                monthly: monthlyDiscountedPrice.toLocaleString('en-IN'),
                yearly: yearlyDiscountedPrice.toLocaleString('en-IN')
              },
              discount: discount,
              gst: gstRate,
              businessTypePrices: businessTypePrices,
              description: plan.description
                ? plan.description.replace(/<[^>]*>?/gm, "")
                : "",
              features: features,
              color: index === 1 ? '#8b5cf6' : '#000000',
              buttonText: `Start ${plan.name}`,
              popular: index === 1,
            };
          });

          console.log('Transformed Plans:', transformedPlans);
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

  // Get current price based on billing cycle, discount, and selected business type
  const getCurrentPrice = (plan) => {
    let basePrice;
    
    // Check if selected business type has custom pricing
    if (selectedBusinessType && plan.businessTypePrices[selectedBusinessType.id]) {
      basePrice = plan.businessTypePrices[selectedBusinessType.id];
      
      // Apply yearly multiplier if needed
      if (billingCycle === 'yearly') {
        basePrice = basePrice * 10;
      }
      
      return {
        price: basePrice,
        displayPrice: basePrice.toLocaleString('en-IN'),
        hasCustomPrice: true
      };
    }
    
    // Use regular pricing with discount
    if (plan.discount > 0) {
      basePrice = billingCycle === 'monthly' 
        ? plan.discountedPrice.monthly 
        : plan.discountedPrice.yearly;
    } else {
      basePrice = billingCycle === 'monthly' 
        ? plan.price.monthly 
        : plan.price.yearly;
    }
    
    return {
      price: basePrice,
      displayPrice: basePrice.toLocaleString('en-IN'),
      hasCustomPrice: false
    };
  };

  // Get original price for comparison
  const getOriginalPrice = (plan) => {
    if (selectedBusinessType && plan.businessTypePrices[selectedBusinessType.id]) {
      const customPrice = plan.businessTypePrices[selectedBusinessType.id];
      return {
        price: billingCycle === 'yearly' ? customPrice * 10 : customPrice,
        displayPrice: (billingCycle === 'yearly' ? customPrice * 10 : customPrice).toLocaleString('en-IN')
      };
    }
    
    return {
      price: billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly,
      displayPrice: billingCycle === 'monthly' ? plan.displayPrice.monthly : plan.displayPrice.yearly
    };
  };

  // Handle subscription click
  const handleSubscribe = (planId) => {
    const selectedPlan = plans.find(p => p.id === planId);
    const currentPriceData = getCurrentPrice(selectedPlan);
    const originalPriceData = getOriginalPrice(selectedPlan);
    const gstAmount = currentPriceData.price * (selectedPlan.gst / 100);
    const totalAmount = currentPriceData.price + gstAmount;
    
    const subscriptionData = {
      planId: planId,
      planName: selectedPlan.name,
      billingCycle: billingCycle,
      price: currentPriceData.price,
      discount: selectedPlan.discount,
      gst: selectedPlan.gst,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      businessType: selectedBusinessType,
      originalPrice: originalPriceData.price,
      hasCustomPrice: currentPriceData.hasCustomPrice
    };
    
    const token = localStorage.getItem("token");
    const targetUrl = `/pricing?plan=${planId}&cycle=${billingCycle}`;
    
    localStorage.setItem('selectedSubscription', JSON.stringify(subscriptionData));

    if (token) {
      router.push(targetUrl);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
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
    <div className="py-10 sm:py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-['Inter',system-ui,-apple-system,sans-serif] overflow-x-hidden">
      <Container size="default">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4 font-medium">
            Choose the perfect plan for your business. No hidden fees.
          </p>
        </div>

        {/* Business Type Dropdown and Billing Toggle */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
          {/* Billing Toggle */}
          <div className="relative bg-white p-1 rounded-full shadow-md border border-gray-200 inline-flex">
            <button
              className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 z-10 ${
                billingCycle === 'monthly' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 z-10 ${
                billingCycle === 'yearly' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
              <span className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                Save 20%
              </span>
            </button>
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out ${
                billingCycle === 'monthly' ? 'left-1' : 'left-[calc(50%-2px)]'
              }`}
            />
          </div>

          {/* Business Type Dropdown - Always visible if there are business types */}
          {allBusinessTypes.length > 0 ? (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Business Type:</span>
              </div>
              <select
                value={selectedBusinessType?.id || ''}
                onChange={(e) => {
                  const selected = allBusinessTypes.find(bt => bt.id === parseInt(e.target.value));
                  setSelectedBusinessType(selected);
                  console.log('Selected business type:', selected);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
              >
                {allBusinessTypes.map((businessType) => (
                  <option key={businessType.id} value={businessType.id}>
                    {businessType.name}
                  </option>
                ))}
              </select>
              {selectedBusinessType?.description && (
                <span className="text-xs text-gray-500 hidden md:inline-block">
                  {selectedBusinessType.description}
                </span>
              )}
            </div>
          ) : (
            /* Show message if no business types found */
            <div className="flex items-center gap-3 bg-yellow-50 px-4 py-2 rounded-full shadow-md border border-yellow-200">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-yellow-700">
                No business types available
              </span>
            </div>
          )}
        </div>

        {/* Debug Info - Remove in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Business Types Count: {allBusinessTypes.length}</p>
            <p>Selected Business Type: {selectedBusinessType?.name || 'None'}</p>
            <p>Plans Count: {plans.length}</p>
          </div>
        )} */}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 items-stretch px-4">
          {plans.slice(0, 3).map((plan, index) => {
            const currentPriceData = getCurrentPrice(plan);
            const originalPriceData = getOriginalPrice(plan);
            const hasDiscount = plan.discount > 0 || currentPriceData.hasCustomPrice;
            const gstAmount = currentPriceData.price * (plan.gst / 100);
            const totalAmount = currentPriceData.price + gstAmount;
            const isCustomPriceLower = currentPriceData.hasCustomPrice && currentPriceData.price < originalPriceData.price;
            
            return (
              <div
                key={plan.id || index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`
                  bg-white rounded-2xl p-8 shadow-lg relative transition-all duration-500 border flex flex-col 
                  opacity-0 translate-y-10 hover:-translate-y-2 hover:shadow-2xl
                  ${plan.popular 
                    ? 'border-2 border-purple-500 shadow-purple-100 lg:scale-105 z-20' 
                    : 'border-gray-200 hover:border-gray-300 z-10'
                  }
                  ${index === 2 && 'md:col-span-2 lg:col-span-1 md:max-w-md lg:max-w-none mx-auto lg:mx-0'}
                `}
                style={{
                  width: '100%'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8 pb-6 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  
                  {/* Price Display with Discount/Custom Price Badge */}
                  <div className="mb-4">
                    {(plan.discount > 0 || isCustomPriceLower) && (
                      <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full mb-3">
                        <span className="text-red-600 text-xs font-bold">
                          {isCustomPriceLower ? 'Special Price' : `${plan.discount}% OFF`}
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          ₹{originalPriceData.displayPrice}
                        </span>
                      </div>
                    )}
                    
                    {currentPriceData.hasCustomPrice && (
                      <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full mb-3 ml-2">
                        <span className="text-green-600 text-xs font-bold">
                          {selectedBusinessType?.name} Special
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-semibold text-gray-500">₹</span>
                      <span className="text-5xl font-bold" style={{ color: plan.color }}>
                        {currentPriceData.displayPrice}
                      </span>
                      <span className="text-gray-400 text-base font-medium">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    
                    {plan.gst > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        +{plan.gst}% GST applicable
                      </p>
                    )}
                    
                    {(plan.discount > 0 || isCustomPriceLower) && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        You save ₹{(originalPriceData.price - currentPriceData.price).toLocaleString('en-IN')}!
                      </p>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 font-medium">{plan.description}</p>
                </div>

                <div className="flex-1 mb-8">
                  <h4 className="text-xs font-bold text-gray-500 mb-5 uppercase tracking-wider">What's included</h4>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Summary with GST */}
                {/* <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Plan Price:</span>
                    <span className="font-semibold">₹{currentPriceData.displayPrice}</span>
                  </div>
                  {plan.gst > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">GST ({plan.gst}%):</span>
                      <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-1 border-t border-gray-200 mt-1">
                    <span className="font-bold text-gray-800">Total Amount:</span>
                    <span className="font-bold text-purple-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div> */}

                <div className="mt-auto pt-4">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all duration-300 hover:shadow-lg active:scale-95
                      ${plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600' 
                        : 'bg-white border-2 hover:bg-gray-50'
                      }`}
                    style={{
                      color: plan.popular ? 'white' : plan.color,
                      borderColor: plan.popular ? 'transparent' : plan.color
                    }}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 border-t border-gray-200 pt-12">
          <div className="hidden lg:block w-[150px]" />

          <div className="flex flex-row items-center gap-3 py-3 px-6 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <div className="bg-blue-50 p-2 rounded-full">
              <svg width="18" height="18" className="text-blue-600" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm text-gray-700 font-medium">
              30-day money-back guarantee • No questions asked
            </span>
          </div>

          <a
            href="/pricing"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>View All Plans</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </Container>

      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Tablet specific fixes */
        @media (min-width: 768px) and (max-width: 1023px) {
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            justify-items: center;
            align-items: start;
          }
          
          /* Make the third card span full width on tablet */
          .grid > :nth-child(3) {
            grid-column: span 2;
            max-width: 500px;
            width: 100%;
            margin: 0 auto;
          }
          
          /* Adjust popular card scale on tablet */
          .grid > :nth-child(2) {
            transform: scale(1.02);
            z-index: 20;
          }
          
          /* Prevent overlap on all cards */ 
          .grid > div {
            margin-bottom: 0;
            height: fit-content;
          }
        }
        
        /* Small tablet adjustments */
        @media (min-width: 768px) and (max-width: 900px) {
          .grid {
            gap: 1.25rem;
          }
          
          .grid > :nth-child(3) {
            max-width: 450px;
          }
        }
        
        /* Mobile landscape */
        @media (max-width: 767px) {
          .grid {
            gap: 1.5rem;
          }
          
          .grid > div {
            max-width: 100%;
            margin: 0;
          }
        }
        
        /* Large desktop */
        @media (min-width: 1280px) {
          .grid {
            gap: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Pricing;