"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const PaymentStatus = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    verifyAndUpdatePayment();
  }, []);

  const verifyAndUpdatePayment = async () => {
    try {
      // Get order_id from URL parameters
      const orderId = searchParams.get('order_id');
      const sessionId = searchParams.get('session_id');
      
      console.log("Verifying payment for order:", orderId);
      console.log("Session ID:", sessionId);
      
      if (!orderId && !sessionId) {
        setStatus("error");
        toast.error("No order information found");
        return;
      }

      // Call backend to verify and update payment status
      const response = await fetch(`http://localhost:8000/api/cashfree/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          session_id: sessionId
        })
      });

      const data = await response.json();
      console.log("Verification response:", data);

      if (data.success && data.payment_status === "SUCCESS") {
        setStatus("success");
        setPaymentDetails({
          orderId: data.order_id,
          amount: data.amount
        });
        
        // Update local storage
        const pendingPayment = localStorage.getItem('pendingPayment');
        if (pendingPayment) {
          const paymentInfo = JSON.parse(pendingPayment);
          
          const purchaseData = {
            orderId: data.order_id,
            plan: paymentInfo.planName,
            amount: paymentInfo.totalAmount,
            date: new Date().toISOString(),
            status: "successful"
          };
          
          const existingHistory = localStorage.getItem('purchaseHistory');
          let history = existingHistory ? JSON.parse(existingHistory) : [];
          history.unshift(purchaseData);
          localStorage.setItem('purchaseHistory', JSON.stringify(history));
          
          localStorage.removeItem('pendingPayment');
          localStorage.removeItem('selectedPlan');
        }
        
        toast.success("Payment successful!");
      } else {
        setStatus("error");
        toast.error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      toast.error("Failed to verify payment");
    }
  };

  // Rest of your component remains same...
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Verifying Payment...</h2>
          <p className="text-gray-500 mt-2">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600 mb-6">Your plan has been activated successfully.</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-500">Order ID: <span className="font-mono">{paymentDetails?.orderId}</span></p>
            <p className="text-sm text-gray-500 mt-1">Amount: <span className="font-semibold">₹{paymentDetails?.amount}</span></p>
          </div>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
        <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed ❌</h1>
        <p className="text-gray-600 mb-6">Your payment could not be processed.</p>
        
        <button
          onClick={() => router.push('/pricing')}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;