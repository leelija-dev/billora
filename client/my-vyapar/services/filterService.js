// services/filterService.js
import { apiRequest } from "@/utils/api";
import { logger } from '../utils/logger';

// Search plans by business type name parameter
export const searchPlans = async (filters = {}) => {
  // Use the 'name' parameter as specified in the backend API
  const searchValue = filters.search || 'all'; // Default to 'all' for showing all plans
  logger.log("Filter Service - Search Plans with name:", searchValue);
  const endpoint = `/plans/search?name=${searchValue}`;

  return await apiRequest(endpoint, 'GET');
};