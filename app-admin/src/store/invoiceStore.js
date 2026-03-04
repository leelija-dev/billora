import { create } from 'zustand';
import { invoicesAPI } from '../services/api';
import { Alert } from 'react-native';

export const useInvoiceStore = create((set, get) => ({
  invoices: [],
  totalInvoices: 0,
  currentPage: 1,
  pageSize: 10,
  loading: false,
  filters: {
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  },

  fetchInvoices: async (page = 1) => {
    set({ loading: true });
    try {
      const { filters, pageSize } = get();
      const response = await invoicesAPI.list({
        page,
        page_size: pageSize,
        ...filters,
      });
      
      set({
        invoices: response.data.results || response.data,
        totalInvoices: response.data.count || response.data.length,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch invoices');
      set({ loading: false });
    }
  },

  createInvoice: async (invoiceData) => {
    set({ loading: true });
    try {
      const response = await invoicesAPI.create(invoiceData);
      set((state) => ({
        invoices: [response.data, ...state.invoices],
        totalInvoices: state.totalInvoices + 1,
        loading: false,
      }));
      Alert.alert('Success', 'Invoice created successfully');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create invoice');
      set({ loading: false });
      return { success: false };
    }
  },

  updateInvoice: async (id, invoiceData) => {
    set({ loading: true });
    try {
      const response = await invoicesAPI.update(id, invoiceData);
      set((state) => ({
        invoices: state.invoices.map((i) => 
          i.id === id ? response.data : i
        ),
        loading: false,
      }));
      Alert.alert('Success', 'Invoice updated successfully');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update invoice');
      set({ loading: false });
      return { success: false };
    }
  },

  deleteInvoice: async (id) => {
    set({ loading: true });
    try {
      await invoicesAPI.delete(id);
      set((state) => ({
        invoices: state.invoices.filter((i) => i.id !== id),
        totalInvoices: state.totalInvoices - 1,
        loading: false,
      }));
      Alert.alert('Success', 'Invoice deleted successfully');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete invoice');
      set({ loading: false });
      return { success: false };
    }
  },

  markAsPaid: async (id) => {
    set({ loading: true });
    try {
      const response = await invoicesAPI.markAsPaid(id);
      set((state) => ({
        invoices: state.invoices.map((i) => 
          i.id === id ? response.data : i
        ),
        loading: false,
      }));
      Alert.alert('Success', 'Invoice marked as paid');
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to mark as paid');
      set({ loading: false });
      return { success: false };
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchInvoices(1);
  },

  clearFilters: () => {
    set({
      filters: {
        search: '',
        status: '',
        dateFrom: '',
        dateTo: '',
      },
    });
    get().fetchInvoices(1);
  },
}));