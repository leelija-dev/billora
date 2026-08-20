// app/blog/[slug]/page.js
import blogApi from '@/services/blogApi'; 
import BlogPostClient from './BlogPostClient'; 
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createMetadata } from '@/utils/seo';
import { siteConfig } from '@/lib/site';

// Generate static params at build time for better performance
export async function generateStaticParams() {
  try {
    const response = await blogApi.getBlogs({ page: 1, limit: 100 });
    const blogs = response.data?.blogs?.data || [];
    return blogs.map(blog => ({
      slug: blog.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// ISR: Revalidate every 60 seconds (1 minute)
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const response = await blogApi.getBlog(slug);
    const data = response.data;
    
    if (!data.status || !data.blog) {
      return createMetadata({
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
        noIndex: true,
      });
    }

    const blog = data.blog;
    
    // Use createMetadata without modifying it
    return createMetadata({
      title: `${blog.title} | The Fast Bill Blog`,
      description: blog.excerpt || `Read ${blog.title} on The Fast Bill Blog.`,
      path: `blog/${slug}`,
      image: blog.feature_image || "/blog-default-og.jpg",
      keywords: blog.tags?.join(', ') || 'blog, articles',
    });
  } catch (error) {
    return createMetadata({
      title: 'Blog Post',
      description: 'Read our latest blog post.',
    });
  }
}

export default async function BlogPostPage({ params }) {
  try {
    const { slug } = await params;
    
    // Fetch blog data on the server
    const response = await blogApi.getBlog(slug);
    const data = response.data;

    if (!data.status || !data.blog) {
      return <NotFound />;
    }

    // Get the blog data
    const blogData = data.blog;
    
    // Format user data properly
    const formattedUser = {
      id: blogData.user?.id || null,
      username: blogData.user?.username || 'editor',
      fname: blogData.user?.fname || '',
      lname: blogData.user?.lname || '',
      fullName: blogData.user?.fname && blogData.user?.lname 
        ? `${blogData.user.fname} ${blogData.user.lname}`
        : blogData.user?.username || 'Editorial Team',
      avatar: blogData.user?.image || null,
      bio: blogData.user?.description || 'Content writer and industry expert.',
      role: blogData.user?.username || 'contributor',
      email: blogData.user?.email || '',
      created_at: blogData.user?.created_at || null,
      updated_at: blogData.user?.updated_at || null,
    };

    // Format the blog data with proper user information
    const formattedBlog = {
      ...blogData,
      user: formattedUser,
      author_name: formattedUser.fullName,
      author_avatar: formattedUser.avatar,
    };

    // Fetch related blogs
    let relatedBlogs = [];
    try {
      const relatedResponse = await blogApi.getRelatedBlogs(4);
      const relatedData = relatedResponse.data;
      if (relatedData.status && relatedData.blogs?.data) {
        relatedBlogs = relatedData.blogs.data
          .filter(post => post.id !== blogData.id)
          .slice(0, 3)
          .map(blog => ({
            ...blog,
            user: blog.user ? {
              ...blog.user,
              fullName: blog.user.fname && blog.user.lname 
                ? `${blog.user.fname} ${blog.user.lname}`
                : blog.user.username || 'Editorial Team'
            } : null
          }));
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }

    // Process content for table of contents on the server
    const processedContent = processContentForTOC(blogData.content);

    // Generate JSON-LD structured data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogData.title,
      "description": blogData.excerpt || blogData.title,
      "image": blogData.feature_image || `${siteConfig.url}/blog-default-og.jpg`,
      "datePublished": blogData.created_at,
      "dateModified": blogData.updated_at || blogData.created_at,
      "author": {
        "@type": "Person",
        "name": formattedUser.fullName,
        ...(formattedUser.avatar && {
          "image": formattedUser.avatar
        })
      },
      "publisher": {
        "@type": "Organization",
        "name": siteConfig.name || "The Fast Bill",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteConfig.url}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/blog/${slug}`
      },
      "keywords": blogData.tags?.join(', ') || '',
      "articleSection": blogData.category || 'Blog',
    };

    return (
      <>
        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <BlogPostClient 
          initialBlog={formattedBlog}
          initialRelatedBlogs={relatedBlogs}
          initialToc={processedContent.toc}
          lastUpdated={new Date().toISOString()}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    return <NotFound />;
  }
}

// Helper function to process content and generate TOC
function processContentForTOC(content) {
  if (!content) return { html: '', toc: [] };
  
  // Use a simple regex to find headings
  const headingRegex = /<h([2-3])>(.*?)<\/h\1>/g;
  const toc = [];
  let match;
  let index = 0;
  
  // Find all headings and add IDs
  const headingMatches = [];
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1];
    const text = match[2];
    const id = `heading-${index}`;
    headingMatches.push({
      level: `h${level}`,
      text: text.replace(/<[^>]*>/g, ''), // Remove any HTML tags from heading text
      id,
      href: `#${id}`
    });
    index++;
  }
  
  // Replace headings with ones containing IDs
  let processedHtml = content;
  headingMatches.forEach((heading) => {
    const originalHeading = `<h${heading.level.replace('h', '')}>${heading.text}</h${heading.level.replace('h', '')}>`;
    const newHeading = `<${heading.level} id="${heading.id}">${heading.text}</${heading.level}>`;
    processedHtml = processedHtml.replace(originalHeading, newHeading);
    toc.push({
      id: heading.id,
      text: heading.text,
      level: heading.level,
      href: heading.href
    });
  });
  
  return {
    html: processedHtml,
    toc: toc.slice(0, 8) // Limit TOC items to 8
  };
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="xl:container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 mb-6">
            <svg className="h-8 w-8 text-[rgb(65,135,249)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}