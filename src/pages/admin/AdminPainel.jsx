// src/components/admin/AdminPanel.jsx
import React, { useState } from "react";
import Products from "./Products";
import Categories from "./Categories";
import Materials from "./Materials";
import "./Admin.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <section className="admin-panel">
      <h1>Painel Administrativo</h1>

      <nav className="admin-nav">
        <button onClick={() => setActiveTab("products")}>Produtos</button>
        <button onClick={() => setActiveTab("categories")}>Categorias</button>
        <button onClick={() => setActiveTab("materials")}>Materiais</button>
      </nav>

      <div className="admin-content">
        {activeTab === "products" && <Products />}
        {activeTab === "categories" && <Categories />}
        {activeTab === "materials" && <Materials />}
      </div>
    </section>
  );
}
