import { create } from 'zustand'
import { invoiceAPI } from '../services'
import toast from 'react-hot-toast'

export const useInvoiceStore = create((set, get) => ({
  // State
  invoices: [],
  totalInvoices: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
  },
  billGenerateData: {},

  // Fetch invoices/bills history with pagination and search
  fetchInvoices: async (page = 1, filters = {}) => {
    set({ loading: true })
    try {
      const response = await invoiceAPI.getAll(page, filters)
      const invoices = response.data?.data?.data || response.data?.data || []

      // Enrich invoices with customer and store names
      const enrichedInvoices = await Promise.all(
        invoices.map(async (invoice) => {
          try {
            // Fetch customer and store details
            const [customerResponse, storeResponse] = await Promise.all([
              invoiceAPI.getCustomer(invoice.customer_id),
              invoiceAPI.getStore(invoice.store_id)
            ])

            const customer = customerResponse.data?.data || customerResponse.data || {}
            const store = storeResponse.data?.data || storeResponse.data || {}

            return {
              ...invoice,
              customer: customer,
              store: store,
              customer_name: customer.name || `Customer #${invoice.customer_id}`,
              store_name: store.name || `Store #${invoice.store_id}`
            }
          } catch (error) {
            console.error('Failed to fetch customer/store details:', error)
            return {
              ...invoice,
              customer_name: `Customer #${invoice.customer_id}`,
              store_name: `Store #${invoice.store_id}`
            }
          }
        })
      )

      set({
        invoices: enrichedInvoices,
        totalInvoices: response.data?.data?.total || response.data?.total || 0,
        currentPage: response.data?.data?.current_page || page,
        pageSize: response.data?.data?.per_page || 10,
        loading: false,
      })
    } catch (error) {
      toast.error('Failed to fetch invoices')
      set({ loading: false })
    }
  },

  // Get bill generate page data
  fetchBillGenerateData: async () => {
    set({ loading: true, error: null })
    try {
      const response = await invoiceAPI.getBillGenerateData()
      set({ 
        billGenerateData: response.data?.data || {},
        loading: false 
      })
    } catch (error) {
      console.error('Failed to fetch bill generate data:', error)
      set({ 
        error: error.message || 'Failed to fetch bill generate data',
        loading: false 
      })
    }
  },

  // Create/store new invoice/bill with items
  createInvoice: async (invoiceData) => {
    set({ loading: true })
    try {
      const response = await invoiceAPI.create(invoiceData)
      set((state) => ({
        invoices: [response.data, ...state.invoices],
        totalInvoices: state.totalInvoices + 1,
        loading: false,
      }))
      toast.success('Invoice created successfully')
      return { success: true, data: response.data }
    } catch (error) {
      toast.error('Failed to create invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Update invoice/bill
  updateInvoice: async (id, invoiceData) => {
    set({ loading: true })
    try {
      const response = await invoiceAPI.update(id, invoiceData)
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv.id === id ? response.data : inv)),
        loading: false,
      }))
      toast.success('Invoice updated successfully')
      return { success: true, data: response.data }
    } catch (error) {
      toast.error('Failed to update invoice')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  // Delete invoice/bill
  deleteInvoice: async (id) => {
    set({ loading: true })
    try {
      await invoiceAPI.delete(id)
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

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchInvoices(1)
  },
}))
