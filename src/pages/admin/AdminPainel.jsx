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
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Products from "./Products";
import Categories from "./Categories";
import Materials from "./Materials";
import NotFound from "../NotFound";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../css/Admin.css";
import { useAuth } from "~/hooks/useAuth";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AdminPainel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Carregando...</p>;
  if (!user || !user.is_admin) return <NotFound />;

  // Dados de exemplo
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erro no logout", err);
    } finally {
      navigate("/login");
    }
  };

  const renderPieChart = (title, data) => (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

            <div className="charts">
              {renderPieChart("Produtos", productsData)}
              {renderPieChart("Usuários", usersData)}
              {renderPieChart("Pedidos", ordersData)}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>
      <aside className={`admin-sidebar ${menuOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>{menuOpen ? "Painel" : ""}</h2>
          <button className="toggle-menu" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars />
          </button>
        </div>

        <nav>
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <FaChartBar /> {menuOpen && "Dashboard"}
          </button>
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
            <FaBox /> {menuOpen && "Produtos"}
          </button>
          <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}>
            <FaList /> {menuOpen && "Categorias"}
          </button>
          <button className={activeTab === "materials" ? "active" : ""} onClick={() => setActiveTab("materials")}>
            <FaCubes /> {menuOpen && "Materiais"}
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <FaUsers /> {menuOpen && "Usuários"}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />} {menuOpen && (darkMode ? "Claro" : "Escuro")}
          </button>
          <button className="logout" onClick={handleLogout}>
            <FaSignOutAlt /> {menuOpen && "Sair"}
          </button>
        </div>
      </aside>

      <main className="admin-content">{renderContent()}</main>
    </div>
  );
}
