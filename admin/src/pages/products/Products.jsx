import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiPackage,
  FiGrid,
  FiList,
  FiDownload,
  FiUpload,
  FiMoreVertical,
  FiEye,
  FiCopy,
  FiArchive,
  FiAlertCircle,
  FiChevronDown,
  FiX,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../../store/productStore";
import { stockAPI } from "../../services/stockService";
import { categoriesAPI } from "../../services/categoriesService";
import { brandsAPI } from "../../services/brandsService";
import { unitsAPI } from "../../services/unitsService";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Table from "../../components/common/Table/Table";
import StatusBadge from "../../components/common/StatusBadge/StatusBadge";
import Pagination from "../../components/common/Pagination/Pagination";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import ProductModal from "../../components/features/Products/ProductModal";
import Select from "../../components/common/Select/Select";
import ProductForm from "../../components/features/Products/ProductForm";
import StockAddModal from "../../components/common/CreateModals/StockAddModal";
import { usePermissionStore } from "../../store/permissionStore";

const Products = () => {
  const {
    products,
    totalProducts,
    currentPage,
    pageSize,
    loading,
    filters,
    pagination,
    fetchProducts,
    fetchProductsByUrl,
    deleteProduct,
    bulkDeleteProducts,
    createProduct,
    updateProduct,
    setFilters,
  } = useProductStore();
  const { canAccess } = usePermissionStore();

  const hasStockPermission = canAccess("stock-management");

  // Refs to track initialization
  const initializedRef = useRef(false);
  const categoriesInitializedRef = useRef(false);
  const brandsInitializedRef = useRef(false);
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] = useState(null);
  const [selectedStockProduct, setSelectedStockProduct] = useState(null);
  const [selectedStockRecord, setSelectedStockRecord] = useState(null);
  const [updatingStock, setUpdatingStock] = useState(false);

  // Function to get total stock quantity for a product from its stocks array
  const getProductTotalStock = (product) => {
    if (!product || !product.stocks || !Array.isArray(product.stocks)) return 0;
    return product.stocks.reduce((total, stock) => {
      const quantity = parseFloat(stock.quantity) || 0;
      return total + quantity;
    }, 0);
  };

  // Function to get all stock records for a product
  const getProductStocks = (product) => {
    if (!product || !product.stocks || !Array.isArray(product.stocks))
      return [];
    return product.stocks;
  };

  // Function to get the primary stock record for a product (first one or default)
  const getPrimaryStockRecord = (product) => {
    if (!product || !product.stocks || !Array.isArray(product.stocks))
      return null;
    return product.stocks[0] || null;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
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
  }, [searchTerm, setFilters]);

  // Fetch categories, brands and units data
  useEffect(() => {
    const fetchCategoriesBrandsAndUnits = async () => {
      if (categoriesInitializedRef.current || brandsInitializedRef.current)
        return;
      categoriesInitializedRef.current = true;
      brandsInitializedRef.current = true;

      if (
        categoriesLoading ||
        brandsLoading ||
        unitsLoading ||
        (categories.length > 0 && brands.length > 0 && units.length > 0)
      ) {
        return;
      }

      setCategoriesLoading(true);
      setBrandsLoading(true);
      setUnitsLoading(true);

      try {
        const [categoriesRes, brandsRes, unitsRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll(),
          unitsAPI.getAll(),
        ]);

        let categoriesData = [];
        if (categoriesRes?.data?.data) {
          categoriesData = Array.isArray(categoriesRes.data.data)
            ? categoriesRes.data.data
            : categoriesRes.data.data.data || [];
        } else {
          categoriesData = categoriesRes?.data || [];
        }

        let brandsData = [];
        if (brandsRes?.data?.data) {
          brandsData = Array.isArray(brandsRes.data.data)
            ? brandsRes.data.data
            : brandsRes.data.data.data || [];
        } else {
          brandsData = brandsRes?.data || [];
        }

        let unitsData = [];
        if (unitsRes?.data?.data) {
          unitsData = Array.isArray(unitsRes.data.data)
            ? unitsRes.data.data
            : unitsRes.data.data.data || [];
        } else {
          unitsData = unitsRes?.data || [];
        }

        setCategories(categoriesData);
        setBrands(brandsData);
        setUnits(unitsData);
      } catch (error) {
        console.error("Error fetching categories, brands and units:", error);
        setCategories([]);
        setBrands([]);
        setUnits([]);
      } finally {
        setCategoriesLoading(false);
        setBrandsLoading(false);
        setUnitsLoading(false);
      }
    };

    fetchCategoriesBrandsAndUnits();
  }, []);

  const handleAddProduct = () => {
    setShowAddForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedProduct(null);
  };

  const handleSubmitProduct = async (productData) => {
    setFormSubmitting(true);
    try {
      if (showEditForm && selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      // Clear cache and refresh
      const { clearCache } = useProductStore.getState();
      clearCache();
      useProductStore.setState({ lastFetchTime: null, cacheKey: null });

      await fetchProducts();

      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll(),
        ]);

        let categoriesData = [];
        if (categoriesRes?.data?.data) {
          categoriesData = Array.isArray(categoriesRes.data.data)
            ? categoriesRes.data.data
            : categoriesRes.data.data.data || [];
        } else {
          categoriesData = categoriesRes?.data || [];
        }

        let brandsData = [];
        if (brandsRes?.data?.data) {
          brandsData = Array.isArray(brandsRes.data.data)
            ? brandsRes.data.data
            : brandsRes.data.data.data || [];
        } else {
          brandsData = brandsRes?.data || [];
        }

        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error refreshing categories and brands:", error);
      }

      handleCancelForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSelectedProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedProductToDelete) {
      try {
        await deleteProduct(selectedProductToDelete);
        setShowDeleteConfirm(false);
        setSelectedProductToDelete(null);

        // Clear cache and refresh
        const { clearCache } = useProductStore.getState();
        clearCache();
        useProductStore.setState({ lastFetchTime: null, cacheKey: null });

        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product. Please try again.");
      }
    }
  };

  const openStockModal = (product) => {
    setSelectedStockProduct(product);
    // Get the primary stock record for this product
    const stockRecord = getPrimaryStockRecord(product);
    setSelectedStockRecord(stockRecord);
    setShowStockModal(true);
  };

  const handleAddStock = async (stockData) => {
    if (updatingStock) return;

    setUpdatingStock(true);
    try {
      console.log("handleAddStock - stockData:", stockData);

      // Use the stock_id from the form data
      if (!stockData.stock_id) {
        console.error("No stock record selected");
        toast.error("Please select a stock record");
        return;
      }

      console.log("handleAddStock - API call params:", {
        stockId: stockData.stock_id,
        userId: stockData.user_id,
        quantity: stockData.quantity,
      });

      // Call the stock API with the selected stock record ID
      await stockAPI.addStock(
        stockData.stock_id,
        stockData.user_id,
        stockData.quantity,
      );

      // Show success message
      toast.success(
        `Stock added successfully! New stock: ${stockData.new_stock}`,
      );

      // Clear cache to force fresh data
      const { clearCache } = useProductStore.getState();
      clearCache();
      useProductStore.setState({ lastFetchTime: null, cacheKey: null });

      // Get the current page from pagination state
      const currentPageNumber = pagination?.current_page || currentPage || 1;

      // Get the full URL for the current page from pagination
      let currentPageUrl = null;

      if (pagination) {
        if (currentPageNumber === 1 && pagination.first_page_url) {
          currentPageUrl = pagination.first_page_url;
        } else if (
          currentPageNumber === pagination.last_page &&
          pagination.last_page_url
        ) {
          currentPageUrl = pagination.last_page_url;
        } else if (pagination.next_page_url) {
          currentPageUrl = pagination.next_page_url.replace(
            /page=\d+/,
            `page=${currentPageNumber}`,
          );
        } else if (pagination.prev_page_url) {
          currentPageUrl = pagination.prev_page_url.replace(
            /page=\d+/,
            `page=${currentPageNumber}`,
          );
        } else if (pagination.first_page_url) {
          currentPageUrl = pagination.first_page_url.replace(
            /page=\d+/,
            `page=${currentPageNumber}`,
          );
        }
      }

      // If we still don't have a URL, construct from first_page_url
      if (!currentPageUrl && pagination?.first_page_url) {
        const baseUrl = pagination.first_page_url.split("?")[0];
        currentPageUrl = `${baseUrl}?page=${currentPageNumber}`;
      }

      console.log("Refreshing current page URL:", currentPageUrl);

      // Refresh the products list for the current page
      if (fetchProductsByUrl && currentPageUrl) {
        await fetchProductsByUrl(currentPageUrl);
      } else {
        await fetchProducts(currentPageNumber);
      }

      // Close the modal
      setShowStockModal(false);
      setSelectedStockProduct(null);
      setSelectedStockRecord(null);
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error("Failed to add stock. Please try again.");
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteProducts(selectedProducts);
      setSelectedProducts([]);
      setShowDeleteConfirm(false);

      // Clear cache and refresh
      const { clearCache } = useProductStore.getState();
      clearCache();
      useProductStore.setState({ lastFetchTime: null, cacheKey: null });

      await fetchProducts();
    } catch (error) {
      console.error("Error bulk deleting products:", error);
    }
  };

  const handlePageChange = (url) => {
    if (url) {
      fetchProductsByUrl(url);
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    const { clearCache } = useProductStore.getState();
    clearCache();

    useProductStore.setState({
      lastFetchTime: null,
      cacheKey: null,
    });

    // Get the current page number
    const currentPageNumber = pagination?.current_page || currentPage || 1;

    // Get the full URL for the current page from pagination
    let currentPageUrl = null;

    if (pagination) {
      if (currentPageNumber === 1 && pagination.first_page_url) {
        currentPageUrl = pagination.first_page_url;
      } else if (
        currentPageNumber === pagination.last_page &&
        pagination.last_page_url
      ) {
        currentPageUrl = pagination.last_page_url;
      } else if (pagination.next_page_url) {
        currentPageUrl = pagination.next_page_url.replace(
          /page=\d+/,
          `page=${currentPageNumber}`,
        );
      } else if (pagination.prev_page_url) {
        currentPageUrl = pagination.prev_page_url.replace(
          /page=\d+/,
          `page=${currentPageNumber}`,
        );
      } else if (pagination.first_page_url) {
        currentPageUrl = pagination.first_page_url.replace(
          /page=\d+/,
          `page=${currentPageNumber}`,
        );
      }
    }

    if (!currentPageUrl && pagination?.first_page_url) {
      const baseUrl = pagination.first_page_url.split("?")[0];
      currentPageUrl = `${baseUrl}?page=${currentPageNumber}`;
    }

    if (fetchProductsByUrl && currentPageUrl) {
      await fetchProductsByUrl(currentPageUrl);
    } else {
      await fetchProducts(currentPageNumber);
    }

    setRefreshing(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ search: "", category: "", status: "" });
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const columns = [
    {
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={
              selectedProducts.length === products.length && products.length > 0
            }
            onChange={selectAllProducts}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </div>
      ),
      accessor: "selection",
      cell: (_, row) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.id)}
          onChange={() => toggleProductSelection(row.id)}
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
    {
      header: "Product",
      accessor: "name",
      cell: (value, row) => (
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            {row.image ? (
              <img
                src={row.image}
                alt={value}
                className="w-12 h-12 rounded-xl object-cover mr-3 ring-2 ring-gray-200 dark:ring-gray-700"
                onError={(e) => {
                  console.error(`Failed to load product image:`, row.image);
                  if (row.image && row.image.includes("drive.google.com")) {
                    e.target.style.display = "none";
                    const parent = e.target.parentElement;
                    const placeholder = document.createElement("div");
                    placeholder.className =
                      "w-12 h-12 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl mr-3 flex flex-col items-center justify-center ring-2 ring-red-200 dark:ring-red-800";
                    placeholder.innerHTML = `
                      <svg class="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-[8px] text-red-600 dark:text-red-400 mt-1">Drive</span>
                    `;
                    parent.appendChild(placeholder);
                  } else {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEgzOFYzMEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMjkiIGN5PSIyNSIgcj0iMiIgZmlsbD0iIzlCQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzBWMzJIMzJWMzBIMzJWMzBaIiBmaWxsPSIjOUJBM0FGIi8+Cjwvc3ZnPg==";
                  }
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl mr-3 flex items-center justify-center ring-2 ring-gray-200 dark:ring-gray-700">
                <FiPackage className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            {getProductTotalStock(row) <= (row.minimum_stock_quantity || 10) &&
              getProductTotalStock(row) > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
              )}
          </motion.div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white whitespace-normal">
              {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              SKU: {row.sku}
            </p>

            <div className="flex items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {row.unit_amount}: {row.unit ? row.unit.name : "N/A"}
              </span>
            </div>

            {row.attributes && (
              <div className="mt-1">
                {(() => {
                  let attributes = row.attributes;

                  const safeJSONParse = (data) => {
                    try {
                      if (typeof data === "string") {
                        const parsed = JSON.parse(data);
                        if (typeof parsed === "string") {
                          return safeJSONParse(parsed);
                        }
                        return parsed;
                      }
                      return data;
                    } catch (e) {
                      return null;
                    }
                  };

                  if (typeof attributes === "string") {
                    attributes = safeJSONParse(attributes);
                  }

                  let values = [];

                  if (attributes && typeof attributes === "object") {
                    if (Array.isArray(attributes)) {
                      attributes.forEach((item) => {
                        if (typeof item === "object" && item !== null) {
                          values.push(...Object.values(item));
                        } else {
                          values.push(item);
                        }
                      });
                    } else {
                      values = Object.values(attributes);
                    }
                  }

                  values = values
                    .filter(
                      (val) => val !== null && val !== undefined && val !== "",
                    )
                    .map((val) => {
                      if (typeof val === "object") {
                        return JSON.stringify(val);
                      }
                      return String(val);
                    });

                  if (values.length > 0) {
                    const displayValues = values.slice(0, 2);

                    return (
                      <div className="flex flex-wrap gap-1">
                        {displayValues.map((val, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                          >
                            {val}
                          </span>
                        ))}
                        {values.length > 2 && (
                          <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            +{values.length - 2} more
                          </span>
                        )}
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>
            )}

            {row.variants &&
              Array.isArray(row.variants) &&
              row.variants.length > 0 && (
                <div className="mt-1">
                  <div className="flex flex-wrap gap-1">
                    {row.variants.slice(0, 3).flatMap((variant, index) => {
                      const variantValues = [];
                      if (variant.size)
                        variantValues.push(String(variant.size));
                      if (variant.color)
                        variantValues.push(String(variant.color));
                      if (variant.material)
                        variantValues.push(String(variant.material));

                      return variantValues.map((val, valIndex) => (
                        <span
                          key={`${index}-${valIndex}`}
                          className="inline-block px-1.5 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded"
                        >
                          {val}
                        </span>
                      ));
                    })}
                    {row.variants.length > 3 && (
                      <span className="inline-block px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        +{row.variants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      ),
    },
    {
      header: "Selling Price",
      accessor: "selling_price",
      cell: (value) => {
        const price =
          typeof value === "string"
            ? parseFloat(value)
            : typeof value === "number"
              ? value
              : 0;
        return (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
            ₹{isNaN(price) ? "0.00" : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Purchase Price",
      accessor: "purchase_price",
      cell: (value) => {
        const price =
          typeof value === "string"
            ? parseFloat(value)
            : typeof value === "number"
              ? value
              : 0;
        return (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm font-medium">
            ₹{isNaN(price) ? "0.00" : price.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Category",
      accessor: "category_id",
      cell: (value, row) => {
        return (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
            {row?.category?.name || `Not specified`}
          </span>
        );
      },
    },
    {
      header: "Brand",
      accessor: "brand_id",
      cell: (value, row) => {
        // console.log("Rendering brand cell - value:", value, "row:", row);

        return (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
            {row?.brand?.name || `Not specified`}
          </span>
        );
      },
    },
    {
      header: "Stock",
      accessor: "stock",
      cell: (_, row) => {
        const totalStock = getProductTotalStock(row);
        const stocksList = getProductStocks(row);
        const maxStock = row.maximum_stock_quantity || 100;
        const lowStockThreshold = parseFloat(row.minimum_stock_quantity) || 10;

        return (
          <>
            {hasStockPermission ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((totalStock / maxStock) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`h-full rounded-full ${
                        totalStock <= lowStockThreshold && totalStock > 0
                          ? "bg-red-500"
                          : totalStock === 0
                            ? "bg-gray-400"
                            : totalStock <= lowStockThreshold * 2
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`
              text-sm font-medium
              ${
                totalStock <= lowStockThreshold && totalStock > 0
                  ? "text-red-600 dark:text-red-400"
                  : totalStock === 0
                    ? "text-orange-600 dark:text-orange-400"
                    : totalStock <= lowStockThreshold * 2
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-gray-900 dark:text-white"
              }
            `}
                  >
                    {totalStock}
                  </span>
                  {/* Always show the Add Stock button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openStockModal(row)}
                    icon={FiPlus}
                    className="!px-2 !py-1 text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20"
                    title="Add Stock"
                  />
                </div>

                {/* Display stock breakdown by unit if multiple stocks exist */}
                {stocksList.length > 1 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                    {stocksList.map((stock, idx) => {
                      const unit = Array.isArray(units)
                        ? units.find((u) => u.id === stock.unit_id)
                        : null;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <span className="truncate">
                            {unit ? unit.name : `Unit ${stock.unit_id}`}:
                          </span>
                          <span className="font-medium">
                            {parseFloat(stock.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Not applicable</div>
            )}
          </>
        );
      },
    },
    {
      header: "Status",
      accessor: "is_active",
      cell: (value) => (
        <StatusBadge
          status={value ? "active" : "inactive"}
          variant={value ? "success" : "default"}
        />
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/products/${row.id}`)}
            className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View product details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditProduct(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Edit product"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(value)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete product"
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
        className="space-y-6 p-6"
      >
        {/* Header with Gradient */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiPackage className="w-4 h-4 mr-2" />
              Manage your product catalog and inventory
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!showAddForm && !showEditForm && (
              <>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "table"
                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary-600"
                        : "text-gray-600 dark:text-gray-400"
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
                >
                  <FiRefreshCw
                    className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? "animate-spin" : ""}`}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiDownload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>

                <Link
                  to="/products/deleted"
                  className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Deleted Products
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiUpload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              </>
            )}

            {!showAddForm && !showEditForm ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleAddProduct}
                  icon={FiPlus}
                  className="shadow-lg shadow-primary-500/30"
                >
                  Add Product
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button
                  variant="outline"
                  onClick={handleCancelForm}
                  icon={FiArrowLeft}
                >
                  Back to Products
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {showEditForm ? "Edit Product" : "Add New Product"}
            </h2>
            <ProductForm
              product={selectedProduct}
              onSubmit={handleSubmitProduct}
              onCancel={handleCancelForm}
              isSubmitting={formSubmitting}
            />
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {selectedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        {selectedProducts.length} products selected
                      </span>
                      <button
                        onClick={() => setSelectedProducts([])}
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
                      <Button variant="primary" size="sm">
                        Bulk Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              {initialLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products by name, SKU, or category..."
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
                      {(filters.category || filters.status) && (
                        <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </motion.button>

                    {(searchTerm || filters.category || filters.status) && (
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
              )}

              {!initialLoading && (
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
                            label="Category"
                            options={[
                              { value: "", label: "All Categories" },
                              ...(Array.isArray(categories)
                                ? categories.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                  }))
                                : []),
                            ]}
                            value={filters.category}
                            onChange={(e) => {
                              const selectedCategory = categories.find(cat => cat.id == e.target.value);
                              setSearchTerm(selectedCategory?.name || "");
                              setFilters({ category: e.target.value });
                            }}
                          />
                          <Select
                            label="Status"
                            options={[
                              { value: "", label: "All Status" },
                              { value: "active", label: "Active" },
                              { value: "inactive", label: "Inactive" },
                            ]}
                            value={filters.status}
                            onChange={(e) => {
                              const statusMap = {
                                "active": "active",
                                "inactive": "inactive",
                              };
                              setSearchTerm(statusMap[e.target.value] || "");
                              setFilters({ status: e.target.value });
                            }}
                          />
                          <Select
                            label="Stock Status"
                            options={[
                              { value: "", label: "All Stock" },
                              { value: "low", label: "Low Stock" },
                              { value: "out", label: "Out of Stock" },
                              { value: "in", label: "In Stock" },
                            ]}
                            value={filters.stockStatus}
                            onChange={(e) => {
                              const stockStatusMap = {
                                "low": "low-stock",
                                "out": "out-of-stock",
                                "in": "in-stock",
                              };
                              setSearchTerm(stockStatusMap[e.target.value] || "");
                              setFilters({ stockStatus: e.target.value });
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {initialLoading || loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {initialLoading
                        ? "Loading product data..."
                        : "Updating product data..."}
                    </p>
                  </div>
                </div>
              ) : products.length > 0 ? (
                viewMode === "table" ? (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                      <Table
                        columns={columns}
                        data={products}
                        loading={loading}
                        onEdit={handleEditProduct}
                        onDelete={handleDelete}
                        onAddStock={handleAddStock}
                      />
                      <Pagination
                        currentPage={currentPage}
                        totalItems={totalProducts}
                        pageSize={pageSize}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products.map((product, index) => {
                        const totalStock = getProductTotalStock(product);
                        const stocksList = getProductStocks(product);
                        const lowStockThreshold =
                          parseFloat(product.minimum_stock_quantity) || 10;

                        return (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
                          >
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error(
                                      `Failed to load product grid image:`,
                                      product.image,
                                    );
                                    if (
                                      product.image &&
                                      product.image.includes("drive.google.com")
                                    ) {
                                      e.target.style.display = "none";
                                      const parent = e.target.parentElement;
                                      const placeholder =
                                        document.createElement("div");
                                      placeholder.className =
                                        "w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20";
                                      placeholder.innerHTML = `
                                        <svg class="w-12 h-12 text-red-500 dark:text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span class="text-sm text-red-600 dark:text-red-400 font-medium">Google Drive</span>
                                        <span class="text-xs text-red-500 dark:text-red-500 mt-1">Image not available</span>
                                      `;
                                      parent.appendChild(placeholder);
                                    } else {
                                      e.target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTI1SDg1Vjc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjOUJBM0FGIi8+CjxwYXRoIGQ9Ik05NSAxMDBWMTA1SDEwMFY5OUg5NVoiIGZpbGw9IiM5QkEzQUYiLz4KPC9zdmc+";
                                    }
                                    e.target.onerror = null;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FiPackage className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    navigate(`/products/${product.id}`)
                                  }
                                  className="p-2 bg-white rounded-lg text-gray-600 hover:bg-gray-50"
                                >
                                  <FiEye className="w-4 h-4" />
                                </motion.button>
                              </div>

                              {totalStock <= lowStockThreshold &&
                                totalStock > 0 && (
                                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg flex items-center">
                                    <FiAlertCircle className="w-3 h-3 mr-1" />
                                    Low Stock
                                  </div>
                                )}

                              {totalStock <= lowStockThreshold &&
                                totalStock > 0 && (
                                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg flex items-center">
                                    <FiAlertCircle className="w-3 h-3 mr-1" />
                                    Low Stock
                                  </div>
                                )}

                              {totalStock === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-lg flex items-center">
                                  <FiAlertCircle className="w-3 h-3 mr-1" />
                                  Out of Stock
                                </div>
                              )}

                              {/* Add a floating action button for stock in grid view */}
                              <div className="absolute bottom-2 right-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openStockModal(product);
                                  }}
                                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
                                  title="Add Stock"
                                >
                                  <FiPlus className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                SKU: {product.sku}
                              </p>

                              <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                  ₹
                                  {product.selling_price
                                    ? parseFloat(product.selling_price).toFixed(
                                        2,
                                      )
                                    : "0.00"}
                                </span>
                                <StatusBadge
                                  status={
                                    product.is_active ? "active" : "inactive"
                                  }
                                  variant={
                                    product.is_active ? "success" : "default"
                                  }
                                  size="sm"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Stock
                                  </span>
                                  <span
                                    className={`font-medium ${
                                      totalStock <= lowStockThreshold &&
                                      totalStock > 0
                                        ? "text-red-600 dark:text-red-400"
                                        : totalStock === 0
                                          ? "text-orange-600 dark:text-orange-400"
                                          : "text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {totalStock} /{" "}
                                    {product.maximum_stock_quantity || 100}
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${Math.min((totalStock / (product.maximum_stock_quantity || 100)) * 100, 100)}%`,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`h-full rounded-full ${
                                      totalStock <= lowStockThreshold &&
                                      totalStock > 0
                                        ? "bg-red-500"
                                        : totalStock === 0
                                          ? "bg-gray-400"
                                          : totalStock <= lowStockThreshold * 2
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                                    }`}
                                  />
                                </div>

                                {stocksList.length > 1 && (
                                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                                      {stocksList.map((stock, idx) => {
                                        const unit = Array.isArray(units)
                                          ? units.find(
                                              (u) => u.id === stock.unit_id,
                                            )
                                          : null;
                                        return (
                                          <div
                                            key={idx}
                                            className="flex items-center justify-between"
                                          >
                                            <span className="truncate">
                                              {unit
                                                ? unit.name
                                                : `Unit ${stock.unit_id}`}
                                              :
                                            </span>
                                            <span className="font-medium">
                                              {parseFloat(
                                                stock.quantity,
                                              ).toFixed(2)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalProducts}
                      pageSize={pageSize}
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </>
                )
              ) : (
                <EmptyState
                  icon={FiPackage}
                  title="No products yet"
                  description="Get started by adding your first product to the catalog. You can add products individually or import them in bulk."
                  action={
                    <Button onClick={handleAddProduct} icon={FiPlus} size="lg">
                      Add Your First Product
                    </Button>
                  }
                />
              )}
            </motion.div>
          </>
        )}
        
        <StockAddModal
          isOpen={showStockModal}
          onClose={() => {
            setShowStockModal(false);
            setSelectedStockProduct(null);
            setSelectedStockRecord(null);
          }}
          onAddStock={handleAddStock}
          product={selectedStockProduct}
          currentStock={
            selectedStockProduct
              ? getProductTotalStock(selectedStockProduct)
              : 0
          }
          units={units} // Pass units for better display
        />
      </motion.div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            style={{ marginTop: "0 !important" }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedProductToDelete
                    ? "Delete Product"
                    : "Delete Products"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {selectedProductToDelete
                    ? "Are you sure you want to delete this product? This action cannot be undone."
                    : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`}
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedProductToDelete(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={
                      selectedProductToDelete ? confirmDelete : handleBulkDelete
                    }
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
    </>
  );
};

export default Products;
