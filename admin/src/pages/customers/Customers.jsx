import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiMoreVertical,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
  FiX,
  FiStar,
  FiArrowLeft,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomerStore } from "../../store/customerStore";
import { customerAPI } from "../../services/customerService";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import Pagination from "../../components/common/Pagination/Pagination";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import CustomerForm from "../../components/features/Customers/CustomerForm";
import Select from "../../components/common/Select/Select";
import { FaUser, FaUsers } from "react-icons/fa";

const Customers = () => {
  const navigate = useNavigate();
  const {
    customers,
    totalCustomers,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setFilters,
  } = useCustomerStore();

  // Ensure customers is an array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchCustomers();
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Calculate stats with safeCustomers
  const stats = {
    total: safeCustomers.length,
    active: safeCustomers.filter((c) => c?.status === "active").length,
    inactive: safeCustomers.filter((c) => c?.status === "inactive").length,
    blocked: safeCustomers.filter((c) => c?.status === "blocked").length,
    totalSpent: safeCustomers.reduce(
      (sum, c) => sum + (parseFloat(c?.due_amount) || 0),
      0,
    ),
    totalOrders: safeCustomers.reduce(
      (sum, c) => sum + (c?.total_orders || 0),
      0,
    ),
  };

  const handleViewDetails = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEditForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowPaymentModal(false);
    setSelectedCustomer(null);
    setPaymentAmount("");
  };

  const handlePaymentClick = (customer) => {
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
    setPaymentAmount("");
  };

  const handlePaymentSubmit = async () => {
    if (!selectedCustomer || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      return;
    }

    try {
      setFormSubmitting(true);
      await customerAPI.makeDuePayment(selectedCustomer.id, { due_payment: paymentAmount });
      
      // Clear cache to force fresh data fetch
      const { clearCache } = useCustomerStore.getState();
      clearCache();
      
      // Fetch fresh data with current page and search
      await fetchCustomers(currentPage, filters.search);
      
      // Close modal and reset state
      setShowPaymentModal(false);
      setSelectedCustomer(null);
      setPaymentAmount("");
      
      // Show success message (you might want to use a toast notification)
      console.log("Payment processed successfully");
    } catch (error) {
      console.error("Failed to process payment:", error);
      // Handle error (show toast notification, etc.)
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSubmitCustomer = async (customerData) => {
    setFormSubmitting(true);
    try {
      if (showEditForm && selectedCustomer) {
        await updateCustomer(selectedCustomer.id, customerData);
      } else {
        await createCustomer(customerData);
      }
      // Refresh the customer list
      await fetchCustomers();
      // Hide the form
      handleCancelForm();
    } catch (error) {
      console.error("Error saving customer:", error);
      // Handle error (show toast notification, etc.)
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      setShowDeleteConfirm(false);
      setSelectedCustomer(null);
      fetchCustomers(currentPage);
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedCustomers) {
        await deleteCustomer(id);
      }
      setSelectedCustomers([]);
      setShowDeleteConfirm(false);
      fetchCustomers(currentPage);
    } catch (error) {
      console.error("Failed to delete customers:", error);
    }
  };

  const handlePageChange = (page) => {
    setPageLoading(true);
    fetchCustomers(page).finally(() => {
      setPageLoading(false);
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ search: "", status: "" });
  };

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === safeCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(safeCustomers.map((c) => c?.id).filter(Boolean));
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group cursor-pointer"
    >
      <div
        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <motion.p
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mt-2"
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

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
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {value?.charAt(0) || "U"}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                row?.status === "active"
                  ? "bg-green-500"
                  : row?.status === "blocked"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
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
          <FiDollarSign className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ${parseFloat(value || 0).toFixed(2)}
          </span>
        </motion.div>
      ),
    },
    {
      header: "Customer Since",
      accessor: "created_at",
      cell: (value) => (
        <div className="flex items-center">
          <FiCalendar className="w-3 h-3 mr-1 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {value
              ? new Date(value).toLocaleDateString("en-US", {
                  month: "short",
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
            onClick={() => handleViewDetails(row)}
            className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="View customer details"
          >
            <FaUsers className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePaymentClick(row)}
            className="p-2 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            title="Make payment"
          >
            <FiCreditCard className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEditClick(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit customer"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedCustomer(row);
              setShowDeleteConfirm(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete customer"
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Customers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FaUsers className="w-4 h-4 mr-2" />
              {showAddForm || showEditForm ? (
                <span>
                  {showEditForm ? "Edit Customer" : "Add New Customer"}
                </span>
              ) : (
                <span>
                  Manage your customer relationships and view insights
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Only show these buttons when not in form mode */}
            {!showAddForm && !showEditForm && (
              <>
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

                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </>
            )}

            {/* Add Customer Button or Back Button */}
            {!showAddForm && !showEditForm ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  onClick={handleAddClick}
                  icon={FiPlus}
                  className="shadow-lg shadow-primary-500/30"
                >
                  Add Customer
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Button
                  variant="outline"
                  onClick={handleCancelForm}
                  icon={FiArrowLeft}
                >
                  Back to Customers
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Conditional rendering: Show form or table/search */}
        {showAddForm || showEditForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {showEditForm ? "Edit Customer" : "Add New Customer"}
            </h2>
            <CustomerForm
              initialData={selectedCustomer}
              onSubmit={handleSubmitCustomer}
              onCancel={handleCancelForm}
              isSubmitting={formSubmitting}
            />
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
            >
              {initialLoading ? (
                // Loading skeleton for stats cards
                Array.from({ length: 5 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <>
                  <StatCard
                    title="Total Customers"
                    value={stats.total}
                    icon={FaUsers}
                    color="from-blue-500 to-cyan-500"
                    delay={0.1}
                  />
                  <StatCard
                    title="Active"
                    value={stats.active}
                    icon={FiUserCheck}
                    color="from-green-500 to-emerald-500"
                    subtitle={`${((stats.active / stats.total) * 100 || 0).toFixed(1)}% of total`}
                    delay={0.2}
                  />
                  <StatCard
                    title="Inactive"
                    value={stats.inactive}
                    icon={FiUserMinus}
                    color="from-yellow-500 to-orange-500"
                    delay={0.3}
                  />
                  <StatCard
                    title="Blocked"
                    value={stats.blocked}
                    icon={FiUserX}
                    color="from-red-500 to-pink-500"
                    delay={0.4}
                  />
                  <StatCard
                    title="Total Due"
                    value={`₹${stats.totalSpent.toFixed(2)}`}
                    icon={FiDollarSign}
                    color="from-indigo-500 to-purple-500"
                    subtitle={`Avg: ₹${(stats.totalSpent / (stats.total || 1)).toFixed(2)}/customer`}
                    delay={0.5}
                  />
                </>
              )}
            </motion.div>

            {/* Filters Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              {initialLoading ? (
                // Loading skeleton for filters
                <div className="animate-pulse">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search customers by name, email, phone, or address..."
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
                        className={`px-4 py-2 rounded-xl border transition-colors flex items-center space-x-2 ${
                          showFilters
                            ? "bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <FiFilter className="w-4 h-4" />
                        <span>Filters</span>
                        {filters.status && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-1 w-2 h-2 bg-primary-500 rounded-full"
                          />
                        )}
                      </motion.button>

                      {(searchTerm || filters.status) && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          onClick={clearFilters}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <FiX className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  </div>

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
                              label="Status"
                              options={[
                                { value: "", label: "All Statuses" },
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                                { value: "blocked", label: "Blocked" },
                              ]}
                              value={filters.status}
                              onChange={(e) =>
                                setFilters({ status: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedCustomers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-medium text-primary-700 dark:text-primary-300"
                      >
                        {selectedCustomers.length} customers selected
                      </motion.span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCustomers([])}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
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
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          Delete Selected
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Customers Table */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            >
              {initialLoading || pageLoading ? (
                // Loading skeleton for table
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mb-4"
                    />
                    <p className="text-gray-600 dark:text-gray-400">
                      {initialLoading
                        ? "Loading customer data..."
                        : "Updating customer data..."}
                    </p>
                  </div>
                </div>
              ) : safeCustomers.length === 0 ? (
                <EmptyState
                  icon={FaUsers}
                  title="No customers found"
                  description="Try adjusting your search or filters, or add your first customer."
                  action={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button onClick={handleAddClick} icon={FiPlus}>
                        Add Customer
                      </Button>
                    </motion.div>
                  }
                />
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <Table
                      columns={columns}
                      data={safeCustomers}
                      loading={loading}
                    />
                  </div>
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
          </>
        )}
      </motion.div>
      
      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiCreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </motion.div>
                
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Make Payment
                </motion.h3>
                
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Customer: <span className="font-semibold">{selectedCustomer.name}</span>
                  <br />
                  Current due amount: <span className="font-semibold text-red-600">
                    ${parseFloat(selectedCustomer.due_amount || 0).toFixed(2)}
                  </span>
                </motion.p>
                
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <Input
                    type="number"
                    label="Payment Amount"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="0"
                    max={selectedCustomer.due_amount || 0}
                    step="0.01"
                  />
                  
                  <div className="flex space-x-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        variant="outline"
                        onClick={() => setShowPaymentModal(false)}
                        disabled={formSubmitting}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={handlePaymentSubmit}
                        disabled={!paymentAmount || parseFloat(paymentAmount) <= 0 || formSubmitting}
                        loading={formSubmitting}
                      >
                        {formSubmitting ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
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
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </motion.div>
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Delete{" "}
                  {selectedCustomers.length > 1 ? "Customers" : "Customer"}
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  {selectedCustomers.length > 1
                    ? `Are you sure you want to delete ${selectedCustomers.length} selected customers? This action cannot be undone.`
                    : `Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
                </motion.p>
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setSelectedCustomer(null);
                      }}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="danger"
                      onClick={
                        selectedCustomers.length > 1
                          ? handleBulkDelete
                          : () => handleDelete(selectedCustomer?.id)
                      }
                      className="w-full"
                    >
                      Delete
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Customers;
