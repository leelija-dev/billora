"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav2 from "@/components/Nav2";
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
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false); // Checkout inside cart
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Checkout form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod"
  });

  // Loading states
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteredCount, setFilteredCount] = useState(0);
  
  const observerRef = useRef(null);
  const lastProductRef = useRef(null);

  // Cart functions
  const addToCart = (product) => {
    // Update cart
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Show notification
    setPopupMessage(`${product.title} added to cart!`);
    setPopup(true);
    
    // Clear any existing timeout
    if (window.popupTimeout) {
      clearTimeout(window.popupTimeout);
    }
    
    // Hide notification after 2 seconds
    window.popupTimeout = setTimeout(() => {
      setPopup(false);
    }, 2000);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setPopupMessage("Item removed from cart");
    setPopup(true);
    
    if (window.popupTimeout) {
      clearTimeout(window.popupTimeout);
    }
    
    window.popupTimeout = setTimeout(() => setPopup(false), 1500);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle place order
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setPopupMessage("Please fill all fields!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    // Show order placed message
    setOrderPlaced(true);
    setShowCheckout(false);
    setShowCart(false);
    setPopupMessage("🎉 Order placed successfully!");
    setPopup(true);
    
    // Clear cart after order
    setCart([]);
    
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cod"
    });
    
    setTimeout(() => {
      setOrderPlaced(false);
      setPopup(false);
    }, 3000);
  };

  // Go back to cart from checkout
  const backToCart = () => {
    setShowCheckout(false);
  };

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
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
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

  const handleImageError = (e) => {
    e.currentTarget.src = "/image/placeholder.png";
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (window.popupTimeout) {
        clearTimeout(window.popupTimeout);
      }
    };
  }, []);

  return (
    <>
      <Nav2 />

      {/* Floating Cart Button - Click to Open Sidebar */}
      <div className="fixed top-25 right-8 z-40">
        <button
          onClick={() => {
            setShowCart(true);
            setShowCheckout(false); // Reset to cart view when opening
          }}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition relative"
        >
          🛒
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>

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
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6 lg:sticky lg:top-24 h-fit border">

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🧰 Filters
              </h2>
              <button
                onClick={() => {
                  setCategory("All");
                  setRating(0);
                  setMaxPrice(100000);
                  setSort("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset
              </button>
            </div>

            {/* CATEGORY */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                📦 Category
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                {categories.map((cat, i) => {
                  const count = ALL_PRODUCTS.filter(
                    (p) => cat === "All" || p.category === cat
                  ).length;

                  return (
                    <button
                      key={i}
                      onClick={() => setCategory(cat)}
                      className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                        category === cat
                          ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                          : "bg-gray-100 hover:bg-blue-50 hover:translate-x-1"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category === cat ? "bg-white text-blue-600" : "bg-gray-200"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRICE */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                💰 Price Range
              </h3>

              <input
                type="range"
                min="0"
                max="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between text-sm mt-2 text-gray-600">
                <span>₹0</span>
                <span className="font-semibold text-black">₹{maxPrice}</span>
              </div>
            </div>

            {/* SORT */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                🔃 Sort
              </h3>

              <select
                onChange={(e) => setSort(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Default</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
            </div>

            {/* RATING */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                ⭐ Rating
              </h3>

              <div className="space-y-2">
                {[5, 4, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRating(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition ${
                      rating === r
                        ? "bg-yellow-400 text-black font-semibold"
                        : "bg-gray-100 hover:bg-yellow-100"
                    }`}
                  >
                    <span>{"⭐".repeat(r)} & up</span>
                  </button>
                ))}
              </div>
            </div>
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
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 relative group"
                    >
                      <div 
                        onClick={() => openProduct(product)}
                        className="cursor-pointer"
                      >
                        <div className="relative h-40 mb-4">
                          <Image
                            src={product.img}
                            alt={product.title}
                            fill
                            className="object-contain"
                            onError={handleImageError}
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
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                          className={`flex-1 py-3 rounded-lg transition ${
                            product.inStock
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Add to Cart
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          disabled={!product.inStock}
                          className={`flex-1 py-3 rounded-lg transition ${
                            product.inStock
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Buy Now
                        </button>
                      </div>
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
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                    }}
                    disabled={!selectedProduct.inStock}
                    className={`flex-1 py-3 rounded-lg transition ${
                      selectedProduct.inStock
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      // Handle buy now
                      closeModal();
                    }}
                    disabled={!selectedProduct.inStock}
                    className={`flex-1 py-3 rounded-lg transition ${
                      selectedProduct.inStock
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar - WITH CHECKOUT INSIDE */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b bg-gray-50">
          <h2 className="text-lg font-bold flex items-center gap-2">
            🛒 {showCheckout ? 'Checkout' : `Your Cart (${getCartItemCount()} ${getCartItemCount() === 1 ? 'item' : 'items'})`}
          </h2>
          <button 
            onClick={() => {
              setShowCart(false);
              setShowCheckout(false); // Reset when closing
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Content - Toggle between Cart Items and Checkout Form */}
        <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          {!showCheckout ? (
            /* Cart Items View */
            <>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start border-b pb-3">
                    <img 
                      src={item.img} 
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-gray-50 rounded"
                      onError={handleImageError}
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-500">₹{item.price} each</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">₹{item.price * item.quantity}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            /* Checkout Form View - Inside Cart */
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-3">Order Summary</h3>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span>{item.title} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t mt-3 pt-3 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{getCartTotal()}</span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="9876543210"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="123 Main St, Apartment 4B"
                  required
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="400001"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="flex-1">Cash on Delivery (COD)</span>
                    <span className="text-green-600 text-sm">✓ Pay when you receive</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                      className="w-4 h-4"
                    />
                    <span className="flex-1">Online Payment</span>
                    <span className="text-gray-500 text-sm">Coming soon</span>
                  </label>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer - Changes based on view */}
        <div className="p-4 border-t bg-gray-50 absolute bottom-0 w-full">
          {!showCheckout ? (
            /* Cart Footer */
            cart.length > 0 && (
              <>
                <div className="flex justify-between mb-3">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-bold text-lg">₹{getCartTotal()}</span>
                </div>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  Proceed to Checkout
                </button>
              </>
            )
          ) : (
            /* Checkout Footer */
            <div className="flex gap-3">
              <button
                onClick={backToCart}
                className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-100 transition"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Place Order • ₹{getCartTotal()}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for shopping with us. Your order will be delivered soon.</p>
            <button
              onClick={() => setOrderPlaced(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Simple Popup Notification */}
      {popup && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-[9999] animate-slide-up font-medium">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>{popupMessage}</span>
          </div>
        </div>
      )}

      {/* Overlay when cart is open */}
      {showCart && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setShowCart(false);
            setShowCheckout(false);
          }}
        />
      )}

      <Footer />

      <style jsx>{`
        @keyframes slide-up {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          10% { 
            opacity: 1; 
            transform: translateY(0); 
          }
          90% { 
            opacity: 1; 
            transform: translateY(0); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
        }
        .animate-slide-up {
          animation: slide-up 2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}