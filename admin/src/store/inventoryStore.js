import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useInventoryStore = create((set, get) => ({
  stockLogs: [],
  totalLogs: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    type: '',
    dateFrom: '',
    dateTo: '',
  },

  fetchStockLogs: async (page = 1) => {
    set({ loading: true })
    try {
      const { filters, pageSize } = get()
      const response = await api.get('/inventory/logs/', {
        params: {
          page,
          page_size: pageSize,
          ...filters,
        },
      })
      
      set({
        stockLogs: response.data.results,
        totalLogs: response.data.count,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch stock logs')
      set({ loading: false })
    }
  },

  addStock: async (data) => {
    set({ loading: true })
    try {
      await api.post('/inventory/add/', data)
      toast.success('Stock added successfully')
      get().fetchStockLogs()
      return { success: true }
    } catch (error) {
      toast.error('Failed to add stock')
      set({ loading: false })
      return { success: false }
    }
  },

  removeStock: async (data) => {
    set({ loading: true })
    try {
      await api.post('/inventory/remove/', data)
      toast.success('Stock removed successfully')
      get().fetchStockLogs()
      return { success: true }
    } catch (error) {
      toast.error('Failed to remove stock')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchStockLogs(1)
  },
}))