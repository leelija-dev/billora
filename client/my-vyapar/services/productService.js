// services/productService.js
import { apiRequest } from '../utils/api';
import { getAuthData } from '../store/authStore';

// Helper to get current logged-in user's ID
const getUserId = () => {
  const { user } = getAuthData(); // user object stored at login/registration
  if (!user || !user.id) throw new Error("User not authenticated");
  return user.id;
};

// Get all products (optional search)
export const getProducts = async (search = '') => {
  const userId = getUserId();
  let endpoint = `restaurant-all-products/${userId}`;
  if (search) endpoint += `?search=${encodeURIComponent(search)}`;
  return await apiRequest(endpoint, 'GET');
};

// Get single product by ID
export const getProductById = async (id) => {
  const userId = getUserId();
  return await apiRequest(`restaurant-all-products/${userId}/${id}`, 'GET');
};

// Create a new product
export const createProduct = async (productData) => {
  const userId = getUserId();
  return await apiRequest(`restaurant-all-products/${userId}/store`, 'POST', productData);
};

// Update existing product
export const updateProduct = async (id, productData) => {
  const userId = getUserId();
  return await apiRequest(`restaurant-all-products/${userId}/${id}`, 'PUT', productData);
};

// Delete product
export const deleteProduct = async (id) => {
  const userId = getUserId();
  return await apiRequest(`restaurant-all-products/${userId}/${id}`, 'DELETE');
};

// Restore soft-deleted product
export const restoreProduct = async (id) => {
  const userId = getUserId();
  return await apiRequest(`restaurant-all-products/${userId}/${id}`, 'PATCH');
};

// Force delete product
export const forceDeleteProduct = async (id) => {
  const userId = getUserId();
  return await apiRequest(`restaurant-all-products/${userId}/${id}/force`, 'DELETE');
};