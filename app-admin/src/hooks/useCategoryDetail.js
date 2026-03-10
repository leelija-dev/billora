import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api';

export const useCategoryDetail = (categoryId) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = async () => {
    if (!categoryId) {
      setError('Category ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.getById(categoryId);
      setCategory(response.category || response);
    } catch (err) {
      setError(err.message || 'Failed to fetch category');
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryData) => {
    if (!categoryId) {
      setError('Category ID is required for update');
      return { success: false, error: 'Category ID is required for update' };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.update(categoryId, categoryData);
      const updatedCategory = response.category || response;
      setCategory(updatedCategory);
      return { success: true, data: updatedCategory };
    } catch (err) {
      setError(err.message || 'Failed to update category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!categoryId) {
      setError('Category ID is required for delete');
      return { success: false, error: 'Category ID is required for delete' };
    }

    try {
      setLoading(true);
      setError(null);
      await categoriesAPI.delete(categoryId);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async () => {
    if (!category) {
      setError('No category data available');
      return { success: false, error: 'No category data available' };
    }

    const updatedData = {
      name: category.name,
      description: category.description,
      is_active: !category.is_active,
    };

    return await updateCategory(updatedData);
  };

  const refreshCategory = () => {
    fetchCategory();
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  return {
    category,
    loading,
    error,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    refreshCategory,
    clearError,
    fetchCategory,
  };
};
