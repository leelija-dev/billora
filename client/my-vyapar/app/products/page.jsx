"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../store/authStore";
import { getProducts } from "../../services/productService";

export default function ProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(); // automatically uses logged-in user ID
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div>
      <h1>Your Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> — {product.price} USD
          </li>
        ))}
      </ul>
    </div>
  );
}