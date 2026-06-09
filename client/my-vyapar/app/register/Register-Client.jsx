"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaPhone, FaCity, FaMapMarkerAlt, FaGlobe, FaMailBulk, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStoreZustand";
import Link from "next/link";

const RegisterClient = () => {
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
      setPasswordError("Password is required");
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
    
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      setError("Please fix the validation errors");
      return;
    }
    
    setLoading(true);
    
    try {
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
      
      console.log('Registration result:', result);
      
      if (result.success) {
        setSuccess(result.message || "Registration successful! Please check your email to verify your account.");
        
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setCity("");
        setState("");
        setCountry("");
        setPincode("");
        
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setPhoneError("");
        setCityError("");
        setStateError("");
        setCountryError("");
        setPincodeError("");
        
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorMessage = result.error || "Registration failed. Please try again.";
        setError(errorMessage);
        
        if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("taken")) {
          setEmailError("This email is already registered. Please use a different email or login.");
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = "";
      if (error.message.includes("email") || error.message.includes("duplicate")) {
        errorMessage = "This email is already registered. Please use a different email or login.";
        setEmailError("This email is already registered. Please use a different email or login.");
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Cannot connect to server. Please make sure the backend is running.";
      } else {
        errorMessage = error.message || "Registration failed. Please try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-[700px]">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-tertiary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <FaShieldAlt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 text-sm">
              Join us and start your journey
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => validateName(name)}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    nameError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {nameError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{nameError}</p>
              )}
              <p className="text-slate-400 text-xs mt-1 ml-1">Only letters and spaces allowed</p>
            </div>

            {/* Email Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    emailError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    passwordError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>
              )}
              <p className="text-slate-400 text-xs mt-1 ml-1">
                8+ chars, uppercase, lowercase, number & special character
              </p>
            </div>

            {/* Phone Field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaPhone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (e.target.value !== "") validatePhone(e.target.value);
                    else setPhoneError("");
                  }}
                  onBlur={() => validatePhone(phone)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    phoneError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>
              )}
            </div>

            {/* Location Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City *
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                    <FaCity className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (e.target.value !== "") validateCity(e.target.value);
                      else setCityError("");
                    }}
                    onBlur={() => validateCity(city)}
                    placeholder="City"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                      cityError 
                        ? "border-red-500 bg-red-50 focus:border-red-500" 
                        : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                    }`}
                    disabled={loading}
                  />
                </div>
                {cityError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{cityError}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State *
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                    <FaMapMarkerAlt className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      if (e.target.value !== "") validateState(e.target.value);
                      else setStateError("");
                    }}
                    onBlur={() => validateState(state)}
                    placeholder="State"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                      stateError 
                        ? "border-red-500 bg-red-50 focus:border-red-500" 
                        : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                    }`}
                    disabled={loading}
                  />
                </div>
                {stateError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{stateError}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Country *
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                    <FaGlobe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      if (e.target.value !== "") validateCountry(e.target.value);
                      else setCountryError("");
                    }}
                    onBlur={() => validateCountry(country)}
                    placeholder="Country"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                      countryError 
                        ? "border-red-500 bg-red-50 focus:border-red-500" 
                        : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                    }`}
                    disabled={loading}
                  />
                </div>
                {countryError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{countryError}</p>
                )}
              </div>
            </div>

            {/* Pincode Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pincode *
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-gradient-primary transition-colors">
                  <FaMailBulk className="w-4 h-4" />
                </div>
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
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-xl outline-none transition-all duration-200 ${
                    pincodeError 
                      ? "border-red-500 bg-red-50 focus:border-red-500" 
                      : "border-border-gray-300 focus:border-gradient-primary focus:ring-2 focus:ring-gradient-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {pincodeError && (
                <p className="text-red-500 text-xs mt-1 ml-1">{pincodeError}</p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-tertiary hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-gradient-primary/20 flex items-center justify-center gap-2 rounded-xl text-white font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FaArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-gradient-primary font-semibold hover:text-gradient-secondary transition-colors ml-1"
                >
                  Sign in here
                </button>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-slate-500 mt-6 text-center">
              By continuing, you agree to our{" "}
              <span className="text-gradient-primary cursor-pointer hover:underline">
                Terms of Service
              </span>{" "}
              and confirm that you have read our{" "}
              <span className="text-gradient-primary cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </form>
        </div>

        {/* Security Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <FaShieldAlt className="w-3 h-3" />
            Your information is protected with industry-standard encryption
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RegisterClient;