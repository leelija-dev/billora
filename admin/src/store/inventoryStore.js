import { create } from 'zustand'
import { stocksAPI } from '../services'
import { useProductStore } from './productStore'
import toast from 'react-hot-toast'

export const useInventoryStore = create((set, get) => ({
  stocks: [],
  totalStocks: 0,
  currentPage: 1,
  pageSize: 8,
  loading: false,
  filters: {
    search: '',
    product_id: '',
    unit_id: '',
    stock: '',
    product: '',
    seller: '',
  },

  fetchStocks: async (page = 1, search = '', forceRefresh = false, filters = {}) => {
  set({ loading: true })
  try {
    // Pass the page parameter and filters to the API
    const response = await stocksAPI.getAll(search, page, filters)
    
    console.log('Stock Store - Raw API Response:', response)
    
    // Handle your API's response structure
    const apiData = response.data
    const stocks = apiData.data?.data || apiData.data || []
    const total = apiData.data?.total || stocks.length
    const currentPage = apiData.data?.current_page || page
    
    // Use nested product and unit data directly from API response
    const enrichedStocks = stocks.map(stock => {
      const product = stock.product || {}
      const unit = product.unit || {}
      
      return {
        ...stock,
        product_name: product.name || `Product ${stock.product_id}`,
        product_sku: product.sku || '',
        unit_name: unit.name || unit.code || 'N/A',
        unit_code: unit.code || '',
      }
    })
    
    set({
      stocks: enrichedStocks,
      totalStocks: total,
      currentPage: currentPage,
      loading: false,
    })
    
  } catch (error) {
    console.error('Stock Store - Error:', error)
    toast.error('Failed to fetch stocks')
    set({ loading: false })
  }
},

  createStock: async (stockData) => {
    console.log('Create Stock - Starting with data:', stockData)
    set({ loading: true })
    try {
      const response = await stocksAPI.create(stockData)
      const apiData = response.data
      console.log('Create Stock - API Response:', response)

      // Handle different response formats
      let newStock = null
      if (apiData.data) {
        if (Array.isArray(apiData.data)) {
          // Backend returns array of all stocks - find the newly created one
          // The new stock should be the one with matching product_id and quantity
          const createdStock = apiData.data.find(stock =>
            stock.product_id == stockData.product_id &&
            stock.quantity == stockData.quantity
          )
          if (createdStock) {
            newStock = createdStock
          } else {
            // Fallback: use the first stock if we can't find the exact match
            newStock = apiData.data[0]
          }
        } else {
          // Single stock object
          newStock = apiData.data
        }
      } else {
        // Fallback to entire response
        newStock = apiData
      }

      console.log('Create Stock - Processed stock data:', newStock)

      // Get products data to enrich stock information
      const productStore = useProductStore.getState()
      const products = productStore.products || []

      // Enrich the new stock with product information
      const product = products.find(p => p.id === newStock?.product_id)
      const enrichedStock = {
        ...newStock,
        product_name: product?.name || `Product ${newStock?.product_id}`,
        product_sku: product?.sku || '',
        unit_id: newStock?.unit_id,
        // Unit name will be mapped in the component
      }

      console.log('Create Stock - Enriched stock:', enrichedStock)

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
        unit_id: stock.unit_id,
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

      // Fetch fresh data after update
      get().fetchStocks()

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

  // In useInventoryStore
deductStockQuantity: async (id, userId, quantity) => {
  set({ loading: true })
  try {
    // Validate that quantity is not greater than available stock
    const currentStock = get().stocks.find(s => s.id === id)
    if (!currentStock) {
      toast.error('Stock item not found')
      set({ loading: false })
      return { success: false }
    }

    const currentQuantity = parseFloat(currentStock.quantity) || 0
    if (quantity > currentQuantity) {
      toast.error(`Cannot deduct more than available stock (${currentQuantity})`)
      set({ loading: false })
      return { success: false }
    }

    const response = await stocksAPI.deleteStockQuantity(id, userId, quantity)
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
      unit_id: stock.unit_id,
    }

    set((state) => ({
      stocks: state.stocks.map(s => s.id === id ? enrichedStock : s),
      loading: false,
    }))

    toast.success('Stock deducted successfully')
    return { success: true }
  } catch (error) {
    console.error('Deduct Stock Quantity Error:', error)
    toast.error(error.response?.data?.message || 'Failed to deduct stock quantity')
    set({ loading: false })
    return { success: false }
  }
},

  deleteStock: async (id, userId) => {
    console.log(' Inventory Store - Starting delete for stock ID:', id, 'User ID:', userId)
    set({ loading: true })
    try {
      const response = await stocksAPI.delete(id, userId)
      console.log(' Inventory Store - Delete API response:', response)

      // Check if the delete was successful
      if (response.data?.status === false) {
        throw new Error(response.data.message || 'Failed to delete stock')
      }

      set((state) => {
        const currentStocks = state.stocks
        const filteredStocks = currentStocks.filter(s => s.id !== id)
        console.log(' Inventory Store - Before deletion:', {
          totalStocks: currentStocks.length,
          stockIdToDelete: id,
          foundStock: currentStocks.some(s => s.id === id)
        })
        console.log(' Inventory Store - After deletion:', {
          totalStocks: filteredStocks.length,
          stockRemoved: !filteredStocks.some(s => s.id === id)
        })

        return {
          stocks: filteredStocks,
          totalStocks: state.totalStocks - 1,
          loading: false,
        }
      })

      toast.success('Stock deleted successfully')
      return { success: true }
    } catch (error) {
      console.error(' Inventory Store - Delete Error:', error)
      console.error(' Inventory Store - Delete Error Response:', error.response?.data)
      toast.error(`Failed to delete stock: ${error.response?.data?.message || error.message}`)
      set({ loading: false })
      return { success: false, error: error.response?.data }
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
        unit_id: stock.unit_id,
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
    // Don't automatically fetch here - let the component handle it
  },
}))