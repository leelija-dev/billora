"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      
      {/* Dedicated Pricing Page - Shows ALL plans */}
      <Pricing
        showAll={true}
        showButton={true}
        buttonLink="/contact"
        buttonText="Need Help?"
      />
      
      <Footer />
    </>
  );
}