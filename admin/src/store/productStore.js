import { create } from 'zustand'
import { productsAPI, stocksAPI } from '../services'
import toast from 'react-hot-toast'

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

  fetchProducts: async (page = 1, search = '') => {
    set({ loading: true })
    try {
      const response = await productsAPI.getAll(search)
      
      console.log(' Product Store - Raw API Response:', response)
      
      // Handle your API's response structure
      const apiData = response.data
      let products = apiData.data?.data || [] // Your API nests products in data.data.data
      const total = apiData.data?.total || products.length
      
      // Fetch stock data for each product
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
      })
      
      console.log(' Product Store - State Updated:', {
        productsCount: products.length,
        totalProducts: total,
        loading: false
      })
    } catch (error) {
      console.error(' Product Store - Error:', error)
      toast.error('Failed to fetch products')
      set({ loading: false })
    }
  },

  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const response = await productsAPI.create(productData)
      const apiData = response.data
      const product = apiData.data || apiData // Handle both nested and flat responses
      
      set((state) => ({
        products: [product, ...state.products],
        totalProducts: state.totalProducts + 1,
        loading: false,
      }))
      toast.success('Product created successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to create product')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true })
    try {
      const response = await productsAPI.update(id, productData)
      set((state) => ({
        products: state.products.map((p) => 
          p.id === id ? response.data : p
        ),
        loading: false,
      }))
      toast.success('Product updated successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to update product')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true })
    try {
      await productsAPI.delete(id)
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        totalProducts: state.totalProducts - 1,
        loading: false,
      }))
      toast.success('Product deleted successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete product')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchProducts(1, filters.search)
  },
}))