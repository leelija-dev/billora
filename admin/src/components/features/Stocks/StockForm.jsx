// StockForm.jsx - Updated with quantity disabled during edit

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../../store/authStore";
import { productsAPI } from "../../../services/productsService";
import { sellerAPI } from "../../../services/sellerService";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import Select from "../../common/Select/Select";
import SearchSelect from "../../common/SearchSelect/SearchSelect";
import SellerForm from "../../features/Sellers/SellerForm";
import UnitModal from "../../common/CreateModals/UnitModal";
import useSellerStore from "../../../store/sellerStore";
import useUnitStore from "../../../store/unitStore";
import toast from "react-hot-toast";
import {
  handleNumberInput,
  handleDecimalInput,
} from "../../../utils/validators";
import { FiPlus, FiEdit2, FiTrash2, FiLock } from "react-icons/fi";

const StockForm = ({
  stock,
  onSubmit,
  onCancel,
  isSubmitting,
  products,
  units: initialUnits,
}) => {
  const { user } = useAuthStore();
  const { createSeller, updateSeller, fetchSellers } = useSellerStore();
  const {
    units: storeUnits,
    fetchUnits,
    createUnit,
    loading: unitsLoading,
  } = useUnitStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [sellerSearchResults, setSellerSearchResults] = useState([]);
  const [unitSearchResults, setUnitSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingSeller, setIsSearchingSeller] = useState(false);
  const [isSearchingUnit, setIsSearchingUnit] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  const [sellerOptionsList, setSellerOptionsList] = useState([]);
  const [unitOptionsList, setUnitOptionsList] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [isSellerSearchActive, setIsSellerSearchActive] = useState(false);
  const [isUnitSearchActive, setIsUnitSearchActive] = useState(false);
  const [unitSearchTerm, setUnitSearchTerm] = useState("");

  // State for Seller Form Modal
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [isCreatingSeller, setIsCreatingSeller] = useState(false);
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [editingSeller, setEditingSeller] = useState(null);
  const [sellerSearchTerm, setSellerSearchTerm] = useState("");

  // State for Unit Modal
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [isCreatingUnit, setIsCreatingUnit] = useState(false);
  const [unitSearchTermForModal, setUnitSearchTermForModal] = useState("");

  // State for file input
  const [invoiceImageFile, setInvoiceImageFile] = useState(null);
  const [invoiceImagePreview, setInvoiceImagePreview] = useState(null);
  const [deletedImageId, setDeletedImageId] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      invoice_image: stock?.invoice_image || "",
    },
  });

  // Check if we're in edit mode
  const isEditMode = !!stock;

  // Fetch units on component mount
  useEffect(() => {
    const fetchUnitsData = async () => {
      try {
        await fetchUnits(1, { per_page: 100 });
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    };
    fetchUnitsData();
  }, [fetchUnits]);

  // Fetch sellers on component mount
  useEffect(() => {
    const fetchSellersData = async () => {
      setSellersLoading(true);
      try {
        const userId = user?.id || 1;
        const response = await sellerAPI.getByUserId(userId, {
          page: 1,
          per_page: 100,
        });
        console.log("📦 Sellers fetched:", response.data);

        let sellersData = [];

        if (response.data?.sellers?.data) {
          sellersData = Array.isArray(response.data.sellers.data)
            ? response.data.sellers.data
            : [];
        } else if (response.data?.sellers) {
          sellersData = Array.isArray(response.data.sellers)
            ? response.data.sellers
            : [];
        } else if (response.data?.data?.sellers) {
          sellersData = Array.isArray(response.data.data.sellers)
            ? response.data.data.sellers
            : [];
        } else if (response.data?.data?.data) {
          sellersData = Array.isArray(response.data.data.data)
            ? response.data.data.data
            : [];
        } else if (Array.isArray(response.data)) {
          sellersData = response.data;
        }

        console.log("📊 Sellers extracted:", sellersData.length);
        setSellers(sellersData);

        if (stock?.seller_id) {
          const seller = sellersData.find((s) => s.id === stock.seller_id);
          if (seller) {
            setSelectedSeller(seller);
            const sellerOption = {
              value: seller.id.toString(),
              label: seller.name,
              description: `📧 ${seller.email || "No email"}`,
              subtext: seller.phone ? `📞 ${seller.phone}` : null,
            };
            setSellerOptionsList((prev) => {
              const exists = prev.some(
                (opt) => opt.value === sellerOption.value,
              );
              if (!exists) {
                return [sellerOption, ...prev];
              }
              return prev;
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
        toast.error("Failed to load sellers");
      } finally {
        setSellersLoading(false);
      }
    };
    fetchSellersData();
  }, [user?.id, stock]);

  // Handle product selection
  const handleProductSelect = (productId) => {
    const id = parseInt(productId);
    const product =
      searchResults.length > 0
        ? searchResults.find((p) => p.id === id)
        : products?.find((p) => p.id === id);

    if (product) {
      setSelectedProduct(product);
      setValue("product_id", id);
      setValue("selling_price", product.selling_price || product.price || "");
      setValue("purchase_price", product.purchase_price || product.cost || "");

      // Auto-select unit from product if available
      if (product.unit_id) {
        const unit = storeUnits.find((u) => u.id === product.unit_id);
        if (unit) {
          setSelectedUnit(unit);
          setValue("unit_id", unit.id);
          const unitOption = {
            value: unit.id.toString(),
            label: `${unit.name} (${unit.code})`,
          };
          setUnitOptionsList((prev) => {
            const exists = prev.some((opt) => opt.value === unitOption.value);
            if (!exists) {
              return [unitOption, ...prev];
            }
            return prev;
          });
        }
      }

      setValue(
        "purchase_gst_percentage",
        product.purchase_gst_percentage_percentage ||
          product.purchase_gst_percentage ||
          "",
      );
      setValue(
        "selling_gst_percentage",
        product.gst_percentage || product.selling_gst_percentage || "",
      );

      console.log("📝 Product selected:", product.name);
    }
  };

  // Handle seller selection
  const handleSellerSelect = (sellerId) => {
    const id = parseInt(sellerId);
    const seller =
      sellerSearchResults.length > 0
        ? sellerSearchResults.find((s) => s.id === id)
        : sellers?.find((s) => s.id === id);

    if (seller) {
      setSelectedSeller(seller);
      setValue("seller_id", id);
      setSellerSearchResults([]);
      setIsSellerSearchActive(false);
    }
  };

  // Handle unit selection
  const handleUnitSelect = (unitId) => {
    const id = parseInt(unitId);
    const unit =
      unitSearchResults.length > 0
        ? unitSearchResults.find((u) => u.id === id)
        : storeUnits?.find((u) => u.id === id);

    if (unit) {
      setSelectedUnit(unit);
      setValue("unit_id", id);
      setUnitSearchResults([]);
      setIsUnitSearchActive(false);
    }
  };

  // Handle product search
  const handleProductSearch = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await productsAPI.search(searchTerm);
      const productsData =
        response.data?.data?.data || response.data?.data || [];
      setSearchResults(productsData);
    } catch (error) {
      console.error("Failed to search products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle seller search
  const handleSellerSearch = async (searchTerm) => {
    setSellerSearchTerm(searchTerm);

    if (searchTerm.length < 2) {
      setSellerSearchResults([]);
      setIsSellerSearchActive(false);
      return;
    }

    setIsSearchingSeller(true);
    setIsSellerSearchActive(true);

    try {
      const userId = user?.id || 1;
      const response = await sellerAPI.getByUserId(userId, {
        page: 1,
        per_page: 100,
        search: searchTerm,
      });

      let searchResults = [];
      if (response.data?.sellers?.data) {
        searchResults = Array.isArray(response.data.sellers.data)
          ? response.data.sellers.data
          : [];
      } else if (response.data?.sellers) {
        searchResults = Array.isArray(response.data.sellers)
          ? response.data.sellers
          : [];
      }

      console.log("🔍 Seller search results:", searchResults.length);
      setSellerSearchResults(searchResults);

      // If no results found, show a "Add New Seller" option
      if (searchResults.length === 0) {
        // We'll handle this in the SearchSelect component via custom render
      }
    } catch (error) {
      console.error("Failed to search sellers:", error);
      const filtered = sellers.filter(
        (seller) =>
          seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.phone?.includes(searchTerm),
      );
      setSellerSearchResults(filtered);
    } finally {
      setIsSearchingSeller(false);
    }
  };

  // Handle unit search
  const handleUnitSearch = async (searchTerm) => {
    setUnitSearchTerm(searchTerm);
    setUnitSearchTermForModal(searchTerm);

    if (searchTerm.length < 2) {
      setUnitSearchResults([]);
      setIsUnitSearchActive(false);
      return;
    }

    setIsSearchingUnit(true);
    setIsUnitSearchActive(true);

    try {
      const response = await fetchUnits(1, {
        per_page: 100,
        search: searchTerm,
      });

      // The store should update the units state
      const currentUnits = useUnitStore.getState().units;
      setUnitSearchResults(currentUnits);

      console.log("🔍 Unit search results:", currentUnits.length);
    } catch (error) {
      console.error("Failed to search units:", error);
      // Fallback to filtering local units
      const filtered = storeUnits.filter(
        (unit) =>
          unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          unit.code?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setUnitSearchResults(filtered);
    } finally {
      setIsSearchingUnit(false);
    }
  };

  // Handle creating a new unit from the modal
  const handleCreateUnit = async (unitData) => {
    setIsCreatingUnit(true);
    try {
      const userId = user?.id || 1;
      const data = {
        ...unitData,
        user_id: userId,
      };

      const response = await createUnit(data);
      console.log("✅ Unit created successfully:", response);

      // Extract the unit from the response
      let newUnit = null;
      if (response?.data?.data) {
        newUnit = response.data.data;
      } else if (response?.data?.unit) {
        newUnit = response.data.unit;
      } else if (response?.data?.id) {
        newUnit = response.data;
      } else if (response?.id) {
        newUnit = response;
      } else if (response?.data) {
        newUnit = response.data;
      }

      // If we have a valid unit with an id, select it
      if (newUnit && newUnit.id) {
        console.log("📦 New unit to select:", newUnit);

        // Add the new unit to the local storeUnits state
        const currentUnits = useUnitStore.getState().units;
        const updatedUnits = [newUnit, ...currentUnits];

        // Update the store directly using setState
        useUnitStore.setState({
          units: updatedUnits,
          totalUnits: currentUnits.length + 1,
        });

        // Select the newly created unit
        setSelectedUnit(newUnit);
        setValue("unit_id", newUnit.id);
        setUnitSearchResults([]);
        setIsUnitSearchActive(false);

        // Add to options list
        const unitOption = {
          value: newUnit.id.toString(),
          label: `${newUnit.name} (${newUnit.code})`,
        };
        setUnitOptionsList((prev) => {
          const exists = prev.some((opt) => opt.value === unitOption.value);
          if (!exists) {
            return [unitOption, ...prev];
          }
          return prev;
        });

        toast.success("Unit created and selected successfully");
        setShowUnitModal(false);
        setIsCreatingUnit(false);
        return;
      }

      // If we don't have a unit with id, refresh the list
      toast.success("Unit created successfully");

      // Refresh units list to get the new unit
      await fetchUnits(1, { per_page: 100 });

      // Try to find the newly created unit in the updated list by name or code
      const currentUnits = useUnitStore.getState().units;
      const foundUnit = currentUnits.find(
        (u) =>
          u.name?.toLowerCase() === unitData.name?.toLowerCase() ||
          u.code?.toLowerCase() === unitData.code?.toLowerCase(),
      );

      if (foundUnit && foundUnit.id) {
        console.log("🔍 Found unit after refresh:", foundUnit);

        setSelectedUnit(foundUnit);
        setValue("unit_id", foundUnit.id);
        setUnitSearchResults([]);
        setIsUnitSearchActive(false);

        // Add to options list
        const unitOption = {
          value: foundUnit.id.toString(),
          label: `${foundUnit.name} (${foundUnit.code})`,
        };
        setUnitOptionsList((prev) => {
          const exists = prev.some((opt) => opt.value === unitOption.value);
          if (!exists) {
            return [unitOption, ...prev];
          }
          return prev;
        });

        toast.success("Unit found and selected");
      } else {
        toast.info("Unit created. Please search for it in the list.");
      }

      setShowUnitModal(false);
    } catch (error) {
      console.error("Error creating unit:", error);
      toast.error(error.response?.data?.message || "Failed to create unit");
    } finally {
      setIsCreatingUnit(false);
    }
  };

  // Handle creating a new seller from the modal
  const handleCreateSeller = async (sellerData) => {
    setIsCreatingSeller(true);
    try {
      const userId = user?.id || 1;
      const data = {
        ...sellerData,
        user_id: userId,
      };

      const newSeller = await createSeller(data);
      console.log("✅ Seller created successfully:", newSeller);
      toast.success("Seller created successfully");

      // Refresh sellers list
      await refreshSellersList(userId);

      // Select the newly created seller
      const newSellerData =
        sellers.find((s) => s.id === newSeller.id) || newSeller;
      if (newSellerData) {
        setSelectedSeller(newSellerData);
        setValue("seller_id", newSellerData.id);
        setSellerSearchResults([]);
        setIsSellerSearchActive(false);

        // Add to options list
        const sellerOption = {
          value: newSellerData.id.toString(),
          label: newSellerData.name,
          description: `📧 ${newSellerData.email || "No email"}`,
          subtext: newSellerData.phone ? `📞 ${newSellerData.phone}` : null,
        };
        setSellerOptionsList((prev) => {
          const exists = prev.some((opt) => opt.value === sellerOption.value);
          if (!exists) {
            return [sellerOption, ...prev];
          }
          return prev;
        });
      }

      // Close modal
      setShowSellerModal(false);
      setIsEditingSeller(false);
      setEditingSeller(null);
    } catch (error) {
      console.error("Error creating seller:", error);
      toast.error(error.response?.data?.message || "Failed to create seller");
    } finally {
      setIsCreatingSeller(false);
    }
  };

  // Handle updating an existing seller
  const handleUpdateSeller = async (sellerData) => {
    setIsCreatingSeller(true);
    try {
      const userId = user?.id || 1;
      const data = {
        ...sellerData,
        user_id: userId,
      };

      const updatedSeller = await updateSeller(editingSeller.id, data);
      console.log("✅ Seller updated successfully:", updatedSeller);
      toast.success("Seller updated successfully");

      // Refresh sellers list
      await refreshSellersList(userId);

      // Update selected seller if it's the one being edited
      if (selectedSeller?.id === editingSeller.id) {
        const updatedSellerData = sellers.find(
          (s) => s.id === editingSeller.id,
        );
        if (updatedSellerData) {
          setSelectedSeller(updatedSellerData);
          setValue("seller_id", updatedSellerData.id);

          // Update options list
          const sellerOption = {
            value: updatedSellerData.id.toString(),
            label: updatedSellerData.name,
            description: `📧 ${updatedSellerData.email || "No email"}`,
            subtext: updatedSellerData.phone
              ? `📞 ${updatedSellerData.phone}`
              : null,
          };
          setSellerOptionsList((prev) => {
            const exists = prev.some((opt) => opt.value === sellerOption.value);
            if (!exists) {
              return [sellerOption, ...prev];
            }
            return prev;
          });
        }
      }

      // Close modal
      setShowSellerModal(false);
      setIsEditingSeller(false);
      setEditingSeller(null);
    } catch (error) {
      console.error("Error updating seller:", error);
      toast.error(error.response?.data?.message || "Failed to update seller");
    } finally {
      setIsCreatingSeller(false);
    }
  };

  // Refresh sellers list helper
  const refreshSellersList = async (userId) => {
    try {
      const response = await sellerAPI.getByUserId(userId, {
        page: 1,
        per_page: 100,
      });
      let sellersData = [];
      if (response.data?.sellers?.data) {
        sellersData = Array.isArray(response.data.sellers.data)
          ? response.data.sellers.data
          : [];
      } else if (response.data?.sellers) {
        sellersData = Array.isArray(response.data.sellers)
          ? response.data.sellers
          : [];
      }
      setSellers(sellersData);
      return sellersData;
    } catch (error) {
      console.error("Failed to refresh sellers:", error);
      return [];
    }
  };

  // Handle edit seller click from dropdown
  const handleEditSellerClick = (e, seller) => {
    e.stopPropagation(); // Prevent dropdown selection
    if (seller) {
      setEditingSeller(seller);
      setIsEditingSeller(true);
      setShowSellerModal(true);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoiceImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Clear any previous errors for this field
      if (errors.invoice_image) {
        // You might want to clear the error here
      }
      // Reset deletion state when new file is selected
      setIsImageDeleted(false);
      setDeletedImageId(null);
    } else {
      setInvoiceImageFile(null);
      setInvoiceImagePreview(null);
    }
  };

  // Handle delete image - sends deleted_image_id to server and clears preview
  const handleDeleteImage = () => {
    // Get the image ID from the seller_product or stock
    const sellerProduct = stock?.seller_product || null;
    const imageId = sellerProduct?.id || stock?.seller_product_id || null;
    
    if (imageId) {
      console.log("🗑️ Deleting image with ID:", imageId);
      setDeletedImageId(imageId);
      setIsImageDeleted(true);
      
      // Clear the preview and file
      setInvoiceImagePreview(null);
      setInvoiceImageFile(null);
      setValue("invoice_image", "");
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast.success("Image marked for deletion. Save to confirm.");
    } else {
      toast.error("No image found to delete");
    }
  };

  // Handle remove file (clear the file input without deleting from server)
  const handleRemoveFile = () => {
    setInvoiceImageFile(null);
    setInvoiceImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("invoice_image", "");
    // Don't reset deletion state here - we want to keep the deletion if it was set
  };

  // Custom render function for product options
  const renderProductOption = (option, index, isHighlighted, isSelected) => {
    const product =
      products?.find((p) => p.id === parseInt(option.value)) ||
      searchResults.find((p) => p.id === parseInt(option.value));
    return (
      <div
        key={option.value}
        className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
          isSelected ? "bg-primary-50 dark:bg-primary-900/20" : ""
        } ${isHighlighted ? "bg-gray-100 dark:bg-gray-700" : ""}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {option.label}
            </div>
            {option.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </div>
            )}
            {product && (
              <div className="mt-2 space-y-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.brand?.name && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      🏷️ {product.brand.name}
                    </span>
                  )}
                  {product.category?.name && (
                    <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      📂 {product.category.name}
                    </span>
                  )}
                  {product.unit?.name && (
                    <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      📦 {product.unit.name} ({product.unit.code})
                    </span>
                  )}
                </div>

                {product.attributes &&
                  Array.isArray(product.attributes) &&
                  product.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.attributes.map((attr, idx) => {
                        if (typeof attr === "object" && attr !== null) {
                          return Object.entries(attr).map(([key, value]) => (
                            <span
                              key={`${idx}-${key}`}
                              className="inline-block px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                            >
                              {key}: {value}
                            </span>
                          ));
                        }
                        return null;
                      })}
                    </div>
                  )}

                <div className="flex items-center gap-3 mt-1 text-xs">
                  {product.selling_price && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Selling: ₹{product.selling_price}
                    </span>
                  )}
                  {product.purchase_price && (
                    <span className="text-red-600 dark:text-red-400">
                      Purchase: ₹{product.purchase_price}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Custom render function for seller options with "Add New" and "Edit" options
  const renderSellerOption = (option, index, isHighlighted, isSelected) => {
    // Check if this is the "Add New Seller" option
    if (option.value === "add-new") {
      return (
        <div
          key={option.value}
          className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
            isHighlighted ? "bg-primary-50 dark:bg-primary-900/20" : ""
          } hover:bg-primary-50 dark:hover:bg-primary-900/20`}
          onClick={() => {
            setShowSellerModal(true);
            setIsEditingSeller(false);
            setEditingSeller(null);
            setIsSellerSearchActive(false);
            setSellerSearchResults([]);
          }}
        >
          <div className="flex items-center text-primary-600 dark:text-primary-400">
            <FiPlus className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Add New Seller: "{sellerSearchTerm}"
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
            Couldn't find the seller you're looking for? Create a new one.
          </p>
        </div>
      );
    }

    const seller = isSellerSearchActive
      ? sellerSearchResults.find((s) => s.id === parseInt(option.value))
      : sellers?.find((s) => s.id === parseInt(option.value)) ||
        sellerSearchResults.find((s) => s.id === parseInt(option.value));

    if (!seller) return null;

    const isSelectedSeller = selectedSeller?.id === seller.id;

    return (
      <div
        key={option.value}
        className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
          isSelectedSeller ? "bg-primary-50 dark:bg-primary-900/20" : ""
        } ${isHighlighted ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        onClick={() => handleSellerSelect(option.value)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {option.label}
            </div>
            {seller && (
              <div className="mt-1 space-y-1">
                <div className="flex flex-wrap gap-2 text-xs">
                  {seller.email && (
                    <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                      📧 {seller.email}
                    </span>
                  )}
                  {seller.phone && (
                    <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                      📞 {seller.phone}
                    </span>
                  )}
                  {seller.gst_number && (
                    <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                      GST: {seller.gst_number}
                    </span>
                  )}
                  {parseFloat(seller.due_amount) > 0 && (
                    <span className="inline-block px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                      Due: ₹{parseFloat(seller.due_amount).toFixed(2)}
                    </span>
                  )}
                </div>
                {(seller.city || seller.state) && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    📍 {[seller.city, seller.state].filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit Icon - positioned on the right */}
          <button
            type="button"
            onClick={(e) => handleEditSellerClick(e, seller)}
            className="ml-2 p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-shrink-0"
            title="Edit seller"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Custom render function for unit options with "Add New" option
  const renderUnitOption = (option, index, isHighlighted, isSelected) => {
    // Check if this is the "Add New Unit" option
    if (option.value === "add-new-unit") {
      return (
        <div
          key={option.value}
          className={`px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
            isHighlighted ? "bg-primary-50 dark:bg-primary-900/20" : ""
          } hover:bg-primary-50 dark:hover:bg-primary-900/20`}
          onClick={() => {
            setShowUnitModal(true);
            setIsUnitSearchActive(false);
            setUnitSearchResults([]);
          }}
        >
          <div className="flex items-center text-primary-600 dark:text-primary-400">
            <FiPlus className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Add New Unit: "{unitSearchTerm}"
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
            Couldn't find the unit you're looking for? Create a new one.
          </p>
        </div>
      );
    }

    const unit = isUnitSearchActive
      ? unitSearchResults.find((u) => u && u.id === parseInt(option.value))
      : storeUnits?.find((u) => u && u.id === parseInt(option.value)) ||
        unitSearchResults.find((u) => u && u.id === parseInt(option.value));

    if (!unit || !unit.id) return null;

    const isSelectedUnit = selectedUnit?.id === unit.id;

    return (
      <div
        key={option.value}
        className={`px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
          isSelectedUnit ? "bg-primary-50 dark:bg-primary-900/20" : ""
        } ${isHighlighted ? "bg-gray-100 dark:bg-gray-700" : ""}`}
        onClick={() => handleUnitSelect(option.value)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {unit.name || "Unknown Unit"} ({unit.code || "N/A"})
            </div>
            <div className="mt-1 space-y-1">
              <div className="flex flex-wrap gap-2 text-xs">
                {unit.code && (
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    Code: {unit.code}
                  </span>
                )}
                {unit.description && (
                  <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                    {unit.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // StockForm.jsx - Updated useEffect for better prefilling
  useEffect(() => {
    if (stock) {
      console.log("📝 StockForm - Stock prop received for editing:", stock);

      // Extract product data from the stock object
      const productData = stock.product || null;
      
      // Extract invoice details from seller_product if available
      const sellerProduct = stock.seller_product || null;
      
      // Get invoice details from seller_product or fallback to stock
      const invoiceNumber = sellerProduct?.invoice_number || stock.invoice_number || "";
      const invoiceDate = sellerProduct?.invoice_date || stock.invoice_date || "";
      const paidAmount = sellerProduct?.paid_amount || stock.paid_amount || 0;
      const invoiceImage = sellerProduct?.invoice_image || stock.invoice_image || "";
      const sellerId = sellerProduct?.seller_id || stock.seller_id || "";

      console.log("📄 Invoice details:", {
        invoiceNumber,
        invoiceDate,
        paidAmount,
        invoiceImage,
        sellerId
      });

      // Reset form with stock data
      reset({
        product_id: stock.product_id || "",
        seller_id: sellerId,
        quantity: stock.quantity || 0,
        selling_price: stock.selling_price || 0,
        purchase_price: stock.purchase_price || 0,
        unit_id: stock.unit_id || "",
        product_package_id: stock.product_package_id || null,
        invoice_number: invoiceNumber,
        invoice_image: invoiceImage,
        invoice_date: invoiceDate,
        paid_amount: parseFloat(paidAmount) || 0,
        purchase_gst_percentage: stock.purchase_gst_percentage || 0,
        selling_gst_percentage: stock.selling_gst_percentage || 0,
      });

      // Set selected product if product data is available
      if (productData && productData.id) {
        console.log("📦 Setting selected product:", productData);
        setSelectedProduct(productData);

        const productOption = {
          value: productData.id.toString(),
          label: productData.name || productData.product_name || "Unknown Product",
          description: `📦 SKU: ${productData.sku || productData.code || "N/A"}`,
          subtext: productData.brand?.name ? `🏷️ Brand: ${productData.brand.name}` : null,
        };
        setOptionsList((prev) => {
          const exists = prev.some((opt) => opt.value === productOption.value);
          if (!exists) {
            return [productOption, ...prev];
          }
          return prev;
        });
      } else if (stock.product_id) {
        // If product data is not embedded, try to find it in the products list
        const product = products?.find((p) => p.id === stock.product_id);
        if (product) {
          console.log("📦 Found product in list:", product);
          setSelectedProduct(product);
          const productOption = {
            value: product.id.toString(),
            label: product.name || product.product_name,
            description: `📦 SKU: ${product.sku || product.code || "N/A"}`,
            subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null,
          };
          setOptionsList((prev) => {
            const exists = prev.some((opt) => opt.value === productOption.value);
            if (!exists) {
              return [productOption, ...prev];
            }
            return prev;
          });
        }
      }

      // Set selected seller if seller_id is present
      if (sellerId) {
        // Try to find seller in the sellers list first
        let seller = sellers?.find((s) => s.id === parseInt(sellerId));
        
        // If not found in sellers list, try to get from stock or seller_product
        if (!seller && stock.seller) {
          seller = stock.seller;
        } else if (!seller && sellerProduct?.seller) {
          seller = sellerProduct.seller;
        }
        
        if (seller) {
          console.log("📦 Setting selected seller:", seller);
          setSelectedSeller(seller);
          const sellerOption = {
            value: seller.id.toString(),
            label: seller.name,
            description: `📧 ${seller.email || "No email"}`,
            subtext: seller.phone ? `📞 ${seller.phone}` : null,
          };
          setSellerOptionsList((prev) => {
            const exists = prev.some((opt) => opt.value === sellerOption.value);
            if (!exists) {
              return [sellerOption, ...prev];
            }
            return prev;
          });
        }
      }

      // Set selected unit if unit_id is present
      if (stock.unit_id) {
        const unit = storeUnits.find((u) => u.id === stock.unit_id);
        if (unit) {
          console.log("📦 Setting selected unit:", unit);
          setSelectedUnit(unit);
          const unitOption = {
            value: unit.id.toString(),
            label: `${unit.name} (${unit.code})`,
          };
          setUnitOptionsList((prev) => {
            const exists = prev.some((opt) => opt.value === unitOption.value);
            if (!exists) {
              return [unitOption, ...prev];
            }
            return prev;
          });
        }
      }

      // Set existing image preview if editing
      if (invoiceImage) {
        setInvoiceImagePreview(invoiceImage);
      }
      
      // Reset deletion state when stock changes
      setIsImageDeleted(false);
      setDeletedImageId(null);
      
    } else {
      // If no stock (creating new), reset to defaults
      reset({
        product_id: "",
        seller_id: "",
        quantity: 0,
        selling_price: 0,
        purchase_price: 0,
        unit_id: "",
        product_package_id: null,
        invoice_number: "",
        invoice_image: "",
        invoice_date: "",
        paid_amount: 0,
        purchase_gst_percentage: 0,
        selling_gst_percentage: 0,
      });
      setSelectedProduct(null);
      setSelectedSeller(null);
      setSelectedUnit(null);
      setInvoiceImagePreview(null);
      setInvoiceImageFile(null);
      setIsImageDeleted(false);
      setDeletedImageId(null);
    }
  }, [stock, reset, products, sellers, storeUnits]);

  const onFormSubmit = (data) => {
    // Create FormData to handle file upload
    const formData = new FormData();

    // Process each field with proper default values
    const processedData = {
      ...data,
      // Numeric fields - default to 0 if empty
      quantity:
        data.quantity !== undefined &&
        data.quantity !== "" &&
        data.quantity !== null
          ? Number(data.quantity)
          : 0,
      selling_price:
        data.selling_price !== undefined &&
        data.selling_price !== "" &&
        data.selling_price !== null
          ? Number(data.selling_price)
          : 0,
      purchase_price:
        data.purchase_price !== undefined &&
        data.purchase_price !== "" &&
        data.purchase_price !== null
          ? Number(data.purchase_price)
          : 0,
      paid_amount:
        data.paid_amount !== undefined &&
        data.paid_amount !== "" &&
        data.paid_amount !== null
          ? Number(data.paid_amount)
          : 0,
      purchase_gst_percentage:
        data.purchase_gst_percentage !== undefined &&
        data.purchase_gst_percentage !== "" &&
        data.purchase_gst_percentage !== null
          ? Number(data.purchase_gst_percentage)
          : 0,
      selling_gst_percentage:
        data.selling_gst_percentage !== undefined &&
        data.selling_gst_percentage !== "" &&
        data.selling_gst_percentage !== null
          ? Number(data.selling_gst_percentage)
          : 0,
      // String fields - default to null if empty
      invoice_number: data.invoice_number?.trim() || null,
    };

    // Append all fields except invoice_image and deleted_image_id (we handle them separately)
    Object.keys(processedData).forEach((key) => {
      if (
        key !== "invoice_image" &&
        key !== "deleted_image_id" &&
        processedData[key] !== undefined &&
        processedData[key] !== null
      ) {
        formData.append(key, processedData[key]);
      }
    });

    // Append user fields
    formData.append("user_id", user.id);
    formData.append("created_by", user.id);

    // Handle deleted image ID
    if (isImageDeleted && deletedImageId) {
      console.log("🗑️ Sending deleted_image_id:", deletedImageId);
      formData.append("deleted_image_id", deletedImageId);
    }

    // Handle invoice image
    if (invoiceImageFile) {
      // If there's a new file, append it
      formData.append("invoice_image", invoiceImageFile);
    } else if (stock?.invoice_image && !invoiceImageFile && !isImageDeleted) {
      // If editing and keeping existing image, append the existing image URL/string
      formData.append("invoice_image", stock.invoice_image);
    }
    // If no file and no existing image, or image is deleted, don't append the field

    console.log("📝 StockForm - FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Pass FormData to parent
    onSubmit(formData);
  };

  // Prepare options for SearchSelect
  const getProductOptions = () => {
    let productList = products || [];
    if (searchResults.length > 0) {
      productList = searchResults;
    }

    const options = productList.map((product) => ({
      value: product.id.toString(),
      label: product.name || product.product_name,
      description: `📦 SKU: ${product.sku || product.code || product.product_code || "N/A"}`,
      subtext: product.brand?.name ? `🏷️ Brand: ${product.brand.name}` : null,
    }));

    if (optionsList.length > 0) {
      const allOptions = [...optionsList];
      options.forEach((opt) => {
        if (!allOptions.some((existing) => existing.value === opt.value)) {
          allOptions.push(opt);
        }
      });
      return allOptions;
    }

    return options;
  };

  // Prepare options for Seller SearchSelect with "Add New" option
  const getSellerOptions = () => {
    let options = [];

    if (isSellerSearchActive && sellerSearchResults.length > 0) {
      options = sellerSearchResults.map((seller) => ({
        value: seller.id.toString(),
        label: seller.name,
        description: `📧 ${seller.email || "No email"}`,
        subtext: seller.phone ? `📞 ${seller.phone}` : null,
      }));
    } else if (!isSellerSearchActive) {
      let sellerList = sellers || [];
      options = sellerList.map((seller) => ({
        value: seller.id.toString(),
        label: seller.name,
        description: `📧 ${seller.email || "No email"}`,
        subtext: seller.phone ? `📞 ${seller.phone}` : null,
      }));

      if (sellerOptionsList.length > 0) {
        const allOptions = [...sellerOptionsList];
        options.forEach((opt) => {
          if (!allOptions.some((existing) => existing.value === opt.value)) {
            allOptions.push(opt);
          }
        });
        options = allOptions;
      }
    }

    // If there are no results and we're searching, add "Add New" option
    if (
      isSellerSearchActive &&
      sellerSearchResults.length === 0 &&
      sellerSearchTerm.length >= 2
    ) {
      options.push({
        value: "add-new",
        label: `Add New Seller: "${sellerSearchTerm}"`,
        description: "Click to create a new seller",
      });
    }

    return options;
  };

  // Prepare options for Unit SearchSelect with "Add New" option
  const getUnitOptions = () => {
    let options = [];

    try {
      if (isUnitSearchActive && unitSearchResults.length > 0) {
        options = unitSearchResults
          .filter((unit) => unit && typeof unit === "object" && unit.id)
          .map((unit) => ({
            value: String(unit.id),
            label: `${unit.name || "Unknown"} (${unit.code || "N/A"})`,
            description: unit.description || "",
          }));
      } else if (!isUnitSearchActive) {
        let unitList = storeUnits || [];
        options = unitList
          .filter((unit) => unit && typeof unit === "object" && unit.id)
          .map((unit) => ({
            value: String(unit.id),
            label: `${unit.name || "Unknown"} (${unit.code || "N/A"})`,
            description: unit.description || "",
          }));

        if (unitOptionsList.length > 0) {
          const allOptions = [...unitOptionsList];
          options.forEach((opt) => {
            if (!allOptions.some((existing) => existing.value === opt.value)) {
              allOptions.push(opt);
            }
          });
          options = allOptions;
        }
      }

      // If there are no results and we're searching, add "Add New" option
      if (
        isUnitSearchActive &&
        unitSearchResults.length === 0 &&
        unitSearchTerm.length >= 2
      ) {
        options.push({
          value: "add-new-unit",
          label: `Add New Unit: "${unitSearchTerm}"`,
          description: "Click to create a new unit",
        });
      }
    } catch (error) {
      console.error("Error getting unit options:", error);
    }

    return options;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditMode ? "Edit Stock Entry" : "Add New Stock Entry"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Hidden user_id field */}
        <input type="hidden" {...register("user_id")} value={user.id} />

        {/* Seller & Invoice Section - Now Optional */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <span className="w-1 h-5 bg-blue-500 rounded mr-2"></span>
            Seller & Invoice Details{" "}
            <span className="text-xs text-gray-400 ml-2">(Optional)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SearchSelect
                label="Seller Name"
                options={getSellerOptions()}
                value={selectedSeller?.id?.toString() || ""}
                onChange={handleSellerSelect}
                placeholder="Search seller by name, email, or phone..."
                required={false}
                renderOption={renderSellerOption}
                onSearchChange={handleSellerSearch}
                isLoading={isSearchingSeller || sellersLoading}
                minSearchLength={2}
                noOptionsMessage={
                  isSellerSearchActive &&
                  sellerSearchResults.length === 0 &&
                  sellerSearchTerm.length >= 2
                    ? 'No sellers found. Click "Add New Seller" to create one.'
                    : "No sellers available"
                }
              />
            </div>

            <Input
              label="Invoice Number"
              type="text"
              placeholder="Enter invoice number (Optional)"
              error={errors.invoice_number?.message}
              {...register("invoice_number")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Invoice Date"
              type="date"
              placeholder="Select invoice date"
              error={errors.invoice_date?.message}
              {...register("invoice_date")}
            />

            <Input
              label="Paid Amount"
              type="text"
              step="0.01"
              placeholder="Enter paid amount"
              error={errors.paid_amount?.message}
              {...register("paid_amount", {
                valueAsNumber: true,
                onChange: (e) => handleDecimalInput(e),
              })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Invoice Image - Optional file input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Image{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>

              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100
                    dark:file:bg-primary-900/20 dark:file:text-primary-400
                    dark:hover:file:bg-primary-900/30
                    cursor-pointer"
                />

                {invoiceImageFile && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove file"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {/* Delete Image Button - Only show when editing and image exists */}
                {isEditMode && !invoiceImageFile && invoiceImagePreview && !isImageDeleted && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete image"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Preview or existing image */}
              {invoiceImagePreview && !isImageDeleted && (
                <div className="mt-3">
                  <div className="relative inline-block">
                    <img
                      src={invoiceImagePreview}
                      alt="Invoice preview"
                      className="max-h-32 rounded-lg border border-gray-200 dark:border-gray-700 object-contain"
                    />
                    <span className="absolute top-1 right-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                      Current
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {invoiceImageFile
                      ? invoiceImageFile.name
                      : "Existing image"}
                  </p>
                </div>
              )}

              {/* Show deleted state */}
              {isImageDeleted && (
                <div className="mt-3">
                  <div className="relative inline-block">
                    <div className="max-h-32 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-4">
                      <div className="text-center">
                        <FiTrash2 className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Image marked for deletion
                        </p>
                        <p className="text-xs text-red-500 dark:text-red-300">
                          Save to confirm deletion
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsImageDeleted(false);
                      setDeletedImageId(null);
                      // Restore the preview
                      const sellerProduct = stock?.seller_product || null;
                      const image = sellerProduct?.invoice_image || stock?.invoice_image || "";
                      if (image) {
                        setInvoiceImagePreview(image);
                      }
                    }}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Undo deletion
                  </button>
                </div>
              )}

              {stock?.invoice_image && !invoiceImageFile && !isImageDeleted && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Current file: {stock.invoice_image}
                </div>
              )}

              {errors.invoice_image && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.invoice_image.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section - Required */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <span className="w-1 h-5 bg-green-500 rounded mr-2"></span>
            Product Details{" "}
            <span className="text-xs text-red-500 ml-2">*Required</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchSelect
              label="Product"
              options={getProductOptions()}
              value={selectedProduct?.id?.toString() || ""}
              onChange={handleProductSelect}
              placeholder="Search product by name, SKU, brand..."
              required
              renderOption={renderProductOption}
              onSearchChange={handleProductSearch}
              isLoading={isSearching}
              minSearchLength={2}
            />

            <div className="relative">
              <Input
                label="Quantity"
                type="text"
                min="1"
                step="1"
                placeholder="Enter quantity (default: 0)"
                error={errors.quantity?.message}
                disabled={isEditMode}
                className={isEditMode ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-75" : ""}
                {...register("quantity", {
                  required: "Quantity is required",
                  valueAsNumber: true,
                  onChange: (e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, "");
                    e.target.value = value;
                    handleNumberInput(e);
                  },
                })}
              />
              {isEditMode && (
                <div className="absolute right-3 top-[38px] text-gray-400 dark:text-gray-500">
                  <FiLock className="w-4 h-4" title="Quantity is locked during edit" />
                </div>
              )}
              {isEditMode && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                  <FiLock className="w-3 h-3 mr-1" />
                  Quantity cannot be changed during edit. Use "Add Stock" to increase quantity.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Purchase Price"
              type="text"
              step="0.01"
              placeholder="Enter purchase price (default: 0)"
              error={errors.purchase_price?.message}
              {...register("purchase_price", {
                valueAsNumber: true,
                onChange: (e) => handleDecimalInput(e),
              })}
            />

            <Input
              label="Purchase GST (%)"
              type="text"
              step="0.01"
              placeholder="Enter purchase GST percentage (default: 0)"
              error={errors.purchase_gst_percentage?.message}
              {...register("purchase_gst_percentage", {
                valueAsNumber: true,
                onChange: (e) => {
                  // Only allow digits and decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  e.target.value = value;
                  handleDecimalInput(e);
                },
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Selling Price"
              type="text"
              step="0.01"
              placeholder="Enter selling price (default: 0)"
              error={errors.selling_price?.message}
              {...register("selling_price", {
                valueAsNumber: true,
                onChange: (e) => handleDecimalInput(e),
              })}
            />

            <Input
              label="Selling GST (%)"
              type="text"
              step="0.01"
              placeholder="Enter selling GST percentage (default: 0)"
              error={errors.selling_gst_percentage?.message}
              {...register("selling_gst_percentage", {
                valueAsNumber: true,
                onChange: (e) => {
                  // Only allow digits and decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  e.target.value = value;
                  handleDecimalInput(e);
                },
              })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchSelect
              label="Unit"
              options={getUnitOptions()}
              value={selectedUnit?.id?.toString() || ""}
              onChange={handleUnitSelect}
              placeholder="Search unit by name or code..."
              required
              renderOption={renderUnitOption}
              onSearchChange={handleUnitSearch}
              isLoading={isSearchingUnit || unitsLoading}
              minSearchLength={2}
              noOptionsMessage={
                isUnitSearchActive &&
                unitSearchResults.length === 0 &&
                unitSearchTerm.length >= 2
                  ? 'No units found. Click "Add New Unit" to create one.'
                  : unitsLoading
                    ? "Loading units..."
                    : "No units available"
              }
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit(onFormSubmit)}
            isLoading={isSubmitting}
          >
            {isEditMode ? "Update Stock" : "Create Stock"}
          </Button>
        </div>
      </motion.div>

      {/* Seller Creation/Edit Modal */}
      <AnimatePresence>
        {showSellerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            style={{ marginTop: 0 }}
            onClick={() => {
              if (!isCreatingSeller) {
                setShowSellerModal(false);
                setIsEditingSeller(false);
                setEditingSeller(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <SellerForm
                seller={isEditingSeller ? editingSeller : null}
                onSubmit={
                  isEditingSeller ? handleUpdateSeller : handleCreateSeller
                }
                onCancel={() => {
                  if (!isCreatingSeller) {
                    setShowSellerModal(false);
                    setIsEditingSeller(false);
                    setEditingSeller(null);
                  }
                }}
                isSubmitting={isCreatingSeller}
                isEdit={isEditingSeller}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unit Creation Modal */}
      <UnitModal
        isOpen={showUnitModal}
        onClose={() => {
          if (!isCreatingUnit) {
            setShowUnitModal(false);
          }
        }}
        onCreate={handleCreateUnit}
        initialName={unitSearchTermForModal}
      />
    </>
  );
};

export default StockForm;