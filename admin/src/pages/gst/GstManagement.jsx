// pages/gst/GstManagement.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [dataViewMode, setDataViewMode] = useState('paginate'); // 'paginate' or 'all'
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

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const options = [{ value: '', label: 'All Years' }];
    // Include 5 years before and 2 years after current year
    for (let year = currentYear - 5; year <= currentYear + 2; year++) {
      options.push({ value: String(year), label: String(year) });
    }
    return options;
  }, []);

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
        if (dataViewMode === 'all') params.search = 'all';
        if (filters.month) params.month = filters.month;
        if (filters.year) params.year = filters.year;
        fetchGstCollections(userId, params);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters.month, filters.year, dataViewMode, userId, fetchGstCollections]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);

    try {
      const params = {};
      if (dataViewMode === 'all') params.search = 'all';
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

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const isGstIn = activeTab === 'gst_in';
    const title = isGstIn ? 'GST In Report' : 'GST Out Report';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            margin: 0;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            color: #1a1a1a;
          }
          .header p {
            margin: 5px 0 0;
            color: #666;
            font-size: 14px;
          }
          .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item label {
            display: block;
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .summary-item .value {
            font-size: 18px;
            font-weight: bold;
            color: #1a1a1a;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
          }
          td {
            font-size: 12px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .amount {
            text-align: right;
            font-family: monospace;
          }
          .center {
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          ${filters.year || filters.month ? `<p>Filter: ${filters.month ? new Date(2024, parseInt(filters.month) - 1).toLocaleString('default', { month: 'long' }) : ''} ${filters.year ? filters.year : ''}</p>` : ''}
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <label>View Mode</label>
            <div class="value">${dataViewMode === 'all' ? 'All Records' : 'Paginated'}</div>
          </div>
          <div class="summary-item">
            <label>Total Records</label>
            <div class="value">${dataViewMode === 'all' ? tableData.length : getTotalCount()}</div>
          </div>
          <div class="summary-item">
            <label>Total GST</label>
            <div class="value">${formatCurrency(isGstIn ? summary.gstIn : summary.gstOut)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              ${isGstIn ? `
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th class="amount">Price</th>
                <th class="center">GST %</th>
                <th class="amount">GST Amount</th>
                <th>Created</th>
              ` : `
                <th>ID</th>
                <th>Product</th>
                <th>Seller</th>
                <th>Quantity</th>
                <th class="amount">Purchase Price</th>
                <th class="center">GST %</th>
                <th class="amount">GST Amount</th>
                <th>Created</th>
              `}
            </tr>
          </thead>
          <tbody>
            ${tableData.map(item => {
              if (isGstIn) {
                // GST In data structure
                const invoiceNumber = item.invoice_number || item.invoice?.invoice_number || item._originalId || 'N/A';
                const customer = item.customer || item.invoice?.customer || {};
                const customerName = customer.name || customer.customer_name || `${item.customer_id || 'N/A'}`;
                const product = item.product || {};
                const productName = product.name || product.product_name || `${item.product_id || 'N/A'}`;
                const quantity = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                const gstPercent = parseFloat(item.gst) || 0;
                const gstAmount = (price * gstPercent) / (100 + gstPercent);
                
                return `
                  <tr>
                    <td>#${invoiceNumber}</td>
                    <td>${customerName}</td>
                    <td>${productName}</td>
                    <td class="center">${quantity.toFixed(2)}</td>
                    <td class="amount">${formatCurrency(price)}</td>
                    <td class="center">${gstPercent.toFixed(2)}%</td>
                    <td class="amount">${formatCurrency(gstAmount)}</td>
                    <td>${formatDate(item.created_at || item.invoice?.created_at)}</td>
                  </tr>
                `;
              } else {
                // GST Out data structure
                const id = item._originalId || item.id || 'N/A';
                const stock = item.stock || {};
                const product = stock.product || item.product || {};
                const productName = product.name || product.product_name || `${item.product_id || 'N/A'}`;
                const seller = item.seller || {};
                const sellerName = seller.name || seller.seller_name || `${item.seller_id || 'N/A'}`;
                const quantity = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                const gstPercent = parseFloat(item.gst) || 0;
                const gstAmount = (price * gstPercent) / 100;
                
                return `
                  <tr>
                    <td>#${id}</td>
                    <td>${productName}</td>
                    <td>${sellerName}</td>
                    <td class="center">${quantity.toFixed(2)}</td>
                    <td class="amount">${formatCurrency(price)}</td>
                    <td class="center">${gstPercent.toFixed(2)}%</td>
                    <td class="amount">${formatCurrency(gstAmount)}</td>
                    <td>${formatDate(item.created_at)}</td>
                  </tr>
                `;
              }
            }).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated report. No signature required.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Get current data based on active tab - ensure unique IDs
  const getCurrentData = () => {
    let data = [];
    switch(activeTab) {
      case 'gst_in':
        // Flatten invoice_items from each invoice
        const invoices = gstInData || [];
        data = invoices.flatMap((invoice, invIndex) => {
          const items = invoice.invoice_items || [];
          return items.map((item, itemIndex) => ({
            ...item,
            // Add invoice context to each item
            invoice: invoice,
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            customer_id: invoice.customer_id,
            customer: invoice.customer,
            // Override id with a unique value for the table key
            id: item._uniqueId || `gst_in-${item.id}-${invIndex}-${itemIndex}`,
            // Keep original id for reference
            _originalId: invoice.invoice_number,
          }));
        });
        break;
      case 'gst_out':
        // Use stock-specific price and GST values
        const purchases = gstOutData || [];
        data = purchases.map((item, index) => ({
          ...item,
          // Use stock-specific values if available
          price:  item.price, //|| item.stock?.purchase_price ,
          gst: item.stock?.purchase_gst_percentage || item.gst,
          // Override id with a unique value for the table key
          id: item._uniqueId || `gst_out-${item.id}-${index}`,
          // Keep original id for reference
          _originalId: item.id,
        }));
        break;
      default:
        return [];
    }
    
    // Ensure each item has a unique id for the table key
    return data.map((item, index) => ({
      ...item,
      // Override id with a unique value for the table key (if not already set)
      id: item.id || `${activeTab}-${index}`,
      // Keep original id for reference
      _originalId: item._originalId || item.id,
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

  // GST In Columns - memoized with unique IDs
  const gstInColumns = useMemo(() => [
    {
      id: 'invoice_id',
      header: 'Invoice ID',
      accessor: '_originalId',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      id: 'customer',
      header: 'Customer',
      accessor: 'customer',
      cell: (value, row) => {
        const customer = value || row.invoice?.customer || {};
        const customerName = customer.name || customer.customer_name || `${row.customer_id || 'N/A'}`;
        return (
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {customerName}
            </p>
          </div>
        );
      },
    },
    {
      id: 'product',
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
      id: 'quantity',
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      id: 'selling_price',
      header: 'Selling Price',
      accessor: 'price',
      cell: (value) => (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      id: 'gst_percent',
      header: 'GST %',
      accessor: 'gst',
      cell: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {parseFloat(value).toFixed(2)}%
        </span>
      ),
    },
    {
      id: 'gst_amount',
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
      id: 'created',
      header: 'Created',
      accessor: 'created_at',
      cell: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
  ], []);

  // GST Out Columns - memoized with unique IDs
  const gstOutColumns = useMemo(() => [
    {
      id: 'id',
      header: 'ID',
      accessor: '_originalId',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      id: 'product',
      header: 'Product',
      accessor: 'stock',
      cell: (value) => {
        const product = value?.product || {};
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
      id: 'seller',
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
      id: 'quantity',
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {parseFloat(value).toFixed(2)}
        </span>
      ),
    },
    {
      id: 'purchase_price',
      header: 'Purchase Price',
      accessor: 'price',
      cell: (value) => (
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      id: 'gst_percent',
      header: 'GST %',
      accessor: 'gst',
      cell: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {parseFloat(value).toFixed(2)}%
        </span>
      ),
    },
    {
      id: 'gst_amount',
      header: 'GST Amount',
      accessor: 'gst_amount_calc',
      cell: (_, row) => {
        const price = parseFloat(row.price) || 0;
        const gstPercent = parseFloat(row.gst) || 0;
        const gstAmount = ((price * gstPercent) / 100 ) * row.quantity;
        return (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium">
            {formatCurrency(gstAmount)}
          </span>
        );
      },
    },
    {
      id: 'created',
      header: 'Created',
      accessor: 'created_at',
      cell: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
  ], []);

  // Get columns based on active tab - memoized
  const getColumnsForTab = useMemo(() => {
    switch(activeTab) {
      case 'gst_in':
        return gstInColumns;
      case 'gst_out':
        return gstOutColumns;
      default:
        return [];
    }
  }, [activeTab, gstInColumns, gstOutColumns]);

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
  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5 px-3 sm:px-0"
>
  {/* GST In (Sales) */}
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
          GST In (Sales)
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mt-1 truncate">
          {formatCurrency(summary.gstIn)}
        </p>
      </div>
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-3">
        <FiArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
      </div>
    </div>
   
  </motion.div>

  {/* GST Out (Purchases) */}
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
          GST Out (Purchases)
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mt-1 truncate">
          {formatCurrency(summary.gstOut)}
        </p>
      </div>
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-3">
        <FiArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
      </div>
    </div>
   
  </motion.div>

  {/* Net GST */}
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
          Net GST
        </p>
        <p className={`text-xl sm:text-2xl md:text-3xl font-bold mt-1 truncate ${
          (summary.gstIn - summary.gstOut) >= 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {formatCurrency(summary.gstIn - summary.gstOut)}
        </p>
      </div>
      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-3 ${
        (summary.gstIn - summary.gstOut) >= 0 
          ? 'bg-green-100 dark:bg-green-900/30' 
          : 'bg-red-100 dark:bg-red-900/30'
      }`}>
        {(summary.gstIn - summary.gstOut) >= 0 ? 
          <FiTrendingUp className={`w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400`} /> :
          <FiTrendingDown className={`w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400`} />
        }
      </div>
    </div>
    
  </motion.div>

  {/* Total Collections */}
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border border-gray-100 dark:border-gray-700"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">
          Total Collections
        </p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mt-1 truncate">
          {(gstInPagination?.total || 0) + (gstOutPagination?.total || 0)}
        </p>
      </div>
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg sm:rounded-xl flex items-center justify-center ml-2 sm:ml-3">
        <FaRupeeSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
      </div>
    </div>
   
  </motion.div>
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
            GST In 
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
            GST Out 
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 ">
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
                  <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => {
                        setDataViewMode('paginate');
                        const params = {};
                        if (filters.month) params.month = filters.month;
                        if (filters.year) params.year = filters.year;
                        fetchGstCollections(userId, params);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        dataViewMode === 'paginate'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Paginate
                    </button>
                    <button
                      onClick={() => {
                        setDataViewMode('all');
                        const params = { search: 'all' };
                        if (filters.month) params.month = filters.month;
                        if (filters.year) params.year = filters.year;
                        fetchGstCollections(userId, params);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        dataViewMode === 'all'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      All
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    className="flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Print PDF</span>
                  </Button>
                </div>
              </div>
            </div>
            <Table
              key={activeTab}
              columns={getColumnsForTab}
              data={tableData}
              loading={loading}
            />
            {dataViewMode === 'paginate' && getCurrentPagination() && (
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