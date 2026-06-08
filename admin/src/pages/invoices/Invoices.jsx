import React, { useEffect, useState, useRef } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiFileText,
  FiTrash2,
  FiCheckCircle,
  FiArrowLeft,
  FiX,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
import { FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInvoiceStore } from "../../store/invoiceStore";
import { usePermissionStore } from "../../store/permissionStore";
import Button from "../../components/common/Button/Button";
import toast from "react-hot-toast";
import Input from "../../components/common/Input/Input";
import Pagination from "../../components/common/Pagination/Pagination";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import Select from "../../components/common/Select/Select";
import InvoiceTable from "../../components/features/Invoices/InvoiceTable";
import InvoiceModal from "../../components/features/Invoices/InvoiceModal";
import BillGenerateForm from "../../components/features/Invoices/BillGenerateForm";
import {
  printA4Invoice,
  printThermalInvoice,
} from "../../templates/PrintUtils";
import { customerAPI } from "../../services/customerService";
import { storeAPI } from "../../services/storeService";
import { productsAPI } from "../../services/productsService";
import { invoiceAPI } from "../../services/invoiceService";

const DUE_PAYMENT_METHOD_OPTIONS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Cheque", label: "Cheque" },
];

// Cache for product data
const productCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000;

const Invoices = () => {
  const navigate = useNavigate();
  const { canAccess } = usePermissionStore();
  const {
    invoices,
    totalInvoices,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchInvoices,
    createInvoice,
    deleteInvoice,
    cancelInvoice,
    fetchBillGenerateData,
    setFilters,
  } = useInvoiceStore();

  // Check if user has stock management permission
  const hasStockPermission = canAccess("stock-management");
  const secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;

  // Refs to prevent duplicate requests
  const isInitialMount = useRef(true);
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showBillGenerate, setShowBillGenerate] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showPayDueModal, setShowPayDueModal] = useState(false);
  const [payDueInvoice, setPayDueInvoice] = useState(null);
  const [duePayAmount, setDuePayAmount] = useState("");
  const [duePayMethod, setDuePayMethod] = useState("Cash");
  const [duePaySubmitting, setDuePaySubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState(null);
  const [cancellingInvoice, setCancellingInvoice] = useState(false);

  // Handle resize events to prevent unnecessary API calls
  useEffect(() => {
    let resizeTimeout;

    const handleResizeStart = () => {
      setIsResizing(true);
      clearTimeout(resizeTimeout);
    };

    const handleResizeEnd = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setIsResizing(false);
      }, 150);
    };

    window.addEventListener("resize", handleResizeStart);
    window.addEventListener("resize", handleResizeEnd);

    return () => {
      window.removeEventListener("resize", handleResizeStart);
      window.removeEventListener("resize", handleResizeEnd);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Initial fetch with deduplication
  useEffect(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const fetchData = async () => {
      // Prevent multiple simultaneous fetches
      if (isFetchingRef.current) {
        console.log("Fetch already in progress, skipping...");
        return;
      }

      isFetchingRef.current = true;

      try {
        await fetchInvoices();
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch invoices:", error);
        }
      } finally {
        setInitialLoading(false);
        isFetchingRef.current = false;
      }
    };

    // Only fetch on mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      // Cleanup store requests on unmount
      if (useInvoiceStore.getState().cleanup) {
        useInvoiceStore.getState().cleanup();
      }
    };
  }, []); // Empty dependency array - only run once

  // Debounced search with resize protection
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!isResizing && !isFetchingRef.current) {
        setFilters({ search: searchTerm });
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, setFilters, isResizing]);

  const handlePageChange = (page) => {
    if (isFetchingRef.current) {
      console.log("Page change skipped - fetch in progress");
      return;
    }
    setPageLoading(true);
    fetchInvoices(page).finally(() => {
      setPageLoading(false);
    });
  };

  const handleView = (invoice) => {
    let encodedId = btoa(invoice.id.toString() + secretKey);
    navigate(`/invoices/detail/${encodedId}`);
  };

  const handleEditInvoice = (invoice) => {
    let encodedId = btoa(invoice.id.toString() + secretKey);
    navigate(`/invoices/detail/${encodedId}`, { state: { openEdit: true } });
  };

  const handleCancelClick = (invoice) => {
    if (!invoice?.id || invoice.status === "cancelled") return;
    setInvoiceToCancel(invoice);
    setShowCancelConfirm(true);
  };

  const handleCancelInvoice = async () => {
    if (!invoiceToCancel?.id) return;
    setCancellingInvoice(true);
    try {
      const res = await cancelInvoice(invoiceToCancel.id);
      if (res?.success) {
        setShowCancelConfirm(false);
        setInvoiceToCancel(null);
        await fetchInvoices(currentPage);
      } else {
        toast.error(res?.message || "Failed to cancel invoice");
      }
    } catch (error) {
      console.error("Failed to cancel invoice:", error);
      toast.error("Failed to cancel invoice");
    } finally {
      setCancellingInvoice(false);
    }
  };

  const handleOpenPayDue = (invoice) => {
    const total = parseFloat(invoice.total_amount || 0);
    const paid = parseFloat(invoice.paid_amount || 0);
    const due = Math.max(0, total - paid);
    if (invoice.status === "cancelled" || due <= 0.001) return;
    setPayDueInvoice(invoice);
    setDuePayAmount("");
    setDuePayMethod("Cash");
    setShowPayDueModal(true);
  };

  const handleDueAmountChange = (value) => {
    let cleanedValue = value.replace(/[^0-9.]/g, "");
    const decimalCount = (cleanedValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      cleanedValue = cleanedValue.slice(0, cleanedValue.lastIndexOf("."));
    }

    let numValue = cleanedValue === "" ? 0 : parseFloat(cleanedValue);
    if (isNaN(numValue)) numValue = 0;

    const total = parseFloat(payDueInvoice?.total_amount || 0);
    const paid = parseFloat(payDueInvoice?.paid_amount || 0);
    const maxAmount = Math.max(0, total - paid);

    if (numValue > maxAmount) {
      numValue = maxAmount;
      cleanedValue = numValue.toString();
    }

    setDuePayAmount(cleanedValue === "" ? "" : cleanedValue);
  };

  const handlePayDueSubmit = async (e) => {
    e.preventDefault();
    if (!payDueInvoice?.id) return;
    const total = parseFloat(payDueInvoice.total_amount || 0);
    const paid = parseFloat(payDueInvoice.paid_amount || 0);
    const due = Math.max(0, total - paid);
    const amount = parseFloat(duePayAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    if (amount - due > 0.0001) {
      toast.error(`Amount cannot exceed due (₹${due.toFixed(2)})`);
      return;
    }
    setDuePaySubmitting(true);
    try {
      const res = await invoiceAPI.invoiceDuePay(payDueInvoice.id, {
        paid_amount: amount,
        payment_method: duePayMethod,
      });
      if (res.data?.status === true) {
        toast.success(res.data?.message || "Payment recorded");
        setShowPayDueModal(false);
        setPayDueInvoice(null);
        setDuePayAmount("");
        try {
          const ch = new BroadcastChannel("app-cache-invalidation");
          ch.postMessage({
            type: "invoice-updated",
            data: {
              customer_id: payDueInvoice.customer_id,
              timestamp: Date.now(),
            },
          });
          ch.close();
        } catch {
          /* ignore */
        }
        await fetchInvoices(currentPage);
      } else {
        toast.error(res.data?.message || "Payment failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setDuePaySubmitting(false);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!invoiceToDelete?.id) return;
    try {
      const res = await deleteInvoice(invoiceToDelete.id);
      if (res?.success) {
        setShowDeleteConfirm(false);
        setInvoiceToDelete(null);
        await fetchInvoices(currentPage);
      }
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  const handleAddSubmit = async (data) => {
    setFormSubmitting(true);
    try {
      const res = await createInvoice(data);
      console.log("Invoice creation response:", res);

      if (res?.status === true || res?.success) {
        toast.success("Invoice created successfully");
        return { success: true, data: res?.data || res };
      } else {
        toast.error(res?.message || "Failed to create invoice");
        return { success: false, error: res?.message };
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast.error("Failed to create invoice");
      return { success: false, error: error.message };
    } finally {
      setFormSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ search: "", status: "" });
  };

  const handlePrintA4 = async (invoice) => {
  try {
    let customerData = invoice.customer || {};
    let storeData = invoice.store || {};

    // Fetch customer data if not already present
    if (!customerData.name && invoice.customer_id) {
      const customerResponse = await customerAPI.getById(invoice.customer_id);
      customerData = customerResponse.data?.data || {};
    }

    // Fetch store data properly - IMPROVED VERSION
    if ((!storeData.name || !storeData.address) && invoice.store_id) {
      // Try multiple methods to get store data
      let storeResponse = null;
      
      // Try different API methods
      if (storeAPI.getStoreById) {
        storeResponse = await storeAPI.getStoreById(invoice.store_id);
      } else if (storeAPI.getById) {
        storeResponse = await storeAPI.getById(invoice.store_id);
      } else if (storeAPI.getStore) {
        storeResponse = await storeAPI.getStore(invoice.store_id);
      } else if (storeAPI.getByUserId) {
        // Fallback to get by user ID and filter
        const userStoresResponse = await storeAPI.getByUserId(invoice.user_id);
        const storesArray = userStoresResponse.data?.data?.data || userStoresResponse.data?.data || [];
        storeData = storesArray.find(store => store.id === invoice.store_id) || {};
      }
      
      if (storeResponse && storeResponse.data) {
        if (storeResponse.data?.status === true && storeResponse.data?.data) {
          storeData = storeResponse.data.data;
        } else if (storeResponse.data?.data && typeof storeResponse.data.data === "object") {
          storeData = storeResponse.data.data;
        } else if (storeResponse.data && typeof storeResponse.data === "object") {
          storeData = storeResponse.data;
        }
      }
    }

    // Extract store address properly
    let storeAddress = "";
    if (storeData.address) {
      if (typeof storeData.address === "string") {
        storeAddress = storeData.address;
      } else if (typeof storeData.address === "object") {
        const addressParts = [];
        if (storeData.address.line1) addressParts.push(storeData.address.line1);
        if (storeData.address.line2) addressParts.push(storeData.address.line2);
        if (storeData.address.city) addressParts.push(storeData.address.city);
        if (storeData.address.state) addressParts.push(storeData.address.state);
        if (storeData.address.pincode) addressParts.push(storeData.address.pincode);
        storeAddress = addressParts.join(", ");
      }
    } else if (storeData.city || storeData.state) {
      const addressParts = [];
      if (storeData.address_line1) addressParts.push(storeData.address_line1);
      if (storeData.address_line2) addressParts.push(storeData.address_line2);
      if (storeData.city) addressParts.push(storeData.city);
      if (storeData.state) addressParts.push(storeData.state);
      if (storeData.pincode) addressParts.push(storeData.pincode);
      storeAddress = addressParts.join(", ");
    }
    
    // If still no address, try invoice fields
    if (!storeAddress && invoice.store_address) {
      storeAddress = invoice.store_address;
    }
    
    // If still empty, set default
    if (!storeAddress) {
      storeAddress = "N/A";
    }

    // Extract customer address properly
    let customerAddress = "";
    if (customerData.address) {
      if (typeof customerData.address === "string") {
        customerAddress = customerData.address;
      } else if (typeof customerData.address === "object") {
        const addressParts = [];
        if (customerData.address.line1) addressParts.push(customerData.address.line1);
        if (customerData.address.line2) addressParts.push(customerData.address.line2);
        if (customerData.address.city) addressParts.push(customerData.address.city);
        if (customerData.address.state) addressParts.push(customerData.address.state);
        if (customerData.address.pincode) addressParts.push(customerData.address.pincode);
        customerAddress = addressParts.join(", ");
      }
    } else if (customerData.city || customerData.state) {
      const addressParts = [];
      if (customerData.address_line1) addressParts.push(customerData.address_line1);
      if (customerData.address_line2) addressParts.push(customerData.address_line2);
      if (customerData.city) addressParts.push(customerData.city);
      if (customerData.state) addressParts.push(customerData.state);
      if (customerData.pincode) addressParts.push(customerData.pincode);
      customerAddress = addressParts.join(", ");
    }
    
    if (!customerAddress && invoice.customer_address) {
      customerAddress = invoice.customer_address;
    }
    
    if (!customerAddress) {
      customerAddress = "N/A";
    }

    const invoiceItems = invoice.invoice_items || invoice.items || [];
    let enhancedItems = [];

    if (invoiceItems.length > 0) {
      const uniqueProductIds = [
        ...new Set(
          invoiceItems.map((item) => item.product_id).filter(Boolean),
        ),
      ];

      const productPromises = uniqueProductIds.map(async (productId) => {
        const cached = productCache.get(productId);
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
          return { id: productId, data: cached.data };
        }

        try {
          const productResponse = await productsAPI.getById(productId);
          const productData =
            productResponse.data?.data || productResponse.data || {};
          productCache.set(productId, {
            data: productData,
            timestamp: Date.now(),
          });
          return { id: productId, data: productData };
        } catch (error) {
          console.error(`Failed to fetch product ${productId}:`, error);
          return { id: productId, data: null };
        }
      });

      const productResults = await Promise.all(productPromises);
      const productMap = productResults.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});

      enhancedItems = invoiceItems.map((item) => {
        const productData = productMap[item.product_id] || {};
        return {
          ...item,
          product_name:
            productData.name ||
            item.product_name ||
            item.name ||
            `Product #${item.product_id || item.id || "Unknown"}`,
          price: parseFloat(item.price || productData.selling_price || 0),
          quantity: parseFloat(item.quantity || item.item_count || 1),
          total_price: parseFloat(item.total_price || item.total || 0),
          gst: parseFloat(item.gst || productData.gst_percentage || 0),
          discount: parseFloat(
            item.discount || productData.discount_percentage || 0,
          ),
        };
      });
    } else {
      enhancedItems = [
        {
          id: 1,
          product_id: 1,
          product_name: "Product Item",
          price: parseFloat(invoice.total_amount || 1000),
          quantity: 1,
          total_price: parseFloat(invoice.total_amount || 1000),
          gst: 18,
          discount: 0,
        },
      ];
    }

    const enhancedInvoice = {
      ...invoice,
      invoice_number: invoice.invoice_number || `INV-${invoice.id}`,
      customer_name: customerData.name || invoice.customer_name || "Walk-in Customer",
      customer_phone: customerData.phone || customerData.mobile || invoice.customer_phone || "N/A",
      customer_email: customerData.email || invoice.customer_email || "N/A",
      customer_address: customerAddress,
      customer_gst: customerData.gst || invoice.customer_gst || "N/A",
      store_name: storeData.name || storeData.store_name || invoice.store_name || "Store Deleted",
      store_address: storeAddress,
      store_gst: storeData.gst || storeData.gst_number || invoice.store_gst || "N/A",
      store_email: storeData.email || storeData.store_email || invoice.store_email || "N/A",
      store_phone: storeData.mobile || storeData.phone || storeData.store_phone || invoice.store_phone || "N/A",
      items: enhancedItems,
    };
    
    console.log("Enhanced invoice for printing:", {
      store_name: enhancedInvoice.store_name,
      store_address: enhancedInvoice.store_address,
      store_phone: enhancedInvoice.store_phone,
      store_email: enhancedInvoice.store_email,
      store_gst: enhancedInvoice.store_gst
    });
    
    printA4Invoice(enhancedInvoice);
  } catch (error) {
    console.error("Failed to fetch data for A4 printing:", error);
    printA4Invoice(invoice);
  }
};

const handlePrintThermal = async (invoice) => {
  try {
    let customerData = invoice.customer || {};
    let storeData = invoice.store || {};

    // Fetch customer data if not already present
    if (!customerData.name && invoice.customer_id) {
      const customerResponse = await customerAPI.getById(invoice.customer_id);
      customerData = customerResponse.data?.data || {};
    }

    // Fetch store data properly - IMPROVED VERSION
    if ((!storeData.name || !storeData.address) && invoice.store_id) {
      // Try multiple methods to get store data
      let storeResponse = null;
      
      // Try different API methods
      if (storeAPI.getStoreById) {
        storeResponse = await storeAPI.getStoreById(invoice.store_id);
      } else if (storeAPI.getById) {
        storeResponse = await storeAPI.getById(invoice.store_id);
      } else if (storeAPI.getStore) {
        storeResponse = await storeAPI.getStore(invoice.store_id);
      } else if (storeAPI.getByUserId) {
        // Fallback to get by user ID and filter
        const userStoresResponse = await storeAPI.getByUserId(invoice.user_id);
        const storesArray = userStoresResponse.data?.data?.data || userStoresResponse.data?.data || [];
        storeData = storesArray.find(store => store.id === invoice.store_id) || {};
      }
      
      if (storeResponse && storeResponse.data) {
        if (storeResponse.data?.status === true && storeResponse.data?.data) {
          storeData = storeResponse.data.data;
        } else if (storeResponse.data?.data && typeof storeResponse.data.data === "object") {
          storeData = storeResponse.data.data;
        } else if (storeResponse.data && typeof storeResponse.data === "object") {
          storeData = storeResponse.data;
        }
      }
    }

    // Extract store address properly
    let storeAddress = "";
    if (storeData.address) {
      if (typeof storeData.address === "string") {
        storeAddress = storeData.address;
      } else if (typeof storeData.address === "object") {
        const addressParts = [];
        if (storeData.address.line1) addressParts.push(storeData.address.line1);
        if (storeData.address.line2) addressParts.push(storeData.address.line2);
        if (storeData.address.city) addressParts.push(storeData.address.city);
        if (storeData.address.state) addressParts.push(storeData.address.state);
        if (storeData.address.pincode) addressParts.push(storeData.address.pincode);
        storeAddress = addressParts.join(", ");
      }
    } else if (storeData.city || storeData.state) {
      const addressParts = [];
      if (storeData.address_line1) addressParts.push(storeData.address_line1);
      if (storeData.address_line2) addressParts.push(storeData.address_line2);
      if (storeData.city) addressParts.push(storeData.city);
      if (storeData.state) addressParts.push(storeData.state);
      if (storeData.pincode) addressParts.push(storeData.pincode);
      storeAddress = addressParts.join(", ");
    }
    
    // If still no address, try invoice fields
    if (!storeAddress && invoice.store_address) {
      storeAddress = invoice.store_address;
    }
    
    // If still empty, set default
    if (!storeAddress) {
      storeAddress = "N/A";
    }

    // Extract customer address properly
    let customerAddress = "";
    if (customerData.address) {
      if (typeof customerData.address === "string") {
        customerAddress = customerData.address;
      } else if (typeof customerData.address === "object") {
        const addressParts = [];
        if (customerData.address.line1) addressParts.push(customerData.address.line1);
        if (customerData.address.line2) addressParts.push(customerData.address.line2);
        if (customerData.address.city) addressParts.push(customerData.address.city);
        if (customerData.address.state) addressParts.push(customerData.address.state);
        if (customerData.address.pincode) addressParts.push(customerData.address.pincode);
        customerAddress = addressParts.join(", ");
      }
    } else if (customerData.city || customerData.state) {
      const addressParts = [];
      if (customerData.address_line1) addressParts.push(customerData.address_line1);
      if (customerData.address_line2) addressParts.push(customerData.address_line2);
      if (customerData.city) addressParts.push(customerData.city);
      if (customerData.state) addressParts.push(customerData.state);
      if (customerData.pincode) addressParts.push(customerData.pincode);
      customerAddress = addressParts.join(", ");
    }
    
    if (!customerAddress && invoice.customer_address) {
      customerAddress = invoice.customer_address;
    }
    
    if (!customerAddress) {
      customerAddress = "N/A";
    }

    const invoiceItems = invoice.invoice_items || invoice.items || [];
    let enhancedItems = [];

    if (invoiceItems.length > 0) {
      const uniqueProductIds = [
        ...new Set(
          invoiceItems.map((item) => item.product_id).filter(Boolean),
        ),
      ];

      const productPromises = uniqueProductIds.map(async (productId) => {
        const cached = productCache.get(productId);
        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
          return { id: productId, data: cached.data };
        }

        try {
          const productResponse = await productsAPI.getById(productId);
          const productData =
            productResponse.data?.data || productResponse.data || {};
          productCache.set(productId, {
            data: productData,
            timestamp: Date.now(),
          });
          return { id: productId, data: productData };
        } catch (error) {
          console.error(`Failed to fetch product ${productId}:`, error);
          return { id: productId, data: null };
        }
      });

      const productResults = await Promise.all(productPromises);
      const productMap = productResults.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});

      enhancedItems = invoiceItems.map((item) => {
        const productData = productMap[item.product_id] || {};
        return {
          ...item,
          product_name:
            productData.name ||
            item.product_name ||
            item.name ||
            `Product #${item.product_id || item.id || "Unknown"}`,
          price: parseFloat(item.price || productData.selling_price || 0),
          quantity: parseFloat(item.quantity || item.item_count || 1),
          total_price: parseFloat(item.total_price || item.total || 0),
          gst: parseFloat(item.gst || productData.gst_percentage || 0),
          discount: parseFloat(
            item.discount || productData.discount_percentage || 0,
          ),
        };
      });
    } else {
      enhancedItems = [
        {
          id: 1,
          product_id: 1,
          product_name: "Product Item",
          price: parseFloat(invoice.total_amount || 1000),
          quantity: 1,
          total_price: parseFloat(invoice.total_amount || 1000),
          gst: 18,
          discount: 0,
        },
      ];
    }

    const enhancedInvoice = {
      ...invoice,
      invoice_number: invoice.invoice_number || `INV-${invoice.id}`,
      customer_name: customerData.name || invoice.customer_name || "Walk-in Customer",
      customer_phone: customerData.phone || customerData.mobile || invoice.customer_phone || "N/A",
      customer_email: customerData.email || invoice.customer_email || "N/A",
      customer_address: customerAddress,
      customer_gst: customerData.gst || invoice.customer_gst || "N/A",
      store_name: storeData.name || storeData.store_name || invoice.store_name || "Store Deleted",
      store_address: storeAddress,
      store_gst: storeData.gst || storeData.gst_number || invoice.store_gst || "N/A",
      store_email: storeData.email || storeData.store_email || invoice.store_email || "N/A",
      store_phone: storeData.mobile || storeData.phone || storeData.store_phone || invoice.store_phone || "N/A",
      items: enhancedItems,
    };
    
    console.log("Enhanced invoice for thermal printing:", {
      store_name: enhancedInvoice.store_name,
      store_address: enhancedInvoice.store_address,
      store_phone: enhancedInvoice.store_phone,
      store_email: enhancedInvoice.store_email,
      store_gst: enhancedInvoice.store_gst
    });
    
    printThermalInvoice(enhancedInvoice);
  } catch (error) {
    console.error("Failed to fetch data for thermal printing:", error);
    printThermalInvoice(invoice);
  }
};

  // Calculate stats with safe invoices array
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const stats = {
    total: totalInvoices || safeInvoices?.length || 0,
    completed:
      safeInvoices?.filter((i) => i.status === "completed").length || 0,
    paid:
      safeInvoices?.filter(
        (i) =>
          (i.status === "paid" || i.status === "completed") &&
          (parseFloat(i.paid_amount) || 0) > 0,
      ).length || 0,
    nonPaid:
      safeInvoices?.filter((i) => (parseFloat(i.paid_amount) || 0) === 0)
        .length || 0,
    unpaid: safeInvoices?.filter((i) => i.status === "unpaid").length || 0,
    overdue: safeInvoices?.filter((i) => i.status === "overdue").length || 0,
    totalAmount:
      safeInvoices?.reduce(
        (sum, i) => sum + (parseFloat(i.total_amount) || 0),
        0,
      ) || 0,
    paidAmount:
      safeInvoices
        ?.filter(
          (i) =>
            (i.status === "paid" || i.status === "completed") &&
            (parseFloat(i.paid_amount) || 0) > 0,
        )
        .reduce((sum, i) => sum + (parseFloat(i.paid_amount) || 0), 0) || 0,
    unpaidAmount:
      safeInvoices?.reduce((sum, i) => {
        const total = parseFloat(i.total_amount) || 0;
        const paid = parseFloat(i.paid_amount) || 0;
        return sum + (total - paid);
      }, 0) || 0,
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

  const getCurrentDueAmount = () => {
    if (!payDueInvoice) return 0;
    const total = parseFloat(payDueInvoice.total_amount || 0);
    const paid = parseFloat(payDueInvoice.paid_amount || 0);
    return Math.max(0, total - paid);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
              Invoices
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiFileText className="w-4 h-4 mr-2" />
              {showAddForm ? (
                <span>Create New Invoice</span>
              ) : (
                <span>Manage and track your invoices</span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {showAddForm ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Button
                  variant="outline"
                  onClick={handleCancelForm}
                  icon={FiArrowLeft}
                >
                  Back to Invoices
                </Button>
              </motion.div>
            ) : (
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
                  Create Invoice
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards - Hide when form is shown */}
        <AnimatePresence mode="wait">
          {!showAddForm && (
            <motion.div
              key="stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              {initialLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
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
                    title="Total Invoices"
                    value={stats.total}
                    icon={FiFileText}
                    color="from-blue-500 to-cyan-500"
                    delay={0.1}
                  />
                  <StatCard
                    title="Paid"
                    value={stats.paid}
                    icon={FiCheckCircle}
                    color="from-green-500 to-emerald-500"
                    subtitle={`${((stats.paid / stats.total) * 100 || 0).toFixed(1)}% of total`}
                    delay={0.2}
                  />
                  <StatCard
                    title="Non Paid"
                    value={stats.nonPaid}
                    icon={FiAlertCircle}
                    color="from-yellow-500 to-orange-500"
                    subtitle={`${((stats.nonPaid / stats.total) * 100 || 0).toFixed(1)}% of total`}
                    delay={0.3}
                  />
                  <StatCard
                    title="Outstanding"
                    value={`₹${stats.unpaidAmount.toFixed(2)}`}
                    icon={FiDollarSign}
                    color="from-red-500 to-orange-500"
                    subtitle={`${((stats.unpaidAmount / stats.totalAmount) * 100 || 0).toFixed(1)}% of total`}
                    delay={0.4}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice Form */}
        <AnimatePresence mode="wait">
          {showAddForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <BillGenerateForm
                mode="add"
                onSubmit={handleAddSubmit}
                onCancel={handleCancelForm}
                isSubmitting={formSubmitting}
                hasStockPermission={hasStockPermission}
                onSuccess={() => {
                  setShowAddForm(false);
                  fetchInvoices(currentPage);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters - Hide when form is shown */}
        <AnimatePresence mode="wait">
          {!showAddForm && (
            <motion.div
              key="filters"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              {initialLoading ? (
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
                        placeholder="Search invoices by number, customer, or amount..."
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
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select
                              label="Status"
                              options={[
                                { value: "", label: "All Statuses" },
                                { value: "paid", label: "Paid" },
                                { value: "unpaid", label: "Unpaid" },
                                { value: "overdue", label: "Overdue" },
                                { value: "cancelled", label: "Cancelled" },
                                { value: "refunded", label: "Refunded" },
                              ]}
                              value={filters.status}
                              onChange={(e) =>
                                setFilters({ status: e.target.value })
                              }
                            />

                            <Select
                              label="Date Range"
                              options={[
                                { value: "", label: "All Time" },
                                { value: "today", label: "Today" },
                                { value: "week", label: "This Week" },
                                { value: "month", label: "This Month" },
                                { value: "quarter", label: "This Quarter" },
                                { value: "year", label: "This Year" },
                              ]}
                              value={filters.dateRange}
                              onChange={(e) =>
                                setFilters({ dateRange: e.target.value })
                              }
                            />

                            <Input
                              label="Min Amount"
                              type="number"
                              placeholder="0"
                              value={filters.minAmount}
                              onChange={(e) =>
                                setFilters({ minAmount: e.target.value })
                              }
                            />

                            <Input
                              label="Max Amount"
                              type="number"
                              placeholder="10000"
                              value={filters.maxAmount}
                              onChange={(e) =>
                                setFilters({ maxAmount: e.target.value })
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
          )}
        </AnimatePresence>

        {/* Invoices Table - Hide when form is shown */}
        <AnimatePresence mode="wait">
          {!showAddForm && (
            <motion.div
              key="table"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
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
                        ? "Loading invoice data..."
                        : "Updating invoice data..."}
                    </p>
                  </div>
                </div>
              ) : safeInvoices?.length === 0 ? (
                <EmptyState
                  icon={FiFileText}
                  title="No invoices found"
                  description="Try adjusting your search or filters, or create your first invoice."
                  action={
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button onClick={handleAddClick} icon={FiPlus}>
                        Create Invoice
                      </Button>
                    </motion.div>
                  }
                />
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <InvoiceTable
                      invoices={(safeInvoices || []).map((inv) => ({
                        ...inv,
                        amount: inv.total ?? 0,
                        currency: inv.currency || "USD",
                      }))}
                      loading={loading}
                      onView={handleView}
                      onEdit={handleEditInvoice}
                      onCancelInvoice={handleCancelClick}
                      onPayDue={handleOpenPayDue}
                      onPrintA4={handlePrintA4}
                      onPrintThermal={handlePrintThermal}
                    />
                    {totalInvoices > pageSize && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className=""
                      >
                        <Pagination
                          currentPage={currentPage}
                          totalItems={totalInvoices}
                          pageSize={pageSize}
                          onPageChange={handlePageChange}
                        />
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Invoice Modal */}
        <InvoiceModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
        />

        {/* Bill Generate Modal */}
        <AnimatePresence>
          {showBillGenerate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowBillGenerate(false)}
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
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FaReceipt className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Bill Generation
                  </motion.h3>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    Generate bills with stock management integration. This will
                    open the bill generation page where you can create new
                    invoices with product selection and stock management.
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
                        onClick={() => setShowBillGenerate(false)}
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
                        onClick={() => window.open("/invoice", "_blank")}
                        className="w-full"
                      >
                        Open Bill Generator
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
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
                  Delete Invoice
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Are you sure you want to delete invoice{" "}
                  <span className="font-semibold">
                    #{invoiceToDelete?.invoiceNumber}
                  </span>
                  ? This action cannot be undone and will remove all associated
                  data.
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
                        setInvoiceToDelete(null);
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
                      onClick={handleDelete}
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

      {/* Pay due (from table) with improved amount input */}
      <AnimatePresence>
        {showPayDueModal && payDueInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (!duePaySubmitting) {
                setShowPayDueModal(false);
                setPayDueInvoice(null);
              }
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
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCreditCard className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
                Pay invoice due
              </h3>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Invoice #{payDueInvoice.id}
                <span className="block mt-1 font-medium text-orange-600 dark:text-orange-400">
                  Due: ₹{getCurrentDueAmount().toFixed(2)}
                </span>
              </p>
              <form onSubmit={handlePayDueSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    label="Amount to pay"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={duePayAmount}
                    onChange={(e) => handleDueAmountChange(e.target.value)}
                    required
                    className="font-mono text-lg"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum payable amount: ₹{getCurrentDueAmount().toFixed(2)}
                  </p>
                </div>
                <Select
                  label="Payment method"
                  value={duePayMethod}
                  onChange={(e) => setDuePayMethod(e.target.value)}
                  options={DUE_PAYMENT_METHOD_OPTIONS}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={duePaySubmitting}
                    onClick={() => {
                      setShowPayDueModal(false);
                      setPayDueInvoice(null);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={duePaySubmitting}
                    isLoading={duePaySubmitting}
                    icon={FiCreditCard}
                  >
                    Record payment
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Invoice Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && invoiceToCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              if (!cancellingInvoice) {
                setShowCancelConfirm(false);
                setInvoiceToCancel(null);
              }
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
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiAlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </motion.div>
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Cancel Invoice
                </motion.h3>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  Are you sure you want to cancel invoice{" "}
                  <span className="font-semibold">
                    #{invoiceToCancel?.invoiceNumber || invoiceToCancel?.id}
                  </span>
                  ?
                  <br />
                  <span className="text-sm mt-2 block">
                    Stock will be restored if applicable, customer due will be
                    adjusted, and the invoice will be marked cancelled.
                  </span>
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
                        setShowCancelConfirm(false);
                        setInvoiceToCancel(null);
                      }}
                      disabled={cancellingInvoice}
                      className="w-full"
                    >
                      No, Keep Invoice
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="danger"
                      onClick={handleCancelInvoice}
                      isLoading={cancellingInvoice}
                      disabled={cancellingInvoice}
                      className="w-full"
                    >
                      Yes, Cancel Invoice
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

export default Invoices;