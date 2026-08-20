// app/blog/page.js (Server Component)
import { createMetadata } from '@/utils/seo';
import BlogClient from './BlogClient';
import { blogApi } from '@/services/blogApi';

// This runs on the server - no authentication needed
async function getBlogs() {
  try {
    const response = await blogApi.getBlogs({ page: 1 });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
}

export const metadata = createMetadata({
  title: "Blog – GST, Billing & Inventory Tips | The Fast Bill",
  description: "Read The Fast Bill blog for practical tips on GST billing, inventory management, tax compliance, and growing your business in India. Updated regularly.",
  keywords: "thefastbill blog",
  path: "blog",
});



export default async function BlogPage() {
  const initialData = await getBlogs();
  
  return <BlogClient initialData={initialData} />;
}