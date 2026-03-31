"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav2 from "@/components/Nav2";
import Footer from "@/components/Footer";
// import { getProducts, getCategories, placeOrder } from "@/services/productService";

export default function ProductsPage() {
  const [ALL_PRODUCTS, setAllProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  
  const PRODUCTS_PER_PAGE = 12;

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        setAllProducts(productsData);
        setCategories(["All", ...categoriesData]);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    setPopupMessage(`${product.title} added to cart!`);
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setPopupMessage("Item removed from cart");
    setPopup(true);
    setTimeout(() => setPopup(false), 1500);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getCartItemCount = () => cart.reduce((count, item) => count + item.quantity, 0);
  const getProductQuantity = (productId) => cart.find(item => item.id === productId)?.quantity || 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setPopupMessage("Please fill all fields!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    setSubmittingOrder(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          category: item.category
        })),
        total: getCartTotal(),
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      await placeOrder(orderData);
      
      setOrderPlaced(true);
      setShowCheckout(false);
      setShowCart(false);
      setPopupMessage("🎉 Order placed successfully!");
      setPopup(true);
      setCart([]);
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
      
    } catch (error) {
      console.error("Order error:", error);
      setPopupMessage("Failed to place order. Please try again!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const backToCart = () => setShowCheckout(false);

  const getFilteredProducts = () => {
    if (!ALL_PRODUCTS.length) return [];
    
    let filtered = ALL_PRODUCTS.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= rating;
      const matchesStock = !inStockOnly || p.inStock;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });

    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const displayedProducts = filteredProducts.slice(0, currentPage * PRODUCTS_PER_PAGE);
  const hasMore = displayedProducts.length < filteredProducts.length;

  const loadMoreProducts = () => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const handleImageError = (e) => e.currentTarget.src = "/image/placeholder.png";

  if (loading) {
    return (
      <>
        <Nav2 />
        <div className="bg-slate-50 min-h-screen px-4 sm:px-6 md:px-12 lg:px-20 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading products from API...</p>
              <p className="text-gray-400 text-sm mt-2">Make sure your API server is running</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav2 />
        <div className="bg-slate-50 min-h-screen px-4 sm:px-6 md:px-12 lg:px-20 py-12">
          <div className="flex justify-center items-center py-20">
            <div className="text-center max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-2">Cannot Connect to API</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-mono text-gray-700">Make sure:</p>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                  <li>Your API server is running</li>
                  <li>The URL in .env.local is correct</li>
                  <li>You have CORS enabled on your API server</li>
                </ul>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav2 />

      <div className="fixed top-25 right-8 z-40">
        <button
          onClick={() => {
            setShowCart(true);
            setShowCheckout(false);
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
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">Explore Products</h1>
        <p className="text-center text-gray-600 mb-6">
          Showing {displayedProducts.length} of {filteredProducts.length} products
        </p>

        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6 lg:sticky lg:top-24 h-fit border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">🧰 Filters</h2>
              <button
                onClick={() => {
                  setCategory("All");
                  setRating(0);
                  setMaxPrice(100000);
                  setSort("");
                  setSearch("");
                  setInStockOnly(false);
                  setCurrentPage(1);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">📦 Category</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat, i) => {
                  const count = ALL_PRODUCTS.filter(p => cat === "All" || p.category === cat).length;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                        category === cat
                          ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                          : "bg-gray-100 hover:bg-blue-50 hover:translate-x-1"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${category === cat ? "bg-white text-blue-600" : "bg-gray-200"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">💰 Price Range</h3>
              <input
                type="range"
                min="0"
                max="100000"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-sm mt-2 text-gray-600">
                <span>₹0</span>
                <span className="font-semibold text-black">₹{maxPrice}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">🔃 Sort</h3>
              <select
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Default</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">⭐ Rating</h3>
              <div className="space-y-2">
                {[5, 4, 3].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRating(r);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center transition ${
                      rating === r ? "bg-yellow-400 text-black font-semibold" : "bg-gray-100 hover:bg-yellow-100"
                    }`}
                  >
                    <span>{"⭐".repeat(r)} & up</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {displayedProducts.map((product) => {
                const quantity = getProductQuantity(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 relative group"
                  >
                    <div onClick={() => openProduct(product)} className="cursor-pointer">
                      <div className="relative h-40 mb-4">
                        <Image src={product.img} alt={product.title} fill className="object-contain" onError={handleImageError} />
                      </div>
                      
                      <div className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl">❤️</div>
                      
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                      
                      {!product.inStock && (
                        <div className="absolute bottom-20 left-3 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                      <h2 className="font-bold text-lg">{product.title}</h2>
                      <p className="text-yellow-500 text-sm">{"⭐".repeat(product.rating)}</p>
                      <p className="text-xl font-bold text-blue-600 mt-2">₹{product.price}</p>
                      <p className="text-xs text-green-600 mt-1">Free Delivery</p>
                    </div>
                    
                    <div className="flex flex-row gap-3 w-full mt-3">
                      {product.inStock ? (
                        quantity === 0 ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <div className="flex-1 flex items-center justify-between border rounded-lg overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(product.id, quantity - 1);
                              }}
                              className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition"
                            >
                              −
                            </button>
                            <span className="flex-1 text-center font-semibold text-lg">{quantity}</span>
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
                        <button disabled className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed">
                          Out of Stock
                        </button>
                      )}
                      
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        disabled={!product.inStock}
                        className={`flex-1 py-3 rounded-lg transition ${
                          product.inStock ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="flex justify-center py-8">
                <button
                  onClick={loadMoreProducts}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Load More Products
                </button>
              </div>
            )}

            {!hasMore && displayedProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">🎉 You've reached the end!</p>
              </div>
            )}

            {displayedProducts.length === 0 && (
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
                    setCurrentPage(1);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
              <div className="relative h-52 sm:h-64 md:h-80">
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.title}
                  fill
                  className="object-contain"
                />
              </div>

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

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex-shrink-0 min-h-[120px]">
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
        </div>

        <div 
          className="overflow-y-auto"
          style={{ height: showCheckout ? 'calc(100vh - 180px)' : 'calc(100vh - 140px)' }}
        >
          <div className="p-6 space-y-4">
            {!showCheckout ? (
              <>
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
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 items-start bg-gray-50/80 rounded-xl p-3 hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                    >
                      <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                        <img 
                          src={item.img} 
                          alt={item.title}
                          className="w-full h-full object-contain p-2"
                          onError={handleImageError}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">₹{item.price}</span> each
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all"
                          >
                            <span className="text-lg font-medium">−</span>
                          </button>
                          <span className="text-sm font-semibold w-8 text-center text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all"
                          >
                            <span className="text-lg font-medium">+</span>
                          </button>
                        </div>
                      </div>

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
              <div className="space-y-6 pb-4">
                <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-600 rounded-full"></span>
                    Order Summary
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
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

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">📦</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">Delivery Information</h3>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
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

        <div className="p-4 border-t bg-gray-50 absolute bottom-0 w-full flex-shrink-0">
          {!showCheckout ? (
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
            <div className="flex gap-3">
              <button
                onClick={backToCart}
                disabled={submittingOrder}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600 transition font-medium"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={submittingOrder}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg font-medium disabled:opacity-50"
              >
                {submittingOrder ? 'Placing Order...' : `Place Order • ₹${getCartTotal()}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setShowCart(false);
            setShowCheckout(false);
          }}
        />
      )}

      {orderPlaced && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for shopping with us!</p>
            <button
              onClick={() => setOrderPlaced(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {popup && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-[9999] animate-slide-up font-medium">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>{popupMessage}</span>
          </div>
        </div>
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