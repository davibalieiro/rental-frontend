// src/components/admin/Products.jsx
import React, { useEffect, useState } from "react";
import { FaBox } from "react-icons/fa";
import '../css/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0 });

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/product/all", {
        method: "GET",
        credentials: 'include',
      });
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error("Erro ao listar produtos", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/api/product", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", quantity: 0 });
      fetchProducts();
    } catch (err) {
      console.error("Erro ao criar produto", err);
    }
  }

  async function getProductImage(id) {
    try {
      const res = await fetch(`http://localhost:3000/api/product/${id}/image`);
      if (!res.ok) return null;
      const data = await res.json();
      return data?.url || null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <h2>Gerenciar Produtos</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome do produto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary">Adicionar</button>
      </form>

      <div className="cards-container">
        {products.map((p) => (
          <div className="card" key={p.id}>
            {p.img_blob_name ? (
              <img
                src={`http://localhost:3000/api/product/${p.id}/image`}
                alt={p.name}
                className="product-image"
              />
            ) : (
              <FaBox className="placeholder-icon" />
            )}
            <h3>{p.name}</h3>
            <p>Quantidade: {p.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
