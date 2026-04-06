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
  const [showOptional, setShowOptional] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [debugInfo, setDebugInfo] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load user data from localStorage/session
  useEffect(() => {
    const getUserData = () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setLoggedInUser(user);
          
          if (user.name) setCustomerName(user.name);
          if (user.email) setCustomerEmail(user.email);
          if (user.phone) setCustomerPhone(user.phone);
          
          console.log("Logged-in user loaded:", user);
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
        const parsedPlan = JSON.parse(planData);
        setSelectedPlan(parsedPlan);
        console.log("Loaded plan:", parsedPlan);
      } else {
        toast.error('No plan selected. Redirecting to pricing...');
        setTimeout(() => router.push('/pricing'), 2000);
      }
    };

    const loadPurchaseHistory = () => {
      const history = localStorage.getItem('purchaseHistory');
      if (history) {
        setPurchaseHistory(JSON.parse(history));
      }
    };

    loadPlanData();
    loadPurchaseHistory();
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

    // Validate required customer details
    if (!customerName || !customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!customerEmail || !customerEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!customerPhone || !customerPhone.trim()) { 
      toast.error('Please enter your phone number');
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

    if (!loggedInUser || !loggedInUser.id) {
      toast.error("User not logged in properly. Please login again.");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading('Creating order...');

    try {
      const totalAmount = calculateTotal();
      const gstAmount = calculateGST();
      const basePrice = parseFloat(selectedPlan.price.replace(/,/g, ''));
      
      // Create valid customer ID (alphanumeric only)
      let customerId = String(loggedInUser.id);
      if (customerId.length < 3) {
        customerId = customerId.padStart(3, '0');
      }
      
      const timestamp = Date.now();
      const orderId = `ORD${timestamp}${Math.floor(Math.random() * 10000)}`;
      
      console.log("=== PAYMENT DEBUG INFO ===");
      console.log("Customer ID:", customerId);
      console.log("Order ID:", orderId);
      console.log("Amount:", totalAmount);
      console.log("Customer Email:", customerEmail);
      console.log("Customer Phone:", customerPhone);
      console.log("==========================");

      const payload = {
        customer_id: customerId,
        order_id: orderId,
        amount: Number(totalAmount.toFixed(2)),
        currency: "INR",
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        db_user_id: loggedInUser?.id || null,
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
        return_url: `${window.location.origin}/payment-status`,
        notify_url: `${window.location.origin}/api/cashfree/webhook`
      };

      console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));
      setDebugInfo({ type: 'sending', payload });

      // Call your API through the store
      const response = await createOrderAction(payload);
      
      console.log("📥 Backend response:", response);
      setDebugInfo({ type: 'response', response });

      toast.dismiss(loadingToast);

      if (response && response.payment_session_id) {
        toast.success('Order created! Redirecting to payment...');
        
        const Cashfree = await loadCashfreeSDK();
        const cashfree = new Cashfree({
          mode: process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox',
        });
        
        // Open payment in new window or same window
        const paymentResult = await cashfree.checkout({
          paymentSessionId: response.payment_session_id,
          redirectTarget: "_self" // Use "_blank" to open in new tab if preferred
        });
        
        console.log("Payment checkout initiated:", paymentResult);
        
        const orderInfo = {
          orderId: orderId,
          paymentSessionId: response.payment_session_id,
          customerEmail: customerEmail,
          customerPhone: customerPhone,
          totalAmount: totalAmount,
          planName: selectedPlan.name,
          userId: loggedInUser?.id,
          timestamp: Date.now()
        };
        localStorage.setItem('pendingPayment', JSON.stringify(orderInfo));
        
      } else {
        throw new Error(response?.message || response?.error || 'Failed to create payment session');
      }
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Payment error details:', error);
      setDebugInfo({ type: 'error', error: error.message, fullError: error });
      
      // Show more specific error message
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message.includes('customer id')) {
        errorMessage = 'Invalid customer ID. Please ensure you are logged in properly.';
      } else if (error.message.includes('API')) {
        errorMessage = 'Payment service error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e8eef9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e8eef9]">
      <Toaster position="top-right" />
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
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
                  {loggedInUser && (
                    <div className="mb-3 p-2 bg-green-50 rounded-lg text-xs text-green-700">
                      ✓ Logged in as user ID: {loggedInUser.id}
                    </div>
                  )}
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

                <div className="mt-6">
                  <button
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <FaBuilding className="text-[#5b5bd6]" />
                      Add Business Details (Optional)
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-[#2d236b] flex items-center gap-2">
                  <FaRupeeSign className="text-[#5b5bd6]" />
                  Price Details
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{selectedPlan.name}</span>
                    <span className="font-semibold text-gray-800">₹{selectedPlan.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold text-gray-800">₹{calculateGST().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3 mt-3">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-[#5b5bd6]">₹{calculateTotal().toFixed(2)}</span>
                      <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>

                {(storeError || debugInfo?.type === 'error') && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600 text-center">
                      {storeError || debugInfo?.error}
                    </p>
                  </div>
                )}

                {debugInfo && process.env.NODE_ENV === 'development' && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-lg text-xs overflow-auto max-h-60">
                    <p className="font-mono text-gray-600 font-bold mb-1">Debug Info:</p>
                    <pre className="font-mono text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || storeLoading}
                  className={`w-full mt-6 py-4 bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 transform ${
                    (isProcessing || storeLoading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {(isProcessing || storeLoading) ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {storeLoading ? 'Creating Order...' : 'Processing Payment...'}
                    </span>
                  ) : (
                    `Pay ₹${calculateTotal().toFixed(2)} Securely`
                  )}
                </button>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center mb-3">Secure Payments via Cashfree</p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {["💳 Credit Card", "🏦 Debit Card", "📱 UPI", "🏦 Net Banking", "💰 Wallet"].map((method, idx) => (
                      <span key={idx} className="text-xs opacity-75 px-2 py-1 bg-gray-50 rounded-full">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                  <p className="text-xs text-green-700">
                    🔒 100% Secure Transaction • Powered by Cashfree • 7-Day Money Back Guarantee
                  </p>
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