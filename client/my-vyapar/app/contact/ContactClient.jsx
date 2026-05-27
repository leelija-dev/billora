"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useContactStore } from "../../store/contactStore";
import { useAuthStore } from "../../store/authStoreZustand";
import toast from "react-hot-toast";
import { logger } from "../../utils/logger";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaSpinner,
  FaClock,
  FaShieldAlt,
  FaRegSmile,
  FaBuilding,
  FaWhatsapp,
  FaRegBuilding,
  FaGlobe,
  FaRegEnvelope,
  FaPhoneAlt,
  FaFileInvoice,
  FaRocket,
} from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiSend } from "react-icons/bi";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdVerified,
  MdBusinessCenter,
} from "react-icons/md";
import { RiCustomerService2Fill, RiGovernmentLine } from "react-icons/ri";

export default function Contact() {
  const {
    formData,
    loading,
    error,
    success,
    updateFormField,
    submitContactForm: submitForm,
    clearError,
    clearSuccess,
  } = useContactStore();

  // Get user auth state
  const { user, isLoggedIn } = useAuthStore();

  // Calculate hasActivePlan directly from user data
  const hasActivePlan = user?.is_active === 1 || false;

  const [validationErrors, setValidationErrors] = useState({});
  const [showFullMap, setShowFullMap] = useState(false);

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Full name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (formData.name.length > 50) {
      errors.name = "Name must be less than 50 characters";
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.name)) {
      errors.name =
        "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone || formData.phone.trim() === "") {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(formData.phone)) {
      errors.phone = "Phone number must start with 6, 7, 8, or 9";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!formData.email || formData.email.trim() === "") {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email =
        "Please enter a valid email address (e.g., name@example.com)";
    } else if (formData.email.length > 100) {
      errors.email = "Email must be less than 100 characters";
    }

    // Subject validation
    if (!formData.subject || formData.subject.trim() === "") {
      errors.subject = "Subject is required";
    } else if (formData.subject.length < 3) {
      errors.subject = "Subject must be at least 3 characters";
    } else if (formData.subject.length > 100) {
      errors.subject = "Subject must be less than 100 characters";
    }

    // Message validation
    if (!formData.message || formData.message.trim() === "") {
      errors.message = "Message is required";
    } else if (formData.message.length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      errors.message = "Message must be less than 1000 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Real-time validation clearing for the specific field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // For phone field, only allow digits and limit to 10 characters
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      updateFormField(name, numericValue);
    } else {
      updateFormField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous validation errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await submitForm();
      toast.success("Message sent successfully!");
      // Clear validation errors on success
      setValidationErrors({});
    } catch (error) {
      toast.error(
        error.message || "Failed to submit message. Please try again.",
      );
    }
  };

  // Clear messages when component mounts
  useEffect(() => {
    clearError();
    clearSuccess();
    setValidationErrors({});
  }, [clearError, clearSuccess]);

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Banner - Modern Design */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 sm:py-14 md:py-16 lg:py-16 xl:py-20 2xl:py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-48 sm:w-56 md:w-64 lg:w-64 xl:w-72 2xl:w-96 h-48 sm:h-56 md:h-64 lg:h-64 xl:h-72 2xl:h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 sm:w-80 md:w-96 lg:w-96 xl:w-[450px] 2xl:w-[600px] h-72 sm:h-80 md:h-96 lg:h-96 xl:h-[450px] 2xl:h-[600px] bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 sm:w-40 md:w-48 lg:w-48 xl:w-56 2xl:w-72 h-36 sm:h-40 md:h-48 lg:h-48 xl:h-56 2xl:h-72 bg-white opacity-5 rounded-full animate-ping"></div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 2xl:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16">
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in">
                Let’s<span className="text-yellow-300"> Talk</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-2xl text-blue-100 max-w-2xl">
               We’d love to hear your thoughts. Connect with us anytime, anywhere!
              </p>

              {/* Breadcrumb */}
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm text-blue-200">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>›</span>
                <span className="text-white">Contact Us</span>
              </div>
            </div>

            {/* Conditional Free Trial Button - Only show if user doesn't have active plan */}
            {!isLoggedIn || !hasActivePlan ? (
              <Link href="/start-free-trial">
                <button className="group relative bg-white text-blue-600 hover:text-blue-700 px-6 sm:px-7 md:px-8 lg:px-8 xl:px-9 2xl:px-10 py-3 sm:py-3.5 md:py-4 lg:py-4 xl:py-4.5 2xl:py-5 rounded-xl sm:rounded-2xl font-semibold transition-all hover:scale-105 shadow-xl hover:shadow-2xl text-sm sm:text-base md:text-base lg:text-base xl:text-lg 2xl:text-xl">
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    <FaRocket /> Start Free Trial
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-6 xl:px-8 2xl:px-12 py-10 sm:py-12 md:py-14 lg:py-16 xl:py-20 2xl:py-24">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24">
          {/* LEFT SIDE - CONTACT FORM */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-20 sm:w-24 md:w-24 lg:w-24 xl:w-28 2xl:w-32 h-20 sm:h-24 md:h-24 lg:h-24 xl:h-28 2xl:h-32 bg-blue-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-24 sm:w-28 md:w-28 lg:w-28 xl:w-32 2xl:w-40 h-24 sm:h-28 md:h-28 lg:h-28 xl:h-32 2xl:h-40 bg-purple-100 rounded-full opacity-50 blur-2xl"></div>

            <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-7 lg:p-8 xl:p-8 2xl:p-10 border border-gray-100">
              <div className="mb-6 sm:mb-7 md:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Drop us a Line
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-2">
                 Fill up your details & get a response from us within 24 hours.
                </p>
                <div className="flex gap-2 mt-3 sm:mt-4">
                  <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  <div className="w-3 sm:w-4 h-1 bg-gray-200 rounded-full"></div>
                </div>
              </div>

              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Name Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    <span className="group-focus-within:text-blue-600 transition-colors">
                      Full Name *
                    </span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full border ${validationErrors.name ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all focus:bg-white text-sm sm:text-base`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border ${validationErrors.phone ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all focus:bg-white text-sm sm:text-base`}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.phone}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1 ml-1">
                    Enter 10-digit mobile number
                  </p>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full border ${validationErrors.email ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all focus:bg-white text-sm sm:text-base`}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    Subject *
                  </label>
                  <div className="relative">
                    <FaPaperPlane className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full border ${validationErrors.subject ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all focus:bg-white text-sm sm:text-base`}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  {validationErrors.subject && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.subject}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 ml-1">
                    Your Message *
                  </label>
                  <div className="relative">
                    <FaRegSmile className="absolute left-3 sm:left-4 top-4 sm:top-5 text-gray-400 text-sm sm:text-base" />
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full border ${validationErrors.message ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"} pl-8 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all focus:bg-white resize-none text-sm sm:text-base`}
                      placeholder="Tell us more about your query..."
                      required
                    ></textarea>
                  </div>
                  {validationErrors.message && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1 ml-1 flex items-center gap-1">
                      <span>⚠️</span> {validationErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#2d236b] to-[#5b5bd6] text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin h-5 w-5" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <BiSend className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                {/* Trust Badge */}
                <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                  <FaCheckCircle className="text-green-500 text-xs sm:text-sm" />
                  <span>Your information is secure with us</span>
                </p>
              </form>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT INFO */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                Get In <span className="text-blue-600">Touch</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                Have questions? We'd love to hear from you. Here's how you can
                reach us.
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-4 sm:gap-5 md:gap-6">
              {/* Phone Card */}
              <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <MdPhone className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-blue-600 font-semibold mb-1">
                      Call Us Anytime
                    </p>
                    <a
                      href="tel:+917003150015"
                      className="text-lg sm:text-xl  font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors"
                    >
                      +91 7003150015
                    </a>{" "}
                    <br />
                    <a
                      href="tel:+913325849017"
                      className="text-lg sm:text-xl  font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors"
                    >
                      +91 332 584 9017
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                      9 AM To 7 PM (Everyday)
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
                <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <MdEmail className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-purple-600 font-semibold mb-1">
                      Email Us
                    </p>
                    <a
                      href="mailto:info@leelija.com"
                      className="text-lg sm:text-xl  font-bold text-gray-900 mb-1 hover:text-purple-600 transition-colors"
                    >
                      info@leelija.com
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex gap-3 sm:gap-4 md:gap-5">
                  <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                    <MdLocationOn className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-indigo-600 font-semibold mb-1 sm:mb-2">
                      Visit Us
                    </p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      Leelija Web Solution Pvt Ltd
                    </p>
                    <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                      Taki Road, Bamunmura, Barasat,
                      <br />
                      Kolkata - 700125, West Bengal, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <div className="relative">
                {!showFullMap ? (
                  <>
                    <div className="h-64 sm:h-72 md:h-80 bg-gray-200 relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18267.049967134488!2d88.50490553383787!3d22.719129095451922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8a94193290919%3A0xa386ccb40a9d040a!2sLeelija!5e1!3m2!1sen!2sin!4v1777100081884!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 w-full h-full"
                        title="Leelija Office Location"
                      ></iframe>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <button
                      onClick={() => setShowFullMap(true)}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 z-10"
                    >
                      <HiOutlineLocationMarker className="text-lg" />
                      View Full Map
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-[500px] sm:h-[550px] md:h-[600px] bg-gray-200 relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18267.049967134488!2d88.50490553383787!3d22.719129095451922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8a94193290919%3A0xa386ccb40a9d040a!2sLeelija!5e1!3m2!1sen!2sin!4v1777100081884!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 w-full h-full"
                        title="Leelija Office Location - Full View"
                      ></iframe>
                    </div>
                    <button
                      onClick={() => setShowFullMap(false)}
                      className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all z-10"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>

              {/* Map Footer Info */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-blue-600" />
                    <span className="text-gray-700 font-medium">
                      Leelija Web Solution Pvt Ltd
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Leelija/@22.7191291,88.5049055,15z/data=!4m6!3m5!1s0x39f8a94193290919:0xa386ccb40a9d040a!8m2!3d22.7191291!4d88.5049055!16s%2Fg%2F11w_pbrmgh?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    Get Directions
                    <FaArrowRight className="text-xs" />
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="w-0.5 sm:w-1 h-4 sm:h-5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FaFacebookF className="text-base sm:text-lg" />
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FaInstagram className="text-base sm:text-lg" />
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-blue-700 to-blue-800 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FaLinkedinIn className="text-base sm:text-lg" />
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FaTwitter className="text-base sm:text-lg" />
                  </div>
                </Link>
                <Link href="#" className="group relative">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center rounded-xl hover:rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <FaYoutube className="text-base sm:text-lg" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <FaStar className="text-yellow-500 text-xl sm:text-2xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                    Trusted by 1 Crore+ Indian Businesses
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Join millions of happy customers
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500 text-xs" />
                  <span>4.8/5 Rating</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-blue-500 text-xs" />
                  <span>24/7 Support</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaShieldAlt className="text-purple-500 text-xs" />
                  <span>100% Secure</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
