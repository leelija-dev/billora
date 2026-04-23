// services/filterService.js
import { apiRequest } from "@/utils/api";
import { logger } from '../utils/logger';

// Search plans by business type parameter
export const searchPlans = async (filters = {}) => {
  // Use the 'search' parameter as specified in the backend API
  const searchValue = filters.search || 'all'; // Default to 'all' for showing all plans
  logger.log("Filter Service - Search Plans with search:", searchValue);
  const endpoint = `/plans/search?search=${searchValue}`;

  return await apiRequest(endpoint, 'GET');
};