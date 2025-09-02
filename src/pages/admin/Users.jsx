import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: "", status: "all" });

  // READ
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/user/all", {
        credentials: "include",
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Resposta inesperada do servidor");
      }

      const json = await res.json();
      // Ajuste se sua API já retorna {data: []}
      const list = Array.isArray(json) ? json : json.data || [];
      setUsers(list);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao listar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao excluir usuário");
      toast.success("Usuário excluído!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir usuário");
    }
  };

  // UPDATE
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        is_active: !!editingUser.is_active,
      };

      const res = await fetch(
        `http://localhost:3000/api/user/${editingUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar usuário");
      toast.success("Usuário atualizado!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar usuário");
    }
  };

  // filtros locais
  const filtered = users.filter((u) => {
    const q = filters.q.toLowerCase();
    const matchesText =
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchesStatus =
      filters.status === "all"
        ? true
        : filters.status === "active"
          ? !!u.is_active
          : !u.is_active;
    return matchesText && matchesStatus;
  });

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>👤 Gerenciar Usuários</h2>

        <div className="users-filters">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
          <button className="btn-outline" onClick={fetchUsers}>
            Recarregar
          </button>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-table users-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th style={{ width: 110 }}>Status</th>
                <th style={{ width: 200 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id} className={idx % 2 === 0 ? "even" : "odd"}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`badge ${u.is_active ? "success" : "danger"}`}
                    >
                      {u.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => setEditingUser(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="drawer">
          <form className="drawer-card" onSubmit={handleEditSubmit}>
            <div className="drawer-header">
              <h3>Editar Usuário</h3>
              <button
                type="button"
                className="icon-close"
                onClick={() => setEditingUser(null)}
                aria-label="Fechar"
                title="Fechar"
              >
                ×
              </button>
            </div>

            <div className="drawer-body">
              <div className="form-row">
                <label>Nome</label>
                <input
                  type="text"
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <label>E-mail</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-row inline">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={!!editingUser.is_active}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        is_active: e.target.checked,
                      })
                    }
                  />
                  <span className="slider" />
                </label>
                <span className="switch-label">
                  {editingUser.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>

            <div className="drawer-footer">
              <button type="submit" className="btn-primary">
                Salvar
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
          <div className="drawer-backdrop" onClick={() => setEditingUser(null)} />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
}
