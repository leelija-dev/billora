// app/products/cart/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav2 from "@/components/Nav2";
import Footer from "@/components/Footer";


interface CartItem {
  id: string;
  img: string;
  title: string;
  category: string;
  inStock: boolean;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Cart functions
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18; // 18% GST
  const discount = promoApplied ? subtotal * promoDiscount : 0;
  const total = subtotal + shipping + tax - discount;

  // Promo code handler
  const applyPromoCode = () => {
    // Mock promo codes
    const validPromos: Record<string, number> = {
      'SAVE10': 0.10,
      'SAVE20': 0.20,
      'WELCOME15': 0.15,
      'FREESHIP': 0
    };

    const code = promoCode.toUpperCase().trim();
    
    if (validPromos[code]) {
      setPromoDiscount(validPromos[code]);
      setPromoApplied(true);
      setPromoError("");
      
      // If it's a free shipping code, set shipping to 0
      if (code === 'FREESHIP') {
        // Shipping is handled in calculation
      }
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  const proceedToCheckout = () => {
    // Here you would typically navigate to checkout page
    router.push('/checkout');
  };

  if (loading) {
    return (
      <>



        <Nav2 />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav2 />
      
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A]">Shopping Cart</h1>
            <Link 
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              <span>←</span>
              <span>Continue Shopping</span>
            </Link>
          </div>

          {cart.length === 0 ? (
            // Empty Cart
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link
                href="/products"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            // Cart with items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Cart Items - Left Column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  
                  {/* Cart Header */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b font-semibold text-gray-600">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {/* Cart Items */}
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      className={`
                        grid grid-cols-1 sm:grid-cols-12 gap-4 p-6 items-center
                        ${index !== cart.length - 1 ? 'border-b' : ''}
                      `}
                    >
                      {/* Product Info */}
                      <div className="sm:col-span-6 flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                          {!item.inStock && (
                            <p className="text-xs text-red-500 mt-1">Out of Stock</p>
                          )}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-red-500 hover:text-red-600 mt-2 sm:hidden"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:col-span-2 text-center">
                        <span className="sm:hidden font-semibold mr-2">Price:</span>
                        <span className="font-semibold">₹{item.price}</span>
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-2 flex items-center justify-center gap-2">
                        <span className="sm:hidden font-semibold mr-2">Qty:</span>
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="sm:col-span-2 text-right">
                        <span className="sm:hidden font-semibold mr-2">Total:</span>
                        <span className="font-bold text-blue-600">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>

                      {/* Remove Button (Desktop) */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="hidden sm:block absolute right-6 text-gray-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Cart Footer */}
                  <div className="p-6 bg-gray-50 border-t">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-600 font-semibold"
                      >
                        Clear Cart
                      </button>
                      <div className="text-sm text-gray-500">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary - Right Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                  
                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%)</span>
                      <span className="font-semibold">₹{tax.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({promoDiscount * 100}%)</span>
                        <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={promoApplied}
                        className={`
                          px-4 py-2 rounded-lg font-semibold transition
                          ${promoApplied
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          }
                        `}
                      >
                        {promoApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-500 text-sm mt-1">{promoError}</p>
                    )}
                    {promoApplied && (
                      <p className="text-green-500 text-sm mt-1">
                        Promo code applied successfully!
                      </p>
                    )}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-3">We accept</p>
                    <div className="flex justify-center gap-3 text-2xl">
                      <span>💳</span>
                      <span>📱</span>
                      <span>🏦</span>
                      <span>💵</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Products Section */}
          {cart.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                    <div className="relative h-32 mb-3">
                      <Image
                        src="/image/placeholder.png"
                        alt="Related product"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">Product Name</h3>
                    <p className="text-blue-600 font-bold text-sm">₹999</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}