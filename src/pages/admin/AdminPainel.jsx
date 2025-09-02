import React, { useState, useEffect } from "react";
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
  FaHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Products from "./Products";
import Categories from "./Categories";
import Materials from "./Materials";
import Users from "./Users";
import NotFound from "../NotFound";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Admin.css";
import { useAuth } from "~/hooks/useAuth";

const COLORS = ["#32cd32", "#ff4500", "#ffd700", "#006400", "#ff8c00"];

export default function AdminPainel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const [usersData, setUsersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, favRes] = await Promise.all([
          fetch("http://localhost:3000/api/admin/user/all", { credentials: "include" }),
          fetch("http://localhost:3000/api/admin/order/all", { credentials: "include" }),
          fetch("http://localhost:3000/api/admin/products/stats", { credentials: "include" }),
        ]);

        const usersJson = await usersRes.json();
        const ordersJson = await ordersRes.json();
        const favJson = await favRes.json();

        const users = usersJson.map((u) => ({
          name: u.name,
          ativo: u.is_active ? 1 : 0,
          inativo: u.is_active ? 0 : 1,
        }));
        setUsersData(users);

        const orders = [
          { name: "Concluídos", value: ordersJson.data.filter((o) => o.status === "concluido").length },
          { name: "Pendentes", value: ordersJson.data.filter((o) => o.status === "pendente").length },
          { name: "Cancelados", value: ordersJson.data.filter((o) => o.status === "cancelado").length },
        ];
        setOrdersData(orders);

        const fav = [
          { name: "Mais Favoritados", value: favJson.data.topFavorites || 0 },
          { name: "Menos Favoritados", value: favJson.data.lowFavorites || 0 },
        ];
        setFavoritesData(fav);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };
    fetchData();
  }, []);

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

  const renderLineChart = (title, data) => (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip 
            contentStyle={{ backgroundColor: darkMode ? "#2b2b2b" : "#fff", borderRadius: "8px" }}
          />
          <Line type="monotone" dataKey="ativo" stroke="#32cd32" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="inativo" stroke="#ff4500" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieChart = (title, data) => (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            cornerRadius={10}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={darkMode ? "#2b2b2b" : "#fff"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: darkMode ? "#2b2b2b" : "#fff", borderRadius: "8px" }}
          />
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
      return <Users />;
      default:
        return (
          <div className="dashboard">
            <h2>Visão Geral</h2>

            <div className="cards">
              <div className="card"><FaBox /><h3>Produtos</h3></div>
              <div className="card"><FaList /><h3>Categorias</h3></div>
              <div className="card"><FaCubes /><h3>Materiais</h3></div>
              <div className="card"><FaUsers /><h3>Usuários</h3></div>
              <div className="card"><FaHeart /><h3>Favoritos</h3></div>
            </div>

            <div className="charts">
              {renderLineChart("Usuários Ativos/Inativos", usersData)}
              {renderPieChart("Pedidos", ordersData)}
              {renderPieChart("Favoritos", favoritesData)}
            </div>
          </div>
        );
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!user || !user.is_admin) return <NotFound />;

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
