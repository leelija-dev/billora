import React, { useEffect, useState, useRef } from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiDownload,
  FiPrinter,
  FiFileText,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
  FiSlash,
  FiCreditCard,
  FiUser,
  FiHome,
  FiMail,
  FiPhone,
  FiPackage,
  FiGrid,
  FiPercent,
  FiTag,
  FiTrash2,
  FiEye,
  FiShare2,
  FiCopy,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiArchive,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInvoiceStore } from "../../store/invoiceStore";
import { usePermissionStore } from "../../store/permissionStore";
import toast from "react-hot-toast";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Select from "../../components/common/Select/Select";
import LoadingSpinner from "../../components/common/Spinner/Spinner";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import InvoiceEditForm from "../../components/features/Invoices/InvoiceEditForm";
import {
  printA4Invoice,
  printThermalInvoice,
  downloadInvoicePDF,
} from "../../templates/PrintUtils";
import { invoiceAPI } from "../../services/invoiceService";
import { customerAPI } from "../../services/customerService";
import { storeAPI } from "../../services/storeService";
import { productsAPI } from "../../services/productsService";
import { FaBuilding } from "react-icons/fa";

const DUE_PAYMENT_METHOD_OPTIONS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Cheque", label: "Cheque" },
];

const InvoiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { cancelInvoice } = useInvoiceStore();
  const { canAccess } = usePermissionStore();
  const hasStockPermission = canAccess("stock-management");

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchVersion, setRefetchVersion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [duePayAmount, setDuePayAmount] = useState("");
  const [duePayMethod, setDuePayMethod] = useState("Cash");
  const [duePaySubmitting, setDuePaySubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [storeNotFound, setStoreNotFound] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Refs for cleanup and preventing duplicate requests
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const lastFetchIdRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Don't fetch if already fetching
    if (isFetchingRef.current) {
      console.log("⏭️ Skipping fetch - already fetching");
      return;
    }

    const fetchInvoice = async () => {
      // Cancel previous request if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      isFetchingRef.current = true;

      const fetchId = Date.now();
      lastFetchIdRef.current = fetchId;

      try {
        if (!isMountedRef.current) return;

        setLoading(true);
        setError(null);
        setStoreNotFound(false);

        console.log("🔍 Fetching invoice for ID:", id);

        const response = await invoiceAPI.getById(id, {
          signal: abortControllerRef.current.signal,
        });

        // Check if this is still the latest request
        if (lastFetchIdRef.current !== fetchId) {
          console.log("⏭️ Skipping stale response");
          return;
        }

        if (!isMountedRef.current) return;

        console.log("📋 Invoice response:", response);

        if (response.data?.status && response.data?.data) {
          const foundInvoice = response.data.data;
          const billSummary = response.data.bill_summary || {};

          // Check if store data is already in the invoice response
          let storeData = {};
          let customerData = {};
          let isStoreDeleted = false;

          // FIRST, check if store data is already embedded in the invoice response
          if (
            foundInvoice.store &&
            typeof foundInvoice.store === "object" &&
            Object.keys(foundInvoice.store).length > 0
          ) {
            console.log(
              "✅ Using store data from invoice response:",
              foundInvoice.store,
            );
            storeData = foundInvoice.store;
            isStoreDeleted = false;
          } else {
            // Only fetch store separately if not embedded
            console.log(
              "🔍 Store not in invoice response, attempting to fetch with ID:",
              foundInvoice.store_id,
            );
            try {
              // Try multiple store API methods
              let storeResponse = null;

              if (storeAPI.getStoreById) {
                storeResponse = await storeAPI.getStoreById(
                  foundInvoice.store_id,
                );
              } else if (storeAPI.getById) {
                storeResponse = await storeAPI.getById(foundInvoice.store_id);
              } else if (storeAPI.edit) {
                storeResponse = await storeAPI.edit(foundInvoice.store_id);
              } else if (storeAPI.getStore) {
                storeResponse = await storeAPI.getStore(foundInvoice.store_id);
              } else {
                console.warn("No suitable store API method found");
              }

              if (storeResponse) {
                if (
                  storeResponse.data?.status === true &&
                  storeResponse.data?.data
                ) {
                  storeData = storeResponse.data.data;
                } else if (
                  storeResponse.data?.data &&
                  typeof storeResponse.data.data === "object"
                ) {
                  storeData = storeResponse.data.data;
                } else if (
                  storeResponse.data &&
                  typeof storeResponse.data === "object" &&
                  storeResponse.data.id
                ) {
                  storeData = storeResponse.data;
                }
              }

              // Check if store data is empty or indicates not found
              if (
                !storeData ||
                Object.keys(storeData).length === 0 ||
                storeData.error ||
                storeData.message === "Store not found"
              ) {
                isStoreDeleted = true;
                setStoreNotFound(true);
                console.warn(
                  "Store not found or deleted for ID:",
                  foundInvoice.store_id,
                );
              }
            } catch (storeError) {
              console.error("Failed to fetch store:", storeError);
              isStoreDeleted = true;
              setStoreNotFound(true);
            }
          }

          // Check if customer data is already embedded
          if (
            foundInvoice.customer &&
            typeof foundInvoice.customer === "object" &&
            Object.keys(foundInvoice.customer).length > 0
          ) {
            console.log(
              "✅ Using customer data from invoice response:",
              foundInvoice.customer,
            );
            customerData = foundInvoice.customer;
          } else {
            // Only fetch customer separately if not embedded
            console.log(
              "👤 Customer not in invoice response, fetching with ID:",
              foundInvoice.customer_id,
            );
            try {
              // Fetch customer data
              const customerResponse = await customerAPI.getById(
                foundInvoice.customer_id,
              );
              if (
                customerResponse.data?.status === true &&
                customerResponse.data?.data
              ) {
                customerData = customerResponse.data.data;
              } else if (
                customerResponse.data?.data &&
                typeof customerResponse.data.data === "object"
              ) {
                customerData = customerResponse.data.data;
              } else if (
                customerResponse.data &&
                typeof customerResponse.data === "object" &&
                customerResponse.data.id
              ) {
                customerData = customerResponse.data;
              }
            } catch (customerError) {
              console.error("Failed to fetch customer:", customerError);
            }
          }

          // Check if this is still the latest request
          if (lastFetchIdRef.current !== fetchId) {
            console.log("⏭️ Skipping stale store/customer response");
            return;
          }

          if (!isMountedRef.current) return;

          console.log("🏪 Store data:", storeData);
          console.log("👤 Customer data:", customerData);

          // Prepare store data - mark as deleted if not found
          let finalStoreData = {};
          if (
            isStoreDeleted ||
            !storeData ||
            Object.keys(storeData).length === 0
          ) {
            finalStoreData = {
              id: foundInvoice.store_id,
              name: "Store Deleted/Not Found",
              address: "N/A",
              gst: "N/A",
              email: "N/A",
              mobile: "N/A",
              is_deleted: true,
            };
          } else {
            finalStoreData = {
              id: storeData.id || foundInvoice.store_id,
              name:
                storeData.name ||
                storeData.store_name ||
                foundInvoice.store_name ||
                "Unknown Store",
              address: storeData.address
                ? typeof storeData.address === "string"
                  ? storeData.address
                  : `${storeData.address}, ${storeData.city || ""}`
                : foundInvoice.store_address || "N/A",
              gst:
                storeData.gst ||
                storeData.gst_number ||
                foundInvoice.store_gst ||
                "N/A",
              email:
                storeData.email ||
                storeData.store_email ||
                foundInvoice.store_email ||
                "N/A",
              mobile:
                storeData.mobile ||
                storeData.phone ||
                storeData.store_phone ||
                foundInvoice.store_phone ||
                "N/A",
              is_deleted: false,
            };
          }

          // Prepare customer data
          const finalCustomerData = {
            id: customerData.id || foundInvoice.customer_id,
            name:
              customerData.name ||
              customerData.customer_name ||
              foundInvoice.customer_name ||
              "Walk-in Customer",
            phone:
              customerData.phone ||
              customerData.mobile ||
              foundInvoice.customer_phone ||
              "N/A",
            email: customerData.email || foundInvoice.customer_email || "N/A",
            address: customerData.address
              ? typeof customerData.address === "string"
                ? customerData.address
                : `${customerData.address}, ${customerData.city || ""}`
              : foundInvoice.customer_address || "N/A",
            gst: customerData.gst || foundInvoice.customer_gst || "N/A",
          };

          const invoiceItems =
            foundInvoice.invoice_items || foundInvoice.items || [];
          const packagesData = foundInvoice.packages;
          const invoicePackages = Array.isArray(packagesData)
            ? packagesData
            : packagesData
              ? [packagesData]
              : [];

          const allItems = [
            ...invoiceItems,
            ...invoicePackages.map((pkg) => ({
              ...pkg,
              is_package: true,
            })),
          ];

          let enhancedInvoice = null;

          if (allItems.length > 0) {
            // Fetch products in parallel with Promise.all for better performance
            const productPromises = allItems.map((item) => {
              if (item.is_package) {
                return Promise.resolve({
                  ...item,
                  product_name:
                    item.package_name ||
                    item.product_name ||
                    `Package #${item.package_id || item.id || "Unknown"}`,
                  price: parseFloat(item.package_price || 0),
                  quantity: parseFloat(item.quantity || 1),
                  total_price: parseFloat(
                    item.package_total || item.total_price || 0,
                  ),
                  gst: 0,
                  discount: 0,
                });
              } else {
                return productsAPI
                  .getById(item.product_id)
                  .then((productResponse) => {
                    let productData = {};
                    if (
                      productResponse.data?.status === true &&
                      productResponse.data?.data
                    ) {
                      productData = productResponse.data.data;
                    } else if (
                      productResponse.data?.data &&
                      typeof productResponse.data.data === "object"
                    ) {
                      productData = productResponse.data.data;
                    } else if (
                      productResponse.data &&
                      typeof productResponse.data === "object"
                    ) {
                      productData = productResponse.data;
                    }

               

                    return {
                      ...item,
                      product_name:
                        productData.name ||
                        item.product_name ||
                        item.name ||
                        `Product #${item.product_id || item.id || "Unknown"}`,
                      attributes: productData.attributes || [],
                      variants: productData.variants || [],
                      product_image: productData.image || null,

                      price: parseFloat(
                        item.price || productData.selling_price || 0,
                      ),
                      quantity: parseFloat(
                        item.quantity || item.item_count || 1,
                      ),
                      total_price: parseFloat(
                        item.total_price || item.total || 0,
                      ),
                      gst: parseFloat(
                        item.gst || productData.gst_percentage || 0,
                      ),
                      discount: parseFloat(
                        item.discount || productData.discount_percentage || 0,
                      ),
                    };
                  })
                  .catch((error) => {
                    console.error(
                      `Failed to fetch product ${item.product_id}:`,
                      error,
                    );
                    return {
                      ...item,
                      product_name:
                        item.product_name ||
                        item.name ||
                        `Product #${item.product_id || item.id || "Unknown"}`,
                      price: parseFloat(item.price || 0),
                      quantity: parseFloat(
                        item.quantity || item.item_count || 1,
                      ),
                      total_price: parseFloat(
                        item.total_price || item.total || 0,
                      ),
                      gst: parseFloat(item.gst || 0),
                      discount: parseFloat(item.discount || 0),
                      attributes: [],
                      variants: [],
                    };
                  });
              }
            });

            const enhancedItems = await Promise.all(productPromises);

            // Check if this is still the latest request
            if (lastFetchIdRef.current !== fetchId) {
              console.log("⏭️ Skipping stale product response");
              return;
            }

            if (!isMountedRef.current) return;

            const displayItems = enhancedItems.filter(
              (item) => !item.is_package,
            );
            const displayPackages = enhancedItems.filter(
              (item) => item.is_package,
            );

            enhancedInvoice = {
              ...foundInvoice,
              invoice_number:
                foundInvoice.invoice_number || `INV-${foundInvoice.id}`,
              customer_name: finalCustomerData.name,
              customer_phone: finalCustomerData.phone,
              customer_email: finalCustomerData.email,
              customer_address: finalCustomerData.address,
              customer_gst: finalCustomerData.gst,
              store_name: finalStoreData.name,
              store_address: finalStoreData.address,
              store_gst: finalStoreData.gst,
              store_email: finalStoreData.email,
              store_phone: finalStoreData.mobile,
              store_is_deleted: finalStoreData.is_deleted || false,
              items: displayItems,
              packages: displayPackages,
              bill_summary: {
                subtotal: parseFloat(
                  billSummary.subtotal +
                    (billSummary.packages?.total_package_price || 0),
                ),
                total_discount: parseFloat(billSummary.total_discount || 0),
                total_gst: parseFloat(billSummary.total_gst || 0),
                grand_total: parseFloat(
                  billSummary.grand_total || foundInvoice.total_amount || 0,
                ),
              },
            };
          } else {
            enhancedInvoice = {
              ...foundInvoice,
              invoice_number:
                foundInvoice.invoice_number || `INV-${foundInvoice.id}`,
              customer_name: finalCustomerData.name,
              customer_phone: finalCustomerData.phone,
              customer_email: finalCustomerData.email,
              customer_address: finalCustomerData.address,
              customer_gst: finalCustomerData.gst,
              store_name: finalStoreData.name,
              store_address: finalStoreData.address,
              store_gst: finalStoreData.gst,
              store_email: finalStoreData.email,
              store_phone: finalStoreData.mobile,
              store_is_deleted: finalStoreData.is_deleted || false,
              items: [],
              packages: [],
              bill_summary: {
                subtotal: parseFloat(
                  billSummary.subtotal +
                    (billSummary.packages?.total_package_price || 0),
                ),
                total_discount: parseFloat(billSummary.total_discount || 0),
                total_gst: parseFloat(billSummary.total_gst || 0),
                grand_total: parseFloat(
                  billSummary.grand_total || foundInvoice.total_amount || 0,
                ),
              },
            };
          }

          // Single setState call at the end
          if (isMountedRef.current && lastFetchIdRef.current === fetchId) {
            console.log(
              "✅ Setting invoice with store:",
              enhancedInvoice.store_name,
              "Store deleted:",
              enhancedInvoice.store_is_deleted,
            );

            setInvoice(enhancedInvoice);
            setLoading(false);
          }
        } else {
          if (isMountedRef.current && lastFetchIdRef.current === fetchId) {
            setError(`Invoice #${id} not found`);
            setLoading(false);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was cancelled");
          return;
        }
        console.error("Failed to fetch invoice:", error);
        if (isMountedRef.current && lastFetchIdRef.current === fetchId) {
          setError(`Failed to load invoice #${id}`);
          setLoading(false);
        }
      } finally {
        if (lastFetchIdRef.current === fetchId) {
          isFetchingRef.current = false;
        }
      }
    };

    if (id) {
      fetchInvoice();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id, refetchVersion]);

  useEffect(() => {
    if (invoice && location.state?.openEdit && invoice.status !== "cancelled") {
      setIsEditing(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [invoice, location.state, location.pathname, navigate]);

  const getStatusConfig = (status) => {
    const configs = {
      paid: { variant: "success", icon: FiCheckCircle, label: "Paid" },
      unpaid: { variant: "warning", icon: FiClock, label: "Unpaid" },
      overdue: { variant: "danger", icon: FiAlertCircle, label: "Overdue" },
      completed: {
        variant: "success",
        icon: FiCheckCircle,
        label: "Completed",
      },
      cancelled: { variant: "default", icon: FiFileText, label: "Cancelled" },
    };
    return configs[status] || configs.unpaid;
  };

  const handleCancelInvoice = async () => {
    if (!invoice?.id) return;
    const ok = window.confirm(
      "Cancel this invoice? Stock will be restored if you have stock permission, customer due and GST records will be adjusted, and the invoice will be marked cancelled.",
    );
    if (!ok) return;
    setCancelSubmitting(true);
    try {
      const res = await cancelInvoice(invoice.id);
      if (res?.success) {
        setIsEditing(false);
        setRefetchVersion((v) => v + 1);
        toast.success("Invoice cancelled successfully");
      }
    } catch (error) {
      console.error("Failed to cancel invoice:", error);
      toast.error("Failed to cancel invoice");
    } finally {
      setCancelSubmitting(false);
    }
  };

  // Payment amount validation function
  const validatePaymentAmount = (amount, dueBalance) => {
    if (!amount || amount === "") {
      return "Please enter an amount";
    }

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount)) {
      return "Please enter a valid number";
    }

    if (numAmount <= 0) {
      return "Amount must be greater than 0";
    }

    if (numAmount > dueBalance) {
      return `Amount cannot exceed due amount of ${formatCurrency(dueBalance)}`;
    }

    return null;
  };

  // Handle payment amount change with validation
  const handlePaymentAmountChange = (e) => {
    let value = e.target.value;

    // Remove any non-digit characters except decimal point
    value = value.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }

    // Limit decimal places to 2
    if (value.includes(".") && value.split(".")[1]?.length > 2) {
      return;
    }

    setDuePayAmount(value);
    setPaymentError("");

    // Real-time validation
    if (value && value !== ".") {
      const total = parseFloat(
        invoice.bill_summary?.grand_total || invoice.total_amount || 0,
      );
      const paid = parseFloat(invoice.paid_amount || 0);
      const due = Math.max(0, total - paid);
      const error = validatePaymentAmount(value, due);
      if (error) {
        setPaymentError(error);
      }
    }
  };

  const handleDuePay = async (e) => {
    e.preventDefault();

    if (!invoice?.id || invoice.status === "cancelled") return;

    const total = parseFloat(
      invoice.bill_summary?.grand_total || invoice.total_amount || 0,
    );
    const paid = parseFloat(invoice.paid_amount || 0);
    const due = Math.max(0, total - paid);

    // Validate amount before submission
    const validationError = validatePaymentAmount(duePayAmount, due);
    if (validationError) {
      setPaymentError(validationError);
      toast.error(validationError);
      return;
    }

    const amount = parseFloat(duePayAmount);

    setDuePaySubmitting(true);
    try {
      const res = await invoiceAPI.invoiceDuePay(invoice.id, {
        paid_amount: amount,
        payment_method: duePayMethod,
      });
      if (res.data?.status === true) {
        toast.success(res.data?.message || "Payment recorded successfully");
        setDuePayAmount("");
        setDuePayMethod("Cash");
        setPaymentError("");
        setShowPaymentModal(false);
        try {
          const ch = new BroadcastChannel("app-cache-invalidation");
          ch.postMessage({
            type: "invoice-updated",
            data: { customer_id: invoice.customer_id, timestamp: Date.now() },
          });
          ch.close();
        } catch {
          /* ignore */
        }
        setRefetchVersion((v) => v + 1);
      } else {
        toast.error(res.data?.message || "Payment failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setDuePaySubmitting(false);
    }
  };

  const handlePrint = () => {
    console.log("checking invoice ..........",invoice);
    printA4Invoice(invoice);
  };

  const handlePrintThermal = () => {
    printThermalInvoice(invoice);
  };

  const handleDownloadPDF = () => {
    downloadInvoicePDF(invoice, "a4");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading invoice details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiFileText className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">
            Error Loading Invoice
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
          <Button
            onClick={() => navigate("/invoices")}
            variant="outline"
            className="gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiFileText className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The requested invoice could not be found.
          </p>
          <Button
            onClick={() => navigate("/invoices")}
            variant="outline"
            className="gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Invoices
          </Button>
        </motion.div>
      </div>
    );
  }

  // console.log("inner chekcing ............,", invoice);
  // Use bill summary values for calculations
  const totalAmountNum =
    invoice.bill_summary?.grand_total || parseFloat(invoice.total_amount || 0);
  const subtotalNum = invoice.bill_summary?.subtotal || totalAmountNum;
  const totalGstNum = invoice.bill_summary?.total_gst || 0;
  const totalDiscountNum = invoice.bill_summary?.total_discount || 0;
  const paidAmountNum = parseFloat(invoice.paid_amount || 0);
  const dueBalance = totalAmountNum - paidAmountNum;

  const showDuePayment = invoice.status !== "cancelled" && dueBalance > 0.001;
  const isEditMode = isEditing && invoice.status !== "cancelled";
  const statusConfig = getStatusConfig(invoice.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {isEditMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                  Edit Invoice
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Invoice #{invoice.invoice_number || invoice.id}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="w-fit gap-2"
                icon={FiArrowLeft}
              >
                Back to Invoice
              </Button>
            </div>
            <InvoiceEditForm
              invoice={invoice}
              hasStockPermission={hasStockPermission}
              variant="page"
              onCancel={() => setIsEditing(false)}
              onSaved={() => {
                setIsEditing(false);
                setRefetchVersion((v) => v + 1);
              }}
            />
          </motion.div>
        ) : (
          <>
            {/* Header Section - Modern Compact */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Navigation & Title */}
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => navigate("/invoices")}
                      variant="ghost"
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                    >
                      <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    </Button>

                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <FiFileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                          Invoice #{invoice.invoice_number || invoice.id}
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <FiCalendar className="w-3 h-3" />
                          <span>{formatDate(invoice.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge
                      status={invoice.status || "unpaid"}
                      className="text-xs"
                      icon={statusConfig.icon}
                    />
                  </div>

                  {/* Action Buttons Group */}
                  <div className="flex flex-wrap gap-2">
                    {invoice.status !== "cancelled" && (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                          size="sm"
                          className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-500/20 transition-all duration-300"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                          Edit
                        </Button>

                        <Button
                          onClick={handleCancelInvoice}
                          size="sm"
                          disabled={cancelSubmitting}
                          className="gap-1.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md shadow-red-500/20 transition-all duration-300"
                        >
                          <FiSlash className="w-3.5 h-3.5" />
                          {cancelSubmitting ? "..." : "Cancel"}
                        </Button>
                      </>
                    )}

                    <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

                    <Button
                      onClick={handlePrintThermal}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                      icon={FiPrinter}
                    >
                      Thermal
                    </Button>

                    <Button
                      onClick={handlePrint}
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      icon={FiPrinter}
                    >
                      A4
                    </Button>

                    <Button
                      onClick={handleDownloadPDF}
                      size="sm"
                      className="gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-500/20"
                      icon={FiDownload}
                    >
                      PDF
                    </Button>
                  </div>
                </div>

                {/* Payment Status Bar */}
                {invoice.status !== "cancelled" && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Payment Status:
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            dueBalance > 0
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {dueBalance > 0 ? (
                            <>Due: {formatCurrency(dueBalance)}</>
                          ) : (
                            <>✓ Fully Paid</>
                          )}
                        </span>
                      </div>

                      {dueBalance > 0 && (
                        <Button
                          onClick={() => setShowPaymentModal(true)}
                          size="sm"
                          className="gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md shadow-green-500/20"
                          icon={FiCreditCard}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>

                    {/* Payment Progress Bar */}
                    {dueBalance > 0 && totalAmountNum > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Paid: {formatCurrency(paidAmountNum)}</span>
                          <span>Due: {formatCurrency(dueBalance)}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(paidAmountNum / totalAmountNum) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Store Information Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className={`p-2.5 rounded-xl shadow-lg ${
                          invoice.store_is_deleted
                            ? "bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25"
                            : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25"
                        }`}
                      >
                        <FaBuilding className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Store Information
                      </h3>
                      {invoice.store_is_deleted && (
                        <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <FiAlertTriangle className="w-3 h-3" />
                          Deleted
                        </span>
                      )}
                    </div>

                    {invoice.store_is_deleted ? (
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3">
                          <FiAlertTriangle className="w-8 h-8 text-red-500" />
                          <div>
                            <p className="font-semibold text-red-700 dark:text-red-400">
                              Store Not Found or Deleted
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                              The store associated with this invoice (ID:{" "}
                              {invoice.store_is_deleted
                                ? invoice.store_name?.split(" ")[0] === "Store"
                                  ? invoice.id
                                  : invoice.store_id
                                : invoice.store_id}
                              ) appears to have been deleted or is no longer
                              accessible.
                            </p>
                            {invoice.store_name &&
                              invoice.store_name !==
                                "Store Deleted/Not Found" && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  Last known name: {invoice.store_name}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Store Name
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {invoice.store_name}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            GST Number
                          </p>
                          <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                            {invoice.store_gst || "N/A"}
                          </p>
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Address
                          </p>
                          <div className="flex items-start gap-2">
                            <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 dark:text-gray-300">
                              {invoice.store_address}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Email
                          </p>
                          <div className="flex items-center gap-2">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {invoice.store_email}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Phone
                          </p>
                          <div className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4 text-gray-400" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {invoice.store_phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
                {/* Customer Information Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Customer Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Customer Name
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {invoice.customer_name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Phone
                        </p>
                        <div className="flex items-center gap-2">
                          <FiPhone className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {invoice.customer_phone}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Email
                        </p>
                        <div className="flex items-center gap-2">
                          <FiMail className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {invoice.customer_email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          GST Number
                        </p>
                        <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {invoice.customer_gst || "N/A"}
                        </p>
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Address
                        </p>
                        <div className="flex items-start gap-2">
                          <FiHome className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            {invoice.customer_address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {/* Items Table Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/25">
                        <FiGrid className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Invoice Items
                      </h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Item Details
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Qty
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            GST
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Discount
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {invoice.items && invoice.items.length > 0 && (
                          <>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                              <td colSpan="7" className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <FiPackage className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Products
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {invoice.items.map((item, index) => {
                              const itemPrice =
                                typeof item.price === "string"
                                  ? parseFloat(item.price)
                                  : typeof item.price === "number"
                                    ? item.price
                                    : 0;
                              const itemTotal =
                                typeof item.total_price === "string"
                                  ? parseFloat(item.total_price)
                                  : typeof item.total_price === "number"
                                    ? item.total_price
                                    : 0;
                              const itemGst =
                                typeof item.gst === "string"
                                  ? parseFloat(item.gst)
                                  : typeof item.gst === "number"
                                    ? item.gst
                                    : 0;
                              const itemDiscount =
                                typeof item.discount === "string"
                                  ? parseFloat(item.discount)
                                  : typeof item.discount === "number"
                                    ? item.discount
                                    : 0;


                                    

                              return (
                                <tr
                                  key={`product-${index}`}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {index + 1}
                                  </td>
                                  <td className="px-6 py-4 min-w-[400px]">
                                    <div className="space-y-2 flex flex-row gap-3 justify-start items-center">
                                       <div className="w-[80px] min-w-[80px] h-[80px] overflow-hidden shadow-[0px_0px_5px_#9c9b9b] min-h-[80px] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                                         <img className="w-full h-full object-cover" src={item.product_image} />
                                        </div>
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                       
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          {item.product_name}
                                        </span>
                                      </div>

                                      {/* Display Attributes */}
                                      {item.attributes &&
                                        Array.isArray(item.attributes) &&
                                        item.attributes.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            
                                            {item.attributes.map(
                                              (attr, attrIdx) => {
                                                if (
                                                  typeof attr === "object" &&
                                                  attr !== null
                                                ) {
                                                  return Object.entries(
                                                    attr,
                                                  ).map(
                                                    (
                                                      [key, value],
                                                      entryIdx,
                                                    ) => (
                                                      <span
                                                        key={`attr-${attrIdx}-${entryIdx}`}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                                      >
                                                         {value}
                                                      </span>
                                                    ),
                                                  );
                                                }
                                                return (
                                                  <span
                                                    key={`attr-${attrIdx}`}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                                  >
                                                    {attr}
                                                  </span>
                                                );
                                              },
                                            )}
                                          </div>
                                        )}

                                      {/* Display Variants */}
                                      {item.variants &&
                                        Array.isArray(item.variants) &&
                                        item.variants.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            
                                            {item.variants.map(
                                              (variant, variantIdx) => {
                                                const variantValues = [];
                                                if (variant.size)
                                                  variantValues.push(
                                                    ` ${variant.size}`,
                                                  );
                                                if (variant.color)
                                                  variantValues.push(
                                                    `${variant.color}`,
                                                  );
                                                if (variant.material)
                                                  variantValues.push(
                                                    `${variant.material}`,
                                                  );
                                                if (variant.gender)
                                                  variantValues.push(
                                                    `${variant.gender}`,
                                                  );
                                                if (variant.weight)
                                                  variantValues.push(
                                                    `${variant.weight}`,
                                                  );

                                                // If variant is a string or has other properties
                                                if (
                                                  variantValues.length === 0 &&
                                                  typeof variant === "object"
                                                ) {
                                                  Object.entries(
                                                    variant,
                                                  ).forEach(([key, value]) => {
                                                    if (
                                                      key !== "id" &&
                                                      key !== "user_id" &&
                                                      key !== "product_id" &&
                                                      key !== "created_at" &&
                                                      key !== "updated_at" &&
                                                      key !== "deleted_at" &&
                                                      key !== "created_by"
                                                    ) {
                                                      variantValues.push(
                                                        `${key}: ${value}`,
                                                      );
                                                    }
                                                  });
                                                }

                                                return variantValues.map(
                                                  (val, valIdx) => (
                                                    <span
                                                      key={`variant-${variantIdx}-${valIdx}`}
                                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                                                    >
                                                      {val}
                                                    </span>
                                                  ),
                                                );
                                              },
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                    {item.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                    {formatCurrency(itemPrice)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                    {itemGst || 0}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                                    {itemDiscount || 0}%
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(itemTotal)}
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        )}

                        {invoice.packages && invoice.packages.length > 0 && (
                          <>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                              <td colSpan="7" className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <FiArchive className="w-4 h-4 text-purple-500" />
                                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Packages
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {invoice.packages.map((pkg, index) => {
                              const pkgPrice =
                                typeof pkg.package_price === "string"
                                  ? parseFloat(pkg.package_price)
                                  : typeof pkg.package_price === "number"
                                    ? pkg.package_price
                                    : 0;
                              const pkgQuantity =
                                typeof pkg.quantity === "string"
                                  ? parseFloat(pkg.quantity)
                                  : typeof pkg.quantity === "number"
                                    ? pkg.quantity
                                    : 0;
                              const pkgTotal = pkgPrice * pkgQuantity;
                              const startIndex = invoice.items?.length || 0;

                              return (
                                <tr
                                  key={`package-${index}`}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {startIndex + index + 1}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-800/30 rounded-lg flex items-center justify-center">
                                        <FiArchive className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          {pkg.package_name ||
                                            `Package #${pkg.package_id}`}
                                        </span>
                                        {pkg.package_size && (
                                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                            ({pkg.package_size})
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                    {pkg.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                                    {formatCurrency(pkgPrice)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                    —
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                                    —
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-purple-600 dark:text-purple-400">
                                    {formatCurrency(pkgTotal)}
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        )}

                        {(!invoice.items || invoice.items.length === 0) &&
                          (!invoice.packages ||
                            invoice.packages.length === 0) && (
                            <tr>
                              <td
                                colSpan="7"
                                className="px-6 py-12 text-center"
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <FiPackage className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                  <p className="text-gray-500 dark:text-gray-400">
                                    No items found in this invoice
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Summary & Actions */}
              <div className="space-y-6">
                {/* Financial Summary Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/25">
                        <FiDollarSign className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Financial Summary
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        Subtotal
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(subtotalNum)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total GST
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(totalGstNum)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Discount
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -{formatCurrency(totalDiscountNum)}
                      </span>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          Grand Total
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatCurrency(totalAmountNum)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Details Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
                        <FiCreditCard className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Payment Details
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Amount Paid
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                          {formatCurrency(paidAmountNum)}
                        </span>
                      </div>

                      {paidAmountNum > totalAmountNum ? (
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">
                            Change Returned
                          </span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {formatCurrency(paidAmountNum - totalAmountNum)}
                          </span>
                        </div>
                      ) : paidAmountNum < totalAmountNum &&
                        invoice.status !== "cancelled" ? (
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">
                            Due Amount
                          </span>
                          <span className="font-semibold text-orange-600 dark:text-orange-400 text-lg">
                            {formatCurrency(dueBalance)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {showDuePayment && (
                      <div className="mt-6">
                        <Button
                          onClick={() => setShowPaymentModal(true)}
                          className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
                          icon={FiCreditCard}
                        >
                          Pay Due Amount
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Quick Actions Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
                        <FiPrinter className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Quick Actions
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <Button
                      onClick={handlePrintThermal}
                      variant="outline"
                      className="w-full gap-2 justify-center"
                      icon={FiPrinter}
                    >
                      Print Thermal (3")
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="w-full gap-2 justify-center"
                      icon={FiPrinter}
                    >
                      Print A4
                    </Button>
                    <Button
                      onClick={handleDownloadPDF}
                      className="w-full gap-2 justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
                      icon={FiDownload}
                    >
                      Download PDF
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payment Modal with Enhanced Validation */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowPaymentModal(false);
              setPaymentError("");
              setDuePayAmount("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Record Payment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Due amount:{" "}
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(dueBalance)}
                  </span>
                </p>
              </div>
              <form onSubmit={handleDuePay} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount to Pay
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                      ₹
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={`0.00 (Max ${formatCurrency(dueBalance)})`}
                      value={duePayAmount}
                      onChange={handlePaymentAmountChange}
                      className={`w-full pl-8 pr-4 py-2.5 rounded-xl border-2 ${
                        paymentError
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all duration-200`}
                      required
                    />
                  </div>
                  {paymentError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <FiAlertCircle className="w-4 h-4" />
                      {paymentError}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Enter amount between ₹0.01 and {formatCurrency(dueBalance)}
                  </p>
                </div>

                <Select
                  label="Payment Method"
                  value={duePayMethod}
                  onChange={(e) => setDuePayMethod(e.target.value)}
                  options={DUE_PAYMENT_METHOD_OPTIONS}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentError("");
                      setDuePayAmount("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      duePaySubmitting ||
                      !!paymentError ||
                      !duePayAmount ||
                      parseFloat(duePayAmount) <= 0 ||
                      parseFloat(duePayAmount) > dueBalance
                    }
                    isLoading={duePaySubmitting}
                    icon={FiCreditCard}
                  >
                    Pay Now
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceDetail;
