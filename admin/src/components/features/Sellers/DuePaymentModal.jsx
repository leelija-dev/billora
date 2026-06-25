// components/features/Sellers/DuePaymentModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiCreditCard, FiUser } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import useSellerStore from '../../../store/sellerStore';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';

const DuePaymentModal = ({ seller, isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const { processDuePayment, paymentProcessing } = useSellerStore();
  
  const [paidAmount, setPaidAmount] = useState('');

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && seller) {
      // Reset form when modal opens
      setPaidAmount('');

      setErrors({});
      setTouched(false);
    }
  }, [isOpen, seller]);

  if (!isOpen || !seller) return null;

  const dueAmount = parseFloat(seller.due_amount) || 0;

  // Validate and format the amount input
  const handleAmountChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-digit characters (allow only digits and decimal point)
    // But we want to restrict to only digits (no decimal for simplicity)
    // If you want to allow decimals, uncomment the decimal part
    value = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      value = value.slice(0, value.lastIndexOf('.'));
    }
    
    // If value starts with decimal, add leading zero
    if (value.startsWith('.')) {
      value = '0' + value;
    }
    
    // Limit to 2 decimal places if decimal is allowed
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1] && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].slice(0, 2);
      }
    }
    
    // Check if value exceeds due amount
    const numericValue = parseFloat(value);
    if (value && !isNaN(numericValue) && numericValue > dueAmount && dueAmount > 0) {
      // If exceeds due amount, show error but still allow typing
      setErrors({
        ...errors,
        paidAmount: `Amount cannot exceed due amount (₹${dueAmount.toFixed(2)})`
      });
    } else {
      // Clear error if amount is valid
      const newErrors = { ...errors };
      delete newErrors.paidAmount;
      setErrors(newErrors);
    }
    
    setPaidAmount(value);
    setTouched(true);
  };

  // Handle blur validation
  const handleAmountBlur = () => {
    setTouched(true);
    
    if (!paidAmount) {
      setErrors({
        ...errors,
        paidAmount: 'Please enter an amount'
      });
      return;
    }
    
    const numericValue = parseFloat(paidAmount);
    
    if (isNaN(numericValue) || numericValue <= 0) {
      setErrors({
        ...errors,
        paidAmount: 'Please enter a valid amount greater than 0'
      });
    } else if (numericValue > dueAmount) {
      setErrors({
        ...errors,
        paidAmount: `Amount cannot exceed due amount (₹${dueAmount.toFixed(2)})`
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors.paidAmount;
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paidAmount) {
      newErrors.paidAmount = 'Please enter an amount';
    } else {
      const numericValue = parseFloat(paidAmount);
      
      if (isNaN(numericValue) || numericValue <= 0) {
        newErrors.paidAmount = 'Please enter a valid amount greater than 0';
      } else if (numericValue > dueAmount) {
        newErrors.paidAmount = `Amount cannot exceed due amount (₹${dueAmount.toFixed(2)})`;
      }
    }
    
    setErrors(newErrors);
    setTouched(true);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const paymentData = {
        user_id: user?.id || '',
        paid_amount: parseFloat(paidAmount),
       
      };

      await processDuePayment(seller.id, paymentData);
      
      toast.success(`Payment of ₹${parseFloat(paidAmount).toFixed(2)} processed successfully`);
      
      // Reset and close
      setPaidAmount('');
  
      setErrors({});
      setTouched(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error is already handled in the store
      console.error('Payment error:', error);
    }
  };

  const handleMaxPayment = () => {
    setPaidAmount(dueAmount.toFixed(2));
    // Clear any errors
    const newErrors = { ...errors };
    delete newErrors.paidAmount;
    setErrors(newErrors);
    setTouched(true);
  };

  // Prevent non-digit key presses
  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, etc.
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    
    // Allow: numbers, decimal point
    if (!/^[0-9.]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    
    // Prevent decimal point if already has one
    if (e.key === '.' && paidAmount.includes('.')) {
      e.preventDefault();
      return;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FaRupeeSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Due Payment
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Process payment for {seller.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Seller</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {seller.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Due</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  ₹{dueAmount.toFixed(2)}
                </span>
              </div>
              {dueAmount > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum amount allowed
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    ₹{dueAmount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaRupeeSign className="w-4 h-4" />
                  </div>
                  <Input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter amount"
                    value={paidAmount}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    onKeyDown={handleKeyDown}
                    className={`pl-10 ${errors.paidAmount && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    disabled={paymentProcessing || dueAmount <= 0}
                    autoComplete="off"
                  />
                </div>
                {errors.paidAmount && touched && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-xs text-red-500"
                  >
                    {errors.paidAmount}
                  </motion.p>
                )}
                {dueAmount > 0 && (
                  <div className="mt-1 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleMaxPayment}
                      className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline transition-colors"
                      disabled={paymentProcessing}
                    >
                      Pay full amount (₹{dueAmount.toFixed(2)})
                    </button>
                    {paidAmount && !errors.paidAmount && parseFloat(paidAmount) > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Remaining: ₹{(dueAmount - parseFloat(paidAmount)).toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {dueAmount > 0 ? (
                    <span>
                      Remaining after payment:{' '}
                      <span className={`font-medium ${(dueAmount - (parseFloat(paidAmount) || 0)) < 0 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        ₹{(dueAmount - (parseFloat(paidAmount) || 0)).toFixed(2)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400">
                      No pending dues
                    </span>
                  )}
                </div>
                {paidAmount && !errors.paidAmount && parseFloat(paidAmount) > 0 && parseFloat(paidAmount) <= dueAmount && (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    ✓ Valid amount
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={paymentProcessing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={
                    paymentProcessing || 
                    dueAmount <= 0 || 
                    !paidAmount || 
                    parseFloat(paidAmount) <= 0 || 
                    parseFloat(paidAmount) > dueAmount ||
                    !!errors.paidAmount
                  }
                >
                  {paymentProcessing ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Processing...
                    </span>
                  ) : (
                    'Process Payment'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DuePaymentModal;