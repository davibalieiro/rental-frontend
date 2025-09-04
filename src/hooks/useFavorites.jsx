// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  async function fetchFavorites() {
    if (!userId) return;
    try {
      setLoadingFavs(true);
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
        credentials: "include",
      });
      const json = await res.json();
      setFavorites(json.data || []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoadingFavs(false);
    }
  }

  async function toggleFavorite(productId) {
    const isFav = favorites.some((f) => f.product.id === productId);
    try {
      if (isFav) {
        await fetch(`http://localhost:3000/api/favorites/${userId}/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        setFavorites(favorites.filter((f) => f.product.id !== productId));
      } else {
        await fetch("http://localhost:3000/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId, productId }),
        });
        setFavorites([...favorites, { product: { id: productId } }]);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  return { favorites, loadingFavs, toggleFavorite, fetchFavorites };
}
