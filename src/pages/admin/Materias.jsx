// src/components/admin/Categories.jsx
import React, { useEffect, useState } from "react";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });

  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const json = await res.json();
      setCategories(json.data || []);
    } catch (err) {
      console.error("Erro ao listar categorias", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await fetch("http://localhost:3000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      setForm({ name: "" });
      fetchCategories();
    } catch (err) {
      console.error("Erro ao criar categoria", err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Gerenciar Categorias</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {categories.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
