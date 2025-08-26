// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import "./ProductList.css"; // CSS puro

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/api/product/all", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` // se precisar de auth
          }
        });

        const json = await response.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <section className="product-list">
      <h2>Produtos</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <h3>{product.name}</h3>
            <p><b>Quantidade:</b> {product.quantity}</p>

            {product.categories.length > 0 && (
              <p>
                <b>Categorias:</b>{" "}
                {product.categories.map(c => c.name).join(", ")}
              </p>
            )}

            {product.materials.length > 0 && (
              <p>
                <b>Materiais:</b>{" "}
                {product.materials.map(m => m.name).join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
