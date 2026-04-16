import { apiRequest } from "../utils/api";

export const getBusinessTypes = async () => {
  try {
    // Make sure the URL is correct
    // If your API base URL is already set in apiRequest, just use the relative path
    const res = await apiRequest('/business-type'); // or '/business-type' without 's'
    console.log("Business types response:", res);
    return res;
  } catch (error) {
    console.error("Business types API error:", error);
    throw error.response?.data || { message: "Failed to fetch business types" };
  }
};