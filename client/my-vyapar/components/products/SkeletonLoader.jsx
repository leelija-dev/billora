import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      {/* Skeleton for category tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex-shrink-0">
            <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Skeleton for filters bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Skeleton for product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Image skeleton */}
            <div className="relative pt-[100%] bg-gray-200"></div>
            
            {/* Content skeleton */}
            <div className="p-4">
              {/* Title skeleton */}
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              
              {/* Rating skeleton */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-4 h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              
              {/* Price skeleton */}
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              
              {/* Buttons skeleton */}
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton for pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;