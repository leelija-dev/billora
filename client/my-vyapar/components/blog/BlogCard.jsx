import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, ArrowRight, Clock, Eye } from 'lucide-react';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to fix image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, prepend the API base URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    return `${API_BASE_URL}/${cleanPath}`;
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(65,135,249)]/0 to-[#ec4899]/0 group-hover:from-[rgb(65,135,249)]/5 group-hover:to-[#ec4899]/5 transition-all duration-500 z-0 pointer-events-none"></div>
      
      {/* Featured Image */}
      <div className="relative h-52 overflow-hidden">
        {blog.feature_image ? (
          <Image
            src={getImageUrl(blog.feature_image)}
            alt={blog.feature_image_alt || blog.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[rgb(65,135,249)]/10 to-[#ec4899]/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-slate-400 text-sm">No image</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {blog.categories && blog.categories.length > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-[rgb(65,135,249)] text-xs font-semibold rounded-full shadow-sm border border-slate-100">
              {blog.categories[0].name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        {/* Meta Information */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {blog.created_at && formatDate(blog.created_at)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            4 min read
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-[rgb(65,135,249)] transition-colors duration-200">
          <Link href={`/blog/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {blog.excerpt || 'Discover insights and practical tips in this comprehensive guide.'}
        </p>

        {/* Author & Tags */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[rgb(65,135,249)]/20 to-[#ec4899]/20 flex items-center justify-center text-sm font-medium text-[rgb(65,135,249)]">
              {blog.user ? (blog.user.fname ? blog.user.fname.charAt(0) : blog.user.username ? blog.user.username.charAt(0) : 'A') : 'A'}
            </div>
            <span className="text-sm text-slate-600">
              {blog.user ? (blog.user.fname && blog.user.lname ? `${blog.user.fname} ${blog.user.lname}` : blog.user.username || 'Staff Writer') : 'Staff Writer'}
            </span>
          </div>
          
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[rgb(65,135,249)] hover:text-[#ec4899] transition-colors group-hover:gap-2 duration-200"
          >
            Read
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Tags (if any) */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded-full"
              >
                <Tag className="h-3 w-3" />
                {tag.name}
              </span>
            ))}
            {blog.tags.length > 2 && (
              <span className="text-xs text-slate-400">
                +{blog.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}