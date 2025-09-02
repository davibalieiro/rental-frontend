import React, { useEffect, useState } from "react";
import "./Materials.css";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // Buscar materiais
  async function fetchMaterials() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/material/all", {
        method: "GET",
        credentials: "include",
      });
      const json = await res.json();
      setMaterials(json.data || []);
    } catch (err) {
      console.error("Erro ao listar materiais", err);
      alert("Erro ao carregar materiais!");
    } finally {
      setLoading(false);
    }
  }

  // Criar/Editar material
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const url = editing
        ? `http://localhost:3000/api/material/${editing}`
        : "http://localhost:3000/api/material";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao salvar material");

      alert(`Material ${editing ? "atualizado" : "adicionado"} com sucesso!`);
      setForm({ name: "" });
      setEditing(null);
      fetchMaterials();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar material!");
    }
  }

  // Excluir material
  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este material?")) return;
    try {
      await fetch(`http://localhost:3000/api/material/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchMaterials();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir material!");
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
    <div className="materials-page">
      <h2>🛠 Gerenciar Materiais</h2>

      <form onSubmit={handleSubmit} className="materials-form">
        <input
          type="text"
          placeholder="Nome do material"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          required
        />
        <div className="form-buttons">
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
        </div>
      </form>

      {loading ? (
        <p>Carregando materiais...</p>
      ) : (
        <table className="materials-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m, index) => (
              <tr key={m.id} className={index % 2 === 0 ? "even" : "odd"}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(m)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(m.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
