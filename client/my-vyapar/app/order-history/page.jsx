import { Suspense } from "react";
import OrderHistoryContent from "./OrderHistoryContent";

export default function OrderHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading order history...</p>
          </div>
        </div>
      }
    >
      <OrderHistoryContent />
    </Suspense>
  );
}
