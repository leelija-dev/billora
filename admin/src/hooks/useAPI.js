import { useState, useEffect } from 'react'
import { productsAPI, brandsAPI, categoriesAPI, unitsAPI } from '../services'

// Custom hook for products
export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProducts = async (search = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await productsAPI.getAll(search)
      setProducts(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await productsAPI.create(productData)
      setProducts(prev => [...prev, response.data])
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id, productData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await productsAPI.update(id, productData)
      setProducts(prev => prev.map(product => 
        product.id === id ? response.data : product
      ))
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await productsAPI.delete(id)
      setProducts(prev => prev.filter(product => product.id !== id))
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete product'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}

// Custom hook for brands
export const useBrands = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBrands = async (search = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await brandsAPI.getAll(search)
      console.log('🏷️ Brands API Response:', response.data)
      // Brands API returns data.data (not data.data.data like products)
      const brands = response.data?.data || response.data?.data?.data || response.data || []
      console.log('🏷️ Processed brands:', brands)
      setBrands(brands)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch brands')
    } finally {
      setLoading(false)
    }
  }

  const createBrand = async (brandData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await brandsAPI.create(brandData)
      setBrands(prev => [...prev, response.data])
      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create brand'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    brands,
    loading,
    error,
    fetchBrands,
    createBrand,
  }
}

// Custom hook for categories
export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = async (search = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await categoriesAPI.getAll(search)
      console.log('📁 Categories API Response:', response.data)
      // Categories API returns data.data.data (nested like products)
      const categories = response.data?.data?.data || response.data?.data || response.data || []
      console.log('📁 Processed categories:', categories)
      setCategories(categories)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}

// Custom hook for units
export const useUnits = () => {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUnits = async (search = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await unitsAPI.getAll(search)
      console.log('📏 Units API Response:', response.data)
      // Units API returns data.data.data (nested like products)
      const units = response.data?.data?.data || response.data?.data || response.data || []
      console.log('📏 Processed units:', units)
      setUnits(units)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch units')
    } finally {
      setLoading(false)
    }
  }

  return {
    units,
    loading,
    error,
    fetchUnits,
  }
}
