const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="bg-gray-200 h-48 flex items-center justify-center relative">
        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        {/* Discount badge skeleton */}
        <div className="absolute top-3 left-3 w-16 h-6 bg-gray-300 rounded-md"></div>
        {/* Checkbox skeleton */}
        <div className="absolute top-3 right-3 w-5 h-5 bg-gray-300 rounded"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Category skeleton */}
        <div className="flex items-center gap-1 mb-3">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-baseline gap-2 mb-3">
          <div className="h-7 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Stock status skeleton */}
        <div className="flex items-center gap-1 mb-3">
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;