import { MetadataRoute } from 'next'

// Static pages configuration based on existing sitemap
const staticPages = [
  { url: '', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: 'pricing', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'solution', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'about', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'blog', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'contact', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'start-free-trial', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'careers', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'privacy-policy', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'terms-service', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'cookie-policy', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: 'gdpr', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
]

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://thefastbill.com'
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  
  // Generate static URLs
  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // Fetch dynamic blog posts from Laravel API
  let blogUrls = []
  try {
    // Remove /api suffix if present to avoid double /api in URL
    const apiBaseUrl = API_BASE_URL.replace(/\/api$/, '')
    const response = await fetch(`${apiBaseUrl}/api/blog`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (response.ok) {
      const data = await response.json()
      // Handle Laravel pagination structure: { blogs: { data: [...] } }
      const blogs = data.blogs?.data || data.data || data.blogs || data || []
      
      blogUrls = blogs.map((blog) => ({
        url: `${baseUrl}blog/${blog.slug}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : (blog.created_at ? new Date(blog.created_at) : new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
    // Continue with static URLs if blog fetch fails
  }

  return [...staticUrls, ...blogUrls]
}