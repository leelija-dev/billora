"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRupeeSign, FaUser, FaBuilding } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { usePaymentStore } from "@/store/paymentStore";

const OrderSummary = () => {
  const router = useRouter();
  const { createOrderAction, loading: storeLoading, error: storeError } = usePaymentStore();
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");  
  const [businessTypeId, setBusinessTypeId] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  // Fetch business types from backend
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        setLoadingBusinessTypes(true);
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business-types`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status && data.data) {
            setBusinessTypes(data.data);
          } else if (Array.isArray(data)) {
            setBusinessTypes(data);
          }
        }
      } catch (error) {
        console.error('Error fetching business types:', error);
        setBusinessTypes([]);
        toast.error('Failed to load business types. Please refresh the page.');
      } finally {
        setLoadingBusinessTypes(false);
      }
    };
    
    fetchBusinessTypes();
  }, []);

  // Load user data from localStorage/session
  useEffect(() => {
    const getUserData = () => {
      const userStr = localStorage.getItem('user') || 
                     sessionStorage.getItem('user') ||
                     localStorage.getItem('user_data');
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setLoggedInUser(user);
          
          if (user.name) setCustomerName(user.name);
          if (user.email) setCustomerEmail(user.email);
          if (user.phone) setCustomerPhone(user.phone);
          if (user.mobile) setCustomerPhone(user.mobile);
          if (user.customer_id) setCustomerId(user.customer_id);
          if (user.id) setCustomerId(user.id);
          
          console.log("✅ Logged-in user loaded:", user);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    };
    
    getUserData();
  }, []);

  // Load selected plan from localStorage
  useEffect(() => {
    const loadPlanData = () => {
      const planData = localStorage.getItem('selectedPlan');
      if (planData) {
        try {
          const parsedPlan = JSON.parse(planData);
          setSelectedPlan(parsedPlan);
          console.log("✅ Loaded plan:", parsedPlan);
        } catch (e) {
          console.error("Error parsing plan:", e);
          toast.error('Invalid plan data');
          router.push('/pricing');
        }
      } else {
        toast.error('No plan selected');
        router.push('/pricing');
      }
    };

    loadPlanData();
  }, [router]);
  
  // Auto set businessTypeId from selected plan (only if present)
  useEffect(() => {
    if (selectedPlan?.businessType?.id && businessTypes.length > 0) {
      const match = businessTypes.find(
        (bt) => String(bt.id) === String(selectedPlan.businessType.id)
      );

      if (match) {
        setBusinessTypeId(String(match.id));
      }
    }
  }, [selectedPlan, businessTypes]);

  const calculateGST = () => {
    if (!selectedPlan) return 0;
    const price = Number(selectedPlan.price);
    const gstRate = selectedPlan.gst || 18;
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
      toast.error('No plan selected!');
      return;
    }

    // Validate required fields
    if (!customerName?.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!customerEmail?.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!customerPhone?.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Get customer ID
    let customerIdValue = customerId || loggedInUser?.customer_id || loggedInUser?.id;
    
    if (!customerIdValue) {
      toast.error("Customer not found. Please login again.");
      localStorage.setItem('redirectAfterLogin', '/order-summary');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Creating order...');

    try {
      const totalAmount = calculateTotal();
      const basePrice = Number(selectedPlan.price);
      
      // Generate order ID
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
      const orderId = `ORD${timestamp}${randomStr}`;
      
      // Get selected business type name (if selected)
      const selectedBusinessType = businessTypeId ? businessTypes.find(bt => String(bt.id) === String(businessTypeId)) : null;
      
      // Clean phone number
      const cleanCustomerPhone = customerPhone.replace(/\D/g, '');
      
      // IMPORTANT: Since backend requires business_type_id, we need to send a default value
      // Default business type ID (Individual/Sole Proprietorship) - adjust based on your DB
      const DEFAULT_BUSINESS_TYPE_ID = 1; // Change this to match your default business type ID
      
      // Use selected business type ID if provided, otherwise use default
      const finalBusinessTypeId = businessTypeId ? parseInt(businessTypeId) : DEFAULT_BUSINESS_TYPE_ID;
      
      console.log("🏢 Business Type - Selected:", businessTypeId, "Final:", finalBusinessTypeId);
      
      // Prepare payload
      const payload = {
        // Required fields
        amount: Number(totalAmount.toFixed(2)),
        plan_id: selectedPlan.id,
        business_type_id: finalBusinessTypeId, // Always send a value
        customer_id: String(customerIdValue),
        
        // Optional fields
        customer_phone: cleanCustomerPhone,
      };

      // Add optional business details if provided
      if (companyName) payload.company_name = companyName;
      if (gstNumber) payload.gst_number = gstNumber;
      if (billingAddress) payload.billing_address = billingAddress;
      if (selectedBusinessType) payload.business_type_name = selectedBusinessType.name;

      console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));
      console.log("📞 Customer ID being sent (as string):", String(customerIdValue));
      console.log("📞 Customer phone being sent:", cleanCustomerPhone);
      console.log("🏢 Business type ID being sent:", finalBusinessTypeId);
      
      // Call the store action
      const response = await createOrderAction(payload);
      
      console.log("📥 Full response from createOrderAction:", response);
      
      toast.dismiss(loadingToast);

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
      
      console.log("🔑 Extracted paymentSessionId:", paymentSessionId);
      
      if (!paymentSessionId) {
        console.error("Response structure:", JSON.stringify(response, null, 2));
        throw new Error(response?.message || response?.error || 'Payment session ID not found in response');
      }
      
      toast.success('Order created! Redirecting to payment...');
      
      // After successful order creation and before payment redirect,
      // dispatch event to notify that plan purchase is initiated
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
      const paymentResult = await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self"
      });
      
      console.log("Payment checkout result:", paymentResult);
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('❌ Payment error:', error);
      
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
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading plan details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e8eef9]">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#2d236b] to-[#5b5bd6] px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <FaCheckCircle />
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
                      <p className="text-sm text-gray-500 mt-2">
                        📅 {selectedPlan.billingCycle === 'monthly' ? 'Monthly Billing' : 'Yearly Billing'}
                      </p>
                      {selectedPlan.businessType && (
                        <p className="text-xs text-purple-600 mt-1">
                          🏢 Business Type: {selectedPlan.businessType.name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {selectedPlan.originalPrice && selectedPlan.originalPrice > selectedPlan.price && (
                        <p className="text-gray-400 line-through text-sm">₹{selectedPlan.originalPrice}</p>
                      )}
                      <p className="text-3xl font-bold text-[#5b5bd6]">₹{selectedPlan.price}</p>
                      {selectedPlan.discount > 0 && (
                        <p className="text-xs text-green-600 mt-1">✨ {selectedPlan.discount}% OFF</p>
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

                {/* Business Details Section - Optional but backend requires it */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <FaBuilding className="text-[#5b5bd6]" />
                      Add Business Details <span className="text-xs text-gray-500 font-normal">(Recommended)</span>
                    </span>
                    <span className="text-[#5b5bd6]">{showOptional ? "−" : "+"}</span>
                  </button>
                  
                  {showOptional && (
                    <div className="mt-4 p-6 bg-gray-50 rounded-xl space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter your company name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      
                      {/* Business Type Dropdown - Now recommended but will use default if not selected */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type <span className="text-gray-400 text-xs font-normal">(Recommended)</span>
                        </label>
                        <select
                          value={businessTypeId}
                          onChange={(e) => setBusinessTypeId(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all bg-white"
                          disabled={loadingBusinessTypes}
                        >
                          <option value="">Select Business Type (Default will be used if not selected)</option>
                          {businessTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">If not selected, "Individual/Sole Proprietorship" will be used</p>
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">
                    ℹ️ <span className="font-semibold">Note:</span> A default business type will be used if you don't select one. You can update this later in your profile.
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
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {storeLoading ? 'Creating Order...' : 'Processing...'}
                    </span>
                  ) : (
                    `Pay ₹${calculateTotal().toFixed(2)} Securely`
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">🔒 Secured by Cashfree</p>
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