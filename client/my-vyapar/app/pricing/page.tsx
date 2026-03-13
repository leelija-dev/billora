// pricing/page.tsx
"use client";

import Link from "next/link";
import Pricing from '@/components/Pricing';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import { useRouter } from "next/navigation";
// import { FaHome } from "react-icons/fa";

export default function PricingPage() {
  // const router = useRouter();

  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      
      
      <Pricing />
      
      <Footer />
    </div>
  );
}