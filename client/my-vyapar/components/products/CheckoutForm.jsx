import { FiArrowLeft, FiUser, FiPhone, FiCreditCard, FiTruck, FiAlertCircle, FiPackage } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { BsCartCheck } from 'react-icons/bs';

const CheckoutForm = ({ 
  cart, 
  formData, 
  onFormChange, 
  validationErrors, 
  paymentMethod, 
  onPaymentMethodChange, 
  onPlaceOrder, 
  isPlacingOrder, 
  getCartTotal,
  onBack 
}) => {
  const getItemTotal = (item) => {
    const sellingPrice = item.selling_price || item.price;
    const discountPercent = item.discount_percentage || 0;
    const priceAfterDiscount = sellingPrice - (sellingPrice * discountPercent / 100);
    return priceAfterDiscount * item.quantity;
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition mb-5 text-sm"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <div className="bg-gray-50 rounded-xl p-4 mb-5">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiPackage className="w-4 h-4" />
          Order Summary
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.title} x{item.quantity}</span>
              <span className="font-medium flex items-center gap-1">
                <FaRupeeSign className="w-3 h-3" />
                {Math.round(getItemTotal(item)).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600 flex items-center gap-1">
              <FaRupeeSign className="w-3 h-3" />
              {Math.round(getCartTotal()).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={onPlaceOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onFormChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
              validationErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="Enter your full name"
          />
          {validationErrors.fullName && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {validationErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <FiPhone className="w-4 h-4" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onFormChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
              validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}
            placeholder="10-digit mobile number"
          />
          {validationErrors.phone && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {validationErrors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiCreditCard className="w-4 h-4" />
            Payment Method
          </label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex-1">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <FiTruck className="w-4 h-4" />
                Cash on Delivery
              </span>
            </label>
            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-not-allowed flex-1 opacity-60">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                disabled
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FiCreditCard className="w-4 h-4" />
                Online (Coming Soon)
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPlacingOrder}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <BsCartCheck className="w-5 h-5" />
              Place Order • ₹{Math.round(getCartTotal()).toLocaleString()}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;