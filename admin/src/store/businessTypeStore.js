import { create } from 'zustand'
import { plansAPI } from '../services/miscService'

// Cache for business types data
const businessTypeCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = businessTypeCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  businessTypeCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  businessTypeCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useBusinessTypeStore = create((set, get) => ({
  businessTypes: [],
  loading: false,
  error: null,

  // Fetch all business types
  fetchBusinessTypes: async () => {
    const cacheKey = 'all-business-types'
    const cachedData = getCachedData(cacheKey)
    
    if (cachedData) {
      set({ businessTypes: cachedData, loading: false })
      return cachedData
    }

    set({ loading: true, error: null })
    
    try {
      console.log('📋 Fetching business types from store')
      const response = await plansAPI.getBusinessTypes()
      const businessTypesData = response.data?.data || response.data || []
      
      // Format for Select component
      const formattedBusinessTypes = [
        { value: '', label: 'All Plans' },
        ...businessTypesData.map(type => ({
          value: type.id?.toString(), // Convert id to string for comparison
          label: type.name
        }))
      ]
      
      setCachedData(cacheKey, formattedBusinessTypes)
      set({ 
        businessTypes: formattedBusinessTypes, 
        loading: false,
        error: null 
      })
      
      return formattedBusinessTypes
    } catch (error) {
      console.error('❌ Failed to fetch business types:', error)
      
      // Fallback to mock data if API fails
      const fallbackBusinessTypes = [
        { value: '', label: 'All Plans' },
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
      
      setCachedData(cacheKey, fallbackBusinessTypes)
      set({ 
        businessTypes: fallbackBusinessTypes, 
        loading: false,
        error: error.message 
      })
      
      return fallbackBusinessTypes
    }
  },

  // Clear cache and refresh
  refreshBusinessTypes: async () => {
    businessTypeCache.clear()
    return get().fetchBusinessTypes()
  },

  // Get business type by value
  getBusinessTypeByValue: (value) => {
    const { businessTypes } = get()
    return businessTypes.find(type => type.value === value)
  },

  // Reset store
  reset: () => {
    set({ 
      businessTypes: [], 
      loading: false, 
      error: null 
    })
  }
}))

export { useBusinessTypeStore }
