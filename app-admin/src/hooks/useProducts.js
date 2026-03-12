import { useState, useEffect } from 'react';
import { productsAPI } from '../api/products';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll(params);
      
      // Handle the API response structure: { data: { data: [...products] } }
      let productsData = [];
      
      if (response?.data?.data) {
        // Check if it's paginated data
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          productsData = response.data.data.data; // Paginated: { data: { data: { data: [...] } } }
        } else if (Array.isArray(response.data.data)) {
          productsData = response.data.data; // Non-paginated: { data: { data: [...] } }
        }
      } else if (response?.data) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }
      
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const searchProducts = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.search(query, filters);
      
      let productsData = [];
      if (response?.data?.data) {
        // Check if it's paginated data
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          productsData = response.data.data.data; // Paginated: { data: { data: { data: [...] } } }
        } else if (Array.isArray(response.data.data)) {
          productsData = response.data.data; // Non-paginated: { data: { data: [...] } }
        }
      } else if (response?.data) {
        productsData = response.data;
      } else if (Array.isArray(response)) {
        productsData = response;
      }
      
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getByCategory(categoryId);
      setProducts(response.data || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch products by category');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refreshProducts,
    searchProducts,
    getProductsByCategory,
    fetchProducts,
  };
};
