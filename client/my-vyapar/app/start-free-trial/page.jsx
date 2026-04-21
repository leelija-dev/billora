// start-free-trial/page.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTimes, FaShieldAlt, FaClock, FaBolt, FaEnvelope, FaCalendarAlt, FaStar } from "react-icons/fa";

export default function StartFreeTrial() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);

    setTimeout(() => {
      // Use environment variable for dashboard URL
      const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL;
      if (DASHBOARD_URL) {
        window.open(DASHBOARD_URL, '_blank');
      } else {
        console.error('NEXT_PUBLIC_DASHBOARD_URL not configured');
      }
    }, 1500);
  };

  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  const handleSocialLogin = (provider) => {
    console.log("Login with:", provider);

    if (provider === "google") {
      window.location.href = "/api/auth/google";
    }

    if (provider === "microsoft") {
      window.location.href = "/api/auth/microsoft";
    }

    if (provider === "apple") {
      window.location.href = "/api/auth/apple";
    }

    if (provider === "email") {
      document.getElementById("emailInput")?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Background blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 blur-xl scale-110 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-start lg:items-center justify-center px-4 py-6 overflow-y-auto bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white shadow hover:bg-gray-100"
            >
              <FaTimes className="text-xl text-gray-600" />
            </button>

            <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white">
                
                {/* LEFT SIDE */}
                <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-indigo-100 to-sky-100">

                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                      B
                    </div>

                    <span className="text-2xl font-bold text-gray-800">
                      Billora
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Start your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                      14-day free trial
                    </span>
                  </h1>

                  <p className="text-gray-600 text-base sm:text-lg mb-6">
                    The complete GST billing software for Indian businesses
                  </p>

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {[
                      "GST compliant invoicing",
                      "Real-time inventory tracking",
                      "Automatic tax calculations",
                      "Business reports & analytics",
                      "Mobile app included"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="text-indigo-600 font-bold">✓</span>
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-xs shadow">
                      <FaShieldAlt className="text-indigo-600 w-3 h-3" />
                      No credit card
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-xs shadow">
                      <FaClock className="text-indigo-600 w-3 h-3" />
                      14 days free
                    </div>

                    <div className="flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-xs shadow">
                      <FaBolt className="text-indigo-600 w-3 h-3" />
                      Instant setup
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10">
                  
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Get started today
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Join 1 Cr+ businesses trusting Billora
                    </p>
                  </div>

                  {/* Social buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">

                    {[
                      {
                        icon:
                          "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
                        name: "google"
                      },
                      {
                        icon:
                          "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
                        name: "microsoft"
                      },
                      {
                        icon:
                          "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                        name: "apple"
                      },
                      {
                        icon: <FaEnvelope className="text-xl" />,
                        name: "email",
                        emoji: true
                      }
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSocialLogin(item.name)}
                        className="border rounded-xl py-3 bg-white hover:bg-gray-50 flex items-center justify-center shadow-sm transition"
                      >
                        {item.emoji ? (
                          <span className="text-xl">{item.icon}</span>
                        ) : (
                          <img src={item.icon} className="w-5 h-5" alt={item.name} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center my-5 text-gray-400 text-sm">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="mx-3">or use email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Email form */}
                  <form onSubmit={handleSubmit}>
                    <label className="text-sm text-gray-600">
                      Work email
                    </label>

                    <input
                      id="emailInput"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:border-indigo-500 outline-none"
                    />

                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <FaCalendarAlt className="text-indigo-600 w-3 h-3" />
                      Your 14-day trial starts immediately
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full mt-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg shadow-md"
                    >
                      Start my free trial
                    </motion.button>
                  </form>

                  {/* Terms */}
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="text-indigo-600">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-indigo-600">
                      Privacy Policy
                    </Link>
                  </p>

                  {/* Login */}
                  <p className="text-sm text-gray-600 mt-5 text-center border-t pt-5">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-indigo-600 font-semibold"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>

              {/* Bottom text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-sm text-gray-600"
              >
                <p className="flex items-center justify-center gap-2">
                  <FaStar className="text-indigo-500 w-4 h-4" />
                  Trusted by 1 Cr+ Indian businesses • GST Ready • Made in India
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}