"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const products = [
  { title: "Basket", price: 1999, rating: 5, img: "/image/basket.png", category: "Software" },
  { title: "Headphones", price: 2999, rating: 4, img: "/image/headphones.png", category: "Software" },
  { title: "Laptop", price: 50000, rating: 4, img: "/image/laptop2.png", category: "Software" },
  { title: "Basmati Rice 5kg", price: 499, rating: 4, img: "/image/basmati.png", category: "Grocery" },
  { title: "Cooking Oil 1L", price: 180, rating: 3, img: "/image/oil.png", category: "Grocery" },
  { title: "iPhone 14", price: 69999, rating: 5, img: "/image/iphone.png", category: "Mobile" },
  { title: "Samsung Galaxy S23", price: 74999, rating: 5, img: "/image/samsung.png", category: "Mobile" },
  { title: "Shirts", price: 749, rating: 3, img: "/image/shirt.png", category: "Shirts" },
  { title: "Dresses", price: 999, rating: 5, img: "/image/dress.png", category: "Pinterest dress" },
  { title: "Dresses", price: 999, rating: 5, img: "/image/minidress.png", category: "Pinterest dress" },
  { title: "Watches", price: 4999, rating: 5, img: "/image/watch.png", category: "Accessories" },
];

const categories = ["All", "Software", "Grocery", "Mobile", "Accessories", "Pinterest dress", "Shirts"];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [rating, setRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  let filteredProducts = products.filter((p) => {
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p.category === category) &&
      p.price <= maxPrice &&
      p.rating >= rating
    );
  });

  if (sort === "low") filteredProducts.sort((a, b) => a.price - b.price);
  if (sort === "high") filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <>
      <Navbar />

      <div className="bg-slate-50 min-h-screen px-4 sm:px-6 md:px-12 lg:px-20 py-12">

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
          Explore Products
        </h1>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* SIDEBAR */}
          <div className="bg-white p-5 rounded-xl shadow space-y-6 lg:sticky lg:top-24 h-fit">

            <h2 className="text-lg font-bold">Filters</h2>

            {/* CATEGORY */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <div className="space-y-2">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div>
              <h3 className="font-semibold mb-2">Max Price</h3>
              <input
                type="range"
                min="0"
                max="100000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm mt-1">₹{maxPrice}</p>
            </div>

            {/* SORT */}
            <div>
              <h3 className="font-semibold mb-2">Sort By</h3>
              <select
                onChange={(e) => setSort(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Default</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
            </div>

            {/* RATING */}
            <div>
              <h3 className="font-semibold mb-2">Rating</h3>
              {[5, 4, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className="block w-full text-left px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  {"⭐".repeat(r)} & up
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="lg:col-span-3 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {filteredProducts.map((product, index) => (
             <div
  key={index}
  onClick={() => openProduct(product)}
  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 sm:p-6 cursor-pointer hover:-translate-y-1 relative group"
>
                <div className="relative h-40 mb-4">
                  <Image
                    src={product.img}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                 <div className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl">
    ❤️
  </div>
             <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
    20% OFF
  </div>
  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
  High quality premium product for daily use.
</p>
                <p className="text-xs text-gray-500">{product.category}</p>

                <h2 className="font-bold text-lg">{product.title}</h2>

                <p className="text-yellow-500 text-sm">
                  {"⭐".repeat(product.rating)}
                </p>

                <p className="text-xl font-bold text-idigo-600 mt-2">
                  ₹{product.price}
                </p>
                <p className="text-xs text-green-600 mt-1">
    Free Delivery
  </p>

                <Link
                  href="/contact"
               className="block text-center bg-blue-600 mt-3 text-white py-2 rounded-lg">
                  Buy Now
                </Link>
   
              </div>

            ))}

          </div>
        </div>
      </div>

      {/* MODAL */}
   {showModal && selectedProduct && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4">

    <div className="bg-white rounded-2xl w-full max-w-4xl 
    p-4 sm:p-6 md:p-8 relative 
    max-h-[90vh] overflow-y-auto">

      {/* CLOSE */}
     <button
  onClick={closeModal}
  className="absolute top-3 right-3 z-50 bg-white/80 backdrop-blur 
  rounded-full w-10 h-10 flex items-center justify-center 
  text-xl shadow-md active:scale-95"
>
  ✕
</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

        {/* IMAGE */}
        <div className="relative h-52 sm:h-64 md:h-80">
          <Image
            src={selectedProduct.img}
            alt={selectedProduct.title}
            fill
            className="object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {selectedProduct.title}
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mb-1">
            {selectedProduct.category}
          </p>

          <p className="text-yellow-500 text-sm sm:text-base mb-2">
            {"⭐".repeat(selectedProduct.rating)}
          </p>

          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black-600 mb-3">
            ₹{selectedProduct.price}
          </p>

          <p className="text-gray-600 text-sm sm:text-base mb-5">
            Premium quality product, perfect for daily use with modern design.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
              Add to Cart
            </button>

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg">
              Buy Now
            </button>

          </div>

        </div>
      </div>
    </div>
  </div>
)}
      <Footer />
    </>
  );
}