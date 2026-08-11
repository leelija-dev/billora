"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaClock, FaReceipt, FaShoppingBag } from "react-icons/fa";
import { logger } from '../../utils/logger';

const OrderSuccessContent = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [orderDetails, setOrderDetails] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setMounted(true);

    // Get order details from localStorage
    const pendingOrder = localStorage.getItem("pendingProductOrder");
    if (pendingOrder) {
      try {
        const order = JSON.parse(pendingOrder);
        setOrderDetails(order);
        console.log("✅ Retrieved order details:", order);
      } catch (e) {
        logger.error("Error parsing order:", e);
      }
    }

    // Get user ID from localStorage (stored during order placement)
    const storedUserId = localStorage.getItem("productUserId");
    console.log("📌 Stored user ID from localStorage:", storedUserId);
    
    if (storedUserId) {
      try {
        const parsedUserId = JSON.parse(storedUserId);
        setUserId(parsedUserId);
        console.log("✅ Retrieved user ID for redirect:", parsedUserId);
      } catch (e) {
        logger.error("Error parsing user ID:", e);
      }
    } else {
      console.log("⚠️ No user ID found in localStorage");
    }
  }, []);

  // Handle redirect separately when userId is available
  useEffect(() => {
    if (!userId && orderDetails) {
      console.log("⚠️ Waiting for userId to be set before redirect");
      return;
    }

    if (userId || orderDetails) {
      console.log("🚀 Starting redirect timer with userId:", userId);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            
            // Clear localStorage before redirect to prevent showing old data
            console.log("🧹 Clearing localStorage before redirect");
            localStorage.removeItem("productUserId");
            localStorage.removeItem("pendingProductOrder");
            
            // Use router.push for client-side navigation
            if (userId) {
              console.log("🔄 Redirecting to products page with user ID:", userId);
              router.push(`/products/${userId}`);
            } else if (orderDetails?.userId) {
              console.log("🔄 Redirecting with userId from orderDetails:", orderDetails.userId);
              router.push(`/products/${orderDetails.userId}`);
            } else {
              console.log("⚠️ No user ID found, redirecting to products page");
              router.push("/products");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [userId, orderDetails, router]);

  // Handle manual navigation without reload
  const handleContinueShopping = () => {
    // Clear localStorage before redirect
    console.log("🧹 Clearing localStorage on manual redirect");
    localStorage.removeItem("productUserId");
    localStorage.removeItem("pendingProductOrder");
    
    if (userId) {
      console.log("🔵 Manual redirect to products with user ID:", userId);
      router.push(`/products/${userId}`);
    } else if (orderDetails?.userId) {
      router.push(`/products/${orderDetails.userId}`);
    } else {
      router.push("/products");
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800">No order found</h1>
          <p className="text-gray-600 mt-2">You have not ordered yet.</p>

          <button
            onClick={handleContinueShopping}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden relative">
      {/* Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${(i * 3.33) % 100}%`,
              animationDelay: `${(i * 0.07) % 2}s`,
              backgroundColor: `hsl(${(i * 12) % 360}, 100%, 50%)`,
              width: `${8 + (i % 8)}px`,
              height: `${8 + (i % 8)}px`,
              top: "-20px",
            }}
          />
        ))}
      </div>

      {/* Blasting Circles Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 animate-ping-slow rounded-full bg-green-300 opacity-20" />
          <div className="absolute inset-0 animate-ping-medium rounded-full bg-green-400 opacity-15" />
          <div className="absolute inset-0 animate-ping-fast rounded-full bg-green-500 opacity-10" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-5xl w-full mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Success Header & Order Info */}
              <div className="p-8 lg:p-10">
                {/* Success Header */}
                <div className="text-center lg:text-left mb-6">
                  <div className="inline-block lg:inline-flex">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 animate-ping-slow rounded-full bg-green-300 opacity-30" />
                      <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-4 inline-block">
                        <FaCheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
                    Order Placed Successfully!
                  </h1>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Note:</strong>{" "}
                    <span className="text-red-500">
                      Please save your Order ID. You will be automatically redirected to the Products page shortly.
                    </span>
                  </p>
                </div>

                {/* Order Details */}
                {orderDetails && (
                  <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm">Order ID:</span>
                        <span className="font-mono font-bold text-gray-800 text-sm">
                          ORD{orderDetails.orderId || "PROD" + Date.now()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm">Total Amount:</span>
                        <span className="text-xl font-bold text-green-600">
                          ₹{orderDetails.totalAmount?.toLocaleString() || "0"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Items:</span>
                        <span className="font-semibold text-gray-800">
                          {orderDetails.items || 0} products
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </button>
                </div>

                {/* Auto Redirect Message */}
                <p className="text-center text-gray-400 text-xs mt-4">
                  Redirecting to products in {countdown} seconds...
                </p>
              </div>

              {/* Right Side - Order Status Timeline */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-6 text-lg">Order Status</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-8">
                    <div className="flex items-start gap-4 relative">
                      <div className="relative z-10 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <FaCheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Order Confirmed</p>
                        <p className="text-sm text-gray-500">Your have successfully placed the order</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 relative">
                      <div className="relative z-10 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                        <FaClock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Processing</p>
                        <p className="text-sm text-gray-500">Your Order is being processed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 relative">
                      <div className="relative z-10 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaReceipt className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-400">Delivered</p>
                        <p className="text-sm text-gray-400">Order completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes ping-medium {
          0% {
            transform: scale(0.9);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @keyframes ping-fast {
          0% {
            transform: scale(1);
            opacity: 0.15;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-confetti {
          animation: confetti-fall 3s ease-out forwards;
          position: absolute;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-medium {
          animation: ping-medium 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-fast {
          animation: ping-fast 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccessContent;