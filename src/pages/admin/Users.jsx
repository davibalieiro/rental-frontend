import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Users.css";
import { FaUser, FaUserEdit } from "react-icons/fa";

export default function Users() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: "", status: "all" });

  // State para armazenar os cupons privados disponíveis
  const [privateCoupons, setPrivateCoupons] = useState([]);

  // Função para buscar os cupons privados da API
  const fetchPrivateCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/coupons/all`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Não foi possível carregar os cupons");
      const json = await res.json();
      const allCoupons = json.data || [];
      // Filtra para manter apenas os cupons que não são públicos
      setPrivateCoupons(allCoupons.filter((c) => !c.isPublic));
    } catch (err) {
      console.error("Erro ao buscar cupons:", err);
      toast.error("Erro ao carregar cupons privados.");
    }
  };

  // READ USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/user/all`, {
        credentials: "include",
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        throw new Error("Resposta inesperada do servidor");
      }

      const json = await res.json();
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
    fetchPrivateCoupons(); // Busca os cupons quando o componente montar
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await fetch(`${API_URL}/user/${id}`, {
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      // --- PASSO 1: Atualizar os dados básicos do usuário (nome, email, status) ---
      const userPayload = {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        is_active: !!editingUser.is_active,
      };

      const userRes = await fetch(
        `${API_URL}/user/${editingUser.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(userPayload),
        }
      );

      if (!userRes.ok) throw new Error("Erro ao atualizar os dados do usuário");

      // --- PASSO 2: Atualizar as associações de cupons ---

      // CORRIGIDO: Calcula os cupons originais usando a mesma lógica do 'handleStartEdit'
      // para garantir consistência.
      const originalCouponIds = privateCoupons
        .filter(coupon =>
          (coupon.allowedUsers || []).some(user => (user.id || user) === editingUser.id)
        )
        .map(coupon => coupon.id);

      const newCouponIds = editingUser.couponIds || [];

      const addedCouponIds = newCouponIds.filter(
        (id) => !originalCouponIds.includes(id)
      );
      const removedCouponIds = originalCouponIds.filter(
        (id) => !newCouponIds.includes(id)
      );

      // O resto da função continua igual...
      const couponUpdates = [];

      const updateCoupon = async (couponId, action) => {
        const couponRes = await fetch(`${API_URL}/coupons/${couponId}`, { credentials: "include" });
        if (!couponRes.ok) throw new Error(`Não foi possível carregar o cupom ${couponId}`);
        const couponData = (await couponRes.json()).data;

        const currentAllowedUserIds = (couponData.allowedUsers || []).map(user => user.id || user);

        let newAllowedUserIds;

        if (action === 'add') {
          if (!currentAllowedUserIds.includes(editingUser.id)) {
            currentAllowedUserIds.push(editingUser.id);
          }
          newAllowedUserIds = currentAllowedUserIds;
        } else if (action === 'remove') {
          newAllowedUserIds = currentAllowedUserIds.filter(userId => userId !== editingUser.id);
        }

        const couponPayload = {
          ...couponData,
          allowedUsers: newAllowedUserIds,
        };

        delete couponPayload.id;

        return fetch(`${API_URL}/coupons/${couponId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(couponPayload)
        });
      };

      addedCouponIds.forEach(id => couponUpdates.push(updateCoupon(id, 'add')));
      removedCouponIds.forEach(id => couponUpdates.push(updateCoupon(id, 'remove')));

      if (couponUpdates.length > 0) {
        const results = await Promise.all(couponUpdates);
        if (results.some(res => !res.ok)) {
          throw new Error("Ocorreu um erro ao atualizar um ou mais cupons.");
        }
      }

      // --- PASSO 3: Finalização ---
      toast.success("Usuário e cupons atualizados com sucesso!");
      setEditingUser(null);
      // Recarrega ambos para garantir que a UI fique 100% sincronizada
      fetchUsers();
      fetchPrivateCoupons();

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Erro ao atualizar usuário");
    }
  };

  // Abre o drawer e prepara o estado do usuário para edição
  const handleStartEdit = (user) => {
    // CORREÇÃO: Determina os cupons selecionados com base na fonte de verdade:
    // a lista 'allowedUsers' de cada cupom privado.
    const userCouponIds = privateCoupons
      .filter(coupon => {
        if (!Array.isArray(coupon.allowedUsers)) {
          return false;
        }
        return coupon.allowedUsers.some(allowedUser => {
          const allowedUserId = typeof allowedUser === 'string' ? allowedUser : allowedUser.id;
          return allowedUserId === user.id;
        });
      })
      .map(coupon => coupon.id); // Extrai apenas os IDs dos cupons correspondentes

    // Define o estado do usuário em edição com a lista de cupons correta
    setEditingUser({ ...user, couponIds: userCouponIds });
  };

  // Adiciona ou remove um ID de cupom da lista do usuário em edição
  const handleCouponToggle = (couponId) => {
    setEditingUser((prev) => {
      const currentCouponIds = prev.couponIds || [];
      const newCouponIds = currentCouponIds.includes(couponId)
        ? currentCouponIds.filter((id) => id !== couponId)
        : [...currentCouponIds, couponId];
      return { ...prev, couponIds: newCouponIds };
    });
  };

  // filtros locais
  const filtered = users.filter((u) => {
    const q = filters.q.toLowerCase();
    const matchesText =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q);
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
        <h2><FaUserEdit /> Gerenciar Usuários</h2>
        <div className="users-filters">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
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
                <th>Telefone</th>
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
                  <td>{u.phone || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${u.is_active ? "success" : "danger"
                        }`}
                    >
                      {u.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleStartEdit(u)}
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
                  <td colSpan="6" className="empty">
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

              <div className="form-row">
                <label>Telefone</label>
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  placeholder="(XX) XXXXX-XXXX"
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

              <div className="form-row">
                <label>Cupons Permitidos (Privados)</label>
                <div className="coupons-checkbox-group">
                  {privateCoupons.length > 0 ? (
                    privateCoupons.map((coupon) => (
                      <div key={coupon.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`coupon-${coupon.id}`}
                          checked={editingUser.couponIds?.includes(coupon.id) || false}
                          onChange={() => handleCouponToggle(coupon.id)}
                        />
                        <label htmlFor={`coupon-${coupon.id}`}>
                          {coupon.text} ({coupon.code})
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>Nenhum cupom privado disponível.</p>
                  )}
                </div>
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