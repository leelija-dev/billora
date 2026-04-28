import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const sellingPrice = item.selling_price || item.price;
  const discountPercent = item.discount_percentage || 0;
  const discountAmount = (sellingPrice * discountPercent) / 100;
  const priceAfterDiscount = sellingPrice - discountAmount;
  const itemTotal = priceAfterDiscount * item.quantity;

  return (
    <div className="flex gap-3 bg-gray-50 rounded-xl p-3">
      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-contain p-1"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{item.title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-semibold text-blue-600 flex items-center gap-1">
            <FaRupeeSign className="w-3 h-3" />
            {Math.round(itemTotal).toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through flex items-center gap-1">
              <FaRupeeSign className="w-3 h-3" />
              {Math.round(sellingPrice * item.quantity).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition text-gray-600"
          >
            <FiMinus className="w-3 h-3" />
          </button>
          <span className="text-sm font-medium w-6 text-center text-gray-700">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition text-gray-600"
          >
            <FiPlus className="w-3 h-3" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto text-xs text-gray-400 hover:text-red-500 transition"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;