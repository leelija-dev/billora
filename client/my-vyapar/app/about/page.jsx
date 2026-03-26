// about/page.jsx
"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      <Navbar />
      
      {/* Hero Section - Responsive text */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-20 lg:py-24">
        <Container>
          <div className="text-center px-4 sm:px-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-5 lg:mb-6">
              Empowering Small Businesses <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Across India
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-base md:text-lg lg:text-xl text-gray-600 mb-8 md:mb-10 px-4 sm:px-0">
              We build powerful yet simple GST billing and accounting software
              that helps Indian SMEs grow faster, manage smarter, and work stress-free.
            </p>

            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 md:px-8 lg:px-10 py-3 md:py-4 rounded-full font-semibold text-sm sm:text-sm md:text-base shadow-lg hover:scale-105 transition duration-300"
            >
              Get Started Today
            </Link>
          </div>
        </Container>

        {/* Decorative Blur Circles */}
        <div className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-48 md:w-72 h-48 md:h-72 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
      </section>

      {/* Mission & Vision - Responsive */}
      <section className="py-16 md:py-20 lg:py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 px-4 sm:px-0">
            
            <div className="group p-6 sm:p-8 md:p-8 lg:p-10 rounded-3xl border bg-white shadow-sm hover:shadow-xl transition duration-300">
              <span className="text-4xl mb-4 md:mb-6 block group-hover:scale-110 transition">🎯</span>
              <h2 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold mb-3 md:mb-4">Our Mission</h2>
              <p className="text-gray-600 text-sm sm:text-sm md:text-base leading-relaxed">
                To simplify business accounting and GST billing for every
                small business owner in India through intuitive and affordable technology.
              </p>
            </div>

            <div className="group p-6 sm:p-8 md:p-8 lg:p-10 rounded-3xl border bg-white shadow-sm hover:shadow-xl transition duration-300">
              <span className="text-4xl mb-4 md:mb-6 block group-hover:scale-110 transition">✨</span>
              <h2 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold mb-3 md:mb-4">Our Vision</h2>
              <p className="text-gray-600 text-sm sm:text-sm md:text-base leading-relaxed">
                To become India's most trusted business management platform,
                empowering 10+ crore SMEs with smart automation tools.
              </p>
            </div>

          </div>
        </Container>
      </section>

      {/* Stats Section - Responsive */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-20 text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-10 text-center px-4 sm:px-0">
            
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">1Cr+</h3>
              <p className="mt-1 md:mt-2 text-blue-100 text-xs sm:text-sm md:text-sm lg:text-base">Businesses Served</p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">10+</h3>
              <p className="mt-1 md:mt-2 text-blue-100 text-xs sm:text-sm md:text-sm lg:text-base">Years Experience</p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">24/7</h3>
              <p className="mt-1 md:mt-2 text-blue-100 text-xs sm:text-sm md:text-sm lg:text-base">Customer Support</p>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">100%</h3>
              <p className="mt-1 md:mt-2 text-blue-100 text-xs sm:text-sm md:text-sm lg:text-base">Secure Platform</p>
            </div>

          </div>
        </Container>
      </section>

      {/* Why Choose Us - Responsive */}
      <section className="py-16 md:py-20 lg:py-24">
        <Container>
          <div className="text-center px-4 sm:px-0">
            
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-12 md:mb-14 lg:mb-16">
              Why Businesses Trust Us
            </h2>

            <div className="grid md:grid-cols-3 gap-6 md:gap-5 lg:gap-8">
              
              <div className="group p-6 sm:p-6 md:p-5 lg:p-8 rounded-3xl border hover:shadow-xl transition duration-300">
                <span className="text-4xl mb-4 md:mb-5 block group-hover:scale-110 transition">👥</span>
                <h3 className="text-lg sm:text-lg md:text-base lg:text-xl font-semibold mb-2 md:mb-3">Easy to Use</h3>
                <p className="text-gray-600 text-sm sm:text-sm md:text-xs lg:text-base">
                  Built for business owners — no accounting knowledge required.
                </p>
              </div>

              <div className="group p-6 sm:p-6 md:p-5 lg:p-8 rounded-3xl border hover:shadow-xl transition duration-300">
                <span className="text-4xl mb-4 md:mb-5 block group-hover:scale-110 transition">🛡️</span>
                <h3 className="text-lg sm:text-lg md:text-base lg:text-xl font-semibold mb-2 md:mb-3">Secure & Reliable</h3>
                <p className="text-gray-600 text-sm sm:text-sm md:text-xs lg:text-base">
                  Enterprise-grade security ensures your business data stays protected.
                </p>
              </div>

              <div className="group p-6 sm:p-6 md:p-5 lg:p-8 rounded-3xl border hover:shadow-xl transition duration-300">
                <span className="text-4xl mb-4 md:mb-5 block group-hover:scale-110 transition">✨</span>
                <h3 className="text-lg sm:text-lg md:text-base lg:text-xl font-semibold mb-2 md:mb-3">Modern Technology</h3>
                <p className="text-gray-600 text-sm sm:text-sm md:text-xs lg:text-base">
                  Continuously evolving with new features to support growing businesses.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA - Responsive */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50 text-center">
        <Container>
          <div className="px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-5 lg:mb-6">
              Start Managing Your Business Smarter
            </h2>

            <p className="text-gray-600 text-sm sm:text-base md:text-base lg:text-lg mb-8 md:mb-10 px-4">
              Join millions of entrepreneurs who trust our platform daily.
            </p>

            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 sm:px-10 md:px-10 lg:px-12 py-3 md:py-4 rounded-full font-semibold text-sm sm:text-sm md:text-base shadow-lg hover:scale-105 transition duration-300"
            >
              Download Now
            </Link>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}