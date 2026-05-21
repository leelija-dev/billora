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
      params.delete("page", page);
      params.append("search", filters.search);
    }

    return apiClient.get(`/invoice/bill-history?${params.toString()}`);
  },

  // Get single invoice/bill with payment history filters
  getById: (id, startDate = "", endDate = "") => {
    const params = new URLSearchParams();

    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    // Decode Base64
  const decoded = atob(id);

  // Remove secret key from end
  const originalId = decoded.replace(secretKey, "");

  console.log("Original ID:", originalId);

    return apiClient.get(`/invoice/${originalId}?${params.toString()}`);
  },

  // Get bill generate page data
  getBillGenerateData: (userId) => {
    if (!userId) {
      console.error("User ID is required for getBillGenerateData");
      return apiClient.get("/invoice");
    }
    console.log("Fetching bill generate data for user ID:", userId); // Debug log
    return apiClient.get("/invoice", {
      params: { user_id: userId },
    });
  },

  // Get customer details by ID
  getCustomer: (customerId) => {
    return apiClient.get(`/customer/show/${customerId}`);
  },

  // Get store details by ID
  getStore: (storeId) => {
    return apiClient.get(`/store/${storeId}`);
  },

  // Create/store new invoice/bill
  create: (invoiceData) => {
    console.log("Creating invoice with data:", invoiceData); // Debug log
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
