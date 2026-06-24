// pages/gst/GstManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiEdit2,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiX,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useGstStore } from '../../store/gstStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button/Button';
import Select from '../../components/common/Select/Select';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Pagination from '../../components/common/Pagination/Pagination';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import toast from 'react-hot-toast';

const GSTManagement = () => {
  const {
    gstInData,
    gstOutData,
    gstInPagination,
    gstOutPagination,
    loading,
    updatingStatus,
    filters,
    summary,
    fetchGstCollections,
    updatePaymentStatus,
    setFilters,
    clearFilters,
    resetStore,
  } = useGstStore();

  const { user } = useAuthStore();
  const userId = user?.id || 1;

  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('gst_in');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const initializedRef = useRef(false);

  const monthOptions = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
  ];

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loadData = async () => {
      try {
        await fetchGstCollections(userId);
      } catch (error) {
        console.error('Error loading GST data:', error);
      }
    };

    loadData();

    return () => {
      resetStore();
    };
  }, [userId, fetchGstCollections, resetStore]);

  // Handle filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (initializedRef.current) {
        const params = {};
        if (filters.month) params.month = filters.month;
        if (filters.year) params.year = filters.year;
        fetchGstCollections(userId, params);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters.month, filters.year, userId, fetchGstCollections]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);

    try {
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      await fetchGstCollections(userId, params);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const openStatusModal = (collection) => {
    setSelectedCollection(collection);
    setSelectedStatus(collection.govt_pay_status || 0);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedCollection) return;

    try {
      await updatePaymentStatus(selectedCollection._originalId, {
        govt_gst_pay_status: selectedStatus,
      });
      setShowStatusModal(false);
      setSelectedCollection(null);
      toast.success('Payment status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    if (status === 1) {
      return <StatusBadge status="Paid" variant="success" />;
    } else if (status === 0) {
      return <StatusBadge status="Pending" variant="warning" />;
    }
    return <StatusBadge status="Unknown" variant="default" />;
  };

  // Get current data based on active tab - ensure unique IDs
  const getCurrentData = () => {
    let data = [];
    switch(activeTab) {
      case 'gst_in':
        data = gstInData || [];
        break;
      case 'gst_out':
        data = gstOutData || [];
        break;
      default:
        return [];
    }
    
    // Ensure each item has a unique id for the table key
    return data.map((item, index) => ({
      ...item,
      // Override id with a unique value for the table key
      id: item._uniqueId || `${activeTab}-${item.id}-${index}`,
      // Keep original id for reference
      _originalId: item.id,
    }));
  };

  const getCurrentPagination = () => {
    switch(activeTab) {
      case 'gst_in':
        return gstInPagination;
      case 'gst_out':
        return gstOutPagination;
      default:
        return null;
    }
  };

  const getTotalCount = () => {
    switch(activeTab) {
      case 'gst_in':
        return gstInPagination?.total || 0;
      case 'gst_out':
        return gstOutPagination?.total || 0;
      default:
        return 0;
    }
  };

  const getTabLabel = () => {
    switch(activeTab) {
      case 'gst_in':
        return 'GST In';
      case 'gst_out':
        return 'GST Out';
      default:
        return '';
    }
  };

  // GST In Columns - using _originalId for the actual ID display
  const gstInColumns = [
    {
      header: 'ID',
      accessor: '_originalId',
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
        <span className="font-mono text-sm text-primary-600 dark:text-primary-400">
          INV-{String(value).padStart(5, '0')}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'invoice',
      cell: (value) => {
        const invoice = value || {};
        return (
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              #{invoice.customer_id || 'N/A'}
            </p>
            {invoice.customer && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {invoice.customer.name || ''}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Product',
      accessor: 'product',
      cell: (value) => {
        const product = value || {};
        return (
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.name || 'N/A'}
            </p>
            {product.sku && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SKU: {product.sku}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Selling Price',
      accessor: 'price',
      cell: (value) => (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      header: 'GST %',
      accessor: 'gst',
      cell: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {parseFloat(value).toFixed(2)}%
        </span>
      ),
    },
    {
      header: 'GST Amount',
      accessor: 'total_price',
      cell: (value, row) => {
        const total = parseFloat(value) || 0;
        const gstPercent = parseFloat(row.gst) || 0;
        const gstAmount = (total * gstPercent) / (100 + gstPercent);
        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
            {formatCurrency(gstAmount)}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessor: 'govt_pay_status',
      cell: (value) => getStatusBadge(value),
    },
    {
      header: 'Created',
      accessor: 'created_at',
      cell: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_originalId',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openStatusModal(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Update Payment Status"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  // GST Out Columns - using _originalId for the actual ID display
  const gstOutColumns = [
    {
      header: 'ID',
      accessor: '_originalId',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      header: 'Product',
      accessor: 'product',
      cell: (value) => {
        const product = value || {};
        return (
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.name || 'N/A'}
            </p>
            {product.sku && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SKU: {product.sku}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Seller',
      accessor: 'seller',
      cell: (value) => {
        const seller = value || {};
        return (
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {seller.name || 'N/A'}
            </p>
            {seller.gst_number && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                GST: {seller.gst_number}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Purchase Price',
      accessor: 'price',
      cell: (value) => (
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      header: 'GST %',
      accessor: 'gst',
      cell: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {parseFloat(value).toFixed(2)}%
        </span>
      ),
    },
    {
      header: 'GST Amount',
      accessor: 'price',
      cell: (value, row) => {
        const price = parseFloat(value) || 0;
        const gstPercent = parseFloat(row.gst) || 0;
        const gstAmount = (price * gstPercent) / 100;
        return (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
            {formatCurrency(gstAmount)}
          </span>
        );
      },
    },
    {
      header: 'Created',
      accessor: 'created_at',
      cell: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_originalId',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openStatusModal(row)}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            title="Update Payment Status"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  const getColumnsForTab = () => {
    switch(activeTab) {
      case 'gst_in':
        return gstInColumns;
      case 'gst_out':
        return gstOutColumns;
      default:
        return [];
    }
  };

  // Get the data with proper keys for the Table component
  const tableData = getCurrentData();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6 min-h-screen bg-gray-50 dark:bg-gray-900"
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
            GST Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FaRupeeSign className="w-4 h-4 mr-2" />
            Manage and track GST collections
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
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
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            disabled={refreshing}
          >
            <FiRefreshCw
              className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${
                refreshing ? 'animate-spin' : ''
              }`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">GST In (Sales)</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summary.gstIn)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FiArrowUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Total GST collected from sales
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">GST Out (Purchases)</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(summary.gstOut)}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <FiArrowDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Total GST paid on purchases
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Net GST</p>
              <p className={`text-2xl font-bold ${(summary.gstIn - summary.gstOut) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(summary.gstIn - summary.gstOut)}
              </p>
            </div>
            <div className={`w-12 h-12 ${(summary.gstIn - summary.gstOut) >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-xl flex items-center justify-center`}>
              { (summary.gstIn - summary.gstOut) >= 0 ? 
                <FiTrendingUp className={`w-6 h-6 text-green-600 dark:text-green-400`} /> :
                <FiTrendingDown className={`w-6 h-6 text-red-600 dark:text-red-400`} />
              }
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {summary.dateFrom && summary.dateTo && (
              <>
                {formatDate(summary.dateFrom)} - {formatDate(summary.dateTo)}
              </>
            )}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Collections
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {(gstInPagination?.total || 0) + (gstOutPagination?.total || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <FaRupeeSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Total collections across all
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-48">
                <Select
                  label="Month"
                  options={monthOptions}
                  value={filters.month}
                  onChange={(e) => setFilters({ month: e.target.value })}
                />
              </div>
              <div className="w-48">
                <Select
                  label="Year"
                  options={yearOptions}
                  value={filters.year}
                  onChange={(e) => setFilters({ year: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {(filters.month || filters.year) && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear Filters
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs - Only GST In and GST Out */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex space-x-2 border-b border-gray-200 dark:border-gray-700"
      >
        <button
          onClick={() => setActiveTab('gst_in')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'gst_in'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className="flex items-center">
            <FiArrowUp className="w-4 h-4 mr-2 text-green-500" />
            GST In ({gstInPagination?.total || 0})
          </span>
          {activeTab === 'gst_in' && (
            <motion.div
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('gst_out')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'gst_out'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <span className="flex items-center">
            <FiArrowDown className="w-4 h-4 mr-2 text-red-500" />
            GST Out ({gstOutPagination?.total || 0})
          </span>
          {activeTab === 'gst_out' && (
            <motion.div
              layoutId="tabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
            />
          )}
        </button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading GST data...
              </p>
            </div>
          </div>
        ) : tableData.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {getTabLabel()} Records
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {tableData.length} of {getTotalCount()} records
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Total GST: {activeTab === 'gst_in' ? 
                      formatCurrency(summary.gstIn) : 
                      formatCurrency(summary.gstOut)
                    }
                  </span>
                </div>
              </div>
            </div>
            <Table
              columns={getColumnsForTab()}
              data={tableData}
              loading={loading}
            />
            {getCurrentPagination() && (
              <Pagination
                currentPage={getCurrentPagination().current_page}
                totalItems={getCurrentPagination().total}
                pageSize={getCurrentPagination().per_page}
                pagination={getCurrentPagination()}
                onPageChange={(url) => {
                  const pageMatch = url.match(/page=(\d+)/);
                  if (pageMatch) {
                    const params = {};
                    if (filters.month) params.month = filters.month;
                    if (filters.year) params.year = filters.year;
                    params.page = pageMatch[1];
                    fetchGstCollections(userId, params);
                  }
                }}
              />
            )}
          </div>
        ) : (
          <EmptyState
            icon={activeTab === 'gst_in' ? FiArrowUp : FiArrowDown}
            title={`No ${getTabLabel()} records found`}
            description={`No ${getTabLabel().toLowerCase()} records available for the selected filters.`}
            action={
              (filters.month || filters.year) ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : null
            }
          />
        )}
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Update Payment Status
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Collection ID:{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      #{selectedCollection._originalId}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Invoice ID:{' '}
                    <span className="font-medium text-gray-900 dark:text-white">
                      INV-{String(selectedCollection.invoice_id).padStart(5, '0')}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current Status:{' '}
                    {getStatusBadge(selectedCollection.govt_pay_status)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type:{' '}
                    <span className={`font-medium ${activeTab === 'gst_in' ? 'text-green-600' : 'text-red-600'}`}>
                      {activeTab === 'gst_in' ? 'GST In (Sales)' : 'GST Out (Purchases)'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedStatus(1)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors flex items-center justify-between ${
                    selectedStatus === 1
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Mark as Paid
                  </span>
                  {selectedStatus === 1 && (
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </button>

                <button
                  onClick={() => setSelectedStatus(0)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors flex items-center justify-between ${
                    selectedStatus === 0
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Mark as Pending
                  </span>
                  {selectedStatus === 0 && (
                    <FiClock className="w-5 h-5 text-yellow-500" />
                  )}
                </button>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedCollection(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdateStatus}
                  className="flex-1"
                  disabled={updatingStatus}
                >
                  {updatingStatus ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GSTManagement;