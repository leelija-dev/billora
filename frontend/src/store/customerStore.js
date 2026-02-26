import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useCustomerStore = create((set, get) => ({
  customers: [],
  totalCustomers: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    status: '',
  },

  fetchCustomers: async (page = 1) => {
    set({ loading: true })
    try {
      const { filters, pageSize } = get()
      const response = await api.get('/customers/', {
        params: {
          page,
          page_size: pageSize,
          ...filters,
        },
      })
      
      set({
        customers: response.data.results,
        totalCustomers: response.data.count,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch customers')
      set({ loading: false })
    }
  },

  createCustomer: async (customerData) => {
    set({ loading: true })
    try {
      const response = await api.post('/customers/', customerData)
      set((state) => ({
        customers: [response.data, ...state.customers],
        totalCustomers: state.totalCustomers + 1,
        loading: false,
      }))
      toast.success('Customer created successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to create customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ loading: true })
    try {
      const response = await api.put(`/customers/${id}/`, customerData)
      set((state) => ({
        customers: state.customers.map((c) => 
          c.id === id ? response.data : c
        ),
        loading: false,
      }))
      toast.success('Customer updated successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to update customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true })
    try {
      await api.delete(`/customers/${id}/`)
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
        totalCustomers: state.totalCustomers - 1,
        loading: false,
      }))
      toast.success('Customer deleted successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete customer')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchCustomers(1)
  },
}))