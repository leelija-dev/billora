"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Product templates
const productTemplates = [
  { baseName: "Basket", category: "Software", price: 1999, img: "basket" },
  { baseName: "Headphones", category: "Electronics", price: 2999, img: "headphones" },
  { baseName: "Laptop", category: "Electronics", price: 50000, img: "laptop2" },
  { baseName: "Smart Watch", category: "Accessories", price: 3999, img: "watch" },
  { baseName: "iPhone 14", category: "Mobile", price: 69999, img: "iphone" },
  { baseName: "Samsung S23", category: "Mobile", price: 74999, img: "samsung" },
  { baseName: "Basmati Rice", category: "Grocery", price: 499, img: "basmati" },
  { baseName: "Cooking Oil", category: "Grocery", price: 180, img: "oil" },
  { baseName: "Green Tea", category: "Grocery", price: 499, img: "grrentea" },
  { baseName: "Casual Shirt", category: "Fashion", price: 749, img: "shirt" },
  { baseName: "Mini Dress", category: "Fashion", price: 999, img: "minidress" },
  { baseName: "Maxi Dress", category: "Fashion", price: 1299, img: "dress" },
  { baseName: "Wireless Mouse", category: "Electronics", price: 999, img: "mouse" },
  { baseName: "Keyboard", category: "Electronics", price: 1499, img: "keyboard" },
  { baseName: "Monitor", category: "Electronics", price: 15999, img: "monitor" },
  { baseName: "Backpack", category: "Accessories", price: 1999, img: "bag" },
  { baseName: "Sunglasses", category: "Accessories", price: 1499, img: "sunglasses" },
  { baseName: "Running Shoes", category: "Fashion", price: 2999, img: "shoes" },
  { baseName: "Coffee Maker", category: "Home", price: 3999, img: "coffee" },
  { baseName: "Blender", category: "Home", price: 2499, img: "blender" },
  { baseName: "Face Cream", category: "Beauty", price: 599, img: "cream" },
  { baseName: "Perfume", category: "Beauty", price: 1299, img: "perfume" },
  { baseName: "Yoga Mat", category: "Fitness", price: 899, img: "yoga" },
  { baseName: "Water Bottle", category: "Fitness", price: 399, img: "bottle" }
];

// Generate 240 products
const generateProducts = () => {
  const products = [];
  let id = 1;

  // Repeat 10 times to get 240 products
  for (let variation = 0; variation < 10; variation++) {
    productTemplates.forEach((template) => {
      // Add some variation to price for realism
      const priceVariation = Math.floor(Math.random() * 500) - 250;
      const finalPrice = Math.max(99, template.price + priceVariation);
      
      products.push({
        id: id++,
        title: variation === 0 ? template.baseName : `${template.baseName} ${String.fromCharCode(65 + variation)}`,
        price: finalPrice,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
        img: `/image/${template.img}.png`,
        category: template.category,
        description: `High quality ${template.category.toLowerCase()} product for daily use.`,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0,
        inStock: Math.random() > 0.15,
        brand: ["Apple", "Samsung", "Sony", "LG", "Nike", "Adidas", "Puma", "Local"][Math.floor(Math.random() * 8)]
      });
    });
  }

  return products;
};

