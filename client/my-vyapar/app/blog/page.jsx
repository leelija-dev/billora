'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronRight, Sparkles, TrendingUp, Clock, Eye } from 'lucide-react';
import BlogCard from '@/components/blog/BlogCard';
import { blogApi } from '@/services/blogApi';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = { page };
      
      // Apply search filter
      if (searchTerm) {
        params.search = 'name';
        params.name = searchTerm;
      }

      // Apply category filter
      if (selectedCategory) {
        params.category_id = selectedCategory;
      }

      const response = await blogApi.getBlogs(params);
      const data = response.data;

      if (data.status) {
        const blogData = data.blogs?.data || [];
        
        if (reset) {
          setBlogs(blogData);
        } else {
          setBlogs(prev => [...prev, ...blogData]);
        }

        // Set categories from API response
        if (data.categories && categories.length === 0) {
          setCategories(data.categories);
        }

        // Check if there are more pages
        setHasMore(data.blogs?.current_page < data.blogs?.last_page);
        setCurrentPage(data.blogs?.current_page || page);
      } else {
        throw new Error(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, true);
  }, [searchTerm, selectedCategory]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBlogs(currentPage + 1, false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setHasMore(true);
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

  // Featured post (first blog post)
  const featuredPost = blogs[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar - Fully Rounded with Custom Dropdown */}
        <div className="flex flex-col md:flex-row gap-3 bg-white/80 backdrop-blur-sm shadow-lg border border-slate-100 p-4 mb-3 sticky top-22 z-30 rounded-full">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-[rgb(65,135,249)]/30 focus:border-[rgb(65,135,249)] focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Custom Category Dropdown */}
          <div className="md:w-72 relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:ring-2 focus:ring-[rgb(65,135,249)]/30 focus:border-[rgb(65,135,249)] transition-all outline-none text-slate-700 cursor-pointer hover:bg-slate-100"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-sm">
                  {selectedCategory 
                    ? categories.find(c => c.id === parseInt(selectedCategory))?.name 
                    : 'All Categories'}
                </span>
              </div>
              <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown options */}
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        handleCategoryChange('');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-[rgb(65,135,249)]/5 hover:to-[#ec4899]/5 transition-colors ${
                        !selectedCategory ? 'bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 text-[rgb(65,135,249)] font-medium' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>All Categories</span>
                        {!selectedCategory && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[rgb(65,135,249)]"></div>
                        )}
                      </div>
                    </button>
                    
                    <div className="h-px bg-slate-100 my-1"></div>
                    
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategoryChange(category.id.toString());
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-[rgb(65,135,249)]/5 hover:to-[#ec4899]/5 transition-colors ${
                          selectedCategory === category.id.toString() 
                            ? 'bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 text-[rgb(65,135,249)] font-medium' 
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          {selectedCategory === category.id.toString() && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[rgb(65,135,249)]"></div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="my-4 flex flex-wrap gap-2 px-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 text-[rgb(65,135,249)] border border-[rgb(65,135,249)]/20">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="hover:text-[#ec4899] transition-colors ml-1">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 text-[rgb(65,135,249)] border border-[rgb(65,135,249)]/20">
                Category: {categories.find(c => c.id === parseInt(selectedCategory))?.name}
                <button onClick={() => setSelectedCategory('')} className="hover:text-[#ec4899] transition-colors ml-1">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
    
        {/* Featured Post - conditional, only show when no filters active */}
        {!searchTerm && !selectedCategory && (
          <div className="mb-12 mt-6">
            <div className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgb(65,135,249)]/5 to-[#ec4899]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-full min-h-[300px] overflow-hidden max-h-[400px]">
                  {featuredPost?.feature_image ? (
                    <img
                      src={getImageUrl(featuredPost.feature_image)}
                      alt={featuredPost.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[rgb(65,135,249)]/20 to-[#ec4899]/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl mb-3">✨</div>
                        <p className="text-slate-500">Featured Story</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] text-white text-xs font-semibold rounded-full shadow-lg">
                      <TrendingUp className="h-3 w-3" />
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost?.created_at && new Date(featuredPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      5 min read
                    </div>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-[rgb(65,135,249)] transition-colors duration-300">
                    {featuredPost?.title}
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {featuredPost?.excerpt || 'Explore our latest featured article packed with actionable insights and expert advice.'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] flex items-center justify-center text-white font-semibold">
                        {featuredPost?.user ? (featuredPost.user.fname ? featuredPost.user.fname.charAt(0) : featuredPost.user.username ? featuredPost.user.username.charAt(0) : 'A') : 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {featuredPost?.user ? (featuredPost.user.fname && featuredPost.user.lname ? `${featuredPost.user.fname} ${featuredPost.user.lname}` : featuredPost.user.username || 'Editorial Team') : 'Editorial Team'}
                        </p>
                        <p className="text-xs text-slate-500">Senior Writer</p>
                      </div>
                    </div>
                    <a
                      href={`/blog/${featuredPost?.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] text-white text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-slate-100 rounded-2xl h-56 mb-4"></div>
                <div className="h-5 bg-slate-100 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
              <Search className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Error loading articles
            </h3>
            <p className="text-slate-500 mb-4">
              {error}
            </p>
            <button
              onClick={() => fetchBlogs(1, true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] text-white text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[rgb(65,135,249)]/10 to-[#ec4899]/10 mb-6">
              <Search className="h-8 w-8 text-[rgb(65,135,249)]" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No articles found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[rgb(65,135,249)] to-[#ec4899] text-white font-medium shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Loading more articles...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Articles</span>
                      <ChevronRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Show current count */}
            {!loadingMore && blogs.length > 0 && (
              <p className="text-center text-slate-500 text-sm mt-6">
                Showing {blogs.length} articles{hasMore ? ' (more available)' : ''}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}