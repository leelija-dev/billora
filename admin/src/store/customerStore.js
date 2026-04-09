import { create } from 'zustand'
import { customerAPI } from '../services'
import toast from 'react-hot-toast'
import { useAuthStore } from './authStore'

// Cache for customer data
const customerCache = new Map()
const paymentHistoryCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = customerCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  customerCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  customerCache.set(cacheKey, { data, timestamp: Date.now() })
}

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
  
  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  fetchCustomers: async (page = 1, search = '') => {
    const cacheKey = JSON.stringify({ page, search })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached customer data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached customer data')
      set({
        customers: cached.customers,
        totalCustomers: cached.total,
        currentPage: page,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now()
      })
      return
    }

    set({ loading: true, cacheKey })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.id) {
        throw new Error('User not authenticated')
      }
      
      const response = await customerAPI.getAll(user.id, search)
      
      console.log('Full API response:', response)
      
      // Extract customers array from nested structure
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
        total = response.data.data.total || customersArray.length
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
        total = 0
      }
      
      console.log('Extracted customers array:', customersArray)
      
      // Cache the results
      const cacheData = {
        customers: customersArray,
        total: total
      }
      setCachedData(cacheKey, cacheData)
      
      set({
        customers: customersArray,
        totalCustomers: total,
        currentPage: page,
        loading: false,
        lastFetchTime: Date.now()
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
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
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
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Invalidate cache for the updated customer
      const cacheKey = JSON.stringify({ page: 1, search: '' })
      customerCache.delete(cacheKey)
      
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
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Invalidate cache for the deleted customer
      const cacheKey = JSON.stringify({ page: 1, search: '' })
      customerCache.delete(cacheKey)
      
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

  // Clear cache data
  clearCache: () => {
    customerCache.clear()
    paymentHistoryCache.clear()
    console.log('Customer cache cleared')
  },

  setFilters: (filters) => {
    const currentState = get()
    const newFilters = { ...currentState.filters, ...filters }
    
    // Only fetch if search actually changed
    if (newFilters.search !== currentState.filters.search) {
      set({ filters: newFilters })
      
      // Debounce the API call
      setTimeout(() => {
        get().fetchCustomers(1, newFilters.search)
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },
}))