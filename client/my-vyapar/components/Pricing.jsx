// components/Pricing.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Container from "@/components/Container";
import { usePricingStore } from "../store/pricingStore";
import { useAuthStore } from "../store/authStoreZustand";
import { useFilterStore } from "../store/filterStore";
import { useRouter } from "next/navigation";
import businessService from "../services/businessService";
import { apiRequest } from "../utils/api";

const Pricing = ({ limit = 3, showFilters = true, showViewAllButton = true }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const {
    plans,
    loading,
    error,
    selectedPlan,
    categories,
    businessTypes,
    fetchPlans,
    selectPlan,
    subscribeToPlan,
    clearError
  } = usePricingStore();
  
  const {
    filters,
    updateFilter,
    searchPlans: searchWithFilters,
    setSortBy
  } = useFilterStore();
  const [pendingPlan, setPendingPlan] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState("all");
  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [subscribing, setSubscribing] = useState(null);
  const cardRefs = useRef([]);
  const router = useRouter();

  // Use Zustand auth store instead of manual localStorage
  const { user, token, isLoggedIn, hasActivePlan } = useAuthStore();

  // Load business types from API
  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        // Use the correct business types endpoint
        const response = await apiRequest("/business-type/", "GET");
        
        let businessTypeData = [];
        
        // Handle different response formats from backend
        if (response?.status === true && Array.isArray(response?.data)) {
          businessTypeData = response.data;
        } else if (Array.isArray(response)) {
          businessTypeData = response;
        } else if (response?.data && Array.isArray(response.data)) {
          businessTypeData = response.data;
        }
        
        if (businessTypeData.length > 0) {
          setAllBusinessTypes(businessTypeData);
          console.log("Business types loaded:", businessTypeData);
        } else {
          console.warn("No business types found in API response");
        }
      } catch (err) {
        console.error("Business type fetch error:", err);
      }
    };

    loadBusinessTypes();
  }, []);

  // Fetch plans from Laravel API
  const transformPlan = (plan, index) => {
    console.log("transformPlan called with:", plan, typeof plan);
    
    const features = plan.features || [];
    const monthlyPrice = parseFloat(plan.price);
    // Use yearly price from API if available, otherwise calculate with multiplier from API or default to 12
    const yearlyPrice = plan.price?.yearly ? parseFloat(plan.price.yearly) : monthlyPrice * (plan.yearly_multiplier || 12);
    const discount = parseFloat(plan.discount) || 0;
    const monthlyDiscountedPrice = monthlyPrice - (monthlyPrice * discount / 100);
    const yearlyDiscountedPrice = yearlyPrice - (yearlyPrice * discount / 100);
    const gstRate = parseFloat(plan.gst) || 0;

    const transformedBusinessTypes = (plan.business_types || []).map((bt) => ({
      id: bt.business_type?.id || bt.id,
      name: bt.business_type?.name || bt.name,
      plan_id: bt.plan_id,
      business_type_id: bt.business_type_id,
      custom_price: bt.custom_price || null,
    }));

    const supportedBusinessTypeIds = transformedBusinessTypes.map((bt) => bt.id);

    return {
      id: plan.id,
      name: plan.name,
      price: {
        monthly: monthlyPrice,
        yearly: yearlyPrice,
      },
      displayPrice: {
        monthly: monthlyPrice.toLocaleString("en-IN"),
        yearly: yearlyPrice.toLocaleString("en-IN"),
      },
      discountedPrice: {
        monthly: monthlyDiscountedPrice,
        yearly: yearlyDiscountedPrice,
      },
      displayDiscountedPrice: {
        monthly: monthlyDiscountedPrice.toLocaleString("en-IN"),
        yearly: yearlyDiscountedPrice.toLocaleString("en-IN"),
      },
      discount: discount,
      gst: gstRate,
      businessTypes: transformedBusinessTypes,
      supportedBusinessTypeIds: supportedBusinessTypeIds,
      description: plan.description ? plan.description.replace(/<[^>]*>?/gm, "") : "",
      features: features,
      color: index === 1 ? "#8b5cf6" : "#000000",
      buttonText: `Select Plan`,
      popular: index === 1,
    };
  };

  const transformPlans = (plansData) => {
    console.log("transformPlans called with:", plansData, typeof plansData, Array.isArray(plansData));
    
    if (!Array.isArray(plansData)) {
      console.error("transformPlans expected array but got:", typeof plansData, plansData);
      return [];
    }
    
    return plansData.map((plan, index) => transformPlan(plan, index));
  };

  const filterPlansByBusinessType = async (businessTypeId) => {
    try {
      if (businessTypeId === "all") {
        // Use store methods to get all plans
        await fetchPlans();
        let transformedPlans = plans.map(transformPlan);
        
        // Apply limit if specified
        if (limit && limit > 0) {
          transformedPlans = transformedPlans.slice(0, limit);
        }
        
        console.log("Setting filteredPlans with:", transformedPlans, "Length:", transformedPlans.length);
        setFilteredPlans(transformedPlans);
      } else {
        // Use filter store to search by business type (send 'all' for all plans or business type id)
        const searchValue = businessTypeId === "all" ? "all" : businessTypeId;
        updateFilter('search', searchValue);
        const searchResults = await searchWithFilters();
        console.log("Search results:", searchResults);
        
        if (searchResults && searchResults.length > 0) {
          let transformedPlans = searchResults.map(transformPlan);
          
          // Apply limit if specified
          if (limit && limit > 0) {
            transformedPlans = transformedPlans.slice(0, limit);
          }
          
          console.log("Setting filteredPlans with search results:", transformedPlans, "Length:", transformedPlans.length);
          setFilteredPlans(transformedPlans);
        } else {
          console.log("No search results found, setting filteredPlans to empty array");
          setFilteredPlans([]);
        }
      }
    } catch (error) {
      console.error("Error filtering plans:", error);
      setFilteredPlans([]);
    }
  };

  // Initial plans fetch
  useEffect(() => {
    const loadPlans = async () => {
      try {
        await fetchPlans();
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    loadPlans();
  }, [limit, fetchPlans]);

  // Update filteredPlans when plans are available
  useEffect(() => {
    console.log("Main plans useEffect triggered - plans length:", plans?.length);
    if (plans && plans.length > 0) {
      let transformedPlans = plans.map(transformPlan);
      
      // Apply limit if specified
      if (limit && limit > 0) {
        transformedPlans = transformedPlans.slice(0, limit);
      }
      
      console.log("Main useEffect - Setting filteredPlans with:", transformedPlans, "Length:", transformedPlans.length);
        setFilteredPlans(transformedPlans);
    }
  }, [plans, limit, fetchPlans]);

  // Filter plans based on selected business type
  useEffect(() => {
    console.log("Business type filter useEffect triggered - selectedBusinessType:", selectedBusinessType, "plans length:", plans?.length);
    if (showFilters && plans && plans.length > 0) {
      filterPlansByBusinessType(selectedBusinessType);
    }
  }, [selectedBusinessType, showFilters, plans]);

  const getCurrentPrice = (plan) => {
    let basePrice;

    if (selectedBusinessType !== "all" && showFilters) {
      const businessTypeForPlan = plan.businessTypes?.find(
        (bt) => bt.id === parseInt(selectedBusinessType)
      );

      if (businessTypeForPlan && businessTypeForPlan.custom_price) {
        basePrice = businessTypeForPlan.custom_price;
        return {
          price: basePrice,
          displayPrice: basePrice.toLocaleString("en-IN"),
          hasCustomPrice: true,
        };
      }
    }

    if (plan.discount > 0) {
      basePrice = plan.discountedPrice.monthly;
    } else {
      basePrice = plan.price.monthly;
    }

    return {
      price: basePrice,
      displayPrice: basePrice.toLocaleString("en-IN"),
      hasCustomPrice: false,
    };
  };

  const getOriginalPrice = (plan) => {
    if (selectedBusinessType !== "all" && showFilters) {
      const businessTypeForPlan = plan.businessTypes?.find(
        (bt) => bt.id === parseInt(selectedBusinessType)
      );

      if (businessTypeForPlan && businessTypeForPlan.custom_price) {
        const customPrice = businessTypeForPlan.custom_price;
        return {
          price: customPrice,
          displayPrice: customPrice.toLocaleString("en-IN"),
        };
      }
    }

    return {
      price: plan.price.monthly,
      displayPrice: plan.displayPrice.monthly,
    };
  };

  const handleSubscribe = async (plan) => {
    console.log("handleSubscribe called with plan:", plan.name, "isLoggedIn:", isLoggedIn);
    
    const currentPriceData = getCurrentPrice(plan);
    const originalPriceData = getOriginalPrice(plan);
    const gstAmount = currentPriceData.price * (plan.gst / 100);
    const totalAmount = currentPriceData.price + gstAmount;

    const selectedPlanData = {
      id: plan.id,
      name: plan.name,
      billingCycle: "monthly",
      price: currentPriceData.price,
      displayPrice: currentPriceData.displayPrice,
      originalPrice: originalPriceData.price,
      discount: plan.discount,
      gst: plan.gst,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      businessType: selectedBusinessType !== "all" && showFilters
        ? allBusinessTypes.find((bt) => bt.id === parseInt(selectedBusinessType))
        : plan.businessTypes?.[0] || null,
      hasCustomPrice: currentPriceData.hasCustomPrice,
    };

    if (!isLoggedIn) {
      console.log("User not logged in, showing login modal");
      setPendingPlan(selectedPlanData);
      setShowLoginModal(true);
      return;
    }

    console.log("User is logged in, proceeding to order summary");
    selectPlan(selectedPlanData);
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));
    router.push("/order-summary");
  };

  const proceedToOrderSummary = (selectedPlan) => {
    selectPlan(selectedPlan);
    router.push("/order-summary");
  };

  const handleLoginRedirect = () => {
    localStorage.setItem("redirectAfterLogin", "/pricing");
    if (pendingPlan) {
      localStorage.setItem("pendingPlan", JSON.stringify(pendingPlan));
    }
    router.push("/login");
  };

  useEffect(() => {
    const checkPendingPlanAfterLogin = () => {
      const pendingPlanStr = localStorage.getItem("pendingPlan");

      if (isLoggedIn && pendingPlanStr) {
        const pendingPlanData = JSON.parse(pendingPlanStr);
        localStorage.removeItem("pendingPlan");
        localStorage.removeItem("redirectAfterLogin");
        proceedToOrderSummary(pendingPlanData);
      }
    };

    checkPendingPlanAfterLogin();
  }, [router, isLoggedIn]);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: "0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("card-visible");
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredPlans]);

  const LoginModal = () => {
    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-600">Please login to continue with your subscription</p>
            {pendingPlan && (
              <p className="text-sm text-purple-600 mt-2 font-medium">
                Plan: {pendingPlan.name} • ₹{pendingPlan.displayPrice}/month
              </p>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-300"
            >
              Login Now
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-[400px] flex items-center justify-center">
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
    );
  }

  const displayPlans = showFilters ? filteredPlans : (plans && plans.length > 0 ? plans.slice(0, limit) : []);
  
  // Debug logging
  console.log("Pricing Component Debug:", {
    showFilters,
    plansLength: plans?.length || 0,
    filteredPlansLength: filteredPlans?.length || 0,
    displayPlansLength: displayPlans?.length || 0,
    limit
  });

  return (
    <div className="py-10 sm:py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-['Inter',system-ui,-apple-system,sans-serif] overflow-x-hidden">
      <Container size="default">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4 font-medium">
            Choose the perfect plan for your business. No hidden fees.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
          {/* Business Type Dropdown */}
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-md border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-1.5 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Business Type:</span>
            </div>
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white cursor-pointer"
              disabled={allBusinessTypes.length === 0}
            >
              <option value="all">All Business Types</option>
              {allBusinessTypes.length > 0 ? (
                allBusinessTypes.map((businessType) => (
                  <option key={businessType.id} value={businessType.id}>
                    {businessType.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>Loading business types...</option>
              )}
            </select>
            {allBusinessTypes.length === 0 && (
              <span className="text-xs text-red-500">Loading...</span>
            )}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {displayPlans.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Plans Found</h3>
            <p className="text-gray-600">No plans available for this business type. Please try another selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 items-stretch px-4">
            {displayPlans.map((plan, index) => {
              const isPopular = plan.popular;
              const currentPriceData = getCurrentPrice(plan);
              const originalPriceData = getOriginalPrice(plan);

              return (
                <div
                  key={plan.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`bg-white rounded-2xl p-8 shadow-lg relative transition-all duration-500 border flex flex-col opacity-0 translate-y-10 hover:-translate-y-2 hover:shadow-2xl
                    ${isPopular 
                      ? 'border-2 border-purple-500 shadow-purple-100 scale-100 lg:scale-105 z-20 pt-10' 
                      : 'border-gray-200 hover:border-gray-300 z-10'
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-8 pb-6 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {plan.name.charAt(0).toUpperCase() + plan.name.slice(1).toLowerCase()}
                    </h3>

                    <div className="mb-4">
                      {(plan.discount > 0 || currentPriceData.hasCustomPrice) && (
                        <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full mb-3">
                          <span className="text-red-600 text-xs font-bold">
                            {currentPriceData.hasCustomPrice ? `Special Price` : `${plan.discount}% OFF`}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ₹{originalPriceData.displayPrice}
                          </span>
                        </div>
                      )}

                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-semibold text-gray-500">₹</span>
                        <span className="text-5xl font-bold" style={{ color: isPopular ? '#8b5cf6' : '#000000' }}>
                          {currentPriceData.displayPrice}
                        </span>
                        <span className="text-gray-400 text-base font-medium">/ month</span>
                      </div>

                      {(plan.discount > 0 || currentPriceData.hasCustomPrice) && (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          🎉 You save ₹{(originalPriceData.price - currentPriceData.price).toLocaleString('en-IN')}!
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 font-medium">{plan.description}</p>
                  </div>

                  <div className="flex-1 mb-8">
                    <h4 className="text-xs font-bold text-gray-500 mb-5 uppercase tracking-wider">included Features :</h4>
                    <ul className="space-y-3.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke={isPopular ? '#8b5cf6' : '#000000'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={subscribing === plan.id}
                      className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all duration-300 hover:shadow-lg active:scale-95
                        ${isPopular 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600' 
                          : 'bg-white border-2 hover:bg-gray-50'
                        }
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
        )}

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
            <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
              30-day money-back guarantee • No questions asked
            </span>
          </div>

          {showViewAllButton && (
            <a
              href="/pricing"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>View All Plans</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </Container>

      <LoginModal />

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
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Pricing;