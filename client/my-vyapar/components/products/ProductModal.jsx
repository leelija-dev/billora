import { FiX, FiTag, FiPackage, FiMinus, FiPlus } from 'react-icons/fi';
import { MdOutlineCategory, MdOutlineCheckCircle, MdOutlineCancel, MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { FaRupeeSign, FaPercentage } from 'react-icons/fa';
import { BsCartPlus, BsLightningCharge } from 'react-icons/bs';

const ProductModal = ({ 
  isOpen, 
  product, 
  onClose, 
  quantity, 
  onAddToCart, 
  onBuyNow, 
  onUpdateQuantity 
}) => {
  if (!isOpen || !product) return null;

  const basePrice = product.selling_price || product.price;
  const discountPercent = product.discount_percentage || 0;
  const gstPercent = product.gst_percentage || 0;
  const discountAmount = (basePrice * discountPercent) / 100;
  const priceAfterDiscount = basePrice - discountAmount;
  const gstAmount = (priceAfterDiscount * gstPercent) / 100;
  const finalPrice = priceAfterDiscount + gstAmount;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md hover:bg-gray-100 text-gray-800"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
            <div className="relative">
              {product.discount_percentage > 0 && (
                <div className="absolute -top-3 -left-3 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-lg shadow-md text-sm font-bold flex items-center gap-1">
                    <FaPercentage className="w-3 h-3" />
                    {product.discount_percentage}% OFF
                  </div>
                </div>
              )}
              <img
                src={product.img}
                alt={product.name}
                className="max-h-80 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
                }}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
              <MdOutlineCategory className="w-4 h-4" />
              {product.category} • {product.brand}
            </p>

            <div className="mb-4">
              {discountPercent > 0 && (
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
                    <FaRupeeSign className="w-4 h-4" />
                    {Math.round(finalPrice).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through flex items-center gap-1">
                    <FaRupeeSign className="w-3 h-3" />
                    {Math.round(basePrice + gstAmount).toLocaleString()}
                  </span>
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <FiTag className="w-3 h-3" />
                    Save {Math.round(discountAmount)}₹
                  </span>
                </div>
              )}
              {discountPercent === 0 && (
                <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                  <FaRupeeSign className="w-5 h-5" />
                  {Math.round(finalPrice).toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-5">
              <p className={`text-sm font-medium flex items-center gap-1 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? (
                  <>
                    <MdOutlineCheckCircle className="w-4 h-4" />
                    In Stock
                  </>
                ) : (
                  <>
                    <MdOutlineCancel className="w-4 h-4" />
                    Out of Stock
                  </>
                )}
              </p>
              {product.unit && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FiPackage className="w-4 h-4" />
                  Unit: {product.unit}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              {product.inStock ? (
                quantity === 0 ? (
                  <>
                    <button
                      onClick={() => {
                        onAddToCart(product, 1);
                        onClose();
                      }}
                      className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                    >
                      <BsCartPlus className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBuyNow(product);
                      }}
                      className="flex-1 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <BsLightningCharge className="w-4 h-4" />
                      Buy Now
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 flex items-center justify-between border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700"
                      >
                        <FiMinus className="w-4 h-4 mx-auto" />
                      </button>
                      <span className="flex-1 text-center font-semibold text-gray-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-700"
                      >
                        <FiPlus className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onBuyNow(product);
                      }}
                      className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <BsLightningCharge className="w-4 h-4" />
                      Buy Now
                    </button>
                  </>
                )
              ) : (
                <button disabled className="w-full py-3 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                  <MdOutlineRemoveShoppingCart className="w-4 h-4" />
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;