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
      setProducts(response.data || response);
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
      setProducts(response.data || response);
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
