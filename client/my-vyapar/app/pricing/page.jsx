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
        showAll={true}      // ← Shows ALL plans from database
        showButton={true}   // ← Shows bottom section with button
        buttonLink="/contact"  // ← Button links to contact page
      />
      
      <Footer />
    </>
  );
}