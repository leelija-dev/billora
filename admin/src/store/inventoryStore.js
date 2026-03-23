import { create } from 'zustand'
import { stocksAPI } from '../services'
import { useProductStore } from './productStore'
import toast from 'react-hot-toast'

export const useInventoryStore = create((set, get) => ({
  stocks: [],
  totalStocks: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    product_id: '',
    unit_id: '',
  },

  fetchStocks: async (page = 1, search = '') => {
    set({ loading: true })
    try {
      const response = await stocksAPI.getAll(search)
      
      console.log('Stock Store - Raw API Response:', response)
      
      // Handle your API's response structure
      const apiData = response.data
      const stocks = apiData.data?.data || apiData.data || []
      const total = apiData.data?.total || stocks.length
      
      // Get products and units data to enrich stock information
      const productStore = useProductStore.getState()
      const products = productStore.products || []
      
      // Get units from useUnits hook - we need to access it differently
      // Since we can't directly access hooks here, we'll use the product's unit_id
      // and map it when we have access to units in the component
      
      // Enrich stocks with product information
      const enrichedStocks = stocks.map(stock => {
        const product = stock.product || products.find(p => p.id === stock.product_id)
        
        return {
          ...stock,
          product_name: product?.name || `Product ${stock.product_id}`,
          product_sku: product?.sku || '',
          unit_id: product?.unit_id || stock.unit_id,
          // We'll map unit_name in the component where we have access to units
        }
      })
      
      console.log('Stock Store - Processed Data:', {
        apiData,
        stocks: enrichedStocks,
        total,
        stocksLength: enrichedStocks.length
      })
      
      set({
        stocks: enrichedStocks,
        totalStocks: total,
        currentPage: page,
        loading: false,
      })
      
      console.log('Stock Store - State Updated:', {
        stocksCount: enrichedStocks.length,
        totalStocks: total,
        loading: false
      })
    } catch (error) {
      console.error('Stock Store - Error:', error)
      toast.error('Failed to fetch stocks')
      set({ loading: false })
    }
  },

  createStock: async (stockData) => {
    set({ loading: true })
    try {
      const response = await stocksAPI.create(stockData)
      const apiData = response.data
      const stock = apiData.data || apiData

      // Get products data to enrich stock information
      const productStore = useProductStore.getState()
      const products = productStore.products || []
      
      // Enrich the new stock with product information
      const product = products.find(p => p.id === stock.product_id)
      const enrichedStock = {
        ...stock,
        product_name: product?.name || `Product ${stock.product_id}`,
        product_sku: product?.sku || '',
        unit_id: stock.unit_id || product?.unit_id,
        // Unit name will be mapped in the component
      }

      set((state) => ({
        stocks: [enrichedStock, ...state.stocks],
        totalStocks: state.totalStocks + 1,
        loading: false,
      }))
      toast.success('Stock created successfully')
      return { success: true }
    } catch (error) {
      console.error('Create Stock Error:', error)
      toast.error('Failed to create stock')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  updateStock: async (id, stockData) => {
    console.log(' Update Stock - Starting update for ID:', id)
    console.log(' Update Stock - Data to send:', stockData)
    
    set({ loading: true })
    try {
      const response = await stocksAPI.update(id, stockData)
      console.log(' Update Stock - API Response:', response)
      
      const apiData = response.data
      const stock = apiData.data || apiData
      console.log(' Update Stock - Processed stock data:', stock)

      // Get products data to enrich stock information
      const productStore = useProductStore.getState()
      const products = productStore.products || []
      
      // Enrich the updated stock with product information
      const product = products.find(p => p.id === stock.product_id)
      const enrichedStock = {
        ...stock,
        product_name: product?.name || `Product ${stock.product_id}`,
        product_sku: product?.sku || '',
        unit_id: stock.unit_id || product?.unit_id,
        // Ensure quantity is a number for consistency
        quantity: parseFloat(stock.quantity) || stock.quantity,
        // Unit name will be mapped in the component
      }

      console.log(' Update Stock - Enriched stock:', enrichedStock)

      // Update the stocks array by finding and replacing the specific stock
      set((state) => {
        const currentStocks = state.stocks
        const updatedStocks = currentStocks.map(s => {
          if (s.id === id) {
            return enrichedStock
          }
          return s
        })
        
        console.log(' Update Stock - Before state update:', {
          currentStocks: currentStocks.length,
          updatedStocks: updatedStocks.length,
          foundMatch: updatedStocks.some(s => s.id === id)
        })

        return {
          stocks: updatedStocks,
          loading: false,
        }
      })
      
      toast.success('Stock updated successfully')
      return { success: true }
    } catch (error) {
      console.error(' Update Stock Error:', error)
      console.error(' Update Stock Error Response:', error.response?.data)
      toast.error('Failed to update stock')
      set({ loading: false })
      return { success: false, error: error.response?.data }
    }
  },

  deleteStock: async (id) => {
    set({ loading: true })
    try {
      await stocksAPI.delete(id)
      set((state) => ({
        stocks: state.stocks.filter(s => s.id !== id),
        totalStocks: state.totalStocks - 1,
        loading: false,
      }))
      toast.success('Stock deleted successfully')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete stock')
      set({ loading: false })
      return { success: false }
    }
  },

  addStockQuantity: async (id, userId, quantity) => {
    set({ loading: true })
    try {
      const response = await stocksAPI.addStock(id, userId, quantity)
      const apiData = response.data
      const stock = apiData.data || apiData

      // Get products data to enrich stock information
      const productStore = useProductStore.getState()
      const products = productStore.products || []
      
      // Enrich the updated stock with product information
      const product = products.find(p => p.id === stock.product_id)
      const enrichedStock = {
        ...stock,
        product_name: product?.name || `Product ${stock.product_id}`,
        product_sku: product?.sku || '',
        unit_id: stock.unit_id || product?.unit_id,
        // Unit name will be mapped in the component
      }

      set((state) => ({
        stocks: state.stocks.map(s => s.id === id ? enrichedStock : s),
        loading: false,
      }))
      toast.success('Stock quantity updated successfully')
      return { success: true }
    } catch (error) {
      console.error('Add Stock Quantity Error:', error)
      toast.error('Failed to update stock quantity')
      set({ loading: false })
      return { success: false }
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } })
    get().fetchStocks(1)
  },
}))