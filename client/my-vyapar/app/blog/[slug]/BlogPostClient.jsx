'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, User, Tag, ArrowLeft, Share2, Heart, 
  Facebook, Twitter, Linkedin, 
  Clock, Eye, Mail, 
  ChevronDown, ChevronUp, Bookmark, Copy, Check,
  MessageCircle, ThumbsUp, Share, ExternalLink,
  Award, Briefcase, MapPin, RefreshCw
} from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';

export default function BlogPostClient({ 
  initialBlog, 
  initialRelatedBlogs,
  initialToc,
  lastUpdated 
}) {
  const router = useRouter();
  const [blog] = useState(initialBlog);
  const [relatedBlogs] = useState(initialRelatedBlogs);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaqs, setOpenFaqs] = useState([1]);
  const [tableOfContents] = useState(initialToc || []);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  const faqs = blog?.faqs || [];
  const user = blog?.user || {};
  const authorName = user.fullName || (user.fname && user.lname ? `${user.fname} ${user.lname}` : user.username || 'Editorial Team');

  // console.log("Current Blog:", blog);

  // Check if content is fresh (less than 60 seconds old)
  useEffect(() => {
    if (lastUpdated) {
      const lastUpdateTime = new Date(lastUpdated).getTime();
      const now = new Date().getTime();
      const diffSeconds = (now - lastUpdateTime) / 1000;
      
      if (diffSeconds > 60) {
        setShowUpdateIndicator(true);
      }
    }
  }, [lastUpdated]);

  const toggleFaq = (faqId) => {
    setOpenFaqs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

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
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    API_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // Helper function to get user avatar URL
  const getUserAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    
    // If it's already a full URL, return as-is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // If it's a relative path, prepend the API base URL
    let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    API_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
    
    // Remove leading slash if present
    const cleanPath = avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  const handleShare = async (platform = null) => {
    const url = window.location.href;
    const title = blog.title;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: url,
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleTocClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      window.history.pushState(null, null, href);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user.fname && user.lname) {
      return `${user.fname.charAt(0)}${user.lname.charAt(0)}`;
    }
    if (user.fname) {
      return user.fname.charAt(0);
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Get user avatar URL (try multiple sources)
  const userAvatarUrl = user.avatar || user.image || user.profile_image || null;
  const avatarImageUrl = getUserAvatarUrl(userAvatarUrl);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      

      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="xl:container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="text-slate-500 hover:text-[rgb(65,135,249)] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400">/</span>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-500 hover:text-[rgb(65,135,249)] transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400">/</span>
                </li>
                <li className="text-slate-900 font-medium truncate max-w-[150px] sm:max-w-[300px]">
                  {blog.title}
                </li>
              </ol>
            </nav>
            
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="xl:container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24">
              {/* Current Post Indicator */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-[rgb(65,135,249)] to-[#ec4899] rounded-full"></div>
                  <h3 className="text-sm font-semibold text-slate-900">Current Post</h3>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3">
                  {blog.title}
                </p>
              </div>

              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-[rgb(65,135,249)] to-[#ec4899] rounded-full"></div>
                    Table of Contents
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {tableOfContents.map((item, idx) => (
                      <li key={idx}>
                        <a 
                          href={item.href}
                          onClick={(e) => handleTocClick(e, item.href)}
                          className={`text-slate-600 hover:text-[rgb(65,135,249)] transition-colors ${
                            item.level === 'h3' ? 'pl-3 text-slate-500' : ''
                          } block py-1`}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Featured Image */}
              {blog.feature_image && (
                <div className="relative h-56 sm:h-80 md:h-96 w-full overflow-hidden">
                  <Image
                    src={getImageUrl(blog.feature_image)}
                    alt={blog.feature_image_alt || blog.title}
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              )}

              {/* Article Content */}
              <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                {/* Category */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 text-[rgb(65,135,249)] text-xs font-semibold rounded-full">
                      {blog.categories[0].name}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                  {blog.title}
                </h1>

                {/* Meta Information with User Details */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {blog.created_at && formatDate(blog.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    5 min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    1.2k views
                  </div>
                  {/* User Info with Avatar */}
                  <div className="flex items-center gap-2 ml-0 sm:ml-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                      {avatarImageUrl ? (
                        <Image
                          src={avatarImageUrl}
                          alt={authorName}
                          width={28}
                          height={28}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                    <span className="text-slate-700 font-medium">
                      {authorName}
                    </span>
                    {user.role === 'admin' && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-[rgb(65,135,249)]/10 text-[rgb(65,135,249)] text-[10px] font-medium rounded-full">
                        Admin
                      </span>
                    )}
                    {user.role === 'editor' && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-[#ec4899]/10 text-[#ec4899] text-[10px] font-medium rounded-full">
                        Editor
                      </span>
                    )}
                  </div>
                </div>

                {/* Author Bio Bar - Quick Author Info */}
                {user && (user.fname || user.username) && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-slate-50 to-white p-3 sm:p-4 rounded-xl mb-6 border border-slate-100">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] flex items-center justify-center text-white text-sm sm:text-base font-bold shrink-0">
                      {avatarImageUrl ? (
                        <Image
                          src={avatarImageUrl}
                          alt={authorName}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {authorName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.role || 'Content Writer'}
                      </p>
                    </div>
                    {/* <Link
                      href={`/author/${user.id || user.username}`}
                      className="text-[rgb(65,135,249)] hover:text-[rgb(65,135,249)]/80 text-xs font-medium transition-colors shrink-0"
                    >
                      View Profile
                    </Link> */}
                  </div>
                )}

                {/* Excerpt */}
                {blog.excerpt && (
                  <div className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 italic border-l-4 border-[rgb(65,135,249)] pl-4 bg-slate-50 p-4 rounded-r-xl">
                    {blog.excerpt}
                  </div>
                )}

                {/* Blog Content */}
                <div 
                  className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-[rgb(65,135,249)] prose-strong:text-slate-900 prose-li:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </article>

            {/* FAQ Section */}
            {faqs.length > 0 && (
              <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[rgb(65,135,249)] to-[#ec4899] rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                        {openFaqs.includes(faq.id) ? (
                          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-[rgb(65,135,249)] shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {openFaqs.includes(faq.id) && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-slate-100 pt-4">
                          <p className="text-slate-600 text-sm sm:text-base">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Section */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-5 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-[rgb(65,135,249)]" />
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">Topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 bg-slate-100 text-slate-700 text-xs sm:text-sm rounded-full hover:bg-gradient-to-r hover:from-[rgb(65,135,249)]/10 hover:to-[#ec4899]/10 hover:text-[rgb(65,135,249)] transition-all cursor-pointer"
                    >
                      <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Section - Enhanced with Full Details */}
            {user && (user.fname || user.username) && (
              <div className="mt-8 sm:mt-12 bg-gradient-to-r from-[rgb(65,135,249)]/5 to-[#ec4899]/5 rounded-2xl sm:rounded-3xl border border-slate-100 p-5 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
                  {/* Author Avatar */}
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                      {avatarImageUrl ? (
                        <Image
                          src={avatarImageUrl}
                          alt={authorName}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                    {user.role === 'admin' && (
                      <div className="absolute -bottom-1 -right-1 bg-[rgb(65,135,249)] rounded-full p-1 border-2 border-white">
                        <Award className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {user.role === 'editor' && (
                      <div className="absolute -bottom-1 -right-1 bg-[#ec4899] rounded-full p-1 border-2 border-white">
                        <Briefcase className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 capitalize">
                        {authorName}
                      </h3>
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-[rgb(65,135,249)]/10 text-[rgb(65,135,249)] text-xs font-medium rounded-full">
                          Admin
                        </span>
                      )}
                      {user.role === 'superadmin' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-[rgb(65,135,249)]/10 text-[rgb(65,135,249)] text-xs font-medium rounded-full">
                          Super Admin
                        </span>
                      )}
                      {user.role === 'editor' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-[#ec4899]/10 text-[#ec4899] text-xs font-medium rounded-full">
                          Editor
                        </span>
                      )}
                    </div>
                    
                   
                    
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed ">
                      {user.bio || user.description || 'Passionate about sharing insights and helping businesses grow through valuable content. With years of experience in digital marketing and business strategy.'}
                    </p>
                    
                    {/* Author Social Links */}
                    {/* <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      {user.email && (
                        <a href={`mailto:${user.email}`} className="p-1.5 sm:p-2 rounded-full bg-white text-slate-600 hover:text-[rgb(65,135,249)] hover:shadow-md transition-all">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        </a>
                      )}
                      <button className="p-1.5 sm:p-2 rounded-full bg-white text-slate-600 hover:text-[rgb(65,135,249)] hover:shadow-md transition-all">
                        <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button className="p-1.5 sm:p-2 rounded-full bg-white text-slate-600 hover:text-[rgb(65,135,249)] hover:shadow-md transition-all">
                        <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <Link
                        href={`/author/${user.id || user.username}`}
                        className="ml-auto text-xs font-medium text-[rgb(65,135,249)] hover:text-[rgb(65,135,249)]/80 transition-colors flex items-center gap-1"
                      >
                        View all posts
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* Related Posts Section */}
            {relatedBlogs.length > 0 && (
              <div className="mt-8 sm:mt-12">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[rgb(65,135,249)] to-[#ec4899] rounded-full"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Related Posts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Social Icons & Actions */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              {/* Social Share Section */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 sm:mb-4 text-center">Share this post</h3>
                <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto pb-2 lg:pb-0">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white rounded-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1da1f2] hover:bg-[#1da1f2]/90 text-white rounded-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#0a66c2] hover:bg-[#0a66c2]/90 text-white rounded-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm font-medium">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    {copied ? <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" /> : <Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
                    <span className="text-xs sm:text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl border border-slate-100 p-3 sm:p-4">
                <button
                  onClick={handleLike}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all mb-2 hover:bg-slate-50"
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  <span className="text-xs sm:text-sm text-slate-600">{liked ? 'Liked' : 'Like'}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all hover:bg-slate-50"
                >
                  <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${bookmarked ? 'fill-[rgb(65,135,249)] text-[rgb(65,135,249)]' : 'text-slate-400'}`} />
                  <span className="text-xs sm:text-sm text-slate-600">{bookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-5 sm:mt-6 bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 rounded-2xl p-4 sm:p-5 border border-[rgb(65,135,249)]/20">
                <h3 className="text-sm font-semibold text-slate-900 mb-1 sm:mb-2">Get Weekly Updates</h3>
                <p className="text-xs text-slate-600 mb-3">Subscribe for latest insights</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl mb-2 focus:ring-2 focus:ring-[rgb(65,135,249)]/30 focus:border-[rgb(65,135,249)] outline-none"
                />
                <button className="w-full px-3 py-2 bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] text-white text-sm rounded-xl font-medium hover:shadow-lg transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}