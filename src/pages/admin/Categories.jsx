import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Categorias.css";

export default function Categories({ darkMode }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // ====== FETCH ALL CATEGORIES ======
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/category/all", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      setCategories(json.data || []);
    } catch (err) {
      console.error("Erro ao listar categorias", err);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  // ====== ADD OR UPDATE CATEGORY ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editing
        ? `http://localhost:3000/api/category/${editing}`
        : "http://localhost:3000/api/category";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar categoria");

      toast.success(`Categoria ${editing ? "atualizada" : "adicionada"}!`);
      setForm({ name: "" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar categoria");
    }
  };

  // ====== DELETE CATEGORY ======
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao excluir categoria");
      toast.success("Categoria excluída!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir categoria");
    }
  };

  // ====== START EDITING ======
  const startEdit = (category) => {
    setEditing(category.id);
    setForm({ name: category.name });
  };

  // ====== INIT ======
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={`categories-page ${darkMode ? "dark" : ""}`}>
      <h2>📂 Gerenciar Categorias</h2>

      {/* FORM ADD / EDIT */}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome da categoria"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary">
          {editing ? "Salvar" : "Adicionar"}
        </button>
        {editing && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setEditing(null);
              setForm({ name: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* LIST */}
      {loading ? (
        <p>Carregando categorias...</p>
      ) : (
        <ul className="category-list">
          {categories.map((c) => (
            <li key={c.id} className="category-item">
              <span>{c.name}</span>
              <div className="actions">
                <button className="edit" onClick={() => startEdit(c)}>
                  <FaEdit />
                </button>
                <button className="delete" onClick={() => handleDelete(c.id)}>
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}
