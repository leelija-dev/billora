// app/blog/tag/[tag-slug]/page.js
import { createMetadata } from '@/utils/seo';
import TagClient from './TagClient';
import { blogApi } from '@/services/blogApi';
import { decodeSlug } from '@/utils/slug';

// This runs on the server - no authentication needed
async function getBlogsByTag(tagSlug) {
  try {
    // Decode the slug to get the original tag name
    const tagName = decodeSlug(tagSlug);
    const response = await blogApi.getBlogsByTag(tagName, { page: 1 });
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs by tag:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { 'tag-slug': tagSlug } = await params;
  const tagName = decodeSlug(tagSlug);
  
  return createMetadata({
    title: `Blogs tagged with "${tagName}" | The Fast Bill`,
    description: `Read articles tagged with ${tagName} on The Fast Bill blog.`,
    keywords: `${tagName}, blog, articles`,
    path: `blog/tag/${tagSlug}`,
  });
}

export default async function TagPage({ params }) {
  const { 'tag-slug': tagSlug } = await params;
  const tagName = decodeSlug(tagSlug);
  const initialData = await getBlogsByTag(tagSlug);
  
  return <TagClient initialData={initialData} tagSlug={tagSlug} tagName={tagName} />;
}
