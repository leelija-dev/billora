import { apiRequest } from "../utils/api";

// REGISTER
export const registerUser = async (userData) => {
  return await apiRequest("/users/store", "POST", userData);
};

// LOGIN
export const loginUser = async (userData) => {
  return await apiRequest("/users/login", "POST", userData);
};

// LOGOUT
export const logoutUser = async (userId) => {
  return await apiRequest("/users/logout", "POST", { user_id: userId });
};