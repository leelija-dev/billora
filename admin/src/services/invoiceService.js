import { apiClient } from './apiClient';

export const invoiceAPI = {
  // Get all invoices/bills
  getAll: (search = '') => {
    const params = search ? { search } : {}
    return apiClient.get('/invoice/bill-history', { params })
  },

  // Get single invoice/bill
  getById: (id, startDate = '', endDate = '') => {
    const params = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    return apiClient.get(`/invoice/${id}`, { params })
  },

  // Create invoice/bill
  create: (invoiceData) => {
    return apiClient.post('/invoice/store', invoiceData)
  },

  // Get invoice data for bill generation
  getInvoiceData: () => {
    return apiClient.get('/invoice')
  },
}
