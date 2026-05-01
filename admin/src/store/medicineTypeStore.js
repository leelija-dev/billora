import { create } from 'zustand'
import { medicineTypeAPI } from '../services/medicineTypeService'

// Cache for medicine types data
const medicineTypeCache = new Map()
const CACHE_EXPIRY = 30 * 1000 // 30 seconds (reduced from 5 minutes)

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = medicineTypeCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  medicineTypeCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  medicineTypeCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useMedicineTypeStore = create((set, get) => ({
  medicineTypes: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  cacheKey: null,

  // Fetch medicine types for a user
  fetchMedicineTypes: async (userId) => {
    const cacheKey = `user_${userId}`
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently (reduced to 100ms)
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 100) {
      console.log('Using cached medicine types data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached medicine types data')
      set({
        medicineTypes: cached,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now()
      })
      return
    }

    set({ loading: true, cacheKey })
    try {
      const response = await medicineTypeAPI.getAll(userId)
      console.log('API Response in store:', response)
      
      // Extract medicine types array from response
      // Handle both array and object response formats
      let medicineTypesArray = []
      if (Array.isArray(response.data.data)) {
        medicineTypesArray = response.data.data
      } else if (typeof response.data.data === 'object' && response.data.data !== null) {
        // Convert object with numeric keys to array
        medicineTypesArray = Object.values(response.data.data)
      } else if (Array.isArray(response.data)) {
        // Handle case where data is directly an array
        medicineTypesArray = response.data
      } else if (typeof response.data === 'object' && response.data !== null) {
        // Handle case where data is directly an object with numeric keys
        medicineTypesArray = Object.values(response.data)
      }
      console.log('Medicine types data:', medicineTypesArray)
      
      // Cache the results
      setCachedData(cacheKey, medicineTypesArray)
      
      set({
        medicineTypes: medicineTypesArray,
        loading: false,
        lastFetchTime: Date.now()
      })
      return response.data
    } catch (error) {
      console.log('Error in fetchMedicineTypes:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch medicine types',
        loading: false,
      })
      throw error
    }
  },

  // Force refresh medicine types (bypass cache)
  forceRefreshMedicineTypes: async (userId) => {
    const cacheKey = `user_${userId}`
    
    // Clear cache for this user
    medicineTypeCache.delete(cacheKey)
    
    set({ loading: true, cacheKey })
    try {
      const response = await medicineTypeAPI.getAll(userId)
      console.log('Force refresh API Response in store:', response)
      
      // Extract medicine types array from response
      let medicineTypesArray = []
      if (Array.isArray(response.data.data)) {
        medicineTypesArray = response.data.data
      } else if (typeof response.data.data === 'object' && response.data.data !== null) {
        medicineTypesArray = Object.values(response.data.data)
      } else if (Array.isArray(response.data)) {
        medicineTypesArray = response.data
      } else if (typeof response.data === 'object' && response.data !== null) {
        medicineTypesArray = Object.values(response.data)
      }
      console.log('Force refresh medicine types data:', medicineTypesArray)
      
      // Cache the results
      setCachedData(cacheKey, medicineTypesArray)
      
      set({
        medicineTypes: medicineTypesArray,
        loading: false,
        lastFetchTime: Date.now()
      })
      return response.data
    } catch (error) {
      console.log('Error in forceRefreshMedicineTypes:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch medicine types',
        loading: false,
      })
      throw error
    }
  },

  // Get single medicine type
  getMedicineType: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await medicineTypeAPI.getById(id)
      console.log('Medicine type fetched successfully', response.data)
      set({ loading: false })
      return response.data
    } catch (error) {
      console.error('Failed to fetch medicine type:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch medicine type',
        loading: false,
      })
      throw error
    }
  },

  // Create medicine type
  createMedicineType: async (medicineTypeData) => {
    console.log('createMedicineType called with:', medicineTypeData)
    set({ loading: true, error: null })
    try {
      const response = await medicineTypeAPI.create(medicineTypeData)
      console.log('Medicine type created successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Add new medicine type to local state immediately for better UX
      const { medicineTypes } = get()
      set({
        medicineTypes: [response.data, ...medicineTypes],
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to create medicine type:', error)
      set({
        error: error.response?.data?.message || 'Failed to create medicine type',
        loading: false,
      })
      throw error
    }
  },

  // Update medicine type
  updateMedicineType: async (id, medicineTypeData) => {
    console.log('updateMedicineType called with:', id, medicineTypeData)
    set({ loading: true, error: null })
    try {
      const response = await medicineTypeAPI.update(id, medicineTypeData)
      console.log('Medicine type updated successfully', response.data)
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { medicineTypes } = get()
      set({
        medicineTypes: medicineTypes.map(medicineType => medicineType.id === id ? response.data : medicineType),
        loading: false,
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to update medicine type:', error)
      set({
        error: error.response?.data?.message || 'Failed to update medicine type',
        loading: false,
      })
      throw error
    }
  },

  // Delete medicine type
  deleteMedicineType: async (id) => {
    console.log('deleteMedicineType called with:', id)
    set({ loading: true, error: null })
    try {
      await medicineTypeAPI.delete(id)
      console.log('Medicine type deleted successfully')
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      const { medicineTypes } = get()
      set({
        medicineTypes: medicineTypes.filter(medicineType => medicineType.id !== id),
        loading: false,
      })
      
      return { success: true }
    } catch (error) {
      console.error('Failed to delete medicine type:', error)
      set({
        error: error.response?.data?.message || 'Failed to delete medicine type',
        loading: false,
      })
      throw error
    }
  },

  // Clear cache data
  clearCache: () => {
    medicineTypeCache.clear()
    console.log('Medicine type cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useMedicineTypeStore
