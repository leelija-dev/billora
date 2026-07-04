import { create } from 'zustand'
import { categoriesAPI } from '../services/categoriesService'

// Cache for categories data
const categoryCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = categoryCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  categoryCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  categoryCache.set(cacheKey, { data, timestamp: Date.now() })
}

const useCategoryStore = create((set, get) => ({
  categories: [],
  totalCategories: 0,
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

  // Update fetchCategories to properly handle status parameter
fetchCategories: async (page = 1, filters = {}) => {
  const currentState = get()
  const mergedFilters = { ...currentState.filters, ...filters }
  
  const cacheKey = JSON.stringify({ page, filters: mergedFilters })
  
  // Avoid duplicate requests if same data was fetched recently
  if (currentState.cacheKey === cacheKey && 
      currentState.lastFetchTime && 
      (Date.now() - currentState.lastFetchTime) < 2000) {
    console.log('Using cached categories data, skipping duplicate request')
    return
  }

  // Check cache first
  const cached = getCachedData(cacheKey)
  if (cached) {
    console.log('Using cached categories data')
    set({
      categories: cached.categories,
      totalCategories: cached.total,
      currentPage: page,
      loading: false,
      cacheKey,
      lastFetchTime: Date.now()
    })
    return
  }

  console.log('fetchCategories called with:', page, mergedFilters)
  set({ loading: true, cacheKey })
  try {
    const response = await categoriesAPI.getAll(page, mergedFilters)
    console.log('API Response in store:', response)
    
    // Extract categories array from response structure
    const categoriesArray = response.data?.data?.data || response.data?.data || response.data || []
    const total = response.data?.data?.total || categoriesArray.length
    
    // Cache the results
    const cacheData = {
      categories: categoriesArray,
      total: total
    }
    setCachedData(cacheKey, cacheData)
    
    set({
      categories: Array.isArray(categoriesArray) ? categoriesArray : [],
      totalCategories: total,
      currentPage: page,
      loading: false,
      lastFetchTime: Date.now()
    })
    return response.data
  } catch (error) {
    console.log('Error in fetchCategories:', error)
    set({
      error: error.response?.data?.message || 'Failed to fetch categories',
      loading: false,
    })
    throw error
  }
},

  // Create category
  createCategory: async (categoryData) => {
    console.log('createCategory called with:', categoryData)
    set({ loading: true, error: null })
    try {
      const response = await categoriesAPI.create(categoryData)
      
      // Extract actual category data from response structure
      const newCategory = response.data?.data || response.data || response
      console.log('✅ Category created successfully:', newCategory)
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        categories: [newCategory, ...(currentState.categories || [])],
        totalCategories: (currentState.categories?.length || 0) + 1,
        loading: false,
      })
      
      return newCategory
    } catch (error) {
      console.error('Failed to create category:', error)
      set({
        error: error.response?.data?.message || 'Failed to create category',
        loading: false,
      })
      throw error
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    console.log('updateCategory called with:', id, categoryData)
    set({ loading: true, error: null })
    try {
      const response = await categoriesAPI.update(id, categoryData)
      
      // Extract actual category data from response structure
      const updatedCategory = response.data?.data || response.data || response
      console.log('✅ Category updated successfully:', updatedCategory)
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        categories: currentState.categories.map(category => category.id === id ? updatedCategory : category),
        loading: false,
      })
      
      return updatedCategory
    } catch (error) {
      console.error('Failed to update category:', error)
      set({
        error: error.response?.data?.message || 'Failed to update category',
        loading: false,
      })
      throw error
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    console.log('deleteCategory called with:', id)
    set({ loading: true, error: null })
    try {
      await categoriesAPI.delete(id)
      console.log('✅ Category deleted successfully')
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        categories: currentState.categories.filter(category => category.id !== id),
        totalCategories: Math.max(0, (currentState.categories?.length || 0) - 1),
        loading: false,
      })
      
      return { success: true }
    } catch (error) {
      console.error('Failed to delete category:', error)
      set({
        error: error.response?.data?.message || 'Failed to delete category',
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
      get().fetchCategories(1, newFilters)
    }, 300)
  } else {
    set({ filters: newFilters })
  }
},

  // Clear cache data
  clearCache: () => {
    categoryCache.clear()
    console.log('Category cache cleared')
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useCategoryStore
