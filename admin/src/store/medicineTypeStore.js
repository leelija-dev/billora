import { create } from 'zustand'
import { medicineTypeAPI } from '../services/medicineTypeService'

// Cache for medicine types data
const medicineTypeCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

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
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
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
      const medicineTypesArray = response.data.data || []
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
