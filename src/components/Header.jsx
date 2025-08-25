import React from "react";
import logo from "../assets/logo_clisare_loca.png";

export default function Header({ navigate }) {
  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Clisare Logo" className="h-12" />
      </div>

      <nav className="hidden md:flex space-x-6">
        <button onClick={() => navigate("home")} className="text-gray-700 hover:text-[#FF4500] font-semibold">
          Home
        </button>
        <button onClick={() => navigate("empresa")} className="text-gray-700 hover:text-[#FF4500]">
          Empresa
        </button>
        <button onClick={() => navigate("catalogo")} className="text-gray-700 hover:text-[#FF4500]">
          Catálogo
        </button>
        <button onClick={() => navigate("contato")} className="text-gray-700 hover:text-[#FF4500]">
          Contato
        </button>
      </nav>

      <button
        onClick={() => navigate("login")}
        className="px-5 py-2 bg-[#32CD32] text-white font-semibold rounded-lg hover:bg-green-600 transition"
      >
        Login
      </button>
    </header>
  );
}
