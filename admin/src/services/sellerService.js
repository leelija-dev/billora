// services/sellerService.js
import { apiClient } from './apiClient';

export const sellerAPI = {
  // Get all sellers by user ID
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
}

const sellerService = sellerAPI
export default sellerService