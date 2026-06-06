import { FiX, FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiUser, FiPhone, FiCreditCard, FiTruck, FiPercent } from 'react-icons/fi';
import { FaRupeeSign, FaTag, FaGift } from 'react-icons/fa';
import { BsCartCheck } from 'react-icons/bs';
import { MdOutlineCheckCircle } from 'react-icons/md';
import CartItem from './CartItem';
import CheckoutForm from './CheckoutForm';

const CartSidebar = ({ 
  showCart, 
  showCheckout, 
  cart, 
  onClose, 
  onUpdateQuantity, 
  onRemoveFromCart,
  onBackToCart,
  onPlaceOrder,
  getCartSubtotal,
  getTotalDiscountAmount,
  getTotalGst,
  getCartTotal,
  getCartItemCount,
  formData,
  onFormChange,
  validationErrors,
  paymentMethod,
  onPaymentMethodChange,
  isPlacingOrder
}) => {
  console.log("Rendering CartSidebar with cart:", cart);
  
  if (!showCart) return null;

  // Calculate discounted subtotal (after discount but before GST) - No rounding
  const discountedSubtotal = getCartSubtotal() - getTotalDiscountAmount();
  
  // Calculate GST percentage based on discounted subtotal - No rounding
  const gstPercentage = discountedSubtotal > 0 ? ((getTotalGst() / discountedSubtotal) * 100) : 0;

  // Helper function to format price with 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out overflow-y-auto translate-x-0 w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[35%]`}
    >
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {showCheckout ? (
                <>
                  <FiCreditCard className="w-5 h-5" />
                  Checkout
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </>
              )}
            </h2>
            {!showCheckout && cart.length > 0 && (
              <p className="text-sm text-blue-100 mt-1">{getCartItemCount()} items</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {!showCheckout ? (
          <>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 mb-4 text-gray-300">
                  <FiShoppingCart className="w-full h-full" />
                </div>
                <p className="text-gray-500 text-center">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveFromCart}
                    />
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 bg-gradient-to-b from-gray-50 to-white p-4 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 flex items-center gap-1">
                      <FaRupeeSign className="w-3 h-3" />
                      {formatPrice(getCartSubtotal())}
                    </span>
                  </div>
                  
                  {getTotalDiscountAmount() > 0 && (
                    <>
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
                      
                      <div className="flex justify-between text-sm pt-1 border-t border-dashed border-gray-200">
                        <span className="text-gray-700 font-medium">Discounted Subtotal</span>
                        <span className="text-gray-900 font-medium flex items-center gap-1">
                          <FaRupeeSign className="w-3 h-3" />
                          {formatPrice(discountedSubtotal)}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {getTotalGst() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <FiPercent className="w-3 h-3" />
                        GST ({gstPercentage.toFixed(2)}%)
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

                  <button
                    onClick={onBackToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold mt-2 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <BsCartCheck className="w-5 h-5" />
                    Proceed to Checkout • ₹{formatPrice(getCartTotal())}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <CheckoutForm
            cart={cart}
            formData={formData}
            onFormChange={onFormChange}
            validationErrors={validationErrors}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={onPaymentMethodChange}
            onPlaceOrder={onPlaceOrder}
            isPlacingOrder={isPlacingOrder}
            getCartTotal={getCartTotal}
            getCartSubtotal={getCartSubtotal}
            getTotalDiscountAmount={getTotalDiscountAmount}
            getTotalGst={getTotalGst}
            onBack={onBackToCart}
          />
        )}
      </div>
    </div>
  );
};

export default CartSidebar;