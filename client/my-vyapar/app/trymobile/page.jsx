"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function BilloraHero() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Parallax effects
  const heroScale = useTransform(smoothY, [0, 500], [1, 0.95]);
  const contentOpacity = useTransform(smoothY, [0, 300], [1, 0.5]);
  const cardsY = useTransform(smoothY, [0, 600], [0, -100]);

  const features = [
    { title: "Smart Invoicing", icon: "📄", desc: "Create professional invoices in seconds", stat: "50K+ invoices/month", color: "from-emerald-400 to-teal-500" },
    { title: "Inventory Management", icon: "📦", desc: "Track stock in real-time", stat: "99.9% accuracy", color: "from-blue-400 to-indigo-500" },
    { title: "GST Compliance", icon: "📊", desc: "Auto-calculate taxes and file returns", stat: "100% compliant", color: "from-purple-400 to-pink-500" },
    { title: "Payment Collection", icon: "💳", desc: "Accept payments via UPI, cards, netbanking", stat: "₹100Cr+ processed", color: "from-orange-400 to-red-500" },
  ];

  const stats = [
    { value: "70,000+", label: "Businesses", icon: "🏢", detail: "Across 28 states" },
    { value: "₹15,000 Cr+", label: "Transactions", icon: "💰", detail: "Annual volume" },
    { value: "500+", label: "Team Members", icon: "👥", detail: "Dedicated support" },
    { value: "4.9", label: "Rating", icon: "⭐", detail: "From 5000+ reviews" },
  ];

  const testimonials = [
    { name: "Rajesh Kumar", business: "Tech Solutions India", quote: "Billora transformed our billing process. Saved 20+ hours every week!", rating: 5, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Sharma", business: "Digital Growth Partners", quote: "The best business management platform I've ever used. Highly recommended!", rating: 5, image: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Amit Patel", business: "Patel Enterprises", quote: "GST filing has never been easier. Billora is a game-changer!", rating: 5, image: "https://randomuser.me/api/portraits/men/45.jpg" },
  ];

  const pricingPlans = [
    { name: "Starter", price: "₹999", period: "/month", features: ["Up to 500 invoices", "Basic reports", "Email support"], popular: false },
    { name: "Business", price: "₹1,999", period: "/month", features: ["Unlimited invoices", "Advanced analytics", "Priority support", "API access"], popular: true },
    { name: "Enterprise", price: "Custom", period: "", features: ["Custom solutions", "Dedicated manager", "SLA guarantee", "On-premise option"], popular: false },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 overflow-x-hidden">
      
      {/* ===== ANIMATED BACKGROUND ===== */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        {/* Simple Pattern Overlay - FIXED: Removed problematic SVG */}
        <div className="absolute inset-0 bg-black opacity-5"></div>
      </div>

       {/* <div className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black tracking-tight"
        >
          <span className="text-gray-900">BILLORA</span> 
          <span className="text-emerald-600">.</span>
        </motion.div>
      </div> */}

      {/* ===== HERO SECTION ===== */}
      <motion.main 
        style={{ scale: heroScale, opacity: contentOpacity }}
        className="relative pt-28 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-700">Trusted by 70,000+ Businesses</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
                Simplify Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  Business Operations
                </span>
              </h1>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md">
                India's leading business management platform for small businesses. 
                Invoicing, inventory, GST, and payments - all in one place.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <button className="group px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                  Start Free Trial
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center text-white text-xs">
                      👤
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">50,000+</span> happy business owners
                </div>
              </div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-bold">Dashboard</div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-2xl font-bold text-gray-900">₹12,45,678</div>
                      <div className="text-xs text-gray-500">Total Revenue</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-2xl mb-1">📦</div>
                      <div className="text-2xl font-bold text-gray-900">1,234</div>
                      <div className="text-xs text-gray-500">Orders</div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Recent Invoices</span>
                      <span className="text-emerald-600 text-xs">View all →</span>
                    </div>
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-sm">INV-00{i}</div>
                          <div className="text-xs text-gray-500">Customer Name</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{i}2,500</div>
                          <div className="text-xs text-green-600">Paid</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border-l-4 border-emerald-500"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎯</div>
                  <div>
                    <div className="text-sm font-bold">GST Filing</div>
                    <div className="text-xs text-gray-500">Due in 5 days</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* ===== STATS SECTION ===== */}
      <motion.section 
        style={{ y: cardsY }}
        className="relative py-20 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm font-semibold text-emerald-600 mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-emerald-100 rounded-full px-4 py-1 text-sm font-semibold text-emerald-700 mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Run Your Business
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From invoicing to compliance, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{feature.desc}</p>
                  <div className="text-xs font-semibold text-emerald-600">{feature.stat}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="relative py-20 px-6 md:px-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 rounded-full px-4 py-1 text-sm font-semibold text-blue-700 mb-4">
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plans for Every Business
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${plan.popular ? 'ring-2 ring-emerald-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 text-xs font-bold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-emerald-600">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg' : 'border-2 border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-600'}`}>
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="relative py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-purple-100 rounded-full px-4 py-1 text-sm font-semibold text-purple-700 mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Business Owners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Billora
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-xs text-gray-500">{testimonial.business}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {"★".repeat(testimonial.rating)}
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION - FIXED: Removed SVG pattern ===== */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mx-6 md:mx-12 mb-20 rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="relative px-8 py-16 text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Grow Your Business?
          </h3>
          <p className="text-emerald-100 mb-6 max-w-md mx-auto">
            Join 70,000+ businesses already using Billora
          </p>
          <button className="group bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
            Start Free Trial
            <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-black tracking-tight mb-4">
                BILLORA<span className="text-emerald-400">.</span>
              </div>
              <p className="text-gray-400 text-sm">Simplifying business for Indian entrepreneurs since 2020</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">API Docs</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2024 Billora. All rights reserved. Made in India 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
}