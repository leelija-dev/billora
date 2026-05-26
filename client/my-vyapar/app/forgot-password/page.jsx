"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPassword } from "../../services/authService";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Clear any existing messages when component mounts
  useEffect(() => {
    // Clear any stored reset messages
    sessionStorage.removeItem('reset_success');
  }, []);

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError("Please enter a valid email address (e.g., name@example.com)");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value !== "") validateEmail(value);
    else setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    
    setLoading(true);
    
    const loadingToastId = toast.loading("Sending reset link...", {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    
    try {
      const response = await forgotPassword(email);
      
      toast.dismiss(loadingToastId);
      
      if (response.status === true) {
        setSubmitted(true);
        toast.success(response.message || "Password reset link sent! Please check your email.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        throw new Error(response.message || "Failed to send reset link");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      
      let errorMessage = "";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors?.email) {
        errorMessage = error.response.data.errors.email[0];
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "Failed to send reset link. Please try again.";
      }
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  // If submitted, show success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        
        <div className="flex-1 flex justify-center items-center font-sans relative py-8">
          <div className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#2d236b] mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a password reset link to <strong className="text-[#5b5bd6]">{email}</strong>
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  📧 Please check your inbox and spam folder. The link will expire in 60 minutes.
                </p>
              </div>
            </div>
            
            <Link href="/login">
              <button className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
                Back to Login
              </button>
            </Link>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full mt-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-base font-medium cursor-pointer hover:bg-gray-50 transition-all duration-300"
            >
              Try Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      
      <div className="flex-1 flex justify-center items-center font-sans relative py-8">
        <form onSubmit={handleSubmit} className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8">
          
          <Link href="/login" className="inline-flex items-center text-[#5b5bd6] hover:text-[#3b82f6] mb-6 transition-colors">
            <FaArrowLeft className="mr-2" size={14} />
            Back to Login
          </Link>
          
          <h1 className="text-center text-[#2d236b] mb-4 text-3xl font-bold max-sm:text-2xl">
            Forgot Password?
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="flex flex-col mb-6">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Email Address *</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateEmail(email)}
                placeholder="name@company.com" 
                className={`w-full p-3 pl-12 rounded-[30px] border outline-none focus:border-[#5b5bd6] transition-colors ${
                  emailError ? "border-red-500 bg-red-50" : "border-[#ccc]"
                }`}
                required
                disabled={loading}
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1 ml-3">{emailError}</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "SENDING..." : "SEND RESET LINK"}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-[#3b82f6] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;