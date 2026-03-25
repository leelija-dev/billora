"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth";  // ✅ Import authService

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

 

  // Add this to your login page
const handleLogin = async (e) => {
  e.preventDefault();
  
  setError("");
  
  if (!email || !password) {
    setError("Please enter both email and password");
    return;
  }
  
  setLoading(true);
  
  try {
    const response = await authService.login({ email, password });
    
    // Check if email is verified
    if (response.verified === false) {
      setError("Please verify your email first. Check your inbox for verification link.");
      setLoading(false);
      return;
    }
    
    // Store token and user data
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    
    router.push("/dashboard");
    
  } catch (err) {
    if (err.message.includes("verify")) {
      setError("Please verify your email before logging in. Check your inbox.");
    } else {
      setError(err.message || "Login failed. Please check your credentials.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col">
      <div className="flex-1 flex justify-center items-center font-sans relative py-8">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-[#2d236b] font-medium z-10"
        >
          <FaHome className="text-[#5b5bd6]" size={20} />
          <span>Back to Home</span>
        </button>

        <div className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8">
          <h1 className="text-center text-[#2d236b] my-6 text-3xl font-bold max-sm:text-2xl">
            LOG IN
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex gap-5 mb-6">
            <button className="flex-1 py-3 rounded-[30px] border border-[#ddd] bg-white cursor-pointer hover:shadow-md transition-shadow">
              <FcGoogle size={25} className="mx-auto" />
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="flex flex-col mb-5">
              <label className="mb-1.5 text-sm">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-[30px] border border-[#ccc] outline-none focus:border-[#5b5bd6] transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col mb-5 relative">
              <label className="mb-1.5 text-sm">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-[30px] border border-[#ccc] outline-none focus:border-[#5b5bd6] transition-colors"
                required
                disabled={loading}
              />
              <span
                className="absolute right-[18px] top-[38px] cursor-pointer text-[#555]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <p 
              onClick={() => router.push("/forgot-password")}
              className="text-sm mb-5 cursor-pointer hover:text-[#3b82f6] transition-colors"
            >
              Forgot password?
            </p>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <p className="mb-2">Can't Access Your Account?</p>
            <p>
              DON'T HAVE AN ACCOUNT?{" "}
              <span 
                onClick={() => router.push("/register")}
                className="text-[#3b82f6] font-bold cursor-pointer hover:underline"
              >
                SIGN UP
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;