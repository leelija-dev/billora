import { apiRequest } from "@/utils/api";

// Get all plans
export const getPlans = () => {
  return apiRequest("/plans", "GET");
};

// Subscribe plan
export const subscribePlan = (data) => {
  return apiRequest("/subscribe", "POST", data);
};