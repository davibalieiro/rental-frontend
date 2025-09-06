import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PerfilInfo from "./PerfilInfo";
import MinhasReservas from "./MinhasReservas";
import Favoritos from "./Favoritos";
import Config from "./Config";
import MeusCupons from "./MeusCupons"; // 🔹 Novo componente
import { useFavorites } from "../../hooks/useFavorites";
import { useCupons } from "../../hooks/useCupons"; // 🔹 Novo hook
import "./css/Perfil.css";

export default function Perfil() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const [reservas, setReservas] = useState([]);

  // Hook de favoritos
  const { favorites, loadingFavs, toggleFavorite, fetchFavorites } = useFavorites(user?.id);

  // Hook de cupons
  const { cupons, loadingCupons, usarCupom } = useCupons(
    user
  );

  useEffect(() => {
    if (!loading && !user) navigate("/login");

    // Reservas simuladas
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
        <div className="perfil-user-info">
          <h2>{user?.name || "Usuário"}</h2>
        </div>

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
            className={activeTab === "cupons" ? "active" : ""}
            onClick={() => setActiveTab("cupons")}
          >
            Meus Cupons
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
        {activeTab === "perfil" && <PerfilInfo user={user} favorites={favorites} />}
        {activeTab === "reservas" && <MinhasReservas reservas={reservas} />}
        {activeTab === "favoritos" && (
          <>
            {loadingFavs ? (
              <p>Carregando favoritos...</p>
            ) : (
              <Favoritos
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                fetchFavorites={fetchFavorites}
              />
            )}
          </>
        )}
        {activeTab === "cupons" && (
          <>
            {loadingCupons ? (
              <p>Carregando cupons...</p>
            ) : (
              <MeusCupons cupons={cupons} usarCupom={usarCupom} />
            )}
          </>
        )}
        {activeTab === "config" && <Config />}
      </div>
    </div>
  );
}
