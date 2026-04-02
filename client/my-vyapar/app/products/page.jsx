// app/products/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import toast, { Toaster } from 'react-hot-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      // Ensure data is an array
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch Products Error:', error);
      toast.error('Failed to fetch products');
      setProducts([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4 shadow hover:shadow-lg transition">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-2 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;