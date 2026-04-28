'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../store/authStoreZustand';
import { useProductsStore } from '../../store/productsStore';
import { createProductOrder } from '../../services/productPaymentService';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  FiFilter, 
  FiShoppingCart, 
  FiX, 
  FiMinus, 
  FiPlus, 
  FiTrash2, 
  FiArrowLeft,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiTag,
  FiDollarSign,
  FiList,
  FiCheck,
  FiEye,
  FiPackage,
  FiClock,
  FiUser,
  FiPhone,
  FiCreditCard,
  FiHome,
  FiStar,
  FiHeart,
  FiShare2,
  FiRefreshCw,
  FiAlertCircle,
  FiInfo,
  FiSmile,
  FiTruck,
  FiShield,
  FiMessageCircle
} from 'react-icons/fi';
import { 
  MdOutlineCategory, 
  MdSort, 
  MdOutlinePriceChange,
  MdOutlineCheckCircle,
  MdOutlineCancel,
  MdOutlineInventory,
  MdLocalOffer,
  MdOutlineShoppingBag,
  MdOutlineFavorite,
  MdOutlineFavoriteBorder,
  MdOutlineRemoveShoppingCart
} from 'react-icons/md';
import { FaRupeeSign, FaPercentage, FaGripfire } from 'react-icons/fa';
import { BsCartCheck, BsCartPlus, BsCartX, BsLightningCharge } from 'react-icons/bs';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { IoIosClose, IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const ProductsPage = () => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  
  // Use Zustand products store
  const {
    products,
    pagination,
    loading,
    error,
    storeId,
    search,
    selectedCategory,
    currentPage,
    fetchProducts,
    setSearch: setSearchStore,
    setSelectedCategory,
    setCurrentPage,
    categories,
    clearError
  } = useProductsStore();
  
  // Add Zustand store subscription to ensure we wait for proper rehydration
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      const hasAuth = !!(state.user && state.isLoggedIn);
      if (hasAuth && !isAuthReady) {
        setIsAuthReady(true);
      }
    });
    return unsubscribe;
  }, [isAuthReady]);
  
  // Local state for UI components
  const [localSearch, setLocalSearch] = useState(search);
  const [selectedCategoryLocal, setSelectedCategoryLocal] = useState(selectedCategory || "All");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
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
  const [formData, setFormData] = useState({
    fullName: "",
    phone: ""
  });

  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    phone: ''
  });

  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false);

  const PRODUCTS_PER_PAGE = 15;

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
  
  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const calculateProductFinalPrice = (product) => {
    const sellingPrice = product.selling_price || product.price;
    const discountPercent = product.discount_percentage || 0;
    const gstPercent = product.gst_percentage || 0;

    const gstAmount = (sellingPrice * gstPercent) / 100;
    const discountAmount = (sellingPrice * discountPercent) / 100;
    const finalPrice = sellingPrice + gstAmount - discountAmount;

    return finalPrice;
  };

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

  // Helper function to truncate to 2 decimals without rounding
  const truncateTo2Decimals = (value) => {
    return (Math.floor(value * 100) / 100).toFixed(2);
  };

  useEffect(() => {
    if (!document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Load saved cart from sessionStorage - DO NOT AUTO OPEN ON MOBILE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          // Only open cart on desktop when loading saved cart
          if (parsedCart.length > 0 && !isMobile) {
            setShowCart(true);
          }
        } catch (error) {
          console.error("Error loading cart:", error);
        }
      }
    }
  }, [isMobile]);

  // Save cart to sessionStorage - DO NOT AUTO OPEN ON MOBILE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cart.length > 0) {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        // Only open cart on desktop when cart updates
        if (!isMobile) {
          setShowCart(true);
        }
      } else {
        sessionStorage.removeItem('cart');
        setShowCart(false);
        setShowCheckout(false);
      }
    }
  }, [cart, isMobile]);

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

    setSelectedItems(prev => new Set([...prev, product.id]));
    setPopupMessage(`${product.name} added to cart!`);
    setPopup(true);
    setTimeout(() => setPopup(false), 2000);

    // Only open cart on desktop, NOT on mobile
    if (!isMobile) {
      setShowCart(true);
    }
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
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
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

    // User is already available from Zustand store

    if (!user || !user.id) {
      setPopupMessage("Please login to place order");
      setPopup(true);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setIsPlacingOrder(true);
    const loadingToast = toast.loading('Processing...');

    try {
      console.log('🚀 Starting order placement...');
      
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

      console.log('📤 Order request payload:', orderData);
      
      // ✅ Use centralized productPaymentService instead of direct API call
      console.log('📡 Calling createProductOrder service...');
      const response = await createProductOrder(orderData);
      console.log('📦 Service response received:', response);
      
      toast.dismiss(loadingToast);
      
      if (paymentMethod === 'online' && response.payment_session_id) {
        const waitForCashfree = setInterval(() => {
          if (window.Cashfree) {
            clearInterval(waitForCashfree);
            const cashfree = new Cashfree({
              mode: "sandbox"
            });

            cashfree.checkout({
              paymentSessionId: response.payment_session_id,
              redirectTarget: "_self"
            });
          }
        }, 100);

        setTimeout(() => {
          clearInterval(waitForCashfree);
          if (!window.Cashfree) {
            toast.error("Payment gateway not loaded. Please refresh and try again.");
            setIsPlacingOrder(false);
          }
        }, 10000);
        
      } else if (paymentMethod === 'cash') {
        console.log('🔍 Cash payment response:', response);
        console.log('🔍 Response status:', response.status);
        console.log('🔍 Response data:', response.data);
        
        // ✅ Check for successful response (status: true or has order_id)
        if (response.status === true || response.data?.order_id || response.order_id) {
          console.log('✅ Order success detected, processing...');
          toast.success('Order placed successfully!');
          
          const orderInfo = {
            orderId: response.data?.order_id || response.order_id,
            totalAmount: response.data?.total_amount || response.total_amount,
            items: response.data?.total_items ?? (Array.isArray(response.items) ? response.items.length : cart.length),
            timestamp: Date.now()
          };
          console.log('📦 Order info to save:', orderInfo);
          localStorage.setItem('pendingProductOrder', JSON.stringify(orderInfo));

          setCart([]);
          setSelectedItems(new Set());
          sessionStorage.removeItem('cart');
          setShowCart(false);
          setShowCheckout(false);
          setFormData({ fullName: "", phone: "" });

          console.log('🚀 Redirecting to order success page...');
          router.push('/order-success');
          return; // Exit early to prevent error handler
        } else {
          console.log('❌ Order response invalid:', response);
          throw new Error(response.message || "Order created but order id not returned");
        }
        setIsPlacingOrder(false);
      } else {
        throw new Error(response.message || 'Failed to create order');
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('❌ Order error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Check if this is actually a success response being treated as error
      if (error.message === 'Order placed successfully') {
        console.log('🔄 Success response caught as error, handling as success...');
        
        // Try to extract order data from the error context
        // This is a workaround for the service layer throwing success as error
        toast.success('Order placed successfully!');
        
        // Create basic order info since we can't get it from the error
        const orderInfo = {
          orderId: 'UNKNOWN',
          totalAmount: getCartTotal(),
          items: getCartItemCount(),
          timestamp: Date.now()
        };
        console.log('📦 Fallback order info:', orderInfo);
        localStorage.setItem('pendingProductOrder', JSON.stringify(orderInfo));

        setCart([]);
        setSelectedItems(new Set());
        sessionStorage.removeItem('cart');
        setShowCart(false);
        setShowCheckout(false);
        setFormData({ fullName: "", phone: "" });

        console.log('🚀 Redirecting to order success page...');
        router.push('/order-success');
        return;
      }
      
      setPopupMessage(error.message || 'Failed to place order. Please try again.');
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
      setIsPlacingOrder(false);
    }
  };

  const fetchProductsData = async (page = 1, categoryId = "All", term = "") => {
    try {
      console.log('🔍 fetchProductsData called with:', { page, categoryId, term });
      console.log('🔍 Current state:', { isAuthReady, user: !!user, token: !!token });
      
      // Clear any previous errors
      clearError();
      
      // Wait for auth to be ready using subscription state
      if (!isAuthReady) {
        console.log('⏳ Waiting for auth store to be ready...');
        toast.loading("Initializing authentication...");
        return;
      }
      
      console.log('✅ Auth ready, proceeding to fetch products');
      console.log('🔍 User data:', { userId: user?.id, userName: user?.name });
      
      // Use Zustand store to fetch products
      await fetchProducts(page, categoryId, term, user, token);
      
    } catch (error) {
      console.error("❌ Fetch error:", error);
      toast.error("Failed to load products: " + error.message);
      
      // Only redirect on critical authentication errors
      if (error.message && error.message.includes('User not authenticated')) {
        console.log('Critical auth error detected, redirecting to login');
        setTimeout(() => router.push('/login'), 1000);
      }
    }
  };

  useEffect(() => {
    console.log('🔍 useEffect triggered, isAuthReady:', isAuthReady);
    if (isAuthReady) {
      console.log('🔍 Calling fetchProductsData from useEffect');
      fetchProductsData(1, selectedCategoryLocal, searchTerm);
    } else {
      console.log('🔍 Not ready yet, waiting for auth...');
    }
  }, [isAuthReady, selectedCategoryLocal, searchTerm]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryLocal(categoryId);
    setCurrentPage(1);
    fetchProductsData(1, categoryId, searchTerm);
  };

  const handleSearchSubmit = () => {
    const term = searchInput.trim();
    setSearchTerm(term);
    setCurrentPage(1);
    fetchProductsData(1, selectedCategoryLocal, term);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchProductsData(1, selectedCategoryLocal, "");
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

 const handleImageError = (e) => {
  console.log(`Image failed to load:`, e.currentTarget.src);
  e.currentTarget.onerror = null; // Prevent infinite loop
  
  // Try to find the product data
  const imgElement = e.currentTarget;
  const container = imgElement.closest('[data-product-id]');
  const productId = container?.dataset?.productId;
  
  if (productId) {
    const product = products.find(p => p.id.toString() === productId);
    if (product?.isDriveImage && product?.fileId) {
      const currentSrc = imgElement.src;
      
      // Try alternative URLs in order
      const alternatives = [
        `https://lh3.googleusercontent.com/d/${product.fileId}=s400`,
        `https://drive.google.com/uc?export=view&id=${product.fileId}`,
        `https://drive.google.com/thumbnail?id=${product.fileId}&sz=w400-h400`,
        `https://drive.google.com/thumbnail?id=${product.fileId}&sz=w800-h800` // Try larger size
      ];
      
      const currentIndex = alternatives.findIndex(url => currentSrc.includes(url.split('?')[0].split('&')[0]));
      
      // Try the next alternative
      if (currentIndex >= 0 && currentIndex < alternatives.length - 1) {
        console.log(`Trying alternative URL:`, alternatives[currentIndex + 1]);
        imgElement.src = alternatives[currentIndex + 1];
        return;
      }
    }
  }
  
  // Final fallback - remove placeholder, just show broken image indicator
  const originalSrc = e.currentTarget.src;
  if (originalSrc.includes('drive.google.com') || originalSrc.includes('googleusercontent.com')) {
    // Don't set fallback image, let the browser show broken image
    console.error('Google Drive image failed to load:', originalSrc);
  } else {
    e.currentTarget.src = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
  }
};

const handleImageLoad = (e) => {
  console.log(`Image loaded successfully:`, e.currentTarget.src);
};

  const currentProducts = products;
  const visibleSelectedCount = currentProducts.filter(p => selectedItems.has(p.id)).length;
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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Floating Filter Button */}
      <button
        onClick={() => setShowFilterOverlay(!showFilterOverlay)}
        className="fixed left-4 top-6 z-35 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <FiFilter className="w-5 h-5" />
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Floating Cart & Order Buttons - Top Right Corner */}
      <div className="fixed top-5 right-5 z-40 flex gap-2">
        {/* Recent Order Button */}
        <button
          onClick={() => setShowRecentOrder(!showRecentOrder)}
          className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition relative"
          title="Recent Order"
        >
          <FiClock className="w-5 h-5" />
        </button>

        {/* Cart Button */}
        <button
          onClick={() => {
            setShowCart(!showCart);
            if (!showCart) {
              setShowFilterOverlay(false);
            }
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

      {/* Recent Order Modal */}
      {showRecentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Recent Order
              </h3>
              <button
                onClick={() => setShowRecentOrder(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {recentOrder ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800 font-mono">ORD{recentOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-green-600 text-lg flex items-center gap-1">
                    <FaRupeeSign className="w-4 h-4" />
                    {recentOrder.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Items</p>
                  <p className="font-semibold text-gray-800">{recentOrder.items} items</p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      window.location.href = "/order-success";
                    }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <FiEye className="w-4 h-4" />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("pendingProductOrder");
                      setRecentOrder(null);
                      setShowRecentOrder(false);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-gray-500 text-lg">No order yet</p>
                <p className="text-gray-400 text-sm mt-2">Start shopping to see your recent orders here</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Products Grid */}
        <div className={`flex-1 transition-all duration-300 ${showCart ? 'lg:mr-[40%]' : 'mr-0'}`}>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <FiGrid className="w-8 h-8 text-blue-600" />
                  Our Collection
                </h1>
                <p className="text-gray-500">Discover premium products crafted for quality and style</p>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products by name, category, or brand..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSearchSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center gap-2"
                  >
                    <FiSearch className="w-4 h-4" />
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

              {/* Category Tabs - Desktop */}
              <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-2">
                <button
                  onClick={() => handleCategoryChange("All")}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    selectedCategoryLocal === "All"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                  All Products
                </button>
                {categories && categories.filter(c => c.id !== "All").map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                      selectedCategoryLocal === category.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <MdOutlineCategory className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Selection info bar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {selectedItems.size > 0 && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <FiCheck className="w-3 h-3" />
                      {selectedItems.size} selected
                    </span>
                  )}
                  {crossCategoryCount > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      +{crossCategoryCount} from other categories
                    </span>
                  )}
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <MdSort className="w-4 h-4 text-gray-500" />
                  <label className="text-sm text-gray-500">Sort by:</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Default</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500 text-lg">No products found</p>
                  <button
                    onClick={() => fetchProductsData(1, selectedCategoryLocal, searchTerm)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                    Retry Loading
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid gap-6 ${
                    showCart
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}>
                    {currentProducts.map((product, index) => {
                      const quantity = getProductQuantity(product.id);
                      const productPrice = product.selling_price || product.price;
                      const isSelected = selectedItems.has(product.id);
                      const maxLength = 80;
                      const shouldTruncate = product.description?.length > maxLength;
                      
                      // Calculate final price with GST and discount for display
                      const discountPercent = product.discount_percentage || 0;
                      const gstPercent = product.gst_percentage || 0;
                      const discountAmount = (productPrice * discountPercent) / 100;
                      const priceAfterDiscount = productPrice - discountAmount;
                      const gstAmount = (priceAfterDiscount * gstPercent) / 100;
                      const finalPrice = priceAfterDiscount + gstAmount;

                      return (
                        <div
                          key={product.id}
                          className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group border ${
                            isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
                          }`}
                        >
                          {/* Discount Badge */}
                          {product.discount_percentage > 0 && (
                            <div className="absolute top-3 left-3 z-10">
                              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md flex items-center gap-1">
                                <FaPercentage className="w-3 h-3" />
                                {product.discount_percentage}% OFF
                              </div>
                            </div>
                          )}

                          {/* Selection Checkbox */}
                          <div className="absolute top-3 right-3 z-10">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleCheckboxClick(product, e)}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              disabled={!product.inStock}
                            />
                          </div>

                          {/* Image */}
                          <div 
                            onClick={() => {
                              if (product.isDriveImage && product.driveUrl) {
                                window.open(product.driveUrl, '_blank');
                              } else {
                                openProduct(product);
                              }
                            }} 
                            className="cursor-pointer bg-gray-50 p-4 flex justify-center items-center"
                            data-product-id={product.id}
                          >
                            <div className="relative h-48 w-full flex justify-center items-center">
                              <img
                                src={product.img}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                              />
                              {product.isDriveImage && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                  <HiOutlineExternalLink className="w-3 h-3" />
                                  View in Drive
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <div className="mb-2">
                              <h2 className="font-semibold text-gray-800 line-clamp-1">
                                {product.name || 'Unnamed Product'}
                              </h2>
                              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                <MdOutlineCategory className="w-3 h-3" />
                                {product.category || 'General'} • {product.brand || 'Unknown'}
                              </p>
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                              <p className="text-sm text-gray-500 line-clamp-2 flex items-start gap-1">
                                <FiInfo className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {product.description || 'No description available'}
                              </p>
                              {shouldTruncate && (
                                <button
                                  onClick={() => toggleDescription(product.id)}
                                  className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium"
                                >
                                  {expandedDescriptions[product.id] ? 'Read Less ↑' : 'Read More ↓'}
                                </button>
                              )}
                            </div>

                            {/* Price Section */}
                            <div className="mb-3">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                                  <FaRupeeSign className="w-4 h-4" />
                                  {Math.round(finalPrice).toLocaleString()}
                                </span>
                                {discountPercent > 0 && (
                                  <>
                                    <span className="text-sm text-gray-400 line-through flex items-center gap-1">
                                      <FaRupeeSign className="w-3 h-3" />
                                      {Math.round(productPrice + gstAmount).toLocaleString()}
                                    </span>
                                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                      <FiTag className="w-3 h-3" />
                                      Save {Math.round(discountAmount)}₹
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <p className={`text-xs font-medium flex items-center gap-1 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                              {product.inStock ? (
                                <>
                                  <MdOutlineCheckCircle className="w-3 h-3" />
                                  In Stock
                                </>
                              ) : (
                                <>
                                  <MdOutlineCancel className="w-3 h-3" />
                                  Out of Stock
                                </>
                              )}
                            </p>
                          </div>

                          {/* Buttons */}
                          <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                            {product.inStock ? (
                              quantity === 0 ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => addToCart(product, 1)}
                                    className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium flex items-center justify-center gap-2"
                                  >
                                    <BsCartPlus className="w-4 h-4" />
                                    Add to Cart
                                  </button>
                                  <button
                                    onClick={() => handleBuyNow(product)}
                                    className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                                  >
                                    <BsLightningCharge className="w-4 h-4" />
                                    Buy Now
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between border border-gray-200 rounded-lg overflow-hidden bg-white">
                                    <button
                                      onClick={() => updateQuantity(product.id, quantity - 1)}
                                      className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-lg font-bold transition text-gray-700"
                                    >
                                      <FiMinus className="w-4 h-4" />
                                    </button>
                                    <span className="flex-1 text-center font-semibold text-gray-800">
                                      {quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(product.id, quantity + 1)}
                                      className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-lg font-bold transition text-gray-700"
                                    >
                                      <FiPlus className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleBuyNow(product)}
                                    className="w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-2"
                                  >
                                    <BsLightningCharge className="w-4 h-4" />
                                    Buy Now
                                  </button>
                                </div>
                              )
                            ) : (
                              <button disabled className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed text-sm flex items-center justify-center gap-2">
                                <MdOutlineRemoveShoppingCart className="w-4 h-4" />
                                Out of Stock
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {pagination.last_page > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12 mb-4">
                      <button
                        onClick={() => fetchProductsData(pagination.current_page - 1, selectedCategoryLocal, searchTerm)}
                        disabled={!pagination.prev_page_url || loading}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                          !pagination.prev_page_url || loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {(() => {
                          const totalPages = pagination.last_page;
                          const current = pagination.current_page;
                          let startPage = Math.max(1, current - 2);
                          let endPage = Math.min(totalPages, current + 2);
                          
                          if (endPage - startPage < 4) {
                            if (startPage === 1) endPage = Math.min(totalPages, startPage + 4);
                            if (endPage === totalPages) startPage = Math.max(1, endPage - 4);
                          }
                          
                          return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => fetchProductsData(pageNum, selectedCategoryLocal, searchTerm)}
                              disabled={loading}
                              className={`w-10 h-10 rounded-lg font-medium transition ${
                                pagination.current_page === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ));
                        })()}
                      </div>

                      <button
                        onClick={() => fetchProductsData(pagination.current_page + 1, selectedCategoryLocal, searchTerm)}
                        disabled={!pagination.next_page_url || loading}
                        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                          !pagination.next_page_url || loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filter Overlay */}
        {showFilterOverlay && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilterOverlay(false)}
            />

            <div className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiFilter className="w-5 h-5" />
                  Filters
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategoryLocal("All");
                      setSort("");
                      setMaxPrice(100000);
                      fetchProductsData(1, "All", searchTerm);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilterOverlay(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <MdOutlineCategory className="w-5 h-5" />
                    Categories
                  </h3>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => {
                        handleCategoryChange("All");
                        setShowFilterOverlay(false);
                      }}
                      className={`flex justify-between items-center w-full px-3 py-2 rounded-lg text-left transition-all ${
                        selectedCategoryLocal === "All"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span>All Products</span>
                    </button>
                    {categories && categories.filter(c => c.id !== "All").map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          handleCategoryChange(cat.id);
                          setShowFilterOverlay(false);
                        }}
                        className={`flex justify-between items-center w-full px-3 py-2 rounded-lg text-left transition-all ${
                          selectedCategoryLocal === cat.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <MdOutlinePriceChange className="w-5 h-5" />
                    Max Price
                  </h3>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-sm mt-2 text-gray-500">
                    <span>₹0</span>
                    <span className="font-medium text-gray-700 flex items-center gap-1">
                      <FaRupeeSign className="w-3 h-3" />
                      Up to {maxPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <MdSort className="w-5 h-5" />
                    Sort By
                  </h3>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                  >
                    <option value="">Default</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cart Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out overflow-y-auto ${
            showCart ? "translate-x-0" : "translate-x-full"
          } w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%]`}
        >
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 z-10">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {showCheckout ? (
                    <>
                      <FiCreditCard className="w-5 h-5" />
                      Checkout
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      Shopping Cart
                    </>
                  )}
                </h2>
                {!showCheckout && cart.length > 0 && (
                  <p className="text-sm text-blue-100 mt-1">{getCartItemCount()} items</p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-5">
            {!showCheckout ? (
              <>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-24 h-24 mb-4 text-gray-300">
                      <FiShoppingCart className="w-full h-full" />
                    </div>
                    <p className="text-gray-500 text-center">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-5 max-h-[calc(100vh-280px)] overflow-y-auto">
                      {cart.map((item) => {
                        const sellingPrice = item.selling_price || item.price;
                        const discountPercent = item.discount_percentage || 0;
                        const discountAmount = (sellingPrice * discountPercent) / 100;
                        const priceAfterDiscount = sellingPrice - discountAmount;
                        const itemTotal = priceAfterDiscount * item.quantity;

                        return (
                          <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-contain p-1"
                                onError={handleImageError}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{item.title}</p>
                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                                  <FaRupeeSign className="w-3 h-3" />
                                  {Math.round(itemTotal).toLocaleString()}
                                </span>
                                {discountPercent > 0 && (
                                  <span className="text-xs text-gray-400 line-through flex items-center gap-1">
                                    <FaRupeeSign className="w-3 h-3" />
                                    {Math.round(sellingPrice * item.quantity).toLocaleString()}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition text-gray-600"
                                >
                                  <FiMinus className="w-3 h-3" />
                                </button>
                                <span className="text-sm font-medium w-6 text-center text-gray-700">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition text-gray-600"
                                >
                                  <FiPlus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-xs text-gray-400 hover:text-red-500 transition"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-800 flex items-center gap-1">
                          <FaRupeeSign className="w-3 h-3" />
                          {Math.round(getCartSubtotal()).toLocaleString()}
                        </span>
                      </div>
                      {getTotalDiscountAmount() > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Discount</span>
                          <span className="text-green-600 flex items-center gap-1">
                            -<FaRupeeSign className="w-3 h-3" />
                            {Math.round(getTotalDiscountAmount()).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {getTotalGst() > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">GST</span>
                          <span className="text-gray-800 flex items-center gap-1">
                            +<FaRupeeSign className="w-3 h-3" />
                            {Math.round(getTotalGst()).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-100">
                        <span>Total</span>
                        <span className="text-blue-600 flex items-center gap-1">
                          <FaRupeeSign className="w-3 h-3" />
                          {Math.round(getCartTotal()).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => setShowCheckout(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold mt-2 flex items-center justify-center gap-2"
                      >
                        <BsCartCheck className="w-5 h-5" />
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-5 text-sm"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Cart
                </button>

                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiPackage className="w-4 h-4" />
                    Order Summary
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {cart.map((item) => {
                      const sellingPrice = item.selling_price || item.price;
                      const discountPercent = item.discount_percentage || 0;
                      const priceAfterDiscount = sellingPrice - (sellingPrice * discountPercent / 100);
                      const itemTotal = priceAfterDiscount * item.quantity;

                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.title} x{item.quantity}</span>
                          <span className="font-medium flex items-center gap-1">
                            <FaRupeeSign className="w-3 h-3" />
                            {Math.round(itemTotal).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-blue-600 flex items-center gap-1">
                        <FaRupeeSign className="w-3 h-3" />
                        {Math.round(getCartTotal()).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FiUser className="w-4 h-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                        validationErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {validationErrors.fullName && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {validationErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <FiPhone className="w-4 h-4" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                        validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="10-digit mobile number"
                    />
                    {validationErrors.phone && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" />
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiCreditCard className="w-4 h-4" />
                      Payment Method
                    </label>
                    <div className="flex gap-3">
                      <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FiTruck className="w-4 h-4" />
                          Cash on Delivery
                        </span>
                      </label>
                      <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-not-allowed flex-1 opacity-60">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="online"
                          disabled
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FiCreditCard className="w-4 h-4" />
                          Online (Coming Soon)
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <BsCartCheck className="w-5 h-5" />
                        Place Order • ₹{Math.round(getCartTotal()).toLocaleString()}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md hover:bg-gray-100 text-gray-800"
              >
                <FiX className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                  <div className="relative">
                    {selectedProduct.discount_percentage > 0 && (
                      <div className="absolute -top-3 -left-3 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-lg shadow-md text-sm font-bold flex items-center gap-1">
                          <FaPercentage className="w-3 h-3" />
                          {selectedProduct.discount_percentage}% OFF
                        </div>
                      </div>
                    )}
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      className="max-h-80 object-contain"
                      onError={handleImageError}
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                    <MdOutlineCategory className="w-4 h-4" />
                    {selectedProduct.category} • {selectedProduct.brand}
                  </p>

                  <div className="mb-4">
                    {(() => {
                      const basePrice = selectedProduct.selling_price || selectedProduct.price;
                      const discountPercent = selectedProduct.discount_percentage || 0;
                      const gstPercent = selectedProduct.gst_percentage || 0;
                      const discountAmount = (basePrice * discountPercent) / 100;
                      const priceAfterDiscount = basePrice - discountAmount;
                      const gstAmount = (priceAfterDiscount * gstPercent) / 100;
                      const finalPrice = priceAfterDiscount + gstAmount;

                      return (
                        <div>
                          {discountPercent > 0 && (
                            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                              <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                <FaRupeeSign className="w-4 h-4" />
                                {Math.round(finalPrice).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 line-through flex items-center gap-1">
                                <FaRupeeSign className="w-3 h-3" />
                                {Math.round(basePrice + gstAmount).toLocaleString()}
                              </span>
                              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <FiTag className="w-3 h-3" />
                                Save {Math.round(discountAmount)}₹
                              </span>
                            </div>
                          )}
                          {discountPercent === 0 && (
                            <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                              <FaRupeeSign className="w-5 h-5" />
                              {Math.round(finalPrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
                  
                  <div className="flex items-center gap-4 mb-5">
                    <p className={`text-sm font-medium flex items-center gap-1 ${selectedProduct.inStock ? 'text-green-600' : 'text-red-500'}`}>
                      {selectedProduct.inStock ? (
                        <>
                          <MdOutlineCheckCircle className="w-4 h-4" />
                          In Stock
                        </>
                      ) : (
                        <>
                          <MdOutlineCancel className="w-4 h-4" />
                          Out of Stock
                        </>
                      )}
                    </p>
                    {selectedProduct.unit && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiPackage className="w-4 h-4" />
                        Unit: {selectedProduct.unit}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {selectedProduct.inStock ? (
                      getProductQuantity(selectedProduct.id) === 0 ? (
                        <>
                          <button
                            onClick={() => {
                              addToCart(selectedProduct, 1);
                              closeModal();
                            }}
                            className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                          >
                            <BsCartPlus className="w-4 h-4" />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => {
                              closeModal();
                              handleBuyNow(selectedProduct);
                            }}
                            className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                          >
                            <BsLightningCharge className="w-4 h-4" />
                            Buy Now
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 flex items-center justify-between border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) - 1)}
                              className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-xl text-gray-700"
                            >
                              <FiMinus className="w-4 h-4 mx-auto" />
                            </button>
                            <span className="flex-1 text-center font-semibold text-gray-800">
                              {getProductQuantity(selectedProduct.id)}
                            </span>
                            <button
                              onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) + 1)}
                              className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-xl text-gray-700"
                            >
                              <FiPlus className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              closeModal();
                              handleBuyNow(selectedProduct);
                            }}
                            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                          >
                            <BsLightningCharge className="w-4 h-4" />
                            Buy Now
                          </button>
                        </>
                      )
                    ) : (
                      <button disabled className="w-full py-3 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                        <MdOutlineRemoveShoppingCart className="w-4 h-4" />
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup Notification */}
      {popup && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl z-[9999] animate-slide-up text-sm flex items-center gap-2">
          <FiCheck className="w-4 h-4" />
          {popupMessage}
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;