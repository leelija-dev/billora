'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStoreZustand';
import { useProductsStore } from '../../store/productsStore';
import { createProductOrder } from '../../services/productPaymentService';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiFilter, FiShoppingCart, FiClock, FiGrid } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';

// Import components
import ProductGrid from '../../components/products/ProductGrid';
import SearchBar from '../../components/products/SearchBar';
import CategoryTabs from '../../components/products/CategoryTabs';
import ProductFilters from '../../components/products/ProductFilters';
import Pagination from '../../components/products/Pagination';
import FilterOverlay from '../../components/products/FilterOverlay';
import CartSidebar from '../../components/products/CartSidebar';
import ProductModal from '../../components/products/ProductModal';
import RecentOrderModal from '../../components/products/RecentOrderModal';
import PopupNotification from '../../components/products/PopupNotification';
import SkeletonLoader from '../../components/products/SkeletonLoader';

const ProductsPage = () => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Subscribe to store changes to ensure state synchronization
  const productsStore = useProductsStore();
  
  // Force re-render when store changes
  useEffect(() => {
    console.log("🔄 Store state changed:", { 
      loading: productsStore.loading, 
      productsLength: productsStore.products?.length || 0 
    });
  }, [productsStore.loading, productsStore.products]);

  const {
    products,
    pagination,
    loading,
    error: storeError,
    storeId,
    fetchProducts,
    categories,
    clearError
  } = productsStore;
  
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [recentOrder, setRecentOrder] = useState(null);
  const [showRecentOrder, setShowRecentOrder] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  const [validationErrors, setValidationErrors] = useState({ fullName: '', phone: '' });
  const [isMobile, setIsMobile] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Auth subscription
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const hasAuth = !!(state.user && state.isLoggedIn);
      if (hasAuth && !isAuthReady) setIsAuthReady(true);
    });
    return unsubscribe;
  }, [isAuthReady]);

  // Load recent order
  useEffect(() => {
    const saved = localStorage.getItem("pendingProductOrder");
    if (saved) {
      try {
        setRecentOrder(JSON.parse(saved));
      } catch (e) {
        setRecentOrder(null);
      }
    }
  }, []);

  // Load saved cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          if (parsedCart.length > 0 && !isMobile) setShowCart(true);
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    }
  }, [isMobile]);

  // Save cart to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cart.length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        if (!isMobile) setShowCart(true);
      } else {
        sessionStorage.removeItem('cart');
        setShowCart(false);
        setShowCheckout(false);
      }
    }
  }, [cart, isMobile]);

  // Load selected items
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSelectedItems = sessionStorage.getItem('selectedItems');
      if (savedSelectedItems) {
        try {
          setSelectedItems(new Set(JSON.parse(savedSelectedItems)));
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

  // Cart helper functions
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const sellingPrice = item.selling_price || item.price;
      const discountPercent = item.discount_percentage || 0;
      const gstPercent = item.gst_percentage || 0;
      const discountAmount = (sellingPrice * discountPercent) / 100;
      const gstAmount = ((sellingPrice - discountAmount) * gstPercent) / 100;
      const finalPrice = ((sellingPrice - discountAmount) + gstAmount);
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + ((item.selling_price || item.price) * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getTotalGst = () => {
    return cart.reduce((total, item) => {
      const sellingPrice = item.selling_price || item.price;
      const discountPercent = item.discount_percentage || 0;
      const gstPercent = item.gst_percentage || 0;
      const discountAmount = (sellingPrice * discountPercent) / 100;
      const gstAmount = ((sellingPrice - discountAmount) * gstPercent) / 100;
      return total + (gstAmount * item.quantity);
    }, 0);
  };

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

  // Cart actions
  const addToCart = (product, quantityToAdd = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
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

    setSelectedItems(prev => new Set([...prev, product.id]));
    setPopupMessage(`${product.name} added to cart!`);
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);
    if (!isMobile) setShowCart(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
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

    setSelectedItems(new Set([product.id]));
    setShowCart(true);
    setShowCheckout(true);
  };

  const handleCheckboxClick = (product, e) => {
    e.stopPropagation();
    if (!product.inStock) {
      setPopupMessage("Product is out of stock!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    if (selectedItems.has(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product, 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { fullName: '', phone: '' };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
      hasError = true;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number";
      hasError = true;
    }

    const phoneRegex = /^\d{10}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (formData.phone && !phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      hasError = true;
    }

    setValidationErrors(newErrors);

    if (hasError) {
      setPopupMessage("Please fill all required fields correctly");
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
      return;
    }

    if (cart.length === 0) {
      setPopupMessage("Your cart is empty!");
      setPopup(true);
      setTimeout(() => setPopup(false), 2000);
      return;
    }

    if (!user || !user.id) {
      setPopupMessage("Please login to place order");
      setPopup(true);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setIsPlacingOrder(true);
    const loadingToast = toast.loading('Processing...');

    try {
      const orderData = {
        user_id: user.id,
        store_id: storeId,
        customer_name: formData.fullName.trim(),
        customer_phone: cleanPhone,
        product_id: cart.map(item => item.id),
        quantity: cart.map(item => item.quantity),
        unit_id: cart.map(item => item.unit_id || 1),
        payment_mode: paymentMethod === 'cod' ? 'cash' : paymentMethod
      };

      const response = await createProductOrder(orderData);
      toast.dismiss(loadingToast);

      if (response.status === true || response.data?.order_id || response.order_id) {
        toast.success('Order placed successfully!');
        
        const orderInfo = {
          orderId: response.data?.order_id || response.order_id,
          totalAmount: response.data?.total_amount || response.total_amount,
          items: response.data?.total_items ?? cart.length,
          timestamp: Date.now()
        };
        
        localStorage.setItem('pendingProductOrder', JSON.stringify(orderInfo));
        setCart([]);
        setSelectedItems(new Set());
        sessionStorage.removeItem('cart');
        setShowCart(false);
        setShowCheckout(false);
        setFormData({ fullName: "", phone: "" });
        router.push('/order-success');
        return;
      }
      
      throw new Error(response.message || 'Failed to create order');

    } catch (error) {
      toast.dismiss(loadingToast);
      setPopupMessage(error.message || 'Failed to place order. Please try again.');
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
      setIsPlacingOrder(false);
    }
  };

  const fetchProductsData = useCallback(async (page = 1, categoryId = "All", term = "") => {
    try {
      clearError();
      if (!isAuthReady) {
        return;
      }
      await fetchProducts(page, categoryId, term, user, token);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [isAuthReady, user, token, fetchProducts, clearError]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    clearError();
    setIsInitialLoading(true);
    fetchProductsData(1, selectedCategory, searchTerm);
  };

  useEffect(() => {
    if (isAuthReady) {
      fetchProductsData(1, selectedCategory, searchTerm);
    }
  }, [isAuthReady, selectedCategory, searchTerm, retryCount, fetchProductsData]);

  const handleCategoryChange = (categoryId) => {
    console.log("🔄 handleCategoryChange called:", {
      categoryId,
      previousCategory: selectedCategory,
      searchTerm,
      willFetch: true
    });
    setSelectedCategory(categoryId);
    fetchProductsData(1, categoryId, searchTerm);
  };

  const handleSearchSubmit = () => {
    const term = searchInput.trim();
    setSearchTerm(term);
    console.log("🔍 handleSearchSubmit called:", {
      term,
      previousTerm: searchTerm,
      willFetch: true
    });
    fetchProductsData(1, selectedCategory, term);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    fetchProductsData(1, selectedCategory, "");
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const cartQuantities = cart.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {});

  // Debug logging
  console.log("🔍 Page render state:", { 
    loading, 
    productsLength: products?.length || 0,
    storeError,
    isProductsArray: Array.isArray(products),
    isInitialLoading
  });

  // Sort products only (no price filtering)
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") {
      return (a.selling_price || a.price) - (b.selling_price || b.price);
    } else if (sort === "high") {
      return (b.selling_price || b.price) - (a.selling_price || a.price);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Floating Buttons */}
      <button
        onClick={() => setShowFilterOverlay(!showFilterOverlay)}
        className="fixed left-4 top-6 z-35 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <FiFilter className="w-5 h-5" />
        <span className="hidden sm:inline">Filters</span>
      </button>

      <div className="fixed top-5 right-5 z-40 flex gap-2">
        <button
          onClick={() => setShowRecentOrder(!showRecentOrder)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          <FiClock className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setShowCart(!showCart);
            if (!showCart) setShowFilterOverlay(false);
          }}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition relative"
        >
          <FiShoppingCart className="w-5 h-5" />
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showCart ? 'lg:mr-[40%]' : 'mr-0'}`}>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <div className="container mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <FiGrid className="w-8 h-8 text-blue-600" />
                  Our Collection
                </h1>
                <p className="text-gray-500">Discover premium products crafted for quality and style</p>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <SearchBar
                  searchInput={searchInput}
                  onSearchChange={setSearchInput}
                  onSearchSubmit={handleSearchSubmit}
                  onClearSearch={clearSearch}
                  searchTerm={searchTerm}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <FaSearch className="w-4 h-4" />
                    Search
                  </button>
                  <button
                    onClick={() => setShowFilterOverlay(true)}
                    className="px-6 py-3 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium flex items-center gap-2 md:hidden"
                  >
                    <FiFilter className="w-5 h-5" />
                    Filters
                  </button>
                </div>
              </div>

              {/* Category Tabs */}
              <CategoryTabs
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />

              {/* Filters Bar */}
              <ProductFilters
                selectedItemsCount={selectedItems.size}
                crossCategoryCount={selectedItems.size - products.filter(p => selectedItems.has(p.id)).length}
                sort={sort}
                onSortChange={setSort}
              />

              {/* Skeleton Loading or Product Grid */}
              {isInitialLoading || (loading && products.length === 0) ? (
                <SkeletonLoader />
              ) : (
                <>
                  {/* Product Grid with Loading, Error, and Empty States */}
                  <ProductGrid
                    products={sortedProducts}
                    cartQuantities={cartQuantities}
                    selectedItems={selectedItems}
                    onAddToCart={addToCart}
                    onBuyNow={handleBuyNow}
                    onUpdateQuantity={updateQuantity}
                    onSelect={handleCheckboxClick}
                    onImageClick={openProduct}
                    expandedDescriptions={expandedDescriptions}
                    onToggleDescription={toggleDescription}
                    showCart={showCart}
                    isLoading={loading && !storeError && !isInitialLoading}
                    error={storeError}
                    onRetry={handleRetry}
                  />

                  {/* Pagination - Only show when products exist and not loading */}
                  {!loading && !storeError && sortedProducts.length > 0 && pagination?.last_page > 1 && (
                    <Pagination
                      pagination={pagination}
                      onPageChange={(page) => fetchProductsData(page, selectedCategory, searchTerm)}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Overlay */}
        <FilterOverlay
          isOpen={showFilterOverlay}
          onClose={() => setShowFilterOverlay(false)}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={(catId) => {
            handleCategoryChange(catId);
            setShowFilterOverlay(false);
          }}
          sort={sort}
          onSortChange={setSort}
          onReset={() => {
            setSelectedCategory("All");
            setSort("");
            setSearchInput("");
            setSearchTerm("");
            fetchProductsData(1, "All", "");
            setShowFilterOverlay(false);
          }}
        />

        {/* Cart Sidebar */}
        <CartSidebar
          showCart={showCart}
          showCheckout={showCheckout}
          cart={cart}
          onClose={() => {
            setShowCart(false);
            setShowCheckout(false);
          }}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onBackToCart={() => setShowCheckout(true)}
          onPlaceOrder={handlePlaceOrder}
          getCartSubtotal={getCartSubtotal}
          getTotalDiscountAmount={getTotalDiscountAmount}
          getTotalGst={getTotalGst}
          getCartTotal={getCartTotal}
          getCartItemCount={getCartItemCount}
          formData={formData}
          onFormChange={handleInputChange}
          validationErrors={validationErrors}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          isPlacingOrder={isPlacingOrder}
        />

        {/* Product Modal */}
        <ProductModal
          isOpen={showModal}
          product={selectedProduct}
          onClose={closeModal}
          quantity={selectedProduct ? getProductQuantity(selectedProduct.id) : 0}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
          onUpdateQuantity={updateQuantity}
        />

        {/* Recent Order Modal */}
        <RecentOrderModal
          isOpen={showRecentOrder}
          onClose={() => setShowRecentOrder(false)}
          recentOrder={recentOrder}
          onViewDetails={() => window.location.href = "/order-success"}
          onDismiss={() => {
            localStorage.removeItem("pendingProductOrder");
            setRecentOrder(null);
            setShowRecentOrder(false);
          }}
        />

        {/* Popup Notification */}
        <PopupNotification message={popupMessage} isVisible={popup} />
      </div>
    </div>
  );
};

export default ProductsPage;