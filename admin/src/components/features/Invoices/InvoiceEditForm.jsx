import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiUser,
  FiShoppingCart,
  FiPackage,
  FiSearch,
  FiAlertCircle,
  FiMinus,
  FiEdit,
  FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { FaRupeeSign } from "react-icons/fa";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import Select from "../../common/Select/Select";
import SearchSelect from "../../common/SearchSelect/SearchSelect";
import EmptyState from "../../common/EmptyState/EmptyState";
import CustomerModal from "./CustomerModal";
import StoreModal from "./StoreModal";
import { invoiceAPI } from "../../../services/invoiceService";
import { stockAPI } from "../../../services/stockService";
import { storeAPI } from "../../../services/storeService";
import { customerAPI } from "../../../services/customerService";
import usePackageStore from "../../../store/packageStore";
import { useAuthStore } from "../../../store/authStore";
import { apiClient } from "../../../services/apiClient";
import { productsAPI } from "../../../services/productsService";

const normalizePaymentMethod = (method) => {
  if (!method) return "Cash";
  const methodLower = method.toLowerCase();
  const methodMap = {
    cash: "Cash",
    card: "Card",
    upi: "UPI",
    "bank transfer": "Bank Transfer",
    banktransfer: "Bank Transfer",
    cheque: "Cheque",
    check: "Cheque",
  };
  return methodMap[methodLower] || "Cash";
};

const getUserId = (user) => {
  if (user?.id) return user.id;
  const authData = localStorage.getItem("auth");
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.user?.id || parsed.userId;
    } catch {
      /* ignore */
    }
  }
  return null;
};

const calculateItemTotal = (price, quantity, gst, discount) => {
  const basePrice = price * quantity;
  const discountAmount = basePrice * (discount / 100);
  const gstAmount = (basePrice - discountAmount) * (gst / 100);
  return basePrice - discountAmount + gstAmount;
};

const calculateTotalsFromLines = (lineItems) => {
  const productItems = lineItems.filter((item) => !item.is_package);
  const packageItems = lineItems.filter((item) => item.is_package);

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

  return {
    subtotal,
    totalGst,
    totalDiscount,
    totalAmount,
    packageTotal,
    productTotalAfterDiscountAndGst:
      productSubtotal - productDiscount + productGst,
  };
};

