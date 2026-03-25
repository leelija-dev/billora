"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
import { saveAuthData } from "@/store/authStore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    
    try {
      const res = await loginUser({ email, password });
      
      // Check if API returned error
      if (res.status === false || res.success === false) {
        // Handle specific error messages from Laravel
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
      
      // Check if user data exists
      if (!res.user && !res.data?.user && !res.id) {
        throw new Error("No account found with this email. Please register first.");
      }
      
      const userData = res.user || res.data?.user || res;
      const token = res.token || res.data?.token || null;
      
      // Save to localStorage
      saveAuthData(userData, token);
      
      // Show success message
      alert("Login Successful ✅");
      
      // Redirect to home
      router.push("/");
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Show user-friendly error message
      if (error.message.includes("No account") || error.message.includes("not found")) {
        setError("❌ No account found with this email. Please register first.");
      } else if (error.message.includes("password") || error.message.includes("Invalid credentials")) {
        setError("❌ Invalid password. Please try again.");
      } else if (error.message.includes("verify") || error.message.includes("verified")) {
        setError("📧 Please verify your email before logging in. Check your inbox.");
      } else {
        setError(error.message || "❌ Login failed. Please try again.");
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
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          <FaHome />
          <span>Back to Home</span>
        </button>

        <form onSubmit={handleLogin} className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow">
          <h1 className="text-center text-3xl font-bold mb-6">LOG IN</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col mb-5">
            <label className="mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="flex flex-col mb-5 relative">
            <label className="mb-2 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <span
              className="absolute right-4 top-[42px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="text-center mt-5">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              SIGN UP
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;