"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex justify-center items-center font-sans">
      <div className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_8px_25px_rgba(0,0,0,0.08)] max-md:w-[450px] max-md:px-8 max-sm:w-[90%] max-sm:px-5 max-sm:py-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-[35px] h-[35px] bg-[#5b5bd6] text-white flex justify-center items-center rounded-md font-bold">
            V
          </div>
          <h2 className="text-[#2d236b] text-xl font-bold">Vyapar</h2>
        </div>

        <h1 className="text-center text-[#2d236b] text-4xl font-bold mb-6 max-sm:text-3xl">
          Register
        </h1>

        {/* Google Button */}
        <button className="w-full py-3.5 rounded-xl border border-[#ddd] bg-white cursor-pointer mb-6 hover:shadow-md transition-shadow">
          <div className="mx-auto flex justify-center">
            <FcGoogle size={22} />
          </div>
        </button>

        {/* OR Divider */}
        <div className="flex items-center mb-6">
          <span className="flex-1 h-px bg-[#ccc]"></span>
          <p className="mx-4 text-[#555]">or</p>
          <span className="flex-1 h-px bg-[#ccc]"></span>
        </div>

        {/* Email */}
        <div className="flex flex-col mb-5">
          <label className="mb-1.5 text-sm">Email address</label>
          <input 
            type="email" 
            className="p-3 rounded-xl border-2 border-[#ddd] outline-none text-sm focus:border-[#5b5bd6] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col mb-5 relative">
          <label className="mb-1.5 text-sm">Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            className="p-3 rounded-xl border-2 border-[#ddd] outline-none text-sm focus:border-[#5b5bd6] transition-colors"
          />
          <span
            className="absolute right-4 top-[38px] cursor-pointer text-[#666]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Register Button */}
        <button 
          className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer mt-2.5 hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Register
        </button>

        {/* Already Account */}
        <p className="text-center mt-5">
          Already have an account?{" "}
          <span 
            onClick={() => router.push("/login")}
            className="text-[#3b82f6] font-bold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>

        {/* Terms */}
        <p className="text-xs text-[#666] mt-5 text-center">
          By continuing you agree with our <span className="underline cursor-pointer hover:text-[#3b82f6]">Terms of Service</span> and confirm
          that you have read our <span className="underline cursor-pointer hover:text-[#3b82f6]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Register;