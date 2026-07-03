import { create } from 'zustand'
import { brandsAPI } from '../services/brandsService'
import { useAuthStore } from './authStore'

// Cache for brands data
const brandCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = brandCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  brandCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  brandCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useBrandStore = create((set, get) => ({
  brands: [],
  totalBrands: 0,
  currentPage: 1,
  pageSize: 8,
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch brands
  fetchBrands: async (page = 1, filters = {}) => {
    const cacheKey = JSON.stringify({ page, filters })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached brands data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached brands data')
      set({
        brands: cached.brands,
        totalBrands: cached.total,
        currentPage: page,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now()
      })
      return
    }

    console.log('fetchBrands called with:', page, filters)
    set({ loading: true, cacheKey })
    try {
      const response = await brandsAPI.getAll(filters.search)
      console.log('API Response in store:', response)
      
      // Extract brands array from response structure
      const brandsArray = response.data?.data?.data || response.data?.data || response.data || []
      const total = response.data?.data?.total || brandsArray.length

      
      // Cache the results
      const cacheData = {
        brands: brandsArray,
        total: total
      }
      setCachedData(cacheKey, cacheData)
      
      set({
        brands: Array.isArray(brandsArray) ? brandsArray : [],
        totalBrands: total,
        currentPage: page,
        loading: false,
        lastFetchTime: Date.now()
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch brands:', error)
      set({ 
        brands: [], 
        totalBrands: 0, 
        loading: false,
        error: error.message || 'Failed to fetch brands'
      })
    }
  },

  // Create brand
  createBrand: async (brandData) => {
    console.log('createBrand called with:', brandData)
    set({ loading: true, error: null })
    try {
      const response = await brandsAPI.create(brandData)
      console.log('✅ Brand created successfully:', response.data)
      
      // Extract the actual brand data from response structure
      const newBrand = response.data?.data || response.data || response
      console.log('🏷️ Extracted brand data:', newBrand)
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        brands: [newBrand, ...(currentState.brands || [])],
        totalBrands: (currentState.brands?.length || 0) + 1,
        loading: false,
      })
      
      return newBrand
    } catch (error) {
      console.error('Failed to create brand:', error)
      set({
        error: error.response?.data?.message || 'Failed to create brand',
        loading: false,
      })
      throw error
    }
  },

  // Update brand
  updateBrand: async (id, brandData) => {
    console.log('updateBrand called with:', id, brandData)
    set({ loading: true, error: null })
    try {
      const response = await brandsAPI.update(id, brandData)
      console.log('✅ Brand updated successfully:', response.data)
      
      // Extract actual brand data from response structure
      const updatedBrand = response.data?.data || response.data || response
      console.log('🏷️ Extracted updated brand data:', updatedBrand)
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        brands: currentState.brands.map(brand => brand.id === id ? updatedBrand : brand),
        loading: false,
      })
      
      return updatedBrand
    } catch (error) {
      console.error('Failed to update brand:', error)
      set({
        error: error.response?.data?.message || 'Failed to update brand',
        loading: false,
      })
      throw error
    }
  },

  // Delete brand
  deleteBrand: async (id) => {
    console.log('deleteBrand called with:', id)
    set({ loading: true, error: null })
    try {
      await brandsAPI.delete(id)
      console.log('✅ Brand deleted successfully')
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { brands } = get()
      set({
        brands: brands.filter(brand => brand.id !== id),
        totalBrands: Math.max(0, (brands?.length || 0) - 1),
        loading: false,
      })
      
      return { success: true }
    } catch (error) {
      console.error('Failed to delete brand:', error)
      set({
        error: error.response?.data?.message || 'Failed to delete brand',
        loading: false,
      })
      throw error
    }
  },

  // Get single brand
  getBrand: async (id) => {
    console.log('getBrand called with:', id)
    try {
      const response = await brandsAPI.getById(id)
      console.log('✅ Brand fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch brand:', error)
      throw error.response?.data || error.message
    }
  },

  // Set filters with debouncing and cache invalidation
  setFilters: (filters) => {
    const currentState = get()
    const newFilters = { ...currentState.filters, ...filters }
    
    // Only fetch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(currentState.filters)) {
      set({ filters: newFilters })
      
      // Debounce API call
      setTimeout(() => {
        get().fetchBrands(1, newFilters)
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },

  // Clear cache data
  clearCache: () => {
    brandCache.clear()
    console.log('Brand cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useBrandStore
