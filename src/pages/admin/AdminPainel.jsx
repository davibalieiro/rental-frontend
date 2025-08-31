import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaBox,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "../css/Admin.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminPainel() {
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dados simulados (depois você pode puxar da API)
  const productsData = [
    { name: "Disponíveis", value: 120 },
    { name: "Indisponíveis", value: 30 },
  ];

  const usersData = [
    { name: "Ativos", value: 50 },
    { name: "Inativos", value: 20 },
  ];

  const ordersData = [
    { name: "Concluídos", value: 80 },
    { name: "Pendentes", value: 25 },
    { name: "Cancelados", value: 10 },
  ];

  // Renderiza cada gráfico de pizza
  const renderPieChart = (title, data) => (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard">
            <h2>Dashboard</h2>

            <div className="cards">
              <div className="card">
                <FaBox />
                <h4>Produtos</h4>
                <p>150</p>
              </div>
              <div className="card">
                <FaUsers />
                <h4>Usuários</h4>
                <p>70</p>
              </div>
              <div className="card">
                <FaClipboardList />
                <h4>Pedidos</h4>
                <p>115</p>
              </div>
            </div>

            <div className="charts">
              {renderPieChart("Produtos", productsData)}
              {renderPieChart("Usuários", usersData)}
              {renderPieChart("Pedidos", ordersData)}
            </div>
          </div>
        );

      case "produtos":
        return (
          <div className="page-content">
            <h2>Gerenciar Produtos</h2>
            <p>Aqui você poderá visualizar, adicionar e editar produtos.</p>
          </div>
        );

      case "categorias":
        return (
          <div className="page-content">
            <h2>Categorias</h2>
            <p>Aqui você pode gerenciar as categorias de produtos.</p>
          </div>
        );

      case "materiais":
        return (
          <div className="page-content">
            <h2>Materiais</h2>
            <p>Aqui você pode gerenciar os materiais dos produtos.</p>
          </div>
        );

      case "usuarios":
        return (
          <div className="page-content">
            <h2>Usuários</h2>
            <p>Lista e gerenciamento de usuários cadastrados.</p>
          </div>
        );

      default:
        return (
          <div className="page-content">
            <h2>Bem-vindo ao Painel Administrativo</h2>
          </div>
        );
    }
  };

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div>
          <div className="sidebar-header">
            {!collapsed && <h2>Admin</h2>}
            <button
              className="toggle-menu"
              onClick={() => setCollapsed(!collapsed)}
            >
              <FaBars />
            </button>
          </div>

          <nav>
            <button
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 {!collapsed && "Dashboard"}
            </button>
            <button
              className={activeTab === "produtos" ? "active" : ""}
              onClick={() => setActiveTab("produtos")}
            >
              📦 {!collapsed && "Produtos"}
            </button>
            <button
              className={activeTab === "categorias" ? "active" : ""}
              onClick={() => setActiveTab("categorias")}
            >
              🗂️ {!collapsed && "Categorias"}
            </button>
            <button
              className={activeTab === "materiais" ? "active" : ""}
              onClick={() => setActiveTab("materiais")}
            >
              🛠️ {!collapsed && "Materiais"}
            </button>
            <button
              className={activeTab === "usuarios" ? "active" : ""}
              onClick={() => setActiveTab("usuarios")}
            >
              👤 {!collapsed && "Usuários"}
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
            {!collapsed && (darkMode ? "Modo Claro" : "Modo Escuro")}
          </button>
          <button>
            <FaSignOutAlt />
            {!collapsed && "Sair"}
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <main className="admin-content">{renderContent()}</main>
    </div>
  );
}
