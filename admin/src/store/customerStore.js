import { create } from 'zustand'
import { customerAPI } from '../services'
import toast from 'react-hot-toast'
import { useAuthStore } from './authStore'

export const useCustomerStore = create((set, get) => ({
  customers: [],
  totalCustomers: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    status: '',
  },

  fetchCustomers: async (page = 1, search = '') => {
    set({ loading: true })
    try {
      const { user } = useAuthStore.getState()
      if (!user?.id) {
        throw new Error('User not authenticated')
      }
      
      const response = await customerAPI.getAll(user.id, search)
      
      set({
        customers: response.data,
        totalCustomers: response.data.length,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch customers')
      set({ loading: false })
    }
  },

  createCustomer: async (customerData) => {
    set({ loading: true })
    try {
      const { user } = useAuthStore.getState()
      const dataWithAdmin = {
        ...customerData,
        admin_id: user.id,
        created_by: user.id,
      }
      
      const response = await customerAPI.create(dataWithAdmin)
      set((state) => ({
        customers: [response.data, ...state.customers],
        totalCustomers: state.totalCustomers + 1,
        loading: false,
      }))
      toast.success('Customer created successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to create customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateCustomer: async (id, customerData) => {
    set({ loading: true })
    try {
      const { user } = useAuthStore.getState()
      const dataWithUser = {
        ...customerData,
        user_id: user.id,
      }
      
      const response = await customerAPI.update(id, dataWithUser)
      set((state) => ({
        customers: state.customers.map((c) => 
          c.id === id ? response.data : c
        ),
        loading: false,
      }))
      toast.success('Customer updated successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to update customer')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteCustomer: async (id) => {
    set({ loading: true })
    try {
      await customerAPI.delete(id)
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
        totalCustomers: state.totalCustomers - 1,
        loading: false,
      }))
      toast.success('Customer deleted successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete customer')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchCustomers(1, filters.search)
  },
}))