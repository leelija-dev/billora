"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // ONLY UI fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER FUNCTION
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // ✅ Sending required fields with dummy values
        body: JSON.stringify({
          name: "User",
          email: email,
          phone: "9999999999",
          password: password,
          city: "Kolkata",
          state: "WB",
          country: "India",
          pincode: "700000",
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data.success) {
        alert("Registration Successful");
        router.push("/login");
      } else {
        alert("Registration Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col font-sans">
      <div className="flex-1 flex justify-center items-center py-20 px-4">
        
        <div className="w-[550px] bg-white py-10 px-[50px] rounded-[25px] shadow-[0_8px_25px_rgba(0,0,0,0.08)] max-sm:w-[90%] max-sm:px-5">

          <h1 className="text-center text-[#2d236b] text-4xl font-bold mb-6">
            Register
          </h1>

          {/* Google */}
          <button className="w-full py-3.5 rounded-xl border border-[#ddd] mb-6">
            <div className="flex justify-center">
              <FcGoogle size={22} />
            </div>
          </button>

          {/* Email */}
          <div className="mb-5">
            <label className="text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border mt-1"
            />
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <label className="text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border mt-1"
            />
            <span
              className="absolute right-4 top-[38px] cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            className="w-full py-3.5 bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white font-bold rounded-xl"
          >
            Register
          </button>

          {/* Login */}
          <p className="text-center mt-5">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 cursor-pointer"
            >
              Log in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;