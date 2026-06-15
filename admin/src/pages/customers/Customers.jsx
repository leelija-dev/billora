import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUserCheck,
  FiUserX,
  FiUserMinus,
  FiX,
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
import Pagination from "../../components/common/Pagination/Pagination";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import CustomerForm from "../../components/features/Customers/CustomerForm";
import { FaRupeeSign, FaUser, FaUsers } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

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
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Filter states
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'due', 'city'
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredTotal, setFilteredTotal] = useState(0);

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
      if (activeFilter === "all") {
        setFilters({ search: searchTerm });
      } else if (activeFilter === "due") {
        handleDueFilter();
      } else if (activeFilter === "city") {
        handleCityFilter();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Handle due filter - customers with due amount > 0
  const handleDueFilter = async () => {
    setPageLoading(true);
    setActiveFilter("due");
    try {
      const { user } = useAuthStore.getState();
      if (user?.id) {
        const response = await customerAPI.getDueCustomers(
          user.id,
          searchTerm,
          1,
        );
        let customersArray = [];
        let total = 0;

        // Handle nested response structure
        if (
          response?.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          customersArray = response.data.data.data;
          total = response.data.data.total || customersArray.length;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          customersArray = response.data.data;
          total = response.data.data.total || customersArray.length;
        } else if (Array.isArray(response?.data)) {
          customersArray = response.data;
          total = customersArray.length;
        } else if (response?.data && typeof response.data === "object") {
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              customersArray = response.data[key];
              total = customersArray.length;
              break;
            }
          }
        }

        if (!Array.isArray(customersArray)) {
          customersArray = [];
          total = 0;
        }

        setFilteredCustomers(customersArray);
        setFilteredTotal(total);
        toast.success(`Found ${total} customer(s) with due amount`);
      }
    } catch (error) {
      console.error("Failed to fetch due customers:", error);
      toast.error("Failed to fetch due customers");
      setFilteredCustomers([]);
      setFilteredTotal(0);
    } finally {
      setPageLoading(false);
    }
  };

  // Handle city filter - customers who have a city (non-null/not empty)
  const handleCityFilter = async () => {
    setPageLoading(true);
    setActiveFilter("city");
    try {
      const { user } = useAuthStore.getState();
      if (user?.id) {
        const response = await customerAPI.getCustomersByCity(
          user.id,
          1,
          searchTerm,
          1,
        );
        let customersArray = [];
        let total = 0;

        // Handle nested response structure
        if (
          response?.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          customersArray = response.data.data.data;
          total = response.data.data.total || customersArray.length;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          customersArray = response.data.data;
          total = response.data.data.total || customersArray.length;
        } else if (Array.isArray(response?.data)) {
          customersArray = response.data;
          total = customersArray.length;
        } else if (response?.data && typeof response.data === "object") {
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              customersArray = response.data[key];
              total = customersArray.length;
              break;
            }
          }
        }

        if (!Array.isArray(customersArray)) {
          customersArray = [];
          total = 0;
        }

        setFilteredCustomers(customersArray);
        setFilteredTotal(total);
        toast.success(`Found ${total} customer(s) with city information`);
      }
    } catch (error) {
      console.error("Failed to fetch customers with city:", error);
      toast.error("Failed to fetch customers with city");
      setFilteredCustomers([]);
      setFilteredTotal(0);
    } finally {
      setPageLoading(false);
    }
  };

  // Clear all filters
  const handleClearFilter = () => {
    setActiveFilter("all");
    setSearchTerm("");
    setFilters({ search: "" });
    fetchCustomers(1, "");
    toast.success("All filters cleared");
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
    setPaymentError("");
  };

  const handlePaymentClick = (customer) => {
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
    setPaymentAmount("");
    setPaymentError("");
  };

  // Validate payment amount
  const validatePaymentAmount = (amount) => {
    if (!amount || amount === "") {
      return "Payment amount is required";
    }

    const numAmount = parseFloat(amount);
    const dueAmount = parseFloat(selectedCustomer?.due_amount || 0);

    if (isNaN(numAmount)) {
      return "Please enter a valid number";
    }

    if (numAmount <= 0) {
      return "Payment amount must be greater than zero";
    }

    if (numAmount > dueAmount) {
      return `Payment amount cannot exceed due amount of ₹${dueAmount.toFixed(2)}`;
    }

    return "";
  };

  // Handle payment amount change
  const handlePaymentAmountChange = (e) => {
    let value = e.target.value;

    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + "." + parts[1].substring(0, 2);
    }

    setPaymentAmount(value);

    // Validate on change
    const error = validatePaymentAmount(value);
    setPaymentError(error);
  };

  const handlePaymentSubmit = async () => {
    // Validate amount
    const error = validatePaymentAmount(paymentAmount);
    if (error) {
      setPaymentError(error);
      toast.error(error);
      return;
    }

    const amount = parseFloat(paymentAmount);
    const dueAmount = parseFloat(selectedCustomer?.due_amount || 0);

    // Double-check validation
    if (amount > dueAmount) {
      const errorMsg = `Payment amount cannot exceed due amount of ₹${dueAmount.toFixed(2)}`;
      setPaymentError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setFormSubmitting(true);
      await customerAPI.makeDuePayment(selectedCustomer.id, {
        due_payment: paymentAmount,
      });

      // Clear cache to force fresh data fetch
      const { clearCache } = useCustomerStore.getState();
      clearCache();

      // Fetch fresh data based on current filter
      if (activeFilter === "all") {
        await fetchCustomers(currentPage, filters.search);
      } else if (activeFilter === "due") {
        await handleDueFilter();
      } else if (activeFilter === "city") {
        await handleCityFilter();
      }

      // Show success message
      toast.success(
        `Payment of ₹${parseFloat(paymentAmount).toFixed(2)} processed successfully!`,
      );

      // Close modal and reset state
      setShowPaymentModal(false);
      setSelectedCustomer(null);
      setPaymentAmount("");
      setPaymentError("");
    } catch (error) {
      console.error("Failed to process payment:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to process payment. Please try again.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSubmitCustomer = async (customerData) => {
    setFormSubmitting(true);

    console.log("checking customer data ..........:", customerData);
    try {
      if (showEditForm && selectedCustomer) {
        await updateCustomer(selectedCustomer.id, customerData);
        toast.success("Customer updated successfully!");
      } else {
        await createCustomer(customerData);
        toast.success("Customer created successfully!");
      }
      // Refresh the customer list based on current filter
      if (activeFilter === "all") {
        await fetchCustomers();
      } else if (activeFilter === "due") {
        await handleDueFilter();
      } else if (activeFilter === "city") {
        await handleCityFilter();
      }
      // Hide the form
      handleCancelForm();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save customer. Please try again.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully!");
      setShowDeleteConfirm(false);
      setSelectedCustomer(null);
      if (activeFilter === "all") {
        fetchCustomers(currentPage);
      } else if (activeFilter === "due") {
        handleDueFilter();
      } else if (activeFilter === "city") {
        handleCityFilter();
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete customer. Please try again.",
      );
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedCustomers) {
        await deleteCustomer(id);
      }
      toast.success(
        `${selectedCustomers.length} customers deleted successfully!`,
      );
      setSelectedCustomers([]);
      setShowDeleteConfirm(false);
      if (activeFilter === "all") {
        fetchCustomers(currentPage);
      } else if (activeFilter === "due") {
        handleDueFilter();
      } else if (activeFilter === "city") {
        handleCityFilter();
      }
    } catch (error) {
      console.error("Failed to delete customers:", error);
      toast.error("Failed to delete customers. Please try again.");
    }
  };

  const handlePageChange = (page) => {
    setPageLoading(true);
    if (activeFilter === "all") {
      fetchCustomers(page).finally(() => {
        setPageLoading(false);
      });
    } else {
      setPageLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeFilter === "all") {
      await fetchCustomers();
    } else if (activeFilter === "due") {
      await handleDueFilter();
    } else if (activeFilter === "city") {
      await handleCityFilter();
    }
    setRefreshing(false);
    toast.success("Customer list refreshed!");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ search: "" });
    if (activeFilter !== "all") {
      handleClearFilter();
    }
    toast.success("Filters cleared!");
  };

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const selectAllCustomers = () => {
    const currentCustomers =
      activeFilter === "all" ? safeCustomers : filteredCustomers;
    if (selectedCustomers.length === currentCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentCustomers.map((c) => c?.id).filter(Boolean));
    }
  };

  // Get current display customers
  const displayCustomers =
    activeFilter === "all" ? safeCustomers : filteredCustomers;
  const displayTotal =
    activeFilter === "all" ? totalCustomers : filteredTotal;

  // Calculate stats
  const stats = {
    total: displayCustomers.length,
    totalSpent: displayCustomers.reduce(
      (sum, c) => sum + (parseFloat(c?.due_amount) || 0),
      0,
    ),
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
              {typeof value === "string" && value.startsWith("₹")
                ? value
                : `₹${value}`}
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
              selectedCustomers.length === displayCustomers.length &&
              displayCustomers.length > 0
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
          <FaRupeeSign className="w-3 h-3 mr-1 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {parseFloat(value || 0).toFixed(2)}
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
            {!showAddForm && !showEditForm && (
              <>
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

                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate("/customers/trashed")}
                  className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                  title="View trashed customers"
                >
                  <FiTrash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </motion.button>
              </>
            )}

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

        {showAddForm || showEditForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <CustomerForm
              isEditForm={showEditForm}
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {initialLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
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
                    title="Total Due Amount"
                    value={`${stats.totalSpent.toFixed(2)}`}
                    icon={FaRupeeSign}
                    color="from-indigo-500 to-purple-500"
                    subtitle={`Avg: ₹${(stats.totalSpent / (stats.total || 1)).toFixed(2)}/customer`}
                    delay={0.2}
                  />
                </>
              )}
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 100 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <Input
                  type="text"
                  placeholder="Search customers by name, email, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-3 text-base"
                />
              </div>
            </motion.div>

            {/* Quick Filter Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 items-center justify-between"
            >
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">
                  Quick Filters:
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveFilter("all");
                    fetchCustomers(1, searchTerm);
                  }}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                    activeFilter === "all"
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <FaUsers className="w-4 h-4" />
                  <span>All Customers</span>
                  {activeFilter === "all" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full"
                    >
                      {displayTotal}
                    </motion.span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDueFilter}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                    activeFilter === "due"
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <FaRupeeSign className="w-4 h-4" />
                  <span>Due Customers</span>
                  {activeFilter === "due" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full"
                    >
                      {displayTotal}
                    </motion.span>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCityFilter}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                    activeFilter === "city"
                      ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiMapPin className="w-4 h-4" />
                  <span>Has City</span>
                  {activeFilter === "city" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full"
                    >
                      {displayTotal}
                    </motion.span>
                  )}
                </motion.button>

                {(activeFilter !== "all" || searchTerm) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={clearFilters}
                    className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center space-x-1 text-sm"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Clear All Filters</span>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Active Filter Badge */}
            {activeFilter !== "all" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {activeFilter === "due" ? (
                        <FaRupeeSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      ) : (
                        <FiMapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activeFilter === "due"
                          ? "Due Customers Filter Active"
                          : "Customers With City Filter Active"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {activeFilter === "due"
                          ? `Showing ${displayTotal} customer(s) with pending due amount`
                          : `Showing ${displayTotal} customer(s) who have city information`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearFilter}
                    className="px-3 py-1.5 text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-1 transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                    <span>Remove Filter</span>
                  </button>
                </div>
              </motion.div>
            )}

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
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center space-x-3">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-medium text-primary-700 dark:text-primary-300"
                      >
                        {selectedCustomers.length} customer(s) selected
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
                          icon={FiTrash2}
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
              ) : displayCustomers.length === 0 ? (
                <EmptyState
                  icon={FaUsers}
                  title="No customers found"
                  description={
                    activeFilter !== "all"
                      ? activeFilter === "due"
                        ? "No customers with due amount found. Try adjusting your search or clear the filter."
                        : "No customers with city information found. Try adjusting your search or clear the filter."
                      : "Try adjusting your search or add your first customer."
                  }
                  action={
                    activeFilter === "all" ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={handleAddClick} icon={FiPlus}>
                          Add Customer
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={handleClearFilter} icon={FiX}>
                          Clear Filter
                        </Button>
                      </motion.div>
                    )
                  }
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <Table
                    columns={columns}
                    data={displayCustomers}
                    loading={loading}
                  />
                  {displayTotal > pageSize && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={displayTotal}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
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
            onClick={() => {
              setShowPaymentModal(false);
              setPaymentError("");
              setPaymentAmount("");
            }}
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
                  Customer:{" "}
                  <span className="font-semibold">{selectedCustomer.name}</span>
                  <br />
                  Current due amount:{" "}
                  <span className="font-semibold text-red-600">
                    ₹{parseFloat(selectedCustomer.due_amount || 0).toFixed(2)}
                  </span>
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="text-left">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={paymentAmount}
                        onChange={handlePaymentAmountChange}
                        placeholder="Enter amount"
                        className={`w-full pl-8 pr-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                          paymentError
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        disabled={formSubmitting}
                      />
                    </div>
                    {paymentError && (
                      <div className="flex items-center space-x-1 mt-1">
                        <FiAlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-red-500 text-sm">{paymentError}</p>
                      </div>
                    )}
                    {!paymentError &&
                      paymentAmount &&
                      parseFloat(paymentAmount) > 0 && (
                        <p className="text-xs text-green-500 mt-1">
                          ✓ Valid payment amount
                        </p>
                      )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Max allowed: ₹
                        {parseFloat(selectedCustomer.due_amount || 0).toFixed(
                          2,
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const maxAmount = parseFloat(
                            selectedCustomer.due_amount || 0,
                          );
                          setPaymentAmount(maxAmount.toString());
                          setPaymentError("");
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400"
                      >
                        Pay Full Amount
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPaymentModal(false);
                          setPaymentError("");
                          setPaymentAmount("");
                        }}
                        disabled={formSubmitting}
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
                        onClick={handlePaymentSubmit}
                        disabled={
                          !paymentAmount ||
                          parseFloat(paymentAmount) <= 0 ||
                          parseFloat(paymentAmount) >
                            parseFloat(selectedCustomer.due_amount || 0) ||
                          formSubmitting
                        }
                        loading={formSubmitting}
                        className="w-full"
                      >
                        {formSubmitting ? "Processing..." : "Pay Now"}
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