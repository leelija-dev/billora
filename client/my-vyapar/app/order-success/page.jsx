import { Suspense } from "react";
import OrderSuccessPage from "./OrderSuccess";
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  // title: "Order History – Track Your Invoices & Orders | The Fast Bill",
  // description: "View your complete order history, track invoices, and manage your billing records with The Fast Bill. Access all your GST invoices and purchase details in one place.",
  path: '/order-success',
  noIndex: true, // Recommended for user-specific pages
});

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading order success details...</p>
          </div>
        </div>
      }
    >
      <OrderSuccessPage />
    </Suspense>
  );
}
