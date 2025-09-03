// src/components/Favorites.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import "./Favoritos.css";

export default function Favorites({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  async function fetchFavorites() {
    try {
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
        credentials: "include"
      });
      const json = await res.json();
      setFavorites(json.data || []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  }

  async function handleRemove(productId) {
    try {
      await fetch("http://localhost:3000/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, productId })
      });
      fetchFavorites();
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h2>💖 Meus Favoritos</h2>

      {favorites.length === 0 ? (
        <p className="empty-message">Você ainda não tem produtos favoritados.</p>
      ) : (
        <div className="favorites-cards">
          {favorites.map((f) => (
            <div key={f.productId} className="favorite-card">
              <img
                src={`http://localhost:3000/api/product/${f.product.id}/image`}
                alt={f.product.name}
                className="product-image"
              />
              <h3>{f.product.name}</h3>
              <p className="short-description">
                {f.product.short_description || "Sem descrição disponível."}
              </p>

              <div className="card-actions">
                <button
                  className="btn-view"
                  onClick={() => navigate(`/produto/${f.product.slug}`)}
                >
                  <FaExternalLinkAlt /> Ver Produto
                </button>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(f.product.id)}
                >
                  <FaTrash /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
