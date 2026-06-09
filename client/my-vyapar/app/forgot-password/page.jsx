"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPassword } from "../../services/authService";
import { FaArrowLeft, FaEnvelope, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem('reset_success');
  }, []);

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError("Please enter a valid email address");
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
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    const loadingToastId = toast.loading("Sending reset link...");
    
    try {
      const response = await forgotPassword(email);
      toast.dismiss(loadingToastId);
      
      if (response.status === true) {
        setSubmitted(true);
        toast.success(response.message || "Password reset link sent! Please check your email.");
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
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={3000} theme="light" transition={Bounce} />
        <div className="w-full max-w-[450px]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Check Your Email</h2>
            <p className="text-slate-600 mb-4">
              We've sent a password reset link to <strong className="text-gradient-primary">{email}</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800">
                📧 Please check your inbox and spam folder. The link will expire in 60 minutes.
              </p>
            </div>
            
            <Link href="/login">
              <button className="w-full py-3 bg-gradient-tertiary hover:shadow-lg transition-all duration-200 rounded-xl text-white font-semibold">
                Back to Login
              </button>
            </Link>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="w-full mt-3 py-3 border border-border-gray-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all duration-200"
            >
              Try Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} theme="light" transition={Bounce} />
      
      <div className="w-full max-w-[450px]">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-tertiary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Forgot Password?
            </h1>
            <p className="text-slate-600 text-sm">
              Enter your email to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    emailError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-tertiary hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-gradient-primary/20 flex items-center justify-center gap-2 rounded-xl text-white font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <FaArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Remember your password?{" "}
                <Link href="/login" className="text-gradient-primary font-semibold hover:text-gradient-secondary transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <FaShieldAlt className="w-3 h-3" />
            We'll send a secure link to reset your password
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;