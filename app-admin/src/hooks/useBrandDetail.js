import { useState, useEffect } from 'react';
import { brandsAPI } from '../api/brands';

export const useBrandDetail = (brandId) => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchBrand = async () => {
    if (!brandId) {
      setError('Brand ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await brandsAPI.getById(brandId);
      
      console.log('Raw API Response:', response);
      
      // Extract brand data from the nested structure
      let brandData = null;
      
      if (response?.data?.data) {
        brandData = response.data.data;
        console.log('Extracted Brand Data:', brandData);
      } else if (response?.data) {
        brandData = response.data;
      } else {
        brandData = response;
      }
      
      setBrand(brandData);
      
    } catch (err) {
      console.error('Error fetching brand:', err);
      setError(err.message || 'Failed to fetch brand');
      setBrand(null);
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (brandData) => {
    if (!brandId) {
      setError('Brand ID is required for update');
      return { success: false, error: 'Brand ID is required for update' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatePayload = {
        name: brandData.name,
        description: brandData.description,
        isActive: brandData.is_active !== undefined ? brandData.is_active : brandData.isActive,
      };
      
      const response = await brandsAPI.update(brandId, updatePayload);
      console.log('Update Response:', response);
      
      let updatedBrand = null;
      
      if (response?.data?.data) {
        updatedBrand = response.data.data;
      } else if (response?.data) {
        updatedBrand = response.data;
      } else {
        updatedBrand = response;
      }
      
      setBrand(updatedBrand);
      return { success: true, data: updatedBrand };
    } catch (err) {
      console.error('Error updating brand:', err);
      setError(err.message || 'Failed to update brand');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteBrand = async () => {
    if (!brandId) {
      setError('Brand ID is required for delete');
      return { success: false, error: 'Brand ID is required for delete' };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await brandsAPI.delete(brandId);
      console.log('Delete Response:', response);
      
      if (response?.data?.status === 'success' || response?.data?.status === true || response?.status === 'success') {
        return { success: true };
      } else {
        return { success: false, error: 'Delete operation failed' };
      }
    } catch (err) {
      console.error('Error deleting brand:', err);
      setError(err.message || 'Failed to delete brand');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleBrandStatus = async () => {
    if (!brand) {
      setError('No brand data available');
      return { success: false, error: 'No brand data available' };
    }

    const updatedData = {
      name: brand.name,
      description: brand.description,
      is_active: !brand.is_active,
    };

    return await updateBrand(updatedData);
  };

  const refreshBrand = () => {
    fetchBrand();
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchBrand();
  }, [brandId]);

  return {
    brand,
    loading,
    error,
    products,
    updateBrand,
    deleteBrand,
    toggleBrandStatus,
    refreshBrand,
    clearError,
    fetchBrand,
  };
};