// src/services/productService.js

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Generic API handler
const apiRequest = async (endpoint, options = {}) => {
  if (!BASE_URL) {
    throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in .env.local");
  }

  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log("Fetching:", url); // This helps debug
    
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw new Error(`Failed to fetch from API: ${error.message}. Make sure your API server is running at ${BASE_URL}`);
  }
};

// Get all products
export const getProducts = async () => {
  return await apiRequest("/products");
};

// Get products by category
export const getProductsByCategory = async (category) => {
  return await apiRequest(`/products/category/${category}`);
};

// Get all categories
export const getCategories = async () => {
  return await apiRequest("/products/categories");
};

// Place order (POST request)
export const placeOrder = async (orderData) => {
  return await apiRequest("/orders", {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
};