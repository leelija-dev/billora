import { create } from 'zustand'
import { packagesAPI } from '../services/packagesService'

// Cache for packages data
const packageCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = packageCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  packageCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  packageCache.set(cacheKey, { data, timestamp: Date.now() })
}

const usePackageStore = create((set, get) => ({
  packages: [],
  totalPackages: 0,
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

  // Fetch packages with proper pagination
  fetchPackages: async (userId, page = 1, filters = {}) => {
    // Check if userId is provided
    if (!userId) {
      console.error('User ID is required to fetch packages')
      set({ loading: false, error: 'User ID is required' })
      return
    }

    const cacheKey = JSON.stringify({ userId, page, filters })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached packages data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached packages data')
      set({
        packages: cached.packages,
        totalPackages: cached.total,
        currentPage: cached.current_page || page,
        pageSize: cached.per_page || 8,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now()
      })
      return
    }

    set({ loading: true, error: null, cacheKey })
    
    try {
      const response = await packagesAPI.getAll(userId, page, filters)
      console.log('API Response in store:', response)
      
      // Extract data from response - handle different response structures
      let packagesData = []
      let paginationData = {}
      
      if (response?.data?.status === true) {
        // Response structure from your API
        const responseData = response.data.data
        packagesData = responseData?.data || []
        paginationData = {
          total: responseData?.total || packagesData.length,
          current_page: responseData?.current_page || page,
          per_page: responseData?.per_page || 8,
          last_page: responseData?.last_page || 1,
          from: responseData?.from || 0,
          to: responseData?.to || packagesData.length
        }
      } else if (response?.data?.data) {
        // Fallback for different response structure
        const responseData = response.data.data
        packagesData = Array.isArray(responseData) ? responseData : (responseData?.data || [])
        paginationData = {
          total: responseData?.total || packagesData.length,
          current_page: responseData?.current_page || page,
          per_page: responseData?.per_page || 8
        }
      } else {
        packagesData = Array.isArray(response?.data) ? response.data : []
        paginationData = {
          total: packagesData.length,
          current_page: page,
          per_page: 8
        }
      }
      
      console.log('Packages data:', packagesData)
      console.log('Pagination data:', paginationData)
      
      // Cache the results
      const cacheData = {
        packages: packagesData,
        total: paginationData.total,
        current_page: paginationData.current_page,
        per_page: paginationData.per_page
      }
      setCachedData(cacheKey, cacheData)
      
      set({
        packages: packagesData,
        totalPackages: paginationData.total || packagesData.length,
        currentPage: paginationData.current_page || page,
        pageSize: paginationData.per_page || 8,
        loading: false,
        lastFetchTime: Date.now()
      })
      
      return response.data
    } catch (error) {
      console.error('Error in fetchPackages:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch packages',
        loading: false,
      })
      throw error
    }
  },

  // Create package
  createPackage: async (userId, packageData) => {
    console.log('createPackage called with:', userId, packageData)
    set({ loading: true, error: null })
    try {
      const response = await packagesAPI.create(userId, packageData)
      console.log('Package created successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Add new package to local state immediately for better UX
      const { packages } = get()
      const newPackage = response.data?.data || response.data
      set({
        packages: [newPackage, ...packages],
        totalPackages: (packages?.length || 0) + 1,
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to create package:', error)
      set({
        error: error.response?.data?.message || 'Failed to create package',
        loading: false,
      })
      throw error
    }
  },

  // Update package
  updatePackage: async (id, packageData) => {
    console.log('updatePackage called with:', id, packageData)
    set({ loading: true, error: null })
    try {
      const response = await packagesAPI.update(id, packageData)
      console.log('Package updated successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { packages } = get()
      const updatedPackage = response.data?.data || response.data
      set({
        packages: packages.map(pkg => pkg.id === id ? updatedPackage : pkg),
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to update package:', error)
      set({
        error: error.response?.data?.message || 'Failed to update package',
        loading: false,
      })
      throw error
    }
  },

  // Delete package
  deletePackage: async (id) => {
    console.log('deletePackage called with:', id)
    set({ loading: true, error: null })
    try {
      await packagesAPI.delete(id)
      console.log('Package deleted successfully')
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { packages, currentPage, totalPackages } = get()
      const updatedPackages = packages.filter(pkg => pkg.id !== id)
      
      // If the last item on the page was deleted, go to previous page
      const shouldGoToPreviousPage = updatedPackages.length === 0 && currentPage > 1
      
      set({
        packages: updatedPackages,
        totalPackages: Math.max(0, (packages?.length || 0) - 1),
        loading: false,
      })
      
      if (shouldGoToPreviousPage) {
        // Fetch the previous page
        const { userId } = get()
        if (userId) {
          await get().fetchPackages(userId, currentPage - 1)
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Failed to delete package:', error)
      set({
        error: error.response?.data?.message || 'Failed to delete package',
        loading: false,
      })
      throw error
    }
  },

  // Get single package
  getPackage: async (id) => {
    console.log('getPackage called with:', id)
    set({ loading: true, error: null })
    try {
      const response = await packagesAPI.getById(id)
      console.log('Package fetched successfully', response.data)
      
      set({ loading: false })
      return response.data?.data || response.data
    } catch (error) {
      console.error('Failed to fetch package:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch package',
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
      
      // Debounce API call
      setTimeout(() => {
        const { userId } = currentState
        if (userId) {
          get().fetchPackages(userId, 1, newFilters)
        }
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },

  // Set current page
  setCurrentPage: (page) => {
    set({ currentPage: page })
  },

  // Clear cache data
  clearCache: () => {
    packageCache.clear()
    console.log('Package cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default usePackageStore