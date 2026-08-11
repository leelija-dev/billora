import { Suspense } from "react";
import LoginPageContent from "./LoginPageContent";
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Login to Your Account | The Fast Bill",
  description: "Log in to your The Fast Bill account to create GST invoices, manage inventory, and track sales. Secure access to your billing dashboard, anytime, anywhere.",
  keywords: "thefastbill login",
  path: '/login',
});

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}