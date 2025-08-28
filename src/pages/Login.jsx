// src/components/admin/AdminPanel.jsx
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
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Products from "./admin/Products";
import Categories from "./admin/Categories";
import Materials from "./admin/Materials";
import "./css/Admin.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dados fake para gráficos
  const userAccess = [
    { day: "Seg", users: 120 },
    { day: "Ter", users: 200 },
    { day: "Qua", users: 150 },
    { day: "Qui", users: 300 },
    { day: "Sex", users: 250 },
    { day: "Sáb", users: 400 },
    { day: "Dom", users: 280 },
  ];

  const engagement = [
    { name: "Ativos", value: 400 },
    { name: "Inativos", value: 200 },
  ];

  const COLORS = ["#8884d8", "#82ca9d"];

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
          <div>
            <h2>Gerenciar Usuários</h2>
            <p>Função futura: lista, edição e exclusão de usuários.</p>
          </div>
        );
      default:
        return (
          <div className="dashboard">
            <h2>Visão Geral</h2>
            {/* Cards */}
            <div className="cards">
              <div className="card"><FaBox /><h3>120 Produtos</h3></div>
              <div className="card"><FaList /><h3>15 Categorias</h3></div>
              <div className="card"><FaCubes /><h3>30 Materiais</h3></div>
              <div className="card"><FaUsers /><h3>50 Usuários</h3></div>
            </div>

            {/* Gráficos */}
            <div className="charts">
              <div className="chart-card">
                <h3>Acesso de Usuários (últimos 7 dias)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={userAccess}>
                    <XAxis dataKey="day" stroke="#ccc" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Engajamento</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={engagement}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {engagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>{sidebarOpen ? "Painel" : " "}</h2>
          <button className="toggle-menu" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </button>
        </div>
        <nav>
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <FaChartBar /> {sidebarOpen && "Dashboard"}
          </button>
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
            <FaBox /> {sidebarOpen && "Produtos"}
          </button>
          <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>
            <FaList /> {sidebarOpen && "Categorias"}
          </button>
          <button className={activeTab === "materials" ? "active" : ""} onClick={() => setActiveTab("materials")}>
            <FaCubes /> {sidebarOpen && "Materiais"}
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <FaUsers /> {sidebarOpen && "Usuários"}
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />} {sidebarOpen && (darkMode ? "Claro" : "Escuro")}
          </button>
          <button className="logout">
            <FaSignOutAlt /> {sidebarOpen && "Sair"}
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="admin-content">{renderContent()}</main>
    </div>
  );
}
