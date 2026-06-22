// store/sellerStore.js
import { create } from 'zustand'
import { sellerAPI } from '../services/sellerService'
import toast from 'react-hot-toast'

// Cache for seller data
const sellerCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = sellerCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  sellerCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  sellerCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useSellerStore = create((set, get) => ({
  sellers: [],
  totalSellers: 0,
  currentPage: 1,
  pageSize: 15,
  loading: false,
  error: null,
  filters: {
    search: '',
  },
  currentUserId: null,
  pagination: null,

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch sellers by user ID with pagination
  fetchSellers: async (userId, page = 1, filters = {}) => {
    set({ currentUserId: userId })
    
    const cacheKey = JSON.stringify({ userId, page, filters })
    const currentState = get()
    
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached seller data, skipping duplicate request')
      return
    }

    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached seller data')
      set({
        sellers: cached.sellers,
        totalSellers: cached.total,
        currentPage: page,
        pageSize: cached.pageSize || 15,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now(),
        currentUserId: userId,
        pagination: cached.pagination || null,
      })
      return
    }

    set({ loading: true, cacheKey, currentUserId: userId })
    try {
      const params = { 
        page, 
        ...filters 
      }
      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key]
        }
      })
      
      const response = await sellerAPI.getByUserId(userId, params)
      console.log('📦 Sellers fetched successfully:', response.data)
      
      // Extract sellers from response structure: 
      // { status: true, message: "seller list", sellers: { data: [...], total: 1, ... } }
      let sellersArray = []
      let total = 0
      let paginationData = null
      
      if (response.data?.sellers?.data) {
        // New structure with pagination
        sellersArray = Array.isArray(response.data.sellers.data) ? response.data.sellers.data : []
        total = response.data.sellers.total || sellersArray.length
        
        // Extract pagination info
        paginationData = {
          current_page: response.data.sellers.current_page,
          first_page_url: response.data.sellers.first_page_url,
          from: response.data.sellers.from,
          last_page: response.data.sellers.last_page,
          last_page_url: response.data.sellers.last_page_url,
          links: response.data.sellers.links,
          next_page_url: response.data.sellers.next_page_url,
          path: response.data.sellers.path,
          per_page: response.data.sellers.per_page,
          prev_page_url: response.data.sellers.prev_page_url,
          to: response.data.sellers.to,
          total: response.data.sellers.total,
        }
      } else if (response.data?.sellers) {
        // Direct sellers array (old structure)
        sellersArray = Array.isArray(response.data.sellers) ? response.data.sellers : []
        total = sellersArray.length
      } else if (response.data?.data?.sellers) {
        // Nested data.sellers
        sellersArray = Array.isArray(response.data.data.sellers) ? response.data.data.sellers : []
        total = sellersArray.length
      } else if (response.data?.data?.data) {
        // Nested data.data array
        sellersArray = Array.isArray(response.data.data.data) ? response.data.data.data : []
        total = sellersArray.length
      } else if (Array.isArray(response.data)) {
        sellersArray = response.data
        total = sellersArray.length
      }
      
      console.log('📊 Sellers extracted:', sellersArray.length, 'sellers')
      console.log('📊 Total sellers:', total)
      console.log('📊 Pagination:', paginationData)
      
      const cacheData = {
        sellers: sellersArray,
        total: total,
        pageSize: paginationData?.per_page || 15,
        pagination: paginationData,
      }
      setCachedData(cacheKey, cacheData)
      
      set({
        sellers: sellersArray,
        totalSellers: total,
        currentPage: page,
        pageSize: paginationData?.per_page || 15,
        loading: false,
        lastFetchTime: Date.now(),
        currentUserId: userId,
        pagination: paginationData,
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch sellers:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch sellers')
      set({ 
        sellers: [], 
        totalSellers: 0, 
        loading: false,
        error: error.message || 'Failed to fetch sellers',
        currentUserId: userId,
        pagination: null,
      })
    }
  },

  // Create seller
  createSeller: async (sellerData) => {
    set({ loading: true, error: null })
    try {
      const response = await sellerAPI.create(sellerData)
      console.log('✅ Seller created successfully', response.data)
      
      toast.success('Seller created successfully')
      
      get().clearCache()
      
      // Extract the created seller from response
      const newSeller = response.data?.data || response.data || sellerData
      
      const { sellers, currentPage, currentUserId, filters } = get()
      set({
        sellers: [newSeller, ...sellers],
        totalSellers: (sellers?.length || 0) + 1,
        loading: false,
      })
      
      // Refresh the list to update pagination
      await get().fetchSellers(currentUserId, currentPage, filters)
      
      return newSeller
    } catch (error) {
      console.error('❌ Failed to create seller:', error)
      toast.error(error.response?.data?.message || 'Failed to create seller')
      set({
        error: error.response?.data?.message || 'Failed to create seller',
        loading: false,
      })
      throw error
    }
  },

  // Get single seller by ID - Returns flat seller object
  getSellerById: async (sellerId) => {
    set({ loading: true, error: null })
    try {
      const response = await sellerAPI.getById(sellerId)
      console.log('📝 Seller fetched:', response.data)
      
      // Extract seller from response - handle different response structures
      let sellerData = null
      
      if (response.data?.data) {
        sellerData = response.data.data
      } else if (response.data?.seller) {
        sellerData = response.data.seller
      } else {
        sellerData = response.data
      }
      
      console.log('📝 Extracted seller data:', sellerData)
      
      set({ loading: false })
      return sellerData
    } catch (error) {
      console.error('❌ Failed to fetch seller:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch seller')
      set({
        error: error.response?.data?.message || 'Failed to fetch seller',
        loading: false,
      })
      throw error
    }
  },

  // Update seller
  updateSeller: async (sellerId, sellerData) => {
    set({ loading: true, error: null })
    try {
      const response = await sellerAPI.update(sellerId, sellerData)
      console.log('✅ Seller updated successfully', response.data)
      
      toast.success('Seller updated successfully')
      
      get().clearCache()
      
      // Extract updated seller from response
      const updatedSeller = response.data?.data || response.data || sellerData
      
      const { sellers, currentUserId, currentPage, filters } = get()
      set({
        sellers: sellers.map(seller => 
          seller.id === sellerId ? updatedSeller : seller
        ),
        loading: false,
      })
      
      // Refresh the list to update pagination
      await get().fetchSellers(currentUserId, currentPage, filters)
      
      return updatedSeller
    } catch (error) {
      console.error('❌ Failed to update seller:', error)
      toast.error(error.response?.data?.message || 'Failed to update seller')
      set({
        error: error.response?.data?.message || 'Failed to update seller',
        loading: false,
      })
      throw error
    }
  },

  // Delete seller
  deleteSeller: async (sellerId) => {
    set({ loading: true, error: null })
    try {
      await sellerAPI.delete(sellerId)
      console.log('✅ Seller deleted successfully')
      
      toast.success('Seller deleted successfully')
      
      get().clearCache()
      
      const { sellers, currentUserId, currentPage, filters } = get()
      set({
        sellers: sellers.filter(seller => seller.id !== sellerId),
        totalSellers: Math.max(0, (sellers?.length || 0) - 1),
        loading: false,
      })
      
      // Refresh the list to update pagination
      await get().fetchSellers(currentUserId, currentPage, filters)
      
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to delete seller:', error)
      toast.error(error.response?.data?.message || 'Failed to delete seller')
      set({
        error: error.response?.data?.message || 'Failed to delete seller',
        loading: false,
      })
      throw error
    }
  },

  // Set filters with debouncing and cache invalidation
  setFilters: (filters) => {
    const currentState = get()
    const newFilters = { ...currentState.filters, ...filters }
    
    if (JSON.stringify(newFilters) !== JSON.stringify(currentState.filters)) {
      set({ filters: newFilters })
      
      setTimeout(() => {
        const userId = get().currentUserId
        if (userId) {
          console.log('🔍 Searching sellers with userId:', userId, 'and filters:', newFilters)
          get().fetchSellers(userId, 1, newFilters)
        } else {
          console.warn('No userId available for search, skipping fetch')
        }
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },

  // Clear cache data
  clearCache: () => {
    sellerCache.clear()
    console.log('Seller cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useSellerStore