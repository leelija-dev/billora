import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../../../services/apiClient";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiUser,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiSearch,
  FiAlertCircle,
  FiMinus,
  FiUserPlus,
  FiEdit,
} from "react-icons/fi";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import Select from "../../common/Select/Select";
import SearchSelect from "../../common/SearchSelect/SearchSelect";
import EmptyState from "../../common/EmptyState/EmptyState";
import Modal from "../../common/Modal/Modal";
import StoreModal from "./StoreModal";
import CustomerModal from "./CustomerModal";
import { invoiceAPI } from "../../../services/invoiceService";
import { stockAPI } from "../../../services/stockService";
import { packagesAPI } from "../../../services/packagesService";
import { storeAPI } from "../../../services/storeService";
import { customerAPI } from "../../../services/customerService";
import usePackageStore from "../../../store/packageStore";
import { useAuthStore } from "../../../store/authStore";
import { useCustomerStore } from "../../../store/customerStore";
import toast from "react-hot-toast";
import { LucideStore } from "lucide-react";
import {
  printA4Invoice,
  printThermalInvoice,
} from "../../../templates/PrintUtils";
import { FaRupeeSign } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";

// Cache for bill generate data
let billGenerateCache = null;
let lastFetchTime = null;
const CACHE_EXPIRY = 30 * 1000; // 30 seconds

