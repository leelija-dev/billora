
import { apiRequest } from "../utils/api";

export const getBusinessTypes = async () => {
  try {
    const res = await apiRequest(API_ROUTES.BUSINESS_TYPE);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch business types" };
  }
};