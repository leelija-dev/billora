"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex justify-center items-center font-sans">
      <div className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_10px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-[35px] h-[35px] bg-[#5b5bd6] text-white flex justify-center items-center rounded-md font-bold">
            V
          </div>
          <h2 className="text-[#2d236b] text-xl font-bold">Vyapar</h2>
        </div>

        <h1 className="text-center text-[#2d236b] my-6 text-3xl font-bold max-sm:text-2xl">
          LOG IN
        </h1>

        {/* Social Buttons */}
        <div className="flex gap-5 mb-6">
          <button className="flex-1 py-3 rounded-[30px] border border-[#ddd] bg-white cursor-pointer hover:shadow-md transition-shadow">
            <FcGoogle size={25} className="mx-auto" />
          </button>
        </div>

        {/* Email */}
        <div className="flex flex-col mb-5">
          <label className="mb-1.5 text-sm">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="p-3 rounded-[30px] border border-[#ccc] outline-none focus:border-[#5b5bd6] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col mb-5 relative">
          <label className="mb-1.5 text-sm">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="p-3 rounded-[30px] border border-[#ccc] outline-none focus:border-[#5b5bd6] transition-colors"
          />
          <span
            className="absolute right-[18px] top-[38px] cursor-pointer text-[#555]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <p className="text-sm mb-5 cursor-pointer hover:text-[#3b82f6] transition-colors">
          Forgot password?
        </p>

        <button 
          className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
          onClick={() => router.push("/login")}
        >
          LOG IN
        </button>

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
  );
};

export default Login;