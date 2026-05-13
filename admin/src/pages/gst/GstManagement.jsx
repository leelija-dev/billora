import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiCheck,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiShoppingCart,
  FiUser,
  FiTrendingUp,
  FiAlertCircle,
  FiEdit,
  FiPackage,
  FiFilter,
  FiDownload,
  FiGrid,
  FiList,
  FiArrowLeft,
  FiClock,
  FiInfo,
  FiActivity,
  FiTrendingDown,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
  FiClipboard,
  FiPrinter,
  FiShare2,
  FiMapPin,
  FiAward,
  FiShield,
  FiCreditCard,
  FiFileText,
  FiUsers,
  FiPercent,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useGstStore } from "../../store/gstStore";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import { FaRupeeSign, FaFileInvoiceDollar, FaBuilding, FaCalendarCheck, FaPercentage } from "react-icons/fa";
import toast from "react-hot-toast";

const GstManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    selectedCollection,
    selectedProducts,
    loading,
    productsLoading,
    updatingStatus,
    fetchGstCollectionDetails,
    fetchGstProducts,
    updatePaymentStatus,
  } = useGstStore();

  const [searchUserId, setSearchUserId] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [exporting, setExporting] = useState(false);

  // Auto-load GST data for current user on page mount
  useEffect(() => {
    if (user?.id) {
      setSearchUserId(user.id.toString());
      handleFetchUserGst(user.id.toString());
    }
  }, [user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await handleFetchUserGst(searchUserId);
      toast.success("GST data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh GST data");
    } finally {
      setRefreshing(false);
    }
  };

  const handleFetchUserGst = async (userId = null) => {
    const targetUserId = userId || searchUserId;
    if (!targetUserId?.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setInitialLoading(true);
    try {
      const result = await fetchGstCollectionDetails(targetUserId.trim());
      console.log('GST Data Structure:', result);
      console.log('Collections:', result.collections);
      if (result.collections && result.collections.length > 0) {
        console.log('First Collection:', result.collections[0]);
      }
      toast.success("GST collection data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch GST collection data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleStatusUpdate = async (collectionId, status) => {
    try {
      await updatePaymentStatus(collectionId, { 
        govt_gst_pay_status: status,
        updated_at: new Date().toISOString()
      });
      setShowStatusModal(false);
      setSelectedCollectionId("");
      await fetchGstCollectionDetails(searchUserId.trim());
      toast.success(`Payment status updated to ${status}`);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleViewProducts = async (productId) => {
    try {
      await fetchGstProducts(productId);
      setShowProductsModal(true);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("GST data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toString()) {
      case '1':
      case 'paid':
        return 'success';
      case '0':
      case 'pending':
        return 'warning';
      case '2':
      case 'failed':
        return 'danger';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toString()) {
      case '1':
      case 'paid':
        return FiCheckCircle;
      case '0':
      case 'pending':
        return FiAlertCircle;
      case '2':
      case 'failed':
        return FiXCircle;
      default:
        return FiActivity;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toString()) {
      case '1':
      case 'paid':
        return 'Paid';
      case '0':
      case 'pending':
        return 'Pending';
      case '2':
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  // Filter collections based on status and date range
  const getFilteredCollections = () => {
    if (!selectedCollection?.collections) return [];
    
    let filtered = [...selectedCollection.collections];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(col => 
        getStatusText(col.govt_pay_status).toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    if (dateRange.start) {
      filtered = filtered.filter(col => 
        new Date(col.created_at) >= new Date(dateRange.start)
      );
    }
    
    if (dateRange.end) {
      filtered = filtered.filter(col => 
        new Date(col.created_at) <= new Date(dateRange.end)
      );
    }
    
    return filtered;
  };

  const calculateSummary = () => {
    const filtered = getFilteredCollections();
    const totalGST = filtered.reduce((sum, col) => sum + (parseFloat(col.selling_gst_amount) || 0), 0);
    const paidGST = filtered.reduce((sum, col) => 
      sum + (getStatusText(col.govt_pay_status) === "Paid" ? (parseFloat(col.selling_gst_amount) || 0) : 0), 0
    );
    const pendingGST = filtered.reduce((sum, col) => 
      sum + (getStatusText(col.govt_pay_status) === "Pending" ? (parseFloat(col.selling_gst_amount) || 0) : 0), 0
    );
    
    return { totalGST, paidGST, pendingGST };
  };

  // Table columns for GST collections
  const columns = [
    {
      header: 'Collection ID',
      accessor: 'id',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            {value?.image ? (
              <img 
                src={value.image} 
                alt={value.name || 'Product'}
                className="w-10 h-10 rounded-xl mr-3 object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value?.name || row.product_name || 'N/A'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {value?.sku || row.product_sku || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value) => (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
          {value || '0'} units
        </span>
      ),
    },
    {
      header: 'Selling Price',
      accessor: 'selling_price',
      cell: (value) => {
        const price = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
            ₹{isNaN(price) ? '0.00' : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'GST Amount',
      accessor: 'selling_gst_amount',
      cell: (value) => {
        const gstAmount = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-green-500 text-sm" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {isNaN(gstAmount) ? '0.00' : gstAmount.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Payment Status',
      accessor: 'govt_pay_status',
      cell: (value) => {
        const StatusIcon = getStatusIcon(value);
        return (
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${
              getStatusText(value) === "Paid" ? "text-green-500" :
              getStatusText(value) === "Pending" ? "text-yellow-500" :
              "text-red-500"
            }`} />
            <StatusBadge 
              status={getStatusText(value)} 
              color={getStatusColor(value)}
            />
          </div>
        );
      },
    },
    {
      header: 'Date',
      accessor: 'created_at',
      cell: (value) => (
        <div className="flex items-center space-x-2">
          <FiCalendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {value ? new Date(value).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedProduct(row.product);
              handleViewProducts(row.product_id);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View product details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCollectionId(row.id);
              setShowStatusModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Update payment status"
          >
            <FiEdit className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  // Product table columns
  const productColumns = [
    {
      header: 'Product ID',
      accessor: 'id',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      header: 'Product Name',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            {row.image ? (
              <img 
                src={row.image} 
                alt={value || 'Product'}
                className="w-10 h-10 rounded-xl mr-3 object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value || 'N/A'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.sku || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Selling Price',
      accessor: 'selling_price',
      cell: (value) => {
        const price = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
            ₹{isNaN(price) ? '0.00' : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: 'GST Rate',
      accessor: 'gst_rate',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <FaPercentage className="text-blue-500 text-sm" />
          <span className="font-medium text-gray-900 dark:text-white">
            {value || row.selling_gst_percentage || row.gst_percentage || '18'}%
          </span>
        </div>
      ),
    },
    {
      header: 'GST Amount',
      accessor: 'selling_gst_amount',
      cell: (value) => {
        const gstAmount = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : 0);
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-green-500 text-sm" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {isNaN(gstAmount) ? '0.00' : gstAmount.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Total Quantity',
      accessor: 'total_quantity',
      cell: (value) => (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
          {value || '0'} units
        </span>
      ),
    },
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPercentage className="w-6 h-6 text-primary-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading GST data...</p>
        </div>
      </div>
    );
  }

  const filteredCollections = getFilteredCollections();
  const summary = calculateSummary();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaPercentage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    GST Management
                  </h1>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">User ID:</span>
                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {searchUserId || 'Not set'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600'
                        : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <FiList className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600'
                        : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </motion.button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleExportData}
                  icon={FiDownload}
                  disabled={exporting}
                  className="!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !border-none hover:!from-blue-600 hover:!to-blue-700"
                >
                  {exporting ? 'Exporting...' : 'Export'}
                </Button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter User ID to fetch GST collection..."
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  prefix={<FiSearch className="text-gray-400" />}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => handleFetchUserGst()}
                  disabled={initialLoading}
                  className="flex items-center space-x-2 !bg-gradient-to-r !from-primary-500 !to-primary-600"
                >
                  <FiSearch className="w-4 h-4" />
                  <span>Fetch GST Data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status Filter
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Summary Cards */}
          {selectedCollection && (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Collections</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCollection.summary?.totalCollections || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FiShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Filtered: {filteredCollections.length} collections
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total GST Amount</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{summary.totalGST.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <FaRupeeSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Including all GST collections
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Paid GST</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{summary.paidGST.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <FiCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {((summary.paidGST / summary.totalGST) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending GST</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        ₹{summary.pendingGST.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <FiAlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Awaiting payment
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Tabs Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-1 px-4 overflow-x-auto">
                    {[
                      { id: 'collections', label: 'GST Collections', icon: FiFileText },
                      { id: 'products', label: 'Products', icon: FiPackage },
                      { id: 'summary', label: 'Summary Report', icon: FiBarChart2 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200
                          ${activeTab === tab.id
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                          }
                        `}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Collections Tab */}
                  {activeTab === 'collections' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {filteredCollections.length > 0 ? (
                        viewMode === "table" ? (
                          <Table
                            columns={columns}
                            data={filteredCollections}
                            loading={loading}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCollections.map((collection) => (
                              <motion.div
                                key={collection.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -5 }}
                                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                                    #{collection.id}
                                  </span>
                                  <StatusBadge 
                                    status={getStatusText(collection.govt_pay_status)} 
                                    color={getStatusColor(collection.govt_pay_status)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Product:</span>
                                    <span className="text-sm font-medium">{collection.product?.name || collection.product_name || 'N/A'}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Quantity:</span>
                                    <span className="text-sm font-medium">{collection.quantity} units</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">GST Amount:</span>
                                    <span className="text-sm font-medium text-green-600">
                                      ₹{parseFloat(collection.selling_gst_amount || 0).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <button
                                    onClick={() => {
                                      setSelectedProduct(collection.product);
                                      handleViewProducts(collection.product_id);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                                  >
                                    <FiEye className="w-4 h-4 mr-1" /> View
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedCollectionId(collection.id);
                                      setShowStatusModal(true);
                                    }}
                                    className="text-gray-600 hover:text-gray-700 text-sm flex items-center"
                                  >
                                    <FiEdit className="w-4 h-4 mr-1" /> Update
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )
                      ) : (
                        <EmptyState
                          icon={FaFileInvoiceDollar}
                          title="No Collections Found"
                          description="No GST collections match your filters."
                          actionText="Clear Filters"
                          onAction={() => {
                            setStatusFilter("all");
                            setDateRange({ start: "", end: "" });
                          }}
                        />
                      )}
                    </motion.div>
                  )}

                  {/* Products Tab */}
                  {activeTab === 'products' && selectedCollection?.products?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Table
                        columns={productColumns}
                        data={selectedCollection.products || []}
                        loading={productsLoading}
                      />
                    </motion.div>
                  )}

                  {/* Summary Report Tab */}
                  {activeTab === 'summary' && selectedCollection && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {/* Payment Status Distribution */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiActivity className="w-5 h-5 mr-2 text-primary-500" />
                            Payment Status Distribution
                          </h3>
                          <div className="space-y-4">
                            {['Paid', 'Pending', 'Failed'].map((status) => {
                              const count = filteredCollections.filter(
                                c => getStatusText(c.govt_pay_status) === status
                              ).length;
                              const percentage = filteredCollections.length > 0 
                                ? (count / filteredCollections.length) * 100 
                                : 0;
                              return (
                                <div key={status}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">{status}</span>
                                    <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      className={`h-full rounded-full ${
                                        status === 'Paid' ? 'bg-green-500' :
                                        status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* GST Collection by Product */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FiPackage className="w-5 h-5 mr-2 text-primary-500" />
                            Top Products by GST
                          </h3>
                          <div className="space-y-3">
                            {filteredCollections
                              .reduce((acc, col) => {
                                const existing = acc.find(p => p.product_id === col.product_id);
                                if (existing) {
                                  existing.gst += parseFloat(col.selling_gst_amount || 0);
                                } else {
                                  acc.push({
                                    product_id: col.product_id,
                                    product_name: col.product?.name || col.product_name || 'Unknown Product',
                                    gst: parseFloat(col.selling_gst_amount || 0)
                                  });
                                }
                                return acc;
                              }, [])
                              .sort((a, b) => b.gst - a.gst)
                              .slice(0, 5)
                              .map((product, idx) => (
                                <div key={product.product_id} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {product.product_name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-semibold text-green-600">
                                    ₹{product.gst.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 dark:text-blue-400">Average GST per Collection</p>
                              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                ₹{(summary.totalGST / (filteredCollections.length || 1)).toFixed(2)}
                              </p>
                            </div>
                            <FiTrendingUp className="w-8 h-8 text-blue-500 opacity-50" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 dark:text-green-400">Collection Efficiency</p>
                              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                {((summary.paidGST / summary.totalGST) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-green-500 opacity-50" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 dark:text-purple-400">Total Products</p>
                              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                {selectedCollection.summary?.totalProducts || 0}
                              </p>
                            </div>
                            <FiPackage className="w-8 h-8 text-purple-500 opacity-50" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}

          {/* Empty State */}
          {!selectedCollection && !initialLoading && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12"
            >
              <EmptyState
                icon={FaFileInvoiceDollar}
                title="No GST Data Found"
                description="Enter a user ID to fetch GST collection details."
                actionText="Clear Search"
                onAction={() => setSearchUserId("")}
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Update GST Payment Status
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowStatusModal(false)}
                  className="!p-2"
                >
                  <FiX className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Collection
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    value={selectedCollectionId}
                  >
                    <option value="">Select a collection</option>
                    {selectedCollection.collections?.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        #{collection.id} - {collection.product?.name || collection.product_name || 'Unknown Product'} - ₹{collection.selling_gst_amount || '0'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    New Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => selectedCollectionId && handleStatusUpdate(selectedCollectionId, 'paid')}
                      disabled={updatingStatus || !selectedCollectionId}
                      className="flex items-center justify-center space-x-2 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      <FiCheck className="w-4 h-4" />
                      <span>Paid</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => selectedCollectionId && handleStatusUpdate(selectedCollectionId, 'pending')}
                      disabled={updatingStatus || !selectedCollectionId}
                      className="flex items-center justify-center space-x-2 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    >
                      <FiAlertCircle className="w-4 h-4" />
                      <span>Pending</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => selectedCollectionId && handleStatusUpdate(selectedCollectionId, 'failed')}
                      disabled={updatingStatus || !selectedCollectionId}
                      className="flex items-center justify-center space-x-2 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <FiX className="w-4 h-4" />
                      <span>Failed</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusModal(false)}
                  disabled={updatingStatus}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Modal */}
      <AnimatePresence>
        {showProductsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProductsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Product Details
                  </h3>
                  {selectedProduct && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {selectedProduct.name} - SKU: {selectedProduct.sku}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowProductsModal(false)}
                  className="!p-2"
                >
                  <FiX className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                <Table
                  columns={productColumns}
                  data={Array.isArray(selectedProducts) ? selectedProducts : []}
                  loading={productsLoading}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GstManagement;