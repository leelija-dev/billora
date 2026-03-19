"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Nav2 from "@/components/Nav2";
import Footer from "@/components/Footer";

interface CartItem {
  id: number;
  img: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    setLoading(false);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        setCart(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Helper function to update cart and notify other components
  const updateCartAndNotify = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch custom event to notify products page
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return removeFromCart(id);

    const updated = cart.map((i) =>
      i.id === id ? { ...i, quantity: qty } : i
    );

    updateCartAndNotify(updated);
  };

  const removeFromCart = (id: number) => {
    const updated = cart.filter((i) => i.id !== id);
    updateCartAndNotify(updated);
  };

  const subtotal = cart.reduce(
    (t, i) => t + i.price * i.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <>
      <Nav2 />

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cart</h1>
          <Link href="/products" className="text-blue-600 text-sm">
            ← Go to Products
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-lg text-gray-500 mb-4">
              Your cart is empty
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT - ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="w-20 h-20 relative bg-gray-100 rounded-md">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {item.category}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 border rounded"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ₹{item.price}
                    </p>
                    <p className="text-blue-600 font-bold">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT - SUMMARY */}
            <div className="bg-white p-5 rounded-xl shadow-sm h-fit sticky top-20">
              <h2 className="font-semibold mb-4">Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{Math.round(tax)}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ₹{Math.round(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push("/products/cart/checkout")}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md"
              >
                Checkout
              </button>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </>
  );
}