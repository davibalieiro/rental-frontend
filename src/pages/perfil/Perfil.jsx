import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PerfilInfo from "./PerfilInfo";
import MinhasReservas from "./MinhasReservas";
import Favoritos from "./Favoritos";
import Config from "./Config";
import MeusCupons from "./MeusCupons";
import { useFavoritesContext } from "~/context/FavoritesContext";
import { useCupons } from "../../hooks/useCupons";
import { useUserContext } from "~/context/UserContext";
import "./css/Perfil.css";

export default function Perfil() {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");

  // Hook de favoritos
  const { localFavorites, addOrRemoveFavorite } = useFavoritesContext();

  // Hook de cupons
  const { cupons, loadingCupons, usarCupom } = useCupons(user);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
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
        {activeTab === "perfil" && (
          <PerfilInfo user={user} favorites={localFavorites} />
        )}

        {activeTab === "reservas" && <MinhasReservas />}

        {activeTab === "favoritos" && (
          <Favoritos
            localFavorites={localFavorites}
            addOrRemoveFavorite={addOrRemoveFavorite}
          />
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
