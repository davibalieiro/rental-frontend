// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  // Buscar favoritos do usuário
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

  // Adicionar ou remover favorito
  async function toggleFavorite(productId) {
    try {
      const isFav = favorites.some(f => f.product.id === productId);

      if (isFav) {
        // remover
        await fetch(`http://localhost:3000/api/favorites/${userId}/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
      } else {
        // adicionar
        await fetch(`http://localhost:3000/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId, productId }),
        });
      }

      // Atualizar lista de favoritos do backend
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
        credentials: "include",
      });
      const json = await res.json();
      setFavorites(json.data || []);
      
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  return { favorites, loadingFavs, toggleFavorite, fetchFavorites };
}
