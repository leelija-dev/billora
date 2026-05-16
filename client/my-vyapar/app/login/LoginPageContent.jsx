"use client";

import React, { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthStore } from "../../store/authStoreZustand";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logger } from '../../utils/logger';
import { loginUser } from '../../services/authService';

const Login = () => {
  const { login, isLoggedIn, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Add ref to prevent double login
  const loginAttempted = useRef(false);
  const redirectHandled = useRef(false);
  const toastShown = useRef(false);

  // Check for pending plan on mount
  useEffect(() => {
    const from = searchParams.get("from");
    const pendingPlan = localStorage.getItem("pendingPlan");
    
    logger.log("🔍 Login page loaded");
    logger.log("🔍 from param:", from);
    logger.log("🔍 pendingPlan exists:", !!pendingPlan);
    
    if (pendingPlan && !toastShown.current) {
      try {
        const planData = JSON.parse(pendingPlan);
        logger.log("📋 Found pending plan:", planData.name);
        toastShown.current = true;
        setTimeout(() => {
          toast.success(`Complete your ${planData.name} plan purchase!`, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }, 100);
      } catch (e) {
        logger.error("Error parsing pending plan:", e);
        localStorage.removeItem("pendingPlan");
      }
    }
    
    if (from !== "pricing" && !pendingPlan) {
      logger.log("🗑️ Normal login - clearing any old pending plan");
      localStorage.removeItem("pendingPlan");
    }
    
    // Reset login attempt flag when component mounts
    loginAttempted.current = false;
    redirectHandled.current = false;
    toastShown.current = false;
  }, [searchParams]);

  // Handle redirect after login with delay
  useEffect(() => {
    if (isLoggedIn && user && !redirectHandled.current) {
      redirectHandled.current = true;
      
      // Add a small delay to ensure toast is visible
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
          // Check if user has active plan
          const hasActivePlan = user?.plan_id && user?.is_active === 1;
          
          if (hasActivePlan) {
            // User has active plan - redirect to home page
            router.push("/");
          } else {
            // User doesn't have active plan - redirect to pricing page
            router.push("/pricing");
          }
        }
      }, 1500); // Increased delay to ensure toast is visible
      
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
      setEmailError("Please enter a valid email address (e.g., name@example.com)");
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
    
    // Prevent double login attempts
    if (loginAttempted.current || loading) {
      logger.log("⚠️ Login already in progress, skipping...");
      return;
    }
    
    setError("");
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors", {
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
    
    loginAttempted.current = true;
    setLoading(true);
    
    // Show loading toast
    const loadingToastId = toast.loading("Logging in...", {
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
      // Call loginUser API directly
      const response = await loginUser({ email, password });
      const responseData = response.data;
      
      // Check if login failed
      if (!responseData?.status) {
        toast.dismiss(loadingToastId);
        
        const errorMessage = responseData?.message || "Login failed. Please try again.";
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        
        setError(errorMessage);
        loginAttempted.current = false;
        setLoading(false);
        return;
      }
      
      const userData = responseData.user;
      const token = responseData.token;
      
      if (!userData || !token) {
        toast.dismiss(loadingToastId);
        const errorMessage = "Invalid response from server";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        setError(errorMessage);
        loginAttempted.current = false;
        setLoading(false);
        return;
      }
      
      logger.log("✅ User data:", userData);
      logger.log("✅ Token received:", token.substring(0, 20) + "...");
      
      toast.dismiss(loadingToastId);
      
      // Call store login with user data and token
      const result = login(userData, token);
      
      if (result.success) {
        toast.success("Login Successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        throw new Error(result.error || "Login failed");
      }
      
    } catch (error) {
      toast.dismiss(loadingToastId);
      loginAttempted.current = false;
      
      logger.error("❌ Login error:", error);
      
      let errorMessage = "";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } 
      else if (error.message) {
        errorMessage = error.message;
      }
      else {
        errorMessage = "Login failed. Please try again.";
      }
      
      console.log("📢 Extracted error message:", errorMessage);
      setError(errorMessage);
      
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col">
      {/* ToastContainer for react-toastify */}
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
        <form onSubmit={handleLogin} className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8">
          
          <h1 className="text-center text-[#2d236b] my-6 text-3xl font-bold max-sm:text-2xl">
            LOG IN
          </h1>

          {/* Show pending plan info if exists */}
          {(() => {
            const pendingPlan = typeof window !== 'undefined' ? localStorage.getItem('pendingPlan') : null;
            if (pendingPlan) {
              try {
                const planData = JSON.parse(pendingPlan);
                return (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-sm text-purple-800 text-center">
                      🎯 Complete your <strong>{planData.name}</strong> plan purchase after login
                    </p>
                  </div>
                );
              } catch(e) {
                return null;
              }
            }
            return null;
          })()}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-5 mb-6">
            <button 
              type="button"
              className="flex-1 py-3 rounded-[30px] border border-[#ddd] bg-white cursor-pointer hover:shadow-md transition-shadow"
              disabled={loading}
            >
              <FcGoogle size={25} className="mx-auto" />
            </button>
          </div>

          <div className="flex flex-col mb-5">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Email Address *</label>
            <input 
              type="email" 
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              placeholder="name@company.com" 
              className={`p-3 rounded-[30px] border outline-none focus:border-[#5b5bd6] transition-colors ${
                emailError ? "border-red-500 bg-red-50" : "border-[#ccc]"
              }`}
              required
              disabled={loading}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 ml-3">{emailError}</p>
            )}
          </div>

          <div className="flex flex-col mb-3 relative">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              placeholder="Enter your password"
              className={`p-3 rounded-[30px] border outline-none focus:border-[#5b5bd6] transition-colors pr-12 ${
                passwordError ? "border-red-500 bg-red-50" : "border-[#ccc]"
              }`}
              required
              disabled={loading}
            />
            <span
              className="absolute right-[18px] top-[38px] cursor-pointer text-[#555]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 ml-3">{passwordError}</p>
            )}
          </div>

          <p className="text-sm mb-5 cursor-pointer hover:text-[#3b82f6] transition-colors">
            Forgot password?
          </p>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>

          <div className="text-center mt-6 text-sm">
            <p className="mb-2">Can't Access Your Account?</p>
            <p>
              Don't have an account?{" "}
              <span 
                onClick={() => {
                  const redirect = searchParams.get("redirect");
                  const pendingPlan = localStorage.getItem('pendingPlan');
                  
                  if (pendingPlan) {
                    router.push("/register?redirect=/order-summary");
                  } else if (redirect) {
                    router.push(`/register?redirect=${encodeURIComponent(redirect)}`);
                  } else {
                    router.push("/register");
                  }
                }}
                className="text-[#3b82f6] font-bold cursor-pointer hover:underline"
              >
                SIGN UP
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;