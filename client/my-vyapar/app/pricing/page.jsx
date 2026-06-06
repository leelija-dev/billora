

import Pricing from "../../components/Pricing";

export const metadata = {
  title: "Pricing Plans – GST Billing Software | The Fast Bill",

  description:
    "Explore The Fast Bill's flexible billing software pricing plans. Start free, no hidden fees, cancel anytime. Find the perfect GST billing plan for your business.",
}

const PricingPage = () => {
  return <Pricing showFilters={true} showViewAllButton={false} limit={0} />;
};

export default PricingPage;
