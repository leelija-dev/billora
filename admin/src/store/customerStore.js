import { create } from 'zustand'
import { customerAPI } from '../services'
import toast from 'react-hot-toast'
import { useAuthStore } from './authStore'

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

  fetchCustomers: async (page = 1, search = '') => {
    set({ loading: true })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.id) {
        throw new Error('User not authenticated')
      }
      
      const response = await customerAPI.getAll(user.id, search)
      
      console.log('Full API response:', response)
      
      // Extract customers array from the nested structure
      // Based on logs: response.data.data.data is the array
      let customersArray = []
      let total = 0
      
      // Handle the nested structure: response.data.data.data (array of customers)
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
        customersArray = response.data.data.data
        total = response.data.data.total || customersArray.length
      }
      // Handle response.data.data (if it's directly an array)
      else if (response?.data?.data && Array.isArray(response.data.data)) {
        customersArray = response.data.data
        total = customersArray.length
      }
      // Handle response.data (if it's an array)
      else if (Array.isArray(response?.data)) {
        customersArray = response.data
        total = customersArray.length
      }
      // Handle case where data might be in a different property
      else if (response?.data && typeof response.data === 'object') {
        // Try to find any array property
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            customersArray = response.data[key]
            total = customersArray.length
            break
          }
        }
      }
      
      // Ensure we have an array
      if (!Array.isArray(customersArray)) {
        customersArray = []
      }
      
      console.log('Extracted customers array:', customersArray)
      
      set({
        customers: customersArray,
        totalCustomers: total,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      toast.error('Failed to fetch customers')
      set({ 
        customers: [], 
        totalCustomers: 0, 
        loading: false 
      })
    }
  },

  createCustomer: async (customerData) => {
    set({ loading: true })
    try {
      const { user } = useAuthStore.getState()
      const dataWithAdmin = {
        admin_id: user.id,
        name: customerData.name,
        email: customerData.email || null,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city || null,
        created_by: user.id,
      }
      
      const response = await customerAPI.create(dataWithAdmin)
      
      // Extract the created customer from response
      const newCustomer = response?.data?.data || response?.data || response
      
      set((state) => ({
        customers: Array.isArray(state.customers) ? [newCustomer, ...state.customers] : [newCustomer],
        totalCustomers: (state.totalCustomers || 0) + 1,
        loading: false,
      }))
      toast.success('Customer created successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to create customer:', error)
      toast.error('Failed to create customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ loading: true })
    try {
      const { user } = useAuthStore.getState()
      const dataWithUser = {
        user_id: user.id,
        name: customerData.name,
        email: customerData.email || null,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city || null,
      }
      
      const response = await customerAPI.update(id, dataWithUser)
      
      // Extract the updated customer from response
      const updatedCustomer = response?.data?.data || response?.data || response
      
      set((state) => ({
        customers: Array.isArray(state.customers) 
          ? state.customers.map((c) => c?.id === id ? updatedCustomer : c)
          : [],
        loading: false,
      }))
      toast.success('Customer updated successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to update customer:', error)
      toast.error('Failed to update customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true })
    try {
      await customerAPI.delete(id)
      set((state) => ({
        customers: Array.isArray(state.customers) 
          ? state.customers.filter((c) => c?.id !== id)
          : [],
        totalCustomers: Math.max(0, (state.totalCustomers || 0) - 1),
        loading: false,
      }))
      toast.success('Customer deleted successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to delete customer:', error)
      toast.error('Failed to delete customer')
      set({ loading: false })
      return { success: false }
    }
  },

  // Get trashed customers
  fetchTrashedCustomers: async () => {
    set({ loading: true })
    try {
      const response = await customerAPI.getTrashed()
      
      let customersArray = []
      if (response?.data?.data && Array.isArray(response.data.data)) {
        customersArray = response.data.data
      } else if (Array.isArray(response?.data)) {
        customersArray = response.data
      }
      
      set({
        customers: customersArray,
        totalCustomers: customersArray.length,
        loading: false,
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to fetch deleted customers:', error)
      toast.error('Failed to fetch deleted customers')
      set({ customers: [], totalCustomers: 0, loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Restore customer
  restoreCustomer: async (id) => {
    set({ loading: true })
    try {
      await customerAPI.restore(id)
      set((state) => ({
        customers: Array.isArray(state.customers) 
          ? state.customers.filter((c) => c?.id !== id)
          : [],
        totalCustomers: Math.max(0, (state.totalCustomers || 0) - 1),
        loading: false,
      }))
      toast.success('Customer restored successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to restore customer:', error)
      toast.error('Failed to restore customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Permanently delete customer
  forceDeleteCustomer: async (id) => {
    set({ loading: true })
    try {
      await customerAPI.forceDelete(id)
      set((state) => ({
        customers: Array.isArray(state.customers) 
          ? state.customers.filter((c) => c?.id !== id)
          : [],
        totalCustomers: Math.max(0, (state.totalCustomers || 0) - 1),
        loading: false,
      }))
      toast.success('Customer permanently deleted')
      return { success: true }
    } catch (error) {
      console.error('Failed to permanently delete customer:', error)
      toast.error('Failed to permanently delete customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Process due payment
  processDuePayment: async (id, amount) => {
    set({ loading: true })
    try {
      const response = await customerAPI.duePayment(id, amount)
      
      const updatedCustomer = response?.data?.data || response?.data || response
      
      set((state) => ({
        customers: Array.isArray(state.customers) 
          ? state.customers.map((c) => c?.id === id ? updatedCustomer : c)
          : [],
        loading: false,
      }))
      toast.success('Due payment processed successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to process due payment:', error)
      toast.error('Failed to process due payment')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Get customer payment history
  getCustomerPaymentHistory: async (id, startDate = '', endDate = '') => {
    set({ loading: true })
    try {
      const response = await customerAPI.getPaymentHistory(id, startDate, endDate)
      
      let historyArray = []
      if (response?.data?.data && Array.isArray(response.data.data)) {
        historyArray = response.data.data
      } else if (Array.isArray(response?.data)) {
        historyArray = response.data
      }
      
      set({ loading: false })
      return { success: true, data: historyArray }
    } catch (error) {
      console.error('Failed to fetch payment history:', error)
      toast.error('Failed to fetch payment history')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchCustomers(1, filters.search)
  },
}))