const BillGenerateForm = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  isSubmitting,
  onSuccess,
  hasStockPermission,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    packages,
    fetchPackages,
    loading: packagesLoading,
  } = usePackageStore();
  const { createCustomer, fetchCustomers } = useCustomerStore();

  // Use refs to track mounted state and prevent duplicate calls
  const isMounted = useRef(true);
  const hasFetchedInitialData = useRef(false);
  const fetchInProgress = useRef(false);
  const productDropdownRef = useRef(null);

  // Get current user ID
  const getUserId = useCallback(() => {
    if (user?.id) {
      return user.id;
    }

    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.user?.id || parsed.userId;
      } catch (error) {
        console.error("Failed to parse auth data:", error);
      }
    }

    throw new Error("User ID not found in auth store or localStorage");
  }, [user]);

  const currentUserId = useMemo(() => {
    try {
      return getUserId();
    } catch (error) {
      console.error("Error getting user ID:", error);
      return null;
    }
  }, [getUserId]);

  const [formData, setFormData] = useState({
    user_id: currentUserId,
    customer_id: "",
    store_id: "",
    paid_amount: 0,
    created_by: currentUserId,
    items: [],
    payment_status: "paid",
    payment_amount: 0,
    payment_method: "cash",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductList, setShowProductList] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);

  // Search states for customer and store
  const [customerSearch, setCustomerSearch] = useState("");
  const [storeSearch, setStoreSearch] = useState("");
  const [packageSearch, setPackageSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageQuantity, setPackageQuantity] = useState(1);
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [generatedBillData, setGeneratedBillData] = useState(null);
  const [createdInvoiceData, setCreatedInvoiceData] = useState(null);
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);

  // Add customer modal state
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    gst: "",
  });
  const [customerErrors, setCustomerErrors] = useState({});

  const emptyInitialData = useMemo(() => ({}), []);

  // Edit customer modal state
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);

  // Add state for product pagination
  const [productPagination, setProductPagination] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchTimeout, setProductSearchTimeout] = useState(null);

  // Add store modal state
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [newStoreData, setNewStoreData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gst: "",
  });

  // Edit store modal state
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);

  // Enhanced product search state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Helper function to calculate item total price
  const calculateItemTotal = useCallback((price, quantity, gst, discount) => {
    const basePrice = price * quantity;
    const discountAmount = basePrice * (discount / 100);
    const gstAmount = (basePrice - discountAmount) * (gst / 100);
    return basePrice - discountAmount + gstAmount;
  }, []);

  // Quantity increment/decrement handlers
  const handleIncrementQuantity = useCallback(
    (index) => {
      const item = formData.items[index];
      const maxValue =
        hasStockPermission && item.stock_quantity > 0
          ? item.stock_quantity
          : undefined;
      const newQuantity = parseFloat(item.quantity) + 1;

      if (maxValue && newQuantity > maxValue) {
        toast.error(`Cannot exceed available stock. Maximum: ${maxValue}`);
        return;
      }

      handleUpdateItem(index, "quantity", newQuantity);
    },
    [formData.items, hasStockPermission],
  );

  const handleDecrementQuantity = useCallback(
    (index) => {
      const item = formData.items[index];
      const newQuantity = parseFloat(item.quantity) - 1;

      if (newQuantity >= 1) {
        handleUpdateItem(index, "quantity", newQuantity);
      }
    },
    [formData.items],
  );

  // GST increment/decrement handlers
  const handleIncrementGst = useCallback(
    (index) => {
      const item = formData.items[index];
      const newGst = parseFloat(item.gst) + 1;

      if (newGst <= 100) {
        handleUpdateItem(index, "gst", newGst);
      }
    },
    [formData.items],
  );

  const handleDecrementGst = useCallback(
    (index) => {
      const item = formData.items[index];
      const newGst = parseFloat(item.gst) - 1;

      if (newGst >= 0) {
        handleUpdateItem(index, "gst", newGst);
      }
    },
    [formData.items],
  );

  // Discount increment/decrement handlers
  const handleIncrementDiscount = useCallback(
    (index) => {
      const item = formData.items[index];
      const newDiscount = parseFloat(item.discount) + 1;

      if (newDiscount <= 100) {
        handleUpdateItem(index, "discount", newDiscount);
      }
    },
    [formData.items],
  );

  const handleDecrementDiscount = useCallback(
    (index) => {
      const item = formData.items[index];
      const newDiscount = parseFloat(item.discount) - 1;

      if (newDiscount >= 0) {
        handleUpdateItem(index, "discount", newDiscount);
      }
    },
    [formData.items],
  );

  const fetchProductsWithStock = useCallback(
    async (searchTerm = "") => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append("search", searchTerm);
        }

        const response = await apiClient.get(
          `/invoice/products?${params.toString()}`,
        );

        if (response.data?.status === true && response.data?.data?.data) {
          const productsData = response.data.data.data;

          const transformedProducts = [];

          console.log("chekig ................", productsData);

          productsData.forEach((product) => {
            if (
              hasStockPermission &&
              product.stocks &&
              product.stocks.length > 0
            ) {
              product.stocks.forEach((stock, index) => {
                transformedProducts.push({
                  id: product.id,
                  stock_id: stock.id,
                  variant_index: index,
                  name: product.name,
                  sku: product.sku,
                  brand: product.brand,
                  category: product.category,
                  unit: product.unit,
                  attributes: product.attributes || [],
                  variants: product.variants || [],
                  price: parseFloat(stock.selling_price || product.selling_price),
                  purchase_price: parseFloat(stock.purchase_price || product.purchase_price),
                  gst_percentage: parseFloat(stock.selling_gst_percentage || product.gst_percentage),
                  discount_percentage: parseFloat(product.discount_percentage),
                  current_stock: parseFloat(stock.quantity),
                  stock_quantity: parseFloat(stock.quantity),
                  variant_info:
                    product.stocks.length > 1 ? `Stock #${index + 1}` : null,
                  stock_entry: stock,
                });
              });
            } else {
              transformedProducts.push({
                id: product.id,
                stock_id: null,
                variant_index: 0,
                name: product.name,
                sku: product.sku,
                brand: product.brand,
                category: product.category,
                unit: product.unit,
                price: parseFloat(product.selling_price),
                attributes: product.attributes || [],
                variants: product.variants || [],
                purchase_price: parseFloat(product.purchase_price),
                gst_percentage: parseFloat(product.gst_percentage),
                discount_percentage: parseFloat(product.discount_percentage),
                current_stock: hasStockPermission
                  ? parseFloat(product.current_stock || 0)
                  : null,
                stock_quantity: hasStockPermission
                  ? parseFloat(product.current_stock || 0)
                  : null,
                variant_info: !hasStockPermission
                  ? "Stock management disabled"
                  : "No Stock Entry",
                stock_entry: null,
              });
            }
          });

          return {
            products: transformedProducts,
            pagination: {
              current_page: response.data.data.current_page,
              last_page: response.data.data.last_page,
              per_page: response.data.data.per_page,
              total: response.data.data.total,
            },
          };
        }

        return { products: [], pagination: null };
      } catch (error) {
        console.error("Failed to fetch products with stock:", error);
        return { products: [], pagination: null };
      }
    },
    [hasStockPermission],
  );

  const isCacheValid = useCallback(() => {
    return (
      billGenerateCache &&
      lastFetchTime &&
      Date.now() - lastFetchTime < CACHE_EXPIRY
    );
  }, []);

  const fetchInitialData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (fetchInProgress.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }

    // Prevent re-fetching if already fetched
    if (hasFetchedInitialData.current && isCacheValid()) {
      console.log("Data already fetched and cache valid, skipping...");
      return;
    }

    fetchInProgress.current = true;
    setLoading(true);
    setDataFetchError(false);

    try {
      // Fetch customers
      const customersResponse = await customerAPI.getAll(currentUserId, "");
      let customersList = [];
      if (
        customersResponse?.data?.data?.data &&
        Array.isArray(customersResponse.data.data.data)
      ) {
        customersList = customersResponse.data.data.data;
      } else if (
        customersResponse?.data?.data &&
        Array.isArray(customersResponse.data.data)
      ) {
        customersList = customersResponse.data.data;
      } else if (Array.isArray(customersResponse?.data)) {
        customersList = customersResponse.data;
      }

      setCustomers(customersList);

      // Fetch stores and products
      const billResponse = await invoiceAPI.getBillGenerateData(currentUserId);
      let billData = billResponse.data?.data || billResponse.data || {};

      const storesList = billData.stores || billData.store || [];
      const productsList = billData.products || billData.product || [];
      const unitsList = billData.units || billData.unit || [];

      setStores(storesList.length > 0 ? storesList : []);
      setProducts(productsList.length > 0 ? productsList : []);
      setUnits(unitsList.length > 0 ? unitsList : []);

      if (storesList.length > 0 && !formData.store_id) {
        const firstStoreId = storesList[0].id;
        setFormData((prev) => ({
          ...prev,
          store_id: firstStoreId,
        }));
      }

      hasFetchedInitialData.current = true;
      toast.success("Data loaded successfully");
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setDataFetchError(true);

      if (error.code === "ERR_NETWORK") {
        toast.error("Network error: Unable to connect to server.");
      } else {
        toast.error("Failed to load form data. Please try again later.");
      }

      setCustomers([]);
      setStores([]);
      setProducts([]);
      setUnits([]);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [currentUserId, isCacheValid, formData.store_id]);

  // Helper function to fetch complete invoice data from server using invoice ID
  const fetchCompleteInvoiceData = useCallback(
    async (invoiceId) => {
      try {
        console.log(
          "🔍 Fetching complete invoice data from server for ID:",
          invoiceId,
        );

        const response = await invoiceAPI.getById(invoiceId);
        console.log("🔍 Server invoice response:", response);

        let serverInvoiceData = null;
        if (response?.data?.data) {
          serverInvoiceData = response.data.data;
          console.log(
            "🔍 Complete invoice data from server:",
            serverInvoiceData,
          );
        } else if (response?.data) {
          serverInvoiceData = response.data;
          console.log("🔍 Invoice data from response.data:", serverInvoiceData);
        } else {
          console.warn("⚠️ No invoice data found in server response");
          return null;
        }

        if (serverInvoiceData && createdInvoiceData) {
          let customerData = {};
          let storeData = {};

          try {
            if (
              serverInvoiceData.customer_id ||
              createdInvoiceData.customer_id
            ) {
              const customerId =
                serverInvoiceData.customer_id || createdInvoiceData.customer_id;
              const customerResponse = await customerAPI.getById(customerId);
              customerData = customerResponse.data?.data || {};
            }
          } catch (error) {
            console.error("Failed to fetch customer data:", error);
          }

          try {
            if (serverInvoiceData.store_id || createdInvoiceData.store_id) {
              const storeId =
                serverInvoiceData.store_id || createdInvoiceData.store_id;
              const storeResponse = await storeAPI.getByUserId(
                serverInvoiceData.user_id ||
                  createdInvoiceData.user_id ||
                  currentUserId,
              );
              const storesArray =
                storeResponse.data?.data?.data ||
                storeResponse.data?.data ||
                [];
              storeData =
                storesArray.find((store) => store.id === storeId) ||
                storesArray[0] ||
                {};
            }
          } catch (error) {
            console.error("Failed to fetch store data:", error);
          }

          console.log("checking the server response", response);

          const mergedInvoiceData = {
            ...serverInvoiceData,
            items: createdInvoiceData.items || [],
            packages: createdInvoiceData.packages || [],
            customer_id:
              serverInvoiceData.customer_id || createdInvoiceData.customer_id,
            store_id: serverInvoiceData.store_id || createdInvoiceData.store_id,
            user_id:
              serverInvoiceData.user_id ||
              createdInvoiceData.user_id ||
              currentUserId,
            customer_name:
              customerData.name ||
              serverInvoiceData.customer_name ||
              createdInvoiceData.customer_name ||
              "Walk-in Customer",
            customer_phone:
              customerData.phone ||
              serverInvoiceData.customer_phone ||
              createdInvoiceData.customer_phone ||
              "N/A",
            customer_email:
              customerData.email ||
              serverInvoiceData.customer_email ||
              createdInvoiceData.customer_email ||
              "N/A",
            customer_address: customerData.address
              ? `${customerData.address}, ${customerData.city || ""}`
              : serverInvoiceData.customer_address ||
                createdInvoiceData.customer_address ||
                "N/A",
            customer_gst:
              customerData.gst ||
              serverInvoiceData.customer_gst ||
              createdInvoiceData.customer_gst ||
              "N/A",
            store_name:
              storeData.name ||
              serverInvoiceData.store_name ||
              createdInvoiceData.store_name ||
              "Your Store Name",
            store_address: storeData.address
              ? `${storeData.address}, ${storeData.city || ""}`
              : serverInvoiceData.store_address ||
                createdInvoiceData.store_address ||
                "123 Business Street, City",
            store_gst:
              storeData.gst ||
              serverInvoiceData.store_gst ||
              createdInvoiceData.store_gst ||
              "GSTIN123456",
            store_email:
              storeData.email ||
              serverInvoiceData.store_email ||
              createdInvoiceData.store_email ||
              "store@business.com",
            store_phone:
              storeData.mobile ||
              storeData.phone ||
              serverInvoiceData.store_phone ||
              createdInvoiceData.store_phone ||
              "123-456-7890",
            payment_method:
              serverInvoiceData.payment_method ||
              createdInvoiceData.payment_method ||
              "Cash",
            payment_status:
              serverInvoiceData.payment_status ||
              createdInvoiceData.payment_status ||
              "paid",
            total_amount:
              serverInvoiceData.total_amount ||
              createdInvoiceData.total_amount ||
              0,
            paid_amount:
              serverInvoiceData.paid_amount ||
              serverInvoiceData.paid_amount ||
              createdInvoiceData.paid_amount ||
              0,
            invoice_number:
              serverInvoiceData.invoice_id ||
              serverInvoiceData.invoice_number ||
              createdInvoiceData.invoice_id ||
              createdInvoiceData.invoice_number ||
              `INV-${Date.now()}`,
            created_at:
              serverInvoiceData.created_at ||
              createdInvoiceData.created_at ||
              new Date().toISOString(),
            invoice_date:
              serverInvoiceData.invoice_date ||
              createdInvoiceData.invoice_date ||
              serverInvoiceData.created_at ||
              new Date().toISOString(),
            hasStockPermission: hasStockPermission,
          };

          return mergedInvoiceData;
        }

        return serverInvoiceData;
      } catch (error) {
        console.error("❌ Error fetching complete invoice data:", error);
        return null;
      }
    },
    [createdInvoiceData, currentUserId, hasStockPermission],
  );

  // Helper function to enrich invoice data with customer and store details for printing
  const enrichInvoiceForPrint = useCallback(
    async (invoice) => {
      try {
        let customerData = {};
        let storeData = {};

        if (invoice.customer_id) {
          try {
            const customerResponse = await customerAPI.getById(
              invoice.customer_id,
            );
            customerData = customerResponse.data?.data || {};
          } catch (error) {
            console.error("Failed to fetch customer data for print:", error);
          }
        }

        if (invoice.store_id) {
          try {
            const storeResponse = await storeAPI.getByUserId(
              invoice.user_id || currentUserId,
            );
            const storesArray =
              storeResponse.data?.data?.data || storeResponse.data?.data || [];
            storeData =
              storesArray.find((store) => store.id === invoice.store_id) ||
              storesArray[0] ||
              {};
          } catch (error) {
            console.error("Failed to fetch store data for print:", error);
          }
        }

        // console.log("chekcing the iiner enrich",invoice);

        const enhancedInvoice = {
          ...invoice,
          invoice_number:
            invoice.invoice_number || invoice.id || `INV-${Date.now()}`,
          id: invoice.id || invoice.invoice_id,
          customer_name:
            customerData.name || invoice.customer_name || "Walk-in Customer",
          customer_phone: customerData.phone || invoice.customer_phone || "N/A",
          customer_email: customerData.email || invoice.customer_email || "N/A",
          customer_address: customerData.address
            ? `${customerData.address}, ${customerData.city || ""}`
            : invoice.customer_address || "N/A",
          customer_gst: customerData.gst || invoice.customer_gst || "N/A",
          customer_id: invoice.customer_id,
          store_name: storeData.name || invoice.store_name || "Your Store Name",
          store_address: storeData.address
            ? `${storeData.address}, ${storeData.city || ""}`
            : invoice.store_address || "123 Business Street, City",
          store_gst: storeData.gst || invoice.store_gst || "GSTIN123456",
          store_email:
            storeData.email || invoice.store_email || "store@business.com",
          store_phone:
            storeData.mobile ||
            storeData.phone ||
            invoice.store_phone ||
            "123-456-7890",
          store_id: invoice.store_id,
          user_id: invoice.user_id || currentUserId,
          total_amount: invoice.total_amount || invoice.totalAmount || 0,
          paid_amount: invoice.paid_amount || invoice.paidAmount || 0,
          payment_mode:
            invoice.payment_mode || invoice.payment_method || "Cash",
          payment_method:
            invoice.payment_method || invoice.payment_mode || "Cash",
          payment_status: invoice.payment_status || "paid",
          items: invoice.items || [],
          packages: invoice.packages || [],
          created_at: invoice.created_at || new Date().toISOString(),
          invoice_date:
            invoice.invoice_date ||
            invoice.created_at ||
            new Date().toISOString(),
          hasStockPermission: hasStockPermission,
        };

        return enhancedInvoice;
      } catch (error) {
        console.error("Error enriching invoice for print:", error);
        return invoice;
      }
    },
    [currentUserId, hasStockPermission],
  );

  // Fetch packages
  useEffect(() => {
    if (currentUserId && !packages.length) {
      fetchPackages(currentUserId).catch((error) => {
        console.error("Failed to fetch packages:", error);
        if (error.code === "ERR_NETWORK") {
          toast.error(
            "Network error: Unable to fetch packages. Please check server connection.",
          );
        } else {
          toast.error("Failed to load packages. Please try again later.");
        }
      });
    }
  }, [currentUserId, fetchPackages, packages.length]);

  // Initial data fetch - ONLY ONCE
  useEffect(() => {
    if (currentUserId && !hasFetchedInitialData.current) {
      fetchInitialData();
    }

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [currentUserId, fetchInitialData]);

  // Filter customers based on search - MEMOIZED
  useEffect(() => {
    if (!Array.isArray(customers) || customers.length === 0) {
      setFilteredCustomers([]);
      return;
    }

    if (customerSearch.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const searchLower = customerSearch.toLowerCase();
      const filtered = customers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(searchLower) ||
          customer.phone?.toLowerCase().includes(searchLower) ||
          customer.email?.toLowerCase().includes(searchLower) ||
          customer.address?.toLowerCase().includes(searchLower) ||
          customer.gst?.toLowerCase().includes(searchLower),
      );
      setFilteredCustomers(filtered);
    }
  }, [customerSearch, customers]);

  // Filter stores based on search - MEMOIZED
  useEffect(() => {
    if (!Array.isArray(stores) || stores.length === 0) {
      setFilteredStores([]);
      return;
    }

    if (storeSearch.trim() === "") {
      setFilteredStores(stores);
    } else {
      const searchLower = storeSearch.toLowerCase();
      const filtered = stores.filter(
        (store) =>
          store.name?.toLowerCase().includes(searchLower) ||
          store.mobile?.toLowerCase().includes(searchLower) ||
          store.email?.toLowerCase().includes(searchLower) ||
          store.address?.toLowerCase().includes(searchLower) ||
          store.city?.toLowerCase().includes(searchLower) ||
          store.gst?.toLowerCase().includes(searchLower),
      );
      setFilteredStores(filtered);
    }
  }, [storeSearch, stores]);

  // Filter products based on search - MEMOIZED
  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    if (productSearch.trim() === "") {
      setFilteredProducts(products);
    } else {
      const searchLower = productSearch.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.product_name?.toLowerCase().includes(searchLower) ||
          product.sku?.toLowerCase().includes(searchLower) ||
          product.code?.toLowerCase().includes(searchLower) ||
          product.product_code?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.brand?.name?.toLowerCase().includes(searchLower) ||
          product.category?.name?.toLowerCase().includes(searchLower),
      );
      setFilteredProducts(filtered);
    }
  }, [productSearch, products]);

  // Filter packages based on search - MEMOIZED
  useEffect(() => {
    if (!Array.isArray(packages) || packages.length === 0) {
      setFilteredPackages([]);
      return;
    }

    if (packageSearch.trim() === "") {
      setFilteredPackages(packages);
    } else {
      const searchLower = packageSearch.toLowerCase();
      const filtered = packages.filter(
        (pkg) =>
          pkg.package_name?.toLowerCase().includes(searchLower) ||
          pkg.package_size?.toLowerCase().includes(searchLower) ||
          pkg.package_price?.toString().includes(searchLower),
      );
      setFilteredPackages(filtered);
    }
  }, [packageSearch, packages]);

  // Initialize search values when data is loaded
  useEffect(() => {
    if (
      Array.isArray(customers) &&
      customers.length > 0 &&
      formData.customer_id
    ) {
      const customer = customers.find((c) => c.id === formData.customer_id);
      if (customer) {
        setCustomerSearch(customer.name || customer.customer_name);
      }
    }
    if (Array.isArray(stores) && stores.length > 0 && formData.store_id) {
      const store = stores.find((s) => s.id === formData.store_id);
      if (store) {
        setStoreSearch(store.name || store.store_name);
      }
    }
  }, [customers, stores, formData.customer_id, formData.store_id]);

  const handleProductSearch = useCallback(
    async (searchTerm) => {
      setProductSearch(searchTerm);
      setShowProductList(true);
      setIsLoadingProducts(true);

      if (productSearchTimeout) {
        clearTimeout(productSearchTimeout);
      }

      const timeout = setTimeout(async () => {
        try {
          const result = await fetchProductsWithStock(searchTerm);
          console.log("Fetched products with stock:", result);
          setFilteredProducts(result.products);
          setProductPagination(result.pagination);
        } catch (error) {
          console.error("Error searching products:", error);
          setFilteredProducts([]);
        } finally {
          setIsLoadingProducts(false);
        }
      }, 500);

      setProductSearchTimeout(timeout);
    },
    [fetchProductsWithStock, productSearchTimeout],
  );
  // console.log("Filtered Products:", filteredProducts);

  const handleAddItem = useCallback(
    async (product) => {
      try {
        const existingItemIndex = formData.items.findIndex(
          (item) =>
            item.product_id === product.id &&
            (hasStockPermission ? item.stock_id === product.stock_id : true),
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...formData.items];
          const newQuantity = updatedItems[existingItemIndex].quantity + 1;
          const item = updatedItems[existingItemIndex];

          if (
            hasStockPermission &&
            product.stock_quantity > 0 &&
            newQuantity > product.stock_quantity
          ) {
            toast.error(
              `Cannot add more than available stock. Available: ${product.stock_quantity}`,
            );
            return;
          }

          updatedItems[existingItemIndex] = {
            ...item,
            quantity: newQuantity,
            item_count: newQuantity,
            total_price: calculateItemTotal(
              item.price,
              newQuantity,
              item.gst,
              item.discount,
            ),
          };

          setFormData((prev) => ({
            ...prev,
            items: updatedItems,
          }));
        } else {
          const unit = product.unit;
          const sellingPrice = product.price;
          const purchasePrice = product.purchase_price;
          const gst = product.gst_percentage;
          const discount = product.discount_percentage;
          const stockQuantity = hasStockPermission
            ? product.stock_quantity
            : null;
          const stockId = hasStockPermission ? product.stock_id : null;

          const quantity = 1;
          const totalPrice = calculateItemTotal(
            sellingPrice,
            quantity,
            gst,
            discount,
          );

          let unitName = "pcs";
          if (unit) {
            unitName = unit.short_name || unit.name || "pcs";
          }

          const newItem = {
            product_id: product.id,
            stock_id: stockId,
            product_name: product.name,
            product_code: product.sku,
            quantity: quantity,
            item_count: quantity,
            unit_id: unit?.id || null,
            unit_name: unitName,
            price: sellingPrice,
            purchase_price: purchasePrice,
            gst: gst,
            discount: discount,
            total_price: totalPrice,
            status: "completed",
            stock_quantity: stockQuantity,
            variant_info: hasStockPermission ? product.variant_info : null,
            original_gst_percentage: gst, // Store original GST percentage
            // Add attributes and variants to the item
            attributes: product.attributes || [],
            variants: product.variants || [],
          };

          setFormData((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
          }));

          setShowProductList(false);
          setProductSearch("");

          const variantText =
            hasStockPermission && product.variant_info
              ? ` (${product.variant_info})`
              : "";
          toast.success(
            `${newItem.product_name}${variantText} added to invoice`,
          );
        }
      } catch (error) {
        console.error("Failed to add item:", error);
        toast.error("Failed to add product. Please try again.");
      }
    },
    [formData.items, hasStockPermission, calculateItemTotal],
  );

  const handleUpdateItem = useCallback(
    (index, field, value) => {
      setFormData((prev) => {
        const newItems = [...prev.items];
        const item = newItems[index];

        if (field === "quantity") {
          const newQuantity = parseFloat(value) || 0;

          if (
            hasStockPermission &&
            item.stock_quantity > 0 &&
            newQuantity > item.stock_quantity
          ) {
            toast.error(
              `Cannot add more than available stock. Available: ${item.stock_quantity}`,
            );
            return prev;
          }

          item.quantity = newQuantity;
          item.item_count = newQuantity;
          item.total_price = calculateItemTotal(
            item.price,
            item.quantity,
            item.gst,
            item.discount,
          );
        } else if (field === "price") {
          const numValue = parseFloat(value) || 0;
          item.price = numValue;
          item.total_price = calculateItemTotal(
            item.price,
            item.quantity,
            item.gst,
            item.discount,
          );
        } else if (field === "gst") {
          const numValue = parseFloat(value) || 0;
          const originalGst = item.original_gst_percentage || 0;

          // If trying to reduce GST below original, show warning
          if (originalGst > 0 && numValue < originalGst) {
            toast.error(
              `⚠️ GST cannot be reduced below original GST (${originalGst}%). Current: ${numValue}%`,
              { duration: 3000 },
            );
            // Allow the user to set it, but validation will catch it on submit
          }

          item.gst = numValue;
          item.total_price = calculateItemTotal(
            item.price,
            item.quantity,
            item.gst,
            item.discount,
          );
        } else if (field === "discount") {
          const numValue = parseFloat(value) || 0;
          item.discount = numValue;
          item.total_price = calculateItemTotal(
            item.price,
            item.quantity,
            item.gst,
            item.discount,
          );
        } else {
          item[field] = value;
        }

        return { ...prev, items: newItems };
      });
    },
    [hasStockPermission, calculateItemTotal],
  );

  const handleRemoveItem = useCallback(
    (index) => {
      const removedItem = formData.items[index];
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
      toast.success(`${removedItem.product_name} removed from invoice`);
    },
    [formData.items],
  );

  const handleCreateCustomer = useCallback(
    async (customerData) => {
      try {
        let createdCustomer = customerData;

        if (createdCustomer?.data) {
          createdCustomer = createdCustomer.data;
        }

        if (!createdCustomer || !createdCustomer.id) {
          console.error("Invalid customer data received:", createdCustomer);
          toast.error("Customer created but data is incomplete");

          try {
            const refreshResponse = await customerAPI.getAll(currentUserId, "");
            let customersList = [];
            if (
              refreshResponse?.data?.data?.data &&
              Array.isArray(refreshResponse.data.data.data)
            ) {
              customersList = refreshResponse.data.data.data;
            } else if (
              refreshResponse?.data?.data &&
              Array.isArray(refreshResponse.data.data)
            ) {
              customersList = refreshResponse.data.data;
            } else if (Array.isArray(refreshResponse?.data)) {
              customersList = refreshResponse.data;
            }

            const newCustomer = customersList.find(
              (c) => c.phone === createdCustomer.phone,
            );
            if (newCustomer) {
              createdCustomer = newCustomer;
            }
          } catch (refreshError) {
            console.error("Failed to refresh customers:", refreshError);
          }

          if (!createdCustomer || !createdCustomer.id) {
            return;
          }
        }

        setCustomers((prev) => {
          const existingCustomers = Array.isArray(prev) ? prev : [];
          const exists = existingCustomers.some(
            (c) => c.id === createdCustomer.id,
          );
          if (!exists) {
            return [createdCustomer, ...existingCustomers];
          }
          return existingCustomers;
        });

        setFormData((prev) => ({
          ...prev,
          customer_id: createdCustomer.id,
        }));

        setCustomerSearch(createdCustomer.name || createdCustomer.phone);

        toast.success(
          `Customer ${createdCustomer.name} created and selected successfully`,
        );
        setShowAddCustomerModal(false);
      } catch (err) {
        console.error("Customer creation error:", err);
        toast.error("Failed to create customer");
      }
    },
    [currentUserId],
  );

  const handleCreateStore = useCallback(
    async (storeData) => {
      try {
        await fetchInitialData();

        try {
          const response = await invoiceAPI.getBillGenerateData(currentUserId);
          let updatedData = response.data?.data || response.data || {};
          const updatedStoresList =
            updatedData.stores ||
            updatedData.bill_store ||
            updatedData.store ||
            [];
          setStores(Array.isArray(updatedStoresList) ? updatedStoresList : []);

          const newStore = updatedStoresList.find(
            (s) => s.name === storeData.name || s.name === storeData.data?.name,
          );

          if (newStore) {
            setFormData((prev) => ({
              ...prev,
              store_id: newStore.id,
            }));
            setStoreSearch(newStore.name || newStore.store_name);
            toast.success("Store created and selected successfully");
          } else {
            let storeInfo, storeName, storeId;

            if (storeData.data) {
              storeInfo = storeData.data;
            } else if (storeData.id && storeData.name) {
              storeInfo = storeData;
            } else {
              console.error("Unexpected store response structure:", storeData);
              toast.error("Store created but with unexpected response format");
              return;
            }

            storeName = storeInfo.name || storeInfo.store_name || "New Store";
            storeId = storeInfo.id;

            setFormData((prev) => ({
              ...prev,
              store_id: storeId,
            }));
            setStoreSearch(storeName);
            toast.success("Store created successfully");
          }
        } catch (error) {
          console.error("Failed to refresh store list:", error);
          let storeInfo, storeName, storeId;

          if (storeData.data) {
            storeInfo = storeData.data;
          } else if (storeData.id && storeData.name) {
            storeInfo = storeData;
          } else {
            console.error("Unexpected store response structure:", storeData);
            toast.error("Store created but with unexpected response format");
            return;
          }

          storeName = storeInfo.name || storeInfo.store_name || "New Store";
          storeId = storeInfo.id;

          setFormData((prev) => ({ ...prev, store_id: storeId }));
          setStoreSearch(storeName);
          toast.success("Store created successfully");
        }

        setShowAddStoreModal(false);
      } catch (err) {
        console.error("Store creation error:", err);
        toast.error("Failed to create store");
      }
    },
    [fetchInitialData, currentUserId],
  );

  const handleEditCustomer = useCallback((customer) => {
    setEditingCustomer(customer);
    setShowEditCustomerModal(true);
  }, []);

  const handleUpdateCustomer = useCallback(
    async (customerData) => {
      if (isUpdatingCustomer) return;

      setIsUpdatingCustomer(true);
      try {
        const response = await customerAPI.update(
          editingCustomer.id,
          customerData,
        );

        if (response.data?.status === true || response.data?.data) {
          const updatedCustomerData = response.data.data || response.data;

          const updatedCustomers = customers.map((c) =>
            c.id === editingCustomer.id
              ? { ...c, ...updatedCustomerData, ...customerData }
              : c,
          );
          setCustomers(updatedCustomers);

          setFormData((prev) => ({ ...prev, customer_id: editingCustomer.id }));
          setCustomerSearch(
            updatedCustomerData.name || customerData.name || customerData.phone,
          );

          const successMessage =
            response.data.message || "Customer updated successfully!";
          toast.success(successMessage);

          setShowEditCustomerModal(false);
          setEditingCustomer(null);
        } else {
          throw new Error("Failed to update customer");
        }
      } catch (error) {
        console.error("Customer update error:", error);
        toast.error("Failed to update customer");
      } finally {
        setIsUpdatingCustomer(false);
      }
    },
    [isUpdatingCustomer, editingCustomer, customers],
  );

  const handleEditStore = useCallback((store) => {
    setEditingStore(store);
    setShowEditStoreModal(true);
  }, []);

  const handleUpdateStore = useCallback(
    async (storeData) => {
      setIsUpdatingStore(true);
      try {
        const response = await storeAPI.update(editingStore.id, storeData);

        if (response.data?.status === true || response.data?.data) {
          const updatedStoreData = response.data.data || response.data;

          const updatedStores = stores.map((s) =>
            s.id === editingStore.id
              ? { ...s, ...updatedStoreData, ...storeData }
              : s,
          );
          setStores(updatedStores);

          setFormData((prev) => ({ ...prev, store_id: editingStore.id }));
          setStoreSearch(updatedStoreData.name || storeData.name);

          const successMessage =
            response.data.message || "Store updated successfully!";
          toast.success(successMessage);

          setShowEditStoreModal(false);
          setEditingStore(null);
        } else {
          throw new Error("Failed to update store");
        }
      } catch (error) {
        console.error("Store update error:", error);
        toast.error("Failed to update store");
      } finally {
        setIsUpdatingStore(false);
      }
    },
    [isUpdatingStore, editingStore, stores],
  );

  const handlePackageSelect = useCallback((pkg) => {
    setSelectedPackage(pkg);
    setPackageSearch(pkg.package_name);
    setShowPackageDropdown(false);
    setPackageQuantity(1);
  }, []);

  const handleAddPackageToInvoice = useCallback(() => {
    if (!selectedPackage || packageQuantity <= 0) {
      toast.error("Please select a package and enter a valid quantity");
      return;
    }

    const packageItem = {
      product_id: selectedPackage.id,
      product_name: selectedPackage.package_name,
      product_code: `PKG-${selectedPackage.id}`,
      quantity: packageQuantity,
      item_count: packageQuantity,
      unit_id: null,
      unit_name: selectedPackage.package_size || "Package",
      price: parseFloat(selectedPackage.package_price) || 0,
      gst: 0,
      discount: 0,
      total_price:
        (parseFloat(selectedPackage.package_price) || 0) * packageQuantity,
      status: "completed",
      stock_quantity: 0,
      stock_id: null,
      is_package: true,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, packageItem],
    }));

    setSelectedPackage(null);
    setPackageSearch("");
    setPackageQuantity(1);

    toast.success(
      `Package added: ${packageItem.product_name} x${packageItem.quantity}`,
    );
  }, [selectedPackage, packageQuantity]);

  const calculateTotals = useCallback(() => {
    const productItems = formData.items.filter((item) => !item.is_package);
    const packageItems = formData.items.filter((item) => item.is_package);

    const productSubtotal = productItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const productDiscount = productItems.reduce((sum, item) => {
      const basePrice = item.price * item.quantity;
      return sum + basePrice * (item.discount / 100);
    }, 0);
    const productGst = productItems.reduce((sum, item) => {
      const basePrice = item.price * item.quantity;
      const discountedPrice = basePrice - basePrice * (item.discount / 100);
      return sum + discountedPrice * (item.gst / 100);
    }, 0);

    const packageTotal = packageItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const subtotal = productSubtotal;
    const totalDiscount = productDiscount;
    const totalGst = productGst;
    const totalAmount =
      productSubtotal - productDiscount + productGst + packageTotal;

    return { subtotal, totalGst, totalDiscount, totalAmount };
  }, [formData.items]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !formData.customer_id ||
        !formData.store_id ||
        formData.items.length === 0
      ) {
        toast.error(
          "Please fill all required fields and add at least one item",
        );
        return;
      }

      if (hasStockPermission) {
        const stockIssues = formData.items.filter(
          (item) =>
            item.stock_quantity > 0 && item.quantity > item.stock_quantity,
        );

        if (stockIssues.length > 0) {
          toast.error(
            `Cannot proceed. ${stockIssues.length} item(s) exceed available stock. Please adjust quantities.`,
          );
          return;
        }
      }

      // NEW: Check for price less than purchase price
      const priceIssues = formData.items.filter((item) => {
        // Only check for non-package items
        if (item.is_package) return false;

        const purchasePrice = item.purchase_price || 0;
        const sellingPrice = item.price || 0;

        // If purchase price exists and selling price is less than purchase price
        return purchasePrice > 0 && sellingPrice < purchasePrice;
      });

      if (priceIssues.length > 0) {
        const issueMessages = priceIssues.map(
          (item) =>
            `${item.product_name}: ₹${item.price.toFixed(2)} < ₹${(item.purchase_price || 0).toFixed(2)}`,
        );

        toast.error(
          `❌ Cannot generate invoice. ${priceIssues.length} item(s) have price below purchase price:\n${issueMessages.join("\n")}`,
          { duration: 5000 },
        );
        return;
      }

      const totals = calculateTotals();

      if (formData.payment_status === "semi_paid") {
        if (!formData.payment_amount || formData.payment_amount <= 0) {
          toast.error(
            "Please enter a valid payment amount for semi-paid option",
          );
          return;
        }
      }

      if (!formData.payment_method) {
        toast.error("Please select a payment method");
        return;
      }

      // NEW: Check for GST reduction below actual GST
      const gstIssues = formData.items
        .filter((item) => !item.is_package)
        .filter((item) => {
          // Get the original/product GST percentage
          const originalGst = item.original_gst_percentage || 0;
          const currentGst = parseFloat(item.gst) || 0;

          // If original GST exists and current GST is less than original GST
          return originalGst > 0 && currentGst < originalGst;
        });

      if (gstIssues.length > 0) {
        const issueMessages = gstIssues.map(
          (item) =>
            `${item.product_name}: ${item.gst}% < ${item.original_gst_percentage || 0}%`,
        );

        toast.error(
          `❌ Cannot generate invoice. ${gstIssues.length} item(s) have GST below the original GST percentage:\n${issueMessages.join("\n")}`,
          { duration: 5000 },
        );
        return;
      }

      const productItems = formData.items.filter((item) => !item.is_package);
      const packageItems = formData.items.filter((item) => item.is_package);

      const packagesData = packageItems.map((item) => ({
        package_id: item.product_id,
        package_name: item.product_name,
        package_price: item.price,
        package_size: item.unit_name,
        quantity: item.quantity,
      }));

      const submissionData = {
        ...formData,
        items: productItems,
        packages: packagesData,
        paid_amount:
          formData.payment_status === "paid"
            ? totals.totalAmount.toString()
            : formData.payment_status === "semi_paid"
              ? formData.payment_amount.toString()
              : "0",
        total_amount: totals.totalAmount.toString(),
      };

      setIsSubmittingBill(true);
      try {
        const response = await onSubmit(submissionData);

        if (response?.success === true || response?.status === true) {
          const apiInvoiceData = response?.data || {};
          const createdInvoice = {
            ...apiInvoiceData,
            items: submissionData.items || [],
            packages: submissionData.packages || [],
            id: apiInvoiceData.id || apiInvoiceData.invoice_id,
            invoice_number:
              apiInvoiceData.invoice_id ||
              apiInvoiceData.invoice_number ||
              `INV-${Date.now()}`,
            total_amount:
              apiInvoiceData.total_amount || submissionData.total_amount,
            created_at: apiInvoiceData.created_at || new Date().toISOString(),
            payment_method: formData.payment_method,
            hasStockPermission: hasStockPermission,
          };
          setCreatedInvoiceData(createdInvoice);
          setGeneratedBillData(submissionData);
          setShowBillDialog(true);
        } else {
          toast.error(
            response?.message ||
              "Failed to generate invoice. Please try again.",
          );
        }
      } catch (error) {
        console.error("Error generating invoice:", error);
        toast.error("Failed to generate invoice. Please try again.");
      } finally {
        setIsSubmittingBill(false);
      }
    },
    [formData, hasStockPermission, calculateTotals, onSubmit],
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target)
      ) {
        setShowProductList(false);
      }
    };

    if (showProductList) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProductList]);

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 sticky top-[62px] bg-white z-50 pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <FiShoppingCart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generate New Invoice
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create invoice{" "}
                {hasStockPermission
                  ? "with stock management"
                  : "without stock tracking"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              icon={FiX}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FiSave}
              loading={isSubmitting}
              disabled={formData.items.length === 0 || dataFetchError}
            >
              Generate Invoice
            </Button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}

        {dataFetchError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-yellow-700 dark:text-yellow-300"
          >
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              <span>
                Unable to load data from server. Please check your backend
                connection.
              </span>
            </div>
          </motion.div>
        )}

        {hasStockPermission &&
          formData.items.some(
            (item) =>
              item.stock_quantity > 0 && item.quantity > item.stock_quantity,
          ) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-yellow-700 dark:text-yellow-300"
            >
              <div className="flex items-center">
                <FiAlertCircle className="w-5 h-5 mr-2" />
                <span>
                  Some items exceed available stock. Please adjust quantities.
                </span>
              </div>
            </motion.div>
          )}

        {!hasStockPermission && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-blue-700 dark:text-blue-300"
          >
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              <span>
                Stock management is disabled for your account. You can create
                invoices without stock tracking.
              </span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                Customer Information
              </h3>

              <div className="space-y-4">
                <SearchSelect
                  label="Select Customer"
                  options={
                    Array.isArray(customers) && customers.length > 0
                      ? customers.map((customer) => ({
                          value: customer.id,
                          label:
                            customer.name ||
                            customer.customer_name ||
                            `Customer ${customer.id}`,
                          description:
                            customer.phone || customer.email
                              ? `📞 ${customer.phone || "N/A"} | 📧 ${customer.email || "N/A"}`
                              : null,
                          subtext: customer.gst ? `GST: ${customer.gst}` : null,
                          rightContent: (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCustomer(customer);
                              }}
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                              title="Edit customer"
                            >
                              <FiEdit className="w-3.5 h-3.5" />
                            </button>
                          ),
                        }))
                      : []
                  }
                  value={formData.customer_id || ""}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, customer_id: value }));
                    const customer = customers.find((c) => c.id === value);
                    if (customer) {
                      toast.success(
                        `Customer selected: ${customer.name || customer.customer_name}`,
                      );
                    }
                  }}
                  placeholder="Search customer by name, phone, email..."
                  required
                  disabled={dataFetchError}
                  onCreateNew={(searchTerm) => {
                    const isPhoneNumber = /^\d[\d\s-]*$/.test(
                      searchTerm.trim(),
                    );

                    if (isPhoneNumber) {
                      setNewCustomerData((prev) => ({
                        ...prev,
                        phone: searchTerm.trim(),
                        name: "",
                      }));
                    } else {
                      setNewCustomerData((prev) => ({
                        ...prev,
                        name: searchTerm.trim(),
                        phone: "",
                      }));
                    }
                    setShowAddCustomerModal(true);
                  }}
                />

                <SearchSelect
                  label="Select Store"
                  options={
                    stores?.map((store) => ({
                      value: store.id,
                      label: store.name || store.store_name,
                      description:
                        store.mobile || store.phone || store.email
                          ? `📞 ${store.mobile || store.phone || "N/A"} | 📧 ${store.email || "N/A"}`
                          : null,
                      subtext:
                        store.address && store.city
                          ? `📍 ${store.address}, ${store.city}`
                          : null,
                      rightContent: (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStore(store);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200"
                          title="Edit store"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                        </button>
                      ),
                    })) || []
                  }
                  value={formData.store_id || ""}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, store_id: value }));
                    const store = stores.find((s) => s.id === value);
                    if (store) {
                      toast.success(
                        `Store selected: ${store.name || store.store_name}`,
                      );
                    }
                  }}
                  placeholder="Search store by name, phone, email..."
                  required
                  disabled={dataFetchError}
                  onCreateNew={(searchTerm) => {
                    if (stores.length > 0) {
                      toast.error(
                        "You already have a store. You can only have one store.",
                      );
                      return;
                    }

                    const isPhoneNumber = /^\d[\d\s-]*$/.test(
                      searchTerm.trim(),
                    );

                    if (isPhoneNumber) {
                      setNewStoreData((prev) => ({
                        ...prev,
                        mobile: searchTerm.trim(),
                        name: "",
                      }));
                    } else {
                      setNewStoreData((prev) => ({
                        ...prev,
                        name: searchTerm.trim(),
                        mobile: "",
                      }));
                    }
                    setShowAddStoreModal(true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <FiPackage className="w-4 h-4 mr-2" />
                Add Packages
              </h3>

              <div className="space-y-4">
                <div className="relative package-dropdown">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Packages
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search packages by name, size, price..."
                      value={packageSearch}
                      onChange={(e) => setPackageSearch(e.target.value)}
                      onFocus={() => setShowPackageDropdown(true)}
                      className="pl-10"
                      disabled={dataFetchError}
                    />
                  </div>

                  {showPackageDropdown && !dataFetchError && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPackages.length > 0 ? (
                        filteredPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            onClick={() => handlePackageSelect(pkg)}
                            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {pkg.package_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Size: {pkg.package_size || "Standard"}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-semibold text-gray-900 dark:text-white flex justify-center items-center">
                                  <FaRupeeSign className="mt-2 text-[13px] mb-[4px] me-[2px]" />
                                  {parseFloat(pkg.package_price || 0).toFixed(
                                    2,
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                          No packages found
                        </div>
                      )}
                    </div>
                  )}

                  {dataFetchError && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Unable to load packages. Please check server connection.
                    </div>
                  )}
                </div>

                {selectedPackage && !dataFetchError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {selectedPackage.package_name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Size: {selectedPackage.package_size || "Standard"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400 flex gap-1 justify-end items-center">
                          <FaRupeeSign className="text-[15px]" />
                          {parseFloat(
                            selectedPackage.package_price || 0,
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quantity:
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={packageQuantity}
                          onChange={(e) =>
                            setPackageQuantity(parseInt(e.target.value) || 1)
                          }
                          className="w-20"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddPackageToInvoice}
                        disabled={packageQuantity <= 0}
                      >
                        <FiPlus className="w-4 h-4" />
                        Add to Invoice
                      </Button>
                    </div>
                  </motion.div>
                )}

                {packagesLoading && !dataFetchError && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <FiPackage className="w-4 h-4 mr-2" />
                Add Products
              </h3>

              <div className="space-y-4">
                <div
                  className="relative product-dropdown"
                  ref={productDropdownRef}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Products
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products by name, SKU, brand, category..."
                      value={productSearch}
                      onChange={(e) => handleProductSearch(e.target.value)}
                      onFocus={() => {
                        if (filteredProducts.length === 0) {
                          handleProductSearch(productSearch);
                        }
                        setShowProductList(true);
                      }}
                      className="pl-10"
                      disabled={dataFetchError}
                    />
                    {isLoadingProducts && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {showProductList &&
                      (productSearch || filteredProducts.length > 0) &&
                      !dataFetchError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-96 overflow-y-auto"
                        >
                          {/* Dropdown content remains the same */}
                          {filteredProducts.length > 0 ? (
                            <>
                              {filteredProducts.map((product, idx) => (
                                <div
                                  key={`${product.id}-${product.stock_id || idx}`}
                                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  onClick={() => handleAddItem(product)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      {/* Product Name */}
                                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                                        {product.name}
                                        {hasStockPermission &&
                                          product.variant_info && (
                                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                              ({product.variant_info})
                                            </span>
                                          )}
                                      </div>

                                      {/* SKU */}
                                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        📦 SKU: {product.sku || "N/A"}
                                      </div>

                                      {/* Brand and Category */}
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {product.brand?.name && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                            🏷️ {product.brand.name}
                                          </span>
                                        )}
                                        {product.category?.name && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                            📂 {product.category.name}
                                          </span>
                                        )}
                                        {product.unit?.name && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                            📦 Unit: {product.unit.name}
                                          </span>
                                        )}
                                      </div>

                                      {/* Product Attributes */}
                                      {product.attributes &&
                                        Array.isArray(product.attributes) &&
                                        product.attributes.length > 0 && (
                                          <div className="mb-2">
                                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                              ✨ Attributes:
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                              {product.attributes.map(
                                                (attr, attrIdx) => {
                                                  if (
                                                    typeof attr === "object" &&
                                                    attr !== null
                                                  ) {
                                                    return Object.entries(
                                                      attr,
                                                    ).map(([key, value]) => (
                                                      <span
                                                        key={`${attrIdx}-${key}`}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                                      >
                                                        {key}: {value}
                                                      </span>
                                                    ));
                                                  }
                                                  return (
                                                    <span
                                                      key={attrIdx}
                                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                                    >
                                                      {attr}
                                                    </span>
                                                  );
                                                },
                                              )}
                                            </div>
                                          </div>
                                        )}

                                      {/* Product Variants */}
                                      {product.variants &&
                                        Array.isArray(product.variants) &&
                                        product.variants.length > 0 && (
                                          <div className="mb-2">
                                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                              🎨 Variants:
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                              {product.variants
                                                .slice(0, 3)
                                                .map((variant, variantIdx) => {
                                                  const variantValues = [];
                                                  if (variant.size)
                                                    variantValues.push(
                                                      `Size: ${variant.size}`,
                                                    );
                                                  if (variant.color)
                                                    variantValues.push(
                                                      `Color: ${variant.color}`,
                                                    );
                                                  if (variant.material)
                                                    variantValues.push(
                                                      `Material: ${variant.material}`,
                                                    );
                                                  if (variant.gender)
                                                    variantValues.push(
                                                      `Gender: ${variant.gender}`,
                                                    );

                                                  return variantValues.map(
                                                    (val, valIdx) => (
                                                      <span
                                                        key={`${variantIdx}-${valIdx}`}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                                      >
                                                        {val}
                                                      </span>
                                                    ),
                                                  );
                                                })}
                                              {product.variants.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                  +{product.variants.length - 3}{" "}
                                                  more
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        )}

                                      {/* Stock Status */}
                                      {hasStockPermission && (
                                        <div
                                          className={`text-xs font-medium mt-1 ${product.stock_quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                        >
                                          📊 Stock Available:{" "}
                                          {product.stock_quantity > 0
                                            ? product.stock_quantity
                                            : "Out of Stock"}
                                        </div>
                                      )}
                                    </div>

                                    <div className="text-right ml-4">
                                      <div className="font-semibold text-gray-900 dark:text-white flex justify-end items-center">
                                        <FaRupeeSign className="text-[13px] me-[2px]" />
                                        {product.price.toFixed(2)}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                                        {hasStockPermission && product.stock_id ? (
                                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                            📦 Stock Price
                                          </div>
                                        ) : (
                                          <div className="text-xs text-gray-500 dark:text-gray-400">
                                            🏷️ Product Price
                                          </div>
                                        )}
                                        {product.gst_percentage > 0 && (
                                          <div>
                                            GST:{" "}
                                            {product.gst_percentage.toFixed(1)}%
                                            {hasStockPermission && product.stock_id && (
                                              <span className="text-blue-600 dark:text-blue-400 ml-1">
                                                (Stock)
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        {product.discount_percentage > 0 && (
                                          <div>
                                            Discount:{" "}
                                            {product.discount_percentage.toFixed(
                                              1,
                                            )}
                                            %
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              {isLoadingProducts ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                                  <span>Searching products...</span>
                                </div>
                              ) : (
                                "No products found"
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                  </AnimatePresence>

                  {dataFetchError && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      Unable to load products. Please check server connection.
                    </div>
                  )}
                </div>

                {formData.items.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Added Items ({formData.items.length})
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <FiShoppingCart className="w-4 h-4 mr-2" />
              Invoice Items ({formData.items.length})
            </h3>
          </div>

          {formData.items.length === 0 ? (
            <EmptyState
              icon={FiPackage}
              title="No items added"
              description="Search and add products to create your invoice"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 pb-3">
                      Product
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">
                      Qty
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">
                      Price
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">
                      GST %
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">
                      Discount %
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[100px]">
                      Total
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-3 w-[60px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <td className="py-3">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.product_name}
                            {hasStockPermission && item.variant_info && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                ({item.variant_info})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.product_code}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {item.unit_name}
                          </p>

                          {/* Display attributes in table */}
                          {item.attributes &&
                            Array.isArray(item.attributes) &&
                            item.attributes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.attributes.map((attr, attrIdx) => {
                                  if (
                                    typeof attr === "object" &&
                                    attr !== null
                                  ) {
                                    return Object.entries(attr).map(
                                      ([key, value]) => (
                                        <span
                                          key={`${attrIdx}-${key}`}
                                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                        >
                                          {key}: {value}
                                        </span>
                                      ),
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            )}

                          {/* Display variants in table */}
                          {item.variants &&
                            Array.isArray(item.variants) &&
                            item.variants.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.variants
                                  .slice(0, 2)
                                  .map((variant, variantIdx) => {
                                    const variantValues = [];
                                    if (variant.size)
                                      variantValues.push(
                                        `Size: ${variant.size}`,
                                      );
                                    if (variant.color)
                                      variantValues.push(
                                        `Color: ${variant.color}`,
                                      );
                                    if (variant.material)
                                      variantValues.push(
                                        `Material: ${variant.material}`,
                                      );
                                    if (variant.gender)
                                      variantValues.push(
                                        `Gender: ${variant.gender}`,
                                      );

                                    return variantValues.map((val, valIdx) => (
                                      <span
                                        key={`${variantIdx}-${valIdx}`}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                                      >
                                        {val}
                                      </span>
                                    ));
                                  })}
                                {item.variants.length > 2 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                    +{item.variants.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}

                          {hasStockPermission &&
                            item.stock_quantity !== undefined &&
                            (item.stock_quantity > 0 ? (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Stock: {item.stock_quantity}
                              </p>
                            ) : (
                              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                Please Add Stock
                              </p>
                            ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementQuantity(index)}
                            disabled={parseFloat(item.quantity) <= 1}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="text"
                            value={item.quantity.toString()}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "quantity",
                                e.target.value,
                              )
                            }
                            className={`min-w-[5.5rem] text-sm text-center ${hasStockPermission && item.stock_quantity > 0 && item.quantity > item.stock_quantity ? "border-red-500 bg-red-50" : ""}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrementQuantity(index)}
                            disabled={
                              hasStockPermission &&
                              item.stock_quantity > 0 &&
                              parseFloat(item.quantity) >= item.stock_quantity
                            }
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price.toString()}
                            onChange={(e) =>
                              handleUpdateItem(index, "price", e.target.value)
                            }
                            className="w-20 text-sm text-center"
                          />
                        </div>
                      </td>
                      <td className="py-3 relative">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementGst(index)}
                            disabled={parseFloat(item.gst) <= 0}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.gst.toString()}
                            onChange={(e) =>
                              handleUpdateItem(index, "gst", e.target.value)
                            }
                            className={`min-w-[5.5rem] text-sm text-center ${
                              item.original_gst_percentage > 0 &&
                              parseFloat(item.gst) <
                                item.original_gst_percentage
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrementGst(index)}
                            disabled={parseFloat(item.gst) >= 100}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                        {item.original_gst_percentage > 0 &&
                          parseFloat(item.gst) <
                            item.original_gst_percentage && (
                          
                             <div className="w-full absolute  flex justify-center items-center bottom-[10px]">
                              <p className="text-xs text-red-600 dark:text-red-400 text-center mt-1">
                               GST ({item.original_gst_percentage}
                              %)
                            </p>
                             </div>
                        
                          )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementDiscount(index)}
                            disabled={parseFloat(item.discount) <= 0}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.discount.toString()}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "discount",
                                e.target.value,
                              )
                            }
                            className="min-w-[5.5rem] text-sm text-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrementDiscount(index)}
                            disabled={parseFloat(item.discount) >= 100}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <Input
                            type="number"
                            value={item.total_price.toFixed(2)}
                            readOnly
                            className="w-20 text-sm text-center bg-gray-50 dark:bg-gray-500 font-semibold"
                          />
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment Options Section */}
        {formData.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              Payment Options & Invoice Summary
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="mt-4">
                  <Select
                    label="Payment Method"
                    options={[
                      { value: "Non Paid", label: "Non Paid" },
                      { value: "cash", label: "Cash" },
                      { value: "card", label: "Card" },
                      { value: "upi", label: "UPI" },
                      { value: "bank_transfer", label: "Bank Transfer" },
                      { value: "cheque", label: "Cheque" },
                    ]}
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payment_method: e.target.value,
                      }))
                    }
                    required
                    disabled={
                      dataFetchError || formData.payment_status === "non_paid"
                    }
                  />
                </div>
                <div>
                  <Select
                    label="Payment Status"
                    options={[
                      { value: "paid", label: "Full Paid" },
                      { value: "semi_paid", label: "Semi Paid" },
                      { value: "non_paid", label: "Non Paid" },
                    ]}
                    value={formData.payment_status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      let newPaymentMethod = formData.payment_method;

                      if (newStatus === "non_paid") {
                        newPaymentMethod = "Non Paid";
                      } else if (
                        newStatus === "semi_paid" ||
                        newStatus === "paid"
                      ) {
                        // Default to cash for paid/semi-paid, but keep existing if it was already set
                        if (formData.payment_method === "Non Paid") {
                          newPaymentMethod = "cash";
                        } else {
                          newPaymentMethod = formData.payment_method || "cash";
                        }
                      }

                      setFormData((prev) => ({
                        ...prev,
                        payment_status: newStatus,
                        payment_amount:
                          newStatus === "semi_paid" ? prev.payment_amount : 0,
                        payment_method: newPaymentMethod,
                      }));
                    }}
                    required
                    disabled={dataFetchError}
                  />
                </div>

                {formData.payment_status === "semi_paid" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Input
                      label="Payment Amount"
                      type="text"
                      step="0.01"
                      placeholder="Enter payment amount"
                      value={formData.payment_amount}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^\d.]/g, "");
                        const decimalCount = (value.match(/\./g) || []).length;
                        if (decimalCount > 1) return;

                        const numValue = parseFloat(value);

                        if (!isNaN(numValue) && numValue > totals.totalAmount) {
                          const finalAmount = totals.totalAmount.toFixed(2);
                          setFormData((prev) => ({
                            ...prev,
                            payment_amount: finalAmount,
                          }));
                          toast.error(
                            `Payment amount cannot exceed total amount. Set to maximum: ₹${finalAmount}`,
                          );
                          return;
                        }

                        setFormData((prev) => ({
                          ...prev,
                          payment_amount: value,
                        }));
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "-" ||
                          e.key === "+"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        let value = e.target.value;
                        if (value && !isNaN(parseFloat(value))) {
                          const numValue = parseFloat(value);
                          if (numValue > totals.totalAmount) {
                            setFormData((prev) => ({
                              ...prev,
                              payment_amount: totals.totalAmount.toFixed(2),
                            }));
                            toast.error(
                              `Payment amount adjusted to maximum: ₹${totals.totalAmount.toFixed(2)}`,
                            );
                          } else if (numValue < 0) {
                            setFormData((prev) => ({
                              ...prev,
                              payment_amount: "0",
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              payment_amount: numValue.toFixed(2),
                            }));
                          }
                        } else if (value === "") {
                          setFormData((prev) => ({
                            ...prev,
                            payment_amount: "0",
                          }));
                        }
                      }}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Remaining amount: ₹
                        {(
                          totals.totalAmount -
                          (parseFloat(formData.payment_amount) || 0)
                        ).toFixed(2)}
                      </p>
                      {(parseFloat(formData.payment_amount) || 0) >
                        totals.totalAmount && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Amount exceeds total!
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-600 rounded-lg p-4 border border-gray-200 dark:border-gray-500">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Invoice Breakdown
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Subtotal:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{totals.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {totals.totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Discount:
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          -₹{totals.totalDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        GST:
                      </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        +₹{totals.totalGst.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-500">
                      <span className="text-gray-900 dark:text-white">
                        Total Amount:
                      </span>
                      <span className="text-primary-600 dark:text-primary-400">
                        ₹{totals.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Status:{" "}
                    <span className="capitalize">
                      {formData.payment_status.replace("_", " ")}
                    </span>
                  </p>
                  {formData.payment_status === "paid" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Full payment of ₹{totals.totalAmount.toFixed(2)}
                    </p>
                  )}
                  {formData.payment_status === "semi_paid" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Partial payment of ₹
                      {parseFloat(formData.payment_amount || 0).toFixed(2)} / ₹
                      {totals.totalAmount.toFixed(2)}
                    </p>
                  )}
                  {formData.payment_status === "non_paid" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No payment received
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ₹
                    {formData.payment_status === "paid"
                      ? totals.totalAmount.toFixed(2)
                      : formData.payment_status === "semi_paid"
                        ? parseFloat(formData.payment_amount || 0).toFixed(2)
                        : "0.00"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paid Amount
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.form>

      {/* Add Customer Modal */}
      <CustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => {
          setShowAddCustomerModal(false);
          setNewCustomerData({
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            gst: "",
          });
        }}
        onCustomerCreated={handleCreateCustomer}
        initialData={newCustomerData}
      />

      {/* Edit Customer Modal */}
      <CustomerModal
        isOpen={showEditCustomerModal}
        onClose={() => {
          setShowEditCustomerModal(false);
          setEditingCustomer(null);
        }}
        onCustomerCreated={handleUpdateCustomer}
        initialData={editingCustomer || {}}
      />

      {/* Add Store Modal */}
      <StoreModal
        isOpen={showAddStoreModal && stores.length === 0}
        onClose={() => {
          setShowAddStoreModal(false);
          setNewStoreData({
            name: "",
            email: "",
            mobile: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            gst: "",
          });
        }}
        onStoreCreated={handleCreateStore}
        initialData={newStoreData}
        mode="create"
        isSubmitting={isCreatingStore}
      />

      {/* Edit Store Modal */}
      <StoreModal
        isOpen={showEditStoreModal}
        onClose={() => {
          setShowEditStoreModal(false);
          setEditingStore(null);
        }}
        onStoreCreated={handleUpdateStore}
        initialData={editingStore || {}}
      />

      {/* Bill Generation Dialog */}
      <AnimatePresence>
        {showBillDialog && generatedBillData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBillDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Invoice Generated Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your invoice has been generated. What would you like to do
                  next?
                </p>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={async () => {
                      try {
                        const completeInvoiceData =
                          await fetchCompleteInvoiceData(
                            createdInvoiceData?.id,
                          );
                        if (!completeInvoiceData) {
                          const enrichedInvoice =
                            await enrichInvoiceForPrint(createdInvoiceData);
                          // console.log("checking the enriched invoice",enrichedInvoice )
                          printA4Invoice(enrichedInvoice);
                        } else {
                          console.log(
                            "checking the complete invoice",
                            completeInvoiceData,
                          );
                          printA4Invoice(completeInvoiceData);
                        }
                        setShowBillDialog(false);
                        toast.success(
                          "Invoice generated and printed successfully",
                        );
                        if (onSuccess) onSuccess();
                      } catch (error) {
                        console.error("Error printing invoice:", error);
                        toast.error(
                          "Failed to print invoice. Please try again.",
                        );
                      }
                    }}
                    className="w-full"
                  >
                    🖨️ A4 Print
                  </Button>

                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        const completeInvoiceData =
                          await fetchCompleteInvoiceData(
                            createdInvoiceData?.id,
                          );
                        if (!completeInvoiceData) {
                          const enrichedInvoice =
                            await enrichInvoiceForPrint(createdInvoiceData);
                          printThermalInvoice(enrichedInvoice);
                        } else {
                          printThermalInvoice(completeInvoiceData);
                        }
                        setShowBillDialog(false);
                        toast.success(
                          "Invoice generated and printed successfully",
                        );
                        if (onSuccess) onSuccess();
                      } catch (error) {
                        console.error("Error printing invoice:", error);
                        toast.error(
                          "Failed to print invoice. Please try again.",
                        );
                      }
                    }}
                    className="w-full"
                  >
                    🧾 Thermal Print
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowBillDialog(false);
                      if (onSuccess) onSuccess();
                    }}
                    className="w-full"
                  >
                    Skip Print
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BillGenerateForm;
