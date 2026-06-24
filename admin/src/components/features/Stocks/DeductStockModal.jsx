import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiAlertCircle } from 'react-icons/fi';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';

const DeductStockModal = ({ isOpen, onClose, stock, onDeductStock, isSubmitting }) => {
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const currentQuantity = parseFloat(stock?.quantity) || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate quantity
    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }

    if (qty > currentQuantity) {
      setError(`Cannot deduct more than available stock (${currentQuantity})`);
      return;
    }

    setError('');
    onDeductStock(stock.id, qty);
  };

  const handleClose = () => {
    setQuantity('');
    setError('');
    onClose();
  };

  if (!isOpen || !stock) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <FiMinus className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Deduct Stock
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Product: <span className="font-medium text-gray-900 dark:text-white">
                  {stock.product?.name || stock.product_name || `Product ${stock.product_id}`}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available: <span className="font-semibold text-green-600 dark:text-green-400">
                  {currentQuantity} {stock.unit?.name || stock.unit_name || 'units'}
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deduct Quantity
                </label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter quantity to deduct"
                  min="0.01"
                  step="0.01"
                  className="w-full"
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                  >
                    <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {error}
                  </motion.p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Maximum deduction: <span className="font-medium">{currentQuantity} units</span>
                </p>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  className="flex-1"
                  disabled={isSubmitting || !quantity}
                >
                  {isSubmitting ? 'Deducting...' : 'Deduct Stock'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeductStockModal;