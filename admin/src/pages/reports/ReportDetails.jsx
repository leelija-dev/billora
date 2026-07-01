import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiUser,
  FiFileText,
  FiPrinter,
  FiClock,
  FiCreditCard,
  FiCheckCircle,
  FiTag,
  FiShoppingBag,
  FiShare2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
} from "react-icons/fi";
import { FaStore, FaWallet, FaFile } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { reportsAPI } from "../../services/reportsService";
import { productsAPI } from "../../services/productsService";
import Button from "../../components/common/Button/Button";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import {
  generateReportPDF,
  generateReportExcel,
  generateReportWord,
  handleReportPrint,
} from "../../utils/reportExportHandlers";

const ReportDetails = () => {
  const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;
  const { user, company } = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [productDetails, setProductDetails] = useState({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const exportDropdownRef = useRef(null);

  // Click outside handler for export dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target)
      ) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch product details by ID
  const fetchProductDetails = async (productId) => {
    if (!productId || productDetails[productId]) return;

    try {
      const response = await productsAPI.getById(productId);
      const productData = response.data?.data || response.data;
      setProductDetails((prev) => ({
        ...prev,
        [productId]: productData,
      }));
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      setProductDetails((prev) => ({
        ...prev,
        [productId]: { name: `Product #${productId}`, error: true },
      }));
    }
  };

  const decoded = atob(id);
  const originalId = decoded.replace(secretKey, "");

  // Fetch report details
  useEffect(() => {
    const fetchReportDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching report details for ID: ${id}`);

        const response = await reportsAPI.getSingleReport(originalId);
        console.log("Reports API Response:", response);

        const invoiceData = response.data?.data || response.data;

        if (!invoiceData || invoiceData.status === false) {
          throw new Error("Invoice not found");
        }

        const formattedReport = {
          id: invoiceData.id,
          invoice_number: invoiceData.invoice_number,
          created_at: invoiceData.created_at,
          total_amount: parseFloat(invoiceData.total_amount || 0),
          paid_amount: parseFloat(invoiceData.paid_amount || 0),
          total_items: parseInt(invoiceData.total_items || 0),
          status: invoiceData.status || "completed",
          user_id: invoiceData.user_id,
          created_by: invoiceData.created_by,

          customer_id: invoiceData.customer_id,
          customer_name:
            invoiceData.customer?.name ||
            `Customer #${invoiceData.customer_id}`,
          customer: {
            id: invoiceData.customer?.id,
            name: invoiceData.customer?.name,
            email: invoiceData.customer?.email,
            phone: invoiceData.customer?.phone,
            address: invoiceData.customer?.address,
            city: invoiceData.customer?.city,
            due_amount: invoiceData.customer?.due_amount,
            gst_number: invoiceData.customer?.gst_number,
          },

          store_id: invoiceData.store_id,
          store_name:
            invoiceData.store?.name || `Store #${invoiceData.store_id}`,
          store: {
            id: invoiceData.store?.id,
            name: invoiceData.store?.name,
            mobile: invoiceData.store?.mobile,
            email: invoiceData.store?.email,
            gst: invoiceData.store?.gst,
            address: invoiceData.store?.address,
            city: invoiceData.store?.city,
            status: invoiceData.store?.status,
          },

          invoice_items:
            invoiceData.invoice_items?.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              quantity: parseFloat(item.quantity || 0),
              price: parseFloat(item.price || 0),
              gst: parseFloat(item.gst || 0),
              discount: parseFloat(item.discount || 0),
              total_price: parseFloat(item.total_price || 0),
              unit_id: item.unit_id,
              status: item.status,
              stock_id: item.stock_id,
              item_count: item.item_count,
              product_name: item.product_name,
            })) || [],

          package_name: invoiceData.package_name,
          package_price: invoiceData.package_price,
          package_size: invoiceData.package_size,
        };

        setReport(formattedReport);

        if (
          formattedReport.invoice_items &&
          formattedReport.invoice_items.length > 0
        ) {
          const uniqueProductIds = [
            ...new Set(
              formattedReport.invoice_items
                .map((item) => item.product_id)
                .filter(Boolean)
            ),
          ];
          uniqueProductIds.forEach((productId) => {
            fetchProductDetails(productId);
          });
        }
      } catch (error) {
        console.error("Failed to fetch report details:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch report details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReportDetails();
    } else {
      setError("No report ID provided");
      setLoading(false);
    }
  }, [id]);

  // Export Handlers
  const handlePDFExport = () => {
    if (!report) return;
    setExporting(true);
    setShowExportDropdown(false);

    const reportData = {
      report,
      company: company || { name: user?.company?.name || "Business Name" },
      formatCurrency,
      formatDate,
      getProductName,
      productDetails,
    };

    generateReportPDF(reportData);
    setTimeout(() => setExporting(false), 1000);
  };

  const handleExcelExport = () => {
    if (!report) return;
    setExporting(true);
    setShowExportDropdown(false);

    const reportData = {
      report,
      company: company || { name: user?.company?.name || "Business Name" },
      formatCurrency,
      formatDate,
      getProductName,
      productDetails,
    };

    generateReportExcel(reportData);
    setTimeout(() => setExporting(false), 1000);
  };

  const handleWordExport = () => {
    if (!report) return;
    setExporting(true);
    setShowExportDropdown(false);

    const reportData = {
      report,
      company: company || { name: user?.company?.name || "Business Name" },
      formatCurrency,
      formatDate,
      getProductName,
      productDetails,
    };

    generateReportWord(reportData);
    setTimeout(() => setExporting(false), 1000);
  };

  const handlePrintInvoice = () => {
    if (!report) return;

    const reportData = {
      report,
      company: company || { name: user?.company?.name || "Business Name" },
      formatCurrency,
      formatDate,
      getProductName,
      productDetails,
    };

    handleReportPrint(reportData, { setIsPrinting });
  };

  // Share invoice
  const handleShare = () => {
    if (!report) return;

    const shareData = {
      title: `Invoice #${report.invoice_number}`,
      text: `Invoice from ${report.store_name} to ${report.customer_name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleBack = () => {
    navigate("/reports");
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getProductName = (productId, fallbackName) => {
    if (productDetails[productId]?.name) {
      return productDetails[productId].name;
    }
    if (fallbackName) {
      return fallbackName;
    }
    return `Product #${productId}`;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
      >
        <div className="mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-primary-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiFileText className="w-6 h-6 text-primary-600 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
                Loading report details...
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !report) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
      >
        <div className="mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <FiFileText className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Report Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                {error ||
                  "The report you are looking for does not exist or has been removed."}
              </p>
              <Button onClick={handleBack} className="px-8 py-3 rounded-xl">
                Back to Reports
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const dueAmount = report.total_amount - report.paid_amount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6"
    >
      <div className="mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl relative"
        >
          <div className="absolute w-full h-full overflow-hidden rounded-3xl">
            <div className="relative h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          </div>
          <div className="p-6 relative">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Invoice Details
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiFileText className="w-4 h-4 text-gray-500" />
                    <p className="text-gray-600 dark:text-gray-400 font-mono">
                      Invoice #{report.invoice_number}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Export Dropdown */}
                <div className="relative" ref={exportDropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    disabled={exporting}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiDownload
                      className={`w-4 h-4 ${exporting ? "animate-pulse" : ""}`}
                    />
                    <span>{exporting ? "Exporting..." : "Export"}</span>
                  </motion.button>

                  <AnimatePresence>
                    {showExportDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                      >
                        <button
                          onClick={handlePDFExport}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                        >
                          <FaFile className="w-4 h-4 text-red-500" />
                          <div className="flex-1">
                            <span>Export as PDF</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Professional invoice format
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={handleExcelExport}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-100 dark:border-gray-700"
                        >
                          <FiFileText className="w-4 h-4 text-green-500" />
                          <div className="flex-1">
                            <span>Export as Excel</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Spreadsheet with multiple sheets
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={handleWordExport}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors border-t border-gray-100 dark:border-gray-700"
                        >
                          <FiFileText className="w-4 h-4 text-blue-500" />
                          <div className="flex-1">
                            <span>Export as DOC</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Editable document format
                            </p>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Share Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-gray-500/25"
                >
                  <FiShare2 className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>

                {/* Print Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrintInvoice}
                  disabled={isPrinting}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPrinter className="w-4 h-4" />
                  <span>{isPrinting ? "Printing..." : "Print"}</span>
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mt-6 border-b border-gray-200 dark:border-gray-700">
              {[
                { id: "details", label: "Invoice Details", icon: FiFileText },
                { id: "items", label: "Items", icon: FiPackage },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-t-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-b-2 border-primary-500"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Status Banner */}
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`rounded-2xl p-4 ${
                  report.status === "completed"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        report.status === "completed"
                          ? "bg-green-100 dark:bg-green-900/40"
                          : "bg-yellow-100 dark:bg-yellow-900/40"
                      }`}
                    >
                      {report.status === "completed" ? (
                        <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Payment Status
                      </p>
                      <StatusBadge
                        status={report.status || "completed"}
                        variant={
                          report.status === "completed"
                            ? "success"
                            : report.status === "pending"
                            ? "warning"
                            : "default"
                        }
                        size="md"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Invoice Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(report.created_at)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Invoice Information */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Invoice Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <FiFileText className="w-4 h-4 mr-2" />
                      Invoice Number
                    </div>
                    <p className="font-mono font-semibold text-gray-900 dark:text-white text-lg">
                      #{report.invoice_number}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      Date & Time
                    </div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(report.created_at)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <FiPackage className="w-4 h-4 mr-2" />
                      Total Items
                    </div>
                    <p className="text-gray-900 dark:text-white font-semibold text-lg">
                      {report.total_items}
                    </p>
                  </div>

                  {/* <div className="space-y-2">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <FiUser className="w-4 h-4 mr-2" />
                      Created By
                    </div>
                    <p className="text-gray-900 dark:text-white font-mono">
                      User #{report.created_by || report.user_id}
                    </p>
                  </div> */}
                </div>
              </motion.div>

              {/* Customer and Store Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Customer Information
                      </h2>
                    </div>
                    {report.customer?.due_amount &&
                      parseFloat(report.customer.due_amount) > 0 && (
                        <div className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Due: {formatCurrency(report.customer.due_amount)}
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">
                          {report.customer_name?.charAt(0).toUpperCase() || "C"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {report.customer_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          City: {report.customer?.city || "N/A"}
                        </p>
                      </div>
                    </div>

                    {report.customer?.email && (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                          <FiMail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email Address
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {report.customer.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.customer?.phone && (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                          <FiPhone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Phone Number
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {report.customer.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {(report.customer?.address || report.customer?.city) && (
                      <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                          <FiMapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Address
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {report.customer.address}
                            {report.customer.city && `, ${report.customer.city}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.customer?.gst_number && (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
                          <FiTag className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            GST Number
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {report.customer.gst_number}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FaStore className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Store Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                        <FaStore className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {report.store_name}
                        </p>
                        {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                          Store ID: #{report.store_id}
                        </p> */}
                      </div>
                    </div>

                    {report.store?.mobile && (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                          <FiPhone className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Contact Number
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {report.store.mobile}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.store?.email && (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                          <FiMail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {report.store.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.store?.gst && (
                      <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
                          <FiTag className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            GST Number
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-mono">
                            {report.store.gst || "Not registered"}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.store?.address && (
                      <div className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                          <FiMapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Address
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {report.store.address || "Address not provided"}
                            {report.store.city && `, ${report.store.city}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Financial Summary */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Financial Summary
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800 rounded-xl p-5 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Amount
                      </p>
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FiDollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(report.total_amount)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-5 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Paid Amount
                      </p>
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <FiCreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(report.paid_amount)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl p-5 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-orange-700 dark:text-orange-400">
                        Due Amount
                      </p>
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <FaWallet className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(dueAmount)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-5 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-purple-700 dark:text-purple-400">
                        Total Items
                      </p>
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {report.total_items}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === "items" && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Invoice Items
                  </h2>
                </div>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Items:{" "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {report.invoice_items?.length || 0}
                    </span>
                  </p>
                </div>
              </div>

              {report.invoice_items && report.invoice_items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          GST
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {report.invoice_items.map((item, idx) => (
                        <motion.tr
                          key={item.id || idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            {/* <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                              #{item.product_id}
                            </span> */}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                                <FiShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {getProductName(
                                  item.product_id,
                                  item.product_name
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {item.quantity} {item.unit_id ? "units" : "pcs"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                              {item.gst}%
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                              {item.discount}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.total_price)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-200 dark:border-gray-700">
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td
                          colSpan="7"
                          className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white"
                        >
                          Total
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                          {formatCurrency(report.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPackage className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No items found in this invoice
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReportDetails;