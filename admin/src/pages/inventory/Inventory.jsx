import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiPackage,
  FiRefreshCw,
  FiAlertCircle,
  FiDollarSign,
  FiShoppingBag,
  FiEdit,
  FiX,
  FiHash,
  FiTag,
  FiGrid,
  FiRefreshCw as FiRefreshQr,
  FiPrinter,
} from "react-icons/fi";
import { FiMinus } from 'react-icons/fi';
import DeductStockModal from '../../components/features/Stocks/DeductStockModal';

import QRBarcodePrintModal from '../../components/features/Stocks/QRBarcodePrintModal';
import { motion, AnimatePresence } from "framer-motion";
import { useInventoryStore } from "../../store/inventoryStore";
import { useProductStore } from "../../store/productStore";
import { useAuthStore } from "../../store/authStore";
import { stocksAPI } from "../../services";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import Pagination from "../../components/common/Pagination/Pagination";
import Select from "../../components/common/Select/Select";
import StockForm from "../../components/features/Stocks/StockForm";
import AddStockModal from "../../components/features/Stocks/AddStockModal";
import toast from 'react-hot-toast';
import { FaQrcode } from "react-icons/fa";

const Stock = () => {
  const {
    stocks,
    totalStocks,
    currentPage,
    pageSize,
    loading,
    filters,
    pagination,
    fetchStocks,
    fetchStocksByUrl,
    createStock,
    updateStock,
    deleteStock,
    addStockQuantity,
    setFilters,
  } = useInventoryStore();

  const { products, fetchProducts } = useProductStore();
  const { user } = useAuthStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockWithProduct, setSelectedStockWithProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [selectedStockForModal, setSelectedStockForModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // QR/Barcode related state
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedStockForQR, setSelectedStockForQR] = useState(null);
  const [regeneratingQR, setRegeneratingQR] = useState(false);

  // QR/Barcode Print related state
  const [showQRPrintModal, setShowQRPrintModal] = useState(false);
  const [selectedStockForPrint, setSelectedStockForPrint] = useState(null);

  // Deduct stock related state
  const [showDeductStockModal, setShowDeductStockModal] = useState(false);
  const [selectedStockForDeduction, setSelectedStockForDeduction] = useState(null);

  useEffect(() => {
    // Fetch products for StockForm dropdown, then stocks with force refresh
    const fetchData = async () => {
      try {
        await fetchProducts();
        // Always force refresh to get latest data from backend
        await fetchStocks(1, "", true, filters);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm });
      // Reset to page 1 when searching
      fetchStocks(1, searchTerm, false, filters);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleAddStock = () => {
    setShowAddForm(true);
  };

  // In the parent Stock component
  const handleEditStock = async (stock) => {
    console.log("✏️ Editing stock:", stock);

    // Create a clean copy of the stock data
    const stockData = {
      ...stock,
      // Ensure numeric fields are numbers
      quantity: parseFloat(stock.quantity) || 0,
      selling_price: parseFloat(stock.selling_price) || 0,
      purchase_price: parseFloat(stock.purchase_price) || 0,
      paid_amount: parseFloat(stock.paid_amount) || 0,
      purchase_gst_percentage: parseFloat(stock.purchase_gst_percentage) || 0,
      selling_gst_percentage: parseFloat(stock.selling_gst_percentage) || 0,
    };

    setSelectedStock(stockData);
    setSelectedStockWithProduct(stockData);
    setShowEditForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedStock(null);
    setSelectedStockWithProduct(null);
  };

  const handleSubmitStock = async (stockData) => {
    setFormSubmitting(true);
    try {
      let response;
      if (showEditForm && selectedStock) {
        response = await updateStock(selectedStock.id, stockData);
      } else {
        response = await createStock(stockData);
      }

      console.log("Stock saved successfully", response);

      const currentPageNumber = pagination?.current_page || currentPage || 1;
      await fetchStocks(currentPageNumber, searchTerm, true, filters);
      handleCancelForm();
    } catch (error) {
      console.error("Error saving stock:", error);
      toast.error(error.response?.data?.message || "Failed to save stock");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClick = (stock) => {
    setStockToDelete(stock);
    setShowDeleteConfirm(true);
  };

  const handleDeleteStock = async () => {
    if (stockToDelete) {
      try {
        await deleteStock(stockToDelete.id, user.id);
        setShowDeleteConfirm(false);
        setStockToDelete(null);

        // Refresh current page after deletion
        const currentPageNumber = pagination?.current_page || currentPage || 1;
        await fetchStocks(currentPageNumber, searchTerm, true, filters);
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
  };

  const handleAddQuantity = async (id, quantity) => {
    await addStockQuantity(id, user.id, quantity);
  };

  const handleOpenAddStockModal = (stock) => {
    setSelectedStockForModal(stock);
    setShowAddStockModal(true);
  };

  const handleCloseAddStockModal = () => {
    setShowAddStockModal(false);
    setSelectedStockForModal(null);
  };

  const handleAddStockFromModal = async (stockId, quantity) => {
    await addStockQuantity(stockId, user.id, quantity);
    // Refresh current page after adding quantity
    const currentPageNumber = pagination?.current_page || currentPage || 1;
    await fetchStocks(currentPageNumber, searchTerm, true, filters);
  };

  const handlePageChange = (page) => {
    // Pass the current search term and filters as well
    fetchStocks(page, searchTerm, false, filters);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const currentPageNumber = pagination?.current_page || currentPage || 1;
    await fetchStocks(currentPageNumber, searchTerm, true, filters); // Force refresh to get latest data
    setRefreshing(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ search: "", product_id: "", unit_id: "", stock: "", product: "", seller: "" });
  };

  const toggleStockSelection = (stockId) => {
    setSelectedStocks((prev) =>
      prev.includes(stockId)
        ? prev.filter((id) => id !== stockId)
        : [...prev, stockId],
    );
  };

  // QR/Barcode handler functions
  const handleOpenQRModal = (stock) => {
    console.log('👁️ Opening QR modal for stock:', stock);
    setSelectedStockForQR(stock);
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
    setSelectedStockForQR(null);
  };

  // QR/Barcode Print handler functions
  const handleOpenQRPrintModal = (stock) => {
    console.log('🖨️ Opening QR print modal for stock:', stock);
    setSelectedStockForPrint(stock);
    setShowQRPrintModal(true);
  };

  const handleCloseQRPrintModal = () => {
    setShowQRPrintModal(false);
    setSelectedStockForPrint(null);
  };

  const handleRegenerateQR = async (stock) => {
    console.log('🔁 Regenerating QR for stock:', stock);
    setRegeneratingQR(true);
    try {
      const response = await stocksAPI.regenerateQR(stock.id);
      console.log('Regenerate QR Response:', response);
      
      // Show success message
      toast.success('QR and Barcode regenerated successfully!');
      
      // Refresh current page to get updated data with new QR/Barcode
      const currentPageNumber = pagination?.current_page || currentPage || 1;
      await fetchStocks(currentPageNumber, searchTerm, true, filters);
      
      // If QR modal is open, update the selected stock with new data
      if (showQRModal && selectedStockForQR?.id === stock.id) {
        // Get the updated stock from the store
        const updatedStock = useInventoryStore.getState().stocks.find(s => s.id === stock.id);
        if (updatedStock) {
          setSelectedStockForQR(updatedStock);
        }
      }
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      toast.error(error.response?.data?.message || 'Failed to regenerate QR code');
    } finally {
      setRegeneratingQR(false);
    }
  };

  // Deduct stock handler functions
  const handleDeductStock = async (stockId, quantity) => {
    const result = await useInventoryStore.getState().deductStockQuantity(
      stockId,
      user.id,
      quantity
    );

    if (result.success) {
      setShowDeductStockModal(false);
      setSelectedStockForDeduction(null);
      // Refresh current page after deduction
      const currentPageNumber = pagination?.current_page || currentPage || 1;
      await fetchStocks(currentPageNumber, searchTerm, true, filters);
    }
  };

  const handleOpenDeductStockModal = (stock) => {
    setSelectedStockForDeduction(stock);
    setShowDeductStockModal(true);
  };

  // Helper function to format attributes (handles dynamic key-value pairs)
  const formatAttributes = (attributes) => {
    if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
      return null;
    }

    const attributeItems = [];

    attributes.forEach((attr, idx) => {
      if (typeof attr === "object" && attr !== null) {
        // Handle dynamic key-value pairs (like { "size": "Large", "color": "Red" })
        Object.entries(attr).forEach(([key, value]) => {
          if (key && value && key !== "id" && key !== "product_id") {
            attributeItems.push(
              <span
                key={`${idx}-${key}`}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                <FiGrid className="w-2.5 h-2.5 mr-1" />
                {key}: {value}
              </span>,
            );
          }
        });
      }
    });

    if (attributeItems.length === 0) return null;

    return <div className="flex flex-wrap gap-1 mt-1">{attributeItems}</div>;
  };

  // Calculate stats
  const stats = {
    totalStocks: stocks?.length || 0,
    totalQuantity:
      stocks?.reduce((sum, s) => sum + (parseInt(s.quantity) || 0), 0) || 0,
    totalValue:
      stocks?.reduce(
        (sum, s) =>
          sum +
          (parseInt(s.quantity) || 0) * (parseFloat(s.selling_price) || 0),
        0,
      ) || 0,
    lowStock:
      stocks?.filter((s) => (parseInt(s.quantity) || 0) < 10).length || 0,
  };

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={
              selectedStocks.length === stocks?.length && stocks?.length > 0
            }
            onChange={() => {
              if (selectedStocks.length === stocks?.length) {
                setSelectedStocks([]);
              } else {
                setSelectedStocks(stocks?.map((s) => s.id) || []);
              }
            }}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: "selection",
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedStocks.includes(row.id)}
          onChange={() => toggleStockSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: "Product",
      accessor: "product",
      cell: (value, row) => {
        // Get product data from the nested product object in stock
        const product = row.product || null;

        return (
          <div className="space-y-2">
            {/* Product Name and basic info */}
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                {product?.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FiPackage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white">
                  {product?.name ||
                    row.product_name ||
                    `Product ${row.product_id}`}
                </p>

                {/* SKU */}
                {product?.sku && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <FiHash className="w-3 h-3 mr-1" />
                    <span>SKU: {product.sku}</span>
                  </div>
                )}

                {/* Product Attributes */}
                {formatAttributes(product?.attributes)}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Quantity",
      accessor: "quantity",
      cell: (value) => (
        <div className="flex items-center">
          <span
            className={`text-lg font-semibold ${(parseInt(value) || 0) < 10 ? "text-red-600" : "text-green-600"
              }`}
          >
            {value || 0}
          </span>
          {(parseInt(value) || 0) < 10 && (
            <FiAlertCircle className="w-4 h-4 ml-2 text-red-500" />
          )}
        </div>
      ),
    },
    {
      header: "Unit",
      accessor: "unit_name",
      cell: (value) => {
        return (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
            {value || "N/A"}
          </span>
        );
      },
    },
    {
      header: "Selling Price",
      accessor: "selling_price",
      cell: (value) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ₹{value ? parseFloat(value).toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      header: "Purchase Price",
      accessor: "purchase_price",
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          ₹{value ? parseFloat(value).toFixed(2) : "0.00"}
        </span>
      ),
    },
    {
      header: (
        <div>
          <div>Total Value</div>
          <div style={{ fontSize: "9px", color: "#191b1f" }}>
            (Excluding GST)
          </div>
        </div>
      ),
      accessor: "total_value",
      cell: (_, row) => {
        const quantity = parseInt(row.quantity) || 0;
        const price = parseFloat(row.selling_price) || 0;
        const total = quantity * price;
        return (
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{total.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (_, row) => (
        <div className="flex items-center space-x-1 flex-wrap gap-1">
          {/* View QR Code Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenQRPrintModal(row)}
            className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="View QR Code & Barcode"
          >
            <FaQrcode className="w-4 h-4" />
          </motion.button>

          {/* Print QR/Barcode Button
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenQRPrintModal(row)}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Print QR Code & Barcode"
          >
            <FiPrinter className="w-4 h-4" />
          </motion.button> */}

          {/* Regenerate QR Code Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRegenerateQR(row)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
            title="Regenerate QR Code & Barcode"
          >
            <FiRefreshQr className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditStock(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit Stock"
          >
            <FiEdit className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenAddStockModal(row)}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Add Stock"
          >
            <FiPlus className="w-4 h-4" />
          </motion.button>
          
          {/* Deduct Stock Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenDeductStockModal(row)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Deduct Stock"
          >
            <FiMinus className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDeleteClick(row)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete Stock"
          >
            <FiX className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    }
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group"
    >
      <div
        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Stock Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiPackage className="w-4 h-4 mr-2" />
              Manage product inventory and stock levels
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!showAddForm && !showEditForm && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiRefreshCw
                    className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? "animate-spin" : ""}`}
                  />
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleAddStock}
                    icon={FiPlus}
                    className="shadow-lg shadow-primary-500/30"
                  >
                    Add Stock
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Conditional rendering: Show form or table */}
        {showAddForm || showEditForm ? (
          <StockForm
            key={showEditForm ? selectedStock?.id : "new"} // Add key to force re-render
            stock={
              showEditForm ? selectedStockWithProduct || selectedStock : null
            }
            onSubmit={handleSubmitStock}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
            products={products}
          />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {initialLoading ? (
                // Loading skeleton for stats cards
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <StatCard
                    title="Total Stock Items"
                    value={stats.totalStocks.toLocaleString()}
                    icon={FiPackage}
                    color="from-blue-500 to-cyan-500"
                    delay={0.1}
                  />
                  <StatCard
                    title="Total Quantity"
                    value={stats.totalQuantity.toLocaleString()}
                    icon={FiShoppingBag}
                    color="from-green-500 to-emerald-500"
                    delay={0.2}
                  />
                  <StatCard
                    title="Total Value"
                    value={`₹${stats.totalValue.toLocaleString()}`}
                    icon={FiDollarSign}
                    color="from-purple-500 to-pink-500"
                    delay={0.3}
                  />
                  <StatCard
                    title="Low Stock Items"
                    value={stats.lowStock.toLocaleString()}
                    icon={FiAlertCircle}
                    color="from-orange-500 to-red-500"
                    delay={0.4}
                  />
                </>
              )}
            </div>

            {/* Search and Filters */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              {initialLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search stocks by product name, price, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-4 py-2 rounded-xl border transition-colors flex items-center space-x-2 ${showFilters
                          ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                      <FiFilter className="w-4 h-4" />
                      <span>Filters</span>
                    </motion.button>

                    {(searchTerm || filters.product_id || filters.unit_id || filters.stock || filters.product || filters.seller) && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={clearFilters}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <FiX className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {!initialLoading && (
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Select
                            label="Stock Status"
                            options={[
                              { value: "", label: "All Status" },
                              { value: "low-stock", label: "Low Stock" },
                              { value: "out-of-stock", label: "Out of Stock" },
                              { value: "in-stock", label: "In Stock" },
                            ]}
                            value={filters.stock}
                            onChange={(e) => {
                              setFilters({ stock: e.target.value });
                              fetchStocks(1, searchTerm, false, { ...filters, stock: e.target.value });
                            }}
                          />
                          <Input
                            label="Product Name"
                            type="text"
                            placeholder="Filter by product name..."
                            value={filters.product}
                            onChange={(e) => {
                              setFilters({ product: e.target.value });
                              fetchStocks(1, searchTerm, false, { ...filters, product: e.target.value });
                            }}
                          />
                          <Input
                            label="Seller Name"
                            type="text"
                            placeholder="Filter by seller name..."
                            value={filters.seller}
                            onChange={(e) => {
                              setFilters({ seller: e.target.value });
                              fetchStocks(1, searchTerm, false, { ...filters, seller: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>

            {/* Stocks Table */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {initialLoading || loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {initialLoading
                        ? "Loading stock data..."
                        : "Updating stock data..."}
                    </p>
                  </div>
                </div>
              ) : stocks.length > 0 ? (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <Table columns={columns} data={stocks} loading={loading} />
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalStocks}
                      pageSize={pageSize}
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                  <FiPackage className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Stock Items Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Get started by adding your first stock item to the
                    inventory.
                  </p>
                  <Button
                    onClick={handleAddStock}
                    icon={FiPlus}
                    className="shadow-lg shadow-primary-500/30"
                  >
                    Add First Stock Item
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Add Stock Modal */}
      {selectedStockForModal && (
        <AddStockModal
          isOpen={showAddStockModal}
          onClose={handleCloseAddStockModal}
          stock={selectedStockForModal}
          onAddStock={handleAddStockFromModal}
          isSubmitting={loading}
        />
      )}

      {/* Deduct Stock Modal */}
      {selectedStockForDeduction && (
        <DeductStockModal
          isOpen={showDeductStockModal}
          onClose={() => {
            setShowDeductStockModal(false);
            setSelectedStockForDeduction(null);
          }}
          stock={selectedStockForDeduction}
          onDeductStock={handleDeductStock}
          isSubmitting={loading}
        />
      )}

    

      {/* QR/Barcode Print Modal */}
      {selectedStockForPrint && (
        <QRBarcodePrintModal
          isOpen={showQRPrintModal}
          onClose={handleCloseQRPrintModal}
          stock={selectedStockForPrint}
          isMode="Stock"
          product={selectedStockForPrint?.product}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && stockToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteConfirm(false);
              setStockToDelete(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiX className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Stock Item
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Are you sure you want to delete this stock item?
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
                  "
                  {stockToDelete.product?.name ||
                    stockToDelete.product_name ||
                    "Stock Item"}
                  "
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setStockToDelete(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteStock}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Stock;