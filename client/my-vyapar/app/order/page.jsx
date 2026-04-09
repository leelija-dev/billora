"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrderSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart when success page loads
    sessionStorage.removeItem('cart');
    localStorage.removeItem('checkoutData');
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-600 mb-8">Thank you for shopping with us. Your order has been received.</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}