"use client";

import Link from "next/link";
import Pricing from '@/components/Pricing';
// import { useRouter } from "next/navigation";
// import { FaHome } from "react-icons/fa";

export default function PricingPage() {
  // const router = useRouter();

  return (
    <div className="relative min-h-screen">
      {/* Back to Home Button */}
      <div className="fixed top-24 left-4 z-50">
              <Link 
                href="/"
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-gray-200 group"
              >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
      
      <Pricing />
    </div>
  );
}