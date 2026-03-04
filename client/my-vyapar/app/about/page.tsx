"use client";

import { Users, Target, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            About Our Company
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Empowering Small Businesses <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Across India
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-10">
            We build powerful yet simple GST billing and accounting software
            that helps Indian SMEs grow faster, manage smarter, and work stress-free.
          </p>

          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition duration-300"
          >
            Get Started Today
          </Link>
        </div>

        {/* Decorative Blur Circles */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">

          <div className="group p-10 rounded-3xl border bg-white shadow-sm hover:shadow-xl transition duration-300">
            <Target className="text-blue-600 mb-6 group-hover:scale-110 transition" size={48} />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To simplify business accounting and GST billing for every
              small business owner in India through intuitive and affordable technology.
            </p>
          </div>

          <div className="group p-10 rounded-3xl border bg-white shadow-sm hover:shadow-xl transition duration-300">
            <Sparkles className="text-purple-600 mb-6 group-hover:scale-110 transition" size={48} />
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become India’s most trusted business management platform,
              empowering 10+ crore SMEs with smart automation tools.
            </p>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <div>
            <h3 className="text-4xl font-bold">1Cr+</h3>
            <p className="mt-2 text-blue-100">Businesses Served</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">10+</h3>
            <p className="mt-2 text-blue-100">Years Experience</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">24/7</h3>
            <p className="mt-2 text-blue-100">Customer Support</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold">100%</h3>
            <p className="mt-2 text-blue-100">Secure Platform</p>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Why Businesses Trust Us
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="group p-8 rounded-3xl border hover:shadow-xl transition duration-300">
              <Users className="text-blue-600 mx-auto mb-6 group-hover:scale-110 transition" size={48} />
              <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Built for business owners — no accounting knowledge required.
              </p>
            </div>

            <div className="group p-8 rounded-3xl border hover:shadow-xl transition duration-300">
              <ShieldCheck className="text-purple-600 mx-auto mb-6 group-hover:scale-110 transition" size={48} />
              <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security ensures your business data stays protected.
              </p>
            </div>

            <div className="group p-8 rounded-3xl border hover:shadow-xl transition duration-300">
              <Sparkles className="text-blue-600 mx-auto mb-6 group-hover:scale-110 transition" size={48} />
              <h3 className="text-xl font-semibold mb-3">Modern Technology</h3>
              <p className="text-gray-600">
                Continuously evolving with new features to support growing businesses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Managing Your Business Smarter
        </h2>

        <p className="text-gray-600 mb-10">
          Join millions of entrepreneurs who trust our platform daily.
        </p>

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition duration-300"
        >
          Download Now
        </Link>
      </section>

    </div>
  );
}