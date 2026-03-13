import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { billsAPI } from '../api/bills';
import { productsAPI } from '../api/products';
import { storesAPI } from '../api/stores';
import { useAuthStore } from '../store/authStore';

export const useBillForm = (billId = null) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Data for dropdowns
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  
  // Bill items
  const [items, setItems] = useState([]);
  
  // Get current user from auth store
  const { user } = useAuthStore?.() || { user: null };

  // Form state
  const [formData, setFormData] = useState({
    customerId: '',
    storeId: '',
    paidAmount: '',
    paymentMethod: 'cash',
  });

  // Fetch all required data
  const fetchFormData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch products
      const productsResponse = await productsAPI.getAll();
      let productsData = [];
      if (productsResponse?.data?.data) {
        productsData = productsResponse.data.data;
      } else if (productsResponse?.data) {
        productsData = productsResponse.data;
      } else if (Array.isArray(productsResponse)) {
        productsData = productsResponse;
      }
      setProducts(productsData);
      
      // Fetch customers
      const customersResponse = await billsAPI.getCustomers();
      let customersData = [];
      if (customersResponse?.data?.data) {
        customersData = customersResponse.data.data;
      } else if (customersResponse?.data) {
        customersData = customersResponse.data;
      } else if (Array.isArray(customersResponse)) {
        customersData = customersResponse;
      }
      setCustomers(customersData);
      
      // Fetch stores
      if (user?.id) {
        const storesResponse = await storesAPI.getAll(user.id);
        let storesData = [];
        if (storesResponse?.data?.data) {
          storesData = storesResponse.data.data;
        } else if (storesResponse?.data) {
          storesData = storesResponse.data;
        } else if (Array.isArray(storesResponse)) {
          storesData = storesResponse;
        }
        setStores(storesData);
      }
      
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError('Failed to load form data');
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch bill data if editing
  const fetchBillData = async () => {
    if (!billId) return;
    
    try {
      setLoading(true);
      const response = await billsAPI.getById(billId);
      
      let billData = null;
      if (response?.data?.data) {
        billData = response.data.data;
      } else if (response?.data) {
        billData = response.data;
      } else {
        billData = response;
      }
      
      if (billData) {
        setFormData({
          customerId: billData.customer_id?.toString() || '',
          storeId: billData.store_id?.toString() || '',
          paidAmount: billData.paid_amount?.toString() || '',
          paymentMethod: billData.payment_method || 'cash',
        });
        
        setItems(billData.items?.map(item => ({
          id: item.id,
          productId: item.product_id?.toString() || '',
          productName: item.product?.name || '',
          quantity: item.quantity?.toString() || '1',
          price: item.price?.toString() || '0',
          gst: item.gst?.toString() || '0',
          discount: item.discount?.toString() || '0',
          totalPrice: item.total_price || 0,
          unitId: item.unit_id?.toString() || '',
          unitCode: item.unit_code || 'PC',
        })) || []);
      }
    } catch (err) {
      console.error('Error fetching bill:', err);
      setError('Failed to load bill data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  useEffect(() => {
    if (billId) {
      fetchBillData();
    }
  }, [billId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productId: '',
      productName: '',
      quantity: '1',
      price: '0',
      gst: '0',
      discount: '0',
      totalPrice: 0,
      unitId: '',
      unitCode: '',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    
    // If product is selected, fetch product details
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.id.toString() === value);
      if (selectedProduct) {
        updatedItems[index].productName = selectedProduct.name;
        updatedItems[index].price = selectedProduct.selling_price?.toString() || '0';
        updatedItems[index].gst = selectedProduct.gst_percentage?.toString() || '0';
        updatedItems[index].discount = selectedProduct.discount_percentage?.toString() || '0';
        updatedItems[index].unitId = selectedProduct.unit_id?.toString() || '';
        updatedItems[index].unitCode = selectedProduct.unit_code || 'PC';
      }
    }
    
    // Recalculate total price
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;
    const gst = parseFloat(updatedItems[index].gst) || 0;
    const discount = parseFloat(updatedItems[index].discount) || 0;
    
    const subtotal = quantity * price;
    const gstAmount = subtotal * (gst / 100);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal + gstAmount - discountAmount;
    
    updatedItems[index].totalPrice = total;
    
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.price) * parseFloat(item.quantity) || 0), 0);
  };

  const calculateTotalGST = () => {
    return items.reduce((sum, item) => {
      const subtotal = parseFloat(item.price) * parseFloat(item.quantity) || 0;
      const gst = parseFloat(item.gst) || 0;
      return sum + (subtotal * (gst / 100));
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return items.reduce((sum, item) => {
      const subtotal = parseFloat(item.price) * parseFloat(item.quantity) || 0;
      const discount = parseFloat(item.discount) || 0;
      return sum + (subtotal * (discount / 100));
    }, 0);
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const calculateChange = () => {
    const paid = parseFloat(formData.paidAmount) || 0;
    const total = calculateGrandTotal();
    return paid > total ? paid - total : 0;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerId) {
      errors.customerId = 'Customer is required';
    }
    
    if (!formData.storeId) {
      errors.storeId = 'Store is required';
    }
    
    if (!formData.paidAmount || parseFloat(formData.paidAmount) < 0) {
      errors.paidAmount = 'Valid paid amount is required';
    }
    
    if (items.length === 0) {
      errors.items = 'At least one item is required';
    } else {
      items.forEach((item, index) => {
        if (!item.productId) {
          errors[`item_${index}_product`] = `Item ${index + 1}: Product is required`;
        }
        if (!item.quantity || parseFloat(item.quantity) <= 0) {
          errors[`item_${index}_quantity`] = `Item ${index + 1}: Valid quantity is required`;
        }
      });
    }
    
    return errors;
  };

  const createBill = async (billData) => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setError('Please check the form for errors');
        return { success: false, error: 'Validation failed', errors };
      }
      
      // Get user_id from current user
      const userId = user?.id || user?.user_id || '1';
      
      // Prepare items for API
      const itemsPayload = items.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitId: parseInt(item.unitId) || null,
        price: parseFloat(item.price),
        gst: parseFloat(item.gst) || 0,
        discount: parseFloat(item.discount) || 0,
        totalPrice: item.totalPrice,
      }));
      
      // Prepare data for API
      const payload = {
        customerId: parseInt(formData.customerId),
        storeId: parseInt(formData.storeId),
        paidAmount: parseFloat(formData.paidAmount),
        userId: userId,
        createdBy: userId,
        items: itemsPayload,
      };
      
      console.log('Create bill payload:', payload);
      const response = await billsAPI.create(payload);
      console.log('Create bill response:', response);
      
      if (response?.status === true || response?.data?.status === true) {
        const createdBill = response?.data?.data || response?.data || response;
        
        // Navigate to bill detail or print preview
        navigation.navigate('BillDetail', { billId: createdBill.id });
        
        return { 
          success: true, 
          data: createdBill 
        };
      } else {
        throw new Error(response?.message || 'Failed to create bill');
      }
    } catch (err) {
      console.error('Create bill error:', err);
      
      if (err.response?.status === 422) {
        const errors = err.response?.data?.errors || {};
        setValidationErrors(errors);
        setError('Please check the form for errors');
        return { 
          success: false, 
          error: 'Validation failed',
          errors: errors 
        };
      }
      
      setError(err.message || 'Failed to create bill');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const saveBill = async () => {
    return await createBill(formData);
  };

  const clearError = () => {
    setError(null);
    setValidationErrors({});
  };

  return {
    formData,
    items,
    products,
    customers,
    stores,
    loading: loading || loadingData,
    error,
    validationErrors,
    handleChange,
    addItem,
    updateItem,
    removeItem,
    calculateSubtotal,
    calculateTotalGST,
    calculateTotalDiscount,
    calculateGrandTotal,
    calculateChange,
    saveBill,
    setFormData,
    setError,
    clearError,
  };
};