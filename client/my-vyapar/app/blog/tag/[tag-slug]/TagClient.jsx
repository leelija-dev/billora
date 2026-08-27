// app/blog/tag/[tag-slug]/TagClient.js
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tag, ArrowLeft, Clock, Eye, Hash, Grid, List, BookOpen } from 'lucide-react';
import Link from 'next/link';
import BlogCard from '@/components/blog/BlogCard';
import { blogApi } from '@/services/blogApi';

export default function TagClient({ initialData, tagSlug }) {
  const [blogs, setBlogs] = useState(initialData?.blogs?.data || []);
  const [loading, setLoading] = useState(!initialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.blogs?.current_page || 1);
  const [hasMore, setHasMore] = useState(() => {
    if (initialData?.blogs) {
      return initialData.blogs.current_page < initialData.blogs.last_page;
    }
    return true;
  });
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const initialFetchDone = useRef(false);
  const [viewMode, setViewMode] = useState('grid');

  const fetchBlogsByTag = useCallback(async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await blogApi.getBlogsByTag(tagSlug, { page });
      const data = response.data;

      if (data.status) {
        const blogData = data.blogs?.data || [];

        if (reset) {
          setBlogs(blogData);
        } else {
          setBlogs(prev => [...prev, ...blogData]);
        }

        setHasMore(data.blogs?.current_page < data.blogs?.last_page);
        setCurrentPage(data.blogs?.current_page || page);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs by tag:', error);
      setError(error.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsInitialLoad(false);
    }
  }, [tagSlug]);

  // Initial data handling
  useEffect(() => {
    if (initialData && !initialFetchDone.current) {
      initialFetchDone.current = true;
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [initialData]);

  // Initial fetch if no initial data
  useEffect(() => {
    if (!initialData && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchBlogsByTag(1, true);
    }
  }, [initialData, fetchBlogsByTag]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBlogsByTag(currentPage + 1, false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Loading skeleton
  if (loading && !initialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="container  mx-auto">
            <div className="h-10 bg-gradient-to-r from-slate-200 to-indigo-200 rounded-lg w-64 mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xll:grid-cols-4 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gradient-to-br from-slate-100 to-indigo-50/50 rounded-2xl h-64 overflow-hidden border border-slate-200/50">
                    <div className="h-48 bg-gradient-to-r from-slate-200 to-indigo-200"></div>
                    <div className="p-5">
                      <div className="h-4 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
                      <div className="h-3 bg-slate-100 rounded-lg w-full mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded-lg w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="container  mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex items-center">
  <Link
    href="/blog"
    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4 group"
  >
    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
    Back to Blog
  </Link>

  <div className="ml-auto flex items-center gap-2">
    <button
      onClick={() => setViewMode("grid")}
      className={`p-2 rounded-lg transition-all duration-300 ${
        viewMode === "grid"
          ? "bg-indigo-100 text-indigo-600 shadow-sm"
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Grid className="h-5 w-5" />
    </button>

    <button
      onClick={() => setViewMode("list")}
      className={`p-2 rounded-lg transition-all duration-300 ${
        viewMode === "list"
          ? "bg-indigo-100 text-indigo-600 shadow-sm"
          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
      }`}
    >
      <List className="h-5 w-5" />
    </button>
  </div>
</div>

          {/* Blog Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xll:grid-cols-4 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gradient-to-br from-slate-100 to-indigo-50/50 rounded-2xl h-64 overflow-hidden border border-slate-200/50">
                    <div className="h-48 bg-gradient-to-r from-slate-200 to-indigo-200"></div>
                    <div className="p-5">
                      <div className="h-4 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
                      <div className="h-3 bg-slate-100 rounded-lg w-full mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded-lg w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/50 shadow-lg">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 mb-6">
                <Tag className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                Oops! Something went wrong
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {error || 'Failed to load articles. Please try again.'}
              </p>
              <button
                onClick={() => fetchBlogsByTag(1, true)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/50 shadow-lg">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-600/10 mb-6">
                <BookOpen className="h-12 w-12 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                No articles found
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                There are no articles tagged with <span className="text-indigo-600 font-medium">#{tagSlug}</span> yet.
                Check back later or explore other topics.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse All Articles
              </Link>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xll:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} viewMode={viewMode} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <span>Load More Articles</span>
                        <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}