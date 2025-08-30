import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // seu hook
import logo from "../assets/logo_clisare_loca.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null; // evita mostrar nada até o fetch terminar

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.reload(); // força atualização para limpar estado
    } catch (err) {
      console.error("Erro ao sair:", err);
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

        {/* Carrinho sempre */}
        <button onClick={() => navigate("/cartpage")}>Carrinho</button>

        {/* Painel Admin só aparece se o usuário logado for admin */}
        {user?.is_admin && (
          <button onClick={() => navigate("/admin")}>Painel Admin</button>
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
