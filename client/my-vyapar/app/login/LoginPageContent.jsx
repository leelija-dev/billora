// app/login/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { useAuthStore } from "../../store/authStoreZustand";
import { useRouter, useSearchParams } from "next/navigation";
import { logger } from "../../utils/logger";
import Link from "next/link";

const Login = () => {
  const { login, isLoggedIn, user, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Add ref to prevent double login
  const loginAttempted = useRef(false);
  const redirectHandled = useRef(false);

  // Check for pending plan on mount
  useEffect(() => {
    const from = searchParams.get("from");
    const pendingPlan = localStorage.getItem("pendingPlan");

    logger.log("🔍 Login page loaded");
    logger.log("🔍 from param:", from);
    logger.log("🔍 pendingPlan exists:", !!pendingPlan);

    if (from !== "pricing" && !pendingPlan) {
      logger.log("🗑️ Normal login - clearing any old pending plan");
      localStorage.removeItem("pendingPlan");
    }

    loginAttempted.current = false;
    redirectHandled.current = false;
  }, [searchParams]);

  // Handle redirect after login with delay
  useEffect(() => {
    if (isLoggedIn && user && !redirectHandled.current) {
      redirectHandled.current = true;

      const redirectTimer = setTimeout(() => {
        const pendingPlan = localStorage.getItem("pendingPlan");

        if (pendingPlan) {
          try {
            const planData = JSON.parse(pendingPlan);
            router.push("/order-summary");
            return;
          } catch (e) {
            localStorage.removeItem("pendingPlan");
          }
        }

        const redirectUrl = searchParams.get("redirect");
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          const hasActivePlan = user?.plan_id && user?.is_active === 1;
          router.push(hasActivePlan ? "/" : "/pricing");
        }
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [isLoggedIn, user, router, searchParams]);

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

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    return isEmailValid && isPasswordValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginAttempted.current || isLoading) {
      logger.log("⚠️ Login already in progress, skipping...");
      return;
    }

    setError("");

    if (!validateForm()) {
      setError("Please fix the validation errors");
      return;
    }

    loginAttempted.current = true;

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error);
        loginAttempted.current = false;
      }
    } catch (error) {
      logger.error("❌ Login error:", error);
      setError(error.message || "Login failed. Please try again.");
      loginAttempted.current = false;
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value !== "") validateEmail(value);
    else setEmailError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value !== "") validatePassword(value);
    else setPasswordError("");
  };

  // If already logged in, show loading or redirect
  if (isLoggedIn && user && !redirectHandled.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gradient-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 bg-gradient-primary rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="mt-6 text-slate-700 font-medium">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px]">
        {/* Pending Plan Banner */}
        {(() => {
          const pendingPlan = typeof window !== "undefined" ? localStorage.getItem("pendingPlan") : null;
          if (pendingPlan) {
            try {
              const planData = JSON.parse(pendingPlan);
              return (
                <div className="mb-6 p-4 bg-gradient-to-r from-feature-amber/10 to-feature-amber/5 border border-feature-amber/30 rounded-2xl animate-slideDown">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-feature-amber/20 rounded-full flex items-center justify-center">
                      <span className="text-xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-feature-amber">
                        Complete your <strong>{planData.name}</strong> plan purchase
                      </p>
                      <p className="text-xs text-feature-amber/80 mt-0.5">
                        Sign in to proceed with checkout
                      </p>
                    </div>
                  </div>
                </div>
              );
            } catch (e) {
              return null;
            }
          }
          return null;
        })()}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-tertiary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm">
              Sign in to access your account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-5">
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
                  disabled={isLoading}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    passwordError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <Link
                href="/forgot-password"
                className="text-sm text-gradient-primary hover:text-gradient-secondary font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-tertiary hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-gradient-primary/20 flex items-center justify-center gap-2 rounded-xl text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            

           

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                New to our platform?{" "}
                <button
                  type="button"
                  onClick={() => {
                    const redirect = searchParams.get("redirect");
                    const pendingPlan = localStorage.getItem("pendingPlan");

                    if (pendingPlan) {
                      router.push("/register?redirect=/order-summary");
                    } else if (redirect) {
                      router.push(`/register?redirect=${encodeURIComponent(redirect)}`);
                    } else {
                      router.push("/register");
                    }
                  }}
                  className="text-gradient-primary font-semibold hover:text-gradient-secondary transition-colors ml-1"
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <FaShieldAlt className="w-3 h-3" />
            Secured with industry-standard encryption
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;