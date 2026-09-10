import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ToastItem = ({ title, message, time, onClose, duration = 15000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-green-700 text-white rounded-lg shadow-2xl p-4 min-w-[300px] max-w-md mb-2"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <FiCheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-md">{title}</span>
            <span className="text-md opacity-90 mt-0.5">{time}</span>
            <span className="text-md mt-1">{message}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:bg-green-600 rounded-full p-1 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export const CustomToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, message, time, duration = 5000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, time, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose showToast function globally
  useEffect(() => {
    window.showCustomToast = showToast;
    return () => {
      delete window.showCustomToast;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            title={toast.title}
            message={toast.message}
            time={toast.time}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CustomToast;