// Orders.jsx

import React, { useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Orders.css";
import Modal from "~/components/Modal";
import { useOrders } from "~/context/OrdersContext";
import { FaCopy } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL_V1;

// --- Componente do Modal de Edição ---
function EditOrderModal({ order, onClose, onSave }) {
  const [status, setStatus] = useState(order.status);
  const [targetDate, setTargetDate] = useState(
    order.target_date ? new Date(order.target_date).toISOString().split("T")[0] : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {};
    if (status !== order.status) updatedData.status = status;
    if (order.target_date && new Date(targetDate).getTime() !== new Date(order.target_date).getTime()) {
      updatedData.target_date = new Date(targetDate).toISOString();
    } else if (!order.target_date && targetDate) {
      updatedData.target_date = new Date(targetDate).toISOString();
    }

    if (Object.keys(updatedData).length > 0) onSave(order.id, updatedData);
    else onClose();
  };

  const availableStatuses = [
    { key: "PENDING", label: "PENDENTE" },
    { key: "APPROVED", label: "APROVADO" },
    { key: "DOING", label: "PROCESSANDO" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Pedido #{order.id.substring(0, 8)}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {availableStatuses.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="targetDate">Data de Entrega</label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-green">
              Salvar Alterações
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Componente Principal de Pedidos ---
export default function Orders({ currentUser }) {
  const { state, setPage, setFilters, updateOrder } = useOrders();
  const { orders, pagination, loading, error, page: currentPage, filters } = state;

  // Estados dos Modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // --- Funções de Lógica e Formatação ---

  const getPriorityLevel = (order) => {
    if (!order.target_date || order.status === "APPROVED" || order.status === "CANCELLED") return 0;
    const today = new Date();
    const deliveryDate = new Date(order.target_date);
    const diffDays = Math.ceil((deliveryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return 2; // Muito urgente
    if (diffDays <= 14) return 1; // Moderadamente urgente
    return 0;
  };

  // NOVO: Helper para verificar se a data de entrega já passou
  const isExpired = (order) => {
    if (!order.target_date) return false;
    const today = new Date();
    // Zera a hora para comparar apenas a data
    today.setHours(0, 0, 0, 0);
    const deliveryDate = new Date(order.target_date);
    return deliveryDate < today;
  };


  // ALTERADO: Lógica de pontuação para ordenação
  const getSortScore = (order) => {
    // Prioridade 1: Não reivindicado
    if (!order.sellerId) return 0;

    // Prioridade 2: Perto de expirar (e não cancelado/aprovado)
    // A função getPriorityLevel já exclui CANCELLED e APPROVED
    if (getPriorityLevel(order) > 0) return 1;

    // Prioridade 7: Expirados que já foram Aprovados ou Cancelados
    // Verificamos isso antes dos status normais para dar menor prioridade
    if (isExpired(order) && (order.status === 'APPROVED' || order.status === 'CANCELLED')) {
      return 6;
    }

    // Prioridades 3 a 6: Ordenação por status para pedidos não urgentes
    switch (order.status) {
      case 'PENDING':
        return 2;
      case 'DOING':
        return 3;
      case 'APPROVED': // Aprovados não expirados
        return 4;
      case 'CANCELLED': // Cancelados não expirados
        return 5;
      default:
        return 99; // Fallback para outros casos
    }
  };

  const sortedOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return [...orders].sort((a, b) => {
      const scoreA = getSortScore(a);
      const scoreB = getSortScore(b);
      if (scoreA !== scoreB) return scoreA - scoreB;
      return new Date(b.order_date) - new Date(a.order_date);
    });
  }, [orders]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // --- Handlers de Interação ---

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ clientEmail: "", clientName: "", status: "" });
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedOrder(null);
    setIsEditModalOpen(false);
  };

  const openConfirmModal = (title, message, action) => {
    setModalTitle(title);
    setModalMessage(message);
    setConfirmAction(() => action);
    setIsConfirmModalOpen(true);
  };

  // --- Funções de API ---

  const claimOrder = async (order) => {
    try {
      const updatedFields = { sellerId: currentUser.id, sellerName: currentUser.name };
      const response = await fetch(`${API_URL}/order/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível reivindicar o pedido.");
      updateOrder(order.id, updatedFields);
      toast.success(`Pedido #${order.id.substring(0, 8)} reivindicado!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Falha ao atualizar pedido.");
      updateOrder(orderId, updatedData);
      toast.success("Pedido atualizado com sucesso!");
      closeEditModal();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancelOrder = (orderId) => {
    openConfirmModal("Cancelar Pedido", "Tem certeza que deseja CANCELAR este pedido?", async () => {
      try {
        const response = await fetch(`${API_URL}/order/cancel/${orderId}`, { method: "PUT", credentials: "include" });
        if (response.status === 204 || response.ok) {
          updateOrder(orderId, { status: 'CANCELLED' });
          toast.success("Pedido cancelado com sucesso!");
        } else {
          const result = await response.json();
          throw new Error(result.message || "Falha ao cancelar pedido.");
        }
      } catch (err) {
        toast.error(err.message);
      }
    });
  };

  const handleDeleteOrder = (orderId) => {
    openConfirmModal("Excluir Pedido", "Atenção! Esta ação é irreversível. Deseja realmente EXCLUIR este pedido?", async () => {
      // Implementar a lógica de exclusão aqui. Pode ser necessário refetch dos dados.
      toast.info("Funcionalidade de exclusão a ser implementada.");
    });
  };

  if (!currentUser) return <div className="loading">Carregando informações do usuário...</div>;

  // --- Renderização do Componente ---

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="orders-container">
        <header className="header">
          <h1>Painel de Pedidos</h1>
        </header>

        <div className="search-bar">
          <input type="email" name="clientEmail" placeholder="Pesquisar por e-mail..." value={filters.clientEmail} onChange={handleFilterChange} />
          <input type="text" name="clientName" placeholder="Pesquisar por nome..." value={filters.clientName} onChange={handleFilterChange} />
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">Todos os status</option>
            <option value="PENDING">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="DOING">Processando</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
          <button onClick={clearFilters} className="btn btn-secondary">Limpar Filtros</button>
        </div>

        {loading && <div className="loading">Carregando pedidos...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            {sortedOrders && sortedOrders.length > 0 ? (
              <>
                <div className="orders-grid">
                  {sortedOrders.map((order) => (
                    <div key={order.id} className={`order-card ${getPriorityLevel(order) === 2 ? "priority-red" : getPriorityLevel(order) === 1 ? "priority-orange" : ""}`}>
                      <div className="card-header">
                        <div>
                          <p className="order-id">
                            #{order.id.substring(0, 18)}...
                            <button onClick={() => { navigator.clipboard.writeText(order.id); toast.success("ID copiado!"); }} className="btn btn-small btn-copy" title="Copiar ID"><FaCopy /></button>
                          </p>
                          <h3>Cliente: {order.clientName}</h3>
                        </div>
                        <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
                      </div>
                      <div className="info-group">
                        <p><strong>Data do Pedido:</strong> {formatDate(order.order_date)}</p>
                        <p><strong>Data de Entrega:</strong> {formatDate(order.target_date)}</p>
                        <p><strong>Vendedor:</strong> {order.sellerName || "Não atribuído"}</p>
                      </div>
                      <div className="info-group">
                        <strong>Produtos:</strong>
                        <ul className="products-list">
                          {order.orderProducts.map((product) => (
                            <li key={product.productId}>
                              {product.quantity}x {product.name} ({product.dimension})
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="card-footer">
                        {!currentUser.isAdmin && !order.sellerId && (<button onClick={() => claimOrder(order)} className="btn btn-green">Reivindicar Pedido</button>)}
                        {(currentUser.isAdmin || order.sellerId === currentUser.id) && order.status !== "CANCELLED" && (
                          <>
                            <button onClick={() => openEditModal(order)} className="btn btn-blue">Editar</button>
                            <button onClick={() => handleCancelOrder(order.id)} className="btn btn-orange">Cancelar</button>
                          </>
                        )}
                        {currentUser.isAdmin && (<button onClick={() => handleDeleteOrder(order.id)} className="btn btn-red">Excluir</button>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pagination">
                  <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} className="page-btn">
                    ◀ Anterior
                  </button>
                  {Array.from({ length: pagination?.totalPages || 0 }, (_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={currentPage === pagination?.totalPages || pagination?.totalPages === 0} onClick={() => setPage(currentPage + 1)} className="page-btn">
                    Próxima ▶
                  </button>
                </div>
              </>
            ) : (
              <div className="no-orders-found">Nenhum pedido encontrado.</div>
            )}
          </>
        )}
      </div>

      {/* --- Renderização dos Modais --- */}
      {isEditModalOpen && selectedOrder && (<EditOrderModal order={selectedOrder} onClose={closeEditModal} onSave={handleUpdateOrder} />)}

      <Modal isOpen={isConfirmModalOpen} title={modalTitle} onResult={(confirmed) => { setIsConfirmModalOpen(false); if (confirmed && confirmAction) confirmAction(); }}>
        <p>{modalMessage}</p>
      </Modal>


    </>
  );
}