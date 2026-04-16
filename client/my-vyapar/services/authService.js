// services/authService.js
import { apiRequest } from "../utils/api";
import { clearAuthData, saveAuthData } from "../store/authStore";

export const loginUser = async (userData) => {
  const response = await apiRequest("/users/login", "POST", userData);
  
  // Handle both response formats (success OR status)
  if ((response.success || response.status) && response.data) {
    saveAuthData(response.data.user, response.data.token);
  }
  
  return response;
};

export const registerUser = async (userData) => {
  const response = await apiRequest("/users/register", "POST", userData);
  
  // Handle both response formats
  if ((response.success || response.status) && response.data) {
    saveAuthData(response.data.user, response.data.token);
  }
  
  return response;
};

export const logoutUser = async (userId) => {
  try {
    const response = await apiRequest("/users/logout", "POST", { user_id: userId });
    
    // Log the response to see what we're getting
    console.log('Logout API response:', response);
    
    // Check if logout was successful (handles both 'success' and 'status')
    if (response.status === true || response.success === true) {
      console.log('✅ Server logout successful');
    } else {
      console.warn('⚠️ Logout API returned:', response);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Logout API error:', error);
    throw error;
  } finally {
    // Always clear local auth data, even if API call fails
    console.log('🗑️ Clearing local auth data');
    clearAuthData();
  }
};