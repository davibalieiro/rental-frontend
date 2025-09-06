import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt, FaTimesCircle } from "react-icons/fa";
import "./css/MinhasReservas.css";

export default function MinhasReservas({ reservas = [] }) {
  const navigate = useNavigate();

  function formatarData(data) {
    try {
      return new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return data;
    }
  }

  return (
    <div className="reservas-page">
      <h3>📅 Minhas Reservas</h3>

      {reservas.length === 0 ? (
        <p className="empty-message">Você ainda não fez nenhuma reserva.</p>
      ) : (
        <div className="reservas-cards">
          {reservas.map((r) => (
            <div className="reserva-card" key={r.id}>
              <div className="reserva-image">
                {r.product?.id ? (
                  <img
                    src={`http://localhost:3000/api/product/${r.product.id}/image`}
                    alt={r.product.name}
                  />
                ) : (
                  <div className="placeholder">📦</div>
                )}
              </div>

              <div className="reserva-info">
                <h4>{r.product?.name || r.produto}</h4>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${r.status?.toLowerCase()}`}>
                    {r.status}
                  </span>
                </p>
                <p>
                  <strong>Data:</strong> {formatarData(r.data)}
                </p>
              </div>

              <div className="reserva-actions">
                <button
                  className="btn-details"
                  onClick={() => navigate(`/produto/${r.slug}`)}
                >
                  <FaExternalLinkAlt /> Ver Detalhes
                </button>
                {r.status !== "Cancelada" && (
                  <button className="btn-cancel">
                    <FaTimesCircle /> Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
