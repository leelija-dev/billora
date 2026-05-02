import { create } from 'zustand'
import { productsAPI, stocksAPI } from '../services'
import toast from 'react-hot-toast'

// Cache for products data
const productCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY
}

const getCachedData = (cacheKey) => {
  const entry = productCache.get(cacheKey)
  if (isCacheValid(entry)) {
    return entry.data
  }
  productCache.delete(cacheKey)
  return null
}

const setCachedData = (cacheKey, data) => {
  productCache.set(cacheKey, { data, timestamp: Date.now() })
}

export const useProductStore = create((set, get) => ({
  products: [],
  totalProducts: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    category: '',
    status: '',
  },

  // Pagination state from API
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    next_page_url: null,
    prev_page_url: null,
    first_page_url: null,
    last_page_url: null,
  },

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  fetchProducts: async (page = 1, search = '') => {
    const cacheKey = JSON.stringify({ page, search })
    const currentState = get()
    
    // Avoid duplicate requests if same data was fetched recently
    if (currentState.cacheKey === cacheKey && 
        currentState.lastFetchTime && 
        (Date.now() - currentState.lastFetchTime) < 2000) {
      console.log('Using cached products data, skipping duplicate request')
      return
    }

    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      console.log('Using cached products data')
      set({
        products: cached.products,
        totalProducts: cached.total,
        currentPage: page,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now()
      })
      return
    }

    set({ loading: true, cacheKey })
    try {
      const response = await productsAPI.getAll(search)
      
      console.log(' Product Store - Raw API Response:', response)
      
      // Handle your API's response structure
      const apiData = response.data
      let products = apiData.data?.data || []
      const paginationData = apiData.data || {}
      
      // Extract pagination data from API response
      const pagination = {
        current_page: paginationData.current_page || page,
        last_page: paginationData.last_page || 1,
        per_page: paginationData.per_page || 15,
        total: paginationData.total || products.length,
        next_page_url: paginationData.next_page_url || null,
        prev_page_url: paginationData.prev_page_url || null,
        first_page_url: paginationData.first_page_url || null,
        last_page_url: paginationData.last_page_url || null,
      }
      
      // Stock data will be merged by Products component
      // No individual stock API calls here to avoid duplicate requests
      
      // Cache the results
      const cacheData = {
        products: products,
        total: pagination.total,
        pagination: pagination
      }
      setCachedData(cacheKey, cacheData)
      
      console.log(' Product Store - Processed Data:', {
        apiData,
        products,
        pagination,
        productsLength: products.length
      })
      
      set({
        products: products,
        totalProducts: pagination.total,
        currentPage: pagination.current_page,
        pagination: pagination,
        loading: false,
        lastFetchTime: Date.now()
      })
      return response.data
    } catch (error) {
      console.error(' Product Store - Error:', error)
      toast.error('Failed to fetch products')
      set({ 
        loading: false,
        error: error.message || 'Failed to fetch products'
      })
    }
  },

  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const response = await productsAPI.create(productData)
      console.log(' Product creation API response:', response)
      console.log(' Response data structure:', JSON.stringify(response.data, null, 2))
      
      // Check if the backend actually succeeded
      const responseData = response.data
      
      // Handle different response structures
      // Backend might return: { status: true, data: {...} } or { data: { status: true, data: {...} } }
      const status = responseData?.status ?? responseData?.data?.status ?? true
      const message = responseData?.message ?? responseData?.data?.message ?? ''
      
      console.log(' Determined status:', status)
      console.log(' Error message:', message)
      
      if (status === true && !message) {
        // Extract actual product data from response structure
        const newProduct = responseData?.data || response.data?.data || response.data
        console.log(' Product created successfully:', newProduct)
        
        // Get current state before clearing cache
        const currentState = get()
        
        // Clear cache to ensure fresh data on next fetch
        get().clearCache()
        
        // Update local state immediately for better UX
        set({
          products: [newProduct, ...(currentState.products || [])],
          totalProducts: (currentState.products?.length || 0) + 1,
          loading: false,
        })
        
        toast.success('Product created successfully')
        return { success: true, data: newProduct }
      } else {
        // Backend returned failure (like Google Drive auth error or validation error)
        const errorMessage = message || 'Failed to create product'
        console.error(' Backend error creating product:', responseData)
        toast.error(errorMessage)
        set({ loading: false })
        return { success: false, error: responseData }
      }
    } catch (error) {
      console.error(' Failed to create product:', error)
      console.error(' Error response:', error.response?.data)
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || error.response?.data?.data?.message || error.message || 'Failed to create product'
      toast.error(errorMessage)
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true })
    try {
      const response = await productsAPI.update(id, productData)
      
      // Check if API response is successful
      if (response.data?.status === false) {
        // API returned validation errors
        const errorMessage = response.data?.message || 'Failed to update product'
        console.error('Product update validation error:', response.data)
        toast.error(errorMessage)
        set({ loading: false })
        return { success: false, error: response.data }
      }
      
      // Extract actual product data from response structure
      const updatedProduct = response.data?.data || response.data || response
      console.log('Product updated successfully:', updatedProduct)
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        products: currentState.products.map(p => 
          p.id === id ? updatedProduct : p
        ),
        loading: false,
      })
      
      toast.success('Product updated successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to update product:', error)
      toast.error('Failed to update product')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true })
    try {
      await productsAPI.delete(id)
      console.log(' Product deleted successfully')
      
      // Get current state before clearing cache
      const currentState = get()
      
      // Clear cache to ensure fresh data on next fetch
      get().clearCache()
      
      // Update local state immediately for better UX
      set({
        products: currentState.products.filter(p => p.id !== id),
        totalProducts: Math.max(0, (currentState.products?.length || 0) - 1),
        loading: false,
      })
      
      toast.success('Product deleted successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    const currentState = get()
    const newFilters = { ...currentState.filters, ...filters }
    
    // Only fetch if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(currentState.filters)) {
      set({ filters: newFilters })
      
      // Debounce API call
      setTimeout(() => {
        get().fetchProducts(1, newFilters.search)
      }, 300)
    } else {
      set({ filters: newFilters })
    }
  },

  fetchProductsByUrl: async (url) => {
    if (!url) return
    
    set({ loading: true })
    try {
      const response = await productsAPI.getByUrl(url)
      
      console.log(' Product Store - Raw API Response (URL):', response)
      
      // Handle your API's response structure
      const apiData = response.data
      let products = apiData.data?.data || []
      const paginationData = apiData.data || {}
      
      // Extract pagination data from API response
      const pagination = {
        current_page: paginationData.current_page || 1,
        last_page: paginationData.last_page || 1,
        per_page: paginationData.per_page || 15,
        total: paginationData.total || products.length,
        next_page_url: paginationData.next_page_url || null,
        prev_page_url: paginationData.prev_page_url || null,
        first_page_url: paginationData.first_page_url || null,
        last_page_url: paginationData.last_page_url || null,
      }
      
      console.log(' Product Store - Processed Data (URL):', {
        apiData,
        products,
        pagination,
        productsLength: products.length
      })
      
      set({
        products: products,
        totalProducts: pagination.total,
        currentPage: pagination.current_page,
        pagination: pagination,
        loading: false,
        lastFetchTime: Date.now()
      })
      return response.data
    } catch (error) {
      console.error(' Product Store - Error (URL):', error)
      toast.error('Failed to fetch products')
      set({ 
        loading: false,
        error: error.message || 'Failed to fetch products'
      })
    }
  },

  clearCache: () => {
    productCache.clear()
    console.log('Product cache cleared')
  },
}))