import { FiX, FiPackage, FiEye } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const RecentOrderModal = ({ isOpen, onClose, recentOrder, onViewDetails, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiPackage className="w-5 h-5" />
            Recent Order
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {recentOrder ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-800 font-mono">ORD{recentOrder.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-bold text-green-600 text-lg flex items-center gap-1">
                <FaRupeeSign className="w-4 h-4" />
                {recentOrder.totalAmount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Number of Items</p>
              <p className="font-semibold text-gray-800">{recentOrder.items} items</p>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={onViewDetails}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FiEye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No order yet</p>
            <p className="text-gray-400 text-sm mt-2">Start shopping to see your recent orders here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrderModal;