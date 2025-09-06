

import { useState, useEffect } from "react";
export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(null);

  useEffect(() => {
    async function fetchFavorites() {
      if (!userId) {
        setLoadingFavs(false);
        return;
      }
      try {
        setLoadingFavs(true);
        const res = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Falha ao buscar favoritos");
        const json = await res.json();
        setFavorites(json.data || []);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err);
        setFavorites([]);
      } finally {
        setLoadingFavs(false);
      }
    }

    fetchFavorites();
    console.log(favorites);
  }, [userId]);

  async function toggleFavorite(productId) {
    if (!userId) return;
    setLoadingToggle(productId);

    const isFav = favorites.some(f => f.product?.id === productId);
    const url = isFav
      ? `http://localhost:3000/api/favorites/${userId}/${productId}`
      : `http://localhost:3000/api/favorites`;

    const options = isFav
      ? { method: "DELETE", credentials: "include" }
      : {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      };


    try {
      const res = await fetch(url, options);

      console.log(res);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado! Faça login novamente.");
        throw new Error("Falha ao atualizar favorito");
      }

      setFavorites(prev =>
        isFav ? prev.filter(f => f.product?.id !== productId) : [...prev, { product: { id: productId } }]
      );

    } catch (err) {
      console.error("Erro ao atualizar favorito:", err.message);
      alert(err.message);
    } finally {
      setLoadingToggle(null);
    }
  }

  return { favorites, loadingFavs, loadingToggle, toggleFavorite };
}