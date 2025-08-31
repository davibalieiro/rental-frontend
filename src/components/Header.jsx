import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo_clisare_loca.png";
import { FaUserCircle } from "react-icons/fa"; // ícone perfil

export default function Header() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.reload();
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login"); // se não estiver logado -> login
    } else {
      navigate("/perfil"); // se estiver logado -> perfil
    }
  };

  return (
    <header>
      <img src={logo} alt="Clisare Logo" className="logo" />

      <nav>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/empresa")}>Empresa</button>
        <button onClick={() => navigate("/catalogo")}>Catálogo</button>
        <button onClick={() => navigate("/contato")}>Contato</button>
        <button onClick={() => navigate("/cartpage")}>Carrinho</button>

        {/* Painel Admin só para admin */}
        {user?.is_admin && (
          <button onClick={() => navigate("/admin")}>Painel Admin</button>
        )}

        {/* Ícone perfil -> só para usuários comuns */}
        {user && !user.is_admin && (
          <button onClick={handleProfileClick} className="profile-btn">
            <FaUserCircle size={24} />
          </button>
        )}

        {/* Login / Logout */}
        {!user ? (
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        ) : (
          <button onClick={handleLogout} className="login-btn">
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}
