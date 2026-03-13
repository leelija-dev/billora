import { useState, useEffect, useCallback } from 'react';
import { billingAPI } from '../api/billing';

export const useBilling = () => {
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch all bills
  const fetchBills = useCallback(async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.getAll(searchParams);
      setBills(response.data || []);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bills';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single bill
  const fetchBill = useCallback(async (billId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.getById(billId);
      setCurrentBill(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bill';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new bill
  const createBill = useCallback(async (billData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.create(billData);
      setBills(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create bill';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing bill
  const updateBill = useCallback(async (billId, billData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.update(billId, billData);
      setBills(prev => prev.map(bill => 
        bill.id === billId ? response.data : bill
      ));
      if (currentBill && currentBill.id === billId) {
        setCurrentBill(response.data);
      }
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update bill';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBill]);

  // Delete bill
  const deleteBill = useCallback(async (billId) => {
    try {
      setLoading(true);
      setError(null);
      await billingAPI.delete(billId);
      setBills(prev => prev.filter(bill => bill.id !== billId));
      if (currentBill && currentBill.id === billId) {
        setCurrentBill(null);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete bill';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBill]);

  // Print bill
  const printBill = useCallback(async (billId, printerType = 'a4') => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.print(billId, printerType);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to print bill';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add payment to bill
  const addPayment = useCallback(async (billId, paymentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.addPayment(billId, paymentData);
      
      // Update current bill if it's the one being viewed
      if (currentBill && currentBill.id === billId) {
        const updatedBill = {
          ...currentBill,
          payments: [...(currentBill.payments || []), response.data],
          paid_amount: currentBill.paid_amount + paymentData.amount,
          balance_amount: currentBill.total_amount - (currentBill.paid_amount + paymentData.amount),
          status: (currentBill.total_amount - (currentBill.paid_amount + paymentData.amount)) <= 0 ? 'paid' : 'partial'
        };
        setCurrentBill(updatedBill);
      }
      
      // Update bills list
      setBills(prev => prev.map(bill => 
        bill.id === billId ? {
          ...bill,
          payments: [...(bill.payments || []), response.data],
          paid_amount: bill.paid_amount + paymentData.amount,
          balance_amount: bill.total_amount - (bill.paid_amount + paymentData.amount),
          status: (bill.total_amount - (bill.paid_amount + paymentData.amount)) <= 0 ? 'paid' : 'partial'
        } : bill
      ));
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBill]);

  // Get payment history
  const getPaymentHistory = useCallback(async (billId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.getPaymentHistory(billId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch payment history';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get statistics
  const fetchStats = useCallback(async (dateFilter = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.getStats(dateFilter);
      setStats(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send bill via email
  const sendEmail = useCallback(async (billId, emailData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.sendEmail(billId, emailData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send email';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send bill via WhatsApp
  const sendWhatsApp = useCallback(async (billId, phoneData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await billingAPI.sendWhatsApp(billId, phoneData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send WhatsApp message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh data
  const refresh = useCallback(async () => {
    if (currentBill) {
      await fetchBill(currentBill.id);
    } else {
      await fetchBills();
    }
  }, [currentBill, fetchBills]);

  return {
    // Data
    bills,
    currentBill,
    stats,
    loading,
    error,
    
    // Actions
    fetchBills,
    fetchBill,
    createBill,
    updateBill,
    deleteBill,
    printBill,
    addPayment,
    getPaymentHistory,
    fetchStats,
    sendEmail,
    sendWhatsApp,
    
    // Utilities
    clearError,
    refresh
  };
};
