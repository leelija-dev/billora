import { useState, useEffect } from 'react';
import { categoriesAPI } from '../api';

export const useCategoryDetail = (categoryId) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]); // Added for products if needed

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
      
      console.log('Raw API Response:', response); // Debug log
      
      // Handle the nested response structure
      // Your API returns: { data: { data: { ...category } } }
      let categoryData = null;
      
      if (response?.data?.data) {
        // Structure: { data: { data: { ... } } }
        categoryData = response.data.data;
      } else if (response?.data) {
        // Structure: { data: { ... } }
        categoryData = response.data;
      } else if (response?.category) {
        // Structure: { category: { ... } }
        categoryData = response.category;
      } else {
        // Direct object
        categoryData = response;
      }
      
      console.log('Extracted Category Data:', categoryData); // Debug log
      setCategory(categoryData);
      
      // If you have products in the response, extract them too
      if (response?.data?.products) {
        setProducts(response.data.products);
      }
      
    } catch (err) {
      console.error('Error fetching category:', err);
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
      
      // Handle the nested response structure for update
      let updatedCategory = null;
      
      if (response?.data?.data) {
        updatedCategory = response.data.data;
      } else if (response?.data) {
        updatedCategory = response.data;
      } else if (response?.category) {
        updatedCategory = response.category;
      } else {
        updatedCategory = response;
      }
      
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
      const response = await categoriesAPI.delete(categoryId);
      
      // Check if deletion was successful
      if (response?.status === true || response?.success === true) {
        return { success: true };
      } else {
        return { success: false, error: 'Delete operation failed' };
      }
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
    products, // Added to return products
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    refreshCategory,
    clearError,
    fetchCategory,
  };
};