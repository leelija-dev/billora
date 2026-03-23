import { create } from 'zustand'
import { unitsAPI } from '../services/unitsService'

const useUnitStore = create((set, get) => ({
  units: [],
  totalUnits: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  error: null,
  filters: {
    search: '',
  },

  // Fetch units
  fetchUnits: async (page = 1, filters = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await unitsAPI.getAll(page, filters)
      set({
        units: response.data.data || [],
        totalUnits: response.data.total || 0,
        currentPage: response.data.current_page || 1,
        pageSize: response.data.per_page || 10,
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch units',
        loading: false,
      })
      throw error
    }
  },

  // Create unit
  createUnit: async (unitData) => {
    set({ loading: true, error: null })
    try {
      const response = await unitsAPI.create(unitData)
      const { units } = get()
      set({
        units: [response.data, ...units],
        totalUnits: get().totalUnits + 1,
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create unit',
        loading: false,
      })
      throw error
    }
  },

  // Update unit
  updateUnit: async (id, unitData) => {
    set({ loading: true, error: null })
    try {
      const response = await unitsAPI.update(id, unitData)
      const { units } = get()
      set({
        units: units.map(unit => unit.id === id ? response.data : unit),
        loading: false,
      })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update unit',
        loading: false,
      })
      throw error
    }
  },

  // Delete unit
  deleteUnit: async (id) => {
    set({ loading: true, error: null })
    try {
      await unitsAPI.delete(id)
      const { units } = get()
      set({
        units: units.filter(unit => unit.id !== id),
        totalUnits: get().totalUnits - 1,
        loading: false,
      })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete unit',
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

export default useUnitStore