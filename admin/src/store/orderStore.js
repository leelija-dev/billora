import { create } from 'zustand'
import { apiClient } from '../services/apiClient'
import { orderAPI } from '../services/orderService'
import toast from 'react-hot-toast'

export const useOrderStore = create((set, get) => ({
  orders: [],
  totalOrders: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  },

  fetchOrders: async (page = 1, userId) => {
    set({ loading: true })
    try {
      const { filters, pageSize } = get()
      
      // Validate user ID
      if (!userId) {
        throw new Error('User ID is required to fetch orders')
      }
      
      // Use user order history endpoint for admin side
      const response = await orderAPI.getUserOrderHistory(userId)
      console.log('Orders API response:', response)
      
      // Handle the actual response structure: { status: true, data: [], message: "Order History" }
      const responseData = response.data
      if (responseData?.status === true) {
        const ordersData = Array.isArray(responseData?.data) ? responseData.data : []
        const totalCount = ordersData.length
        
        set({
          orders: ordersData,
          totalOrders: totalCount,
          currentPage: page,
          loading: false,
        })
      } else {
        // Handle error response
        toast.error(responseData?.message || 'Failed to fetch orders')
        set({
          orders: [],
          totalOrders: 0,
          loading: false,
        })
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to fetch orders: ' + (error.response?.data?.message || error.message))
      set({ 
        orders: [],
        totalOrders: 0,
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
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === id ? { ...o, status } : o
        ),
        loading: false,
      }))
      toast.success('Order status updated')
      return { success: true }
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error('Failed to update order: ' + (error.response?.data?.message || error.message))
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