import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api';

export const useCategories = (params = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.getAll(params);
      console.log('useCategories response:', response);
      // Handle the API response structure: { data: { data: [...categories] } }
      setCategories(response.data?.data || response.data || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  const searchCategories = async (query, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.search(query, filters);
      setCategories(response.categories || response);
    } catch (err) {
      setError(err.message || 'Failed to search categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.create(categoryData);
      setCategories(prev => [...prev, response.category || response]);
      return { success: true, data: response.category || response };
    } catch (err) {
      setError(err.message || 'Failed to create category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.update(id, categoryData);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...(response.category || response) } : cat)
      );
      return { success: true, data: response.category || response };
    } catch (err) {
      setError(err.message || 'Failed to update category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await categoriesAPI.delete(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.getById(id);
      return response.category || response;
    } catch (err) {
      setError(err.message || 'Failed to fetch category');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refreshCategories,
    searchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    fetchCategories,
  };
};
