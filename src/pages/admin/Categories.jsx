// src/components/admin/Categories.jsx
import React, { useEffect, useState } from "react";
import "../css/Categorias.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);

  // Buscar categorias
  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:3000/api/categories", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      setCategories(json.data || []);
    } catch (err) {
      console.error("Erro ao listar categorias", err);
    }
  }

  // Criar categoria
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        // EDITAR categoria
        const res = await fetch(`http://localhost:3000/api/categories/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Erro ao editar categoria");
      } else {
        // CRIAR categoria
        const res = await fetch("http://localhost:3000/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Erro ao criar categoria");
      }

      setForm({ name: "" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  }

  // Excluir categoria
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao excluir categoria");

      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  }

  // Colocar categoria no modo edição
  function startEdit(category) {
    setEditing(category.id);
    setForm({ name: category.name });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="page-content">
      <h2>Gerenciar Categorias</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          required
        />
        <button type="submit">{editing ? "Salvar" : "Adicionar"}</button>
        {editing && (
          <button type="button" className="cancel" onClick={() => {
            setEditing(null);
            setForm({ name: "" });
          }}>
            Cancelar
          </button>
        )}
      </form>

      <ul className="admin-list">
        {categories.map((c) => (
          <li key={c.id} className="list-item">
            <span>{c.name}</span>
            <div className="actions">
              <button className="edit" onClick={() => startEdit(c)}>Editar</button>
              <button className="delete" onClick={() => handleDelete(c.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
