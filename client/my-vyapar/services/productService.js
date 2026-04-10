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

// Get all products
export const getProducts = async () => {
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
    
    return productsArray;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
};

// Get user's store
export const getUserStore = async () => {
  try {
    const userId = getUserId();
    const response = await apiRequest(`/store/${userId}`);
    if (response?.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching store:", error);
    return null;
  }
};

// Place order
export const placeOrder = async (orderData) => {
  return await apiRequest("/orders/store", "POST", orderData);
};

export default {
  getProducts,
  getUserStore,
  placeOrder,
};