const ALL_PRODUCTS = generateProducts(); // 240 products!
const categories = ["All", ...new Set(ALL_PRODUCTS.map(p => p.category))];
const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(75000);
  const [rating, setRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Loading states
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteredCount, setFilteredCount] = useState(0);
  
  const observerRef = useRef();
  const lastProductRef = useRef();

  // Filter products
  const getFilteredProducts = useCallback(() => {
    return ALL_PRODUCTS.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= rating;
      const matchesStock = !inStockOnly || p.inStock;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });
  }, [search, category, maxPrice, rating, inStockOnly]);

  // Sort products
  const getSortedProducts = useCallback((productsToSort) => {
    const sorted = [...productsToSort];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [sort]);

  // Load initial products
  useEffect(() => {
    setInitialLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const filtered = getFilteredProducts();
      const sorted = getSortedProducts(filtered);
      setFilteredCount(sorted.length);
      
      setDisplayedProducts(sorted.slice(0, PRODUCTS_PER_PAGE));
      setPage(1);
      setHasMore(sorted.length > PRODUCTS_PER_PAGE);
      setInitialLoading(false);
    }, 1000);
  }, [search, category, maxPrice, rating, sort, inStockOnly, getFilteredProducts, getSortedProducts]);

  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = getFilteredProducts();
      const sorted = getSortedProducts(filtered);
      
      const nextPage = page + 1;
      const start = nextPage * PRODUCTS_PER_PAGE;
      const end = start + PRODUCTS_PER_PAGE;
      const newProducts = sorted.slice(start, end);
      
      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(end < sorted.length);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 800);
  }, [loading, hasMore, page, getFilteredProducts, getSortedProducts]);

  // Intersection Observer
  useEffect(() => {
    if (loading || initialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => observer.disconnect();
  }, [loading, initialLoading, hasMore, loadMoreProducts]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen px-4 sm:px-6 md:px-12 lg:px-20 py-12">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Explore Products
        </h1>
        
        {!initialLoading && (
          <p className="text-center text-gray-600 mb-6">
            Showing {displayedProducts.length} of {filteredCount} products
          </p>
        )}

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Filters */}
          <div className="bg-white p-5 rounded-xl shadow space-y-6 lg:sticky lg:top-24 h-fit">
            <h2 className="text-lg font-bold">Filters</h2>

            {/* Category */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {cat} ({ALL_PRODUCTS.filter(p => cat === "All" || p.category === cat).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold mb-2">Max Price: ₹{maxPrice}</h3>
              <input
                type="range"
                min="0"
                max="75000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* In Stock Only */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="inStock" className="text-sm font-medium">
                In Stock Only
              </label>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-2">Sort By</h3>
              <select
                onChange={(e) => setSort(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Default</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold mb-2">Minimum Rating</h3>
              {[5, 4, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={`block w-full text-left px-3 py-2 rounded mb-1 ${
                    rating === r ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {"⭐".repeat(r)} & up
                </button>
              ))}
              {rating > 0 && (
                <button
                  onClick={() => setRating(0)}
                  className="text-sm text-blue-600 mt-2"
                >
                  Clear rating
                </button>
              )}
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxPrice(75000);
                setRating(0);
                setSort("");
                setInStockOnly(false);
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Reset All Filters
            </button>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {initialLoading ? (
              // Initial loading message
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Hang on, loading content...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {displayedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      ref={index === displayedProducts.length - 1 ? lastProductRef : null}
                      onClick={() => openProduct(product)}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 cursor-pointer hover:-translate-y-1 relative group"
                    >
                      <div className="relative h-40 mb-4">
                        <Image
                          src={product.img}
                          alt={product.title}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            e.target.src = "/image/placeholder.png";
                          }}
                        />
                      </div>
                      
                      {/* Wishlist */}
                      <div className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl">
                        ❤️
                      </div>
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                      
                      {/* Stock Status */}
                      {!product.inStock && (
                        <div className="absolute bottom-20 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <h2 className="font-bold text-lg">{product.title}</h2>
                      <p className="text-yellow-500 text-sm">
                        {"⭐".repeat(product.rating)}
                      </p>
                      <p className="text-xl font-bold text-blue-600 mt-2">
                        ₹{product.price}
                      </p>
                      <p className="text-xs text-green-600 mt-1">Free Delivery</p>

                      <Link
                        href="/contact"
                        className="block text-center bg-blue-600 mt-3 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Buy Now
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Loading More Message */}
                {loading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-500">Loading more products...</p>
                    </div>
                  </div>
                )}

                {/* End Message */}
                {!hasMore && displayedProducts.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">🎉 You've reached the end!</p>
                  </div>
                )}

                {/* No Products Found */}
                {displayedProducts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No products found</p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setCategory("All");
                        setMaxPrice(75000);
                        setRating(0);
                        setSort("");
                        setInStockOnly(false);
                      }}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-50 bg-white/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md active:scale-95 hover:bg-gray-100"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Image */}
              <div className="relative h-52 sm:h-64 md:h-80">
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Details */}
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  {selectedProduct.title}
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mb-1">
                  {selectedProduct.category} • {selectedProduct.brand}
                </p>
                <p className="text-yellow-500 text-sm sm:text-base mb-2">
                  {"⭐".repeat(selectedProduct.rating)}
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-3">
                  ₹{selectedProduct.price}
                </p>
                {selectedProduct.discount > 0 && (
                  <p className="text-green-600 font-semibold mb-2">
                    {selectedProduct.discount}% OFF
                  </p>
                )}
                <p className="text-gray-600 text-sm sm:text-base mb-5">
                  {selectedProduct.description}
                </p>
                <p className={`text-sm mb-4 ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedProduct.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                  <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}