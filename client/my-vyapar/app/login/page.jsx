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
      router.push("/");
      
    } catch (error) {
      if (error.message.includes("No account")) {
        setError("❌ No account found with this email. Please register first.");
      } else if (error.message.includes("password")) {
        setError("❌ Invalid password. Please try again.");
      } else if (error.message.includes("verify")) {
        setError("📧 Please verify your email before logging in. Check your inbox.");
      } else {
        setError(error.message || "❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="flex-1 flex justify-center items-center relative py-8">
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          <FaHome />
          <span>Back to Home</span>
        </button>

        <form onSubmit={handleLogin} className="w-[500px] bg-white py-10 px-12 rounded-2xl shadow-xl">
          <h1 className="text-center text-4xl font-bold mb-8 text-gray-800">LOG IN</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <span
              className="absolute right-4 bottom-4 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-semibold text-lg"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 cursor-pointer hover:underline font-medium"
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
// hjmg