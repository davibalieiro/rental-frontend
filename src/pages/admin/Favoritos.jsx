// src/components/Favorites.jsx
import React, { useEffect, useState } from "react";

export default function Favorites({ userId }) {
  const [favorites, setFavorites] = useState([]);

  async function fetchFavorites() {
    try {
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
        credentials: "include"
      });
      const json = await res.json();
      setFavorites(json.data || []);
    } catch (err) {
      console.error(err);
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
      console.error(err);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="favorites-page">
      <h2>Meus Favoritos</h2>
      <div className="favorites-cards">
        {favorites.map(f => (
          <div key={f.productId} className="card">
            <img
              src={`http://localhost:3000/api/product/${f.product.id}/image`}
              alt={f.product.name}
              className="product-image"
            />
            <h3>{f.product.name}</h3>
            <button className="btn-delete" onClick={() => handleRemove(f.product.id)}>
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
