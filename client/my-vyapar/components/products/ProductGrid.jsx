import ProductCard from './ProductCard';
import ProductSkeletonGrid from './ProductSkeletonGrid';
import { useProductsStore } from '../../store/productsStore';

const ProductGrid = ({ 
  products, 
  cartQuantities, 
  selectedItems, 
  onAddToCart, 
  onBuyNow, 
  onUpdateQuantity,
  onSelect,
  onImageClick,
  expandedDescriptions,
  onToggleDescription,
  showCart,
  isLoading,
  error,
  onRetry
}) => {
  // Subscribe to store to get real-time updates
  const { loading: storeLoading, products: storeProducts } = useProductsStore();
  
  // Use store state directly
  const currentLoading = isLoading !== undefined ? isLoading : storeLoading;
  const currentProducts = products || storeProducts;
  
  // Debug logging
  console.log(" ProductGrid render:", { 
    isLoading: currentLoading, 
    productsLength: currentProducts?.length || 0, 
    error,
    productsArray: Array.isArray(currentProducts),
    storeLoading,
    storeProductsLength: storeProducts?.length || 0
  });

  // Show skeleton loading while products are being fetched
  if (currentLoading) {
    console.log(" Showing skeleton - loading is true");
    return <ProductSkeletonGrid showCart={showCart} />;
  }

  // Show products when loading is false and products exist
  if (!currentLoading && currentProducts && currentProducts.length > 0) {
    console.log(" Showing products - loading is false, products exist:", currentProducts.length);
    // Continue to product rendering logic below
  } else if (!currentLoading && (!currentProducts || currentProducts.length === 0)) {
    console.log(" Showing empty state - loading is false and no products");
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-500 text-lg mb-2">Failed to load products</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  // Show empty state when no products found
  // Show actual products when loaded
  return (
    <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
      {currentProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={cartQuantities[product.id] || 0}
          isSelected={selectedItems.has(product.id)}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
          onUpdateQuantity={onUpdateQuantity}
          onSelect={onSelect}
          onImageClick={onImageClick}
          onToggleDescription={onToggleDescription}
          isExpanded={expandedDescriptions[product.id]}
        />
      ))}
    </div>
  );
};

export default ProductGrid;