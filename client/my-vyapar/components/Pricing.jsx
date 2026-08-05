"use client";

import React, { useEffect, useRef, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import Container from "@/components/Container";
import { usePricingStore } from "../store/pricingStore";
import { useAuthStore } from "../store/authStoreZustand";
import { useFilterStore } from "../store/filterStore";
import { useRouter, usePathname } from "next/navigation";
import businessService from "../services/businessService";
import { 
  Star, 
  Check, 
  Loader2, 
  ArrowRight, 
  Lock, 
  Layers, 
  Tag, 
  Gem, 
  Info,
  AlertCircle,
  Crown,
  Sparkles,
  ShoppingBag,
  RefreshCw,
  Zap,
  Shield,
  Users,
  CreditCard,
  Gift,
  TrendingUp,
  ChevronDown,
  Building2,
  LayoutGrid,
  X,
  ArrowUpRight,
  Plus,
  Minus,
  CircleCheck,
  Medal,
  Rocket,
  PartyPopper,
  Table,
  Grid,
  List,
  MoveRight
} from "lucide-react";

const Pricing = ({
  limit = 3,
  showFilters = true,
  showViewAllButton = true,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [planEligibility, setPlanEligibility] = useState({});
  const [checkingEligibility, setCheckingEligibility] = useState({});
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isSelectEnabled, setIsSelectEnabled] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  const {
    plans,
    loading,
    error,
    selectedPlan,
    categories,
    businessTypes,
    allFeatures,
    fetchPlans,
    selectPlan,
    subscribeToPlan,
    clearError,
  } = usePricingStore();

  const {
    filters,
    updateFilter,
    searchPlans: searchWithFilters,
    setSortBy,
  } = useFilterStore();
  const [pendingPlan, setPendingPlan] = useState(null);
  const [selectedBusinessType, setSelectedBusinessType] = useState("all");
  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [subscribing, setSubscribing] = useState(null);
  const cardRefs = useRef([]);
  const router = useRouter();

  const {
    user,
    token,
    isLoggedIn,
    hasActivePlan,
    checkPlanPurchaseEligibility,
  } = useAuthStore();

  // Check if we're on the pricing page
  const isPricingPage = pathname === "/pricing";

  // Helper function to determine plan action based on current and target plan
  const getPlanAction = (currentPlan, targetPlan) => {
    if (!currentPlan) {
      return { 
        isUpgrade: false, 
        isDowngrade: false, 
        isSame: false, 
        canPurchase: true,
        isActive: false,
        action: 'new_purchase',
        canUpgrade: false,
        canReactivate: false
      };
    }

    const isActive = currentPlan.is_active === 1 || 
                     currentPlan.is_active === true || 
                     currentPlan.status === 'active' ||
                     currentPlan.is_active === '1';
    
    const currentPrice = parseFloat(currentPlan.price) || 0;
    const targetPrice = parseFloat(targetPlan.price) || 0;
    
    if (!isActive) {
      return {
        isUpgrade: false,
        isDowngrade: false,
        isSame: false,
        canPurchase: true,
        isActive: false,
        action: 'reactivation',
        isInactive: true,
        canUpgrade: false,
        canReactivate: true
      };
    }
    
    if (targetPrice > currentPrice) {
      return {
        isUpgrade: true,
        isDowngrade: false,
        isSame: false,
        canPurchase: true,
        isActive: true,
        action: 'upgrade',
        canUpgrade: true,
        canReactivate: false
      };
    } else if (targetPrice < currentPrice) {
      return {
        isUpgrade: false,
        isDowngrade: true,
        isSame: false,
        canPurchase: false,
        isActive: true,
        action: 'downgrade_not_allowed',
        canUpgrade: false,
        canReactivate: false,
        reason: "Downgrading is not allowed. Please contact support if you need to change to a lower tier plan."
      };
    } else {
      return {
        isUpgrade: false,
        isDowngrade: false,
        isSame: true,
        canPurchase: false,
        isActive: true,
        action: 'same_plan',
        canUpgrade: false,
        canReactivate: false,
        reason: "You are already subscribed to this plan."
      };
    }
  };

  // Helper function to get user's plan status
  const getUserPlanStatus = () => {
    if (!isLoggedIn || !user?.plan_id) {
      return { hasPlan: false, isActive: false, plan: null };
    }
    
    const currentPlan = plans.find((plan) => plan.id === user.plan_id);
    if (!currentPlan) {
      return { hasPlan: false, isActive: false, plan: null };
    }
    
    const isActive = currentPlan.is_active === 1 || 
                     currentPlan.is_active === true || 
                     currentPlan.status === 'active' ||
                     currentPlan.is_active === '1';
    
    return {
      hasPlan: true,
      isActive: isActive,
      plan: currentPlan,
      planId: user.plan_id
    };
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsClientMounted(true);
    const timer = setTimeout(() => {
      setIsSelectEnabled(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadBusinessTypes = async () => {
      try {
        let businessTypeData;

        if (token) {
          businessTypeData = await businessService.getBusinessTypes(token);
        } else {
          businessTypeData = await businessService.getBusinessTypes();
        }

        if (businessTypeData && businessTypeData.length > 0) {
          setAllBusinessTypes(businessTypeData);
        } else {
          console.warn("No business types found");
        }
      } catch (err) {
        console.error("Business type fetch error:", err);
        setAllBusinessTypes([]);
      }
    };

    loadBusinessTypes();
  }, [token]);

  // Transform a single plan with feature mapping
  const transformPlan = (plan, index) => {
    const planFeatureNames = plan.features?.map(f => f.name) || [];
    
    const monthlyPrice = parseFloat(plan.price);
    const discount = parseFloat(plan.discount) || 0;
    const monthlyDiscountedPrice = monthlyPrice - (monthlyPrice * discount) / 100;
    const gstRate = parseFloat(plan.gst) || 0;

    const transformedBusinessTypes = (plan.business_types || []).map((bt) => ({
      id: bt.business_type?.id || bt.id,
      name: bt.business_type?.name || bt.name,
      plan_id: bt.plan_id,
      business_type_id: bt.business_type_id,
      custom_price: bt.custom_price || null,
    }));

    const supportedBusinessTypeIds = transformedBusinessTypes.map(
      (bt) => bt.id,
    );

    const featureMap = {};
    const globalFeatures = allFeatures || [];
    
    if (globalFeatures.length > 0) {
      globalFeatures.forEach(feature => {
        featureMap[feature.name] = planFeatureNames.includes(feature.name);
      });
    } else {
      planFeatureNames.forEach(feature => {
        featureMap[feature] = true;
      });
    }

    return {
      id: plan.id,
      name: plan.name,
      price: {
        monthly: monthlyPrice,
        yearly: monthlyPrice * 12,
      },
      displayPrice: {
        monthly: monthlyPrice.toLocaleString("en-IN"),
        yearly: (monthlyPrice * 12).toLocaleString("en-IN"),
      },
      discountedPrice: {
        monthly: monthlyDiscountedPrice,
        yearly: monthlyDiscountedPrice * 12,
      },
      displayDiscountedPrice: {
        monthly: monthlyDiscountedPrice.toLocaleString("en-IN"),
        yearly: (monthlyDiscountedPrice * 12).toLocaleString("en-IN"),
      },
      plan_duration: plan.duration_days || 30,
      discount: discount,
      gst: gstRate,
      businessTypes: transformedBusinessTypes,
      supportedBusinessTypeIds: supportedBusinessTypeIds,
      description: plan.description
        ? plan.description.replace(/<[^>]*>?/gm, "")
        : "",
      features: planFeatureNames,
      featureMap: featureMap,
      allFeaturesList: globalFeatures.length > 0 ? globalFeatures : planFeatureNames.map(f => ({ name: f })),
      color: index === 1 ? "#8b5cf6" : "#1e293b",
      buttonText: `Select Plan`,
      popular: false,
      status: plan.status || 'active',
      is_active: plan.is_active !== undefined ? plan.is_active : true,
      permissions: plan.permissions || [],
      slug: plan.slug || '',
      raw: plan
    };
  };

  const transformPlans = (plansData) => {
    if (!Array.isArray(plansData)) {
      console.error(
        "transformPlans expected array but got:",
        typeof plansData,
        plansData,
      );
      return [];
    }

    const sortedPlans = [...plansData].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    return sortedPlans.map((plan, index) => {
      const isPopular = index === Math.floor(sortedPlans.length / 2) && sortedPlans.length > 1;
      const transformed = transformPlan(plan, index);
      transformed.popular = isPopular;
      return transformed;
    });
  };

  const filterPlansByBusinessType = async (businessTypeId) => {
    try {
      if (businessTypeId === "all") {
        let transformedPlans = transformPlans(plans);

        if (limit && limit > 0) {
          transformedPlans = transformedPlans.slice(0, limit);
        }

        setFilteredPlans(transformedPlans);
      } else {
        updateFilter("search", businessTypeId);
        const searchResults = await searchWithFilters();

        if (searchResults && searchResults.length > 0) {
          let transformedPlans = transformPlans(searchResults);

          if (limit && limit > 0) {
            transformedPlans = transformedPlans.slice(0, limit);
          }

          setFilteredPlans(transformedPlans);
        } else {
          setFilteredPlans([]);
        }
      }
    } catch (error) {
      console.error("Error filtering plans:", error);
      setFilteredPlans([]);
    }
  };

  useEffect(() => {
    const loadPlans = async () => {
      try {
        await fetchPlans();
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    loadPlans();
  }, [fetchPlans]);

  useEffect(() => {
    if (plans && plans.length > 0) {
      let transformedPlans = transformPlans(plans);

      if (limit && limit > 0) {
        transformedPlans = transformedPlans.slice(0, limit);
      }

      setFilteredPlans(transformedPlans);
      setHasLoadedOnce(true);
    } else if (plans && plans.length === 0) {
      setHasLoadedOnce(true);
    }
  }, [plans, limit, allFeatures]);

  useEffect(() => {
    if (showFilters && plans && plans.length > 0) {
      filterPlansByBusinessType(selectedBusinessType);
    }
  }, [selectedBusinessType, showFilters, plans, allFeatures]);

  useEffect(() => {
    const checkEligibilityForPlans = async () => {
      if (isLoggedIn && filteredPlans.length > 0) {
        const eligibilityData = {};
        const userPlanStatus = getUserPlanStatus();

        for (const plan of filteredPlans) {
          setCheckingEligibility((prev) => ({ ...prev, [plan.id]: true }));

          try {
            const planAction = getPlanAction(userPlanStatus.plan, plan);
            
            if (userPlanStatus.hasPlan && userPlanStatus.isActive && userPlanStatus.plan.id === plan.id) {
              eligibilityData[plan.id] = {
                canPurchase: false,
                reason: "You are already subscribed to this plan.",
                action: "same_plan",
                isSame: true
              };
            } else if (userPlanStatus.hasPlan && !userPlanStatus.isActive && userPlanStatus.plan.id === plan.id) {
              eligibilityData[plan.id] = {
                canPurchase: true,
                reason: "Your plan is inactive. You can reactivate it.",
                action: "reactivation",
                isInactive: true,
                canReactivate: true
              };
            } else if (userPlanStatus.hasPlan && userPlanStatus.isActive) {
              const isUpgrade = planAction.isUpgrade;
              const isDowngrade = planAction.isDowngrade;
              
              if (isUpgrade) {
                eligibilityData[plan.id] = {
                  canPurchase: true,
                  reason: "You can upgrade to this plan.",
                  action: "upgrade",
                  isUpgrade: true,
                  canUpgrade: true
                };
              } else if (isDowngrade) {
                eligibilityData[plan.id] = {
                  canPurchase: false,
                  reason: "Downgrading is not allowed. Please contact support if you need to change to a lower tier plan.",
                  action: "downgrade_not_allowed",
                  isDowngrade: true,
                  canPurchase: false
                };
              } else {
                eligibilityData[plan.id] = {
                  canPurchase: false,
                  reason: "This plan is not available for purchase.",
                  action: "unavailable"
                };
              }
            } else {
              const eligibility = await checkPlanPurchaseEligibility(plan.id);
              eligibilityData[plan.id] = {
                ...eligibility,
                action: eligibility.action || "new_purchase"
              };
            }
          } catch (error) {
            console.error(`Error checking eligibility for plan ${plan.id}:`, error);
            eligibilityData[plan.id] = {
              canPurchase: false,
              reason: "Error checking eligibility",
            };
          } finally {
            setCheckingEligibility((prev) => ({ ...prev, [plan.id]: false }));
          }
        }

        setPlanEligibility(eligibilityData);
      }
    };

    checkEligibilityForPlans();
  }, [isLoggedIn, filteredPlans, checkPlanPurchaseEligibility, plans]);

  const getCurrentPrice = (plan) => {
    let basePrice;

    if (selectedBusinessType !== "all" && showFilters) {
      const businessTypeForPlan = plan.businessTypes?.find(
        (bt) => bt.id === parseInt(selectedBusinessType),
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
        (bt) => bt.id === parseInt(selectedBusinessType),
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
    const userPlanStatus = getUserPlanStatus();
    const planAction = getPlanAction(userPlanStatus.plan, plan);
    const hasInactivePlan = userPlanStatus.hasPlan && !userPlanStatus.isActive;
    
    const isInactiveRepurchase = hasInactivePlan && userPlanStatus.plan.id === plan.id;
    const isSameActivePlan = userPlanStatus.hasPlan && userPlanStatus.isActive && userPlanStatus.plan.id === plan.id;
    const isDowngrade = planAction.isDowngrade;

    if (isSameActivePlan) {
      alert("You are already subscribed to this plan.");
      return;
    }

    if (isDowngrade) {
      alert("Downgrading is not allowed. Please contact support if you need to change to a lower tier plan.");
      return;
    }

    // Prepare plan data for order summary
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
      eligibility: planEligibility[plan.id] || null,
      isUpgrade: planAction.isUpgrade,
      isDowngrade: planAction.isDowngrade,
      isInactiveRepurchase: isInactiveRepurchase,
      isReactivation: isInactiveRepurchase,
      userPlanStatus: userPlanStatus,
      slug: plan.slug,
      duration_days: plan.plan_duration,
      permissions: plan.permissions,
      features: plan.features
    };

    // IMPORTANT: Store in localStorage for OrderSummary
    localStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));
    // Also store in sessionStorage as backup
    sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlanData));

    if (!isLoggedIn) {
      setPendingPlan(selectedPlanData);
      setShowLoginModal(true);
      return;
    }

    // Handle different scenarios
    if (planAction.isUpgrade) {
      // User has active plan and wants to upgrade - redirect to dashboard
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000";
      window.open(`${dashboardUrl}billing`, "_blank");
    } else if (isInactiveRepurchase) {
      // User has inactive plan and wants to repurchase - go to order summary
      selectPlan(selectedPlanData);
      router.push("/order-summary");
    } else {
      // New purchase
      selectPlan(selectedPlanData);
      router.push("/order-summary");
    }
  };

  const proceedToOrderSummary = (selectedPlan) => {
    selectPlan(selectedPlan);
    router.push("/order-summary");
  };

  const handleLoginRedirect = () => {
    if (pendingPlan) {
      sessionStorage.setItem("pendingPlan", JSON.stringify(pendingPlan));
    }
    router.push("/login?redirect=pricing");
  };

  useEffect(() => {
    const checkPendingPlanAfterLogin = async () => {
      const pendingPlanStr = sessionStorage.getItem("pendingPlan");

      if (isLoggedIn && pendingPlanStr) {
        try {
          const pendingPlanData = JSON.parse(pendingPlanStr);
          sessionStorage.removeItem("pendingPlan");
          await fetchPlans();
          proceedToOrderSummary(pendingPlanData);
        } catch (error) {
          console.error("Error processing pending plan:", error);
          sessionStorage.removeItem("pendingPlan");
        }
      }
    };

    checkPendingPlanAfterLogin();
  }, [router, isLoggedIn, fetchPlans]);

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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={() => setShowLoginModal(false)}
      >
        <div
          className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Unlock Premium Features
            </h3>
            <p className="text-gray-600">
              Sign in to continue with your subscription and access exclusive
              benefits
            </p>
            {pendingPlan && (
              <div className="mt-5 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <p className="text-sm text-purple-900 font-semibold">
                  Selected Plan: {pendingPlan.name}
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ₹{pendingPlan.displayPrice}
                  <span className="text-sm font-normal text-gray-600">
                    /month
                  </span>
                </p>
                {pendingPlan.isReactivation && (
                  <p className="text-xs text-green-600 mt-1">
                    <RefreshCw className="w-3 h-3 inline mr-1" />
                    Reactivating your previous plan
                  </p>
                )}
                {pendingPlan.isUpgrade && (
                  <p className="text-xs text-blue-600 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Upgrading your plan
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Login to Continue
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Skeleton Loading Component
  const PricingCardSkeleton = ({ isPopular = false }) => (
    <div
      className={`group relative transition-all duration-500 transform ${
        isPopular ? "lg:scale-105 z-20" : ""
      }`}
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl blur opacity-0 ${
          isPopular ? "opacity-30 animate-pulse" : ""
        }`}
      ></div>

      <div
        className={`relative bg-white rounded-2xl overflow-hidden shadow-xl h-full flex flex-col`}
      >
        {isPopular && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gray-200 text-gray-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              <span className="inline-block w-16 h-4"></span>
            </div>
          </div>
        )}

        <div className="p-8 flex-1 flex flex-col">
          <div className="mb-6">
            <div
              className={`w-14 h-14 rounded-xl mb-4 bg-gray-200 animate-pulse ${
                isPopular ? "shadow-lg" : ""
              }`}
            ></div>
            <div className="h-8 bg-gray-200 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="inline-block w-24 h-6 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
            <div className="flex items-baseline gap-1">
              <div className="w-4 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-5 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="mb-8 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="space-y-3.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    {i % 2 === 0 && (
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-12 bg-gray-200 rounded-xl animate-pulse mt-auto"></div>
        </div>
      </div>
    </div>
  );

  // Comparison Table Component
  const ComparisonTable = ({ plans, features }) => {
    if (!plans || plans.length === 0) return null;

    return (
      <div className="mt-16 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Table className="w-7 h-7 text-purple-600" />
              Plan Comparison
            </h3>
            <p className="text-gray-500 mt-1">Compare all features across plans</p>
          </div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 rounded-xl font-semibold hover:bg-purple-100 transition-all duration-300"
          >
            {showComparison ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Hide Comparison
              </>
            ) : (
              <>
                <MoveRight className="w-4 h-4" />
                View Full Comparison
              </>
            )}
          </button>
        </div>

        {showComparison && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Features
                    </th>
                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className={`px-6 py-4 text-center text-sm font-bold uppercase tracking-wider ${
                          plan.popular ? "text-purple-700" : "text-gray-700"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{plan.name}</span>
                          {plan.popular && (
                            <span className="text-[10px] bg-gradient-to-r from-purple-600 to-pink-500 text-white px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Price Row */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Price
                    </td>
                    {plans.map((plan) => {
                      const priceData = getCurrentPrice(plan);
                      return (
                        <td
                          key={plan.id}
                          className="px-6 py-4 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{priceData.displayPrice}
                            </span>
                            <span className="text-xs text-gray-400">
                              /{plan.plan_duration} Days
                            </span>
                            {plan.discount > 0 && (
                              <span className="text-xs text-green-600 font-medium mt-1">
                                Save {plan.discount}%
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Duration Row */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Duration
                    </td>
                    {plans.map((plan) => (
                      <td
                        key={plan.id}
                        className="px-6 py-4 text-center text-sm text-gray-600"
                      >
                        {plan.plan_duration} Days
                      </td>
                    ))}
                  </tr>

                  {/* Features Rows */}
                  {features.length > 0 && features.map((feature, idx) => {
                    const featureName = typeof feature === 'string' ? feature : feature.name;
                    return (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {featureName}
                        </td>
                        {plans.map((plan) => {
                          const isIncluded = plan.featureMap && plan.featureMap[featureName] !== undefined
                            ? plan.featureMap[featureName]
                            : plan.features.includes(featureName);
                          return (
                            <td
                              key={plan.id}
                              className="px-6 py-3 text-center"
                            >
                              {isIncluded ? (
                                <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                  <Check className="w-4 h-4 text-green-600" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                  <X className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Action Row */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Action
                    </td>
                    {plans.map((plan) => {
                      const userPlanStatus = getUserPlanStatus();
                      const planAction = getPlanAction(userPlanStatus.plan, plan);
                      const isCurrentActivePlan = userPlanStatus.hasPlan && userPlanStatus.isActive && userPlanStatus.plan.id === plan.id;
                      const isDowngrade = planAction.isDowngrade;
                      const hasInactivePlan = userPlanStatus.hasPlan && !userPlanStatus.isActive;
                      const isInactiveRepurchase = hasInactivePlan && userPlanStatus.plan.id === plan.id;
                      const eligibility = planEligibility[plan.id];
                      
                      let buttonText = "Subscribe";
                      let buttonStyle = "bg-purple-600 hover:bg-purple-700 text-white";
                      
                      if (isCurrentActivePlan) {
                        buttonText = "Current Plan";
                        buttonStyle = "bg-green-100 text-green-700 hover:bg-green-200";
                      } else if (isDowngrade) {
                        buttonText = "Not Allowed";
                        buttonStyle = "bg-gray-200 text-gray-400 cursor-not-allowed";
                      } else if (planAction.isUpgrade) {
                        buttonText = "Upgrade";
                        buttonStyle = "bg-blue-600 hover:bg-blue-700 text-white";
                      } else if (isInactiveRepurchase) {
                        buttonText = "Reactivate";
                        buttonStyle = "bg-green-600 hover:bg-green-700 text-white";
                      } else if (isLoggedIn && eligibility && !eligibility.canPurchase) {
                        buttonText = "Unavailable";
                        buttonStyle = "bg-gray-200 text-gray-400 cursor-not-allowed";
                      }
                      
                      return (
                        <td
                          key={plan.id}
                          className="px-6 py-4 text-center"
                        >
                          <button
                            onClick={() => handleSubscribe(plan)}
                            disabled={isCurrentActivePlan || isDowngrade || (isLoggedIn && eligibility && !eligibility.canPurchase && !isInactiveRepurchase)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${buttonStyle} ${
                              isCurrentActivePlan || isDowngrade || (isLoggedIn && eligibility && !eligibility.canPurchase && !isInactiveRepurchase) ? "opacity-60 cursor-not-allowed" : "hover:scale-105"
                            }`}
                          >
                            {buttonText}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pb-28 pt-8 md:pb-28 md:pt-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 font-['Inter',system-ui,-apple-system,sans-serif] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <Container size="default">
          <div className="text-center mb-16 px-4 relative z-10">
            <div className="inline-block w-32 h-8 bg-gray-200 rounded-full mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
          </div>

          <div className="flex justify-center items-center mb-12 relative z-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg border border-gray-200 inline-flex gap-1 w-64">
              <div className="h-10 bg-gray-200 rounded-xl flex-1 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl flex-1 animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-center items-center mb-12 px-4 relative z-10">
            <div className="w-80 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 px-4 relative z-10">
            <PricingCardSkeleton isPopular={false} />
            <PricingCardSkeleton isPopular={true} />
            <PricingCardSkeleton isPopular={false} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 justify-center"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-40 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-[600px] flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-2xl max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayPlans = showFilters
    ? filteredPlans
    : plans && plans.length > 0
      ? transformPlans(plans).slice(0, limit)
      : [];

  // Get all features for comparison
  const allFeaturesForComparison = allFeatures && allFeatures.length > 0
    ? allFeatures
    : displayPlans.length > 0 && displayPlans[0].allFeaturesList
      ? displayPlans[0].allFeaturesList
      : [];

  // Get selected business type name for display
  const getSelectedBusinessTypeName = () => {
    if (selectedBusinessType === "all") return "All Business Types";
    const selected = allBusinessTypes.find(
      (bt) => bt.id === parseInt(selectedBusinessType),
    );
    return selected ? selected.name : "Select Business Type";
  };

  return (
    <div className="pb-28 pt-8 md:pb-28 md:pt-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 font-['Inter',system-ui,-apple-system,sans-serif] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <Container size="default">
        {/* Header Section */}
        <div className="text-center mb-4 px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Flexible Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Start for free, scale with confidence. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* Business Type Dropdown */}
        {showFilters && allBusinessTypes.length > 0 && (
          <div className="flex justify-center items-center mb-12 px-4 relative z-20">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-3 bg-white rounded-[40px] px-6 py-3 min-w-[260px] shadow-md border border-gray-200 hover:border-purple-300 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">
                    {getSelectedBusinessTypeName()}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[30px] shadow-lg border border-gray-200 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => {
                      setSelectedBusinessType("all");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-6 py-3 text-left hover:bg-purple-50 transition-colors duration-200 flex items-center gap-2 ${
                      selectedBusinessType === "all"
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-700"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    All Business Types
                    {selectedBusinessType === "all" && (
                      <Check className="w-4 h-4 ml-auto text-purple-600" />
                    )}
                  </button>

                  {allBusinessTypes.map((businessType) => (
                    <button
                      key={businessType.id}
                      onClick={() => {
                        setSelectedBusinessType(businessType.id.toString());
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-6 py-3 text-left hover:bg-purple-50 transition-colors duration-200 flex items-center gap-2 ${
                        selectedBusinessType === businessType.id.toString()
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      {businessType.name}
                      {selectedBusinessType === businessType.id.toString() && (
                        <Check className="w-4 h-4 ml-auto text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards Grid */}
        {displayPlans.length === 0 && !loading && hasLoadedOnce ? (
          <div className="text-center py-24 relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <LayoutGrid className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">
              No Plans Available
            </h3>
            <p className="text-gray-600 text-lg">
              No plans found for this business type. Please try another
              selection.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 px-4 relative z-10">
              {displayPlans.map((plan, index) => {
                const isPopular = plan.popular;
                const currentPriceData = getCurrentPrice(plan);
                const originalPriceData = getOriginalPrice(plan);
                const isHovered = hoveredPlan === plan.id;
                
                const userPlanStatus = getUserPlanStatus();
                const planAction = getPlanAction(userPlanStatus.plan, plan);
                const hasInactivePlan = userPlanStatus.hasPlan && !userPlanStatus.isActive;
                const isInactiveRepurchase = hasInactivePlan && userPlanStatus.plan.id === plan.id;
                const isCurrentActivePlan = userPlanStatus.hasPlan && userPlanStatus.isActive && userPlanStatus.plan.id === plan.id;
                const isDowngrade = planAction.isDowngrade;
                const eligibility = planEligibility[plan.id];

                const isButtonDisabled = 
                  subscribing === plan.id ||
                  checkingEligibility[plan.id] ||
                  isCurrentActivePlan ||
                  isDowngrade ||
                  (isLoggedIn && eligibility && !eligibility.canPurchase && !isInactiveRepurchase);

                let buttonStyle = "bg-gray-900 text-white hover:bg-gray-800 shadow-md";
                if (isPopular) {
                  buttonStyle = "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl";
                } else if (planAction.isUpgrade) {
                  buttonStyle = "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl";
                } else if (isInactiveRepurchase) {
                  buttonStyle = "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl";
                } else if (isDowngrade) {
                  buttonStyle = "bg-gray-400 text-white cursor-not-allowed";
                }

                let buttonText = "🎉 Subscribe Now";
                if (subscribing === plan.id) {
                  buttonText = "Processing...";
                } else if (checkingEligibility[plan.id]) {
                  buttonText = "Checking...";
                } else if (isLoggedIn && eligibility) {
                  if (isInactiveRepurchase) {
                    buttonText = "Reactivate Plan";
                  } else if (planAction.isUpgrade) {
                    buttonText = "Upgrade Now";
                  } else if (isDowngrade) {
                    buttonText = "Downgrade Not Allowed";
                  } else if (isCurrentActivePlan) {
                    buttonText = "Current Plan";
                  } else if (eligibility.canPurchase) {
                    if (eligibility.action === "renewal") {
                      buttonText = "Renew Now";
                    } else if (eligibility.action === "new_purchase") {
                      buttonText = "Get Started";
                    } else {
                      buttonText = "Select Plan";
                    }
                  } else {
                    buttonText = "Currently Unavailable";
                  }
                }

                const featuresToDisplay = plan.allFeaturesList && plan.allFeaturesList.length > 0 
                  ? plan.allFeaturesList 
                  : [];

                return (
                  <div
                    key={plan.id}
                    ref={(el) => (cardRefs.current[index] = el)}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    className={`relative transition-all duration-500 h-full ${
                      isPopular
                        ? "lg:-mt-4 lg:mb-4 z-20"
                        : "hover:lg:-translate-y-3"
                    }`}
                  >
                    {/* Floating glow effect */}
                    <div
                      className={`absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl transition duration-700 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>

                    {/* Main Card */}
                    <div
                      className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col ${
                        isPopular
                          ? "shadow-2xl ring-2 ring-purple-500"
                          : "shadow-lg hover:shadow-2xl"
                      } ${isHovered ? "shadow-2xl" : ""}`}
                    >
                      {/* Modern Popular Banner */}
                      {isPopular && (
                        <div className="absolute top-0 inset-x-0 z-10">
                          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white py-2.5 text-center">
                            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                              <Crown className="w-4 h-4" />
                              MOST POPULAR CHOICE
                            </div>
                          </div>
                        </div>
                      )}

                      <div
                        className={`p-8 flex-1 flex flex-col ${isPopular ? "pt-16" : "pt-8"}`}
                      >
                        {/* Header */}
                        <div className="mb-3 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {plan.name}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                            {plan.description}
                          </p>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6 pb-6 border-b border-gray-100">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-gray-900">
                              ₹
                            </span>
                            <span
                              className={`text-5xl font-black tracking-tight ${
                                isPopular
                                  ? "bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"
                                  : "text-gray-900"
                              }`}
                            >
                              {currentPriceData.displayPrice}
                            </span>
                            <span className="text-gray-500 font-medium">
                              /{plan.plan_duration} Days
                            </span>
                          </div>

                          {/* Savings Badge */}
                          {plan.discount > 0 &&
                            !currentPriceData.hasCustomPrice && (
                              <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-full mx-auto">
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{originalPriceData.displayPrice}
                                </span>
                                <span className="text-xs font-bold text-green-700">
                                  <Gift className="w-3 h-3 inline mr-1" />
                                  Save ₹
                                  {(
                                    originalPriceData.price -
                                    currentPriceData.price
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>
                            )}

                          {/* Special Pricing */}
                          {currentPriceData.hasCustomPrice && (
                            <div className="mt-4 flex justify-center">
                              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-sm opacity-50"></div>
                                  <Tag className="w-4 h-4 text-purple-600 relative" />
                                </div>
                                <span className="text-xs font-semibold text-purple-700">
                                  Special Pricing Available
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Features Section - Show ALL features with check/cross */}
                        <div className="mb-8 flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              Features
                            </h4>
                            <span className="text-xs text-gray-400">
                              {featuresToDisplay.length} features
                            </span>
                          </div>

                          <div className="space-y-2.5 text-left max-w-sm mx-auto">
                            {featuresToDisplay.length > 0 ? (
                              featuresToDisplay.slice(0, 6).map((feature, idx) => {
                                const featureName = typeof feature === 'string' ? feature : feature.name;
                                const isIncluded = plan.featureMap && plan.featureMap[featureName] !== undefined 
                                  ? plan.featureMap[featureName] 
                                  : plan.features.includes(featureName);
                                
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-3 group/item"
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                                        isIncluded
                                          ? isPopular
                                            ? "bg-purple-100 group-hover/item:bg-purple-200"
                                            : "bg-green-100 group-hover/item:bg-green-200"
                                          : "bg-gray-100 group-hover/item:bg-gray-200"
                                      }`}
                                    >
                                      {isIncluded ? (
                                        <Check
                                          className={`w-3 h-3 ${isPopular ? "text-purple-600" : "text-green-600"}`}
                                        />
                                      ) : (
                                        <X
                                          className="w-3 h-3 text-gray-400"
                                        />
                                      )}
                                    </div>
                                    <span className={`text-sm transition-colors ${
                                      isIncluded 
                                        ? "text-gray-700 group-hover/item:text-gray-900" 
                                        : "text-gray-400 group-hover/item:text-gray-500"
                                    }`}>
                                      {featureName}
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center text-gray-400 text-sm py-4">
                                No features available
                              </div>
                            )}
                            {featuresToDisplay.length > 6 && (
                              <div className="text-center text-xs text-purple-600 font-medium mt-2">
                                +{featuresToDisplay.length - 6} more features
                              </div>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isButtonDisabled}
                          className={`relative w-full py-4 rounded-xl font-bold transition-all duration-300 overflow-hidden group mt-auto ${buttonStyle}
                            ${isButtonDisabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                          `}
                        >
                          {/* Animated shine effect */}
                          <div
                            className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${
                              isPopular
                                ? "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                : "bg-gradient-to-r from-transparent via-gray-400/10 to-transparent"
                            }`}
                          ></div>

                          <span className="relative flex items-center justify-center gap-2">
                            {subscribing === plan.id ? (
                              <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Processing...
                              </>
                            ) : checkingEligibility[plan.id] ? (
                              <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                Checking...
                              </>
                            ) : (
                              <>
                                {buttonText}
                                {!isButtonDisabled && buttonText !== "Current Plan" && buttonText !== "Currently Unavailable" && buttonText !== "Downgrade Not Allowed" && (
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                )}
                              </>
                            )}
                          </span>
                        </button>

                        {/* Trust Badge */}
                        {isPopular && (
                          <div className="mt-4 text-center">
                            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                              <Lock className="w-3 h-3" />
                              Secure payment • Cancel anytime
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison Table - Only show on /pricing page */}
            {isPricingPage && displayPlans.length > 0 && allFeaturesForComparison.length > 0 && (
              <ComparisonTable 
                plans={displayPlans} 
                features={allFeaturesForComparison}
              />
            )}

            {/* View All Button */}
            {showViewAllButton && (
              <div className="text-center relative z-10 mt-12">
                <a
                  href="/pricing"
                  className="group inline-flex items-center gap-3 px-8 py-3.5 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>View All Plans</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </>
        )}
      </Container>

      <LoginModal />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoom-in-95 {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in-95 {
          animation-name: zoom-in-95;
        }
      `}</style>
    </div>
  );
};

export default Pricing;