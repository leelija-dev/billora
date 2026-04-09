"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRupeeSign, FaUser, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import { usePaymentStore } from "@/store/paymentStore";
import Image from "next/image";

const ProductCheckout = () => {
  const router = useRouter();
  const { createOrderAction, loading: storeLoading, error: storeError } = usePaymentStore();
  
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");  
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  // Load cart and user data
  useEffect(() => {
    // Load cart from sessionStorage
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        
        // Calculate total
        const total = parsedCart.reduce((sum, item) => {
          return sum + ((item.selling_price || item.price) * item.quantity);
        }, 0);
        setTotalAmount(total);
        
        console.log("📦 Cart loaded:", parsedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error('Failed to load cart');
        router.push('/products');
      }
    } else {
      toast.error('Your cart is empty');
      router.push('/products');
    }

    // Load user data
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
          
          console.log("✅ User loaded:", user);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    };
    
    getUserData();
  }, [router]);

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

  if (!businessTypeId) {
    toast.error('Business type is required');
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
    
    // Get selected business type name
    const selectedBusinessType = businessTypes.find(bt => String(bt.id) === String(businessTypeId));
    
    // Clean phone number
    const cleanCustomerPhone = customerPhone.replace(/\D/g, '');
    
    // IMPORTANT: UNCOMMENT ALL REQUIRED FIELDS
    const payload = {
      // Required fields
      amount: Number(totalAmount.toFixed(2)),
      plan_id: selectedPlan.id,  // ✅ UNCOMMENT THIS - Required!
      business_type_id: parseInt(businessTypeId),
      customer_id: String(customerIdValue),
      
      // Additional fields - UNCOMMENT THESE TOO
      order_id: orderId,
      customer_name: customerName.trim().substring(0, 50),
      customer_email: customerEmail.trim().toLowerCase(),
      customer_phone: cleanCustomerPhone,
      
      // Plan details
      plan_name: selectedPlan.name,
      plan_billing_cycle: selectedPlan.billingCycle,
      plan_price: basePrice,
      plan_original_price: selectedPlan.originalPrice || null,
      plan_discount: selectedPlan.discount || 0,
      
      // Tax details
      gst_rate: selectedPlan.gst || 18,
      gst_amount: Number(calculateGST().toFixed(2)),
      
      // Business details
      company_name: companyName || null,
      gst_number: gstNumber || null,
      billing_address: billingAddress || null,
      business_type_name: selectedBusinessType?.name || null,
      
      // Return URLs
      return_url: `${window.location.origin}/payment-status`,
      notify_url: `${window.location.origin}/api/cashfree/webhook`
    };

    console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));
    console.log("📞 Customer ID being sent (as string):", String(customerIdValue));
    console.log("📞 Customer phone being sent:", cleanCustomerPhone);
    console.log("📦 Plan ID being sent:", selectedPlan.id);
    
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
      } catch(e) {}
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
      customerPhone: cleanCustomerPhone,
      totalAmount: totalAmount,
      planName: selectedPlan.name,
      customerId: customerIdValue,
      timestamp: Date.now()
    };
    localStorage.setItem('pendingPayment', JSON.stringify(orderInfo));
    
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('❌ Payment error:', error);
    
    let errorMessage = 'Payment failed. Please try again.';
    if (error.message?.includes('customer_id')) {
      errorMessage = 'Invalid customer ID format. Please try again.';
    } else if (error.message?.includes('plan_id')) {
      errorMessage = 'Invalid plan selected. Please try again.';
    } else if (error.message?.includes('business_type_id')) {
      errorMessage = 'Business type is required. Please select your business type.';
    } else if (error.message?.includes('amount')) {
      errorMessage = 'Invalid amount. Please try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast.error(errorMessage, { duration: 5000 });
  } finally {
    setIsProcessing(false);
  }
};

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 text-lg">Your cart is empty</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Continue Shopping
            </button>
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
                  Review Your Order
                </h2>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaShoppingCart className="text-[#5b5bd6]" />
                  Order Items ({cartItems.length})
                </h3>
                
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 flex gap-4">
                      <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                        <img
                          src={item.img || "/image/placeholder.png"}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">₹{item.selling_price || item.price} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#5b5bd6]">
                          ₹{((item.selling_price || item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaUser className="text-[#5b5bd6]" />
                    Delivery Information <span className="text-red-500 text-sm">*Required</span>
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Address (Optional)
                      </label>
                      <textarea
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Enter your complete address"
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5b5bd6] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
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
                  Payment Summary
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-[#5b5bd6]">₹{totalAmount.toLocaleString()}</span>
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
                    `Pay ₹${totalAmount.toLocaleString()} Securely`
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">🔒 Secured by Cashfree</p>
                  <p className="text-xs text-gray-400 mt-2">UPI | Cards | NetBanking | Wallets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCheckout;