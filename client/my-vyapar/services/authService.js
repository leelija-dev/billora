import { apiRequest } from "../utils/api";

export const loginUser = (userData) => {
  return apiRequest("/users/login", "POST", userData);
};

export const registerUser = (userData) => {
  return apiRequest("/users/register", "POST", userData);
};

export const logoutUser = (userId) => {
  return apiRequest("/users/logout", "POST", { user_id: userId });
};