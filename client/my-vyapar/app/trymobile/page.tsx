"use client";

import Link from "next/link";
import Image from "next/image";

export default function TryMobileAppPage() {
  const features = [
    { icon: "📱", title: "Mobile Billing", desc: "Create invoices on the go" },
    { icon: "📊", title: "Real-time Dashboard", desc: "Track business anytime" },
    { icon: "🔄", title: "Sync Across Devices", desc: "Seamless data sync" },
    { icon: "🔒", title: "Secure Backup", desc: "Auto cloud backup" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">

      {/* Background Blur Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 opacity-30 rounded-full blur-3xl"></div>

      {/* Back to Home Button */}
      <div className="fixed top-20 sm:top-24 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-gray-200 group text-sm sm:text-base"
        >
          <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="font-medium hidden sm:inline">Back to Home</span>
          <span className="font-medium sm:hidden">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fadeIn">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Try{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mobile App
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Manage your business anytime, anywhere with Vyapar mobile app
            </p>
          </div>

          {/* App Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">

            {/* Phone Mockups - Overlapping */}
            <div className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center md:justify-center mx-auto"> 

              {/* Large Phone (Background) */}
              <div className="absolute left-1/2 -translate-x-1/2 w-[180px] sm:w-[220px] md:w-[260px] h-[360px] sm:h-[440px] md:h-[520px] bg-gray-800 rounded-[30px] sm:rounded-[35px] md:rounded-[40px] p-1.5 sm:p-2 shadow-xl sm:shadow-2xl animate-float z-0">
                <div className="w-full h-full bg-gray-900 rounded-[28px] sm:rounded-[33px] md:rounded-[36px] overflow-hidden relative">
                  <Image
                    src="/image/phone1.png"
                    alt="Mobile App Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Small Phone (Foreground - Overlapping) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-12 sm:top-16 md:top-20 w-[140px] sm:w-[170px] md:w-[200px] h-[280px] sm:h-[340px] md:h-[400px] bg-gray-800 rounded-[24px] sm:rounded-[28px] md:rounded-[32px] p-1.5 sm:p-2 shadow-xl sm:shadow-2xl animate-floatSlow z-10">
                <div className="w-full h-full bg-gray-900 rounded-[22px] sm:rounded-[26px] md:rounded-[28px] overflow-hidden relative">
                  <Image
                    src="/image/mobail.png"
                    alt="Mobile App Interface"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

            </div>

            {/* Features */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{feature.icon}</span>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:scale-105 transition-all active:scale-95">
                  Download Android
                </button>
                <button className="w-full sm:flex-1 bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-gray-800 transition-all active:scale-95 hover:scale-105">
                  Download iOS
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center shadow-lg sm:shadow-xl border border-gray-100">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Scan to Download
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
              Get the app directly on your phone
            </p>

            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">

              <div className="p-4 sm:p-6 bg-gray-100 rounded-xl sm:rounded-2xl hover:shadow-lg transition hover:-translate-y-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-lg sm:rounded-xl shadow-inner flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl">📱</span>
                </div>
                <p className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base">Android</p>
              </div>

              <div className="p-4 sm:p-6 bg-gray-100 rounded-xl sm:rounded-2xl hover:shadow-lg transition hover:-translate-y-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-lg sm:rounded-xl shadow-inner flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl md:text-4xl">🍎</span>
                </div>
                <p className="mt-2 sm:mt-3 font-semibold text-sm sm:text-base">iOS</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(-50%, 0px); }
          50% { transform: translate(-50%, -15px); }
          100% { transform: translate(-50%, 0px); }
        }

        @keyframes floatSlow {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes fadeIn {
          from { opacity:0; transform: translateY(20px);}
          to { opacity:1; transform: translateY(0);}
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 3.5s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }

        @media (max-width: 640px) {
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-floatSlow {
            animation: floatSlow 3.5s ease-in-out infinite;
          }
        }
      `}</style>
    </div>
  );
}