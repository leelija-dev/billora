// app/page.jsx
import { createMetadata } from "../utils/seo";
import { generateHomepageSchema } from "../utils/homepage-schema";
import PricingServer from "../components/PricingServer";
import TestimonialsServer from "../components/TestimonialsServer";
import { getPlans } from "../services/pricingService";
import testimonialService from "../services/testimonialService"; // ✅ Import your service

import Hero from "../components/Hero";
import Features from "../components/Features";
import Industries from "../components/Industries";
import HowItWorks from "../components/HowItWorks";
import Start from "../components/Start";
import FAQ from "../components/FAQ";
import Ratings from "../components/Ratings";

// ✅ ISR Configuration
export const revalidate = 3600;
export const dynamic = 'force-static';

// ✅ Fetch pricing data using your existing service
async function getPricingData() {
  try {
    const response = await getPlans();
    
    let plans = [];
    let allFeatures = [];
    
    if (response && response.data) {
      if (Array.isArray(response.data)) {
        plans = response.data;
        if (response.allFeatures && Array.isArray(response.allFeatures)) {
          allFeatures = response.allFeatures;
        }
      } else if (response.data.data && Array.isArray(response.data.data)) {
        plans = response.data.data;
        if (response.data.allFeatures && Array.isArray(response.data.allFeatures)) {
          allFeatures = response.data.allFeatures;
        }
      }
    } else if (Array.isArray(response)) {
      plans = response;
    }
    
    if (!allFeatures.length && plans.length > 0) {
      const featureSet = new Set();
      plans.forEach(plan => {
        if (plan.features && Array.isArray(plan.features)) {
          plan.features.forEach(f => {
            if (f.name) featureSet.add(f.name);
          });
        }
      });
      allFeatures = Array.from(featureSet).map(name => ({ name }));
    }
    
    return { plans, allFeatures };
  } catch (error) {
    console.error('❌ Error fetching pricing on server:', error);
    return { plans: [], allFeatures: [] };
  }
}

// ✅ Fetch testimonials data using your service
async function getTestimonialsData() {
  try {
    const response = await testimonialService.getTestimonialsForServer();
    
    if (response.success) {
      return { testimonials: response.data };
    } else {
      console.error('❌ Failed to fetch testimonials:', response.message);
      return { testimonials: [] };
    }
  } catch (error) {
    console.error('❌ Error fetching testimonials on server:', error);
    return { testimonials: [] };
  }
}

export const metadata = createMetadata({
  title: "Best Inventory Management & GST Billing Software - The Fast Bill",
  description:
    "Fast Bill is the best billing software for retail shops in India that creates customized GST bills within 10 seconds, & helps you manage inventory & track sales.",
  keywords:
    "best billing software in india, billing software, gst billing software",
  path: "/",
});

export default async function Page() {
  // ✅ Fetch both data in parallel for better performance
  const [pricingData, testimonialsData] = await Promise.all([
    getPricingData(),
    getTestimonialsData()
  ]);
  
  const homepageSchema = generateHomepageSchema();

  return (
    <>
      <script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema),
        }}
      />

      <Hero />
      <Features />
      <Industries />
      <HowItWorks />
      <PricingServer initialData={pricingData} />
      <TestimonialsServer initialData={testimonialsData} />
      <Start />
      <FAQ />
      <Ratings />
    </>
  );
}