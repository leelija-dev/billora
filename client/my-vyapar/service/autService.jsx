import { apiRequest } from "@/utils/api";

export const loginUser = (data) => {
  return apiRequest("/users/login", "POST", data);
};

export const registerUser = (data) => {
  return apiRequest("/users/store", "POST", data);
};

export const logoutUser = (user_id) => {
  return apiRequest("/users/logout", "POST", { user_id });
};