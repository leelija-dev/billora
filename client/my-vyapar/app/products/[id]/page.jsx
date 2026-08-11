import { createMetadata } from '@/utils/seo'; 
import ProductsContent from './ProductContent';

export const metadata = createMetadata({
  title: "Products – Billing & Inventory Software | The Fast Bill",
  description: "Explore The Fast Bill's products including billing software, inventory management, GST compliance tools, and more for Indian businesses.",
  path: '/products',
});

export default function ProductsPage() {
  return <ProductsContent />;
}