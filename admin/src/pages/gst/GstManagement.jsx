import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiCheck,
  FiX,
  FiCalendar,
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
  FiClock,
  FiInfo,
  FiActivity,
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
  FiTrendingDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useGstStore } from "../../store/gstStore";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import { FaRupeeSign, FaFileInvoiceDollar, FaBuilding, FaCalendarCheck, FaPercentage, FaChartLine, FaBoxes, FaWallet, FaLandmark } from "react-icons/fa";
import { HiOutlineDocumentReport, HiOutlineOfficeBuilding } from "react-icons/hi";
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
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);

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
      toast.success("GST collection data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch GST collection data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleStatusUpdate = async (collectionId, status) => {
    if (!collectionId) {
      toast.error("Please select a collection");
      return;
    }
    
    try {
      await updatePaymentStatus(collectionId, { 
        govt_gst_pay_status: status === 'paid' ? 1 : status === 'pending' ? 0 : 2,
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

  const handleViewProductDetails = async (product) => {
    setSelectedProductDetails(product);
    setShowProductDetailModal(true);
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("GST data exported successfully");
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status) => {
    const statusValue = status?.toString();
    if (statusValue === '1' || status === 'paid') return 'success';
    if (statusValue === '0' || status === 'pending') return 'warning';
    if (statusValue === '2' || status === 'failed') return 'danger';
    return 'gray';
  };

  const getStatusIcon = (status) => {
    const statusValue = status?.toString();
    if (statusValue === '1' || status === 'paid') return FiCheckCircle;
    if (statusValue === '0' || status === 'pending') return FiAlertCircle;
    if (statusValue === '2' || status === 'failed') return FiXCircle;
    return FiActivity;
  };

  const getStatusText = (status) => {
    const statusValue = status?.toString();
    if (statusValue === '1' || status === 'paid') return 'Paid';
    if (statusValue === '0' || status === 'pending') return 'Pending';
    if (statusValue === '2' || status === 'failed') return 'Failed';
    return 'Unknown';
  };

  const getPaymentStatusBadge = (status) => {
    const config = {
      paid: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', label: 'Paid' },
      pending: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', label: 'Pending' },
      failed: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20', label: 'Failed' },
    };
    const key = getStatusText(status).toLowerCase();
    const style = config[key] || config.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
        {style.label}
      </span>
    );
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
    const paidGST = filtered.reduce((sum, col) => 
      sum + (getStatusText(col.govt_pay_status) === "Paid" ? (parseFloat(col.selling_gst_amount) || 0) : 0), 0
    );
    const pendingGST = filtered.reduce((sum, col) => 
      sum + (getStatusText(col.govt_pay_status) === "Pending" ? (parseFloat(col.selling_gst_amount) || 0) : 0), 0
    );
    
    // Use API values for Total GST and Govt GST Due
    const totalGST = parseFloat(selectedCollection?.totalGST) || 0;
    const govtGSTDue = parseFloat(selectedCollection?.govtGSTDue) || 0;
    
    return { totalGST, paidGST, pendingGST, govtGSTDue };
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
      header: 'Invoice ID',
      accessor: 'invoice_id',
      cell: (value) => (
        <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
          INV-{value}
        </span>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      cell: (value, row) => (
        <div className="flex items-center">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value?.name || row.product_name || `Product ${row.product_id}`}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Product ID: {row.product_id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value) => (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
          {parseFloat(value || 0).toFixed(2)} units
        </span>
      ),
    },
    {
      header: 'Selling Price',
      accessor: 'selling_price',
      cell: (value) => {
        const price = parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-green-500 text-sm" />
            <span className="font-medium text-gray-900 dark:text-white">
              ₹{price.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'GST %',
      accessor: 'selling_gst_percentage',
      cell: (value) => (
        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
          {parseFloat(value || 0).toFixed(2)}%
        </span>
      ),
    },
    {
      header: 'GST Amount',
      accessor: 'selling_gst_amount',
      cell: (value) => {
        const gstAmount = parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-orange-500 text-sm" />
            <span className="font-medium text-orange-600 dark:text-orange-400">
              ₹{gstAmount.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Payment Status',
      accessor: 'govt_pay_status',
      cell: (value) => getPaymentStatusBadge(value),
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

  // Product table columns for aggregated data
  const productColumns = [
    {
      header: 'Product ID',
      accessor: 'product_id',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      header: 'Total Quantity',
      accessor: 'total_quantity',
      cell: (value) => {
        const qty = parseFloat(value) || 0;
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
            {qty.toFixed(2)} units
          </span>
        );
      },
    },
    {
      header: 'Total Purchase Price',
      accessor: 'total_purchase_price',
      cell: (value) => {
        const price = parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-orange-500 text-sm" />
            <span className="font-medium text-orange-600 dark:text-orange-400">
              ₹{price.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Total Purchase GST',
      accessor: 'total_purchase_gst',
      cell: (value) => {
        const gst = parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-red-500 text-sm" />
            <span className="font-medium text-red-600 dark:text-red-400">
              ₹{gst.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Total Selling Price',
      accessor: 'total_selling_price',
      cell: (value) => {
        const price = parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-green-500 text-sm" />
            <span className="font-medium text-green-600 dark:text-green-400">
              ₹{price.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Total Selling GST',
      accessor: 'total_selling_gst',
      cell: (value) => {
        const gst = parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            <FaRupeeSign className="text-emerald-500 text-sm" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ₹{gst.toFixed(2)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Total Products',
      accessor: 'total_products',
      cell: (value) => {
        const count = parseInt(value) || 0;
        return (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
            {count}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewProductDetails(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View product details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPercentage className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading GST data...</p>
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
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950"
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
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                  <FaPercentage className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    GST Management
                  </h1>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">User ID:</span>
                    <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-indigo-600 dark:text-indigo-400">
                      {searchUserId || 'Not set'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'table'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                  >
                    <FiList className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
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
                  className="!bg-white dark:!bg-slate-800 !text-indigo-600 dark:!text-indigo-400 !border-indigo-200 dark:!border-indigo-800 hover:!bg-indigo-50 dark:hover:!bg-indigo-900/30"
                >
                  {exporting ? 'Exporting...' : 'Export'}
                </Button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefresh}
                  className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <FiRefreshCw className={`w-5 h-5 text-slate-600 dark:text-slate-300 ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter User ID to fetch GST collection..."
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                  prefix={<FiSearch className="text-slate-400" />}
                  className="w-full"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => handleFetchUserGst()}
                  disabled={initialLoading}
                  className="flex items-center space-x-2 !bg-gradient-to-r !from-indigo-600 !to-indigo-700 hover:!from-indigo-700 hover:!to-indigo-800 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                >
                  <FiSearch className="w-4 h-4" />
                  <span>Fetch GST Data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 !border-slate-300 dark:!border-slate-600"
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
                  className="overflow-hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Status Filter
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                      >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Collections</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {selectedCollection.summary?.totalCollections || 0}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <FiShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Filtered: {filteredCollections.length} collections
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total GST</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{summary.totalGST.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <FaRupeeSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Total GST from all collections
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Govt GST Due</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ₹{summary.govtGSTDue.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <FaLandmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Government GST payable amount
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Paid GST</p>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        ₹{summary.paidGST.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <FiCheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {((summary.paidGST / summary.totalGST) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pending GST</p>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        ₹{summary.pendingGST.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
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
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div className="border-b border-slate-200 dark:border-slate-700">
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
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
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
                                whileHover={{ y: -4 }}
                                className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                                      #{collection.id}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-0.5">INV-{collection.invoice_id}</p>
                                  </div>
                                  {getPaymentStatusBadge(collection.govt_pay_status)}
                                </div>
                                <div className="space-y-2 mt-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Product:</span>
                                    <span className="text-sm font-medium">Product #{collection.product_id}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">Quantity:</span>
                                    <span className="text-sm font-medium">{parseFloat(collection.quantity || 0).toFixed(2)} units</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">GST %:</span>
                                    <span className="text-sm font-medium text-purple-600">{parseFloat(collection.selling_gst_percentage || 0).toFixed(2)}%</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">GST Amount:</span>
                                    <span className="text-sm font-medium text-emerald-600">
                                      ₹{parseFloat(collection.selling_gst_amount || 0).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                                  <button
                                    onClick={() => {
                                      setSelectedCollectionId(collection.id);
                                      setShowStatusModal(true);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center transition-colors"
                                  >
                                    <FiEdit className="w-4 h-4 mr-1" /> Update Status
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
                  {activeTab === 'products' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {selectedCollection?.products && selectedCollection.products.length > 0 ? (
                        <Table
                          columns={productColumns}
                          data={selectedCollection.products || []}
                          loading={productsLoading}
                        />
                      ) : (
                        <EmptyState
                          icon={FiPackage}
                          title="No Products Found"
                          description="No product data available for this GST collection."
                        />
                      )}
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
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                            <FiActivity className="w-5 h-5 mr-2 text-indigo-500" />
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
                                    <span className="text-slate-600 dark:text-slate-400">{status}</span>
                                    <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      className={`h-full rounded-full ${
                                        status === 'Paid' ? 'bg-emerald-500' :
                                        status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* GST Collection by Product */}
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                            <FiPackage className="w-5 h-5 mr-2 text-indigo-500" />
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
                                    gst: parseFloat(col.selling_gst_amount || 0)
                                  });
                                }
                                return acc;
                              }, [])
                              .sort((a, b) => b.gst - a.gst)
                              .slice(0, 5)
                              .map((product, idx) => (
                                <div key={product.product_id} className="flex items-center justify-between p-2 hover:bg-white dark:hover:bg-slate-600/50 rounded-lg transition-colors">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium text-slate-500">#{idx + 1}</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                      Product #{product.product_id}
                                    </span>
                                  </div>
                                  <span className="text-sm font-semibold text-emerald-600">
                                    ₹{product.gst.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-xl p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-indigo-600 dark:text-indigo-400">Average GST per Collection</p>
                              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                ₹{(summary.totalGST / (filteredCollections.length || 1)).toFixed(2)}
                              </p>
                            </div>
                            <FiTrendingUp className="w-8 h-8 text-indigo-500 opacity-50" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-emerald-600 dark:text-emerald-400">Collection Efficiency</p>
                              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                {((summary.paidGST / summary.totalGST) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-emerald-500 opacity-50" />
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-5">
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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center"
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
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Select Collection
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:text-white"
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    value={selectedCollectionId}
                  >
                    <option value="">Select a collection</option>
                    {selectedCollection.collections?.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        #{collection.id} - Product #{collection.product_id} - ₹{parseFloat(collection.selling_gst_amount || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    New Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => selectedCollectionId && handleStatusUpdate(selectedCollectionId, 'paid')}
                      disabled={updatingStatus || !selectedCollectionId}
                      className="flex items-center justify-center space-x-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
                    >
                      <FiCheck className="w-4 h-4" />
                      <span>Paid</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => selectedCollectionId && handleStatusUpdate(selectedCollectionId, 'pending')}
                      disabled={updatingStatus || !selectedCollectionId}
                      className="flex items-center justify-center space-x-2 text-amber-600 border-amber-200 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-900/20"
                    >
                      <FiAlertCircle className="w-4 h-4" />
                      <span>Pending</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => selectedCollectionId && handleStatusUpdate(selectedCollectionId, 'failed')}
                      disabled={updatingStatus || !selectedCollectionId}
                      className="flex items-center justify-center space-x-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
                    >
                      <FiX className="w-4 h-4" />
                      <span>Failed</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-6 border-t border-slate-200 dark:border-slate-700">
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

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductDetailModal && selectedProductDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProductDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Product Details
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Product ID: #{selectedProductDetails.product_id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowProductDetailModal(false)}
                  className="!p-2"
                >
                  <FiX className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                        <FiPackage className="w-4 h-4 mr-2 text-indigo-500" />
                        Purchase Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Total Quantity:</span>
                          <span className="text-sm font-medium">{parseFloat(selectedProductDetails.total_quantity || 0).toFixed(2)} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Total Purchase Price:</span>
                          <span className="text-sm font-medium text-emerald-600">₹{parseFloat(selectedProductDetails.total_purchase_price || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Total Purchase GST:</span>
                          <span className="text-sm font-medium text-amber-600">₹{parseFloat(selectedProductDetails.total_purchase_gst || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                        <FiTrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
                        Selling Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Total Selling Price:</span>
                          <span className="text-sm font-medium text-emerald-600">₹{parseFloat(selectedProductDetails.total_selling_price || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Total Selling GST:</span>
                          <span className="text-sm font-medium text-purple-600">₹{parseFloat(selectedProductDetails.total_selling_gst || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Number of Transactions:</span>
                          <span className="text-sm font-medium text-indigo-600">{selectedProductDetails.total_products || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center">
                      <FiActivity className="w-4 h-4 mr-2 text-indigo-500" />
                      Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-600">
                        <span className="text-sm text-slate-500">Average Selling Price:</span>
                        <span className="text-sm font-semibold">
                          ₹{(parseFloat(selectedProductDetails.total_selling_price || 0) / (parseFloat(selectedProductDetails.total_quantity || 0) || 1)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-600">
                        <span className="text-sm text-slate-500">Average Purchase Price:</span>
                        <span className="text-sm font-semibold">
                          ₹{(parseFloat(selectedProductDetails.total_purchase_price || 0) / (parseFloat(selectedProductDetails.total_quantity || 0) || 1)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-slate-500">Profit Margin:</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          {((parseFloat(selectedProductDetails.total_selling_price || 0) - parseFloat(selectedProductDetails.total_purchase_price || 0)) / (parseFloat(selectedProductDetails.total_purchase_price || 0) || 1) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GstManagement;