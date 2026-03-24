// API Configuration and Utilities
import { apiClient } from './apiClient';

// Environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock';
export const MOCK_API_DELAY = parseInt(import.meta.env.VITE_MOCK_API_DELAY) || 800;

// Utility functions
export const isMockMode = () => DATA_SOURCE === 'mock';
export const getApiBaseUrl = () => API_BASE_URL;

// Mock API wrapper with delay simulation (for testing)
const mockApiWrapper = (fn) => {
  return async (...args) => {
    console.log(`[Mock API] Calling ${fn.name || 'mock function'}`, args);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    try {
      const result = fn(...args);
      console.log(`[Mock API] Response:`, result);
      return { data: result };
    } catch (error) {
      console.error(`[Mock API] Error:`, error);
      throw {
        response: {
          status: 400,
          data: { message: error.message }
        }
      };
    }
  }
};

// API mode selector
export const createApiMethod = (mockFn, realFn) => {
  return isMockMode() ? mockApiWrapper(mockFn) : realFn;
};

console.log(`🔧 API Mode: ${isMockMode() ? 'MOCK' : 'REAL'} (${DATA_SOURCE})`);
console.log(`🌐 API Base URL: ${API_BASE_URL}`);

export { apiClient };
