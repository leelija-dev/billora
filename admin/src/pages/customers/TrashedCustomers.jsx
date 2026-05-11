import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiUsers,
  FiArrowLeft,
  FiAlertCircle,
  FiRotateCcw,
  FiX,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomerStore } from "../../store/customerStore";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Pagination from "../../components/common/Pagination/Pagination";
import toast from "react-hot-toast";
import { FaRupeeSign } from "react-icons/fa";

const TrashedCustomers = () => {
  const navigate = useNavigate();
  const {
    customers,
    totalCustomers,
    loading,
    fetchTrashedCustomers,
    restoreCustomer,
    forceDeleteCustomer,
  } = useCustomerStore();

  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [pageLoading, setPageLoading] = useState(false);

  // Ensure customers is an array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  useEffect(() => {
    fetchTrashedCustomers();
  }, []);

  const handlePageChange = (page) => {
    setPageLoading(true);
    fetchTrashedCustomers(page).finally(() => {
      setPageLoading(false);
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTrashedCustomers(currentPage);
    setRefreshing(false);
    toast.success("Trashed customers refreshed!");
  };

  const handleRestore = async (customer) => {
    setSelectedCustomer(customer);
    setShowRestoreConfirm(true);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedCustomer) return;

    try {
      await restoreCustomer(selectedCustomer.id);
      setShowRestoreConfirm(false);
      setSelectedCustomer(null);
      // Refresh current page to show updated data
      await fetchTrashedCustomers(currentPage);
      toast.success("Customer restored successfully!");
    } catch (error) {
      console.error("Failed to restore customer:", error);
      toast.error("Failed to restore customer");
    }
  };

  const handlePermanentDelete = async (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteConfirm(true);
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!selectedCustomer) return;

    try {
      await forceDeleteCustomer(selectedCustomer.id);
      setShowDeleteConfirm(false);
      setSelectedCustomer(null);
      // Refresh current page to show updated data
      await fetchTrashedCustomers(currentPage);
      toast.success("Customer permanently deleted!");
    } catch (error) {
      console.error("Failed to permanently delete customer:", error);
      toast.error("Failed to permanently delete customer");
    }
  };

  const handleBulkRestore = async () => {
    try {
      for (const customer of selectedCustomers) {
        await restoreCustomer(customer.id);
      }
      const restoredCount = selectedCustomers.length;
      setSelectedCustomers([]);
      // Refresh current page to show updated data
      await fetchTrashedCustomers(currentPage);
      toast.success(`${restoredCount} customers restored successfully!`);
    } catch (error) {
      console.error("Failed to restore customers:", error);
      toast.error("Failed to restore some customers");
    }
  };

  const handleBulkPermanentDelete = async () => {
    try {
      for (const customer of selectedCustomers) {
        await forceDeleteCustomer(customer.id);
      }
      const deletedCount = selectedCustomers.length;
      setSelectedCustomers([]);
      // Refresh current page to show updated data
      await fetchTrashedCustomers(currentPage);
      toast.success(`${deletedCount} customers permanently deleted!`);
    } catch (error) {
      console.error("Failed to permanently delete customers:", error);
      toast.error("Failed to permanently delete some customers");
    }
  };

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === safeCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(safeCustomers.map((c) => c?.id).filter(Boolean));
    }
  };

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={
              selectedCustomers.length === safeCustomers.length &&
              safeCustomers.length > 0
            }
            onChange={selectAllCustomers}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: "selection",
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedCustomers.includes(row?.id)}
          onChange={() => toggleCustomerSelection(row?.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: "Customer",
      accessor: "name",
      cell: (value, row) => (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {value?.charAt(0) || "U"}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-red-500"
            />
          </motion.div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FiMail className="w-3 h-3 mr-1" />
              {row?.email}
            </p>
          </div>
        </motion.div>
      ),
    },
    {
      header: "Contact",
      accessor: "phone",
      cell: (value, row) => (
        <div className="space-y-1">
          {value && value !== "-" ? (
            <motion.p
              whileHover={{ x: 2 }}
              className="text-sm text-gray-600 dark:text-gray-300 flex items-center"
            >
              <FiPhone className="w-3 h-3 mr-1 text-gray-400" />
              {value}
            </motion.p>
          ) : (
            <p className="text-sm text-gray-400">No phone</p>
          )}
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "address",
      cell: (value, row) => (
        <motion.div
          whileHover={{ x: 2 }}
          className="flex items-start space-x-1"
        >
          <FiMapPin className="w-3 h-3 mt-0.5 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {row?.city || "N/A"}
          </span>
        </motion.div>
      ),
    },
    {
      header: "Due Amount",
      accessor: "due_amount",
      cell: (value) => (
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
          <FaRupeeSign className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ₹{parseFloat(value || 0).toFixed(2)}
          </span>
        </motion.div>
      ),
    },
    {
      header: "Deleted At",
      accessor: "deleted_at",
      cell: (value) => (
        <div className="flex items-center">
          <FiCalendar className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {value
              ? new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (_, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleRestore(row)}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Restore customer"
          >
            <FiRotateCcw className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePermanentDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Permanently delete customer"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6 p-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              Trashed Customers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiTrash2 className="w-4 h-4 mr-2" />
              Manage soft-deleted customers - restore or permanently delete
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={handleRefresh}
              className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <FiRefreshCw
                className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? "animate-spin" : ""}`}
              />
            </motion.button>

            {/* Back Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/customers")}
                icon={FiArrowLeft}
              >
                Back to Customers
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Trashed</p>
                  <motion.p
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
                  >
                    {safeCustomers.length}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg"
                >
                  <FiTrash2 className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Can Restore</p>
                  <motion.p
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
                  >
                    {safeCustomers.length}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg"
                >
                  <FiRotateCcw className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Due</p>
                  <motion.p
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
                  >
                    ₹{safeCustomers.reduce((sum, c) => sum + (parseFloat(c?.due_amount) || 0), 0).toFixed(2)}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                >
                  <FiDollarSign className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedCustomers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-medium text-orange-700 dark:text-orange-300"
                  >
                    {selectedCustomers.length} customers selected
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCustomers([])}
                    className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400"
                  >
                    Clear selection
                  </motion.button>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleBulkRestore}
                      icon={FiRotateCcw}
                      className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20"
                    >
                      Restore All
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="danger"
                      onClick={handleBulkPermanentDelete}
                      icon={FiTrash2}
                    >
                      Delete All
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
              />
            </div>
          ) : safeCustomers.length === 0 ? (
            <EmptyState
              title="No trashed customers"
              description="No customers have been soft-deleted yet."
              icon={FiTrash2}
              action={
                <Button onClick={() => navigate("/customers")} icon={FiArrowLeft}>
                  View Active Customers
                </Button>
              }
            />
          ) : (
            <>
              <Table
                columns={columns}
                data={safeCustomers}
                loading={loading}
                className="min-w-[800px]"
              />
              
              {/* Pagination */}
              {totalCustomers > pageSize && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6"
                >
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalCustomers}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Restore Confirmation Modal */}
      <AnimatePresence>
        {showRestoreConfirm && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRestoreConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <FiRotateCcw className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Restore Customer
                  </motion.h3>

                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    Are you sure you want to restore{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedCustomer.name}
                    </span>
                    ? This will make them active again.
                  </motion.p>

                  <div className="flex items-center justify-center space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={() => setShowRestoreConfirm(false)}
                        icon={FiX}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleRestoreConfirm}
                        icon={FiRotateCcw}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Restore
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permanent Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <FiAlertCircle className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Permanently Delete Customer
                  </motion.h3>

                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    Are you sure you want to permanently delete{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedCustomer.name}
                    </span>
                    ? This action cannot be undone.
                  </motion.p>

                  <div className="flex items-center justify-center space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(false)}
                        icon={FiX}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="danger"
                        onClick={handlePermanentDeleteConfirm}
                        icon={FiTrash2}
                      >
                        Delete Forever
                      </Button>
                    </motion.div>
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

export default TrashedCustomers;
