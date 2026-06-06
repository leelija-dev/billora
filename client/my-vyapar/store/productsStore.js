// store/productsStore.js - Zustand store for products management using secure API
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';
import { productsService } from '../services/productsService';

// Create Zustand store for products
export const useProductsStore = create(
  persist(
    (set, get) => ({
      // State
      products: [],
      categories: [],
      pagination: {},
      loading: false,
      error: null,
      storeId: null,
      search: '',
      selectedCategory: 'All',
      currentPage: 1,
      lastFetchParams: null,
      user: null,
      token: null,

      // Actions
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
      setPagination: (pagination) => set({ pagination }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setStoreId: (storeId) => set({ storeId }),
      setSearch: (search) => set({ search }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setUserContext: (user, token) => set({ user, token }),

      // Reset to first page when filters change
      resetPagination: () => set({ currentPage: 1 }),

      // Update search with category reset
      updateSearch: async (searchTerm) => {
        set({ 
          search: searchTerm, 
          currentPage: 1
        });
        
        const state = get();
        if (state.user?.id) {
          await state.fetchProducts(
            state.currentPage, 
            state.selectedCategory, 
            searchTerm
          );
        }
      },

      // Update category with proper API call
      updateCategory: async (categoryId) => {
        const state = get();
        
        set({ 
          selectedCategory: categoryId, 
          currentPage: 1,
          loading: true,
          error: null
        });
        
        try {
          if (state.user?.id) {
            await get().fetchProducts(
              1,
              categoryId,
              state.search
            );
          }
        } catch (error) {
          logger.error('Error updating category:', error);
          set({ error: error.message, loading: false });
        }
      },

      // Fetch products from API using service
      fetchProducts: async (page = 1, categoryId = "All", term = "") => {
        const state = get();
        
        // Prevent duplicate calls with same parameters
        const currentParams = { page, categoryId, term, userId: state.user?.id };
        const { lastFetchParams } = get();
        
        if (lastFetchParams && 
            JSON.stringify(lastFetchParams) === JSON.stringify(currentParams) &&
            get().products.length > 0) {
          logger.log('Skipping duplicate fetch with same parameters');
          return;
        }
        
        set({ loading: true, error: null, lastFetchParams: currentParams });
        
        try {
          // Validate user
          if (!state.user?.id) {
            throw new Error('User ID is required to fetch products');
          }
          
          let result;
          
          // Use service to fetch products based on category
          if (categoryId && categoryId !== "All") {
            result = await productsService.fetchProductsByCategory(
              categoryId,
              state.user.id,
              { page, per_page: 12, search: term }
            );
          } else {
            result = await productsService.fetchAllProducts(
              state.user.id,
              { page, per_page: 12, search: term }
            );
          }
          
          // Update store with transformed data
          set({
            products: result.products,
            pagination: result.pagination,
            categories: result.categories,
            storeId: result.storeId || get().storeId,
            loading: false,
            error: null
          });
          
          logger.log("Successfully loaded", result.products.length, "products");
          
          if (categoryId && categoryId !== "All") {
            logger.log(`Filtered by category: ${categoryId}`);
          }
          
        } catch (error) {
          logger.error("Error fetching products:", error);
          set({ 
            error: error.message || 'Failed to load products',
            loading: false,
            products: []
          });
          throw error;
        }
      },

      // Fetch categories only
      fetchCategories: async () => {
        const state = get();
        if (!state.user?.id) return [];
        
        try {
          const categories = await productsService.getCategories(state.user.id);
          set({ categories });
          return categories;
        } catch (error) {
          logger.error("Error fetching categories:", error);
          set({ error: error.message });
          throw error;
        }
      },

      // Change page with current filters
      changePage: async (newPage) => {
        const state = get();
        if (newPage === state.currentPage) return;
        
        set({ currentPage: newPage, loading: true });
        
        try {
          await state.fetchProducts(
            newPage,
            state.selectedCategory,
            state.search
          );
        } catch (error) {
          logger.error("Error changing page:", error);
          set({ loading: false });
        }
      },

      // Refresh current view
      refresh: async () => {
        const state = get();
        await state.fetchProducts(
          state.currentPage,
          state.selectedCategory,
          state.search
        );
      },

      // Apply advanced filters
      applyFilters: async (filters) => {
        const state = get();
        if (!state.user?.id) return;
        
        set({ loading: true, error: null, currentPage: 1 });
        
        try {
          const result = await productsService.fetchProductsWithFilters(
            state.user.id,
            {
              ...filters,
              page: 1,
              per_page: 12,
              search: filters.search || state.search,
              categoryId: filters.categoryId || state.selectedCategory
            }
          );
          
          set({
            products: result.products,
            pagination: result.pagination,
            categories: result.categories,
            loading: false,
            error: null
          });
          
          // Update filter states if provided
          if (filters.categoryId) set({ selectedCategory: filters.categoryId });
          if (filters.search !== undefined) set({ search: filters.search });
          
        } catch (error) {
          logger.error("Error applying filters:", error);
          set({ error: error.message, loading: false });
        }
      },

      // Clear store
      clearStore: () => set({
        products: [],
        categories: [],
        pagination: {},
        loading: false,
        error: null,
        storeId: null,
        search: '',
        selectedCategory: 'All',
        currentPage: 1,
        lastFetchParams: null
      }),

      // Reset error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'products-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        storeId: state.storeId,
        search: state.search,
        selectedCategory: state.selectedCategory,
        currentPage: state.currentPage,
      }),
    }
  )
);

// Export selector hooks for better performance
export const useProducts = () => useProductsStore((state) => state.products);
export const useProductsLoading = () => useProductsStore((state) => state.loading);
export const useProductsError = () => useProductsStore((state) => state.error);
export const useProductsPagination = () => useProductsStore((state) => state.pagination);
export const useProductsCategories = () => useProductsStore((state) => state.categories);
export const useProductsStoreId = () => useProductsStore((state) => state.storeId);
export const useSelectedCategory = () => useProductsStore((state) => state.selectedCategory);
export const useSearchTerm = () => useProductsStore((state) => state.search);
export const useCurrentPage = () => useProductsStore((state) => state.currentPage);