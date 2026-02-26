import { create } from 'zustand'
import api from '../services/api'
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

  fetchProducts: async (page = 1) => {
    set({ loading: true })
    try {
      const { filters, pageSize } = get()
      const response = await api.get('/products/', {
        params: {
          page,
          page_size: pageSize,
          ...filters,
        },
      })
      
      set({
        products: response.data.results,
        totalProducts: response.data.count,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch products')
      set({ loading: false })
    }
  },

  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const response = await api.post('/products/', productData)
      set((state) => ({
        products: [response.data, ...state.products],
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
      const response = await api.put(`/products/${id}/`, productData)
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
      await api.delete(`/products/${id}/`)
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
    get().fetchProducts(1)
  },
}))