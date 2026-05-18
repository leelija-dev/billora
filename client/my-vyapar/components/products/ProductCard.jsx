import { FiMinus, FiPlus, FiInfo, FiTag } from 'react-icons/fi';
import { MdOutlineCategory, MdOutlineCheckCircle, MdOutlineCancel, MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { FaRupeeSign, FaPercentage } from 'react-icons/fa';
import { BsCartPlus, BsLightningCharge } from 'react-icons/bs';
import { HiOutlineExternalLink } from 'react-icons/hi';

const ProductCard = ({ 
  product, 
  quantity, 
  isSelected, 
  onAddToCart, 
  onBuyNow, 
  onUpdateQuantity,
  onSelect,
  onImageClick,
  onToggleDescription,
  isExpanded 
}) => {
  const productPrice = product.selling_price || product.price;
  const discountPercent = product.discount_percentage || 0;
  const gstPercent = product.gst_percentage || 0;
  const discountAmount = (productPrice * discountPercent) / 100;
  const priceAfterDiscount = productPrice - discountAmount;
  const gstAmount = (priceAfterDiscount * gstPercent) / 100;
  const finalPrice = priceAfterDiscount + gstAmount;
  const shouldTruncate = product.description?.length > 80;

  return (
    <div
  className={`bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group border flex flex-col justify-between ${
    isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
  }`}
>
  <div>
    {/* Discount Badge */}
    {product.discount_percentage > 0 && (
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
          <FaPercentage className="w-3 h-3" />
          {product.discount_percentage}% OFF
        </div>
      </div>
    )}

    {/* Selection Checkbox */}
    <div className="absolute top-3 right-3 z-10">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(product, e)}
        className="w-5 h-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        disabled={!product.inStock}
      />
    </div>

    {/* Image */}
    <div 
      onClick={() => onImageClick(product)} 
      className="cursor-pointer bg-gray-50 p-4 flex justify-center items-center"
      data-product-id={product.id}
    >
      <div className="relative h-48 w-full flex justify-center items-center">
        <img
          src={product.img}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/400x400/f0f0f0/999?text=No+Image";
          }}
        />
        {product.isDriveImage && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <HiOutlineExternalLink className="w-3 h-3" />
            View in Drive
          </div>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <div className="mb-2">
        <h2 className="font-semibold text-gray-800 line-clamp-1">
          {product.name || 'Unnamed Product'}
        </h2>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <MdOutlineCategory className="w-3 h-3" />
          {product.category || 'General'} • {product.brand || 'Unknown'}
        </p>
      </div>

      {/* Description */}
      <div className="mb-3">
        <p className="text-sm text-gray-500 line-clamp-2 flex items-start gap-1">
          <FiInfo className="w-3 h-3 mt-0.5 flex-shrink-0" />
          {product.description || 'No description available'}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => onToggleDescription(product.id)}
            className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium"
          >
            {isExpanded ? 'Read Less ↑' : 'Read More ↓'}
          </button>
        )}
      </div>

      {/* Price Section */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
            <FaRupeeSign className="w-4 h-4" />
            {Math.round(finalPrice).toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through flex items-center gap-1">
                <FaRupeeSign className="w-3 h-3" />
                {Math.round(productPrice + gstAmount).toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <FiTag className="w-3 h-3" />
                Save {Math.round(discountAmount)}₹
              </span>
            </>
          )}
        </div>
      </div>

      <p className={`text-xs font-medium flex items-center gap-1 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
        {product.inStock ? (
          <>
            <MdOutlineCheckCircle className="w-3 h-3" />
            In Stock
          </>
        ) : (
          <>
            <MdOutlineCancel className="w-3 h-3" />
            Out of Stock
          </>
        )}
      </p>
    </div>
  </div>

  {/* Buttons */}
  <div className="p-4 pt-0 border-t border-gray-100 mt-2">
    {product.inStock ? (
      quantity === 0 ? (
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product, 1)}
            className="flex-1 py-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium flex items-center justify-center gap-2"
          >
            <BsCartPlus className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={() => onBuyNow(product)}
            className="flex-1 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-2"
          >
            <BsLightningCharge className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between border border-gray-200 rounded-full overflow-hidden bg-white">
            <button
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition text-gray-700 rounded-l-full"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition text-gray-700 rounded-r-full"
            >
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onBuyNow(product)}
            className="w-full py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-2"
          >
            <BsLightningCharge className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      )
    ) : (
      <button disabled className="w-full py-2.5 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed text-sm flex items-center justify-center gap-2">
        <MdOutlineRemoveShoppingCart className="w-4 h-4" />
        Out of Stock
      </button>
    )}
  </div>
</div>
  );
};

export default ProductCard;