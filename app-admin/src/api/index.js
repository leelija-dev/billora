// Central API exports with mock support
export { authAPI } from './auth';
export { productsAPI } from './products';
export { brandsAPI } from './brands';
export { stocksAPI } from './stocks';
export { invoicesAPI } from './invoices';
export { storesAPI } from './stores';
export { customersAPI } from './customers';

// Legacy exports for backward compatibility
export { ordersAPI } from './orders';
export { inventoryAPI } from './inventory';
export { dashboardAPI } from './dashboard';

// Re-export client for direct use if needed
export { default as apiClient } from './client';

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  PROJECT_MODE: process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock',
  TIMEOUT: 10000,
};

// Utility function to check if we're in mock mode
export const isMockMode = () => {
  return API_CONFIG.PROJECT_MODE === 'mock';
};

// Utility function to get API base URL
export const getApiBaseUrl = () => {
  return API_CONFIG.BASE_URL;
};
