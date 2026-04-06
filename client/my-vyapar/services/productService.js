// services/productService.js
import { apiRequest } from "../utils/api";
import { getAuthData } from "../store/authStore";

const getUserId = () => {
  const { user } = getAuthData();
  console.log("Getting user ID from auth:", user);
  
  if (!user || !user.id) {
    console.error("User not authenticated or missing ID");
    throw new Error("User not authenticated");
  }
  return user.id;
};

// Try different endpoints
export const getProducts = async () => {
  try {
    const userId = getUserId();
    
    // List of endpoints to try
    const endpoints = [
      `/restaurant-all-products/${userId}`,      // Pattern 1: Your current endpoint
      `/products/restaurant/${userId}`,          // Pattern 2
      `/restaurant/${userId}/products`,          // Pattern 3
      `/user/${userId}/products`,                // Pattern 4
      `/all-products/${userId}`,                 // Pattern 5
      `/products/user/${userId}`,                // Pattern 6
    ];
    
    let lastError = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      console.log(`Trying endpoint: ${endpoint}`);
      
      try {
        const response = await apiRequest(endpoint);
        console.log(`Response from ${endpoint}:`, response);
        
        // Check if response has products
        let hasProducts = false;
        
        if (Array.isArray(response) && response.length > 0) {
          hasProducts = true;
        } else if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
          hasProducts = true;
        } else if (response?.products && Array.isArray(response.products) && response.products.length > 0) {
          hasProducts = true;
        } else if (response?.result && Array.isArray(response.result) && response.result.length > 0) {
          hasProducts = true;
        }
        
        if (hasProducts) {
          console.log(`✅ Found products using endpoint: ${endpoint}`);
          return response;
        } else {
          console.log(`❌ No products found at ${endpoint}`);
        }
        
      } catch (error) {
        console.log(`Error with endpoint ${endpoint}:`, error.message);
        lastError = error;
      }
    }
    
    // If all endpoints fail, throw error
    throw new Error(lastError || "No working endpoint found");
    
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  const userId = getUserId();
  return await apiRequest(`/restaurant-all-products/${userId}/${id}`);
};

export const createProduct = async (productData) => {
  const userId = getUserId();
  return await apiRequest(`/restaurant-all-products/${userId}/store`, "POST", productData);
};

export const updateProduct = async (id, productData) => {
  const userId = getUserId();
  return await apiRequest(`/restaurant-all-products/${userId}/${id}`, "PUT", productData);
};

export const deleteProduct = async (id) => {
  const userId = getUserId();
  return await apiRequest(`/restaurant-all-products/${userId}/${id}`, "DELETE");
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};