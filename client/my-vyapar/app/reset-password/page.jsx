"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { resetPassword } from "../../services/authService";
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

// Component that uses useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast.error("Invalid or missing reset token. Please request a new password reset link.", {
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
    }
  }, [token]);

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    // Optional: Add strong password validation
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setPasswordError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value !== "") validatePassword(value);
    else setPasswordError("");
    
    // Re-validate confirm password if it has a value
    if (passwordConfirmation) {
      validateConfirmPassword(passwordConfirmation);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setPasswordConfirmation(value);
    if (value !== "") validateConfirmPassword(value);
    else setConfirmPasswordError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Invalid reset token. Please request a new password reset link.", {
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
      return;
    }
    
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(passwordConfirmation);
    
    if (!isPasswordValid || !isConfirmValid) {
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
    
    setLoading(true);
    
    const loadingToastId = toast.loading("Resetting password...", {
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
      const response = await resetPassword(token, password, passwordConfirmation);
      
      toast.dismiss(loadingToastId);
      
      if (response.status === true) {
        setSubmitted(true);
        toast.success(response.message || "Password reset successful! You can now login with your new password.", {
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
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      
      let errorMessage = "";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors?.token) {
        errorMessage = "Invalid or expired reset token. Please request a new password reset link.";
      } else if (error.response?.data?.errors?.password) {
        errorMessage = error.response.data.errors.password[0];
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "Failed to reset password. Please try again.";
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
      
      // If token is invalid, show invalid token state
      if (errorMessage.includes("token") || errorMessage.includes("expired")) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // If token is invalid, show error state
  if (!tokenValid) {
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
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#2d236b] mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
            </div>
            
            <Link href="/forgot-password">
              <button className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
                Request New Reset Link
              </button>
            </Link>
            
            <Link href="/login">
              <button className="w-full mt-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-base font-medium cursor-pointer hover:bg-gray-50 transition-all duration-300">
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If successfully submitted, show success screen
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
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2d236b] mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your password has been successfully reset.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800">
                  🔐 You can now login with your new password. Redirecting to login page...
                </p>
              </div>
            </div>
            
            <Link href="/login">
              <button className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
                Go to Login
              </button>
            </Link>
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
          
          <h1 className="text-center text-[#2d236b] mb-4 text-3xl font-bold max-sm:text-2xl">
            Reset Password
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            Please enter your new password below.
          </p>
          
          <div className="flex flex-col mb-5">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">New Password *</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validatePassword(password)}
                placeholder="Enter new password"
                className={`w-full p-3 pl-12 pr-12 rounded-[30px] border outline-none focus:border-[#5b5bd6] transition-colors ${
                  passwordError ? "border-red-500 bg-red-50" : "border-[#ccc]"
                }`}
                required
                disabled={loading}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#555]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 ml-3">{passwordError}</p>
            )}
            <p className="text-gray-500 text-xs mt-2 ml-3">
              Password must be at least 6 characters with uppercase, lowercase, and numbers.
            </p>
          </div>
          
          <div className="flex flex-col mb-6">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Confirm New Password *</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordConfirmation}
                onChange={handleConfirmPasswordChange}
                onBlur={() => validateConfirmPassword(passwordConfirmation)}
                placeholder="Confirm new password"
                className={`w-full p-3 pl-12 pr-12 rounded-[30px] border outline-none focus:border-[#5b5bd6] transition-colors ${
                  confirmPasswordError ? "border-red-500 bg-red-50" : "border-[#ccc]"
                }`}
                required
                disabled={loading}
              />
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#555]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-xs mt-1 ml-3">{confirmPasswordError}</p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "RESETTING..." : "RESET PASSWORD"}
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
}

// Loading fallback component
function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col">
      <div className="flex-1 flex justify-center items-center font-sans relative py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5b5bd6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}