import React, { useState } from "react";
import {
  FaBox,
  FaList,
  FaCubes,
  FaUsers,
  FaChartBar,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaBars
} from "react-icons/fa";
import Products from "./Products";
import Categories from "./Categories";
import Materials from "./Materials";
import "../css/Admin.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <Products />;
      case "categories":
        return <Categories />;
      case "materials":
        return <Materials />;
      case "users":
        return (
          <div className="page-content">
            <h2>Gerenciar Usuários</h2>
            <p>Função futura: lista, edição e exclusão de usuários.</p>
          </div>
        );
      default:
        return (
          <div className="dashboard">
            <h2>Visão Geral</h2>
            <div className="cards">
              <div className="card"><FaBox /><h3>120 Produtos</h3></div>
              <div className="card"><FaList /><h3>15 Categorias</h3></div>
              <div className="card"><FaCubes /><h3>30 Materiais</h3></div>
              <div className="card"><FaUsers /><h3>50 Usuários</h3></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>{menuOpen ? "Painel" : " "}</h2>
          <button
            className="toggle-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars />
          </button>
        </div>

        <nav>
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartBar /> {menuOpen && "Dashboard"}
          </button>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            <FaBox /> {menuOpen && "Produtos"}
          </button>
          <button
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            <FaList /> {menuOpen && "Categorias"}
          </button>
          <button
            className={activeTab === "materials" ? "active" : ""}
            onClick={() => setActiveTab("materials")}
          >
            <FaCubes /> {menuOpen && "Materiais"}
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers /> {menuOpen && "Usuários"}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />} {menuOpen && (darkMode ? "Claro" : "Escuro")}
          </button>
          <button className="logout">
            <FaSignOutAlt /> {menuOpen && "Sair"}
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}
