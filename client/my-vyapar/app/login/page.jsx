"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/authService";
import { saveAuthData } from "../../store/authStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Validation error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const router = useRouter();

  // Validation functions
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
    
    // Clear previous errors
    setError("");
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await loginUser({ email, password });
      
      if (res.status === false || res.success === false) {
        if (res.message && res.message.includes("User not found")) {
          throw new Error("No account found with this email. Please register first.");
        } else if (res.message && res.message.includes("password")) {
          throw new Error("Invalid password. Please try again.");
        } else if (res.message && res.message.includes("verify")) {
          throw new Error("Please verify your email before logging in. Check your inbox.");
        } else {
          throw new Error(res.message || "Invalid credentials");
        }
      }
      
      const userData = res.user || res.data?.user || res;
      const token = res.token || res.data?.token || null;
      
      saveAuthData(userData, token);
      
      alert("Login Successful ✅");
      router.push("/pricing");
      
    } catch (error) {
      if (error.message.includes("No account")) {
        setError("❌ No account found with this email. Please register first.");
      } else if (error.message.includes("password")) {
        setError("❌ Invalid password. Please try again.");
      } else if (error.message.includes("verify")) {
        setError("📧 Please verify your email before logging in. Check your inbox.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError(error.message || "❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation handlers
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col">
      
      <div className="flex-1 flex justify-center items-center font-sans relative py-8">
        {/* Back to Home Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-[#2d236b] font-medium z-10"
        >
          <FaHome className="text-[#5b5bd6]" size={20} />
          <span>Back to Home</span>
        </button>

        <form onSubmit={handleLogin} className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8">
          
          <h1 className="text-center text-[#2d236b] my-6 text-3xl font-bold max-sm:text-2xl">
            LOG IN
          </h1>

          {/* Server Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Social Buttons */}
          <div className="flex gap-5 mb-6">
            <button 
              type="button"
              className="flex-1 py-3 rounded-[30px] border border-[#ddd] bg-white cursor-pointer hover:shadow-md transition-shadow"
              disabled={loading}
            >
              <FcGoogle size={25} className="mx-auto" />
            </button>
          </div>

          {/* Email Field */}
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

          {/* Password Field */}
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
                onClick={() => router.push("/register")}
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