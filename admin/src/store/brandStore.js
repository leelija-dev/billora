import { create } from 'zustand'
import { brandsAPI } from '../services/brandsService'
import { useAuthStore } from './authStore'

const useBrandStore = create((set, get) => ({
  brands: [],
  totalBrands: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  // Fetch brands
  fetchBrands: async (page = 1, filters = {}) => {
    console.log('fetchBrands called with:', page, filters)
    set({ loading: true, error: null })
    try {
      const response = await brandsAPI.getAll(filters.search)
      console.log('API Response in store:', response)
      
      // Extract brands array from response structure
      const brandsArray = response.data?.data?.data || response.data?.data || response.data || []
      const total = response.data?.data?.total || brandsArray.length
      
      set({
        brands: Array.isArray(brandsArray) ? brandsArray : [],
        totalBrands: total,
        currentPage: page,
        loading: false,
      })
      console.log('Store updated with brands:', brandsArray)
      return response.data
    } catch (error) {
      console.log('Error in fetchBrands:', error)
      set({
        error: error.response?.data?.message || 'Failed to fetch brands',
        loading: false,
      })
      throw error
    }
  },

  // Create brand
  createBrand: async (brandData) => {
    console.log('createBrand called with:', brandData)
    set({ loading: true, error: null })
    try {
      const response = await brandsAPI.create(brandData)
      console.log('✅ Brand created successfully:', response.data)
      
      // After successful creation, refresh the brands list
      await get().fetchBrands()
      
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create brand',
        loading: false,
      })
      throw error
    }
  },

  // Update brand
  updateBrand: async (id, brandData) => {
    console.log('updateBrand called with:', id, brandData)
    set({ loading: true, error: null })
    try {
      const response = await brandsAPI.update(id, brandData)
      console.log('✅ Brand updated successfully:', response.data)
      
      // Refresh the brands list
      await get().fetchBrands()
      
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update brand',
        loading: false,
      })
      throw error
    }
  },

  // Delete brand
  deleteBrand: async (id) => {
    console.log('deleteBrand called with:', id)
    set({ loading: true, error: null })
    try {
      await brandsAPI.delete(id)
      console.log('✅ Brand deleted successfully')
      
      // Refresh the brands list
      await get().fetchBrands()
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete brand',
        loading: false,
      })
      throw error
    }
  },

  // Get single brand
  getBrand: async (id) => {
    console.log('getBrand called with:', id)
    try {
      const response = await brandsAPI.getById(id)
      console.log('✅ Brand fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch brand:', error)
      throw error.response?.data || error.message
    }
  },

  // Set filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  // Clear error
  clearError: () => set({ error: null }),
}))

export default useBrandStore
