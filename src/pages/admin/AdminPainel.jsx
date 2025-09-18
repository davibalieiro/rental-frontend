import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaList,
  FaCubes,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaCalculator,
  FaShoppingBag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Products from "./Products";
import Categories from "./Categories";
import Materials from "./Materials";
import Users from "./Users";
import Coupons from "./Coupons";
import Orders from "./Orders";
import NotFound from "~/pages/NotFound";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useUserContext } from "~/context/UserContext";
import { useTheme } from "~/context/ThemeContext";
import "./css/Admin.css";

export default function AdminPainel() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(true);
  const [status, setStatus] = useState("loading");

  const { darkMode } = useTheme();
  const { user, isReady } = useUserContext();
  const navigate = useNavigate();

  const [cardStats, setCardStats] = useState({
    products: 0,
    categories: 0,
    materials: 0,
    users: 0,
  });

  const [usersData, setUsersData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);

  // --- FETCH DASHBOARD STATS ---
  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      try {
        const res = await fetch(`${API_URL}/stats`, { credentials: "include" });
        const json = await res.json();
        const data = json?.data;

        if (!data) throw new Error("Dados não encontrados");

        setCardStats({
          products: data.totalProducts || 0,
          categories: data.categories?.length || 0,
          materials: data.materials?.length || 0,
          users: data.totalUsers || 0,
        });

        setUsersData([{ name: "Usuários", Ativos: data.users?.active || 0, Inativos: data.users?.inactive || 0 }]);
        setCategoriesData(data.categories?.map((c) => ({ name: c.name, value: c.totalProducts || 0 })) || []);
        setMaterialsData(data.materials?.map((m) => ({ name: m.name, value: m.totalProducts || 0 })) || []);
        setFavoritesData(data.favorites?.map((f) => ({ name: f.name, value: f.totalFavorites || 0 })) || []);

        setStatus("success");
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setStatus("error");
      }
    };

    fetchData();
  }, []);

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Erro no logout", err);
    } finally {
      navigate("/login");
    }
  };

  // --- GRÁFICOS ---
  const renderPieChart = (title, data) => {
    const COLORS = ["#32cd32", "#ff4500"];
    const pieData = [
      { name: "Ativos", value: data[0]?.Ativos || 0 },
      { name: "Inativos", value: data[0]?.Inativos || 0 },
    ];

    return (
      <div className={`chart-card ${darkMode ? "dark-mode" : ""}`}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                color: darkMode ? "#e0e0e0" : "#333",
                borderRadius: 6,
                fontSize: 12,
                padding: 8,
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderHorizontalBarChart = (title, data, color = "#32cd32") => {
    const chartHeight = Math.min(data.length * 35 + 50, 700);
    const formattedData = data.map((d) => ({
      ...d,
      name: d.name.length > 25 ? d.name.slice(0, 22) + "..." : d.name,
    }));

    return (
      <div className={`chart-card ${darkMode ? "dark-mode" : ""}`} style={{ overflowY: data.length > 20 ? "auto" : "visible" }}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart layout="vertical" data={formattedData} margin={{ top: 5, right: 20, left: 150, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#e0e0e0"} />
            <XAxis type="number" stroke={darkMode ? "#e0e0e0" : "#8884d8"} />
            <YAxis type="category" dataKey="name" stroke={darkMode ? "#e0e0e0" : "#8884d8"} width={150} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#2d2d2d" : "#fff",
                color: darkMode ? "#e0e0e0" : "#333",
                borderRadius: 6,
                fontSize: 12,
                padding: 8,
              }}
            />
            <Bar dataKey="value" fill={color} radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
    if (status === "loading") return <p>Carregando dados do painel...</p>;
    if (status === "error") return <p>Erro ao carregar dados. Tente novamente.</p>;

    switch (activeTab) {
      case "products": return <Products />;
      case "categories": return <Categories />;
      case "materials": return <Materials />;
      case "users": return <Users />;
      case "coupons": return <Coupons />;
      case "orders": return <Orders currentUser={user} />;
      default:
        return (
          <div className="dashboard">
            <h2>Visão Geral</h2>
            <div className="cards">
              <div className={`card ${darkMode ? "dark-mode" : ""}`}>
                <FaBox />
                <div>
                  <h3>{cardStats.products}</h3>
                  <p>Produtos</p>
                </div>
              </div>
              <div className={`card ${darkMode ? "dark-mode" : ""}`}>
                <FaList />
                <div>
                  <h3>{cardStats.categories}</h3>
                  <p>Categorias</p>
                </div>
              </div>
              <div className={`card ${darkMode ? "dark-mode" : ""}`}>
                <FaCubes />
                <div>
                  <h3>{cardStats.materials}</h3>
                  <p>Materiais</p>
                </div>
              </div>
              <div className={`card ${darkMode ? "dark-mode" : ""}`}>
                <FaUsers />
                <div>
                  <h3>{cardStats.users}</h3>
                  <p>Usuários</p>
                </div>
              </div>
            </div>
            <div className="charts">
              {renderPieChart("Usuários Ativos x Inativos", usersData)}
              {renderHorizontalBarChart("Produtos por Categoria", categoriesData, "#1e90ff")}
              {renderHorizontalBarChart("Produtos por Material", materialsData, "#ff8c00")}
              {renderHorizontalBarChart("Favoritos por Produto", favoritesData, "#6a5acd")}
            </div>
          </div>
        );
    }
  };

  if (isReady) return <p>Carregando autenticação...</p>;
  if (!user || !user.is_admin) return <NotFound />;

  return (
    <div className={`admin-layout ${darkMode ? "dark-mode" : ""}`}>
      <aside className={`admin-sidebar ${menuOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>{menuOpen ? "Painel" : ""}</h2>
          <button className="toggle-menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
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
          <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>
            <FaShoppingBag /> {menuOpen && "Pedidos"}
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <FaUsers /> {menuOpen && "Usuários"}
          </button>
          <button className={activeTab === "coupons" ? "active" : ""} onClick={() => setActiveTab("coupons")}>
            <FaCalculator /> {menuOpen && "Cupons"}
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout" onClick={handleLogout}>Sair</button>
        </div>
      </aside>
      <main className="admin-content">{renderContent()}</main>
    </div>
  );
}
