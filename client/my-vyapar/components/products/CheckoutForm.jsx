import { FiArrowLeft, FiUser, FiPhone, FiCreditCard, FiTruck, FiAlertCircle, FiPackage, FiPercent } from 'react-icons/fi';
import { FaRupeeSign, FaTag, FaGift } from 'react-icons/fa';
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
  getCartSubtotal,
  getTotalDiscountAmount,
  getTotalGst,
  onBack 
}) => {
  console.log("Rendering CheckoutForm with cart:", cart);

  // Helper function to format price with 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const getItemDetails = (item) => {
    const sellingPrice = item.selling_price || item.price;
    const discountPercent = item.discount_percentage || 0;
    // Floating calculation without rounding
    const discountAmount = (sellingPrice * discountPercent) / 100;
    const priceAfterDiscount = sellingPrice - discountAmount;
    const gstPercent = item.gst_percentage || 0;
    // Floating calculation without rounding
    const gstAmount = (priceAfterDiscount * gstPercent) / 100;
    const finalPrice = priceAfterDiscount + gstAmount;
    
    return {
      sellingPrice,
      discountPercent,
      discountAmount,
      priceAfterDiscount,
      gstPercent,
      gstAmount,
      finalPrice,
      totalItemPrice: finalPrice * item.quantity
    };
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

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 mb-5 border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-lg">
          <FiPackage className="w-5 h-5 text-blue-600" />
          Order Summary
        </h3>
        
        <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
          {cart.map((item) => {
            const details = getItemDetails(item);
            return (
              <div key={item.id} className="flex flex-col gap-1 pb-2 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">{item.name || item.title}</span>
                    <span className="text-xs text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <FaRupeeSign className="w-3 h-3" />
                    {formatPrice(details.totalItemPrice)}
                  </span>
                </div>
                
                {(details.discountPercent > 0 || details.gstPercent > 0) && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {details.discountPercent > 0 && (
                      <span className="text-green-600 flex items-center gap-1">
                        <FaTag className="w-3 h-3" />
                        -{details.discountPercent}% (Save ₹{formatPrice(details.discountAmount * item.quantity)})
                      </span>
                    )}
                    {details.gstPercent > 0 && (
                      <span className="text-gray-500 flex items-center gap-1">
                        <FiPercent className="w-3 h-3" />
                        +{details.gstPercent}% GST (₹{formatPrice(details.gstAmount * item.quantity)})
                      </span>
                    )}
                  </div>
                )}
                
                {/* Show price breakdown for each item */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
                  <span>MRP: ₹{formatPrice(details.sellingPrice)}</span>
                  {details.discountPercent > 0 && (
                    <span>After Discount: ₹{formatPrice(details.priceAfterDiscount)}</span>
                  )}
                  <span>Final: ₹{formatPrice(details.finalPrice)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-800 flex items-center gap-1">
              <FaRupeeSign className="w-3 h-3" />
              {formatPrice(getCartSubtotal())}
            </span>
          </div>
          
          {getTotalDiscountAmount() > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <FaTag className="w-3 h-3 text-green-600" />
                Total Discount
              </span>
              <span className="text-green-600 flex items-center gap-1">
                -<FaRupeeSign className="w-3 h-3" />
                {formatPrice(getTotalDiscountAmount())}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Discounted Subtotal</span>
            <span className="text-gray-900 flex items-center gap-1">
              <FaRupeeSign className="w-3 h-3" />
              {formatPrice(getCartSubtotal() - getTotalDiscountAmount())}
            </span>
          </div>
          
          {getTotalGst() > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <FiPercent className="w-3 h-3" />
                GST Amount
              </span>
              <span className="text-gray-800 flex items-center gap-1">
                +<FaRupeeSign className="w-3 h-3" />
                {formatPrice(getTotalGst())}
              </span>
            </div>
          )}
          
          <div className="flex justify-between font-bold pt-3 border-t border-gray-200 mt-2">
            <span className="text-gray-900 text-base">Total Amount</span>
            <span className="text-blue-600 text-xl flex items-center gap-1">
              <FaRupeeSign className="w-4 h-4" />
              {formatPrice(getCartTotal())}
            </span>
          </div>
          
          {getTotalDiscountAmount() > 0 && (
            <div className="bg-green-50 rounded-lg p-2 mt-2">
              <p className="text-xs text-green-700 flex items-center gap-1">
                <FaGift className="w-3 h-3" />
                You saved ₹{formatPrice(getTotalDiscountAmount())} with discounts!
              </p>
            </div>
          )}
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
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {isPlacingOrder ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <BsCartCheck className="w-5 h-5" />
              Place Order • ₹{formatPrice(getCartTotal())}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;