// components/PricingServer.jsx
import Pricing from './Pricing';

// This is a Server Component (no 'use client')
export default function PricingServer({ initialData }) {
  // Pass server-fetched data to client component
  return <Pricing initialData={initialData} />;
}