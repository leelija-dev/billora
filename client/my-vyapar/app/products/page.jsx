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

  // Get quantity of a product in cart
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
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
                  {displayedProducts.map((product, index) => {
                    const quantity = getProductQuantity(product.id);
                    
                    return (
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
                        
                        <div className="flex flex-col gap-3 w-full mt-3">
                          {product.inStock ? (
                            quantity === 0 ? (
                              /* Add to Cart button when not in cart */
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product);
                                }}
                                className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              /* Quantity controls when in cart */
                              <div className="flex items-center justify-between w-full border rounded-lg overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product.id, quantity - 1);
                                  }}
                                  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition"
                                >
                                  −
                                </button>
                                <span className="flex-1 text-center font-semibold text-lg">
                                  {quantity}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(product.id, quantity + 1);
                                  }}
                                  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition"
                                >
                                  +
                                </button>
                              </div>
                            )
                          ) : (
                            /* Out of stock state */
                            <button
                              disabled
                              className="w-full py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                            >
                              Out of Stock
                            </button>
                          )}
                          
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            disabled={!product.inStock}
                            className={`w-full py-3 rounded-lg transition ${
                              product.inStock
                                ? "bg-purple-600 text-white hover:bg-purple-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
                  {selectedProduct.inStock ? (
                    getProductQuantity(selectedProduct.id) === 0 ? (
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeModal();
                        }}
                        className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-between border rounded-lg overflow-hidden">
                        <button
                          onClick={() => {
                            updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) - 1);
                          }}
                          className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition"
                        >
                          −
                        </button>
                        <span className="flex-1 text-center font-semibold text-lg">
                          {getProductQuantity(selectedProduct.id)}
                        </span>
                        <button
                          onClick={() => {
                            updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) + 1);
                          }}
                          className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                  
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
    {/* Cart Sidebar - Premium Design */}
{/* Cart Sidebar - Premium Design */}
{/* Cart Sidebar - Premium Design */}
<div
  className={`fixed top-0 right-0 h-full w-135 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
    showCart ? "translate-x-0" : "translate-x-full"
  }`}
>
  {/* Header with Gradient - Fixed Height */}
  <div className="relative p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex-shrink-0 min-h-[120px]">
    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-8 -mt-8"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
    
    <div className="flex justify-between items-start relative">
      <h2 className="text-xl font-bold flex items-center gap-3">
        <span className="text-2xl">🛍️</span>
        <span>
          {showCheckout ? 'Secure Checkout' : (
            <>
              Your Cart
              <span className="ml-2 text-sm bg-white/30 px-3 py-1 rounded-full">
                {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
              </span>
            </>
          )}
        </span>
      </h2>
      <button 
        onClick={() => {
          setShowCart(false);
          setShowCheckout(false);
        }}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm text-white hover:scale-110 flex-shrink-0"
      >
        <span className="text-xl">✕</span>
      </button>
    </div>
    
    {/* Progress Indicator for Checkout - Fixed Positioning */}
    {/* {showCheckout && (
      <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 w-fit">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-white/80">Step 1</span>
          <span className="text-white/40">→</span>
          <span className="text-xs font-medium text-white">Step 2</span>
        </div>
        <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden ml-2">
          <div className="w-1/2 h-full bg-white rounded-full"></div>
        </div>
      </div>
    )} */}
  </div>

  {/* Content Area with Adjusted Height */}
  <div 
    className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    style={{ height: showCheckout ? 'calc(100vh - 180px)' : 'calc(100vh - 140px)' }}
  >
    <div className="p-6 space-y-4">
      {!showCheckout ? (
        /* Cart Items View - Premium Design */
        <>
          {/* Back Button - ONLY in Cart View (NOT in Checkout) */}
         <button
  onClick={() => {
    backToCart();
    setShowCart(false); // This will close the cart sidebar
  }}
  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group mb-2"
>
  <span className="text-xl group-hover:-translate-x-1 transition-transform">x</span>
  {/* <span className="font-medium">Back</span> */}
</button>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-32 h-32 mb-6 opacity-50">
                <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-3 font-medium">Your cart feels lonely</p>
              <p className="text-gray-400 text-sm mb-6 text-center">Add some amazing products to make it happy!</p>
              <button
                onClick={() => setShowCart(false)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div 
                key={item.id} 
                className="flex gap-4 items-start bg-gray-50/80 backdrop-blur-sm rounded-xl p-3 hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Image with Premium Border */}
                <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-contain p-2"
                    onError={handleImageError}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">₹{item.price}</span> each
                  </p>
                  
                  {/* Premium Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all hover:shadow-sm flex-shrink-0"
                    >
                      <span className="text-lg font-medium">−</span>
                    </button>
                    <span className="text-sm font-semibold w-8 text-center text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all hover:shadow-sm flex-shrink-0"
                    >
                      <span className="text-lg font-medium">+</span>
                    </button>
                  </div>
                </div>

                {/* Price and Remove */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-indigo-600">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-2 flex items-center gap-1"
                  >
                    <span className="text-sm">🗑️</span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        /* Checkout Page - Premium Design Only (Form unchanged) */
        <div className="space-y-6 pb-4">
          {/* NO BACK BUTTON HERE - Only in Cart View */}

          {/* Order Summary Card - Premium with Fixed Height and Scroll if needed */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-600 rounded-full"></span>
              Order Summary
            </h3>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm items-center">
                  <span className="text-gray-600 truncate max-w-[180px]">
                    {item.title} <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-800 flex-shrink-0 ml-2">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-indigo-100 mt-4 pt-4 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Amount</span>
              <span className="text-xl font-bold text-indigo-600">₹{getCartTotal()}</span>
            </div>
          </div>

          {/* Delivery Information Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600">📦</span>
            </div>
            <h3 className="font-semibold text-gray-800">Delivery Information</h3>
          </div>

          {/* Original Form - Kept Exactly as Before */}
          <form onSubmit={handlePlaceOrder} className="space-y-4">
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
        </div>
      )}
    </div>
  </div>

  {/* Footer - Fixed at bottom */}
  <div className="p-4 border-t bg-gray-50 absolute bottom-0 w-full flex-shrink-0">
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
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
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition font-medium"
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg font-medium"
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