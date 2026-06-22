// pages/Sellers/Sellers.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiUsers,
  FiDownload,
  FiRefreshCw,
  FiX,
  FiGrid,
  FiList,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiUser,
  FiDollarSign,
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Table from '../../components/common/Table/Table';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Pagination from '../../components/common/Pagination/Pagination';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Select from '../../components/common/Select/Select';
import SellerForm from '../../components/features/Sellers/SellerForm';
import useSellerStore from '../../store/sellerStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Sellers = () => {
  const { user } = useAuthStore();
  const {
    sellers,
    totalSellers,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchSellers,
    createSeller,
    updateSeller,
    deleteSeller,
    getSellerById,
    setFilters,
    clearCache,
  } = useSellerStore();

  // Ensure sellers is an array
  const safeSellers = Array.isArray(sellers) ? sellers : [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSeller, setViewingSeller] = useState(null);

  const initializedRef = useRef(false);

  // Get current user ID
  const getUserId = () => {
    if (user && user.id) {
      return user.id.toString();
    }
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const userId = parsed.state?.user?.id || parsed.user?.id;
        return userId ? userId.toString() : '1';
      } catch (error) {
        console.error('Error parsing auth storage:', error);
        return '1';
      }
    }
    return '1';
  };

  const currentUserId = getUserId();

  // Initial fetch
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const fetchData = async () => {
      try {
        console.log('🔄 Fetching sellers for user:', currentUserId);
        await fetchSellers(currentUserId);
        console.log('✅ Sellers fetched successfully');
      } catch (error) {
        console.error('❌ Failed to fetch sellers:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();

    return () => {
      clearCache();
    };
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleAddSeller = () => {
    setShowAddForm(true);
    setShowEditForm(false);
    setSelectedSeller(null);
  };

  const handleEditSeller = async (seller) => {
    try {
      // Fetch fresh data for the seller
      const sellerData = await getSellerById(seller.id);
      console.log('📝 Seller data for edit:', sellerData);
      
      // If sellerData exists, use it, otherwise fallback to the passed seller
      if (sellerData) {
        setSelectedSeller(sellerData);
      } else {
        // Fallback to the seller from the list
        setSelectedSeller(seller);
      }
      setShowEditForm(true);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to fetch seller data:', error);
      // Fallback to existing seller data
      setSelectedSeller(seller);
      setShowEditForm(true);
      setShowAddForm(false);
    }
  };

  const handleViewSeller = (seller) => {
    setViewingSeller(seller);
    setShowViewModal(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedSeller(null);
  };

  const handleSubmitSeller = async (sellerData) => {
    setFormSubmitting(true);
    try {
      // Ensure user_id is set
      const data = {
        ...sellerData,
        user_id: currentUserId,
      };

      if (showEditForm && selectedSeller) {
        await updateSeller(selectedSeller.id, data);
        console.log('✅ Seller updated successfully');
        toast.success('Seller updated successfully');
      } else {
        await createSeller(data);
        console.log('✅ Seller created successfully');
        toast.success('Seller created successfully');
      }
      // Refresh the seller list
      await fetchSellers(currentUserId);
      handleCancelForm();
    } catch (error) {
      console.error(`Error ${showEditForm ? 'updating' : 'creating'} seller:`, error);
      toast.error(error.response?.data?.message || `Failed to ${showEditForm ? 'update' : 'create'} seller`);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClick = (seller) => {
    setSellerToDelete(seller);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (sellerToDelete) {
      try {
        await deleteSeller(sellerToDelete.id);
        await fetchSellers(currentUserId);
        setShowDeleteConfirm(false);
        setSellerToDelete(null);
        toast.success('Seller deleted successfully');
      } catch (error) {
        console.error('Error deleting seller:', error);
        toast.error('Failed to delete seller');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSellers.length === 0) return;
    try {
      for (const id of selectedSellers) {
        await deleteSeller(id);
      }
      setSelectedSellers([]);
      setShowDeleteConfirm(false);
      await fetchSellers(currentUserId);
      toast.success(`${selectedSellers.length} sellers deleted successfully`);
    } catch (error) {
      console.error('Error bulk deleting sellers:', error);
      toast.error('Failed to delete sellers');
    }
  };

  const handlePageChange = (url) => {
    const pageMatch = url.match(/page=(\d+)/);
    if (pageMatch) {
      fetchSellers(currentUserId, pageMatch[1], filters);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    clearCache();
    await fetchSellers(currentUserId);
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ search: '' });
  };

  const toggleSellerSelection = (sellerId) => {
    setSelectedSellers((prev) =>
      prev.includes(sellerId)
        ? prev.filter((id) => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const selectAllSellers = () => {
    if (selectedSellers.length === safeSellers.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(safeSellers.map((s) => s.id));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={
              selectedSellers.length === safeSellers.length &&
              safeSellers.length > 0
            }
            onChange={selectAllSellers}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: 'selection',
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedSellers.includes(row.id)}
          onChange={() => toggleSellerSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: 'Seller',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mr-3 flex items-center justify-center flex-shrink-0">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            {row.gst_number && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                GST: {row.gst_number}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'email',
      cell: (value, row) => (
        <div className="space-y-1">
          {value && (
            <div className="flex items-center space-x-2 text-sm">
              <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                {value}
              </span>
            </div>
          )}
          {row.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                {row.phone}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Location',
      accessor: 'address',
      cell: (value, row) => (
        <div className="space-y-1">
          {value && (
            <div className="flex items-start space-x-2 text-sm">
              <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                {value}
              </div>
            </div>
          )}
          {(row.city || row.state) && (
            <div className="text-sm text-gray-500 dark:text-gray-500 pl-6">
              {[row.city, row.state].filter(Boolean).join(', ')}
              {row.pincode && ` - ${row.pincode}`}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Due Amount',
      accessor: 'due_amount',
      cell: (value) => {
        const dueAmount = parseFloat(value) || 0;
        return (
          <div className="flex items-center">
            <FaRupeeSign className="w-3 h-3 mr-1 text-gray-500" />
            <span className={`font-medium ${dueAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {dueAmount.toFixed(2)}
            </span>
            {dueAmount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                Due
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewSeller(row)}
            className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View seller details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditSeller(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit seller"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDeleteClick(row)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete seller"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading seller data...</p>
      </div>
    </div>
  );

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
            Sellers / Providers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiUsers className="w-4 h-4 mr-2" />
            Manage your sellers and service providers
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!showAddForm && !showEditForm && (
            <>
              {/* View Toggle */}
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

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiRefreshCw
                  className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`}
                />
              </motion.button>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* Add Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={handleAddSeller} icon={FiPlus} className="shadow-lg shadow-primary-500/30">
                  Add Seller
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Form or Content */}
      {showAddForm || showEditForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <SellerForm
            seller={selectedSeller}
            onSubmit={handleSubmitSeller}
            onCancel={handleCancelForm}
            isSubmitting={formSubmitting}
            isEdit={showEditForm}
          />
        </motion.div>
      ) : (
        <>
          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedSellers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                      {selectedSellers.length} seller{selectedSellers.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      onClick={() => setSelectedSellers([])}
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search sellers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                {searchTerm && (
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
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {initialLoading ? (
              <SkeletonLoader />
            ) : loading && !initialLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Updating seller data...</p>
                </div>
              </div>
            ) : safeSellers.length > 0 ? (
              viewMode === 'table' ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <Table
                    columns={columns}
                    data={safeSellers}
                    loading={loading}
                  />
                  {totalSellers > pageSize && (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalSellers}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              ) : (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeSellers.map((seller, index) => {
                    const dueAmount = parseFloat(seller.due_amount) || 0;
                    return (
                      <motion.div
                        key={seller.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
                      >
                        {/* Header */}
                        <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600">
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <FiUser className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-base truncate max-w-[150px]">
                                  {seller.name}
                                </h3>
                                {seller.gst_number && (
                                  <p className="text-white/80 text-xs">
                                    GST: {seller.gst_number}
                                  </p>
                                )}
                              </div>
                            </div>
                            {dueAmount > 0 && (
                              <div className="px-2 py-1 bg-red-500/80 backdrop-blur rounded-lg text-white text-xs font-medium">
                                Due: ₹{dueAmount.toFixed(2)}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewSeller(seller)}
                              className="p-2 bg-white rounded-lg text-gray-600 hover:bg-gray-50"
                              title="View seller"
                            >
                              <FiEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditSeller(seller)}
                              className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Edit seller"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteClick(seller)}
                              className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                              title="Delete seller"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-2">
                          {seller.email && (
                            <div className="flex items-center space-x-2 text-sm">
                              <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400 truncate">
                                {seller.email}
                              </span>
                            </div>
                          )}
                          {seller.phone && (
                            <div className="flex items-center space-x-2 text-sm">
                              <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {seller.phone}
                              </span>
                            </div>
                          )}
                          {seller.address && (
                            <div className="flex items-start space-x-2 text-sm">
                              <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400 text-sm truncate">
                                {seller.address}
                                {seller.city && `, ${seller.city}`}
                                {seller.state && `, ${seller.state}`}
                              </span>
                            </div>
                          )}
                          {/* Due Amount in Grid View */}
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Due Amount</span>
                            <span className={`font-semibold ${dueAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                              ₹{dueAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            ) : (
              <EmptyState
                icon={FiUsers}
                title="No sellers yet"
                description={
                  searchTerm
                    ? 'No sellers match your search criteria'
                    : 'Get started by adding your first seller or service provider'
                }
                action={
                  !searchTerm && (
                    <Button onClick={handleAddSeller} icon={FiPlus} size="lg">
                      Add Your First Seller
                    </Button>
                  )
                }
              />
            )}
          </motion.div>
        </>
      )}

      {/* View Seller Modal */}
      <AnimatePresence>
        {showViewModal && viewingSeller && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowViewModal(false);
              setViewingSeller(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Seller Details
                </h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingSeller(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FiUser className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {viewingSeller.name}
                    </h3>
                    {viewingSeller.gst_number && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        GST: {viewingSeller.gst_number}
                      </p>
                    )}
                    <div className="flex items-center mt-1">
                      <span className={`text-sm font-medium ${parseFloat(viewingSeller.due_amount) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        Due Amount: {formatCurrency(viewingSeller.due_amount)}
                      </span>
                      {parseFloat(viewingSeller.due_amount) > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full">
                          Payment Due
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Contact Information
                    </h4>
                    {viewingSeller.email && (
                      <div className="flex items-center space-x-3 text-sm">
                        <FiMail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{viewingSeller.email}</span>
                      </div>
                    )}
                    {viewingSeller.phone && (
                      <div className="flex items-center space-x-3 text-sm">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{viewingSeller.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Address Information */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Address Information
                    </h4>
                    {viewingSeller.address && (
                      <div className="flex items-start space-x-3 text-sm">
                        <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-gray-600 dark:text-gray-400">
                          <p>{viewingSeller.address}</p>
                          {(viewingSeller.city || viewingSeller.state) && (
                            <p>
                              {[viewingSeller.city, viewingSeller.state].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {viewingSeller.pincode && (
                            <p>Pincode: {viewingSeller.pincode}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Seller ID</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">#{viewingSeller.id}</p>
                    </div>
                    {viewingSeller.created_at && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(viewingSeller.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                    {viewingSeller.updated_at && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(viewingSeller.updated_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowViewModal(false);
                      setViewingSeller(null);
                      handleEditSeller(viewingSeller);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <FiEdit2 className="w-4 h-4 mr-2" />
                    Edit Seller
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowViewModal(false);
                      setViewingSeller(null);
                    }}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowDeleteConfirm(false);
              setSellerToDelete(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {sellerToDelete
                    ? 'Delete Seller'
                    : `Delete ${selectedSellers.length > 1 ? 'Sellers' : 'Seller'}`}
                </h3>
                {sellerToDelete ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Are you sure you want to delete this seller?
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
                      "{sellerToDelete.name}"
                    </p>
                    {parseFloat(sellerToDelete.due_amount) > 0 && (
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        ⚠️ This seller has a due amount of {formatCurrency(sellerToDelete.due_amount)}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete {selectedSellers.length}{' '}
                    selected {selectedSellers.length === 1 ? 'seller' : 'sellers'}?
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSellerToDelete(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={sellerToDelete ? handleDelete : handleBulkDelete}
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
    </motion.div>
  );
};

export default Sellers;