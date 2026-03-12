import { useState, useEffect } from 'react';
import { stocksAPI } from '../api/stocks';

export const useStockDetail = (stockId) => {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStock = async () => {
    if (!stockId) {
      setError('Stock ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await stocksAPI.getById(stockId);
      
      console.log('Raw API Response:', response);
      
      // Extract stock data from the nested structure
      let stockData = null;
      
      if (response?.data?.data) {
        stockData = response.data.data;
        console.log('Extracted Stock Data:', stockData);
      } else if (response?.data) {
        stockData = response.data;
      } else {
        stockData = response;
      }
      
      setStock(stockData);
      
    } catch (err) {
      console.error('Error fetching stock:', err);
      setError(err.message || 'Failed to fetch stock');
      setStock(null);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (stockData) => {
    if (!stockId) {
      setError('Stock ID is required for update');
      return { success: false, error: 'Stock ID is required for update' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await stocksAPI.update(stockId, stockData);
      console.log('Update Response:', response);
      
      // Extract updated stock from response
      let updatedStock = null;
      
      if (response?.data?.data) {
        updatedStock = response.data.data;
      } else if (response?.data) {
        updatedStock = response.data;
      } else {
        updatedStock = response;
      }
      
      setStock(updatedStock);
      return { success: true, data: updatedStock };
    } catch (err) {
      console.error('Error updating stock:', err);
      setError(err.message || 'Failed to update stock');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (quantityData) => {
    if (!stockId) {
      setError('Stock ID is required');
      return { success: false, error: 'Stock ID is required' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await stocksAPI.addStock(stockId, quantityData);
      console.log('Add Stock Response:', response);
      
      // Extract updated stock from response
      let updatedStock = null;
      
      if (response?.data?.data) {
        updatedStock = response.data.data;
      } else if (response?.data) {
        updatedStock = response.data;
      } else {
        updatedStock = response;
      }
      
      setStock(updatedStock);
      return { success: true, data: updatedStock };
    } catch (err) {
      console.error('Error adding stock:', err);
      setError(err.message || 'Failed to add stock');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteStock = async () => {
    if (!stockId) {
      setError('Stock ID is required for delete');
      return { success: false, error: 'Stock ID is required for delete' };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await stocksAPI.delete(stockId);
      console.log('Delete Response:', response);
      
      if (response?.status === true || response?.data?.status === true) {
        return { success: true };
      } else {
        return { success: false, error: 'Delete operation failed' };
      }
    } catch (err) {
      console.error('Error deleting stock:', err);
      setError(err.message || 'Failed to delete stock');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshStock = () => {
    fetchStock();
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchStock();
  }, [stockId]);

  return {
    stock,
    loading,
    error,
    updateStock,
    addStock,
    deleteStock,
    refreshStock,
    clearError,
    fetchStock,
  };
};