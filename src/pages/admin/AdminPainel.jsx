// src/components/admin/AdminPanel.jsx
import React, { useState } from "react";
import Products from "./Products";
import Categories from "./Categories";
import Materials from "./Materias";
import "../css/Admin.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Produtos
          </button>
          <button
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            Categorias
          </button>
          <button
            className={activeTab === "materials" ? "active" : ""}
            onClick={() => setActiveTab("materials")}
          >
            Materiais
          </button>
        </nav>
      </aside>

      {/* Conteúdo */}
      <main className="admin-content">
        <h1>Painel Administrativo</h1>
        {activeTab === "products" && <Products />}
        {activeTab === "categories" && <Categories />}
        {activeTab === "materials" && <Materials />}
      </main>
    </div>
  );
}
