import { create } from 'zustand'
import { productsAPI } from '../services/productsService'
import toast from 'react-hot-toast'

export const useDeletedProductStore = create((set, get) => ({
  deletedProducts: [],
  totalDeletedProducts: 0,
  currentPage: 1,
  pageSize: 15,
  loading: false,
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

  fetchDeletedProducts: async (page = 1, search = '') => {
    set({ loading: true })
    try {
      const response = await productsAPI.getDeleted(search)
      
      console.log(' Deleted Product Store - Raw API Response:', response)
      
      // Handle your API's response structure
      const apiData = response.data
      let deletedProducts = apiData.data?.data || []
      const paginationData = apiData.data || {}
      
      // Extract pagination data from API response
      const pagination = {
        current_page: paginationData.current_page || page,
        last_page: paginationData.last_page || 1,
        per_page: paginationData.per_page || 15,
        total: paginationData.total || deletedProducts.length,
        next_page_url: paginationData.next_page_url || null,
        prev_page_url: paginationData.prev_page_url || null,
        first_page_url: paginationData.first_page_url || null,
        last_page_url: paginationData.last_page_url || null,
      }
      
      console.log(' Deleted Product Store - Processed Data:', {
        apiData,
        deletedProducts,
        pagination,
        deletedProductsLength: deletedProducts.length
      })
      
      set({
        deletedProducts: deletedProducts,
        totalDeletedProducts: pagination.total,
        currentPage: pagination.current_page,
        pagination: pagination,
        loading: false,
      })
      return response.data
    } catch (error) {
      console.error(' Deleted Product Store - Error:', error)
      toast.error('Failed to fetch deleted products')
      set({ 
        loading: false,
        error: error.message || 'Failed to fetch deleted products'
      })
    }
  },

  fetchDeletedProductsByUrl: async (url) => {
    if (!url) return
    
    set({ loading: true })
    try {
      const response = await productsAPI.getByUrl(url)
      
      console.log(' Deleted Product Store - Raw API Response (URL):', response)
      
      // Handle your API's response structure
      const apiData = response.data
      let deletedProducts = apiData.data?.data || []
      const paginationData = apiData.data || {}
      
      // Extract pagination data from API response
      const pagination = {
        current_page: paginationData.current_page || 1,
        last_page: paginationData.last_page || 1,
        per_page: paginationData.per_page || 15,
        total: paginationData.total || deletedProducts.length,
        next_page_url: paginationData.next_page_url || null,
        prev_page_url: paginationData.prev_page_url || null,
        first_page_url: paginationData.first_page_url || null,
        last_page_url: paginationData.last_page_url || null,
      }
      
      console.log(' Deleted Product Store - Processed Data (URL):', {
        apiData,
        deletedProducts,
        pagination,
        deletedProductsLength: deletedProducts.length
      })
      
      set({
        deletedProducts: deletedProducts,
        totalDeletedProducts: pagination.total,
        currentPage: pagination.current_page,
        pagination: pagination,
        loading: false,
      })
      return response.data
    } catch (error) {
      console.error(' Deleted Product Store - Error (URL):', error)
      toast.error('Failed to fetch deleted products')
      set({ 
        loading: false,
        error: error.message || 'Failed to fetch deleted products'
      })
    }
  },

  restoreProduct: async (id) => {
    set({ loading: true })
    try {
      const response = await productsAPI.restore(id)
      console.log(' Product restored successfully:', response)
      
      // Get current state
      const currentState = get()
      
      // Update local state immediately for better UX
      set({
        deletedProducts: currentState.deletedProducts.filter(p => p.id !== id),
        totalDeletedProducts: Math.max(0, (currentState.deletedProducts?.length || 0) - 1),
        loading: false,
      })
      
      toast.success('Product restored successfully')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to restore product:', error)
      toast.error('Failed to restore product')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  forceDeleteProduct: async (id) => {
    set({ loading: true })
    try {
      const response = await productsAPI.forceDelete(id)
      console.log(' Product permanently deleted successfully:', response)
      
      // Get current state
      const currentState = get()
      
      // Update local state immediately for better UX
      set({
        deletedProducts: currentState.deletedProducts.filter(p => p.id !== id),
        totalDeletedProducts: Math.max(0, (currentState.deletedProducts?.length || 0) - 1),
        loading: false,
      })
      
      toast.success('Product permanently deleted')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Failed to permanently delete product:', error)
      toast.error('Failed to permanently delete product')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },
}))
