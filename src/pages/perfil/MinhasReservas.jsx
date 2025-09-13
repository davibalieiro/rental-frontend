import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/MinhasReservas.css";
import Modal from "~/components/Modal";
import { useUserContext } from "~/context/UserContext";

const API_URL = import.meta.env.VITE_API_URL_V1;

function EditReservaModal({ reserva, onClose, onSave }) {
  const [targetDate, setTargetDate] = useState(
    reserva.target_date ? new Date(reserva.target_date).toISOString().split("T")[0] : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {};
    if (new Date(targetDate).getTime() !== new Date(reserva.target_date).getTime()) {
      updatedData.target_date = new Date(targetDate).toISOString();
    }

    if (Object.keys(updatedData).length > 0) {
      onSave(reserva.id, updatedData);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Reserva #{reserva.id}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="targetDate">Nova Data de Entrega</label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-green">Salvar Alterações</button>
            <button type="button" onClick={onClose} className="btn-secondary">Fechar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MinhasReservas() {
  const { user } = useUserContext();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch(`${API_URL}/user/orders/${user.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erro ao buscar reservas.");
        const data = await res.json();
        setReservas(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, [user.id]);

  const openEditModal = (reserva) => {
    setSelectedReserva(reserva);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedReserva(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateReserva = async (reservaId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/order/${reservaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Falha ao atualizar reserva.");

      toast.success("Reserva atualizada com sucesso!");
      closeEditModal();
      setReservas((prev) =>
        prev.map((r) => (r.id === reservaId ? { ...r, ...updatedData } : r))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancelReserva = (reservaId) => {
    setModalTitle("Cancelar Reserva");
    setModalMessage("Tem certeza que deseja CANCELAR esta reserva?");
    setConfirmAction(() => async () => {
      try {
        const response = await fetch(`${API_URL}/order/cancel/${reservaId}`, {
          method: "PUT",
          credentials: "include",
        });

        if (response.ok || response.status === 204) {
          toast.success("Reserva cancelada com sucesso!");
          setReservas((prev) =>
            prev.map((r) => (r.id === reservaId ? { ...r, status: "CANCELLED" } : r))
          );
        } else {
          throw new Error("Falha ao cancelar reserva.");
        }
      } catch (err) {
        toast.error(err.message);
      }
    });
    setIsConfirmModalOpen(true);
  };

  if (loading) return <p className="loading">Carregando reservas...</p>;
  if (error) return <p className="error">{error}</p>;
  if (reservas.length === 0) return <p className="empty">Você não possui reservas.</p>;

  return (
    <div className="minhas-reservas-container">
      <ToastContainer theme="dark" position="bottom-right" />
      <h1 className="title">Minhas Reservas</h1>
      <div className="orders-grid">
        {reservas.map((reserva) => (
          <div key={reserva.id} className="order-card">
            <div className="order-header">
              <h2>Pedido #{reserva.id}</h2>
              <span
                className={`status ${
                  reserva.status === "CANCELLED"
                    ? "cancelled"
                    : reserva.status === "COMPLETED"
                    ? "completed"
                    : "pending"
                }`}
              >
                {reserva.status === "CANCELLED" && <FaTimesCircle />}
                {reserva.status === "COMPLETED" && <FaCheckCircle />}
                {reserva.status !== "CANCELLED" && reserva.status !== "COMPLETED" && <FaRegCalendarAlt />}
                {" "}{reserva.status}
              </span>
            </div>
            <p><FaRegCalendarAlt className="icon" /> <strong>Data do pedido:</strong> {new Date(reserva.order_date).toLocaleDateString()}</p>
            <p><FaRegCalendarAlt className="icon" /> <strong>Entrega:</strong> {new Date(reserva.target_date).toLocaleDateString()}</p>

            <div className="products">
              <h3>Produtos:</h3>
              <ul>
                {reserva.orderProducts.map((op) => (
                  <li key={op.productId}>
                    {op.name} - {op.dimension} - Quantidade: {op.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <div className="actions">
              {reserva.status !== "CANCELLED" && (
                <>
                  <button onClick={() => openEditModal(reserva)} className="btn-blue">Editar</button>
                  <button onClick={() => handleCancelReserva(reserva.id)} className="btn-red">Cancelar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && selectedReserva && (
        <EditReservaModal reserva={selectedReserva} onClose={closeEditModal} onSave={handleUpdateReserva} />
      )}
      <Modal
        isOpen={isConfirmModalOpen}
        title={modalTitle}
        onResult={(confirmed) => {
          setIsConfirmModalOpen(false);
          if (confirmed && confirmAction) confirmAction();
        }}
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}
