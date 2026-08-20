// app/pricing/page.jsx
import { createMetadata } from '../../utils/seo';
import PricingServer from '../../components/PricingServer';
import { getPlans } from '../../services/pricingService';

export const metadata = createMetadata({
  title: "Pricing Plans – GST Billing Software | The Fast Bill",
  description: "Explore The Fast Bill's flexible billing software pricing plans. Start free, no hidden fees, cancel anytime. Find the perfect GST billing plan for your business.",
  keywords: "thefastbill pricing, gst billing software pricing, billing software plans",
  path: 'pricing',
 
});

// ✅ Fetch pricing data on the server (same as home page)
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

export default async function PricingPage() {
  const pricingData = await getPricingData();

  return (
    <PricingServer 
      initialData={pricingData} 
      showFilters={true} 
      showViewAllButton={false} 
      limit={0} 
    />
  );
}