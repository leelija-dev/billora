import { Suspense } from "react";
import OrderSummary from "./OrderSummary";
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  // title: "Order History – Track Your Invoices & Orders | The Fast Bill",
  // description: "View your complete order history, track invoices, and manage your billing records with The Fast Bill. Access all your GST invoices and purchase details in one place.",
  path: '/order-summary',
  noIndex: true, // Recommended for user-specific pages
});

export default function OrderSummaryPage() {
  return (
    
      <OrderSummary />
    
  );
}
