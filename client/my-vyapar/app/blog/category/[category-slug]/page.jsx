// app/blog/category/[category-slug]/page.js
import { createMetadata } from '@/utils/seo';
import CategoryClient from './CategoryClient';
import { blogApi } from '@/services/blogApi';
import { decodeSlug } from '@/utils/slug';

// This runs on the server - no authentication needed
async function getBlogsByCategory(categorySlug) {
  try {
    // Decode the slug to get the original category name
    const categoryName = decodeSlug(categorySlug);
    const response = await blogApi.getBlogsByCategory(categoryName, { page: 1 });
    console.log('Fetched blogs for category:',  response.data); // Debugging line to check the fetched data
    return response.data;

  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { 'category-slug': categorySlug } = await params;
  const categoryName = decodeSlug(categorySlug);
  
  // Fetch category data to get actual name and description
  let categoryData = null;
  try {
    const response = await blogApi.getBlogsByCategory(categoryName, { page: 1 });
    categoryData = response.data?.category;
    console.log(categoryData);
  } catch (error) {
    console.error('Error fetching category for metadata:', error);
  }
  
  const actualCategoryName = categoryData?.name || categoryName;
  const categoryDescription = categoryData?.description || `Read articles in ${categoryName} on The Fast Bill blog.`;
  
  return createMetadata({
    title: `Category: ${actualCategoryName} | The Fast Bill`,
    description: categoryDescription,
    keywords: `${actualCategoryName}, category, blog, articles`,
    path: `blog/category/${categorySlug}`,
  });
}

export default async function CategoryPage({ params }) {
  const { 'category-slug': categorySlug } = await params;
  const categoryName = decodeSlug(categorySlug);
  const initialData = await getBlogsByCategory(categorySlug);
  
  return <CategoryClient initialData={initialData} categorySlug={categorySlug} categoryName={categoryName} />;
}