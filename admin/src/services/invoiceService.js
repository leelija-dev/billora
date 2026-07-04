import { apiClient } from "./apiClient";

let secretKey = import.meta.env.VITE_SECRET_ENCRYPTION_KEY;

export const invoiceAPI = {
  // Get all invoices/bills history with pagination and search
  getAll: (page = 1, filters = {}) => {
    const params = new URLSearchParams();

    if (page) {
      params.append("page", page);
    }

    if (filters.search) {
      params.append("search", filters.search);
    }

    if (filters.status) {
      params.append("status", filters.status);
    }

    if (filters.start_date) {
      params.append("start_date", filters.start_date);
    }

    if (filters.end_date) {
      params.append("end_date", filters.end_date);
    }

    if (filters.store) {
      params.append("store", filters.store);
    }

    if (filters.due_amount) {
      params.append("due_amount", filters.due_amount);
    }

    return apiClient.get(`/invoice/bill-history?${params.toString()}`);
  },

  // Get single invoice/bill with payment history filters
  getById: (id, startDate = "", endDate = "") => {
  const params = new URLSearchParams();

  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);

  let originalId = id;
  
  // Check if the ID is a string that looks like Base64 (has length > 0 and contains only Base64 chars)
  // If it's a number or plain ID, use it directly
  if (typeof id === 'string' && id.length > 0 && !/^\d+$/.test(id)) {
    try {
      // Decode Base64
      const decoded = atob(id);
      // Remove secret key from end
      originalId = decoded.replace(secretKey, "");
      console.log("Decoded ID from Base64:", originalId);
    } catch (error) {
      console.error("Failed to decode Base64 ID, using original:", id);
      originalId = id;
    }
  } else {
    console.log("Using plain ID:", originalId);
  }

  // Ensure we have a valid ID
  if (!originalId || originalId === '×}') {
    console.error("Invalid invoice ID:", originalId);
    throw new Error(`Invalid invoice ID: ${originalId}`);
  }

  return apiClient.get(`/invoice/${originalId}?${params.toString()}`);
},

  // Get bill generate page data
  getBillGenerateData: (userId) => {
    if (!userId) {
      console.error("User ID is required for getBillGenerateData");
      return apiClient.get("/invoice");
    }
    console.log("Fetching bill generate data for user ID:", userId);
    return apiClient.get("/invoice", {
      params: { user_id: userId },
    });
  },

  // Get customer details by ID
  getCustomer: (customerId) => {
    return apiClient.get(`/customer/show/${customerId}`);
  },

  // Get store details by ID - Using the correct edit endpoint
  getStore: (storeId) => {
    return apiClient.get(`/store/edit/${storeId}`);
  },

  // Create/store new invoice/bill
  create: (invoiceData) => {
    console.log("Creating invoice with data:", invoiceData);
    return apiClient.post("/invoice/store", invoiceData);
  },

  // Update invoice/bill
  update: (id, invoiceData) => {
    return apiClient.put(`/invoice/${id}`, invoiceData);
  },

  // Delete invoice/bill
  delete: (id) => {
    return apiClient.delete(`/invoice/${id}`);
  },

  // Cancel invoice — restores stock (if permitted), reverses customer due, updates GST rows and status
  updateBillStatus: (id) => {
    return apiClient.put(`/invoice/update-bill-status/${id}`, {});
  },

  // Pay invoice-wise due (partial or full)
  invoiceDuePay: (id, payload) => {
    return apiClient.put(`/invoice/invoice-due-pay/${id}`, {
      paid_amount: payload.paid_amount,
      payment_method: payload.payment_method,
    });
  },
};

export default invoiceAPI;