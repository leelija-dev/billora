// services/filterService.js
import { apiRequest } from "@/utils/api";

// Simple search function - just sends filters as query params
export const searchPlans = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
console.log("🔵 Filter Service - Search Plans with filters:", queryParams);
  const endpoint = queryParams ? `/plans/search?${queryParams}` : '/plans/search';

  return await apiRequest(endpoint, 'GET');
};