const InvoiceEditForm = ({
  invoice,
  hasStockPermission,
  onCancel,
  onSaved,
  variant = "embedded",
}) => {
  const { user } = useAuthStore();
  const {
    packages,
    fetchPackages,
    loading: packagesLoading,
  } = usePackageStore();
  const currentUserId = invoice.user_id || getUserId(user);
  const createdBy = user?.id || invoice.created_by;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataFetchError, setDataFetchError] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [deletedItemIds, setDeletedItemIds] = useState([]);

  const originalInvoiceFinancials = useRef({ total: 0, paid: 0, due: 0 });

  const [formData, setFormData] = useState({
    customer_id: "",
    store_id: "",
    payment_method: "Cash",
    payment_status: "paid",
    payment_amount: 0,
  });

  // Enhanced product search states
  const [productSearch, setProductSearch] = useState("");
  const [showProductList, setShowProductList] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearchTimeout, setProductSearchTimeout] = useState(null);
  const [productPagination, setProductPagination] = useState(null);
  const productDropdownRef = useRef(null);

  const [packageSearch, setPackageSearch] = useState("");
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageQuantity, setPackageQuantity] = useState(1);

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    gst: "",
  });

  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
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

  const initialPackageSnapshot = useRef("");

  // Fetch products with stock from API (similar to BillGenerateForm)
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
                  price: parseFloat(stock.selling_price),
                  purchase_price: parseFloat(stock.purchase_price),
                  gst_percentage: parseFloat(product.gst_percentage),
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

  // Enhanced product search handler with debouncing
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

  const refreshBillData = async () => {
    const billRes = await invoiceAPI.getBillGenerateData(currentUserId);
    const bd = billRes.data?.data || billRes.data || {};
    setStores(Array.isArray(bd.stores) ? bd.stores : []);
    setProducts(Array.isArray(bd.products) ? bd.products : []);
    setUnits(Array.isArray(bd.units) ? bd.units : []);
    return bd;
  };

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      setLoading(true);
      setDataFetchError(false);
      try {
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
        if (cancelled) return;
        setCustomers(customersList);

        const bd = await refreshBillData();
        if (cancelled) return;

        let stockList = [];
        if (hasStockPermission) {
          try {
            const sr = await stockAPI.getAll("");
            stockList = sr.data?.data?.data || sr.data?.data || [];
          } catch {
            stockList = [];
          }
        }

        await fetchPackages(currentUserId).catch(() => {});

        const rows = (invoice.invoice_items || invoice.items || []).filter(
          (row) => !row.is_package,
        );

        // Fetch product details for each item individually
        const mappedProducts = [];
        
        for (const item of rows) {
          const qty = parseFloat(item.quantity ?? item.item_count ?? 1);
          
          // Try to find product in local products first
          let product = (bd.products || []).find(
            (p) => p.id === item.product_id,
          );
          
          // If not found locally, fetch from API
          if (!product || !product.name) {
            try {
              const productResponse = await productsAPI.getById(item.product_id);
              if (productResponse.data?.status === true && productResponse.data?.data) {
                product = productResponse.data.data;
              }
            } catch (error) {
              console.error(`Failed to fetch product ${item.product_id}:`, error);
            }
          }
          
          const stock = stockList.find((s) => s.product_id === item.product_id);
          const available = parseFloat(stock?.quantity ?? 0) + qty;
          const unit = Array.isArray(bd.units)
            ? bd.units.find((u) => u.id === (item.unit_id || product?.unit_id))
            : null;
          const price = parseFloat(item.price ?? product?.selling_price ?? 0);
          const gst = parseFloat(item.gst ?? product?.gst_percentage ?? 0);
          const discount = parseFloat(
            item.discount ?? product?.discount_percentage ?? 0,
          );

          // Get product name - prioritize from fetched product
          let productName = "";
          if (product?.name) {
            productName = product.name;
          } else if (item.product_name && item.product_name !== "Product #undefined") {
            productName = item.product_name;
          } else if (item.name && item.name !== "Product #undefined") {
            productName = item.name;
          } else {
            productName = `Product #${item.product_id}`;
          }

          // Get product code
          let productCode = "";
          if (product?.sku) {
            productCode = product.sku;
          } else if (product?.code) {
            productCode = product.code;
          } else if (item.product_code) {
            productCode = item.product_code;
          } else if (item.code) {
            productCode = item.code;
          }

          // Get unit name
          let unitName = "pcs";
          if (item.unit_name) {
            unitName = item.unit_name;
          } else if (unit?.short_name) {
            unitName = unit.short_name;
          } else if (unit?.name) {
            unitName = unit.name;
          } else if (product?.unit?.short_name) {
            unitName = product.unit.short_name;
          } else if (product?.unit?.name) {
            unitName = product.unit.name;
          }

          mappedProducts.push({
            id: item.id,
            product_id: item.product_id,
            product_name: productName,
            product_code: productCode,
            quantity: qty,
            item_count: qty,
            unit_id: item.unit_id || product?.unit_id || null,
            unit_name: unitName,
            price: price,
            gst: gst,
            discount: discount,
            total_price: calculateItemTotal(price, qty, gst, discount),
            status: "completed",
            stock_quantity: hasStockPermission ? available : Infinity,
            stock_id: stock?.id ?? item.stock_id ?? null,
            is_package: false,
            variant_info: item.variant_info || null,
          });
        }

        const pkgData = invoice.packages;
        const invoicePackages = Array.isArray(pkgData)
          ? pkgData
          : pkgData
            ? [pkgData]
            : [];
        const mappedPackages = invoicePackages.map((p) => ({
          is_package: true,
          package_row_id: p.id,
          product_id: p.package_id || p.id,
          product_name: p.package_name || "Package",
          product_code: `PKG-${p.package_id || p.id}`,
          quantity: parseFloat(p.quantity || 1),
          item_count: parseFloat(p.quantity || 1),
          unit_id: null,
          unit_name: p.package_size || "Package",
          price: parseFloat(p.package_price || 0),
          gst: 0,
          discount: 0,
          total_price:
            parseFloat(p.package_price || 0) * parseFloat(p.quantity || 1),
          stock_quantity: 0,
          stock_id: null,
        }));

        initialPackageSnapshot.current = JSON.stringify(
          mappedPackages.map((m) => ({ id: m.package_row_id, q: m.quantity })),
        );

        setLineItems([...mappedProducts, ...mappedPackages]);

        const total = parseFloat(invoice.total_amount || 0);
        const paid = parseFloat(invoice.paid_amount || 0);
        originalInvoiceFinancials.current = {
          total,
          paid,
          due: Math.max(0, total - paid),
        };
        let payment_status = "paid";
        let payment_amount = paid;
        if (paid <= 0.001) payment_status = "non_paid";
        else if (paid < total - 0.01) payment_status = "semi_paid";

        setFormData({
          customer_id: invoice.customer_id || "",
          store_id: invoice.store_id || "",
          payment_method: normalizePaymentMethod(invoice.payment_method),
          payment_status,
          payment_amount,
        });
      } catch (e) {
        console.error(e);
        setDataFetchError(true);
        toast.error("Failed to load invoice edit data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [invoice.user_id, invoice.id, hasStockPermission, currentUserId]);

  // Filter packages based on search
  useEffect(() => {
    if (!Array.isArray(packages) || packages.length === 0) {
      setFilteredPackages([]);
      return;
    }
    if (!packageSearch.trim()) {
      setFilteredPackages(packages);
      return;
    }
    const q = packageSearch.toLowerCase();
    setFilteredPackages(
      packages.filter(
        (pkg) =>
          pkg.package_name?.toLowerCase().includes(q) ||
          pkg.package_size?.toLowerCase().includes(q) ||
          String(pkg.package_price || "").includes(q),
      ),
    );
  }, [packageSearch, packages]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (productSearchTimeout) {
        clearTimeout(productSearchTimeout);
      }
    };
  }, [productSearchTimeout]);

  // Click outside handler for product dropdown
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

  const totals = useMemo(
    () => calculateTotalsFromLines(lineItems),
    [lineItems],
  );

  const effectivePaidAmount = useMemo(() => {
    const t = totals.totalAmount;
    if (formData.payment_status === "paid") return t;
    if (formData.payment_status === "semi_paid") {
      const p = parseFloat(formData.payment_amount) || 0;
      return Math.min(Math.max(0, p), t);
    }
    return 0;
  }, [totals.totalAmount, formData.payment_status, formData.payment_amount]);

  const dueAfterPayment = useMemo(
    () => Math.max(0, totals.totalAmount - effectivePaidAmount),
    [totals.totalAmount, effectivePaidAmount],
  );

  useEffect(() => {
    if (formData.payment_status !== "semi_paid") return;
    const t = totals.totalAmount;
    const p = parseFloat(formData.payment_amount) || 0;
    if (p > t) {
      setFormData((prev) => ({ ...prev, payment_amount: t.toString() }));
      toast.error(`Payment amount adjusted to maximum: ₹${t.toFixed(2)}`);
    }
  }, [totals.totalAmount, formData.payment_status]);

  const handlePaymentAmountChange = (value) => {
    if (value === "") {
      setFormData((prev) => ({ ...prev, payment_amount: "" }));
      return;
    }

    let cleanedValue = value.replace(/[^0-9.]/g, "");
    const decimalCount = (cleanedValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      cleanedValue = cleanedValue.slice(0, cleanedValue.lastIndexOf("."));
    }

    let numValue = cleanedValue === "" ? 0 : parseFloat(cleanedValue);
    if (isNaN(numValue)) numValue = 0;

    const maxAmount = totals.totalAmount;
    if (numValue > maxAmount) {
      numValue = maxAmount;
      cleanedValue = numValue.toString();
      toast.error(
        `Payment amount cannot exceed total amount. Set to maximum: ₹${maxAmount.toFixed(2)}`,
      );
    }

    setFormData((prev) => ({
      ...prev,
      payment_amount: cleanedValue === "" ? "" : cleanedValue,
    }));
  };

  const getSelectedCustomerName = () => {
    const c = customers.find((x) => x.id === formData.customer_id);
    return c?.name || c?.customer_name || "";
  };

  const getSelectedStoreName = () => {
    const s = stores.find((x) => x.id === formData.store_id);
    return s?.name || s?.store_name || "";
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowEditCustomerModal(true);
  };

  const handleCustomerUpdatedFromModal = (customer) => {
    if (!customer?.id) return;
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, ...customer } : c)),
    );
    setFormData((prev) => ({ ...prev, customer_id: customer.id }));
    setShowEditCustomerModal(false);
    setEditingCustomer(null);
  };

  const handleCreateCustomer = async (customerData) => {
    let created = customerData?.data || customerData;
    if (!created?.id) {
      toast.error("Customer created but response was incomplete");
      return;
    }
    setCustomers((prev) =>
      prev.some((c) => c.id === created.id) ? prev : [created, ...prev],
    );
    setFormData((prev) => ({ ...prev, customer_id: created.id }));
    toast.success("Customer created and selected");
    setShowAddCustomerModal(false);
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setShowEditStoreModal(true);
  };

  const handleUpdateStore = async (storeData) => {
    if (!editingStore) return;
    try {
      const response = await storeAPI.update(editingStore.id, storeData);
      if (response.data?.status === true || response.data?.data) {
        const updated = response.data.data || response.data;
        setStores((prev) =>
          prev.map((s) =>
            s.id === editingStore.id ? { ...s, ...updated, ...storeData } : s,
          ),
        );
        setFormData((prev) => ({ ...prev, store_id: editingStore.id }));
        toast.success(response.data?.message || "Store updated");
        setShowEditStoreModal(false);
        setEditingStore(null);
      }
    } catch {
      toast.error("Failed to update store");
    }
  };

  const handleCreateStore = async (responsePayload) => {
    setIsCreatingStore(true);
    try {
      const info =
        responsePayload?.data?.data || responsePayload?.data || responsePayload;
      await refreshBillData();
      if (info?.id) {
        setFormData((prev) => ({ ...prev, store_id: info.id }));
        toast.success("Store created and selected");
      }
      setShowAddStoreModal(false);
    } catch {
      toast.error("Failed to refresh stores");
    } finally {
      setIsCreatingStore(false);
    }
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setPackageSearch(pkg.package_name);
    setShowPackageDropdown(false);
    setPackageQuantity(1);
  };

  const handlePackageSearchChange = (value) => {
    setPackageSearch(value);
    setShowPackageDropdown(true);
  };

  const handleAddPackageToInvoice = () => {
    if (!selectedPackage || packageQuantity <= 0) {
      toast.error("Select a package and enter quantity");
      return;
    }
    const packageItem = {
      is_package: true,
      package_row_id: null,
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
      stock_quantity: 0,
      stock_id: null,
    };
    setLineItems((prev) => [...prev, packageItem]);
    setSelectedPackage(null);
    setPackageSearch("");
    setPackageQuantity(1);
    toast.success(`Package added: ${packageItem.product_name}`);
  };

  // Enhanced handleAddItem with stock variant support
  const handleAddItem = async (product) => {
    // Check if product already exists in line items (considering stock_id for variants)
    const existingItemIndex = lineItems.findIndex(
      (item) =>
        !item.is_package &&
        item.product_id === product.id &&
        (hasStockPermission ? item.stock_id === product.stock_id : true),
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const existingItem = lineItems[existingItemIndex];
      const newQuantity = parseFloat(existingItem.quantity) + 1;

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

      setLineItems((prev) => {
        const next = [...prev];
        next[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          item_count: newQuantity,
          total_price: calculateItemTotal(
            existingItem.price,
            newQuantity,
            existingItem.gst,
            existingItem.discount,
          ),
        };
        return next;
      });

      toast.success(`Quantity updated for ${product.name}`);
      setShowProductList(false);
      return;
    }

    // Add new item
    let stockQuantity = null;
    let stockId = null;

    if (hasStockPermission) {
      stockQuantity = product.stock_quantity;
      stockId = product.stock_id;

      if (stockQuantity <= 0) {
        toast.error("No stock available for this product");
        return;
      }
    }

    const unit = product.unit;
    const sellingPrice = product.price;
    const purchasePrice = product.purchase_price;
    const gst = product.gst_percentage;
    const discount = product.discount_percentage;
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
      is_package: false,
    };

    setLineItems((prev) => [...prev, newItem]);
    setProductSearch("");
    setShowProductList(false);

    const variantText =
      hasStockPermission && product.variant_info
        ? ` (${product.variant_info})`
        : "";
    toast.success(`${newItem.product_name}${variantText} added to invoice`);
  };

  const handleUpdateItem = (index, field, value) => {
    const item = lineItems[index];
    if (item.is_package) {
      if (field === "quantity") {
        const q = parseFloat(value) || 1;
        setLineItems((prev) => {
          const next = [...prev];
          next[index] = {
            ...item,
            quantity: q,
            item_count: q,
            total_price: item.price * q,
          };
          return next;
        });
      }
      return;
    }

    setLineItems((prev) => {
      const next = [...prev];
      const row = { ...next[index] };
      if (field === "quantity") {
        const newQuantity = parseFloat(value) || 0;
        if (row.stock_quantity < Infinity && newQuantity > row.stock_quantity) {
          toast.error(`Cannot exceed stock (${row.stock_quantity})`);
          return prev;
        }
        row.quantity = newQuantity;
        row.item_count = newQuantity;
      } else if (field === "price" || field === "gst" || field === "discount") {
        row[field] = parseFloat(value) || 0;
      } else {
        row[field] = value;
      }
      row.total_price = calculateItemTotal(
        row.price,
        row.quantity,
        row.gst,
        row.discount,
      );
      next[index] = row;
      return next;
    });
  };

  const handleIncrementQuantity = (index) => {
    const item = lineItems[index];
    if (item.is_package) {
      handleUpdateItem(index, "quantity", parseFloat(item.quantity) + 1);
      return;
    }
    const max =
      item.stock_quantity < Infinity ? item.stock_quantity : undefined;
    const n = parseFloat(item.quantity) + 1;
    if (max != null && n > max) {
      toast.error(`Maximum: ${max}`);
      return;
    }
    handleUpdateItem(index, "quantity", n);
  };

  const handleDecrementQuantity = (index) => {
    const item = lineItems[index];
    const n = parseFloat(item.quantity) - 1;
    if (n >= 1) handleUpdateItem(index, "quantity", n);
  };

  const handleIncrementGst = (index) => {
    const item = lineItems[index];
    if (item.is_package) return;
    const n = parseFloat(item.gst) + 1;
    if (n <= 100) handleUpdateItem(index, "gst", n);
  };

  const handleDecrementGst = (index) => {
    const item = lineItems[index];
    if (item.is_package) return;
    const n = parseFloat(item.gst) - 1;
    if (n >= 0) handleUpdateItem(index, "gst", n);
  };

  const handleIncrementDiscount = (index) => {
    const item = lineItems[index];
    if (item.is_package) return;
    const n = parseFloat(item.discount) + 1;
    if (n <= 100) handleUpdateItem(index, "discount", n);
  };

  const handleDecrementDiscount = (index) => {
    const item = lineItems[index];
    if (item.is_package) return;
    const n = parseFloat(item.discount) - 1;
    if (n >= 0) handleUpdateItem(index, "discount", n);
  };

  const handleRemoveItem = (index) => {
    const row = lineItems[index];
    if (!row.is_package && row.id) {
      setDeletedItemIds((d) => [...d, row.id]);
    }
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const productLinesOnly = lineItems.filter((l) => !l.is_package);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.store_id) {
      toast.error("Customer and store are required");
      return;
    }
    if (!productLinesOnly.length) {
      toast.error("At least one product line is required");
      return;
    }
    if (hasStockPermission) {
      const missing = productLinesOnly.filter((l) => !l.stock_id);
      if (missing.length) {
        toast.error(
          "Each product line needs stock when stock management is enabled",
        );
        return;
      }
    }

    let paidAmountValue = 0;
    if (formData.payment_status === "paid")
      paidAmountValue = totals.totalAmount;
    else if (formData.payment_status === "semi_paid") {
      const p =
        formData.payment_amount === "" || !formData.payment_amount
          ? 0
          : parseFloat(formData.payment_amount) || 0;
      paidAmountValue = Math.min(Math.max(0, p), totals.totalAmount);
    } else paidAmountValue = 0;

    if (
      formData.payment_status === "semi_paid" &&
      (!formData.payment_amount ||
        formData.payment_amount === "" ||
        parseFloat(formData.payment_amount) <= 0)
    ) {
      toast.error("Please enter a valid payment amount for semi-paid option");
      return;
    }

    const payload = {
      user_id: invoice.user_id,
      customer_id: Number(formData.customer_id),
      store_id: Number(formData.store_id),
      paid_amount: paidAmountValue,
      payment_method: formData.payment_method,
      created_by: createdBy,
      deleted_item_ids: deletedItemIds,
      items: productLinesOnly.map((l) => {
        const row = {
          product_id: l.product_id,
          unit_id: l.unit_id,
          quantity: parseFloat(l.quantity),
          price: parseFloat(l.price),
          gst: parseFloat(l.gst) || 0,
          discount: parseFloat(l.discount) || 0,
        };
        if (l.id) row.id = l.id;
        if (hasStockPermission && l.stock_id) row.stock_id = l.stock_id;
        return row;
      }),
    };

    const pkgSnapNow = JSON.stringify(
      lineItems
        .filter((l) => l.is_package)
        .map((m) => ({
          id: m.package_row_id,
          q: m.quantity,
          name: m.product_name,
        })),
    );
    const packagesDirty = pkgSnapNow !== initialPackageSnapshot.current;

    setSaving(true);
    try {
      const res = await invoiceAPI.update(invoice.id, payload);
      if (res.data?.status === true) {
        toast.success(res.data?.message || "Invoice updated");
        if (packagesDirty) {
          toast(
            "Package lines were not saved to this invoice (only product lines update on the server).",
            { icon: "ℹ️" },
          );
        }
        try {
          const ch = new BroadcastChannel("app-cache-invalidation");
          ch.postMessage({
            type: "invoice-updated",
            data: {
              customer_id: Number(formData.customer_id),
              timestamp: Date.now(),
            },
          });
          ch.close();
        } catch {
          /* ignore */
        }
        onSaved?.();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update invoice");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onDocClick = (ev) => {
      if (!ev.target.closest(".package-dropdown"))
        setShowPackageDropdown(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  const formShellClass =
    variant === "page"
      ? "space-y-6 rounded-2xl border border-primary-200 dark:border-primary-900 bg-white dark:bg-gray-800 shadow-lg p-6"
      : "rounded-2xl border border-primary-200 dark:border-primary-900 bg-white dark:bg-gray-800 shadow-lg p-6 space-y-6";

  return (
    <>
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className={formShellClass}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <FiShoppingCart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              {variant !== "page" && (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit invoice
                </h2>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invoice #{invoice.invoice_number || invoice.id} — same layout as
                bill generation
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              icon={FiX}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FiSave}
              disabled={saving || dataFetchError || !productLinesOnly.length}
              isLoading={saving}
            >
              Save changes
            </Button>
          </div>
        </div>

        {dataFetchError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span>
              Unable to load all data. Check your connection and try again.
            </span>
          </div>
        )}

        {productLinesOnly.some(
          (item) =>
            item.stock_quantity < Infinity &&
            item.quantity > item.stock_quantity,
        ) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 shrink-0" />
            <span>
              Some products exceed available stock. Adjust quantities before
              saving.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <FiUser className="w-4 h-4 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-4">
                <SearchSelect
                  label="Select Customer"
                  options={customers.map((customer) => ({
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
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        title="Edit customer"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                      </button>
                    ),
                  }))}
                  value={formData.customer_id || ""}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, customer_id: value }));
                    const c = customers.find((x) => x.id === value);
                    if (c)
                      toast.success(`Customer: ${c.name || c.customer_name}`);
                  }}
                  placeholder="Search customer by name, phone, email..."
                  required
                  disabled={dataFetchError}
                  onCreateNew={(searchTerm) => {
                    const isPhone = /^\d[\d\s-]*$/.test(searchTerm.trim());
                    if (isPhone) {
                      setNewCustomerData((p) => ({
                        ...p,
                        phone: searchTerm.trim(),
                        name: "",
                      }));
                    } else {
                      setNewCustomerData((p) => ({
                        ...p,
                        name: searchTerm.trim(),
                        phone: "",
                      }));
                    }
                    setShowAddCustomerModal(true);
                  }}
                />

                <SearchSelect
                  label="Select Store"
                  options={(stores || []).map((store) => ({
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
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        title="Edit store"
                      >
                        <FiEdit className="w-3.5 h-3.5" />
                      </button>
                    ),
                  }))}
                  value={formData.store_id || ""}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, store_id: value }));
                    const s = stores.find((x) => x.id === value);
                    if (s) toast.success(`Store: ${s.name || s.store_name}`);
                  }}
                  placeholder="Search store by name, phone, email..."
                  required
                  disabled={dataFetchError}
                  onCreateNew={(searchTerm) => {
                    if (stores.length > 0) {
                      toast.error(
                        "You already have a store. Only one store is allowed.",
                      );
                      return;
                    }
                    const isPhone = /^\d[\d\s-]*$/.test(searchTerm.trim());
                    if (isPhone) {
                      setNewStoreData((p) => ({
                        ...p,
                        mobile: searchTerm.trim(),
                        name: "",
                      }));
                    } else {
                      setNewStoreData((p) => ({
                        ...p,
                        name: searchTerm.trim(),
                        mobile: "",
                      }));
                    }
                    setShowAddStoreModal(true);
                  }}
                />

                {formData.customer_id && !dataFetchError && (
                  <div className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getSelectedCustomerName()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <FiPackage className="w-4 h-4 mr-2" />
                Add Packages
              </h3>
              <div className="space-y-4 relative package-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Packages
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search packages by name, size, price..."
                    value={packageSearch}
                    onChange={(e) => handlePackageSearchChange(e.target.value)}
                    onFocus={() => setShowPackageDropdown(true)}
                    className="pl-10"
                    disabled={dataFetchError}
                  />
                </div>
                {showPackageDropdown && !dataFetchError && (
                  <div className="absolute z-20 w-full max-w-lg mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPackages.length > 0 ? (
                      filteredPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handlePackageSelect(pkg)}
                          onKeyDown={(ev) =>
                            ev.key === "Enter" && handlePackageSelect(pkg)
                          }
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex justify-between gap-2">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {pkg.package_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                Size: {pkg.package_size || "—"}
                              </div>
                            </div>
                            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-0.5">
                              <FaRupeeSign className="text-xs mt-0.5" />
                              {parseFloat(pkg.package_price || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        No packages found
                      </div>
                    )}
                  </div>
                )}

                {selectedPackage && !dataFetchError && (
                  <div className="p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 mt-2">
                    <div className="flex justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {selectedPackage.package_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Size: {selectedPackage.package_size || "—"}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-primary-600 flex items-center gap-0.5">
                        <FaRupeeSign className="text-sm" />
                        {parseFloat(selectedPackage.package_price || 0).toFixed(
                          2,
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Qty
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={packageQuantity}
                        onChange={(e) =>
                          setPackageQuantity(parseInt(e.target.value, 10) || 1)
                        }
                        className="w-20"
                      />
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleAddPackageToInvoice}
                        disabled={packageQuantity <= 0}
                      >
                        <FiPlus className="w-4 h-4 inline mr-1" />
                        Add to invoice
                      </Button>
                    </div>
                  </div>
                )}
                {packagesLoading && (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Add Products Section */}
        <div className="w-full">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <FiPackage className="w-4 h-4 mr-2" />
              Add Products
            </h3>

            <div className="relative product-dropdown" ref={productDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Products
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products by name, SKU, brand, category..."
                  value={productSearch}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  onFocus={() => {
                    if (filteredProducts.length === 0 && !productSearch) {
                      handleProductSearch("");
                    }
                    setShowProductList(true);
                  }}
                  className="pl-10"
                  disabled={dataFetchError}
                />
                {isLoadingProducts && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
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
                      className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-96 overflow-y-auto"
                    >
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, idx) => (
                          <div
                            key={`${product.id}-${product.stock_id || idx}`}
                            role="button"
                            tabIndex={0}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                            onClick={() => handleAddItem(product)}
                            onKeyDown={(ev) =>
                              ev.key === "Enter" && handleAddItem(product)
                            }
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-white mb-1">
                                  {product.name}
                                  {hasStockPermission &&
                                    product.variant_info && (
                                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                        ({product.variant_info})
                                      </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                  <div>📦 SKU: {product.sku || "N/A"}</div>
                                  {product.brand?.name && (
                                    <div>🏷️ Brand: {product.brand.name}</div>
                                  )}
                                  {product.category?.name && (
                                    <div>
                                      📂 Category: {product.category.name}
                                    </div>
                                  )}
                                  {hasStockPermission && (
                                    <div
                                      className={`text-xs font-medium ${product.stock_quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                    >
                                      📊 Stock Available:{" "}
                                      {product.stock_quantity > 0
                                        ? product.stock_quantity
                                        : "Out of Stock"}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="font-semibold text-gray-900 dark:text-white flex justify-end items-center">
                                  <FaRupeeSign className="text-[13px] me-[2px]" />
                                  {product.price.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-2">
                                  {product.gst_percentage > 0 && (
                                    <div>
                                      GST: {product.gst_percentage.toFixed(1)}%
                                    </div>
                                  )}
                                  {product.discount_percentage > 0 && (
                                    <div>
                                      Discount:{" "}
                                      {product.discount_percentage.toFixed(1)}%
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
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

            {/* Quick summary of added product lines */}
            {productLinesOnly.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Added Products ({productLinesOnly.length})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {productLinesOnly.map((item, idx) => {
                    const globalIdx = lineItems.indexOf(item);
                    return (
                      <div
                        key={`${item.product_id}-${globalIdx}`}
                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product_name}
                            {hasStockPermission && item.variant_info && (
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                ({item.variant_info})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(globalIdx)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <FiShoppingCart className="w-4 h-4 mr-2" />
            Invoice items ({lineItems.length})
          </h3>
          {lineItems.length === 0 ? (
            <EmptyState
              icon={FiPackage}
              title="No items"
              description="Add products or packages above"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left text-xs font-medium text-gray-500 pb-3">
                      Product / Package
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3 w-[100px]">
                      Qty
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3 w-[100px]">
                      Price
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3 w-[100px]">
                      GST %
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3 w-[100px]">
                      Disc %
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 pb-3 w-[100px]">
                      Total
                    </th>
                    <th className="w-[60px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr
                      key={`${item.is_package ? "p" : "i"}-${index}-${item.id || item.product_id}`}
                      className="border-b border-gray-100 dark:border-gray-700"
                    >
                      <td className="py-3">
                        <div className="space-y-1">
                          {item.is_package && (
                            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                              PACKAGE
                            </span>
                          )}
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.product_code}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.unit_name}
                          </p>
                          {!item.is_package &&
                            item.stock_quantity !== undefined &&
                            item.stock_quantity < Infinity && (
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                Stock avail.: {item.stock_quantity}
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDecrementQuantity(index)}
                            disabled={parseFloat(item.quantity) <= 1}
                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded disabled:opacity-40"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <Input
                            type="text"
                            value={String(item.quantity)}
                            onChange={(e) =>
                              handleUpdateItem(
                                index,
                                "quantity",
                                e.target.value,
                              )
                            }
                            className="min-w-[5rem] text-sm text-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrementQuantity(index)}
                            disabled={
                              !item.is_package &&
                              item.stock_quantity < Infinity &&
                              parseFloat(item.quantity) >= item.stock_quantity
                            }
                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded disabled:opacity-40"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        {item.is_package ? (
                          <span className="text-sm">
                            ₹{parseFloat(item.price).toFixed(2)}
                          </span>
                        ) : (
                          <Input
                            type="number"
                            step="0.01"
                            value={String(item.price)}
                            onChange={(e) =>
                              handleUpdateItem(index, "price", e.target.value)
                            }
                            className="w-20 text-sm text-center mx-auto"
                          />
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {item.is_package ? (
                          <span className="text-sm text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDecrementGst(index)}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <Input
                              type="number"
                              value={String(item.gst)}
                              onChange={(e) =>
                                handleUpdateItem(index, "gst", e.target.value)
                              }
                              className="text-sm text-center min-w-[90px] w-[90px]"
                            />
                            <button
                              type="button"
                              onClick={() => handleIncrementGst(index)}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {item.is_package ? (
                          <span className="text-sm text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDecrementDiscount(index)}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <Input
                              type="number"
                              value={String(item.discount)}
                              onChange={(e) =>
                                handleUpdateItem(
                                  index,
                                  "discount",
                                  e.target.value,
                                )
                              }
                              className="min-w-[90px] w-[90px] text-sm text-center"
                            />
                            <button
                              type="button"
                              onClick={() => handleIncrementDiscount(index)}
                              className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 text-center font-semibold text-sm">
                        ₹{parseFloat(item.total_price || 0).toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {lineItems.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FiDollarSign className="w-4 h-4" />
              Payment & summary
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Select
                  label="Payment method"
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      payment_method: e.target.value,
                    }))
                  }
                  options={[
                    { value: "Cash", label: "Cash" },
                    { value: "Card", label: "Card" },
                    { value: "UPI", label: "UPI" },
                    { value: "Bank Transfer", label: "Bank Transfer" },
                    { value: "Cheque", label: "Cheque" },
                  ]}
                />
                <Select
                  label="Payment status"
                  value={formData.payment_status}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((p) => ({
                      ...p,
                      payment_status: v,
                      payment_amount:
                        v === "paid"
                          ? totals.totalAmount
                          : v === "semi_paid"
                            ? p.payment_amount
                            : 0,
                    }));
                  }}
                  options={[
                    { value: "paid", label: "Full paid" },
                    { value: "semi_paid", label: "Semi paid" },
                    { value: "non_paid", label: "Non paid" },
                  ]}
                />
                {formData.payment_status === "semi_paid" && (
                  <>
                    <Input
                      label="Payment amount"
                      type="text"
                      inputMode="decimal"
                      value={
                        formData.payment_amount === 0
                          ? ""
                          : formData.payment_amount
                      }
                      onChange={(e) =>
                        handlePaymentAmountChange(e.target.value)
                      }
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
                        if (value === "") {
                          setFormData((prev) => ({
                            ...prev,
                            payment_amount: "",
                          }));
                          return;
                        }

                        if (value && !isNaN(parseFloat(value))) {
                          const numValue = parseFloat(value);
                          const maxAmount = totals.totalAmount;
                          if (numValue > maxAmount) {
                            setFormData((prev) => ({
                              ...prev,
                              payment_amount: maxAmount.toString(),
                            }));
                            toast.error(
                              `Payment amount adjusted to maximum: ₹${maxAmount.toFixed(2)}`,
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
                        }
                      }}
                      max={totals.totalAmount}
                      placeholder="Enter payment amount"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Invoice total is ₹{totals.totalAmount.toFixed(2)}. Due
                        after this payment: ₹{dueAfterPayment.toFixed(2)}.
                      </p>
                      {(parseFloat(formData.payment_amount) || 0) >
                        totals.totalAmount && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Amount exceeds total!
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500 space-y-2 text-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-500/60">
                  Original invoice (when editing started): Total ₹
                  {originalInvoiceFinancials.current.total.toFixed(2)}, paid ₹
                  {originalInvoiceFinancials.current.paid.toFixed(2)}, due ₹
                  {originalInvoiceFinancials.current.due.toFixed(2)}.
                </p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Products subtotal
                    </span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pl-4">
                    <span>Less: Total discount</span>
                    <span>- ₹{totals.totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pl-4">
                    <span>Add: Total GST</span>
                    <span>+ ₹{totals.totalGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span className="text-gray-700 dark:text-gray-200">
                      Products total (after discount & GST)
                    </span>
                    <span>
                      ₹{totals.productTotalAfterDiscountAndGst.toFixed(2)}
                    </span>
                  </div>
                </div>

                {totals.packageTotal > 0 && (
                  <div className="flex justify-between text-primary-600 pt-1 border-t border-dashed border-gray-200 dark:border-gray-500">
                    <span>Packages (add-on)</span>
                    <span>+ ₹{totals.packageTotal.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 dark:border-gray-500 mt-1">
                  <span className="text-gray-800 dark:text-gray-100">
                    New invoice total
                  </span>
                  <span className="text-primary-600">
                    ₹{totals.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Paid amount (this save)
                    </span>
                    <span className="font-medium">
                      ₹{effectivePaidAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-1 border-t border-amber-200/80 dark:border-amber-700/50 text-amber-800 dark:text-amber-200">
                    <span>Due after payment</span>
                    <span>₹{dueAfterPayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.form>

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
      <CustomerModal
        isOpen={showEditCustomerModal}
        onClose={() => {
          setShowEditCustomerModal(false);
          setEditingCustomer(null);
        }}
        onCustomerCreated={handleCustomerUpdatedFromModal}
        initialData={editingCustomer || {}}
      />
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
      <StoreModal
        isOpen={showEditStoreModal}
        onClose={() => {
          setShowEditStoreModal(false);
          setEditingStore(null);
        }}
        onStoreCreated={handleUpdateStore}
        initialData={editingStore || {}}
      />
    </>
  );
};

export default InvoiceEditForm;