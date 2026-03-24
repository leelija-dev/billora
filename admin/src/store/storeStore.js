import { create } from 'zustand'
import { storeAPI } from '../services/storeService'

const useStoreStore = create((set, get) => ({
  stores: [],
  totalStores: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  // Fetch stores by user ID
  fetchStores: async (userId, page = 1, filters = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.getByUserId(userId, filters.search)
      console.log('API Response in store:', response)
      
      // Extract stores array from correct nested structure
      const storesArray = response.data?.data?.data || response.data?.data || []
      console.log('Stores data extracted:', storesArray)
      
      set({
        stores: Array.isArray(storesArray) ? storesArray : [],
        totalStores: storesArray.length || 0,
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch stores',
        loading: false,
      })
      throw error
    }
  },

  // Create store
  createStore: async (storeData) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.create(storeData)
      const { stores } = get()
      set({
        stores: [response.data, ...stores],
        totalStores: get().totalStores + 1,
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create store',
        loading: false,
      })
      throw error
    }
  },

  // Update store
  updateStore: async (id, storeData) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.update(id, storeData)
      const { stores } = get()
      set({
        stores: stores.map(store => store.id === id ? response.data : store),
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update store',
        loading: false,
      })
      throw error
    }
  },

  // Delete store
  deleteStore: async (id) => {
    set({ loading: true, error: null })
    try {
      await storeAPI.delete(id)
      const { stores } = get()
      set({
        stores: stores.filter(store => store.id !== id),
        totalStores: get().totalStores - 1,
        loading: false,
      })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete store',
        loading: false,
      })
      throw error
    }
  },

  // Get edit data
  getEditData: async (userId) => {
    set({ loading: true, error: null })
    try {
      const response = await storeAPI.getEditData(userId)
      set({ loading: false })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch store data',
        loading: false,
      })
      throw error
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

export default useStoreStore
