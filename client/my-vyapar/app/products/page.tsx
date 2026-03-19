"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Nav2 from "@/components/Nav2";
import Footer from "@/components/Footer";

/* ---------------- CART STATE ---------------- */
type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  img: string;
  category: string;
};

/* ---------------- PRODUCT TYPE ---------------- */
type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  img: string;
  category: string;
  description: string;
  inStock: boolean;
};

/* ---------------- PRODUCTS ---------------- */
const productTemplates = [
  { baseName: "Basket", category: "Software", price: 1999, img: "basket" },
  { baseName: "Headphones", category: "Electronics", price: 2999, img: "headphones" },
  { baseName: "Laptop", category: "Electronics", price: 50000, img: "laptop2" },
  { baseName: "Smart Watch", category: "Accessories", price: 3999, img: "watch" },
  { baseName: "iPhone 14", category: "Mobile", price: 69999, img: "iphone" },
  { baseName: "Samsung S23", category: "Mobile", price: 74999, img: "samsung" },
  { baseName: "Basmati Rice", category: "Grocery", price: 499, img: "basmati" },
  { baseName: "Cooking Oil", category: "Grocery", price: 180, img: "oil" },
  { baseName: "Green Tea", category: "Grocery", price: 499, img: "grrentea" },
  { baseName: "Casual Shirt", category: "Fashion", price: 749, img: "shirt" },
  { baseName: "Mini Dress", category: "Fashion", price: 999, img: "minidress" },
  { baseName: "Maxi Dress", category: "Fashion", price: 1299, img: "dress" },
];

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;
  for (let v = 0; v < 20; v++) {
    productTemplates.forEach((t) => {
      products.push({
        id: id++,
        title: `${t.baseName} ${v}`,
        price: t.price,
        rating: Math.floor(Math.random() * 3) + 3,
        img: `/image/${t.img}.png`,
        category: t.category,
        description: "High quality product with premium features and excellent build quality.",
        inStock: true,
      });
    });
  }
  return products;
};

const ALL_PRODUCTS = generateProducts();
const categories = ["All", ...new Set(ALL_PRODUCTS.map((p) => p.category))];
const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const router = useRouter();

  /* ---------------- FILTER STATE ---------------- */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100000);

  /* ---------------- CART STATE ---------------- */
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartIconAnimation, setCartIconAnimation] = useState(false);

  /* ---------------- FIX: LOCAL STORAGE SYNC ---------------- */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ---------------- PRODUCT MODAL STATE ---------------- */
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openProductModal = (product: Product) => {
  setSelectedProduct(product);
  setIsModalOpen(true);
};

