import { apiClient } from './apiClient';

export const orderAPI = {
  // Get user order history (Admin side)
  getUserOrderHistory: (userId) => {
    return apiClient.get(`/invoice/user-order-history/${userId}`)
  },

  // Update order status
  updateOrderStatus: (orderId, orderStatus) => {
    return apiClient.put(`/invoice/update-order-status/${orderId}`, { order_status: orderStatus })
  },

  // Update payment status
  updatePaymentStatus: (orderId, paymentStatus) => {
    return apiClient.put(`/invoice/update-payment-status/${orderId}`, { payment_status: paymentStatus })
  },

  // Show payment details for each order
  getOrderPaymentDetails: (orderId, userId) => {
    return apiClient.post(`/invoice/user-order-due/${orderId}`, { user_id: userId })
  },

  // Update payment
  updateOrderPayment: (orderId, userId, paidAmount) => {
    return apiClient.put(`/invoice/update-order-payment/${orderId}`, { 
      user_id: userId,
      paid_amount: paidAmount 
    })
  },
}

export default orderAPI;
