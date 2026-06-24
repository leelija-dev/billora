// pages/Sellers/SellerDetails.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPackage,
  FiSearch,
  FiX,
  FiRefreshCw,
  FiEdit2,
  FiDollarSign,
  FiFileText,
  FiCalendar,
  FiTag,
  FiBox,
  FiShoppingBag,
  FiPercent,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import Pagination from "../../components/common/Pagination/Pagination";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import useSellerStore from "../../store/sellerStore";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const SellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    sellerProducts,
    sellerProductsTotal,
    sellerProductsCurrentPage,
    sellerProductsPageSize,
    sellerProductsLoading,
    sellerProductsPagination,
    sellerProductsSearch,
    currentSellerId,
    fetchSellerProducts,
    clearSellerProducts,
    getSellerById,
    updateSeller,
    fetchSellers,
  } = useSellerStore();

  // Seller state
  const [seller, setSeller] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Products state
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Refs to prevent duplicate requests
  const sellerFetchedRef = useRef(false);
  const productsFetchedRef = useRef(false);
  const searchTimeoutRef = useRef(null);
  const initialFetchDoneRef = useRef(false);
  const isUpdatingRef = useRef(false);

  // Get current user ID
  const getUserId = () => {
    if (user && user.id) {
      return user.id.toString();
    }
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const userId = parsed.state?.user?.id || parsed.user?.id;
        return userId ? userId.toString() : "1";
      } catch (error) {
        console.error("Error parsing auth storage:", error);
        return "1";
      }
    }
    return "1";
  };

  const currentUserId = getUserId();

  // Memoized fetch functions
  const fetchSellerDetails = useCallback(async (showLoading = true) => {
    if (sellerFetchedRef.current && !isUpdatingRef.current) return;
    sellerFetchedRef.current = true;

    try {
      if (showLoading) {
        setSellerLoading(true);
      }
      const sellerData = await getSellerById(id);
      setSeller(sellerData);
      // Initialize edit form data
      if (sellerData) {
        setEditFormData({
          name: sellerData.name || "",
          email: sellerData.email || "",
          phone: sellerData.phone || "",
          address: sellerData.address || "",
          city: sellerData.city || "",
          state: sellerData.state || "",
          pincode: sellerData.pincode || "",
          gst_number: sellerData.gst_number || "",
          due_amount: sellerData.due_amount || 0,
        });
      }
      console.log("📝 Seller details loaded:", sellerData);
    } catch (error) {
      console.error("❌ Failed to fetch seller details:", error);
      toast.error("Failed to load seller details");
    } finally {
      if (showLoading) {
        setSellerLoading(false);
      }
      isUpdatingRef.current = false;
    }
  }, [id, getSellerById]);

  const fetchProducts = useCallback(async () => {
    if (productsFetchedRef.current || !id) return;
    productsFetchedRef.current = true;

    try {
      await fetchSellerProducts(id);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    } finally {
      setInitialLoading(false);
    }
  }, [id, fetchSellerProducts]);

  // Fetch seller details
  useEffect(() => {
    if (id && !sellerFetchedRef.current) {
      fetchSellerDetails(true);
    }

    return () => {
      clearSellerProducts();
      sellerFetchedRef.current = false;
      productsFetchedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [id, fetchSellerDetails, clearSellerProducts]);

  // Fetch seller products
  useEffect(() => {
    if (id && !productsFetchedRef.current && !initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchProducts();
    }

    return () => {
      productsFetchedRef.current = false;
    };
  }, [id, fetchProducts]);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!id) return;

    if (!searchTerm && productsFetchedRef.current && sellerProducts.length > 0) {
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (id) {
        console.log("🔍 Searching products with term:", searchTerm);
        productsFetchedRef.current = false;
        fetchSellerProducts(id, 1, searchTerm).finally(() => {
          productsFetchedRef.current = true;
        });
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, id, fetchSellerProducts, sellerProducts.length]);

  // Handle edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setValidationErrors({});
      setEditFormData({
        name: seller.name || "",
        email: seller.email || "",
        phone: seller.phone || "",
        address: seller.address || "",
        city: seller.city || "",
        state: seller.state || "",
        pincode: seller.pincode || "",
        gst_number: seller.gst_number || "",
        due_amount: seller.due_amount || 0,
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!editFormData.name || editFormData.name.trim() === "") {
      errors.name = "Name is required";
    }
    if (editFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      errors.email = "Invalid email format";
    }
    if (editFormData.phone && !/^[0-9]{10}$/.test(editFormData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (editFormData.pincode && !/^[0-9]{6}$/.test(editFormData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit - FIXED: No unnecessary re-renders
  const handleSubmitEdit = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const input = firstError.querySelector('input');
        if (input) input.focus();
      }
      toast.error("Please fix the validation errors");
      return;
    }

    setEditLoading(true);
    setIsRefreshing(true);
    
    try {
      const data = {
        ...editFormData,
        user_id: currentUserId,
      };

      await updateSeller(id, data);
      console.log("✅ Seller updated successfully");
      
      // Show success animation
      setShowSuccess(true);
      
      // Update local seller data without refetching
      setSeller(prev => ({
        ...prev,
        ...editFormData
      }));
      
      // Refresh the sellers list in the background (don't await to prevent blocking)
      fetchSellers(currentUserId).catch(err => console.error("Background refresh failed:", err));
      
      toast.success("Seller updated successfully");
      
      // Hide success animation and close edit mode after delay
      setTimeout(() => {
        setShowSuccess(false);
        setIsEditing(false);
        setEditLoading(false);
        setIsRefreshing(false);
      }, 600);
      
    } catch (error) {
      console.error("Error updating seller:", error);
      toast.error(error.response?.data?.message || "Failed to update seller");
      setShowSuccess(false);
      setEditLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (id) {
      productsFetchedRef.current = false;
      await fetchSellerProducts(id, 1, searchTerm);
      productsFetchedRef.current = true;
    }
    setRefreshing(false);
    toast.success("Products refreshed");
  };

  const handlePageChange = (pageOrUrl) => {
    let page = pageOrUrl;
    if (typeof pageOrUrl === "string") {
      const pageMatch = pageOrUrl.match(/page=(\d+)/);
      if (pageMatch) {
        page = parseInt(pageMatch[1]);
      } else {
        page = 1;
      }
    }

    if (typeof page === "number" && id) {
      fetchSellerProducts(id, page, searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (id) {
      productsFetchedRef.current = false;
      fetchSellerProducts(id, 1, "");
      productsFetchedRef.current = true;
    }
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Product columns
  const productColumns = [
    {
      id: "product_info",
      header: "Product",
      accessor: "products",
      cell: (value, row) => {
        const product = value || {};
        return (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <FiPackage className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {product.name || "N/A"}
              </p>
              {product.sku && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SKU: {product.sku}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "product_sku",
      header: "SKU",
      accessor: "sku",
      cell: (value, row) => {
        const product = row?.products || {};
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-mono rounded-lg">
            {product.sku || "N/A"}
          </span>
        );
      },
    },
    {
      id: "product_quantity",
      header: "Quantity",
      accessor: "qty",
      cell: (value) => {
        const qty = parseFloat(value) || 0;
        return (
          <span className="font-medium text-gray-900 dark:text-white">
            {qty.toFixed(2)}
          </span>
        );
      },
    },
    {
      id: "product_purchase_price",
      header: "Purchase Price",
      accessor: "purchase_price",
      cell: (value) => (
        <div className="flex items-center">
          <FaRupeeSign className="w-3 h-3 text-gray-500 mr-1" />
          <span className="font-medium text-gray-900 dark:text-white">
            {parseFloat(value || 0).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      id: "product_selling_price",
      header: "Selling Price",
      accessor: "selling_price",
      cell: (value, row) => {
        const product = row?.products || {};
        const sellingPrice = product.selling_price || 0;
        return (
          <div className="flex items-center">
            <FaRupeeSign className="w-3 h-3 text-gray-500 mr-1" />
            <span className="font-medium text-gray-900 dark:text-white">
              {parseFloat(sellingPrice).toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      id: "product_gst",
      header: "GST",
      accessor: "gst_percentage",
      cell: (value) => {
        const gst = parseFloat(value) || 0;
        return (
          <div className="flex items-center">
            <FiPercent className="w-3 h-3 text-gray-500 mr-1" />
            <span className="font-medium text-gray-900 dark:text-white">
              {gst.toFixed(2)}%
            </span>
          </div>
        );
      },
    },
    {
      id: "product_invoice",
      header: "Invoice",
      accessor: "invoice_number",
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value || "N/A"}
        </span>
      ),
    },
    {
      id: "product_date",
      header: "Date",
      accessor: "invoice_date",
      cell: (value) => (
        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
          <FiCalendar className="w-3 h-3" />
          <span>{value ? formatDate(value) : "N/A"}</span>
        </div>
      ),
    },
  ];

  // Loading Skeleton
  const SkeletonLoader = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Loading products...
        </p>
      </div>
    </div>
  );

  // Seller Info Skeleton
  const SellerInfoSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  // Render view mode
  const renderViewMode = () => (
    <motion.div
      key="view-mode"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FiUser className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <motion.h1 
              className="text-2xl font-bold text-gray-900 dark:text-white"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {seller.name}
            </motion.h1>
            {seller.gst_number && (
              <motion.p 
                className="text-sm text-gray-500 dark:text-gray-400"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                GST: {seller.gst_number}
              </motion.p>
            )}
            <motion.div 
              className="flex items-center mt-1"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className={`text-sm font-medium ${
                  parseFloat(seller.due_amount) > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                Due Amount: {formatCurrency(seller.due_amount)}
              </span>
              {parseFloat(seller.due_amount) > 0 && (
                <motion.span 
                  className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.25, type: "spring" }}
                >
                  Payment Due
                </motion.span>
              )}
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="flex space-x-2"
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Button
            variant="primary"
            onClick={handleEditToggle}
            icon={FiEdit2}
          >
            Edit Seller
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
          >
            <FiFileText className="w-4 h-4 mr-2" />
            Print
          </Button>
        </motion.div>
      </div>

      {/* Contact & Address */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Contact Information
          </h4>
          {seller.email && (
            <motion.div 
              className="flex items-center space-x-3 text-sm"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <FiMail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {seller.email}
              </span>
            </motion.div>
          )}
          {seller.phone && (
            <motion.div 
              className="flex items-center space-x-3 text-sm"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FiPhone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {seller.phone}
              </span>
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Address Information
          </h4>
          {seller.address && (
            <motion.div 
              className="flex items-start space-x-3 text-sm"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-gray-600 dark:text-gray-400">
                <p>{seller.address}</p>
                {(seller.city || seller.state) && (
                  <p>
                    {[seller.city, seller.state].filter(Boolean).join(", ")}
                  </p>
                )}
                {seller.pincode && <p>Pincode: {seller.pincode}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Meta Info */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Seller ID</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            #{seller.id}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {sellerProductsTotal || 0}
          </p>
        </div>
        {seller.created_at && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(seller.created_at)}
            </p>
          </div>
        )}
        {seller.updated_at && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Updated</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(seller.updated_at)}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  // Render edit form
  const renderEditForm = () => (
    <motion.div
      key="edit-mode"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <FiEdit2 className="w-6 h-6 mr-2 text-blue-500" />
          Edit Seller
        </motion.h2>
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="outline"
            onClick={handleEditToggle}
            disabled={editLoading}
          >
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {/* Name Field */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="name"
            value={editFormData?.name || ""}
            onChange={handleInputChange}
            className={`transition-all duration-300 ${validationErrors.name ? "border-red-500 shake" : ""}`}
            placeholder="Enter seller name"
            autoFocus
          />
          <AnimatePresence>
            {validationErrors.name && (
              <motion.p 
                className="text-red-500 text-xs mt-1 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FiAlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* GST Field */}
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GST Number
          </label>
          <Input
            type="text"
            name="gst_number"
            value={editFormData?.gst_number || ""}
            onChange={handleInputChange}
            placeholder="Enter GST number"
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={editFormData?.email || ""}
            onChange={handleInputChange}
            className={`transition-all duration-300 ${validationErrors.email ? "border-red-500 shake" : ""}`}
            placeholder="Enter email address"
          />
          <AnimatePresence>
            {validationErrors.email && (
              <motion.p 
                className="text-red-500 text-xs mt-1 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FiAlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Phone Field */}
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <Input
            type="tel"
            name="phone"
            value={editFormData?.phone || ""}
            onChange={handleInputChange}
            className={`transition-all duration-300 ${validationErrors.phone ? "border-red-500 shake" : ""}`}
            placeholder="Enter 10-digit phone number"
          />
          <AnimatePresence>
            {validationErrors.phone && (
              <motion.p 
                className="text-red-500 text-xs mt-1 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FiAlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Address Field */}
        <motion.div 
          className="md:col-span-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address
          </label>
          <Input
            type="text"
            name="address"
            value={editFormData?.address || ""}
            onChange={handleInputChange}
            placeholder="Enter street address"
          />
        </motion.div>

        {/* City Field */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <Input
            type="text"
            name="city"
            value={editFormData?.city || ""}
            onChange={handleInputChange}
            placeholder="Enter city"
          />
        </motion.div>

        {/* State Field */}
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <Input
            type="text"
            name="state"
            value={editFormData?.state || ""}
            onChange={handleInputChange}
            placeholder="Enter state"
          />
        </motion.div>

        {/* Pincode Field */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pincode
          </label>
          <Input
            type="text"
            name="pincode"
            value={editFormData?.pincode || ""}
            onChange={handleInputChange}
            className={`transition-all duration-300 ${validationErrors.pincode ? "border-red-500 shake" : ""}`}
            placeholder="Enter 6-digit pincode"
          />
          <AnimatePresence>
            {validationErrors.pincode && (
              <motion.p 
                className="text-red-500 text-xs mt-1 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <FiAlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.pincode}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Due Amount Field */}
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Amount
          </label>
          <Input
            type="number"
            name="due_amount"
            value={editFormData?.due_amount || 0}
            onChange={handleInputChange}
            placeholder="Enter due amount"
            step="0.01"
          />
        </motion.div>
      </motion.div>

      {/* Form Actions */}
      <motion.div 
        className="flex items-center space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          onClick={handleSubmitEdit}
          loading={editLoading}
          icon={FiSave}
          className="relative overflow-hidden"
        >
          <motion.span
            key="save-text"
            initial={{ opacity: 1 }}
            animate={{ opacity: editLoading ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            Save Changes
          </motion.span>
          {showSuccess && (
            <motion.span
              className="absolute inset-0 flex items-center justify-center bg-green-500 text-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
            >
              <FiCheckCircle className="w-5 h-5 mr-2" />
              Saved!
            </motion.span>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleEditToggle}
          disabled={editLoading}
        >
          Cancel
        </Button>
      </motion.div>
    </motion.div>
  );

  if (sellerLoading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <SellerInfoSkeleton />
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <EmptyState
          icon={FiUser}
          title="Seller not found"
          description="The seller you're looking for doesn't exist or has been removed."
          action={
            <Button onClick={() => navigate("/sellers")}>
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Sellers
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Back Button */}
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/sellers")}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Sellers</span>
        </motion.button>
      </div>

      {/* Seller Info Card */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6"
      >
        <AnimatePresence mode="wait">
          {!isEditing ? renderViewMode() : renderEditForm()}
        </AnimatePresence>
      </motion.div>

      {/* Products Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Products Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-blue-500" />
                Products & Inventory
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {sellerProductsTotal || 0} product{sellerProductsTotal !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-8"
                  size="sm"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Refresh */}
              <motion.button
                onClick={handleRefresh}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiRefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="p-6">
          {sellerProductsLoading && !initialLoading ? (
            <SkeletonLoader />
          ) : sellerProducts && sellerProducts.length > 0 ? (
            <>
              <Table
                columns={productColumns}
                data={sellerProducts}
                loading={sellerProductsLoading}
              />
              {sellerProductsTotal > sellerProductsPageSize && (
                <div className="mt-4">
                  <Pagination
                    currentPage={sellerProductsCurrentPage}
                    totalItems={sellerProductsTotal}
                    pageSize={sellerProductsPageSize}
                    pagination={sellerProductsPagination}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={FiShoppingBag}
              title="No Products Found"
              description={
                searchTerm
                  ? `No products found matching "${searchTerm}"`
                  : "This seller doesn't have any products yet."
              }
              action={
                searchTerm ? (
                  <Button variant="outline" onClick={clearSearch}>
                    Clear Search
                  </Button>
                ) : null
              }
            />
          )}
        </div>
      </motion.div>

      {/* Add shake animation for validation errors */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
};

export default SellerDetails;