// app/blog/category/[category-id]/page.js
import { createMetadata } from '@/utils/seo';
import CategoryClient from './CategoryClient';
import { blogApi } from '@/services/blogApi';

// This runs on the server - no authentication needed
async function getBlogsByCategory(categoryId) {
  try {
    const response = await blogApi.getBlogsByCategory(categoryId, { page: 1 });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { 'category-id': categoryId } = await params;
  
  return createMetadata({
    title: `Category | The Fast Bill`,
    description: `Read articles in this category on The Fast Bill blog.`,
    keywords: `category, blog, articles`,
    path: `blog/category/${categoryId}`,
  });
}

export default async function CategoryPage({ params }) {
  const { 'category-id': categoryId } = await params;
  const initialData = await getBlogsByCategory(categoryId);
  
  return <CategoryClient initialData={initialData} categoryId={categoryId} />;
}