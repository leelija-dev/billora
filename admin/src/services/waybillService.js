import { apiClient } from "./apiClient";

export const waybillAPI = {
  // GET /invoice/waybills?invoice_id=12
  list: (params = {}) => apiClient.get("/invoice/waybills", { params }),

  // POST /invoice/generate-waybill/{userId}
  generate: (userId, data) =>
    apiClient.post(`/invoice/generate-waybill/${userId}`, data),
  update: (id, data) => apiClient.put(`/invoice/update-waybill/${id}`, data),
};


export default waybillAPI;
