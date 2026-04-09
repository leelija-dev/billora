// services/productService.js
import { apiRequest } from "../utils/api";
import { getAuthData } from "../store/authStore";

const getUserId = () => {
  const { user } = getAuthData();
  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
};

// Get all products - Using your working endpoint
export const getProducts = async () => {
  try {
    const userId = getUserId();
    console.log("Fetching products for user ID:", userId);
    const response = await apiRequest(`/restaurant-all-products/${userId}`);
    console.log("Products API response:", response);
    
    let productsArray = [];
    
    // Handle different response structures
    if (response?.products?.data && Array.isArray(response.products.data)) {
      productsArray = response.products.data;
    } else if (response?.data && Array.isArray(response.data)) {
      productsArray = response.data;
    } else if (Array.isArray(response)) {
      productsArray = response;
    } else if (response?.products && Array.isArray(response.products)) {
      productsArray = response.products;
    }
    
    console.log(`Found ${productsArray.length} products`);
    return productsArray;
  } catch (error) {
    console.error("Error in getProducts:", error);
    return []; // Return empty array instead of throwing
  }
};

// Get user's store - Using your working endpoint
export const getUserStore = async () => {
  try {
    const userId = getUserId();
    console.log("Fetching store for user ID:", userId);
    const response = await apiRequest(`/store/${userId}`);
    console.log("Store API response:", response);
    
    if (response?.data && response.data.length > 0) {
      const storeId = response.data[0].id;
      console.log("Store ID found:", storeId);
      return storeId;
    }
    
    // Try alternative response format
    if (response?.store?.id) {
      return response.store.id;
    }
    
    if (response?.id) {
      return response.id;
    }
    
    console.log("No store found for user");
    return null;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
};

// Place order
export const placeOrder = async (orderData) => {
  try {
    console.log("Placing order:", orderData);
    const response = await apiRequest("/orders/store", "POST", orderData);
    console.log("Order response:", response);
    return response;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// Get single product by ID
export const getProduct = async (id) => {
  try {
    const userId = getUserId();
    const response = await apiRequest(`/restaurant-all-products/${userId}`);
    
    let productsArray = [];
    if (response?.products?.data && Array.isArray(response.products.data)) {
      productsArray = response.products.data;
    } else if (response?.data && Array.isArray(response.data)) {
      productsArray = response.data;
    } else if (Array.isArray(response)) {
      productsArray = response;
    }
    
    const product = productsArray.find(p => p.id === parseInt(id));
    return product || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export default {
  getProducts,
  getUserStore,
  placeOrder,
  getProduct,
};