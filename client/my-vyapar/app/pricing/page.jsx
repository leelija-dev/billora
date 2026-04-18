"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "../../components/SectionTitle";
import Container from "../../components/Container";
import { getPlans } from "@/services/pricingService";
import { getBusinessTypes as fetchBusinessTypes } from "@/services/bussinessService";
import { searchPlans } from "@/services/filterService"; // 👈 ADD THIS IMPORT
import { useRouter } from "next/navigation";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [subscribeMessage, setSubscribeMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState("all");
  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const cardRefs = useRef([]);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const userData = localStorage.getItem("user_data");

      setIsLoggedIn(!!(token || userData));
    };

    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

// Load business types from API
useEffect(() => {
  const loadBusinessTypes = async () => {
    try {
      console.log("🌐 Fetching business types from API...");
      const response = await fetchBusinessTypes();
      
      console.log("Business types API response:", response);
      
      let businessTypeData = [];
      
      if (response?.status === true && Array.isArray(response?.data)) {
        businessTypeData = response.data;
      } else if (Array.isArray(response)) {
        businessTypeData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        businessTypeData = response.data;
      }
      
      if (businessTypeData.length > 0) {
        console.log("✅ Business types loaded:", businessTypeData);
        setAllBusinessTypes(businessTypeData);
      } else {
        console.log("No business types found");
        setAllBusinessTypes([]);
      }
    } catch (err) {
      console.error("Business type fetch error:", err);
      if (plans.length > 0) {
        extractBusinessTypesFromPlans();
      }
    }
  };

  loadBusinessTypes();
}, []);

  // Fetch plans from Laravel API - SHOW ALL PLANS
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);

        const data = await getPlans();

        console.log("API Response:", data);

        if (data.status === true && data.data) {
          const allPlans = data.data;

          const transformedPlans = allPlans.map((plan, index) => {
            const features = plan.features || [];

            const monthlyPrice = parseFloat(plan.price);
            const yearlyPrice = monthlyPrice * 10;

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
              description: plan.description
                ? plan.description.replace(/<[^>]*>?/gm, "")
                : "",
              features: features,
              color: index === 1 ? "#8b5cf6" : "#000000",
              buttonText: `Start ${plan.name}`,
              popular: index === 1,
            };
          });

          console.log("Transformed Plans:", transformedPlans);
          setPlans(transformedPlans);
          setFilteredPlans(transformedPlans);

          console.log("Plans set");
        } else {
          setError(data.message || "Failed to fetch plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // 👈 ADD THIS NEW FUNCTION - Filter plans using search API
  const filterPlansByBusinessTypeAPI = async (businessTypeId) => {
    setLoading(true);
    try {
      let response;
      
      if (businessTypeId === "all") {
        // Get all plans
        response = await getPlans();
      } else {
        // Use search API to filter by business type
        response = await searchPlans({ search: parseInt(businessTypeId) });
      }
      
      console.log("Filtered plans response:", response);
      
      if (response.status === true && response.data) {
        const transformedPlans = response.data.map((plan, index) => {
          const features = plan.features || [];
          const monthlyPrice = parseFloat(plan.price);
          const yearlyPrice = monthlyPrice ;//* 10;
          const discount = parseFloat(plan.discount) || 0;
          const monthlyDiscountedPrice = monthlyPrice - (monthlyPrice * discount / 100);
          const yearlyDiscountedPrice = yearlyPrice - (yearlyPrice * discount / 100);
          const gstRate = parseFloat(plan.gst) || 0;

          return {
            id: plan.id,
            name: plan.name,
            price: { monthly: monthlyPrice, yearly: yearlyPrice },
            displayPrice: { monthly: monthlyPrice.toLocaleString("en-IN"), yearly: yearlyPrice.toLocaleString("en-IN") },
            discountedPrice: { monthly: monthlyDiscountedPrice, yearly: yearlyDiscountedPrice },
            displayDiscountedPrice: { monthly: monthlyDiscountedPrice.toLocaleString("en-IN"), yearly: yearlyDiscountedPrice.toLocaleString("en-IN") },
            discount: discount,
            gst: gstRate,
            businessTypes: [],
            supportedBusinessTypeIds: [],
            description: plan.description?.replace(/<[^>]*>?/gm, "") || "",
            features: features,
            color: index === 1 ? "#8b5cf6" : "#000000",
            buttonText: `Start ${plan.name}`,
            popular: index === 1,
            duration_days: plan.duration_days
          };
        });
        setFilteredPlans(transformedPlans);
      } else {
        setFilteredPlans([]);
      }
    } catch (error) {
      console.error("Error filtering plans:", error);
      setFilteredPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter plans based on selected business type - UPDATED to use API
  useEffect(() => {
    filterPlansByBusinessTypeAPI(selectedBusinessType);
  }, [selectedBusinessType]);

  // Get current price based on billing cycle, discount, and selected business type
  const getCurrentPrice = (plan) => {
    let basePrice;

    if (selectedBusinessType !== "all") {
      const businessTypeForPlan = plan.businessTypes?.find(
        (bt) => bt.id === parseInt(selectedBusinessType)
      );

      if (businessTypeForPlan && businessTypeForPlan.custom_price) {
        basePrice = businessTypeForPlan.custom_price;
        if (billingCycle === "yearly") {
          basePrice = basePrice * 10;
        }
        return {
          price: basePrice,
          displayPrice: basePrice.toLocaleString("en-IN"),
          hasCustomPrice: true,
        };
      }
    }

    if (plan.discount > 0) {
      basePrice = billingCycle === "monthly"
        ? plan.discountedPrice.monthly
        : plan.discountedPrice.yearly;
    } else {
      basePrice = billingCycle === "monthly"
        ? plan.price.monthly
        : plan.price.yearly;
    }

    return {
      price: basePrice,
      displayPrice: basePrice.toLocaleString("en-IN"),
      hasCustomPrice: false,
    };
  };

  // Get original price for comparison
  const getOriginalPrice = (plan) => {
    if (selectedBusinessType !== "all") {
      const businessTypeForPlan = plan.businessTypes?.find(
        (bt) => bt.id === parseInt(selectedBusinessType)
      );

      if (businessTypeForPlan && businessTypeForPlan.custom_price) {
        const customPrice = businessTypeForPlan.custom_price;
        return {
          price: billingCycle === "yearly" ? customPrice * 10 : customPrice,
          displayPrice: (billingCycle === "yearly" ? customPrice * 10 : customPrice).toLocaleString("en-IN"),
        };
      }
    }

    return {
      price: billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly,
      displayPrice: billingCycle === "monthly" ? plan.displayPrice.monthly : plan.displayPrice.yearly,
    };
  };

  // Handle subscription
  const handleSubscribe = (plan) => {
    const currentPriceData = getCurrentPrice(plan);
    const originalPriceData = getOriginalPrice(plan);
    const gstAmount = currentPriceData.price * (plan.gst / 100);
    const totalAmount = currentPriceData.price + gstAmount;

    const selectedPlan = {
      id: plan.id,
      name: plan.name,
      billingCycle: billingCycle,
      price: currentPriceData.price,
      displayPrice: currentPriceData.displayPrice,
      originalPrice: originalPriceData.price,
      discount: plan.discount,
      gst: plan.gst,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      businessType: selectedBusinessType !== "all"
        ? allBusinessTypes.find((bt) => bt.id === parseInt(selectedBusinessType))
        : plan.businessTypes?.[0] || null,
      hasCustomPrice: currentPriceData.hasCustomPrice,
    };

    if (!isLoggedIn) {
      setPendingPlan(selectedPlan);
      setShowLoginModal(true);
      return;
    }

    proceedToOrderSummary(selectedPlan);
  };

  const proceedToOrderSummary = (selectedPlan) => {
    localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));
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
      const isLoggedInNow = !!(localStorage.getItem("auth_token") || localStorage.getItem("token") || localStorage.getItem("user_data"));

      if (isLoggedInNow && pendingPlanStr) {
        const pendingPlanData = JSON.parse(pendingPlanStr);
        localStorage.removeItem("pendingPlan");
        localStorage.removeItem("redirectAfterLogin");
        proceedToOrderSummary(pendingPlanData);
      }
    };

    checkPendingPlanAfterLogin();
  }, [router]);

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

  // Login Modal Component
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
            <p className="text-gray-600">
              Please login to continue with your subscription
            </p>
            {pendingPlan && (
              <p className="text-sm text-purple-600 mt-2 font-medium">
                Plan: {pendingPlan.name} • ₹{pendingPlan.displayPrice}/{pendingPlan.billingCycle === 'monthly' ? 'month' : 'year'}
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
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading plans...</p>
          </div>
        </div>
        <Footer />
        <LoginModal />
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
        <LoginModal />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-['Inter',system-ui,-apple-system,sans-serif]">
        <Container size="default">
          
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
              >
                <option value="all">🌐 All</option>
                {allBusinessTypes.map((businessType) => (
                  <option key={businessType.id} value={businessType.id}>
                    🏢 {businessType.name}
                  </option>
                ))}
              </select>
            </div>

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
                {/* <span className="absolute -top-2 -right-1 sm:-top-3 sm:-right-2 bg-green-500 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                  Save extrem offer
                </span> */}
              </button>
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out ${
                  billingCycle === 'monthly' ? 'left-1' : 'left-[calc(50%-2px)]'
                }`}
              />
            </div>
          </div>

          {/* Results Count */}
          {/* <div className="text-center mb-6">
            <p className="text-sm text-gray-500">
              Showing {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'} 
              {selectedBusinessType !== 'all' && ` for ${allBusinessTypes.find(bt => bt.id === parseInt(selectedBusinessType))?.name}`}
            </p>
          </div> */}

          {/* Pricing Cards Grid */}
          {filteredPlans.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Plans Found</h3>
              <p className="text-gray-600">No plans available for this business type. Please try another selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
              {filteredPlans.map((plan, index) => {
                const isPopular = plan.popular;
                const currentPriceData = getCurrentPrice(plan);
                const originalPriceData = getOriginalPrice(plan);
                const gstAmount = currentPriceData.price * (plan.gst / 100);
                const totalAmount = currentPriceData.price + gstAmount;

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
                          <span className="text-gray-400 text-base font-medium">/ {plan.duration_days} days</span>
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
                      <h4 className="text-xs font-bold text-gray-500 mb-5 uppercase tracking-wider"> included Features :</h4>
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

          <div className="text-center mb-8">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                  setPendingPlan(null);
                } else {
                  router.push('/order-summary');
                }
              }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
              </svg>
              <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                View Order Summary  
              </span>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

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

            <a
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Need Help?</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

        </Container>
      </div>
      <Footer />
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
    </>
  );
};

export default Pricing;