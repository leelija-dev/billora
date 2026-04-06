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
      
      // Use user order history endpoint for admin side
      const response = await orderAPI.getUserOrderHistory(userId || 1)
      
      // Handle different response structure
      const ordersData = response.data?.data || response.data || []
      const totalCount = response.data?.total || response.data?.count || ordersData.length
      
      set({
        orders: ordersData,
        totalOrders: totalCount,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to fetch orders: ' + (error.response?.data?.message || error.message))
      set({ loading: false })
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

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchOrders(1)
  },
}))