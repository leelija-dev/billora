"use client";

import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaRupeeSign, FaUser, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import { createProductOrder } from "@/services/productPaymentService";

const ProductCheckout = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");  
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [storeId, setStoreId] = useState(null);

  // Load cart and user data
  useEffect(() => {
    // Load checkout data from localStorage (from products page)
    const savedCheckout = localStorage.getItem('checkoutData');
    if (savedCheckout) {
      try {
        const checkoutData = JSON.parse(savedCheckout);
        setCartItems(checkoutData.cart);
        setTotalAmount(checkoutData.totalAmount);
        setCustomerName(checkoutData.customerName || "");
        setCustomerPhone(checkoutData.customerPhone || "");
        
        // Clear it after loading
        localStorage.removeItem('checkoutData');
        console.log("📦 Checkout data loaded:", checkoutData);
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast.error('Failed to load checkout data');
        router.push('/products');
      }
    } else {
      // Fallback to sessionStorage
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          const total = parsedCart.reduce((sum, item) => {
            return sum + ((item.selling_price || item.price) * item.quantity);
          }, 0);
          setTotalAmount(total);
          console.log("📦 Cart loaded from sessionStorage:", parsedCart);
        } catch (error) {
          console.error("Error loading cart:", error);
          toast.error('Failed to load cart');
          router.push('/products');
        }
      } else {
        toast.error('Your cart is empty');
        router.push('/products');
      }
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
          
          if (user.name) setCustomerName(prev => prev || user.name);
          if (user.email) setCustomerEmail(user.email);
          if (user.phone) setCustomerPhone(prev => prev || user.phone);
          if (user.mobile) setCustomerPhone(prev => prev || user.mobile);
          if (user.customer_id) setCustomerId(user.customer_id);
          if (user.id) setCustomerId(user.id);
          
          console.log("✅ User loaded:", user);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    };
    
    getUserData();

    // Fetch store ID with fallback
    const fetchStore = async () => {
      try {
        const { getUserStore } = await import('../../services/productService');
        const store = await getUserStore();
        
        console.log("🔍 Store data received:", store);
        
        if (store) {
          // Handle different response formats
          const storeIdValue = store.id || store.store_id || store;
          setStoreId(storeIdValue);
          console.log("✅ Store ID set to:", storeIdValue);
        } else {
          // Try to get from localStorage as fallback
          const storedStoreId = localStorage.getItem('store_id');
          if (storedStoreId) {
            setStoreId(JSON.parse(storedStoreId));
            console.log("✅ Store ID from localStorage:", storedStoreId);
          } else {
            // Default fallback - you may need to change this value
            const defaultStoreId = 1;
            setStoreId(defaultStoreId);
            console.log("⚠️ Using default store ID:", defaultStoreId);
          }
        }
      } catch (error) {
        console.error("Error fetching store:", error);
        // Fallback to default store ID
        const defaultStoreId = 1;
        setStoreId(defaultStoreId);
        console.log("⚠️ Error fallback - using default store ID:", defaultStoreId);
      }
    };
    fetchStore();
  }, [router]);

  const handlePayment = async () => {
    // Validate required fields
    if (!customerName?.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!customerPhone?.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
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
      localStorage.setItem('redirectAfterLogin', '/product-checkout');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    // Use default store ID if not available
    const finalStoreId = storeId || 1;
    console.log("🏪 Using store ID:", finalStoreId);

    setIsProcessing(true);
    setLoading(true);
    const loadingToast = toast.loading('Creating order...');

    try {
      // Prepare payload matching backend requirements
      const payload = {
        user_id: Number(customerIdValue),
        store_id: finalStoreId,
        customer_name: customerName.trim(),
        customer_phone: cleanPhone,
        product_id: cartItems.map(item => item.id),
        quantity: cartItems.map(item => item.quantity),
        unit_id: cartItems.map(item => item.unit_id || 1),
      };

      console.log("📤 Sending to backend:", payload);
      
      const response = await createProductOrder(payload);
      
      console.log("📥 Response:", response);
      
      toast.dismiss(loadingToast);

      if (response.status === true || response.success === true) {
        toast.success('Order placed successfully!');
        
        // Clear cart
        sessionStorage.removeItem('cart');
        localStorage.removeItem('checkoutData');
        
        // Redirect to orders page
        setTimeout(() => router.push('/orders'), 2000);
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('❌ Order error:', error);
      
      // Show more detailed error message
      let errorMsg = error.message || 'Failed to create order. Please try again.';
      if (errorMsg.includes('store_id')) {
        errorMsg = 'Store configuration error. Please contact support.';
      } else if (errorMsg.includes('user_id')) {
        errorMsg = 'Please login again to continue.';
      }
      
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
      setLoading(false);
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
                          onError={(e) => { e.target.src = "/image/placeholder.png"; }}
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
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address (Optional)
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
                        required
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

                {error && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600 text-center">{error}</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || loading}
                  className={`w-full mt-6 py-4 bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                    (isProcessing || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing || loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    `Place Order • ₹${totalAmount.toLocaleString()}`
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">🔒 Cash on Delivery available</p>
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