import { useState, useEffect } from "react";

export function useFavorites(user, token) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState(null); // id do produto que está processando

  // Buscar favoritos do usuário
  async function fetchFavorites() {
    if (!user?.id) return;
    try {
      setLoadingFavs(true);
      const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`, {
        credentials: "include",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
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

  // Adicionar ou remover favorito
  async function toggleFavorite(productId) {
    if (!user?.id) return;
    try {
      setLoadingToggle(productId);
      const isFav = favorites.some((f) => f.product?.id === productId);

      const url = isFav
        ? `http://localhost:3000/api/favorites/${user.id}/${productId}`
        : `http://localhost:3000/api/favorites`;

      const res = await fetch(url, {
        method: isFav ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: isFav ? null : JSON.stringify({ userId: user.id, productId }),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Não autorizado! Faça login novamente.");
        throw new Error(`Erro ${res.status}`);
      }

      // Atualizar localmente sem refetch completo
      if (isFav) {
        setFavorites((prev) => prev.filter((f) => f.product?.id !== productId));
      } else {
        const json = await res.json();
        setFavorites((prev) => [...prev, json.data]);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err.message);
      alert(err.message);
    } finally {
      setLoadingToggle(null);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return { favorites, loadingFavs, loadingToggle, toggleFavorite, fetchFavorites };
}
