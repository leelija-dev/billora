import { create } from 'zustand'
import { invoiceAPI } from '../services'
import toast from 'react-hot-toast'

// Cache for customer and store data
const customerCache = new Map()
const storeCache = new Map()
const productCache = new Map()

// Cache expiration time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cache, key) => {
  const entry = cache.get(key)
  if (isCacheValid(entry)) {
    return entry.data
  }
  cache.delete(key)
  return null
}

const setCachedData = (cache, key, data) => {
  cache.set(key, { data, timestamp: Date.now() })
}

export const useInvoiceStore = create((set, get) => ({
  // State
  invoices: [],
  totalInvoices: 0,
  currentPage: 1,
  pageSize: 15,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
  },
  billGenerateData: {},
  
  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch invoices/bills history with pagination and search (optimized)
  fetchInvoices: async (page = 1, filters = {}) => {
    const cacheKey = JSON.stringify({ page, filters })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached invoice data, skipping duplicate request')
      return
    }

    set({ loading: true, cacheKey })
    try {
      const response = await invoiceAPI.getAll(page, filters)
      const invoices = response.data?.data?.data || response.data?.data || []

      // Batch fetch unique customers and stores to reduce API calls
      const uniqueCustomerIds = [...new Set(invoices.map(inv => inv.customer_id).filter(Boolean))]
      const uniqueStoreIds = [...new Set(invoices.map(inv => inv.store_id).filter(Boolean))]

      // Fetch customers in batch (with caching)
      const customerPromises = uniqueCustomerIds.map(async (customerId) => {
        const cached = getCachedData(customerCache, customerId)
        if (cached) {
          return { id: customerId, data: cached }
        }
        
        try {
          const response = await invoiceAPI.getCustomer(customerId)
          const customerData = response.data?.data || response.data || {}
          setCachedData(customerCache, customerId, customerData)
          return { id: customerId, data: customerData }
        } catch (error) {
          console.error(`Failed to fetch customer ${customerId}:`, error)
          return { id: customerId, data: null }
        }
      })

      // Fetch stores in batch (with caching)
      const storePromises = uniqueStoreIds.map(async (storeId) => {
        const cached = getCachedData(storeCache, storeId)
        if (cached) {
          return { id: storeId, data: cached }
        }
        
        try {
          const response = await invoiceAPI.getStore(storeId)
          const storeDataArray = response.data?.data?.data || response.data?.data || []
          const storeData = storeDataArray[0] || {}
          setCachedData(storeCache, storeId, storeData)
          return { id: storeId, data: storeData }
        } catch (error) {
          console.error(`Failed to fetch store ${storeId}:`, error)
          return { id: storeId, data: null }
        }
      })

      // Wait for all batch requests to complete
      const [customersResult, storesResult] = await Promise.all([
        Promise.all(customerPromises),
        Promise.all(storePromises)
      ])

      // Create lookup maps
      const customerMap = customersResult.reduce((acc, { id, data }) => {
        acc[id] = data
        return acc
      }, {})

      const storeMap = storesResult.reduce((acc, { id, data }) => {
        acc[id] = data
        return acc
      }, {})

      // Enrich invoices with cached customer and store data
      const enrichedInvoices = invoices.map((invoice) => {
        const customer = customerMap[invoice.customer_id] || {}
        const store = storeMap[invoice.store_id] || {}
        
        return {
          ...invoice,
          customer: customer,
          store: store,
          customer_name: customer.name || `Customer #${invoice.customer_id}`,
          store_name: store.name || `Store #${invoice.store_id}`
        }
      })

      set({
        invoices: enrichedInvoices,
        totalInvoices: response.data?.data?.total || response.data?.total || 0,
        currentPage: response.data?.data?.current_page || page,
        pageSize: response.data?.data?.per_page || 15,
        loading: false,
        lastFetchTime: Date.now()
      })
    } catch (error) {
      toast.error('Failed to fetch invoices')
      set({ loading: false })
    }
  },

  // Get bill generate page data (optimized with caching)
  fetchBillGenerateData: async () => {
    const currentState = get()
    
    // Avoid duplicate requests if data was fetched recently (within 30 seconds)
    if (currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 30000 &&
        Object.keys(currentState.billGenerateData).length > 0) {
      console.log('Using cached bill generate data, skipping duplicate request')
      return currentState.billGenerateData
    }

    set({ loading: true, error: null })
    try {
      const response = await invoiceAPI.getBillGenerateData()
      const data = response.data?.data || {}
      
      set({ 
        billGenerateData: data,
        loading: false,
        lastFetchTime: Date.now()
      })
      
      return data
    } catch (error) {
      console.error('Failed to fetch bill generate data:', error)
      set({ 
        error: error.message || 'Failed to fetch bill generate data',
        loading: false 
      })
      return {}
    }
  },

  // Create/store new invoice/bill with items
  createInvoice: async (invoiceData) => {
    set({ loading: true })
    try {
      const response = await invoiceAPI.create(invoiceData)
      console.log('Invoice store API response:', response)
      
      // Handle the actual response structure from backend
      const responseData = response.data
      if (responseData?.status === true) {
        // Success case - notify customer store to clear cache
        try {
          const broadcastChannel = new BroadcastChannel('app-cache-invalidation')
          broadcastChannel.postMessage({
            type: 'invoice-created',
            data: {
              customer_id: invoiceData.customer_id,
              timestamp: Date.now()
            }
          })
          broadcastChannel.close()
        } catch (error) {
          console.log('BroadcastChannel not supported, skipping cross-module cache invalidation')
        }
        
        set({ loading: false })
        return { success: true, data: responseData }
      } else {
        // Backend returned failure
        toast.error(responseData?.message || 'Failed to create invoice')
        set({ loading: false })
        return { success: false, error: responseData }
      }
    } catch (error) {
      console.error('Invoice store error:', error)
      toast.error('Failed to create invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data || error.message }
    }
  },

  // Update invoice/bill
  updateInvoice: async (id, invoiceData) => {
    set({ loading: true })
    try {
      const response = await invoiceAPI.update(id, invoiceData)
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? response.data : inv)),
        loading: false,
      }))
      
      // Notify customer store to clear cache
      try {
        const broadcastChannel = new BroadcastChannel('app-cache-invalidation')
        broadcastChannel.postMessage({
          type: 'invoice-updated',
          data: {
            customer_id: invoiceData.customer_id,
            timestamp: Date.now()
          }
        })
        broadcastChannel.close()
      } catch (error) {
        console.log('BroadcastChannel not supported, skipping cross-module cache invalidation')
      }
      
      toast.success('Invoice updated successfully')
      return { success: true, data: response.data }
    } catch (error) {
      toast.error('Failed to update invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Cancel invoice (bill status)
  cancelInvoice: async (id) => {
    set({ loading: true })
    try {
      const response = await invoiceAPI.updateBillStatus(id)
      const ok = response.data?.status === true
      if (ok) {
        toast.success(response.data?.message || 'Invoice cancelled')
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === Number(id) || inv.id === id ? { ...inv, status: 'cancelled' } : inv
          ),
          loading: false,
        }))
        return { success: true, data: response.data }
      }
      toast.error(response.data?.message || 'Failed to cancel invoice')
      set({ loading: false })
      return { success: false, error: response.data }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Delete invoice/bill
  deleteInvoice: async (id) => {
    set({ loading: true })
    try {
      // Get invoice data before deletion for customer_id
      const currentState = get()
      const invoiceToDelete = currentState.invoices.find(inv => inv.id === id)
      
      await invoiceAPI.delete(id)
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
        totalInvoices: state.totalInvoices - 1,
        loading: false,
      }))
      
      // Notify customer store to clear cache
      try {
        const broadcastChannel = new BroadcastChannel('app-cache-invalidation')
        broadcastChannel.postMessage({
          type: 'invoice-deleted',
          data: {
            customer_id: invoiceToDelete?.customer_id,
            timestamp: Date.now()
          }
        })
        broadcastChannel.close()
      } catch (error) {
        console.log('BroadcastChannel not supported, skipping cross-module cache invalidation')
      }
      
      toast.success('Invoice deleted successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete invoice')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    const currentFilters = get().filters
    const newFilters = { ...currentFilters, ...filters }
    
    // Only fetch if filters actually changed
    if (JSON.stringify(currentFilters) !== JSON.stringify(newFilters)) {
      set({ filters: newFilters })
      get().fetchInvoices(1, newFilters)
    }
  },
  
  // Clear cache function
  clearCache: () => {
    customerCache.clear()
    storeCache.clear()
    productCache.clear()
    set({ 
      lastFetchTime: null, 
      cacheKey: null,
      billGenerateData: {}
    })
  },
}))
