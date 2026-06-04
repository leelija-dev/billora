"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { useAuthStore } from "@/store/authStoreZustand";
import { businessService } from "@/services/businessService";
import { freeTrialService } from "@/services/freeTrialService";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaDatabase,
  FaChartLine,
  FaHeadset,
  FaCloudUploadAlt,
  FaFileInvoice,
  FaBoxes,
  FaStar,
  FaRocket,
  FaSignInAlt,
  FaExclamationTriangle,
  FaCrown,
  FaChevronDown,
  FaBriefcase,
  FaLock,
} from "react-icons/fa";

const StartFreeTrial = () => {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuthStore();
  
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    businessTypeId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch business types on component mount
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      setLoadingBusinessTypes(true);
      try {
        const token = localStorage.getItem('auth_token');
        const types = await businessService.getBusinessTypes(token);
        setBusinessTypes(types);
      } catch (error) {
        console.error('Error fetching business types:', error);
        toast.error('Failed to load business types');
      } finally {
        setLoadingBusinessTypes(false);
      }
    };

    fetchBusinessTypes();
  }, []);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      if (user?.plan_id) {
        // User has active plan
      } else if (user?.is_trial === 1) {
        // User has used trial
      }
    }
  }, [isLoading, isLoggedIn, user, router]);

  // Pre-fill form from logged-in user (read-only fields)
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData({
        customerName: user.name || user.full_name || "",
        customerEmail: user.email || "",
        customerPhone: user.phone || user.mobile || "",
        businessTypeId: user.business_type_id || "",
      });
    }
  }, [isLoggedIn, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow changes to businessTypeId
    if (name === "businessTypeId") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Email is invalid";
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    } else if (!freeTrialService.validatePhoneNumber(formData.customerPhone)) {
      newErrors.customerPhone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.businessTypeId) newErrors.businessTypeId = "Please select a business type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Use existing user ID as customer ID
      const customerId = user?.id;
      
      if (!customerId) {
        throw new Error('User ID not found');
      }

      // Format phone number (remove any non-digit characters)
      const formattedPhone = freeTrialService.formatPhoneNumber(formData.customerPhone);

      // Validate phone number format again
      if (!freeTrialService.validatePhoneNumber(formattedPhone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Submit free trial using the service
      const response = await freeTrialService.submitFreeTrial({
        customer_id: customerId,
        business_type_id: parseInt(formData.businessTypeId),
        customer_phone: formattedPhone,
      });

      if (response.success) {
        console.log('Free trial response:', response);
        toast.success(response.message || 'Free trial started successfully!');
        setIsSubmitted(true);
      } else {
        throw new Error(response.message);
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: error.message || "Something went wrong. Please try again." });
      toast.error(error.message || "Failed to start free trial");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Benefits list
  const benefits = [
    { icon: FaCloudUploadAlt, text: "Cloud-based access anywhere" },
    { icon: FaFileInvoice, text: "Unlimited GST invoices" },
    { icon: FaBoxes, text: "Real-time inventory tracking" },
    { icon: FaChartLine, text: "Advanced analytics & reports" },
    { icon: FaDatabase, text: "Secure data backup" },
    { icon: FaHeadset, text: "24/7 priority support" },
  ];

  // Features cards
  const featureCards = [
    {
      icon: FaRocket,
      title: "Quick Setup",
      description: "Get started in minutes with our easy onboarding process",
      color: "from-sky-500 to-indigo-600",
    },
    {
      icon: FaShieldAlt,
      title: "Secure & Compliant",
      description: "Fully GST compliant with bank-grade security",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: FaChartLine,
      title: "Real-time Insights",
      description: "Track sales, inventory, and profits instantly",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const getContentState = () => {
    if (isLoading) return "loading";
    if (!isLoggedIn) return "not_logged_in";
    if (user?.plan_id) return "has_plan";
    if (user?.is_trial === 1) return "trial_used";
    return "can_start_trial";
  };

  const contentState = getContentState();

  const getSelectedBusinessIcon = () => {
    const selected = businessTypes.find(type => type.id.toString() === formData.businessTypeId);
    if (selected && selected.icon) {
      return <FaBriefcase className="w-5 h-5" />;
    }
    return <FaBriefcase className="w-5 h-5" />;
  };

  // Loading state
  if (isLoading || contentState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 font-sans">
        <Container size="small">
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-emerald-500/30">
              <FaCheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Trial Started Successfully! 🎉
            </h1>
            <p className="text-base sm:text-lg text-slate-700 mb-6 max-w-lg mx-auto">
              Thank you for choosing {process.env.NEXT_PUBLIC_APP_NAME || "The Fast Bill"}. We've sent setup instructions to your email.
            </p>
            <p className="text-sm text-slate-600 mb-8">
              Our team will contact you shortly to help you get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Back to Home
              </Link>
              <Link
                href="/bookdemo"
                className="px-6 sm:px-8 py-3 bg-white border border-gray-300 rounded-full text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-24 overflow-hidden">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-sky-400 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[150px] opacity-10" />
        
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <Container size="default">
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-sky-200/50 mb-4 sm:mb-6">
              <FaStar className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                7 Days Free Trial
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-4 sm:mb-6 tracking-tight">
              {contentState === "has_plan" ? "You're Already Subscribed!" : 
               contentState === "trial_used" ? "Trial Already Used" : 
               "Start Your 7-Day Free Trial"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-700 max-w-2xl mx-auto">
              {contentState === "has_plan" 
                ? "You already have an active subscription plan. Manage your account from the dashboard."
                : contentState === "trial_used"
                ? "You've already used your free trial. Explore our affordable plans to continue using our services."
                : "Experience the power of complete inventory management and GST billing software. No credit card required. Cancel anytime."}
            </p>
          </div>
        </Container>
      </section>

      {/* Main Form Section */}
      <section className="relative z-20 pb-16 sm:pb-20 md:pb-28 px-4 -mt-[4rem]">
        <Container size="small">
          <div className="grid lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
            {/* Form Card */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                <div className={`px-6 sm:px-8 py-5 sm:py-6 ${
                  contentState === "has_plan" 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600" 
                    : contentState === "trial_used"
                    ? "bg-gradient-to-r from-red-500 to-rose-600"
                    : "bg-gradient-to-r from-sky-600 to-indigo-600"
                }`}>
                  <h2 className="text-xl sm:text-2xl text-white font-bold">
                    {contentState === "has_plan" 
                      ? "Active Subscription" 
                      : contentState === "trial_used"
                      ? "Trial Expired"
                      : isLoggedIn 
                      ? "Start Your Trial" 
                      : "Login to Continue"}
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    {contentState === "has_plan"
                      ? "Manage your existing plan and account settings"
                      : contentState === "trial_used"
                      ? "Choose a plan to continue using our services"
                      : isLoggedIn 
                      ? "Confirm your details and select business type to begin your 7-day trial"
                      : "Please login to your account to start the free trial"}
                  </p>
                </div>

                {/* Conditional Rendering */}
                {(() => {
                  if (contentState === "has_plan") {
                    return (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <FaCrown className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          You Already Have an Active Plan
                        </h3>
                        <p className="text-base text-slate-700 mb-6">
                          Your account is already subscribed to a plan. You can manage your subscription, view invoices, and access all features from your dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000"}/dashboard`}
                            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            Go to Dashboard
                          </Link>
                          <Link
                            href="/pricing"
                            className="px-6 py-3 bg-white border border-gray-300 rounded-full text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                          >
                            View Plans
                          </Link>
                        </div>
                      </div>
                    );
                  }
                  
                  if (contentState === "trial_used") {
                    return (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <FaExclamationTriangle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          Free Trial Already Used
                        </h3>
                        <p className="text-base text-slate-700 mb-6">
                          You've already used your 7-day free trial. Choose one of our affordable plans to continue enjoying all features and benefits.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/pricing"
                            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            View Pricing Plans
                          </Link>
                          <Link
                            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000"}/dashboard`}
                            className="px-6 py-3 bg-white border border-gray-300 rounded-full text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                          >
                            Go to Dashboard
                          </Link>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-xs text-slate-500">
                            Need help?{" "}
                            <Link href="/contact" className="text-sky-600 hover:underline">
                              Contact Support
                            </Link>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  if (!isLoggedIn) {
                    return (
                      <div className="p-6 sm:p-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <FaSignInAlt className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">
                          Login Required
                        </h3>
                        <p className="text-base text-slate-700 mb-6">
                          Please login to your existing account to start your 7-day free trial.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link
                            href="/login"
                            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                          >
                            Login to Your Account
                          </Link>
                          <Link
                            href="/register"
                            className="px-6 py-3 bg-white border border-gray-300 rounded-full text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                          >
                            Create New Account
                          </Link>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-xs text-slate-500">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-sky-600 hover:underline font-medium">
                              Register here
                            </Link>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Form for logged in users - Only business type is editable
                  return (
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                      {errors.submit && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                          {errors.submit}
                        </div>
                      )}

                      <div className="space-y-5">
                        {/* Customer Name - Read Only */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Customer Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              name="customerName"
                              value={formData.customerName}
                              readOnly
                              disabled
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-600 cursor-not-allowed"
                            />
                            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">This information is from your account</p>
                        </div>

                        {/* Customer Email - Read Only */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="email"
                              name="customerEmail"
                              value={formData.customerEmail}
                              readOnly
                              disabled
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-600 cursor-not-allowed"
                            />
                            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">This information is from your account</p>
                        </div>

                        {/* Customer Phone - Read Only */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="tel"
                              name="customerPhone"
                              value={formData.customerPhone}
                              readOnly
                              disabled
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-slate-600 cursor-not-allowed"
                            />
                            <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          </div>
                          <p className="mt-1 text-xs text-slate-500">This information is from your account</p>
                        </div>

                        {/* Business Type Dropdown - Editable */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Business Type <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              {getSelectedBusinessIcon()}
                            </div>
                            <select
                              name="businessTypeId"
                              value={formData.businessTypeId}
                              onChange={handleChange}
                              disabled={loadingBusinessTypes}
                              className={`w-full pl-10 pr-10 py-3 border ${
                                errors.businessTypeId 
                                  ? 'border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-sky-500'
                              } rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none bg-white cursor-pointer ${
                                loadingBusinessTypes ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <option value="">
                                {loadingBusinessTypes ? "Loading business types..." : "Select Business Type"}
                              </option>
                              {businessTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              <FaChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                          {errors.businessTypeId && (
                            <p className="mt-1 text-red-500 text-xs">{errors.businessTypeId}</p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">Select your business type to customize your experience</p>
                        </div>

                        {/* Info Alert */}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700">
                            <strong>Note:</strong> Your name, email, and phone number are pre-filled from your account and cannot be edited. 
                            If any information is incorrect, please update your profile settings.
                          </p>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting || loadingBusinessTypes || !formData.businessTypeId}
                          className="w-full mt-6 py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-xl text-white font-bold text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Start 7-Day Free Trial
                              <FaArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-slate-500 mt-4">
                          By signing up, you agree to our{" "}
                          <Link href="/terms" className="text-sky-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-sky-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </p>
                      </div>
                    </form>
                  );
                })()}
              </div>
            </div>

            {/* Benefits Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 sticky top-24 border border-gray-200 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
                  What's Included?
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Get full access to all features during your 7-day trial:
                </p>
                
                <div className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <benefit.icon className="w-5 h-5 text-sky-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6 mt-2">
                  <div className="flex items-center gap-3 mb-4">
                    <FaShieldAlt className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-800">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaHeadset className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-slate-800">24/7 customer support</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
                  <FaCheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Trusted by 10,000+ businesses</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      {(contentState === "can_start_trial" || !isLoggedIn) && (
        <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
          <Container size="default">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  {process.env.NEXT_PUBLIC_APP_NAME || "The Fast Bill"}
                </span>
                ?
              </h2>
              <p className="text-base text-slate-700 max-w-2xl mx-auto">
                Everything you need to manage your business efficiently
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featureCards.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-sky-50 to-indigo-50">
        <Container size="default">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              {contentState === "has_plan" 
                ? "Manage Your Subscription" 
                : contentState === "trial_used"
                ? "Choose a Plan That Fits Your Business"
                : "Ready to Transform Your Business?"}
            </h2>
            <p className="text-base text-slate-700 mb-8">
              {contentState === "has_plan" 
                ? "Access your dashboard to manage billing, view invoices, and explore all features."
                : contentState === "trial_used"
                ? "Select from our flexible pricing plans designed for businesses of all sizes."
                : "Join thousands of satisfied customers who have streamlined their billing and inventory management."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {contentState === "has_plan" ? (
                <Link
                  href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000/"}dashboard`}
                  className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Go to Dashboard
                </Link>
              ) : contentState === "trial_used" ? (
                <Link
                  href="/pricing"
                  className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  View Pricing Plans
                </Link>
              ) : contentState === "can_start_trial" ? (
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-8 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Login to Start Trial
                </Link>
              )}
              <Link
                href="/bookdemo"
                className="px-8 py-3 bg-white border border-gray-300 rounded-full text-slate-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Book a Demo →
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default StartFreeTrial;