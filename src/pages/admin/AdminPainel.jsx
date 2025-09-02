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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Admin.css";
import { useAuth } from "~/hooks/useAuth";

const COLORS = ["#32cd32", "#ff4500"]; // verde e laranja do tema

export default function AdminPainel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);

  const [usersData, setUsersData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);

  const [cardStats, setCardStats] = useState({
    products: 0,
    categories: 0,
    materials: 0,
    users: 0,
  });

  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:3000/api/stats", { credentials: "include" });
        const statsJson = await statsRes.json();
        const data = statsJson?.data;

        // Cards
        setCardStats({
          products: data?.totalProducts || 0,
          categories: data?.categories?.length || 0,
          materials: data?.materials?.length || 0,
          users: data?.totalUsers || 0,
        });

        // Usuários ativos/inativos
        setUsersData([
          { name: "Ativos", value: data?.users?.active || 0 },
          { name: "Inativos", value: data?.users?.inactive || 0 },
        ]);

        // Categorias x produtos
        setCategoriesData(
          data?.categories?.map(c => ({ name: c.name, value: c.totalProducts })) || []
        );

        // Materiais x produtos
        setMaterialsData(
          data?.materials?.map(m => ({ name: m.name, value: m.totalProducts })) || []
        );

        // Favoritos por produto
        setFavoritesData(
          data?.favorites?.map(f => ({ name: f.name, value: f.totalFavorites })) || []
        );
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

  const renderPieChart = (title, data) => (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            cornerRadius={5}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#2b2b2b" : "#fff",
              borderRadius: 6,
              fontSize: 12,
              padding: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderHorizontalBarChart = (title, data) => {
    // altura dinâmica: cada item 35px + padding, máximo 700px
    const chartHeight = Math.min(data.length * 35 + 50, 700);

    // truncar nomes longos
    const formattedData = data.map(d => ({
      ...d,
      name: d.name.length > 25 ? d.name.slice(0, 22) + "..." : d.name,
    }));

    return (
      <div className="chart-card" style={{ overflowY: data.length > 20 ? "auto" : "visible" }}>
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={formattedData}
            margin={{ top: 5, right: 20, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" stroke="#8884d8" />
            <YAxis type="category" dataKey="name" stroke="#8884d8" width={150} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#2b2b2b" : "#fff",
                borderRadius: 6,
                fontSize: 12,
                padding: 8,
              }}
            />
            <Bar dataKey="value" fill="#32cd32" radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

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
              <div className="card"><FaBox /><div><h3>{cardStats.products}</h3><p>Produtos</p></div></div>
              <div className="card"><FaList /><div><h3>{cardStats.categories}</h3><p>Categorias</p></div></div>
              <div className="card"><FaCubes /><div><h3>{cardStats.materials}</h3><p>Materiais</p></div></div>
              <div className="card"><FaUsers /><div><h3>{cardStats.users}</h3><p>Usuários</p></div></div>
            </div>
            <div className="charts">
              {renderPieChart("Usuários Ativos/Inativos", usersData)}
              {renderHorizontalBarChart("Produtos por Categoria", categoriesData)}
              {renderHorizontalBarChart("Produtos por Material", materialsData)}
              {renderHorizontalBarChart("Favoritos por Produto", favoritesData)}
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
          <button className="toggle-menu" onClick={() => setMenuOpen(!menuOpen)}><FaBars /></button>
        </div>
        <nav>
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}><FaChartBar />{menuOpen && "Dashboard"}</button>
          <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}><FaBox />{menuOpen && "Produtos"}</button>
          <button className={activeTab === "categories" ? "active" : ""} onClick={() => setActiveTab("categories")}><FaList />{menuOpen && "Categorias"}</button>
          <button className={activeTab === "materials" ? "active" : ""} onClick={() => setActiveTab("materials")}><FaCubes />{menuOpen && "Materiais"}</button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}><FaUsers />{menuOpen && "Usuários"}</button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <FaSun /> : <FaMoon />}{menuOpen && (darkMode ? "Claro" : "Escuro")}</button>
          <button className="logout" onClick={handleLogout}><FaSignOutAlt />{menuOpen && "Sair"}</button>
        </div>
      </aside>
      <main className="admin-content">{renderContent()}</main>
    </div>
  );
}
