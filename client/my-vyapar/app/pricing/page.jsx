// pricing/page.jsx
"use client";

import Link from "next/link";
import Pricing from '@/components/Pricing';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      
      <Pricing />
      
      <Footer />
    </div>
  );
}