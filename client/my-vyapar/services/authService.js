import { api } from "../utils/secureApi";

export const loginUser = async (userData) => {
  try {
    await api.get("/sanctum/csrf-cookie");
    const response = await api.post("/users/login", userData);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/users/logout");
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return response;
  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return { status: true, message: "Logged out successfully" };
  }
};

export const checkSession = async () => {
  try {
    const response = await api.get("/users/check-session");
    return response.data;
  } catch (error) {
    return { status: false, message: 'Not authenticated' };
  }
};



// // services/authService.js
// import { api } from "../utils/secureApi";
// import { ERROR_MESSAGES } from "../constants";

// export const loginUser = async (userData) => {
//   try {
//     const response = await api.post("/users/login", userData);
    
//     // Handle both response formats (success OR status)
//     if ((response.success || response.status) && response.data) {
//       // Let Zustand handle storage via persist middleware
//     }
    
//     return response;
//   } catch (error) {
//     // Provide specific error messages
//     if (error.message?.includes("User not found")) {
//       throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
//     } else if (error.message?.includes("password")) {
//       throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
//     } else if (error.message?.includes("verify")) {
//       throw new Error(ERROR_MESSAGES.AUTH.EMAIL_NOT_VERIFIED);
//     } else {
//       throw error;
//     }
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     const response = await api.post("/users/register", userData);
    
//     // Handle both response formats
//     if ((response.success || response.status) && response.data) {
//       // Let Zustand handle storage via persist middleware
//     }
    
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const logoutUser = async (userId) => {
//   try {
//     const response = await api.post("/users/logout", { user_id: userId });
    
//     if (response?.status === true || response?.success === true) {
//       // Success case - handled by caller
//     }
    
//     return response;
//   } catch (error) {
//     // Don't throw error for logout - always succeed locally
//     return { success: true, message: "Logged out successfully" };
//   }
// };