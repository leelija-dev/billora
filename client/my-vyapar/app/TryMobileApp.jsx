"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TryMobileApp = () => {
  const features = [
    { icon: '📱', title: 'Mobile Billing', desc: 'Create invoices on the go' },
    { icon: '📊', title: 'Real-time Dashboard', desc: 'Track business anytime' },
    { icon: '🔄', title: 'Sync Across Devices', desc: 'Seamless data sync' },
    { icon: '🔒', title: 'Secure Backup', desc: 'Auto cloud backup' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Try <span className="text-blue-600">Mobile App</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your business anytime, anywhere with Vyapar mobile app
          </p>
        </div>

        {/* App Showcase */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[600px]">
            <div className="absolute left-1/2 -translate-x-1/2 w-[280px] h-[560px] bg-gray-800 rounded-[40px] p-2 shadow-2xl">
              <div className="w-full h-full bg-gray-900 rounded-[36px] overflow-hidden relative">
                <Image
                  src="/image/mobail.png"
                  alt="Mobile App Interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -right-10 top-20 w-[200px] h-[400px] bg-gray-800 rounded-[40px] p-2 shadow-2xl rotate-12 hidden lg:block">
              <div className="w-full h-full bg-gray-900 rounded-[36px] overflow-hidden relative">
                <Image
                  src="/image/phone1.png"
                  alt="Mobile App Dashboard"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-4xl">{feature.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-4 pt-6">
              <button className="flex-1 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all hover:-translate-y-1">
                Download for Android
              </button>
              <button className="flex-1 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all hover:-translate-y-1">
                Download for iOS
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Scan to Download</h2>
          <p className="text-gray-600 mb-8">Get the app directly on your phone</p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="p-4 bg-gray-100 rounded-2xl">
              <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <p className="mt-2 font-semibold">Android</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-2xl">
              <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
                <span className="text-4xl">🍎</span>
              </div>
              <p className="mt-2 font-semibold">iOS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryMobileApp;