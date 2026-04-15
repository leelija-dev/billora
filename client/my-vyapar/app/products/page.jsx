'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAuthData } from '../../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({}); 
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
  const [showFilterOverlay, setShowFilterOverlay] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  // const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const [selectedItems, setSelectedItems] = useState(new Set());

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
      const token = localStorage.getItem("token");

      if (paymentMethod === 'online') {
        const orderData = {
          user_id: user.id,
          store_id: storeId,
          customer_name: formData.fullName.trim(),
          customer_phone: cleanPhone,
          product_id: cart.map(item => item.id),
          quantity: cart.map(item => item.quantity),
          unit_id: cart.map(item => item.unit_id || 1),
          payment_mode: 'online'
        };

        const response = await fetch('http://localhost:8000/api/orders/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify(orderData)
        });

        const res = await response.json();

        toast.dismiss(loadingToast);

        if (res.payment_session_id) {
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

          setTimeout(() => {
            clearInterval(waitForCashfree);
            if (!window.Cashfree) {
              toast.error("Payment gateway not loaded. Please refresh and try again.");
              setIsPlacingOrder(false);
            }
          }, 10000);

        } else {
          toast.error(res.message || "Failed to initialize payment");
          setIsPlacingOrder(false);
        }

      } else {
        const orderData = {
          user_id: user.id,
          store_id: storeId,
          customer_name: formData.fullName.trim(),
          customer_phone: cleanPhone,
          product_id: cart.map(item => item.id),
          quantity: cart.map(item => item.quantity),
          unit_id: cart.map(item => item.unit_id || 1)
        };

        const response = await fetch('http://localhost:8000/api/orders/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify(orderData)
        });

        const res = await response.json();

        toast.dismiss(loadingToast);

        if (response.ok) {
          toast.success('Order placed successfully!');

          const orderInfo = {
            orderId: res.order_id || `ORD${Date.now()}`,
            totalAmount: getCartTotal(),
            items: cart.length,
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
        } else {
          throw new Error(res.message || 'Failed to create order');
        }
        setIsPlacingOrder(false);
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('❌ Order error:', error);
      setPopupMessage(error.message || 'Failed to place order. Please try again.');
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
      setIsPlacingOrder(false);
    }
  };

  const fetchProductsData = async (page = 1) => {
    setCurrentPage(page);
    try {
      setLoading(true);
      const { user } = getAuthData();
      if (!user || !user.id) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/restaurant-all-products/${user.id}?page=${page}&per_page=12`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      });
      const productsData = await response.json();
console.log ("Raw products data from API:", productsData);
      let productsArray = [];
      if (productsData?.products?.data && Array.isArray(productsData.products.data)) {
        productsArray = productsData.products.data;
      } else if (Array.isArray(productsData)) {
        productsArray = productsData;
      } else if (productsData?.data) {
        productsArray = productsData.data;
      }

      const transformedProducts = productsArray.map(product => {
        let imageUrl = product.image;

        if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
        } else if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:8000${imageUrl}`;
        } else if (imageUrl && imageUrl !== "") {
          imageUrl = `http://localhost:8000/storage/${imageUrl}`;
        } else {
          imageUrl = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
        }

        return {
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
          img: imageUrl,
        };
      });

      setProducts(transformedProducts);
      setPagination({
      current_page: productsData.products.current_page,
      last_page: productsData.products.last_page,
      per_page: productsData.products.per_page,
      total: productsData.products.total,
      next_page_url: productsData.products.next_page_url,
      prev_page_url: productsData.products.prev_page_url,
      first_page_url: productsData.products.first_page_url,
      last_page_url: productsData.products.last_page_url,
      links: productsData.products.links
    });
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = useCallback(() => {
    const cats = products.map(p => p.category || "General");
    return ["All", ...new Set(cats)];
  }, [products]);

  const categories = getCategories();

  // const applyFiltersAndSort = useCallback(() => {
  //   let filtered = [...products];

  //   if (search) {
  //     filtered = filtered.filter(p =>
  //       p.name?.toLowerCase().includes(search.toLowerCase()) ||
  //       p.category?.toLowerCase().includes(search.toLowerCase()) ||
  //       p.brand?.toLowerCase().includes(search.toLowerCase())
  //     );
  //   }

  //   if (category !== "All") {
  //     filtered = filtered.filter(p => p.category === category);
  //   }

  //   filtered = filtered.filter(p => (p.selling_price || p.price) <= maxPrice);

  //   if (sort === "low") {
  //     filtered.sort((a, b) => (a.selling_price || a.price) - (b.selling_price || b.price));
  //   } else if (sort === "high") {
  //     filtered.sort((a, b) => (b.selling_price || b.price) - (a.selling_price || a.price));
  //   }

  //   return filtered;
  // }, [products, search, category, maxPrice, sort]);

  // useEffect(() => {
  //   if (products.length > 0) {
  //     const filtered = applyFiltersAndSort();
  //     setFilteredProducts(filtered);
  //     setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  //     setCurrentPage(1);
  //   }
  // }, [products, search, category, maxPrice, sort, applyFiltersAndSort]);
// useEffect(() => {
//   if (products.length > 0) {
//     const filtered = applyFiltersAndSort();
//     setFilteredProducts(filtered);
//     // Remove setTotalPages line - backend pagination handles this
//     setCurrentPage(1);
//   }
// }, [products, search, category, maxPrice, sort, applyFiltersAndSort]);
  // const getCurrentPageProducts = () => {
  //   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  //   const endIndex = startIndex + PRODUCTS_PER_PAGE;
  //   return filteredProducts.slice(startIndex, endIndex);
  // };

  // const goToPage = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // };

  // const goToPrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // };

  // const goToNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // };

  useEffect(() => {
    fetchProductsData(1);
  }, []);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleImageError = (e) => {
    e.currentTarget.src = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
  };

  const clearSearch = () => {
    setSearch("");
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
        className="fixed left-4 top-24 z-30 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Floating Cart Button - Top Right Corner */}
      <div className="fixed top-5 right-5 z-40">
        <button
          onClick={() => {
            setShowCart(!showCart);
            if (!showCart) {
              setShowFilterOverlay(false);
            }
          }}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition relative"
        >
          🛒
          {getCartItemCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Products Grid */}
        <div className={`flex-1 transition-all duration-300 ${showCart ? 'lg:mr-[40%]' : 'mr-0'}`}>
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-800">
              Our Products
            </h1>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-800"
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
            </div>

            {/* Selection info bar */}
            <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedItems.size > 0 && (
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {selectedItems.size} selected
                  </span>
                )}
                {crossCategoryCount > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    +{crossCategoryCount} from other categories
                  </span>
                )}
              </div>
            </div>

            {/* Products Grid */}
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
                <div className={`grid gap-6 ${showCart
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}>
                  {currentProducts.map((product, index) => {
                    const quantity = getProductQuantity(product.id);
                    const productPrice = product.selling_price || product.price;
                    const isSelected = selectedItems.has(product.id);
                    const maxLength = 80;
                    const shouldTruncate = product.description?.length > maxLength;

                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 relative group border-2 flex flex-col h-full ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
                      >
                        {/* Discount Badge */}
                        {product.discount_percentage > 0 && (
                          <div className="absolute -top-3 -left-3 z-20">
                            <div className="relative">
                              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg shadow-lg transform -rotate-12">
                                <span className="text-xs font-bold">{product.discount_percentage}% OFF</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Selection Checkbox */}
                        <div className="absolute top-3 right-3 z-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleCheckboxClick(product, e)}
                            className="w-5 h-5 accent-blue-600 cursor-pointer"
                            disabled={!product.inStock}
                          />
                        </div>

                        {/* Image */}
                        <div onClick={() => openProduct(product)} className="cursor-pointer flex-shrink-0">
                          <div className="relative h-40 mb-4 flex justify-center items-center bg-gray-50 rounded-lg">
                            <img
                              src={product.img}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              onError={handleImageError}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                          <h2 className="font-bold text-lg text-gray-800 mt-1 break-words leading-tight text-left">
                            {product.name || 'Unnamed Product'}
                          </h2>

                          {/* Description */}
                          <div className="text-left mt-1">
                            <p className="text-sm text-gray-500">
                              {shouldTruncate && !expandedDescriptions[product.id]
                                ? `${product.description.substring(0, maxLength)}...`
                                : product.description || 'No description available'}
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

                          <p className="text-xs text-gray-400 mt-2 text-left">
                            {product.category || 'General'} • {product.brand || 'Unknown'}
                          </p>

                          {/* Price Section */}
                          <div className="mt-2 text-left">
                            {(() => {
                              const basePrice = product.selling_price || product.price;
                              const discountPercent = product.discount_percentage || 0;
                              const gstPercent = product.gst_percentage || 0;

                              const discountAmount = (basePrice * discountPercent) / 100;
                              const finalPrice = basePrice - discountAmount;
                              const mrp = basePrice;

                              return (
                                <>
                                  {discountPercent > 0 && (
                                    <p className="text-xs text-gray-400 line-through">
                                      MRP: ₹{Math.round(mrp).toLocaleString()}
                                    </p>
                                  )}
                                  <p className="text-2xl font-bold text-blue-600">
                                    ₹{Math.round(finalPrice).toLocaleString()}
                                  </p>
                                  {discountPercent > 0 && (
                                    <p className="text-xs text-green-500">
                                      Save ₹{truncateTo2Decimals(discountAmount)}
                                    </p>
                                  )}
                                </>
                              );
                            })()}
                          </div>

                          <p className={`text-xs mt-2 text-left font-medium ${product.inStock ? 'text-blue-600' : 'text-red-600'}`}>
                            {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                          </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
                          {product.inStock ? (
                            quantity === 0 ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, 1);
                                  }}
                                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                                >
                                  Add to Cart
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyNow(product);
                                  }}
                                  className="w-full py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold text-sm"
                                >
                                  Buy Now →
                                </button>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between border-2 border-blue-200 rounded-lg overflow-hidden bg-blue-50 w-full">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product.id, quantity - 1);
                                    }}
                                    className="w-10 h-9 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-lg font-bold transition text-blue-700"
                                  >
                                    −
                                  </button>
                                  <span className="flex-1 text-center font-semibold text-base text-gray-800">
                                    {quantity}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateQuantity(product.id, quantity + 1);
                                    }}
                                    className="w-10 h-9 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-lg font-bold transition text-blue-700"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuyNow(product);
                                  }}
                                  className="w-full py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition font-semibold text-sm"
                                >
                                  Buy Now →
                                </button>
                              </>
                            )
                          ) : (
                            <button disabled className="w-full py-2.5 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed text-sm">
                              Out of Stock
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {/* Backend Pagination */}
{pagination.last_page > 1 && (
  <div className="flex justify-center items-center gap-2 mt-8 mb-4">
    <button
      onClick={() => fetchProductsData(pagination.current_page - 1)}
      disabled={!pagination.prev_page_url || loading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        !pagination.prev_page_url || loading
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      ← Previous
    </button>
    
    <div className="flex gap-1">
      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
        let pageNum;
        if (pagination.last_page <= 5) {
          pageNum = i + 1;
        } else if (pagination.current_page <= 3) {
          pageNum = i + 1;
        } else if (pagination.current_page >= pagination.last_page - 2) {
          pageNum = pagination.last_page - 4 + i;
        } else {
          pageNum = pagination.current_page - 2 + i;
        }
        
        return (
          <button
            key={pageNum}
            onClick={() => fetchProductsData(pageNum)}
            disabled={loading}
            className={`w-10 h-10 rounded-lg font-medium transition ${
              pagination.current_page === pageNum
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
    
    <button
      onClick={() => fetchProductsData(pagination.current_page + 1)}
      disabled={!pagination.next_page_url || loading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        !pagination.next_page_url || loading
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      Next →
    </button>
  </div>
)}
              </>
            )}
          </div>
        </div>

        {/* Filter Overlay */}
        {showFilterOverlay && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilterOverlay(false)}
            />

            <div className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-2xl overflow-y-auto max-h-screen">
              <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilterOverlay(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6 pb-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">🧰 Filters</h2>
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
                            : "bg-gray-100 hover:bg-blue-50 hover:translate-x-1 text-gray-700"
                            }`}
                        >
                          <span>{cat}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${category === cat ? "bg-white text-blue-600" : "bg-gray-200 text-gray-600"
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
                    <span className="font-semibold text-gray-800">Up to ₹{maxPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">🔃 Sort By</h3>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
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
  className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out overflow-y-auto overflow-x-hidden ${
    showCart ? "translate-x-0" : "translate-x-full"
  } w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[40%]`}
  style={{ overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin' }}
>
          <div className="relative p-4 pt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-6 -mt-6"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-6 -mb-6"></div>

            <div className="flex justify-between items-start relative">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-xl">🛍️</span>
                  <span>
                    {showCheckout ? 'Secure Checkout' : (
                      <>
                        Your Cart
                        <span className="ml-2 text-xs bg-white/30 px-2 py-0.5 rounded-full">
                          {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
                        </span>
                      </>
                    )}
                  </span>
                </h2>
                {cart.length > 0 && !showCheckout && (
                  <button
                    onClick={() => {
                      setCart([]);
                      setSelectedItems(new Set());
                      sessionStorage.removeItem('cart');
                      sessionStorage.removeItem('selectedItems');
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors mt-1"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowCart(false);
                  setShowCheckout(false);
                  setShowFilterOverlay(false);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition backdrop-blur-sm text-white hover:scale-110 flex-shrink-0"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>
          </div>

          <div className="px-3 py-3 pb-2 flex flex-col h-full">
            {!showCheckout ? (
              <>
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-3 flex-1">
                    <div className="w-20 h-20 mb-4 opacity-50">
                      <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm mb-2 text-center">Your cart is empty</p>
                    <button
                      onClick={() => setShowCart(false)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Scrollable cart items */}
                    <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                      {cart.map((item) => {
                        const sellingPrice = item.selling_price || item.price;
                        const sellAfterDis = (item.selling_price - ((item.selling_price * item.discount_percentage) / 100));
                        const itemTotal = sellAfterDis * item.quantity;

                        return (
                          <div key={item.id} className="flex gap-3 items-start bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <div className="relative w-14 h-14 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex-shrink-0">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-full object-contain p-1"
                                onError={handleImageError}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                              <p className="text-xs text-gray-500">
                                ₹{truncateTo2Decimals(sellingPrice)}
                              </p>
                              {item.discount_percentage > 0 && (
                                <p className="text-xs text-blue-600">{item.discount_percentage}% off</p>
                              )}

                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded hover:border-blue-500 hover:text-blue-600 transition-all text-gray-700 text-sm"
                                >
                                  −
                                </button>
                                <span className="text-sm font-semibold w-6 text-center text-gray-700">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center bg-white border border-gray-300 rounded hover:border-blue-500 hover:text-blue-600 transition-all text-gray-700 text-sm"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-blue-600 text-sm">₹{truncateTo2Decimals(itemTotal)}</p>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Checkout button */}
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg font-semibold text-sm mt-3"
                    >
                      Checkout
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="space-y-4 pb-2 flex flex-col h-full">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm mb-1 self-start"
                >
                  <span className="text-lg">←</span>
                  <span>Back to Cart</span>
                </button>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border border-blue-100 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)' }}>
                  <h3 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-2 sticky top-0 bg-blue-50 py-1">
                    <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    {cart.map((item) => {
                      const basePrice = item.selling_price || item.price;
                      const discountPercent = item.discount_percentage || 0;
                      const gstPercent = item.gst_percentage || 0;
                      const quantity = item.quantity;

                      const discountAmount = (basePrice * discountPercent) / 100;
                      const gstAmount = ((basePrice - discountAmount) * gstPercent) / 100;
                      const itemTotal = basePrice * quantity;

                      const totalGstForItem = gstAmount * quantity;
                      const totalDiscountForItem = discountAmount * quantity;

                      return (
                        <div key={item.id} className="border-b border-blue-100 pb-2 last:border-0">
                          {/* Product Name and Total Price - Right aligned */}
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                            <p className="font-bold text-blue-600 text-sm">₹{truncateTo2Decimals(itemTotal)}</p>
                          </div>

                          {/* Quantity, GST, Discount - Each with right-aligned values */}
                          <div className="space-y-0.5 pl-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Quantity:</span>
                              <span className="text-gray-600">{quantity}</span>
                            </div>
                            {discountPercent > 0 && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Discount ({discountPercent}%):</span>
                                <span className="text-green-600">- ₹{truncateTo2Decimals(totalDiscountForItem)}</span>
                              </div>
                            )}
                            {gstPercent > 0 && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">GST ({gstPercent}%):</span>
                                <span className="text-gray-600">+ ₹{truncateTo2Decimals(totalGstForItem)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-blue-100 mt-3 pt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal:</span>
                      <span style={{ color: "black" }}>₹{truncateTo2Decimals(getCartSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Total GST:</span>
                      <span className="text-gray-600">+ ₹{truncateTo2Decimals(getTotalGst())}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Total Discount:</span>
                      <span className="text-green-600">- ₹{truncateTo2Decimals(getTotalDiscountAmount())}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-2 border-t border-blue-100">
                      <span style={{ color: "black" }}> Total Price:</span>
                      <span className="text-blue-600">₹{truncateTo2Decimals(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-2 border-t border-blue-100">
                      <span style={{ color: "black" }}>Grand Total (rounded):</span>
                      <span className="text-blue-600">₹{Math.round(getCartTotal()).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Form */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">📦</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Customer Info</h3>
                </div>

<form onSubmit={handlePlaceOrder} className="space-y-3">
  {/* Full Name */}
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
    <input
      type="text"
      name="fullName"
      value={formData.fullName}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
        validationErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
      }`}
      placeholder="John Doe"
    />
    {validationErrors.fullName && (
      <p className="text-xs text-red-500 mt-1">{validationErrors.fullName}</p>
    )}
  </div>

  {/* Phone Number */}
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleInputChange}
      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
        validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
      }`}
      placeholder="9876543210"
    />
    {validationErrors.phone && (
      <p className="text-xs text-red-500 mt-1">{validationErrors.phone}</p>
    )}
  </div>

  <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">📦</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">Payment Corner</h3>
                </div>

  {/* Payment Method */}
  <div className="flex gap-2">
    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1 text-sm">
      <input
        type="radio"
        name="paymentMethod"
        value="cod"
        checked={paymentMethod === "cod"}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-4 h-4 accent-blue-600"
      />
      <span style={{ color: 'black' }}>COD</span>
    </label>
    <label className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1 text-sm">
      <input
        type="radio"
        name="paymentMethod"
        value="online"
        checked={paymentMethod === "online"}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-4 h-4 accent-blue-600"
      />
      <span style={{ color: 'black' }}>Online</span>
    </label>
  </div>

  <button
    type="submit"
    disabled={isPlacingOrder}
    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium disabled:opacity-50 text-sm"
  >
    {isPlacingOrder ? (
      <span className="flex items-center justify-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        Processing...
      </span>
    ) : (
      paymentMethod === 'online' ? `Pay ₹${Math.round(getCartTotal())}` : `Place Order • ₹${Math.round(getCartTotal())}`
    )}
  </button>
</form>
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 z-50 bg-white/80 backdrop-blur rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md hover:bg-gray-100 text-gray-800"
              >
                ✕
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="relative">
                  <div className="relative h-52 sm:h-64 md:h-80 bg-gray-50 rounded-lg">
                    {selectedProduct?.discount_percentage > 0 && (
                      <div className="absolute -top-3 -left-3 z-20">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-lg shadow-lg transform -rotate-12">
                          <span className="text-xs font-bold">{selectedProduct.discount_percentage}% OFF</span>
                        </div>
                      </div>
                    )}
                    <img
                      src={selectedProduct.img}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain p-4"
                      onError={handleImageError}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-800">{selectedProduct.name}</h2>
                  <p className="text-gray-500 text-sm sm:text-base mb-3">
                    {selectedProduct.category} • {selectedProduct.brand}
                  </p>

                  <div className="mt-3">
                    {(() => {
                      const basePrice = selectedProduct.selling_price;
                      const discountPercent = selectedProduct.discount_percentage || 0;
                      const gstPercent = selectedProduct.gst_percentage || 0;

                      const gstAmount = (basePrice * gstPercent) / 100;
                      const discountAmount = (basePrice * discountPercent) / 100;
                      const finalPrice = basePrice + gstAmount - discountAmount;
                      const mrp = basePrice + gstAmount;

                      return (
                        <>
                          {discountPercent > 0 && (
                            <p className="text-sm text-gray-400 line-through">
                              MRP: ₹{Math.round(mrp).toLocaleString()}
                            </p>
                          )}
                          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                            ₹{Math.round(finalPrice).toLocaleString()}
                          </p>
                          {discountPercent > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                              Save ₹{truncateTo2Decimals(discountAmount)}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base my-4">{selectedProduct.description}</p>
                  <p className={`text-sm mb-4 font-medium ${selectedProduct.inStock ? 'text-blue-600' : 'text-red-600'}`}>
                    {selectedProduct.inStock ? '✓ In Stock' : '✗ Out of Stock'}
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
                          <div className="flex-1 flex items-center justify-between border-2 border-blue-200 rounded-lg overflow-hidden bg-blue-50">
                            <button onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) - 1)} className="w-12 h-12 bg-blue-100 hover:bg-blue-200 text-xl text-blue-700">−</button>
                            <span className="flex-1 text-center font-semibold text-lg text-gray-800">{getProductQuantity(selectedProduct.id)}</span>
                            <button onClick={() => updateQuantity(selectedProduct.id, getProductQuantity(selectedProduct.id) + 1)} className="w-12 h-12 bg-blue-100 hover:bg-blue-200 text-xl text-blue-700">+</button>
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
                      <button disabled className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-400">Out of Stock</button>
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
        <div className="fixed bottom-20 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-2xl z-[9999] animate-slide-up text-sm">
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