// store/productsStore.js - Zustand store for products management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';

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

      // Fetch products from API
      fetchProducts: async (page = 1, categoryId = "All", term = "", user, token) => {
        set({ loading: true, error: null });
        
        try {
          // Note: restaurant-all-products is a public endpoint, no auth required
          // But we still need user ID for the API call
          if (!user || !user.id) {
            logger.log('User ID required for products API:', { user });
            throw new Error('User ID is required to fetch products');
          }

          const params = new URLSearchParams({
            page: String(page),
            per_page: 15,
          });
          
          if (term) params.set("search", term);
          
          let url = "";
          if (categoryId && categoryId !== "All") {
            params.set("user_id", String(user.id));
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/restaurant-all-products/category/${categoryId}?${params.toString()}`;
          } else {
            url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/restaurant-all-products/${user.id}?${params.toString()}`;
          }

          logger.log("Fetching products from:", url);

          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include' // Include cookies for authentication
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const productsData = await response.json();
          console.log("🔍 Products API response:", productsData);
          console.log("🔍 Products data structure:", {
            hasProducts: !!productsData?.products,
            hasProductsData: !!productsData?.products?.data,
            productsDataArray: Array.isArray(productsData?.products?.data),
            productsLength: productsData?.products?.data?.length,
            status: productsData?.status
          });

          // Set storeId only if stores data exists (for regular API, not category API)
          if (Array.isArray(productsData?.stores) && productsData.stores.length > 0) {
            set({ storeId: productsData.stores[0].id });
            logger.log("Store ID set:", productsData.stores[0].id);
          }

          // Process products data
          let productsArray = [];
          if (productsData?.products?.data && Array.isArray(productsData.products.data)) {
            productsArray = productsData.products.data;
            console.log("✅ Using products.data array:", productsArray.length, "products");
          } else if (productsData?.data && Array.isArray(productsData.data)) {
            productsArray = productsData.data;
            console.log("✅ Using data array:", productsArray.length, "products");
          } else if (Array.isArray(productsData)) {
            productsArray = productsData;
            console.log("✅ Using direct array:", productsArray.length, "products");
          } else {
            console.log("❌ No products found in response structure");
            console.log("Available keys:", Object.keys(productsData));
            console.log("Products structure:", productsData?.products);
            console.log("Data structure:", productsData?.data);
          }

          // Transform products
          const transformedProducts = productsArray.map(product => {
            let imageUrl = product.image;
            
            if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
              if (imageUrl.includes('drive.google.com')) {
                let fileId = null;
                
                if (imageUrl.includes('/file/d/')) {
                  const match = imageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                  fileId = match ? match[1] : null;
                } else if (imageUrl.includes('uc?export=view')) {
                  const match = imageUrl.match(/id=([a-zA-Z0-9_-]+)/);
                  fileId = match ? match[1] : null;
                }
                
                if (fileId) {
                  imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
                } else {
                  imageUrl = null;
                }
              }
            } else if (imageUrl && imageUrl.startsWith('/')) {
              imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}${imageUrl}`;
            } else if (imageUrl && imageUrl !== "") {
              const cleanImageUrl = imageUrl.replace(/^"|"$/g, '');
              imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/storage/${cleanImageUrl}`;
            } else {
              imageUrl = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
            }

            return {
              id: product.id,
              name: product.name || "Unnamed Product",
              selling_price: parseFloat(product.selling_price) || 0,
              price: parseFloat(product.selling_price) || 0,
              category: product.category?.name || "General",
              brand: product.brand?.name || "Unknown",
              unit: product.unit?.name || "Piece",
              unit_id: product.unit_id || 1,
              inStock: product.is_active === 1 || product.is_active === true,
              discount_percentage: parseFloat(product.discount_percentage) || 0,
              gst_percentage: parseFloat(product.gst_percentage) || 0,
              description: product.description || "",
              img: imageUrl,
            };
          });

          // Update state
          // Force immediate state update
          const newState = {
            products: transformedProducts,
            pagination: {
              current_page: productsData.current_page || productsData.products?.current_page || 1,
              last_page: productsData.last_page || productsData.products?.last_page || 1,
              per_page: productsData.per_page || productsData.products?.per_page || 15,
              total: productsData.total || productsData.products?.total || 0,
              next_page_url: productsData.next_page_url || productsData.products?.next_page_url,
              prev_page_url: productsData.prev_page_url || productsData.products?.prev_page_url,
              first_page_url: productsData.first_page_url || productsData.products?.first_page_url,
              last_page_url: productsData.last_page_url || productsData.products?.last_page_url,
              links: productsData.links || productsData.products?.links || []
            },
            categories: productsData.categories && Array.isArray(productsData.categories) 
              ? [{ id: "All", name: "All" }, ...productsData.categories] 
              : [{ id: "All", name: "All" }],
            loading: false,
            error: null
          };
          
          set(newState);
          console.log("✅ Loading set to false, products count:", transformedProducts.length);
          
          // Force a re-render in development
          if (process.env.NODE_ENV === 'development') {
            setTimeout(() => {
              console.log("🔄 Forced re-render check");
            }, 100);
          }

          logger.log("Successfully loaded", transformedProducts.length, "products");
          
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
        currentPage: 1
      }),

      // Reset error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'products-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for products
      partialize: (state) => ({
        // Only persist these fields
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
