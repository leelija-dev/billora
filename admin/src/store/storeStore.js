// store/storeStore.js
import { create } from 'zustand'
import { storeAPI } from '../services/storeService'

// Cache for store data
const storeCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = storeCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  storeCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  storeCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useStoreStore = create((set, get) => ({
  stores: [],
  totalStores: 0,
  currentPage: 1,
  pageSize: 8,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    type: '',
    start_date: '',
    end_date: '',
  },
  // Store the current userId
  currentUserId: null,

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch stores by user ID with all filters
  fetchStores: async (userId, page = 1, filters = {}) => {
    // Store the userId for later use
    set({ currentUserId: userId })
    
    // Merge filters
    const currentFilters = get().filters
    const mergedFilters = { ...currentFilters, ...filters }
    
    const cacheKey = JSON.stringify({ userId, page, filters: mergedFilters })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached store data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached store data')
      set({
        stores: cached.stores,
        totalStores: cached.total,
        currentPage: page,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now(),
        currentUserId: userId,
      })
      return
    }

    console.log('🔄 Fetching stores with filters:', mergedFilters)
    set({ loading: true, cacheKey, currentUserId: userId })
    
    try {
      const response = await storeAPI.getByUserId(userId, mergedFilters)
      console.log('✅ API Response:', response.data)
      
      // Extract stores array from correct nested structure
      const storesArray = response.data?.data?.data || response.data?.data || response.data || []
      console.log('📊 Stores data extracted:', storesArray)
      
      // Cache the results
      const cacheData = {
        stores: storesArray,
        total: Array.isArray(storesArray) ? storesArray.length : 0
      }
      setCachedData(cacheKey, cacheData)
      
      set({
        stores: Array.isArray(storesArray) ? storesArray : [],
        totalStores: Array.isArray(storesArray) ? storesArray.length : 0,
        currentPage: page,
        loading: false,
        lastFetchTime: Date.now(),
        currentUserId: userId,
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch stores:', error)
      set({ 
        stores: [], 
        totalStores: 0, 
        loading: false,
        error: error.message || 'Failed to fetch stores',
        currentUserId: userId,
      })
    }
  },

  // Create store
  createStore: async (storeData) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.create(storeData)
      console.log('✅ Store created successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Add new store to local state immediately for better UX
      const { stores } = get()
      set({
        stores: [response.data, ...stores],
        totalStores: (stores?.length || 0) + 1,
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('❌ Failed to create store:', error)
      set({
        error: error.response?.data?.message || 'Failed to create store',
        loading: false,
      })
      throw error
    }
  },

  // Update store
  updateStore: async (id, storeData) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.update(id, storeData)
      console.log('✅ Store updated successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { stores } = get()
      set({
        stores: stores.map(store => store.id === id ? response.data : store),
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('❌ Failed to update store:', error)
      set({
        error: error.response?.data?.message || 'Failed to update store',
        loading: false,
      })
      throw error
    }
  },

  // Delete store
  deleteStore: async (id) => {
    set({ loading: true, error: null })
    try {
      await storeAPI.delete(id)
      console.log('✅ Store deleted successfully')
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { stores } = get()
      set({
        stores: stores.filter(store => store.id !== id),
        totalStores: Math.max(0, (stores?.length || 0) - 1),
        loading: false,
      })
      
      return { success: true }
    } catch (error) {
      console.error('❌ Failed to delete store:', error)
      set({
        error: error.response?.data?.message || 'Failed to delete store',
        loading: false,
      })
      throw error
    }
  },

  // Get edit data
  getEditData: async (userId) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.getEditData(userId)
      set({ loading: false, error: null })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch edit data:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch edit data',
        loading: false,
      })
      throw error
    }
  },

  // Set filters with debouncing and cache invalidation
  setFilters: (filters) => {
    const currentState = get()
    const newFilters = { ...currentState.filters, ...filters }
    
    // Only fetch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(currentState.filters)) {
      set({ filters: newFilters })
      
      // Clear any existing timeout
      if (window._filterTimeout) {
        clearTimeout(window._filterTimeout)
      }
      
      // Debounce API call
      window._filterTimeout = setTimeout(() => {
        // Use the stored userId instead of trying to extract from stores
        const userId = get().currentUserId
        if (userId) {
          console.log('🔍 Searching stores with userId:', userId, 'and filters:', newFilters)
          get().fetchStores(userId, 1, newFilters)
        } else {
          console.warn('⚠️ No userId available for search, skipping fetch')
        }
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },

  // Clear cache data
  clearCache: () => {
    storeCache.clear()
    console.log('🗑️ Store cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useStoreStore