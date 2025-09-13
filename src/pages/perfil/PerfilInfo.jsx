import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import "./css/PerfilInfo.css";

export default function PerfilInfo({ user, favorites = [] }) {
  if (!user) {
    return (
      <div className="perfil-info-card">
        <h3>Informações do Usuário</h3>
        <p>Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="perfil-info-card">
      <h2 className="perfil-title">Informações do Usuário</h2>

      <div className="perfil-info">
        <div className="perfil-row">
          <FaUser className="icon" />
          <span>
            <strong>Nome:</strong> {user.name}
          </span>
        </div>

        <div className="perfil-row">
          <FaEnvelope className="icon" />
          <span>
            <strong>Email:</strong> {user.email}
          </span>
        </div>

        <div className="perfil-row">
          <FaPhone className="icon" />
          <span>
            <strong>Telefone:</strong> {user.phone || "Não informado"}
          </span>
        </div>

        <div className="perfil-row">
          <span>
            <strong>Status:</strong>{" "}
            {user.is_active ? (
              <span className="status-badge active">
                <FaCheckCircle /> Ativo
              </span>
            ) : (
              <span className="status-badge inactive">
                <FaTimesCircle /> Inativo
              </span>
            )}
          </span>
        </div>

        <div className="perfil-row">
          <FaCalendarAlt className="icon" />
          <span>
            <strong>Data de Cadastro:</strong>{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Não disponível"}
          </span>
        </div>

        <div className="perfil-row">
          <FaStar className="icon" />
          <span>
            <strong>Favoritos Salvos:</strong> {favorites.length}
          </span>
        </div>
      </div>
    </div>
  );
}
