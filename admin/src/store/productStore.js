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
      const total = apiData.data?.total || products.length
      
      // Fetch stock data for each product (only if products exist)
      if (products.length > 0) {
        try {
          const stockPromises = products.map(product => 
            stocksAPI.getById(product.id).catch(error => {
              console.error(`Failed to fetch stock for product ${product.id}:`, error)
              return null
            })
          )
          
          const stockResponses = await Promise.all(stockPromises)
          
          // Merge stock data with products
          products = products.map((product, index) => {
            const stockResponse = stockResponses[index]
            const stockData = stockResponse?.data?.data || stockResponse?.data
            
            return {
              ...product,
              stock: stockData?.quantity || 0,
              maxStock: stockData?.quantity || 100,
              lowStockThreshold: 10,
              lowStock: (stockData?.quantity || 0) <= 10
            }
          })
          
          console.log(' Product Store - Stock data merged:', products)
        } catch (stockError) {
          console.error(' Product Store - Error fetching stock data:', stockError)
          // Set default stock values if stock API fails
          products = products.map(product => ({
            ...product,
            stock: 0,
            maxStock: 100,
            lowStockThreshold: 10,
            lowStock: true
          }))
        }
      }
      
      // Cache the results
      const cacheData = {
        products: products,
        total: total
      }
      setCachedData(cacheKey, cacheData)
      
      console.log(' Product Store - Processed Data:', {
        apiData,
        products,
        total,
        productsLength: products.length
      })
      
      set({
        products: products,
        totalProducts: total,
        currentPage: page,
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
      
      // Extract actual product data from response structure
      const newProduct = response.data?.data || response.data || response
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
      return { success: true }
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Failed to create product')
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

  clearCache: () => {
    productCache.clear()
    console.log('Product cache cleared')
  },
}))