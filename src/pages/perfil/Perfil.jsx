import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PerfilInfo from "./PerfilInfo";
import MinhasReservas from "./MinhasReservas";
import Favoritos from "./Favoritos";
import Config from "./Config";
import "./Perfil.css";

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const [favorites, setFavorites] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");

    // Carrega favoritos
    const savedFav = JSON.parse(localStorage.getItem("wishlist")) || [];
    setFavorites(savedFav);

    // Simula reservas
    setReservas([
      {
        id: 1,
        produto: "Cadeira Gamer",
        status: "Confirmada",
        data: "2025-08-31",
        slug: "cadeira-gamer",
      },
      {
        id: 2,
        produto: "Mesa de Escritório",
        status: "Pendente",
        data: "2025-09-03",
        slug: "mesa-escritorio",
      },
    ]);
  }, [loading, user, navigate]);

  return (
    <div className="perfil-container">
      {/* Sidebar */}
      <div className="perfil-sidebar">
        <div className="perfil-avatar">
          <img src="/assets/avatar_placeholder.png" alt="Avatar" />
        </div>
        <h2>{user?.name || "Usuário"}</h2>

        <div className="perfil-tabs">
          <button
            className={activeTab === "perfil" ? "active" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </button>
          <button
            className={activeTab === "reservas" ? "active" : ""}
            onClick={() => setActiveTab("reservas")}
          >
            Minhas Reservas
          </button>
          <button
            className={activeTab === "favoritos" ? "active" : ""}
            onClick={() => setActiveTab("favoritos")}
          >
            Favoritos
          </button>
          <button
            className={activeTab === "config" ? "active" : ""}
            onClick={() => setActiveTab("config")}
          >
            Configurações
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="perfil-content">
        {activeTab === "perfil" && <PerfilInfo user={user} />}
        {activeTab === "reservas" && <MinhasReservas reservas={reservas} />}
        {activeTab === "favoritos" && <Favoritos favorites={favorites} />}
        {activeTab === "config" && <Config />}
      </div>
    </div>
  );
}
