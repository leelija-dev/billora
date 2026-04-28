import ProductCard from './ProductCard';

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
  showCart 
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      showCart
        ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {products.map((product) => (
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