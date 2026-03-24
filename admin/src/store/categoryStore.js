import { create } from 'zustand'
import { categoriesAPI } from '../services/categoriesService'

const useCategoryStore = create((set, get) => ({
  categories: [],
  totalCategories: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  // Fetch categories
  fetchCategories: async (page = 1, filters = {}) => {
    console.log('fetchCategories called with:', page, filters)
    set({ loading: true, error: null })
    try {
      const response = await categoriesAPI.getAll(page, filters)
      console.log('API Response in store:', response)
      console.log('Categories data:', response.data.data.data)
      const categoriesArray = response.data.data.data || []
      const paginationData = response.data.data || {}
      set({
        categories: categoriesArray,
        totalCategories: paginationData.total || 0,
        currentPage: paginationData.current_page || 1,
        pageSize: paginationData.per_page || 10,
        loading: false,
      })
      console.log('Store updated with categories:', categoriesArray)
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
      const { categories } = get()
      set({
        categories: [response.data, ...categories],
        totalCategories: get().totalCategories + 1,
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create category',
        loading: false,
      })
      throw error
    }
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    set({ loading: true, error: null })
    try {
      const response = await categoriesAPI.update(id, categoryData)
      const { categories } = get()
      set({
        categories: categories.map(category => category.id === id ? response.data : category),
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update category',
        loading: false,
      })
      throw error
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    set({ loading: true, error: null })
    try {
      await categoriesAPI.delete(id)
      const { categories } = get()
      set({
        categories: categories.filter(category => category.id !== id),
        totalCategories: get().totalCategories - 1,
        loading: false,
      })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete category',
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

export default useCategoryStore
