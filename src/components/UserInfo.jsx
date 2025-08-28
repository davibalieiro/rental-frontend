import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaIdBadge, FaUserShield, FaUserAlt } from "react-icons/fa";
import "../index.css";

export default function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Não autenticado");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return null;

  return (
    <div className="user-info">
      <h3 className="user-title">
        <FaUser /> Bem-vindo, <strong>{user.name}</strong> 
      </h3>
      <ul className="user-details">
        <li><FaEnvelope /> {user.email}</li>
        <li>
          {user.is_admin ? (
            <span className="admin"><FaUserShield /> Administrador </span>
          ) : (
            <span className="common"><FaUserAlt /> Usuário comum</span>
          )}
        </li>
      </ul>
    </div>
  );
}
