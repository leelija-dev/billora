"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    title: "GST Billing Software",
    yearly: "₹1999/year",
    monthly: "₹199/month",
    img: "/products/gst.png",
    popular: true,
    features: [
      "Unlimited GST invoices",
      "Customer management",
      "GST reports",
      "Export invoices"
    ]
  },
  {
    title: "POS Billing System",
    yearly: "₹2999/year",
    monthly: "₹299/month",
    img: "/products/pos.png",
    features: [
      "Barcode billing",
      "Thermal printer support",
      "Daily sales report",
      "Retail POS dashboard"
    ]
  },
  {
    title: "Inventory + GST",
    yearly: "₹3499/year",
    monthly: "₹349/month",
    img: "/products/inventory.png",
    features: [
      "Stock management",
      "Purchase tracking",
      "Low stock alerts",
      "Inventory analytics"
    ]
  }
];

export default function ProductsPage() {

  const [yearly, setYearly] = useState(true);

  return (
    <div className="relative bg-slate-50 font-sans overflow-hidden">

      {/* FLOATING BLOBS */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>

      {/* HERO */}
      <section className="text-center py-24 px-6">
        <h1 className="text-5xl font-bold text-gray-800">
          GST Billing Products
        </h1>

        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Powerful tools to manage billing, GST compliance and inventory for
          modern businesses.
        </p>

        {/* Pricing Toggle */}
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 rounded-lg ${
              !yearly ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 rounded-lg ${
              yearly ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Yearly
          </button>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section className="px-6 md:px-12 lg:px-20 pb-24">
       <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">

  {products.map((product, index) => (

    <div
      key={index}
      className="relative rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition hover:-translate-y-2"
    >

      {/* Gradient Top */}
      <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

      <div className="bg-white p-7">

        {/* Image */}
        <div className="relative h-48 mb-6">
          <Image
            src={product.img}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-110 transition"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {product.title}
        </h2>

        {/* Price */}
        <p className="text-2xl font-bold text-purple-600 mb-5">
          {yearly ? product.yearly : product.monthly}
        </p>

        {/* Features */}
        <ul className="space-y-2 text-gray-600 text-sm mb-6">
          {product.features.map((f, i) => (
            <li key={i} className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              {f}
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="flex gap-3">

          <Link
            href="/contact"
            className="flex-1 text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl hover:opacity-90 transition"
          >
            Buy Now
          </Link>

          <Link
            href="/demo"
            className="flex-1 text-center border border-purple-300 py-3 rounded-xl hover:bg-purple-50 transition"
          >
            Demo
          </Link>

                  </div>

                </div>

              </div>

          ))}
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="bg-white py-20 px-6 md:px-12 lg:px-20">

        <h2 className="text-3xl font-bold text-center mb-12">
          Product Comparison
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full border text-left">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Feature</th>
                <th className="p-4">GST Billing</th>
                <th className="p-4">POS</th>
                <th className="p-4">Inventory</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t">
                <td className="p-4">GST Invoices</td>
                <td className="p-4">✔</td>
                <td className="p-4">✔</td>
                <td className="p-4">✔</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Barcode Billing</td>
                <td className="p-4">—</td>
                <td className="p-4">✔</td>
                <td className="p-4">—</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Inventory Tracking</td>
                <td className="p-4">—</td>
                <td className="p-4">—</td>
                <td className="p-4">✔</td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="bg-slate-50 py-20 px-6 md:px-12 lg:px-20 text-center">

        <h2 className="text-3xl font-bold mb-12">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600">
              "Best GST billing software for our shop."
            </p>
            <p className="mt-4 font-semibold">
              – Rahul Sharma
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600">
              "Inventory tracking made our work very easy."
            </p>
            <p className="mt-4 font-semibold">
              – Priya Verma
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600">
              "POS billing works perfectly for retail stores."
            </p>
            <p className="mt-4 font-semibold">
              – Amit Patel
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white text-center py-20">

        <h2 className="text-4xl font-bold mb-6">
          Start Your GST Billing Today
        </h2>

        <Link
          href="/contact"
          className="bg-blue-600 px-8 py-4 rounded-xl hover:bg-blue-700"
        >
          Get Free Demo
        </Link>

      </section>

    </div>
  );
}