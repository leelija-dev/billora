import { create } from 'zustand'
import { unitsAPI } from '../services/unitsService'

// Cache for units data
const unitCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = unitCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  unitCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  unitCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useUnitStore = create((set, get) => ({
  units: [],
  totalUnits: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch units
  fetchUnits: async (page = 1, filters = {}) => {
    const cacheKey = JSON.stringify({ page, filters })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached units data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached units data')
      set({
        units: cached.units,
        totalUnits: cached.total,
        currentPage: page,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now()
      })
      return
    }

    set({ loading: true, cacheKey })
    try {
      const response = await unitsAPI.getAll(page, filters)
      console.log('API Response in store:', response)
      
      // Extract units array from response
      const unitsArray = response.data.data.data || []
      const paginationData = response.data.data || {}
      console.log('Units data:', unitsArray)
      
      // Cache the results
      const cacheData = {
        units: unitsArray,
        total: paginationData.total || 0
      }
      setCachedData(cacheKey, cacheData)
      
      set({
        units: unitsArray,
        totalUnits: paginationData.total || 0,
        currentPage: paginationData.current_page || 1,
        pageSize: paginationData.per_page || 10,
        loading: false,
        lastFetchTime: Date.now()
      })
      return response.data
    } catch (error) {
      console.log('Error in fetchUnits:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch units',
        loading: false,
      })
      throw error
    }
  },

  // Create unit
  createUnit: async (unitData) => {
    console.log('createUnit called with:', unitData)
    set({ loading: true, error: null })
    try {
      const response = await unitsAPI.create(unitData)
      console.log(' Unit created successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Add new unit to local state immediately for better UX
      const { units } = get()
      set({
        units: [response.data, ...units],
        totalUnits: (units?.length || 0) + 1,
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to create unit:', error)
      set({
        error: error.response?.data?.message || 'Failed to create unit',
        loading: false,
      })
      throw error
    }
  },

  // Update unit
  updateUnit: async (id, unitData) => {
    console.log('updateUnit called with:', id, unitData)
    set({ loading: true, error: null })
    try {
      const response = await unitsAPI.update(id, unitData)
      console.log(' Unit updated successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { units } = get()
      set({
        units: units.map(unit => unit.id === id ? response.data : unit),
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to update unit:', error)
      set({
        error: error.response?.data?.message || 'Failed to update unit',
        loading: false,
      })
      throw error
    }
  },

  // Delete unit
  deleteUnit: async (id) => {
    console.log('deleteUnit called with:', id)
    set({ loading: true, error: null })
    try {
      await unitsAPI.delete(id)
      console.log(' Unit deleted successfully')
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { units } = get()
      set({
        units: units.filter(unit => unit.id !== id),
        totalUnits: Math.max(0, (units?.length || 0) - 1),
        loading: false,
      })
      
      return { success: true }
    } catch (error) {
      console.error('Failed to delete unit:', error)
      set({
        error: error.response?.data?.message || 'Failed to delete unit',
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
        get().fetchUnits(1, newFilters)
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },

  // Clear cache data
  clearCache: () => {
    unitCache.clear()
    console.log('Unit cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useUnitStore