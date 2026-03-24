import { apiClient } from './apiClient';

export const invoiceAPI = {
  // Get all invoices/bills history with pagination and search
  getAll: (page = 1, filters = {}) => {
    const params = new URLSearchParams()
    
    if (page) params.append('page', page)
    if (filters.search) params.append('search', filters.search)
    
    return apiClient.get(`/invoice/bill-history?${params.toString()}`)
  },

  // Get single invoice/bill with payment history filters
  getById: (id, startDate = '', endDate = '') => {
    const params = new URLSearchParams()
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    return apiClient.get(`/invoice/${id}?${params.toString()}`)
  },

  // Get bill generate page data
  getBillGenerateData: () => {
    return apiClient.get('/invoice/')
  },

  // Create/store new invoice/bill
  create: (invoiceData) => {
    return apiClient.post('/invoice/store', invoiceData)
  },

  // Update invoice/bill
  update: (id, invoiceData) => {
    return apiClient.put(`/invoice/${id}`, invoiceData)
  },

  // Delete invoice/bill
  delete: (id) => {
    return apiClient.delete(`/invoice/${id}`)
  },
}

export default invoiceAPI
