// src/components/admin/Products.jsx
import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0 });

  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/product/all", {
        method: "GET",
        credentials : 'include',
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
        method: "GET",
        credentials : 'include',
        body: JSON.stringify(form),
      });
      setForm({ name: "", quantity: 0 });
      fetchProducts();
    } catch (err) {
      console.error("Erro ao criar produto", err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
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
        <button type="submit">Adicionar</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
