// src/components/Categorias.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

export default function Categorias() {
  const API_URL = import.meta.env.VITE_API_URL_V1;
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/category/all`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error("Erro ao carregar categorias", err);
      }
    };

    fetchCategories();
  }, [API_URL]);

  // total de páginas
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // categorias da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleClick = (cat) => {
    navigate(`/catalogo?category=${encodeURIComponent(cat.name)}`);
  };

  return (
    <section className="categorias">
      <h3 className="section-title">Categorias</h3>

      <div className="categories-grid">
        {currentCategories.map((cat) => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => handleClick(cat)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={cat.image || "https://picsum.photos/200/150?random"}
              alt={cat.name}
            />
            <h4>{cat.name}</h4>
          </div>
        ))}
      </div>

      {/* PAGINAÇÃO */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </section>
  );
}
