import { useState, useEffect } from 'react';
import { productsAPI } from '../api/products';

export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getById(productId);
      setProduct(response.data || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productData) => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.update(productId, productData);
      setProduct(response.data || response);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      await productsAPI.delete(productId);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (stockData) => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.updateStock(productId, stockData);
      setProduct(prev => ({ ...prev, ...response.data }));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update stock');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    refreshProduct: fetchProduct,
  };
};
