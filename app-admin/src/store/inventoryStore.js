import { create } from 'zustand';
import { inventoryAPI } from '../services/api';
import { Alert } from 'react-native';

export const useInventoryStore = create((set, get) => ({
  stockLogs: [],
  totalLogs: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    type: '',
    dateFrom: '',
    dateTo: '',
  },

  fetchStockLogs: async (page = 1) => {
    set({ loading: true });
    try {
      const { filters, pageSize } = get();
      const response = await inventoryAPI.list({
        page,
        page_size: pageSize,
        ...filters,
      });
      
      set({
        stockLogs: response.data.results || response.data,
        totalLogs: response.data.count || response.data.length,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch stock logs');
      set({ loading: false });
    }
  },

  addStock: async (data) => {
    set({ loading: true });
    try {
      const response = await inventoryAPI.add(data);
      Alert.alert('Success', 'Stock added successfully');
      get().fetchStockLogs();
      return { success: true, data: response.data };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add stock');
      set({ loading: false });
      return { success: false };
    }
  },

  removeStock: async (data) => {
    set({ loading: true });
    try {
      const response = await inventoryAPI.remove(data);
      Alert.alert('Success', 'Stock removed successfully');
      get().fetchStockLogs();
      return { success: true, data: response.data };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to remove stock');
      set({ loading: false });
      return { success: false };
    }
  },

  getLowStock: async () => {
    try {
      const response = await inventoryAPI.lowStock();
      return response.data;
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch low stock items');
      return [];
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchStockLogs(1);
  },

  clearFilters: () => {
    set({
      filters: {
        search: '',
        type: '',
        dateFrom: '',
        dateTo: '',
      },
    });
    get().fetchStockLogs(1);
  },
}));