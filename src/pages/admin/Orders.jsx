import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/Orders.css";
import Modal from "~/components/Modal";
import { FaCopy } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL_V1;

function EditOrderModal({ order, onClose, onSave }) {
    const [status, setStatus] = useState(order.status);
    const [targetDate, setTargetDate] = useState(
        order.target_date ? new Date(order.target_date).toISOString().split("T")[0] : ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedData = {};
        if (status !== order.status) {
            updatedData.status = status;
        }
        if (new Date(targetDate).getTime() !== new Date(order.target_date).getTime()) {
            updatedData.target_date = new Date(targetDate).toISOString();
        }

        if (Object.keys(updatedData).length > 0) {
            onSave(order.id, updatedData);
        } else {
            onClose();
        }
    };

    const availableStatuses = [
        { key: "PENDING", label: "PENDENTE" },
        { key: "APPROVED", label: "APROVADO" },
        { key: "DOING", label: "PROCESSANDO" }
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

export default function Orders({ currentUser }) {
    const [allOrders, setAllOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchEmail, setSearchEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const openConfirmModal = (title, message, action) => {
        setModalTitle(title);
        setModalMessage(message);
        setConfirmAction(() => action);
        setIsConfirmModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const fetchOrders = useCallback(async () => {
        if (!currentUser?.id) {
            setError("Usuário não identificado.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `${API_URL}/admin/order/all`;
            const response = await fetch(url, { credentials: "include" });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Falha ao buscar os dados.");
            }

            const ordersData = Array.isArray(result.data) ? result.data : [];
            setAllOrders(ordersData);
            setOrders(ordersData);
        } catch (err) {
            setError(err.message);
            setAllOrders([]);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // 🔹 Calcular prioridade do pedido
    const getPriorityLevel = (order) => {
        if (!order.target_date || order.status === "APPROVED") return 0;

        const today = new Date();
        const deliveryDate = new Date(order.target_date);
        const diffTime = deliveryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0 || diffDays <= 7) return 2; // vermelho
        if (diffDays <= 14) return 1; // laranja
        return 0;
    };

    useEffect(() => {
        let filtered = [...allOrders];

        if (searchEmail.trim()) {
            filtered = filtered.filter((o) =>
                o.clientEmail?.toLowerCase().includes(searchEmail.toLowerCase())
            );
        }

        if (searchName.trim()) {
            filtered = filtered.filter((o) =>
                o.clientName?.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter((o) => o.status === statusFilter);
        }

        // 🔹 Ordenação com prioridade
        filtered = filtered.sort((a, b) => {
            const priorityA = getPriorityLevel(a);
            const priorityB = getPriorityLevel(b);

            if (priorityA !== priorityB) return priorityB - priorityA; // maior prioridade primeiro

            // mesma prioridade → ordenar por data de entrega
            if (a.target_date && b.target_date) {
                return new Date(a.target_date) - new Date(b.target_date);
            }

            // fallback → data de chegada
            return new Date(a.order_date) - new Date(b.order_date);
        });

        setOrders(filtered);
    }, [searchEmail, searchName, statusFilter, allOrders]);

    const openEditModal = (order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setSelectedOrder(null);
        setIsEditModalOpen(false);
    };

    const claimOrder = async (order) => {
        try {
            const response = await fetch(`${API_URL}/order/${order.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    sellerId: currentUser.id,
                    sellerName: currentUser.name
                })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Não foi possível reivindicar o pedido.");
            }
            toast.success(`Pedido #${order.id.substring(0, 8)} reivindicado!`);
            fetchOrders();
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
                body: JSON.stringify(updatedData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Falha ao atualizar pedido.");

            toast.success("Pedido atualizado com sucesso!");
            closeEditModal();
            fetchOrders();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleCancelOrder = (orderId) => {
        openConfirmModal("Cancelar Pedido", "Tem certeza que deseja CANCELAR este pedido?", async () => {
            try {
                const response = await fetch(`${API_URL}/order/cancel/${orderId}`, {
                    method: "PUT",
                    credentials: "include"
                });

                if (response.status === 204 || response.ok) {
                    toast.success("Pedido cancelado com sucesso!");
                    fetchOrders();
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
        openConfirmModal(
            "Excluir Pedido",
            "Atenção! Esta ação é irreversível. Deseja realmente EXCLUIR este pedido?",
            async () => {
                try {
                    const response = await fetch(`${API_URL}/order/${orderId}`, {
                        method: "DELETE",
                        credentials: "include"
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message || "Falha ao excluir pedido.");

                    toast.success(result.message);
                    fetchOrders();
                } catch (err) {
                    toast.error(err.message);
                }
            }
        );
    };

    const clearFilters = () => {
        setSearchEmail("");
        setSearchName("");
        setStatusFilter("");
    };

    if (!currentUser) {
        return <div className="loading">Carregando informações do usuário...</div>;
    }

    return (
        <>
            <ToastContainer theme="dark" position="bottom-right" />
            <div className="orders-container">
                <header className="header">
                    <h1>Painel de Pedidos</h1>
                </header>

                {currentUser && (
                    <div className="search-bar">
                        <input
                            type="email"
                            placeholder="Pesquisar por e-mail do cliente..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome do cliente..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos os status</option>
                            <option value="PENDING">Pendente</option>
                            <option value="APPROVED">Aprovado</option>
                            <option value="DOING">Processando</option>
                            <option value="CANCELLED">Cancelado</option>
                        </select>
                        <button onClick={clearFilters} className="btn btn-secondary">
                            Limpar Filtros
                        </button>
                    </div>
                )}

                {loading && <div className="loading">Carregando pedidos...</div>}
                {error && <div className="error">{error}</div>}

                {!loading && !error && (
                    <>
                        {orders.length > 0 ? (
                            <div className="orders-grid">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className={`order-card ${
                                            getPriorityLevel(order) === 2
                                                ? "priority-red"
                                                : getPriorityLevel(order) === 1
                                                ? "priority-orange"
                                                : ""
                                        }`}
                                    >
                                        <div className="card-header">
                                            <div>
                                                <p className="order-id">
                                                    #{order.id.substring(0, 18)}...
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(order.id);
                                                            toast.success("ID copiado para a área de transferência!");
                                                        }}
                                                        className="btn btn-small btn-copy"
                                                        title="Copiar ID"
                                                        style={{
                                                            marginLeft: "8px",
                                                            padding: "2px 6px",
                                                            fontSize: "0.8rem",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        <FaCopy />
                                                    </button>
                                                </p>
                                                <h3>Cliente: {order.clientName}</h3>
                                            </div>
                                            <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="info-group">
                                            <p>
                                                <strong>Data do Pedido:</strong>{" "}
                                                <span>{formatDate(order.order_date)}</span>
                                            </p>
                                            <p>
                                                <strong>Data de Entrega:</strong>{" "}
                                                <span>{formatDate(order.target_date)}</span>
                                            </p>
                                            <p>
                                                <strong>Vendedor:</strong>{" "}
                                                <span>{order.sellerName || "Não atribuído"}</span>
                                            </p>
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
                                            {!currentUser.isAdmin && !order.sellerId && (
                                                <button
                                                    onClick={() => claimOrder(order)}
                                                    className="btn btn-green"
                                                >
                                                    Reivindicar Pedido
                                                </button>
                                            )}

                                            {(currentUser.isAdmin || order.sellerId === currentUser.id) &&
                                                order.status !== "CANCELLED" && (
                                                    <>
                                                        <button
                                                            onClick={() => openEditModal(order)}
                                                            className="btn btn-blue"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            className="btn btn-orange"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}

                                            {currentUser.isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="btn btn-red"
                                                >
                                                    Excluir
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-orders-found">Nenhum pedido encontrado.</div>
                        )}
                    </>
                )}
            </div>

            {isEditModalOpen && selectedOrder && (
                <EditOrderModal order={selectedOrder} onClose={closeEditModal} onSave={handleUpdateOrder} />
            )}
            <Modal
                isOpen={isConfirmModalOpen}
                title={modalTitle}
                onResult={(confirmed) => {
                    setIsConfirmModalOpen(false);
                    if (confirmed && confirmAction) {
                        confirmAction();
                    }
                }}
            >
                <p>{modalMessage}</p>
            </Modal>
        </>
    );
}
