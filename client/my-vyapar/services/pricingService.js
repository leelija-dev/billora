import { apiRequest } from "@/utils/api";

// Get all plans
export const getPlans = () => {
  return apiRequest("/plans/", "GET");
};

// Get single plan
export const getPlan = (id) => {
  return apiRequest(`/plans/${id}`, "GET");
};

// Search plans by business type
export const searchPlans = (searchTerm) => {
  return apiRequest(`/plans/search?name=${searchTerm}`, "GET");
};

// Subscribe plan (create order)
export const subscribePlan = (data) => {
  return apiRequest("/cashfree/create-order", "POST", data);
};

// Get user plan purchase history
export const getPlanPurchaseHistory = (userId) => {
  return apiRequest(`/plans-purchase-history/${userId}`, "GET");
};