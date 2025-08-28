import React, { useEffect, useState } from "react";
import "../css/Materials.css";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);

  // Buscar materiais
  async function fetchMaterials() {
    try {
      const res = await fetch("http://localhost:3000/api/materials", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      setMaterials(json.data || []);
    } catch (err) {
      console.error("Erro ao listar materiais", err);
    }
  }

  // Criar ou editar material
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await fetch(`http://localhost:3000/api/materials/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
      } else {
        await fetch("http://localhost:3000/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        });
      }

      setForm({ name: "" });
      setEditing(null);
      fetchMaterials();
    } catch (err) {
      console.error("Erro ao salvar material", err);
    }
  }

  // Excluir material
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este material?")) return;
    try {
      await fetch(`http://localhost:3000/api/materials/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchMaterials();
    } catch (err) {
      console.error("Erro ao excluir material", err);
    }
  }

  // Preparar edição
  function handleEdit(m) {
    setForm({ name: m.name });
    setEditing(m.id);
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="page-content">
      <h2>Gerenciar Materiais</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Nome do material"
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
            className="btn-secondary"
            onClick={() => {
              setEditing(null);
              setForm({ name: "" });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(m)}
                >
                  Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(m.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
