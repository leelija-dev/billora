"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRupeeSign, FaUser, FaBuilding } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
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
  const [businessTypeId, setBusinessTypeId] = useState(""); // Add business type
  const [showOptional, setShowOptional] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Business type options (adjust based on your backend requirements)
  const businessTypes = [
    { id: "1", name: "Individual / Sole Proprietorship" },
    { id: "2", name: "Partnership" },
    { id: "3", name: "Private Limited Company" },
    { id: "4", name: "Public Limited Company" },
    { id: "5", name: "LLP (Limited Liability Partnership)" },
    { id: "6", name: "Trust / NGO / Society" },
    { id: "7", name: "Others" }
  ];

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

  const calculateGST = () => {
    if (!selectedPlan) return 0;
    const price = parseFloat(selectedPlan.price.replace(/,/g, ''));
    return (price * 18) / 100;
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    const price = parseFloat(selectedPlan.price.replace(/,/g, ''));
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

    // Validate business type if company name is provided (or make it required)
    if (companyName && !businessTypeId) {
      toast.error('Please select business type for your company');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(customerPhone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Get user ID
    let userId = loggedInUser?.id || 
                 (() => {
                   try {
                     const userStr = localStorage.getItem('user');
                     return userStr ? JSON.parse(userStr).id : null;
                   } catch(e) { return null; }
                 })();

    if (!userId) {
      toast.error("Please login again");
      localStorage.setItem('redirectAfterLogin', '/order-summary');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Creating order...');

    try {
      const totalAmount = calculateTotal();
      const gstAmount = calculateGST();
      const basePrice = parseFloat(selectedPlan.price.replace(/,/g, ''));
      
      // Generate order ID
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderId = `ORD${timestamp}${randomStr}`;
      
      // Create customer ID (must be alphanumeric)
      let customerId = `CUST${userId}`;
      if (customerId.length < 6) {
        customerId = customerId.padEnd(6, '0');
      }
      
      const payload = {
        customer_id: customerId,
        order_id: orderId,
        amount: Number(totalAmount.toFixed(2)),
        currency: "INR",
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        db_user_id: userId,
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        plan_billing_cycle: selectedPlan.billingCycle,
        plan_price: basePrice,
        plan_original_price: selectedPlan.originalPrice || null,
        gst_rate: 18,
        gst_amount: Number(gstAmount.toFixed(2)),
        company_name: companyName || null,
        gst_number: gstNumber || null,
        billing_address: billingAddress || null,
        business_type_id: businessTypeId || null, // Add business type ID
        return_url: `${window.location.origin}/payment-status`,
        notify_url: `${window.location.origin}/api/cashfree/webhook`
      };

      console.log("📤 Sending payload:", payload);
      
      // Call the store action
      const response = await createOrderAction(payload);
      
      console.log("📥 Full response from createOrderAction:", response);
      
      toast.dismiss(loadingToast);

      // Extract payment session ID from different possible response formats
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
        } catch(e) {}
      }
      
      if (!paymentSessionId && response && typeof response === 'string' && response.length > 20) {
        paymentSessionId = response;
      }
      
      console.log("🔑 Extracted paymentSessionId:", paymentSessionId);
      
      if (!paymentSessionId) {
        console.error("Response structure:", JSON.stringify(response, null, 2));
        throw new Error(response?.message || response?.error || 'Payment session ID not found in response');
      }
      
      toast.success('Order created! Redirecting to payment...');
      
      // Load and initialize Cashfree
      const Cashfree = await loadCashfreeSDK();
      const cashfree = new Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox',
      });
      
      // Open checkout
      const paymentResult = await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self"
      });
      
      console.log("Payment checkout result:", paymentResult);
      
      // Store payment info for reference
      const orderInfo = {
        orderId: orderId,
        paymentSessionId: paymentSessionId,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        totalAmount: totalAmount,
        planName: selectedPlan.name,
        userId: userId,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingPayment', JSON.stringify(orderInfo));
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('❌ Payment error:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message?.includes('business_type_id')) {
        errorMessage = 'Business type is required. Please select your business type.';
      } else if (error.message?.includes('customer')) {
        errorMessage = 'Customer validation failed. Please check your details.';
      } else if (error.message?.includes('session')) {
        errorMessage = 'Unable to create payment session. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e8eef9]">
      <Toaster position="top-right" />
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
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
                    </div>
                    <div className="text-right">
                      {selectedPlan.originalPrice && (
                        <p className="text-gray-400 line-through text-sm">₹{selectedPlan.originalPrice}</p>
                      )}
                      <p className="text-3xl font-bold text-[#5b5bd6]">₹{selectedPlan.price}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
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
                      Add Business Details
                    </span>
                    <span className="text-[#5b5bd6]">{showOptional ? "−" : "+"}</span>
                  </button>
                  
                  {showOptional && (
                    <div className="mt-4 p-6 bg-gray-50 rounded-xl space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Enter your company name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      
                      {/* Business Type Dropdown */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Type {companyName && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          value={businessTypeId}
                          onChange={(e) => setBusinessTypeId(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all bg-white"
                        >
                          <option value="">Select Business Type</option>
                          {businessTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        {companyName && !businessTypeId && (
                          <p className="text-red-500 text-xs mt-1">Please select business type</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          placeholder="Enter GST number"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address
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
                  <span className="text-gray-600">GST (18%)</span>
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