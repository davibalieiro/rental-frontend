import { useState, useEffect } from "react";

export function useProducts() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/product/all`, {
        credentials: "include",
      });
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, fetchProducts, loadingProducts };
}
