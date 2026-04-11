'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getAuthData } from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  
  // Bulk selection states
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateProductsList, setDuplicateProductsList] = useState([]);
  const [pendingBulkProducts, setPendingBulkProducts] = useState([]);

  // Simplified form data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: ""
  });

  const lastProductRef = useRef(null);
  const PRODUCTS_PER_PAGE = 12;

  const toTitleCase = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const cleanText = (text) => {
    if (!text || typeof text !== 'string') return '';
    const trimmed = text.trim();
    return trimmed.length === 0 ? '' : trimmed;
  };

  // ========== CALCULATION FUNCTIONS ==========
  // Calculate final price for a single product (including discount and GST)
  const calculateProductFinalPrice = (product) => {
    const sellingPrice = product.selling_price || product.price;
    const discountPercent = product.discount_percentage || 0;
    const gstPercent = product.gst_percentage || 0;
    
    const discountAmount = (sellingPrice * discountPercent) / 100;
    const priceAfterDiscount = sellingPrice - discountAmount;
    const gstAmount = (priceAfterDiscount * gstPercent) / 100;
    const finalPrice = priceAfterDiscount + gstAmount;
    
    return finalPrice;
  };

  // Get cart total with discount and GST applied
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const finalPrice = calculateProductFinalPrice(item);
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  // Get cart subtotal (without discount and GST)
  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + ((item.selling_price || item.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // ✅ ADD THIS - Get total GST amount
  const getTotalGst = () => {
    return cart.reduce((total, item) => {
      const sellingPrice = item.selling_price || item.price;
      const discountPercent = item.discount_percentage || 0;
      const gstPercent = item.gst_percentage || 0;
      
      const discountAmount = (sellingPrice * discountPercent) / 100;
      const priceAfterDiscount = sellingPrice - discountAmount;
      const gstAmount = (priceAfterDiscount * gstPercent) / 100;
      
      return total + (gstAmount * item.quantity);
    }, 0);
  };

  // ✅ ADD THIS - Get total discount amount
  const getTotalDiscountAmount = () => {
    return cart.reduce((total, item) => {
      const sellingPrice = item.selling_price || item.price;
      const discountPercent = item.discount_percentage || 0;
      const discountAmount = (sellingPrice * discountPercent) / 100;
      return total + (discountAmount * item.quantity);
    }, 0);
  };

  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // ========== LOAD CASHFREE SDK ==========
  useEffect(() => {
    if (!document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ========== HANDLE ORDER FUNCTION ==========
  const handleOrder = async (orderData) => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch('http://localhost:8000/api/orders/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(orderData)
      });
      
      const res = await response.json();
      console.log("Order response:", res);
      
      if (res.payment_mode === 'online') {
        const waitForCashfree = setInterval(() => {
          if (window.Cashfree) {
            clearInterval(waitForCashfree);
            const cashfree = new Cashfree({
              mode: "sandbox"
            });
            
            cashfree.checkout({
              paymentSessionId: res.payment_session_id,
              redirectTarget: "_self"
            });
          }
        }, 100);
      } else {
        toast.success(res.message || 'Order placed successfully!');
        
        const orderInfo = {
          orderId: res.order_id || `ORD${Date.now()}`,
          totalAmount: getCartTotal(),
          items: cart.length,
          timestamp: Date.now()
        };
        localStorage.setItem('pendingProductOrder', JSON.stringify(orderInfo));
        
        setCart([]);
        sessionStorage.removeItem('cart');
        setShowCart(false);
        setShowCheckout(false);
        setFormData({ fullName: "", phone: "" });
        
        router.push('/order-success');
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
    }
  };

  // ========== SESSION STORAGE FOR CART PERSISTENCE ==========
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          console.log("Cart loaded from sessionStorage:", parsedCart);
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cart.length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
      } else {
        sessionStorage.removeItem('cart');
      }
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelectedItems = sessionStorage.getItem('selectedItems');
      if (savedSelectedItems) {
        try {
          const parsedSelectedItems = JSON.parse(savedSelectedItems);
          setSelectedItems(new Set(parsedSelectedItems));
        } catch (error) {
          console.error("Error loading selected items:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedItems.size > 0) {
        sessionStorage.setItem('selectedItems', JSON.stringify(Array.from(selectedItems)));
      } else {
        sessionStorage.removeItem('selectedItems');
      }
    }
  }, [selectedItems]);

  // ========== CART FUNCTIONS ==========
  const addToCart = (product, quantityToAdd = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prev, {
        ...product,
        quantity: quantityToAdd,
        title: product.name,
        price: product.selling_price || product.price,
        selling_price: product.selling_price || product.price,
        unit_id: product.unit_id || 1,
        stock_id: product.id,
        discount_percentage: product.discount_percentage || 0,
        gst_percentage: product.gst_percentage || 0,
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setPopupMessage("Item removed from cart");
    setPopup(true);
    setTimeout(() => setPopup(false), 1500);
  };

  const clearAllCart = () => {
    setCart([]);
    setPopupMessage("Cart cleared successfully!");
    setPopup(true);
    setTimeout(() => setPopup(false), 1500);
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

  // ========== SINGLE PRODUCT DIRECT CHECKOUT ==========
  const handleBuyNow = (product) => {
    if (!product.inStock) {
      setPopupMessage("Product is out of stock!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    setCart([{
      ...product,
      quantity: 1,
      title: product.name,
      price: product.selling_price || product.price,
      selling_price: product.selling_price || product.price,
      unit_id: product.unit_id || 1,
      stock_id: product.id,
      discount_percentage: product.discount_percentage || 0,
      gst_percentage: product.gst_percentage || 0,
    }]);
    
    setShowCart(true);
    setShowCheckout(true);
  };

  // ========== BULK SELECTION FUNCTIONS ==========
  const toggleSelectItem = (productId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
    setPopupMessage("Selection cleared");
    setPopup(true);
    setTimeout(() => setPopup(false), 1500);
  };

  const handleBulkAddToCart = () => {
    const selectedProductsList = Array.from(selectedItems)
      .map(id => products.find(p => p.id === id))
      .filter(p => p && p.inStock);
    
    if (selectedProductsList.length === 0) {
      setPopupMessage("No products selected or selected products are out of stock");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    const duplicates = [];
    const newProducts = [];
    
    selectedProductsList.forEach(product => {
      const existingInCart = cart.find(item => item.id === product.id);
      if (existingInCart) {
        duplicates.push(product);
      } else {
        newProducts.push(product);
      }
    });

    if (duplicates.length > 0) {
      setDuplicateProductsList(duplicates);
      setPendingBulkProducts(newProducts);
      setShowDuplicateDialog(true);
    } else {
      selectedProductsList.forEach(product => {
        addToCart(product, 1);
      });
      setPopupMessage(`${selectedProductsList.length} item(s) added to cart!`);
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      setSelectedItems(new Set());
    }
  };

  const handleDuplicateDecision = (addToExisting) => {
    if (addToExisting) {
      duplicateProductsList.forEach(product => {
        addToCart(product, 1);
      });
    }
    
    pendingBulkProducts.forEach(product => {
      addToCart(product, 1);
    });
    
    const totalAdded = duplicateProductsList.length + pendingBulkProducts.length;
    setPopupMessage(`${totalAdded} item(s) added to cart!`);
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
    
    setSelectedItems(new Set());
    setShowDuplicateDialog(false);
    setDuplicateProductsList([]);
    setPendingBulkProducts([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ========== HANDLE PLACE ORDER ==========
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone) {
      setPopupMessage("Please fill all fields!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    if (cart.length === 0) {
      setPopupMessage("Your cart is empty!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setPopupMessage("Please enter a valid 10-digit phone number");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    const { user } = getAuthData();
    
    if (!user || !user.id) {
      setPopupMessage("Please login to place order");
      setPopup(true);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setIsPlacingOrder(true);
    const loadingToast = toast.loading('Processing...');

    try {
      const storeId = user.store_id || user.store?.id || 1;
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      const orderData = {
        user_id: user.id,
        store_id: storeId,
        customer_name: formData.fullName.trim(),
        customer_phone: cleanPhone,
        product_id: cart.map(item => item.id),
        quantity: cart.map(item => item.quantity),
        unit_id: cart.map(item => item.unit_id || 1),
        payment_mode: paymentMethod,
        total_amount: getCartTotal(),
        total_items: totalItems
      };
      
      console.log("📤 Sending order with calculated total:", getCartTotal());
      
      await handleOrder(orderData);
      
      toast.dismiss(loadingToast);
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('❌ Order error:', error);
      setPopupMessage(error.message || 'Failed to place order. Please try again.');
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ========== FETCH PRODUCTS ==========
  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const { user } = getAuthData();
      if (!user || !user.id) {
        router.push('/login');
        return;
      }
      
      const response = await fetch(`http://localhost:8000/api/restaurant-all-products/${user.id}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
      const productsData = await response.json();
      
      let productsArray = [];
      if (productsData?.products?.data) {
        productsArray = productsData.products.data;
      } else if (Array.isArray(productsData)) {
        productsArray = productsData;
      } else if (productsData?.data) {
        productsArray = productsData.data;
      }
      
      const transformedProducts = productsArray.map(product => ({
        id: product.id,
        name: product.name || "Unnamed Product",
        selling_price: parseFloat(product.selling_price) || 0,
        price: parseFloat(product.selling_price) || 0,
        category: product.category?.name || "General",
        brand: product.brand?.name || "Unknown",
        unit: product.unit?.name || "Piece",
        unit_id: product.unit_id || 1,
        inStock: product.is_active === 1 || product.is_active === true,
        discount_percentage: parseFloat(product.discount_percentage) || 0,
        gst_percentage: parseFloat(product.gst_percentage) || 0,
        description: product.description || "",
        img: product.image || "/image/placeholder.png",
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== GET UNIQUE CATEGORIES ==========
  const getCategories = useCallback(() => {
    const cats = products.map(p => p.category || "General");
    return ["All", ...new Set(cats)];
  }, [products]);

  const categories = getCategories();

  // ========== FILTER AND SORT PRODUCTS ==========
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category);
    }

    filtered = filtered.filter(p => (p.selling_price || p.price) <= maxPrice);

    if (sort === "low") {
      filtered.sort((a, b) => (a.selling_price || a.price) - (b.selling_price || b.price));
    } else if (sort === "high") {
      filtered.sort((a, b) => (b.selling_price || b.price) - (a.selling_price || a.price));
    }

    setFilteredCount(filtered.length);
    return filtered;
  }, [products, search, category, maxPrice, sort]);

  // ========== LOAD PRODUCTS ON MOUNT ==========
  useEffect(() => {
    fetchProductsData();
  }, []);

  // ========== UPDATE DISPLAYED PRODUCTS ==========
  useEffect(() => {
    if (products.length > 0) {
      const filtered = applyFiltersAndSort();
      setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
      setPage(1);
      setHasMore(filtered.length > PRODUCTS_PER_PAGE);
    }
  }, [products, search, category, maxPrice, sort, applyFiltersAndSort]);

  // ========== INFINITE SCROLL ==========
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const filtered = applyFiltersAndSort();
      const nextPage = page + 1;
      const start = nextPage * PRODUCTS_PER_PAGE;
      const end = start + PRODUCTS_PER_PAGE;
      const newProducts = filtered.slice(start, end);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(end < filtered.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 500);
  }, [loadingMore, hasMore, page, applyFiltersAndSort]);

  useEffect(() => {
    if (loading || products.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, loadingMore, loadMoreProducts, products.length]);

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

  const clearSearch = () => {
    setSearch("");
  };

  const visibleSelectedCount = displayedProducts.filter(p => selectedItems.has(p.id)).length;
  const crossCategoryCount = selectedItems.size - visibleSelectedCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />

      {/* Floating Action Buttons */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-3">
        {selectedItems.size > 0 && (
          <button
            onClick={handleBulkAddToCart}
            className="bg-green-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
          >
            📦 Bulk Cart ({selectedItems.size})
          </button>
        )}
        
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

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-black">
          Our Products
        </h1>

        {!loading && products.length > 0 && (
          <p className="text-center text-gray-600 mb-6">
            Showing {displayedProducts.length} of {filteredCount} products
          </p>
        )}

        <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {selectedItems.size > 0 && (
              <button
                onClick={clearSelection}
                className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
              >
                Clear ({selectedItems.size})
              </button>
            )}
            {crossCategoryCount > 0 && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                +{crossCategoryCount} from other {crossCategoryCount === 1 ? 'category' : 'categories'}
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pr-10 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-black"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setLoading(true);
                fetchProductsData();
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 lg:sticky lg:top-24 h-fit border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-black">🧰 Filters</h2>
              <button
                onClick={() => {
                  setCategory("All");
                  setMaxPrice(100000);
                  setSort("");
                  setSearch("");
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">📦 Categories</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat, i) => {
                  const count = products.filter(p => cat === "All" || p.category === cat).length;
                  return (
                    <button
                      key={i}
                      onClick={() => setCategory(cat)}
                      className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200 ${category === cat
                          ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                          : "bg-gray-100 hover:bg-blue-50 hover:translate-x-1 text-black"
                        }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${category === cat ? "bg-white text-blue-600" : "bg-gray-200 text-black"
                        }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">💰 Max Price</h3>
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
                <span className="font-semibold text-black">Up to ₹{maxPrice.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">🔃 Sort By</h3>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-black"
              >
                <option value="">Default</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid - Show ORIGINAL SELLING PRICE */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">No products found</p>
                <button
                  onClick={() => fetchProductsData()}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {displayedProducts.map((product, index) => {
                    const quantity = getProductQuantity(product.id);
                    const productPrice = product.selling_price || product.price;
                    const isSelected = selectedItems.has(product.id);

                    return (
                      <div
                        key={product.id}
                        ref={index === displayedProducts.length - 1 ? lastProductRef : null}
                        className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 relative group border-2 flex flex-col h-full ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
                      >
                        {product.discount_percentage > 0 && (
                          <div className="absolute top-[-15px] left-[-15px] z-20 w-[85px] h-[85px] rounded-full bg-gradient-to-br from-[#ff0055] to-[#ff5e00] text-white flex flex-col items-center justify-center font-bold shadow-xl border-4 border-white transform -rotate-[8deg]">
                            <span className="text-[10px] uppercase tracking-wider opacity-90">Save</span>
                            <span className="text-2xl leading-none font-black">{product.discount_percentage}%</span>
                            <span className="text-[8px] uppercase font-normal">Limited</span>
                          </div>
                        )}

                        <div className="absolute top-3 right-3 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(product.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5 sm:w-6 sm:h-6 accent-blue-600 cursor-pointer"
                            disabled={!product.inStock}
                          />
                        </div>

                        <div onClick={() => openProduct(product)} className="cursor-pointer flex-shrink-0">
                          <div className="relative h-40 mb-4">
                            <Image
                              src={product.img}
                              alt={product.name}
                              fill
                              className="object-contain"
                              onError={handleImageError}
                            />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h2 className="font-bold text-lg text-black mt-1 break-words whitespace-normal leading-tight">{product.name || 'Unnamed Product'}</h2>
                          <p className="text-sm text-gray-600 mt-1 break-words whitespace-normal">{product.description || 'No description available'}</p>
                          <p className="text-xs text-gray-500 mt-1 break-words">Category: {product.category || 'General'}</p>
                          <p className="text-xs text-gray-400 break-words">{product.brand || 'Unknown'} • {product.unit || 'Piece'}</p>
                          <p className="text-yellow-500 text-sm mt-1">{"⭐".repeat(4)}</p>
                          
                          {/* Product Card - Show ORIGINAL SELLING PRICE only */}
                          <div className="mt-2">
                            <p className="text-xl font-bold text-blue-600">
                              ₹{productPrice.toLocaleString()}
                            </p>
                            {product.discount_percentage > 0 && (
                              <p className="text-xs text-green-600">{product.discount_percentage}% off</p>
                            )}
                            {product.gst_percentage > 0 && (
                              <p className="text-xs text-gray-400">+{product.gst_percentage}% GST</p>
                            )}
                          </div>
                          
                          <p className={`text-xs mt-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                            {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                          </p>
                        </div>

                        <div className="flex flex-row gap-3 w-full mt-3">
                          {product.inStock ? (
                            quantity === 0 ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, 1);
                                    setPopupMessage(`${product.name} added to cart!`);
                                    setPopup(true);
                                    setTimeout(() => setPopup(false), 2000);
                                  }}
                                  className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyNow(product);
                                  }}
                                  className="px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold"
                                >
                                  Buy Now →
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="flex-1 flex items-center justify-between border rounded-lg overflow-hidden">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product.id, quantity - 1);
                                    }}
                                    className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition text-black"
                                  >
                                    −
                                  </button>
                                  <span className="flex-1 text-center font-semibold text-lg text-black">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product.id, quantity + 1);
                                    }}
                                    className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-xl font-bold transition text-black"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyNow(product);
                                  }}
                                  className="px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold"
                                >
                                  Buy Now →
                                </button>
                              </>
                            )
                          ) : (
                            <button disabled className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed">
                              Out of Stock
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {loadingMore && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading more products...</p>
                  </div>
                )}

                {!hasMore && displayedProducts.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">🎉 You've reached the end!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Duplicate Products Dialog */}
      {showDuplicateDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-black">⚠️ Products Already in Cart</h3>
            <p className="text-gray-600 mb-3">These products are already in your cart:</p>
            <ul className="mb-4 max-h-40 overflow-y-auto">
              {duplicateProductsList.map(p => (
                <li key={p.id} className="text-sm text-gray-700 py-1 border-b">• {p.name}</li>
              ))}
            </ul>
            <p className="text-gray-600 mb-6">What would you like to do?</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDuplicateDecision(true)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add +1 to Each
              </button>
              <button
                onClick={() => handleDuplicateDecision(false)}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Skip Duplicates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-50 bg-white/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md hover:bg-gray-100 text-black"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="relative">
                <div className="relative h-52 sm:h-64 md:h-80">
                  {selectedProduct?.discount_percentage > 0 && (
                    <div className="absolute top-[-10px] left-[-10px] z-20 w-[80px] h-[80px] rounded-full bg-gradient-to-br from-[#ff0055] to-[#ff5e00] text-white flex flex-col items-center justify-center font-bold shadow-xl border-4 border-white transform -rotate-[8deg]">
                      <span className="text-[8px] uppercase tracking-wider opacity-90">Save</span>
                      <span className="text-xl leading-none font-black">{selectedProduct.discount_percentage}%</span>
                      <span className="text-[7px] uppercase font-normal">Limited</span>
                    </div>
                  )}
                  <Image
                    src={selectedProduct.img}
                    alt={selectedProduct.name}
                    fill
                    className="object-contain"
                    onError={handleImageError}
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-black">{selectedProduct.name}</h2>
                <p className="text-gray-500 text-sm sm:text-base mb-1">
                  {selectedProduct.category} • {selectedProduct.brand}
                </p>
                <p className="text-yellow-500 text-sm sm:text-base mb-2">{"⭐".repeat(4)}</p>
                
                {/* Modal - Show ORIGINAL SELLING PRICE */}
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-3">
                  ₹{(selectedProduct.selling_price || selectedProduct.price).toLocaleString()}
                </p>
                {selectedProduct.discount_percentage > 0 && (
                  <p className="text-green-600 font-semibold mb-2">{selectedProduct.discount_percentage}% OFF</p>
                )}
                {selectedProduct.gst_percentage > 0 && (
                  <p className="text-xs text-gray-500 mb-2">+{selectedProduct.gst_percentage}% GST</p>
                )}
                
                <p className="text-gray-600 text-sm sm:text-base mb-5">{selectedProduct.description}</p>
                <p className={`text-sm mb-4 ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedProduct.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                </p>
                {selectedProduct.unit && <p className="text-sm text-gray-500 mb-4">Unit: {selectedProduct.unit}</p>}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  {selectedProduct.inStock ? (
                    getProductQuantity(selectedProduct.id) === 0 ? (
                      <>
                        <button
                          onClick={() => {
                            addToCart(selectedProduct, 1);
                            closeModal();
                            setPopupMessage(`${selectedProduct.name} added to cart!`);
                            setPopup(true);
                            setTimeout(() => setPopup(false), 2000);
                          }}
                          className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => {
                            closeModal();
                            handleBuyNow(selectedProduct);
                          }}
                          className="px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold"
                        >
                          Buy Now →
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 flex items-center justify-between border rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) - 1)} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-xl text-black">−</button>
                          <span className="flex-1 text-center font-semibold text-lg text-black">{getProductQuantity(selectedProduct.id)}</span>
                          <button onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) + 1)} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-xl text-black">+</button>
                        </div>
                        <button
                          onClick={() => {
                            closeModal();
                            handleBuyNow(selectedProduct);
                          }}
                          className="px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold"
                        >
                          Buy Now →
                        </button>
                      </>
                    )
                  ) : (
                    <button disabled className="flex-1 py-3 rounded-lg bg-gray-300 text-gray-500">Out of Stock</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[40%] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out ${showCart ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="relative p-6 pt-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex-shrink-0 min-h-[140px]">
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
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="p-6 space-y-4">
            {!showCheckout ? (
              <>
                <button
                  onClick={() => setShowCart(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group mb-2"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Continue Shopping</span>
                </button>

                {cart.length > 0 && (
                  <button
                    onClick={clearAllCart}
                    className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition mb-4 flex items-center justify-center gap-2"
                  >
                    🗑️ Clear All Items ({cart.length})
                  </button>
                )}

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
                  cart.map((item) => {
                    const sellingPrice = item.selling_price || item.price;
                    
                    return (
                      <div key={item.id} className="flex gap-4 items-start bg-gray-50 rounded-xl p-3 hover:shadow-md transition-all duration-300 border border-gray-100">
                        <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                          <img
                            src={item.img || "/image/placeholder.png"}
                            alt={item.title}
                            className="w-full h-full object-contain p-2"
                            onError={handleImageError}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">₹{sellingPrice}</span> each
                          </p>
                          {item.discount_percentage > 0 && (
                            <p className="text-xs text-green-600">{item.discount_percentage}% off</p>
                          )}

                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all text-black"
                            >
                              <span className="text-lg font-medium">−</span>
                            </button>
                            <span className="text-sm font-semibold w-8 text-center text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all text-black"
                            >
                              <span className="text-lg font-medium">+</span>
                            </button>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-indigo-600">₹{sellingPrice * item.quantity}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-2 flex items-center gap-1"
                          >
                            <span className="text-sm">🗑️</span>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}

                {cart.length > 0 && (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg font-semibold mt-4"
                  >
                    Proceed to Checkout • ₹{getCartSubtotal().toLocaleString()}
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-6 pb-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group mb-2"
                >
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Back to Cart</span>
                </button>

                {/* ORDER SUMMARY - INDIVIDUAL PRODUCT BREAKDOWN */}
                <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-indigo-600 rounded-full"></span>
                    Order Summary
                  </h3>
                  
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item, idx) => {
                      const sellingPrice = item.selling_price || item.price;
                      const discountPercent = item.discount_percentage || 0;
                      const gstPercent = item.gst_percentage || 0;
                      const quantity = item.quantity;
                      
                      // Calculations for this product
                      const discountAmount = (sellingPrice * discountPercent) / 100;
                      const priceAfterDiscount = sellingPrice - discountAmount;
                      const gstAmount = (priceAfterDiscount * gstPercent) / 100;
                      const finalPrice = priceAfterDiscount + gstAmount;
                      const itemTotal = finalPrice * quantity;
                      const totalDiscount = discountAmount * quantity;
                      const totalGst = gstAmount * quantity;
                      
                      return (
                        <div key={item.id} className="border-b border-indigo-100 pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-800">{item.title}</p>
                              <p className="text-xs text-gray-500">Quantity: {quantity}</p>
                            </div>
                            <p className="font-bold text-indigo-600 text-lg">₹{Math.round(itemTotal).toLocaleString()}</p>
                          </div>
                          
                          <div className="space-y-1 text-sm pl-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span>₹{Math.round(sellingPrice * quantity).toLocaleString()}</span>
                            </div>
                            {discountPercent > 0 && (
                              <div className="flex justify-between text-green-600">
                                <span>Discount ({discountPercent}%):</span>
                                <span>- ₹{Math.round(totalDiscount).toLocaleString()}</span>
                              </div>
                            )}
                            {gstPercent > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">GST ({gstPercent}%):</span>
                                <span>+ ₹{Math.round(totalGst).toLocaleString()}</span>
                              </div>
                            )}
                            {/* <div className="flex justify-between pt-1 border-t border-indigo-100">
                              <span className="font-semibold text-gray-700">Final Price:</span>
                              <span className="font-bold text-indigo-600">₹{Math.round(itemTotal).toLocaleString()}</span>
                            </div> */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-indigo-100 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Subtotal:</span>
                      <span className="font-medium">₹{Math.round(getCartSubtotal()).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Total Discount:</span>
                      <span>- ₹{Math.round(getCartSubtotal() - (getCartTotal() - getTotalGst()))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total GST:</span>
                      <span className="font-medium">₹{Math.round(getCartTotal() - (getCartSubtotal() - (getCartSubtotal() - (getCartTotal() - getTotalGst()))))}</span>
                    </div>
                    <div className="border-t pt-3 mt-2 flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Grand Total:</span>
                      <span className="text-2xl font-bold text-indigo-600">₹{Math.round(getCartTotal()).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400 text-right">Inclusive of all taxes</p>
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
                    <label className="block text-sm font-medium mb-1 text-black">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-black">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium mb-1 text-black">Payment Method *</label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-black">💵 Cash on Delivery</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === "online"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="text-black">💳 Online Payment</span>
                      </label>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : (
                      paymentMethod === 'online' ? `Pay ₹${Math.round(getCartTotal()).toLocaleString()} Online` : `Place Order • ₹${Math.round(getCartTotal()).toLocaleString()}`
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  {paymentMethod === 'online' ? '🔒 Secured by Cashfree' : '🔒 Cash on Delivery available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup Notification */}
      {popup && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-[9999] animate-slide-up">
          ✅ {popupMessage}
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        .animate-slide-up { animation: slide-up 2s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default ProductsPage;