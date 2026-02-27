import { create } from 'zustand'
import api from '../services/api'
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

  fetchOrders: async (page = 1) => {
    set({ loading: true })
    try {
      const { filters, pageSize } = get()
      const response = await api.get('/orders/', {
        params: {
          page,
          page_size: pageSize,
          ...filters,
        },
      })
      
      set({
        orders: response.data.results,
        totalOrders: response.data.count,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch orders')
      set({ loading: false })
    }
  },

  createOrder: async (orderData) => {
    set({ loading: true })
    try {
      const response = await api.post('/orders/', orderData)
      set((state) => ({
        orders: [response.data, ...state.orders],
        totalOrders: state.totalOrders + 1,
        loading: false,
      }))
      toast.success('Order created successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to create order')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true })
    try {
      const response = await api.patch(`/orders/${id}/`, { status })
      set((state) => ({
        orders: state.orders.map((o) => 
          o.id === id ? response.data : o
        ),
        loading: false,
      }))
      toast.success('Order status updated')
      return { success: true }
    } catch (error) {
      toast.error('Failed to update order')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchOrders(1)
  },
}))