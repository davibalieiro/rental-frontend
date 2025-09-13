import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaExternalLinkAlt, FaUsers } from "react-icons/fa";
import { useFavoritesContext } from "../../context/FavoritesContext";
import "./css/Favoritos.css";

export default function Favorites({ localFavorites, addOrRemoveFavorite }) {
  const API_URL = import.meta.env.VITE_API_URL_V1;

  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const defaultImage = "/placeholder.svg";

  const handleRemove = async (product) => {
    if (!window.confirm("Tem certeza que deseja remover este produto dos favoritos?")) return;
    setProcessing(true);
    await addOrRemoveFavorite(product);
    setProcessing(false);
  };

  const handleClearAll = async () => {
    if (!window.confirm("Deseja remover todos os produtos dos favoritos?")) return;
    setProcessing(true);
    for (const fav of localFavorites) {
      await addOrRemoveFavorite(fav.product);
    }
    setProcessing(false);
  };

  return (
    <div className="favorites-page">
      {/* Cabeçalho */}
      <div className="favorites-header">
        <h2>Meus Favoritos</h2>
        {localFavorites.length > 0 && (
          <button className="btn-clear" onClick={handleClearAll} disabled={processing}>
            Remover Todos
          </button>
        )}
      </div>

      {/* Nenhum favorito */}
      {localFavorites.length === 0 ? (
        <p className="empty-message">Você ainda não tem produtos favoritados. 🛒</p>
      ) : (
        <div className="favorites-cards">
          {localFavorites.map((f) => (
            <div key={f.product.id} className="favorite-card">
              {/* Imagem do produto */}
              <div className="image-container">
                <img
                  src={`${API_URL}/product/${f.product.id}/image/download`}
                  alt={f.product.name || "Produto sem nome"}
                  className="product-image"
                  onError={(e) => {
                    console.error(e)
                    const target = e.target;
                    if (target.src !== window.location.origin + defaultImage) {
                      target.src = defaultImage // fallback local
                    }
                  }}
                />

              </div>

              {/* Nome */}
              <h3>{f.product.name || "Produto sem nome"}</h3>

              {/* Descrição */}
              <p className="short-description">
                {f.product.short_description || "Sem descrição disponível."}
              </p>

              {/* Preço */}
              {f.product.price != null && (
                <p className="price">R$ {f.product.price.toFixed(2)}</p>
              )}

              {/* Contagem de favoritos */}
              {f.product.favoritedCount != null && (
                <p className="fav-count">
                  <FaUsers /> {f.product.favoritedCount} pessoas favoritaram
                </p>
              )}

              {/* Ações */}
              <div className="card-actions">
                <button
                  className="btn-view"
                  onClick={() => navigate(`/produto/${f.product.slug}`)}
                >
                  <FaExternalLinkAlt /> Ver Produto
                </button>
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(f.product)}
                  disabled={processing}
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
