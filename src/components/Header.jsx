import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext"; // Importar o contexto
import logo from "../assets/logo_clisare_loca.png";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme(); // Usar o contexto

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
      navigate("/login");
    } else {
      navigate("/perfil");
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

        {user?.is_admin && (
          <button onClick={() => navigate("/admin")}>Painel Admin</button>
        )}

        {user && !user.is_admin && (
          <button onClick={handleProfileClick} className="profile-btn">
            Minha Conta
          </button>
        )}

        {!user ? (
          <button onClick={() => navigate("/login")} className="login-btn">
            Login
          </button>
        ) : (
          <button onClick={handleLogout} className="login-btn">
            Sair
          </button>
        )}

        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </nav>
    </header>
  );
}