import ProductSkeleton from './ProductSkeleton';

const ProductSkeletonGrid = ({ showCart }) => {
  // Calculate number of skeleton items based on screen size
  const getSkeletonCount = () => {
    if (typeof window !== 'undefined') {
      if (showCart) {
        if (window.innerWidth < 640) return 4;
        if (window.innerWidth < 1280) return 6;
        return 9;
      } else {
        if (window.innerWidth < 640) return 4;
        if (window.innerWidth < 1024) return 6;
        if (window.innerWidth < 1280) return 8;
        return 12;
      }
    }
    return 8;
  };

  const [skeletonCount, setSkeletonCount] = useState(getSkeletonCount());

  useEffect(() => {
    const handleResize = () => {
      setSkeletonCount(getSkeletonCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showCart]);

  return (
    <div className={`grid gap-6 ${
      showCart
        ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

// Add missing imports
import { useState, useEffect } from 'react';

export default ProductSkeletonGrid;