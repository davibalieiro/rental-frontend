import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaExternalLinkAlt, FaUsers } from "react-icons/fa";
import "./Favoritos.css";

export default function Favorites({ userId }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchFavorites() {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
        credentials: "include"
      });
      const json = await res.json();
      setFavorites(json.data || []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId) {
    if (!window.confirm("Tem certeza que deseja remover este produto dos favoritos?")) return;
    try {
      await fetch(`http://localhost:3000/api/favorites/${userId}/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchFavorites();
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  }

  async function handleClearAll() {
    if (!window.confirm("Deseja remover todos os produtos dos favoritos?")) return;
    try {
      for (const fav of favorites) {
        await fetch(`http://localhost:3000/api/favorites/${userId}/${fav.product.id}`, {
          method: "DELETE",
          credentials: "include",
        });
      }
      fetchFavorites();
    } catch (err) {
      console.error("Erro ao limpar favoritos:", err);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return <p className="loading">Carregando favoritos...</p>;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>💖 Meus Favoritos</h2>
        {favorites.length > 0 && (
          <button className="btn-clear" onClick={handleClearAll}>
            Remover Todos
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="empty-message">Você ainda não tem produtos favoritados.</p>
      ) : (
        <div className="favorites-cards">
          {favorites.map((f) => (
            <div key={f.product.id} className="favorite-card">
              <img
                src={`http://localhost:3000/api/product/${f.product.id}/image`}
                alt={f.product.name}
                className="product-image"
                onError={(e) => e.target.src = "https://via.placeholder.com/200"}
              />
              <h3>{f.product.name}</h3>
              <p className="short-description">
                {f.product.short_description || "Sem descrição disponível."}
              </p>
              
              {f.product.price && (
                <p className="price">R$ {f.product.price.toFixed(2)}</p>
              )}

              {f.product.favoritedCount !== undefined && (
                <p className="fav-count">
                  <FaUsers /> {f.product.favoritedCount} pessoas favoritaram
                </p>
              )}

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
