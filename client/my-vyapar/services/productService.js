// services/productService.js
import { apiRequest } from "../utils/api";
import { getAuthData } from "../store/authStore";

const getUserId = () => {
  const { user } = getAuthData();
  if (!user || !user.id) throw new Error("User not authenticated");
  return user.id;
};

export const getProducts = async () => {
  const userId = getUserId();
  return await apiRequest(`/restaurant-all-products/${userId}`);
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