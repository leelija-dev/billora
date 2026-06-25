// services/sellerService.js
import { apiClient } from './apiClient';

export const sellerAPI = {
  // Get all sellers by user ID with pagination
  getByUserId: (userId, params = {}) => {
    return apiClient.get(`/seller/${userId}`, { params })
  },

  // Create new seller
  create: (sellerData) => {
    return apiClient.post('/seller/store', sellerData)
  },

  // Get single seller by ID
  getById: (sellerId) => {
    return apiClient.get(`/seller/edit/${sellerId}`)
  },

  // Update seller
  update: (sellerId, sellerData) => {
    return apiClient.put(`/seller/update/${sellerId}`, sellerData)
  },

  // Delete seller
  delete: (sellerId) => {
    return apiClient.delete(`/seller/delete/${sellerId}`)
  },

  // Get seller products
  getSellerProducts: (sellerId, params = {}) => {
    return apiClient.get(`/seller-products/${sellerId}`, { params })
  },

  // NEW: Process due payment for seller
  processDuePayment: (sellerId, paymentData) => {
    return apiClient.post(`/seller/due-payment/${sellerId}`, paymentData)
  },

  // NEW: Get payment history for seller
  getPaymentHistory: (sellerId, params = {}) => {
    return apiClient.get(`/seller/payment-history/${sellerId}`, { params })
  },
}

const sellerService = sellerAPI
export default sellerService