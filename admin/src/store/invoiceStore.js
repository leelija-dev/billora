import { create } from 'zustand'
import api from '../services/api'
import toast from 'react-hot-toast'

export const useInvoiceStore = create((set, get) => ({
  invoices: [],
  totalInvoices: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    status: '',
  },

  fetchInvoices: async (page = 1) => {
    set({ loading: true })
    try {
      const { filters, pageSize } = get()
      const response = await api.get('/invoices/', {
        params: {
          page,
          page_size: pageSize,
          ...filters,
        },
      })

      set({
        invoices: response.data.results,
        totalInvoices: response.data.count,
        currentPage: page,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch invoices')
      set({ loading: false })
    }
  },

  createInvoice: async (invoiceData) => {
    set({ loading: true })
    try {
      const response = await api.post('/invoices/', invoiceData)
      set((state) => ({
        invoices: [response.data, ...state.invoices],
        totalInvoices: state.totalInvoices + 1,
        loading: false,
      }))
      toast.success('Invoice created successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to create invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateInvoice: async (id, invoiceData) => {
    set({ loading: true })
    try {
      const response = await api.put(`/invoices/${id}/`, invoiceData)
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? response.data : inv)),
        loading: false,
      }))
      toast.success('Invoice updated successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to update invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteInvoice: async (id) => {
    set({ loading: true })
    try {
      await api.delete(`/invoices/${id}/`)
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
        totalInvoices: state.totalInvoices - 1,
        loading: false,
      }))
      toast.success('Invoice deleted successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete invoice')
      set({ loading: false })
      return { success: false }
    }
  },

  markAsPaid: async (id) => {
    set({ loading: true })
    try {
      const response = await api.post(`/invoices/${id}/mark-paid/`)
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? response.data : inv)),
        loading: false,
      }))
      toast.success('Invoice marked as paid')
      return { success: true }
    } catch (error) {
      toast.error('Failed to mark invoice as paid')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchInvoices(1)
  },
}))
