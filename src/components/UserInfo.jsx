import React from "react";
import { FaUser, FaEnvelope, FaUserShield, FaUserAlt } from "react-icons/fa";
import "../index.css";
import { useAuth } from "~/hooks/useAuth";

export default function UserInfo() {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você não está autenticado</p>;

  return (
    <div className="user-info">
      <h3 className="user-title">
        <FaUser /> Bem-vindo, <strong>{user.name}</strong>
      </h3>
      <ul className="user-details">
        <li><FaEnvelope /> {user.email}</li>
        <li>
          {user.is_admin ? (
            <span className="role admin"><FaUserShield /> Administrador</span>
          ) : (
            <span className="role common"><FaUserAlt /> Usuário comum</span>
          )}
        </li>
      </ul>
    </div>
  );
}
