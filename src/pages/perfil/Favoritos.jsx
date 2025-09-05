import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaExternalLinkAlt, FaUsers } from "react-icons/fa";
import { useFavoritesContext } from "../../context/FavoritesContext";
import "./Favoritos.css";

export default function Favorites() {
  const { localFavorites, addOrRemoveFavorite } = useFavoritesContext();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

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
      <div className="favorites-header">
        <h2>💖 Meus Favoritos</h2>
        {localFavorites.length > 0 && (
          <button className="btn-clear" onClick={handleClearAll} disabled={processing}>
            Remover Todos
          </button>
        )}
      </div>

      {localFavorites.length === 0 ? (
        <p className="empty-message">Você ainda não tem produtos favoritados.</p>
      ) : (
        <div className="favorites-cards">
          {localFavorites.map(f => (
            <div key={f.product.id} className="favorite-card">
              <img
                src={f.product.image || `http://localhost:3000/api/product/${f.product.id}/image`}
                alt={f.product.name}
                className="product-image"
                onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
              />
              <h3>{f.product.name}</h3>
              <p className="short-description">{f.product.short_description || "Sem descrição disponível."}</p>

              {f.product.price != null && <p className="price">R$ {f.product.price.toFixed(2)}</p>}

              {f.product.favoritedCount != null && (
                <p className="fav-count"><FaUsers /> {f.product.favoritedCount} pessoas favoritaram</p>
              )}

              <div className="card-actions">
                <button className="btn-view" onClick={() => navigate(`/produto/${f.product.slug}`)}>
                  <FaExternalLinkAlt /> Ver Produto
                </button>
                <button className="btn-remove" onClick={() => handleRemove(f.product)} disabled={processing}>
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
