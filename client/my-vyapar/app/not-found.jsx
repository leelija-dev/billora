'use client';

import Link from 'next/link';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl w-full">
        {/* Error Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10 md:p-12">
            {/* 404 Number */}
            <div className="text-center mb-8">
              <div className="inline-block">
                <span className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight leading-none">
                  404
                </span>
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center max-w-lg mx-auto">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl mb-6">
                <FiSearch className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600" />
              </div>

              <h1 className="text-h2-xs sm:text-h2-sm md:text-h2-md font-bold text-text-slate-800 mb-3">
                Page not found
              </h1>
              
              <p className="text-p-xs sm:text-p-sm text-text-slate-700 mb-8">
                The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-100 transition-shadow duration-200 w-full sm:w-auto text-a-sm"
                >
                  <FiHome className="w-5 h-5" />
                  Back to Home
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-white text-text-slate-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 w-full sm:w-auto text-a-sm"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Go Back
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-a-xs text-text-slate-700">
                  Need help?{' '}
                  <Link 
                    href="/contact" 
                    className="text-sky-600 font-medium hover:text-sky-700 transition-colors"
                  >
                    Contact support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-a-xs text-text-slate-700">
            Or try these common pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
            <Link href="/" className="text-a-xs text-sky-600 hover:text-sky-700 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/about" className="text-a-xs text-sky-600 hover:text-sky-700 transition-colors">
              About
            </Link>
            
            <span className="text-gray-300">|</span>
            <Link href="/contact" className="text-a-xs text-sky-600 hover:text-sky-700 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}