const closeProductModal = () => {
  setIsModalOpen(false);
  setSelectedProduct(null);
};

  /* ---------------- LAZY LOADING STATE ---------------- */
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- FILTER LOGIC ---------------- */
  const filtered = useMemo(() => {
    return ALL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category) &&
        p.price <= maxPrice
    );
  }, [search, category, maxPrice]);

  /* ---------------- LAZY LOADING ---------------- */
  useEffect(() => {
    setDisplayedProducts(filtered.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > PRODUCTS_PER_PAGE);
  }, [filtered]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const start = nextPage * PRODUCTS_PER_PAGE;
      const end = start + PRODUCTS_PER_PAGE;
      const newProducts = filtered.slice(start, end);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(end < filtered.length);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    }, 500);
  }, [loading, hasMore, page, filtered]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  /* ---------------- CART FUNCTIONS ---------------- */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setCartIconAnimation(true);
    setTimeout(() => setCartIconAnimation(false), 500);
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
      );
    }
  };

  const getCartCount = () =>
    cart.reduce((acc, i) => acc + i.quantity, 0);

  const getCartTotal = () =>
    cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const goToCartPage = () => {
    router.push("/products/cart");
    setIsCartOpen(false);
  };

  const itemCount = getCartCount();

  return (
    <>
      <Nav2 />

      <div className="bg-slate-50 min-h-screen px-6 py-10">

        {/* EXPLORE PRODUCTS HEADER */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Explore Products
        </h1>

        {/* SEARCH */}
        <input
          className="w-full mb-6 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid lg:grid-cols-4 gap-6">

          {/* FILTER SIDEBAR */}
          <div className="bg-white p-5 rounded-xl shadow space-y-4 h-fit lg:sticky lg:top-24">
            <h2 className="font-bold text-xl mb-4">Filters</h2>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Category</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg mb-1 transition ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Max Price: ₹{maxPrice}</h3>
              <input
                type="range"
                min="0"
                max="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxPrice(100000);
              }}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Reset Filters
            </button>
          </div>

          {/* PRODUCTS GRID */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProductModal(p)}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative h-40 mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <Image 
                      src={p.img} 
                      fill 
                      alt={p.title}
                      className="object-contain p-4"
                      onError={(e) => {
                        e.currentTarget.src = "/image/placeholder.png";
                      }}
                    />
                  </div>

                  <h2 className="font-bold text-lg line-clamp-1">{p.title}</h2>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < p.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xl font-bold text-blue-600 mt-2">₹{p.price}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p);
                    }}
                    className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>

            {/* Loader for infinite scroll */}
            {hasMore && (
              <div ref={loaderRef} className="flex justify-center py-8">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-gray-500">Loading more...</span>
                  </div>
                ) : (
                  <div className="h-10"></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BEAUTIFUL FLOATING CART BUTTON - RIGHT SIDE */}
      <button
        onClick={() => setIsCartOpen(true)}
        className={`
          fixed bottom-6 right-6 z-[45] flex items-center justify-center
          w-[70px] h-[70px] md:w-[70px] md:h-[70px] sm:w-[60px] sm:h-[60px]
          bg-black rounded-full shadow-2xl
          transition-all duration-300 ease-in-out
          hover:bg-[#333] hover:scale-105 hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)]
          ${itemCount > 0 ? 'has-items bg-gradient-to-r from-black to-[#2c3e50]' : ''}
          ${cartIconAnimation ? 'animate-cartBounce' : ''}
          group
        `}
        aria-label="View cart"
      >
        {/* Cart Icon */}
        <div className="text-white text-[28px] sm:text-[24px] flex items-center justify-center">
          <svg className="w-7 h-7 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>

        {/* Cart Badge */}
        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center text-sm sm:text-xs font-bold border-3 border-white animate-badgePulse">
            {itemCount > 99 ? '99+' : itemCount}
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute right-[80px] bg-black/90 text-white px-4 py-2.5 rounded-md text-sm whitespace-nowrap opacity-0 translate-x-2 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 after:content-[''] after:absolute after:top-1/2 after:right-[-6px] after:-translate-y-1/2 after:border-l-[6px] after:border-l-black/90 after:border-t-[6px] after:border-t-transparent after:border-b-[6px] after:border-b-transparent hidden md:block">
          View Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </div>
      </button>

      {/* CART SIDEBAR - OPENS FROM RIGHT SIDE (PREVIEW ONLY) */}
      {isCartOpen && (
        <>
          {/* Backdrop - positioned below Nav2 */}
          <div 
            className="fixed inset-0 bg-black/50 z-[90]"
            onClick={() => setIsCartOpen(false)}
            style={{ top: '64px' }} // Adjust this value based on your Nav2 height
          />
          
          {/* Sidebar - Starts below Nav2 */}
          <div 
            className="fixed right-0 w-full max-w-md bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[95] animate-slide-in-right"
            style={{ 
              top: '64px', // Nav2 height - adjust if your Nav2 is different
              height: 'calc(100vh - 64px)' // Full height minus Nav2
            }}
          >
            {/* Header with Title and Close Button - Sticky */}
            <div className="sticky top-0 bg-white z-[96] border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Your Cart ({itemCount})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items - Preview Only */}
            <div className="overflow-y-auto p-6" style={{ height: 'calc(100% - 140px)' }}>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">Your cart is empty</p>
                  <p className="text-gray-400 mt-1">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                        <p className="text-blue-600 font-bold">₹{item.price}</p>
                      </div>
                      
                      {/* Quantity Controls - Only + and - */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="text-red-500 hover:text-red-600 text-sm font-semibold mb-2"
                        >
                          Remove
                        </button>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with "Let's Go to Cart" Button */}
            {cart.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 border-t p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-blue-600">₹{getCartTotal()}</span>
                </div>
                <button
                  onClick={goToCartPage}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Let's Go to Cart</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={closeProductModal}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 p-2 rounded-full shadow-md transition-all z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-8">
              {/* Product Image */}
              <div className="relative h-80 bg-gray-50 rounded-xl overflow-hidden">
                <Image
                  src={selectedProduct.img}
                  alt={selectedProduct.title}
                  fill
                  className="object-contain p-8"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
                  {selectedProduct.category}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.title}</h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < selectedProduct.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">({selectedProduct.rating} stars)</span>
                </div>

                <p className="text-3xl font-black text-blue-600 mb-6">₹{selectedProduct.price}</p>
                
                <p className="text-gray-600 leading-relaxed mb-8">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-green-600 font-semibold">✓ In Stock</span>
                </div>

                <div className="flex gap-4 mt-auto">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      closeProductModal();
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={closeProductModal}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        @keyframes cartBounce {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.2); }
          50% { transform: scale(0.95); }
          70% { transform: scale(1.1); }
        }
        .animate-cartBounce {
          animation: cartBounce 0.5s ease;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-badgePulse {
          animation: badgePulse 2s infinite;
        }
      `}</style>

      <Footer />
    </>
  );
}