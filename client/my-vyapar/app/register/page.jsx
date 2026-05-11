"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStoreZustand";

const RegisterPage = () => {
  const { register } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Validation error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  const router = useRouter();

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    if (value.trim().length > 50) {
      setNameError("Name must be less than 50 characters");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
      setNameError("Name can only contain letters and spaces");
      return false;
    }
    setNameError("");
    return true;
  };

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
      // setPasswordError("Password is required");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (value.length > 50) {
      setPasswordError("Password must be less than 50 characters");
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(value)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*)");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validatePhone = (value) => {
    if (!value.trim()) {
      setPhoneError("Phone number is required");
      return false;
    }
    const phoneRegex = /^\d{10}$/;
    const cleanPhone = value.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateCity = (value) => {
    if (!value.trim()) {
      setCityError("City is required");
      return false;
    }
    setCityError("");
    return true;
  };

  const validateState = (value) => {
    if (!value.trim()) {
      setStateError("State is required");
      return false;
    }
    setStateError("");
    return true;
  };

  const validateCountry = (value) => {
    if (!value.trim()) {
      setCountryError("Country is required");
      return false;
    }
    setCountryError("");
    return true;
  };

  const validatePincode = (value) => {
    if (!value.trim()) {
      setPincodeError("Pincode is required");
      return false;
    }
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(value.trim())) {
      setPincodeError("Please enter a valid 6-digit pincode");
      return false;
    }
    setPincodeError("");
    return true;
  };

  const validateForm = () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPhoneValid = validatePhone(phone);
    const isCityValid = validateCity(city);
    const isStateValid = validateState(state);
    const isCountryValid = validateCountry(country);
    const isPincodeValid = validatePincode(pincode);
    
    return isNameValid && isEmailValid && isPasswordValid && isPhoneValid && isCityValid && isStateValid && isCountryValid && isPincodeValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    setSuccess("");
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Use authStore's register method directly
      const result = await register({ 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password: password,
        phone: phone.replace(/\D/g, ''),
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        pincode: pincode.trim()
      });
      
      if (result.success) {
        setSuccess("Registration successful! Please check your email to verify your account.");
        
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setCity("");
        setState("");
        setCountry("");
        setPincode("");
        
        // Clear validation errors
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setPhoneError("");
        setCityError("");
        setStateError("");
        setCountryError("");
        setPincodeError("");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        // Handle registration error
        const errorMessage = result.error || "Registration failed. Please try again.";
        setError(errorMessage);
        
        // Set specific field errors based on error message
        if (errorMessage.includes("email")) {
          setEmailError("This email is already registered. Please use a different email or login.");
        } else if (errorMessage.includes("server") || errorMessage.includes("connect")) {
          setError("Cannot connect to server. Please make sure backend is running.");
        } else {
          setError(errorMessage);
        }
      }
      
    } catch (error) {
      if (error.message.includes("email") || error.message.includes("duplicate")) {
        setEmailError("This email is already registered. Please use a different email or login.");
        setError("This email is already registered.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Real-time validation handlers
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value !== "") validateName(value);
    else setNameError("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ece9f1] to-[#dfe3f8] flex flex-col font-sans">
      
      <div className="flex-1 flex justify-center items-center py-20 px-4 relative">
        
        <form onSubmit={handleRegister} className=" bg-white py-10 px-[50px] rounded-[25px] shadow-[0_8px_25px_rgba(0,0,0,0.08)]  max-md:px-8  max-sm:px-5 max-sm:py-8">
          
          <h1 className="text-center text-[#2d236b] text-4xl font-bold mb-6 max-sm:text-3xl">
            Register
          </h1>

          {/* Server Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {success}
            </div>
          )}

          {/* Google Button */}
          {/* <button 
            type="button"
            className="w-full py-3.5 rounded-xl border border-[#ddd] bg-white cursor-pointer mb-6 hover:shadow-md transition-shadow"
            disabled={loading}
          >
            <div className="mx-auto flex justify-center">
              <FcGoogle size={22} />
            </div>
          </button> */}

          {/* OR Divider */}
          {/* <div className="flex items-center mb-6">
            <span className="flex-1 h-px bg-[#ccc]"></span>
            <p className="mx-4 text-[#555] text-sm">or</p>
            <span className="flex-1 h-px bg-[#ccc]"></span>
          </div> */}

          {/* Name Field */}
          <div className="flex flex-col mb-5">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Full Name *</label>
            <input 
              type="text" 
              value={name}
              onChange={handleNameChange}
              onBlur={() => validateName(name)}
              className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                nameError ? "border-red-500 bg-red-50" : "border-[#ddd]"
              }`}
              placeholder="Enter your full name"
              required
              disabled={loading}
            />
            {nameError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{nameError}</p>
            )}
            <p className="text-gray-400 text-xs mt-1 ml-2">Only letters and spaces allowed</p>
          </div>

          {/* Email Field */}
          <div className="flex flex-col mb-5">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Email address *</label>
            <input 
              type="email" 
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateEmail(email)}
              className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                emailError ? "border-red-500 bg-red-50" : "border-[#ddd]"
              }`}
              placeholder="Example: name@company.com"
              required
              disabled={loading}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{emailError}</p>
            )}
            {/* <p className="text-gray-400 text-xs mt-1 ml-2">Example: name@company.com</p> */}
          </div>

          {/* Password Field */}
          <div className="flex flex-col mb-5 relative">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Password *</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors pr-12 ${
                passwordError ? "border-red-500 bg-red-50" : "border-[#ddd]"
              }`}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
            <span
              className="absolute right-4 top-[38px] cursor-pointer text-[#666]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{passwordError}</p>
            )}
            <p className="text-gray-400 text-xs mt-1 ml-2">
              Password requirements: 8+ chars, uppercase, lowercase, number, special char (!@#$%^&*)
            </p>
          </div>

          {/* Phone Field */}
          <div className="flex flex-col mb-5">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Phone Number *</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (e.target.value !== "") validatePhone(e.target.value);
                else setPhoneError("");
              }}
              onBlur={() => validatePhone(phone)}
              className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                phoneError ? "border-red-500 bg-red-50" : "border-[#ddd]"
              }`}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              required
              disabled={loading}
            />
            {phoneError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{phoneError}</p>
            )}
            <p className="text-gray-400 text-xs mt-1 ml-2">Enter 10-digit mobile number (e.g., 9876543210)</p>
          </div>

          {/* City, State, Country Fields */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="flex flex-col">
              <label className="mb-1.5 text-sm text-gray-700 font-medium">City *</label>
              <input 
                type="text" 
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (e.target.value !== "") validateCity(e.target.value);
                  else setCityError("");
                }}
                onBlur={() => validateCity(city)}
                className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                  cityError ? "border-red-500 bg-red-50" : "border-[#ddd]"
                }`}
                placeholder="City"
                required
                disabled={loading}
              />
              {cityError && (
                <p className="text-red-500 text-xs mt-1">{cityError}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1.5 text-sm text-gray-700 font-medium">State *</label>
              <input 
                type="text" 
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  if (e.target.value !== "") validateState(e.target.value);
                  else setStateError("");
                }}
                onBlur={() => validateState(state)}
                className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                  stateError ? "border-red-500 bg-red-50" : "border-[#ddd]"
                }`}
                placeholder="State"
                required
                disabled={loading}
              />
              {stateError && (
                <p className="text-red-500 text-xs mt-1">{stateError}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1.5 text-sm text-gray-700 font-medium">Country *</label>
              <input 
                type="text" 
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (e.target.value !== "") validateCountry(e.target.value);
                  else setCountryError("");
                }}
                onBlur={() => validateCountry(country)}
                className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                  countryError ? "border-red-500 bg-red-50" : "border-[#ddd]"
                }`}
                placeholder="Country"
                required
                disabled={loading}
              />
              {countryError && (
                <p className="text-red-500 text-xs mt-1">{countryError}</p>
              )}
            </div>
          </div>

          {/* Pincode Field */}
          <div className="flex flex-col mb-5">
            <label className="mb-1.5 text-sm text-gray-700 font-medium">Pincode *</label>
            <input 
              type="text" 
              value={pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPincode(value);
                if (value !== "") validatePincode(value);
                else setPincodeError("");
              }}
              onBlur={() => validatePincode(pincode)}
              className={`p-3 rounded-xl border-2 outline-none text-sm focus:border-[#5b5bd6] transition-colors ${
                pincodeError ? "border-red-500 bg-red-50" : "border-[#ddd]"
              }`}
              placeholder="Enter 6-digit pincode"
              maxLength="6"
              required
              disabled={loading}
            />
            {pincodeError && (
              <p className="text-red-500 text-xs mt-1 ml-2">{pincodeError}</p>
            )}
            <p className="text-gray-400 text-xs mt-1 ml-2">Enter 6-digit pincode (e.g., 110001)</p>
          </div>

          {/* Register Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl border-none bg-gradient-to-r from-[#5b5bd6] to-[#3b82f6] text-white text-base font-bold cursor-pointer mt-2.5 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Already Account */}
          <p className="text-center mt-5 text-sm">
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
        </form>
      </div>
      
    </div>
  );
};

export default RegisterPage;