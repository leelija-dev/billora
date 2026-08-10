"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  FaCheckCircle, 
  FaRupeeSign, 
  FaUser, 
  FaBuilding, 
  FaCalendarAlt, 
  FaIndustry, 
  FaStar, 
  FaLock, 
  FaInfoCircle, 
  FaCalendar,
  FaSpinner,
  FaArrowLeft,
  FaArrowRight,
  FaMinus,
  FaPlus,
  FaRegBuilding,
  FaRegEnvelope,
  FaRegUser,
  FaPhone,
  FaRegAddressCard,
  FaRegClock,
  FaShieldAlt,
  FaCreditCard,
  FaLock as FaLockIcon
} from "react-icons/fa";
import { FiCheckCircle as FiCheckCircleIcon } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePaymentStore } from "@/store/paymentStore";
import { useAuthStore } from "../../store/authStoreZustand";
import useBusinessStore from "../../store/businessStore";
import { logger } from '../../utils/logger';

const OrderSummary = () => {
  const router = useRouter();
  const { createOrderAction, loading: storeLoading, error: storeError } = usePaymentStore();
  const { user, isLoggedIn, isLoading: authLoading, checkAuthStatus } = useAuthStore();
  const { 
    businessTypes, 
    loading: loadingBusinessTypes, 
    error: businessError,
    fetchBusinessTypes,
    getBusinessTypeOptions 
  } = useBusinessStore();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");  
  const [businessTypeId, setBusinessTypeId] = useState("");
  const [showOptional, setShowOptional] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [localBusinessTypes, setLocalBusinessTypes] = useState([]);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [forceShowDropdown, setForceShowDropdown] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const redirectAttempted = useRef(false);
  const authCheckAttempted = useRef(false);

  // Get token from localStorage directly as fallback
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || localStorage.getItem('token');
    }
    return null;
  };

  // Check authentication properly
  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckAttempted.current) {
        return;
      }
      
      authCheckAttempted.current = true;
      
      if (user && isLoggedIn) {
        console.log('✅ User already logged in:', user.email);
        setIsCheckingAuth(false);
        return;
      }
      
      const token = getToken();
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        console.log('📦 Found stored auth data, validating...');
        try {
          await checkAuthStatus();
          setTimeout(() => {
            setIsCheckingAuth(false);
          }, 500);
          return;
        } catch (error) {
          console.error('Auth validation failed:', error);
        }
      }
      
      if (!redirectAttempted.current) {
        redirectAttempted.current = true;
        console.log('🔒 No valid session, redirecting to login');
        toast.error('Please login to continue', {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
        localStorage.setItem('redirectAfterLogin', '/order-summary');
        router.push('/login');
      }
    };
    
    checkAuth();
  }, [user, isLoggedIn, checkAuthStatus, router]);

  // Update isCheckingAuth when auth loading completes
  useEffect(() => {
    if (!authLoading && isCheckingAuth && (user || !authCheckAttempted.current)) {
      setIsCheckingAuth(false);
    }
  }, [authLoading, user, isCheckingAuth]);

  // Load selected plan from localStorage
  useEffect(() => {
    const loadPlanData = () => {
      setIsLoadingPlan(true);
      
      // Try to get plan from localStorage first
      let planData = localStorage.getItem('selectedPlan');
      console.log("Raw plan data from localStorage:", planData);
      
      // If not in localStorage, try sessionStorage
      if (!planData) {
        planData = sessionStorage.getItem('selectedPlan');
        console.log("Raw plan data from sessionStorage:", planData);
      }
      
      // If still not found, try to get from URL params
      if (!planData) {
        const urlParams = new URLSearchParams(window.location.search);
        const planParam = urlParams.get('plan');
        if (planParam) {
          try {
            const decodedPlan = JSON.parse(decodeURIComponent(planParam));
            console.log("Plan from URL params:", decodedPlan);
            setSelectedPlan(decodedPlan);
            setIsLoadingPlan(false);
            return;
          } catch (e) {
            console.error('Error parsing plan from URL:', e);
          }
        }
      }
      
      if (planData) {
        try {
          const parsedPlan = JSON.parse(planData);
          console.log("Parsed plan data:", parsedPlan);
          setSelectedPlan(parsedPlan);
          setIsLoadingPlan(false);
          logger.log("Loaded plan:", parsedPlan.name);
        } catch (e) {
          logger.error("Error parsing plan:", e);
          toast.error('Invalid plan data', {
            position: "top-right",
            autoClose: 3000,
            transition: Bounce,
          });
          router.push('/pricing');
        }
      } else {
        console.log("No plan data found in storage");
        toast.error('No plan selected. Please choose a plan first.', {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
        router.push('/pricing');
      }
    };

    // Only load plan after auth check is complete
    if (!isCheckingAuth && !authLoading) {
      loadPlanData();
    }
  }, [router, isCheckingAuth, authLoading]);

  // Fetch business types using business store - only once
  useEffect(() => {
    const loadBusinessTypes = async () => {
      const token = getToken();
      
      if (token && !fetchAttempted && !isCheckingAuth && isLoggedIn) {
        setFetchAttempted(true);
        try {
          logger.log('🔄 Fetching business types...');
          console.log('Calling fetchBusinessTypes with token');
          
          const result = await fetchBusinessTypes(token);
          
          console.log('Business types fetch result:', result);
          logger.log('Business types fetch result:', result?.length || 0, 'items');
          
          if (result && result.length > 0) {
            console.log('First business type:', result[0]);
            setLocalBusinessTypes(result);
            setForceShowDropdown(true);
          } else {
            console.warn('No business types returned from API');
            // Set fallback business types for testing
            const fallbackTypes = [
              { id: 1, name: "Individual/Sole Proprietorship" },
              { id: 2, name: "Partnership" },
              { id: 3, name: "Private Limited Company" },
              { id: 4, name: "Public Limited Company" },
              { id: 5, name: "LLP (Limited Liability Partnership)" },
              { id: 6, name: "Trust/Society/NGO" }
            ];
            console.log('Using fallback business types:', fallbackTypes);
            setLocalBusinessTypes(fallbackTypes);
            setForceShowDropdown(true);
          }
        } catch (error) {
          console.error('Failed to fetch business types:', error);
          logger.error('Failed to fetch business types:', error);
          
          // Set fallback business types on error
          const fallbackTypes = [
            { id: 1, name: "Individual/Sole Proprietorship" },
            { id: 2, name: "Partnership" },
            { id: 3, name: "Private Limited Company" },
            { id: 4, name: "Public Limited Company" },
            { id: 5, name: "LLP (Limited Liability Partnership)" },
            { id: 6, name: "Trust/Society/NGO" }
          ];
          console.log('Using fallback business types due to error:', fallbackTypes);
          setLocalBusinessTypes(fallbackTypes);
          setForceShowDropdown(true);
        }
      }
    };
    
    loadBusinessTypes();
  }, [fetchBusinessTypes, fetchAttempted, isCheckingAuth, isLoggedIn]);

  // Update local business types when store updates
  useEffect(() => {
    if (businessTypes && businessTypes.length > 0) {
      console.log('Business types loaded in store:', businessTypes.length, 'items');
      logger.log('Business types loaded in store:', businessTypes.length, 'items');
      setLocalBusinessTypes(businessTypes);
      setForceShowDropdown(true);
    }
  }, [businessTypes]);

  // Load user data from Zustand store
  useEffect(() => {
    const getUserData = () => {
      if (user) {
        setLoggedInUser(user);
        
        if (user.name) setCustomerName(user.name);
        if (user.email) setCustomerEmail(user.email);
        if (user.phone) setCustomerPhone(user.phone);
        if (user.mobile) setCustomerPhone(user.mobile);
        if (user.customer_id) setCustomerId(user.customer_id);
        if (user.id) setCustomerId(user.id);
        if (user.company_name) setCompanyName(user.company_name);
        if (user.gst_number) setGstNumber(user.gst_number);
        if (user.address) setBillingAddress(user.address);
        if (user.business_type_id) setBusinessTypeId(String(user.business_type_id));
          
        logger.log("Logged-in user loaded:", user.name || user.email);
        console.log("User business_type_id:", user.business_type_id);
        console.log("User customer_id:", user.customer_id || user.id);
      }
    };
    
    getUserData();
  }, [user]);
  
  // Auto set businessTypeId from selected plan (only if present)
  useEffect(() => {
    if (selectedPlan?.businessType?.id && localBusinessTypes.length > 0 && !businessTypeId) {
      const match = localBusinessTypes.find(
        (bt) => String(bt.id) === String(selectedPlan.businessType.id)
      );

      if (match) {
        setBusinessTypeId(String(match.id));
        logger.log('Auto-set business type from plan:', match.name);
        console.log('Auto-set business type ID:', match.id);
      }
    }
  }, [selectedPlan, localBusinessTypes, businessTypeId]);

  const calculateGST = () => {
    if (!selectedPlan) return 0;
    const price = Number(selectedPlan.price);
    const gstRate = selectedPlan.gst || 0;
    return (price * gstRate) / 100;
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    const price = Number(selectedPlan.price);
    return price + calculateGST();
  };

  const loadCashfreeSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.Cashfree) {
        resolve(window.Cashfree);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      script.onload = () => {
        if (window.Cashfree) {
          resolve(window.Cashfree);
        } else {
          reject(new Error('Cashfree SDK failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error('No plan selected!', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    // Validate required fields
    if (!customerName?.trim()) {
      toast.error('Please enter your full name', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    if (!customerEmail?.trim()) {
      toast.error('Please enter your email address', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    if (!customerPhone?.trim()) {
      toast.error('Please enter your phone number', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error('Please enter a valid email address', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit phone number', {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    // Get customer ID
    let customerIdValue = customerId || loggedInUser?.customer_id || loggedInUser?.id;
    
    if (!customerIdValue) {
      toast.error("Customer not found. Please login again.", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      localStorage.setItem('redirectAfterLogin', '/order-summary');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setIsProcessing(true);
    const loadingToastId = toast.loading('Creating order...', {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });

    try {
      const totalAmount = calculateTotal();
      
      // Get selected business type name (if selected)
      const selectedBusinessType = businessTypeId ? localBusinessTypes.find(bt => String(bt.id) === String(businessTypeId)) : null;
      
      // Clean phone number
      const cleanCustomerPhone = customerPhone.replace(/\D/g, '');
      
      // Get the first business type from API as default, or fallback to 1
      const DEFAULT_BUSINESS_TYPE_ID = localBusinessTypes.length > 0 ? localBusinessTypes[0].id : 1;
      
      // Use selected business type ID if provided, otherwise use default from API
      const finalBusinessTypeId = businessTypeId ? parseInt(businessTypeId) : DEFAULT_BUSINESS_TYPE_ID;
      
      logger.log("Business Type - Selected:", businessTypeId, "Final:", finalBusinessTypeId);
      logger.log("Available business types:", localBusinessTypes.length);
      
      // Prepare payload
      const payload = {
        amount: Number(totalAmount.toFixed(2)),
        plan_id: selectedPlan.id,
        business_type_id: finalBusinessTypeId,
        customer_id: String(customerIdValue),
        customer_phone: cleanCustomerPhone,
      };

      // Add optional business details if provided
      if (companyName) payload.company_name = companyName;
      if (gstNumber) payload.gst_number = gstNumber;
      if (billingAddress) payload.billing_address = billingAddress;
      if (selectedBusinessType) payload.business_type_name = selectedBusinessType.name;

      logger.log("📤 Sending payload to backend");
      console.log("Payload:", payload);
      
      // Call the store action
      const response = await createOrderAction(payload);
      
      logger.log("📥 Response received");
      console.log("Response:", response);
      
      toast.dismiss(loadingToastId);

      // Extract payment session ID from response
      let paymentSessionId = null;
      
      if (response?.payment_session_id) {
        paymentSessionId = response.payment_session_id;
      } else if (response?.data?.payment_session_id) {
        paymentSessionId = response.data.payment_session_id;
      } else if (response?.sessionId) {
        paymentSessionId = response.sessionId;
      } else if (typeof response === 'string') {
        try {
          const parsed = JSON.parse(response);
          paymentSessionId = parsed.payment_session_id || parsed.sessionId;
        } catch(e) {
          // Ignore parsing errors
        }
      }
      
      if (!paymentSessionId && response && typeof response === 'string' && response.length > 10) {
        paymentSessionId = response;
      }
      
      logger.log("🔑 Extracted paymentSessionId:", paymentSessionId ? 'Yes' : 'No');
      
      if (!paymentSessionId) {
        throw new Error('Payment session ID not found in response');
      }
      
      toast.success('Order created! Redirecting to payment...', {
        position: "top-right",
        autoClose: 2000,
        transition: Bounce,
      });
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('planPurchaseCompleted', { 
        detail: { 
          status: 'initiated', 
          planPurchased: true,
          planType: selectedPlan.billingCycle,
          amount: totalAmount
        } 
      }));
      
      // Load and initialize Cashfree
      const Cashfree = await loadCashfreeSDK();
      const cashfree = new Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox',
      });
      
      // Store order info before redirect
      const orderInfo = {
        paymentSessionId: paymentSessionId,
        customerEmail: customerEmail,
        customerPhone: cleanCustomerPhone,
        totalAmount: totalAmount,
        planName: selectedPlan.name,
        customerId: customerIdValue,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingPayment', JSON.stringify(orderInfo));
      
      // Open checkout
      await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self"
      });
      
    } catch (error) {
      toast.dismiss(loadingToastId);
      logger.error('❌ Payment error:', error);
      console.error('Payment error details:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message?.includes('customer_id')) {
        errorMessage = 'Invalid customer ID format. Please try again.';
      } else if (error.message?.includes('plan_id')) {
        errorMessage = 'Invalid plan selected. Please try again.';
      } else if (error.message?.includes('business_type_id')) {
        errorMessage = 'Business type is required. Please select a business type.';
      } else if (error.message?.includes('amount')) {
        errorMessage = 'Invalid amount. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        transition: Bounce,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading state while checking auth or loading plan
  if (isCheckingAuth || authLoading || isLoadingPlan || !selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            {isCheckingAuth || authLoading ? 'Checking authentication...' : 'Loading plan details...'}
          </p>
        </div>
      </div>
    );
  }

  // If not logged in after check, show nothing (redirect will happen)
  if (!isLoggedIn && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e8eef9]">
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#2d236b] to-[#5b5bd6] px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <FiCheckCircleIcon />
                  Review Order Summary
                </h2>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Plan</h3>
                <div className="bg-gradient-to-br from-[#f8f9ff] to-white border border-[#e0e4f0] rounded-xl p-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-green-600">SELECTED PLAN</span>
                      </div>
                      <h4 className="text-2xl font-bold text-[#2d236b]">{selectedPlan.name}</h4>
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        <FaCalendarAlt className="w-4 h-4" />
                        {selectedPlan.billingCycle === 'monthly' ? 'Monthly Billing' : 'Yearly Billing'}
                      </p>
                      {selectedPlan.businessType && (
                        <p className="text-xs text-purple-600 mt-1">
                          <FaIndustry className="inline mr-1 w-3 h-3" /> Business Type: {selectedPlan.businessType.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {selectedPlan.originalPrice && selectedPlan.originalPrice > selectedPlan.price && (
                        <p className="text-gray-400 line-through text-sm">₹{selectedPlan.originalPrice}</p>
                      )}
                      <p className="text-3xl font-bold text-[#5b5bd6]">₹{selectedPlan.price}</p>
                      {selectedPlan.discount > 0 && (
                        <p className="text-xs text-green-600 mt-1"><FaStar className="inline mr-1" /> {selectedPlan.discount}% OFF</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Details Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-[#5b5bd6]" />
                    Customer Details <span className="text-red-500 text-sm">*Required</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number (e.g., 9876543210)</p>
                    </div>
                  </div>
                </div>

                {/* Business Details Section */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <FaBuilding className="text-[#5b5bd6]" />
                      Add Business Details <span className="text-xs text-gray-500 font-normal">(Recommended)</span>
                    </span>
                    <span className="text-[#5b5bd6]">{showOptional ? <FaMinus /> : <FaPlus />}</span>
                  </button>
                  
                  {showOptional && (
                    <div className="mt-4 p-6 bg-[#F0F8FF] rounded-xl space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter your company name"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      
                      {/* Business Type Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type <span className="text-gray-400 text-xs font-normal">(Recommended)</span>
                        </label>
                        
                        {(localBusinessTypes.length > 0 || forceShowDropdown) && (
                          <>
                            <select
                              value={businessTypeId}
                              onChange={(e) => {
                                console.log('Business type selected:', e.target.value);
                                setBusinessTypeId(e.target.value);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all bg-white"
                            >
                              <option value="">Select Business Type (Default will be used if not selected)</option>
                              {localBusinessTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                            
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {localBusinessTypes.length} business type(s) loaded
                            </p>
                          </>
                        )}
                        
                        {loadingBusinessTypes && localBusinessTypes.length === 0 && (
                          <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg flex items-center gap-2">
                            <FaSpinner className="animate-spin text-[#5b5bd6] w-4 h-4" />
                            <span className="text-gray-600 text-sm">Loading business types...</span>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          If not selected, "{localBusinessTypes.length > 0 ? localBusinessTypes[0].name : 'Individual/Sole Proprietorship'}" will be used
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          placeholder="Enter GST number"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Required only for GST invoice</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <textarea
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          placeholder="Enter your billing address"
                          rows="3"
                          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <FaInfoCircle className="inline mr-1" /> <span className="font-semibold">Note:</span> A default business type will be used if you don't select one. You can update this later in your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#2d236b] flex items-center gap-2">
                  <FaRupeeSign className="text-[#5b5bd6]" />
                  Price Details
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">{selectedPlan.name}</span>
                  <span className="font-semibold">₹{selectedPlan.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">GST ({selectedPlan.gst || 18}%)</span>
                  <span className="font-semibold">₹{calculateGST().toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-[#5b5bd6]">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">Inclusive of all taxes</p>
                </div>

                {storeError && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600 text-center">{storeError}</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || storeLoading}
                  className={`w-full mt-6 py-4 bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                    (isProcessing || storeLoading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing || storeLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin h-5 w-5" />
                      {storeLoading ? 'Creating Order...' : 'Processing...'}
                    </span>
                  ) : (
                    <>Pay ₹{calculateTotal().toFixed(2)} Securely</>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500"><FaLockIcon className="inline mr-1" /> Secured by Cashfree</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;