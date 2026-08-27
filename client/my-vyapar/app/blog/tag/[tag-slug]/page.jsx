// app/blog/tag/[tag-slug]/page.js
import { createMetadata } from '@/utils/seo';
import TagClient from './TagClient';
import { blogApi } from '@/services/blogApi';

// This runs on the server - no authentication needed
async function getBlogsByTag(tagSlug) {
  try {
    const response = await blogApi.getBlogsByTag(tagSlug, { page: 1 });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by tag:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { 'tag-slug': tagSlug } = await params;
  
  return createMetadata({
    title: `Blogs tagged with "${tagSlug}" | The Fast Bill`,
    description: `Read articles tagged with ${tagSlug} on The Fast Bill blog.`,
    keywords: `${tagSlug}, blog, articles`,
    path: `blog/tag/${tagSlug}`,
  });
}

export default async function TagPage({ params }) {
  const { 'tag-slug': tagSlug } = await params;
  const initialData = await getBlogsByTag(tagSlug);
  
  return <TagClient initialData={initialData} tagSlug={tagSlug} />;
}
