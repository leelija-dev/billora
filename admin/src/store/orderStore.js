import { create } from 'zustand'
import { apiClient } from '../services/apiClient'
import { orderAPI } from '../services/orderService'
import toast from 'react-hot-toast'

export const useOrderStore = create((set, get) => ({
  orders: [],
  totalOrders: 0,
  currentPage: 1,
  pageSize: 8,
  loading: false,
  pagination: null,
  filters: {
    search: '',
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: '',
  },

  fetchOrders: async (page = 1, userId, filters = {}) => {
    set({ loading: true })
    try {
      // Validate user ID
      if (!userId) {
        throw new Error('User ID is required to fetch orders')
      }
      
      // Use user order history endpoint for admin side with pagination
      const response = await orderAPI.getUserOrderHistory(userId, page, filters)
      console.log('Orders API response:', response)
      
      // Handle the new paginated response structure
      const responseData = response.data
      if (responseData?.status === true && responseData?.data) {
        const paginationData = responseData.data
        const ordersData = Array.isArray(paginationData?.data) ? paginationData.data : []
        
        set({
          orders: ordersData,
          totalOrders: paginationData?.total || 0,
          currentPage: paginationData?.current_page || page,
          pageSize: paginationData?.per_page || 8,
          pagination: paginationData,
          loading: false,
        })
      } else {
        // Handle error response
        toast.error(responseData?.message || 'Failed to fetch orders')
        set({
          orders: [],
          totalOrders: 0,
          currentPage: 1,
          pagination: null,
          loading: false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to fetch orders: ' + (error.response?.data?.message || error.message))
      set({ 
        orders: [],
        totalOrders: 0,
        currentPage: 1,
        pagination: null,
        loading: false 
      })
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true })
    try {
      const response = await apiClient.post('/orders/', orderData)
      set((state) => ({
        orders: [response.data, ...state.orders],
        totalOrders: state.totalOrders + 1,
        loading: false,
      }))
      toast.success('Order created successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to create order:', error)
      toast.error('Failed to create order')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true })
    try {
      // Use the new order service for status updates
      const response = await orderAPI.updateOrderStatus(id, status)
      
      // Update local state
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === id ? { ...o, order_status: status } : o
        ),
        loading: false,
      }))
      
      toast.success('Order status updated successfully')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error('Failed to update order: ' + (error.response?.data?.message || error.message))
      set({ loading: false })
      return { success: false }
    }
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    set({ loading: true })
    try {
      // Use the new order service for payment status updates
      const response = await orderAPI.updatePaymentStatus(id, paymentStatus)
      
      // Update local state
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === id ? { ...o, payment_status: paymentStatus } : o
        ),
        loading: false,
      }))
      
      toast.success('Payment status updated successfully')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to update payment status:', error)
      toast.error('Failed to update payment status: ' + (error.response?.data?.message || error.message))
      set({ loading: false })
      return { success: false }
    }
  },

  updateOrderPayment: async (orderId, userId, paidAmount) => {
    set({ loading: true })
    try {
      // Get current order details to calculate due amount
      const currentOrder = get().orders.find(o => o.id === orderId)
      if (!currentOrder) {
        throw new Error('Order not found')
      }
      
      const currentPaid = parseFloat(currentOrder.paid_amount || 0)
      const totalAmount = parseFloat(currentOrder.total_amount || 0)
      const currentDue = totalAmount - currentPaid
      const newPaidAmount = parseFloat(paidAmount)
      
      // Check if the entered amount covers the full due amount
      const willCompletePayment = newPaidAmount >= currentDue
      
      // First, update the payment amount
      const response = await orderAPI.updateOrderPayment(orderId, userId, paidAmount)
      
      // If this payment completes the order, automatically update payment status to 'completed'
      if (willCompletePayment) {
        await orderAPI.updatePaymentStatus(orderId, 'completed')
        
        // Update local state with both new paid amount and completed status
        set((state) => ({
          orders: state.orders.map((o) => 
            o.id === orderId 
              ? { 
                  ...o, 
                  paid_amount: (currentPaid + newPaidAmount).toString(),
                  payment_status: 'completed' 
                } 
              : o
          ),
          loading: false,
        }))
        
        toast.success(`Payment of $${paidAmount} received. Order is now fully paid!`)
      } else {
        // Update just the amount in local state
        set((state) => ({
          orders: state.orders.map((o) => 
            o.id === orderId 
              ? { 
                  ...o, 
                  paid_amount: (currentPaid + newPaidAmount).toString()
                } 
              : o
          ),
          loading: false,
        }))
        
        const newDue = totalAmount - (currentPaid + newPaidAmount)
        toast.success(`Payment of $${paidAmount} recorded successfully. Remaining due: $${newDue.toFixed(2)}`)
      }
      
      // Refresh orders to get updated data
      if (userId) {
        await get().fetchOrders(1, userId)
      }
      
      return { success: true, data: response.data, willCompletePayment }
    } catch (error) {
      console.error('Failed to update payment:', error)
      toast.error('Failed to update payment: ' + (error.response?.data?.message || error.message))
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters, userId) => {
    set({ filters: { ...get().filters, ...filters } })
    if (userId) {
      get().fetchOrders(1, userId)
    }
  },
}))