"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!mobileNumber.trim()) {
      alert('Please enter a mobile number');
      return;
    }
    
    if (mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search/validation
    setTimeout(() => {
      setIsSearching(false);
      alert(`Searching for mobile number: ${mobileNumber}`);
      // You can replace this with actual search logic
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Only allow numbers
  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setMobileNumber(value);
  };

  return (
    <main className="bg-[#white] min-h-[50vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 items-center gap-10">
          
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
              Start using <br /> myVyapar today
            </h1>

            {/* Premium Input Section with Clickable Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                  +91
                </div>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={handleNumberChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter mobile number"
                  className="w-full sm:w-72 pl-16 pr-5 py-3.5 text-gray-700 bg-white rounded-xl sm:rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-100 placeholder:text-gray-400"
                  maxLength="10"
                />
              </div>
              
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="relative w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3.5 rounded-xl sm:rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSearching ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Free Trial</span>
                      <svg 
                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                        fill="none" 
                        
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </button>
            </div>

            {/* Premium Download Section */}
            <div className="space-y-3">
              <p className="text-gray-600 text-sm font-medium">Download app on</p>
              <button 
                onClick={() => window.open('https://play.google.com/store/apps', '_blank')}
                className="transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                aria-label="Download from Google Play"
              >
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play Store"
                  width={150}
                  height={50}
                  className="h-12 w-auto hover:drop-shadow-lg transition-all duration-300"
                  priority={false}
                />
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT (Phone Mockups) */}
          <div className="relative flex justify-center items-center min-h-[400px]">
            {/* Back Phone */}
            <div className="absolute left-15 top-38 hidden lg:block">
              <Image
                src="/image/phone2.png"
                alt="Phone Back View"
                width={250}
                height={500}
                className="w-64 drop-shadow-xl max-h-[400px] object-contain"
                priority={false}
              />
            </div>

            {/* Front Phone */}
            <div className="relative z-10 top-13 left-18">
              <Image
                src="/image/phone1.png"
                alt="Phone Front View"
                width={250}
                height={500}
                className="w-64 drop-shadow-2xl max-h-[400px] object-contain"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}