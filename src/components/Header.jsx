import React from "react";
import logo from "../assets/logo_clisare_loca.png";

export default function Header({ navigate }) {
  return (
    <header>
      <img src={logo} alt="Clisare Logo" className="logo" />
      <nav>
        <button onClick={() => navigate("home")}>Home</button>
        <button onClick={() => navigate("empresa")}>Empresa</button>
        <button onClick={() => navigate("catalogo")}>Catálogo</button>
        <button onClick={() => navigate("contato")}>Contato</button>
      </nav>
      <button onClick={() => navigate("login")} className="login-btn">Login</button>
    </header>

  );
}
