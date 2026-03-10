import { useState } from 'react';
import { categoriesAPI } from '../api';

export const useCategoryForm = (categoryId = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.create(categoryData);
      return { success: true, data: response.category || response };
    } catch (err) {
      setError(err.message || 'Failed to create category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    if (!categoryId && !id) {
      setError('Category ID is required for update');
      return { success: false, error: 'Category ID is required for update' };
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.update(categoryId || id, categoryData);
      return { success: true, data: response.category || response };
    } catch (err) {
      setError(err.message || 'Failed to update category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const saveCategory = async (categoryData) => {
    if (categoryId) {
      return await updateCategory(categoryId, categoryData);
    } else {
      return await createCategory(categoryData);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    createCategory,
    updateCategory,
    saveCategory,
    setError,
    clearError,
  };
};
