import React, { createContext, useContext, useState, useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useAuth } from "../hooks/useAuth";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const { favorites, toggleFavorite, loadingToggle } = useFavorites(user?.id);
  const [localFavorites, setLocalFavorites] = useState([]);

  // Sincroniza estado local com o hook
  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const addOrRemoveFavorite = async (product) => {
    if (!user) return false;

    const isFav = localFavorites.some(f => f.product?.id === product.id);

    await toggleFavorite(product.id);

    setLocalFavorites(prev =>
      isFav
        ? prev.filter(f => f.product?.id !== product.id)
        : [...prev, { product }]
    );

    return !isFav;
  };

  return (
    <FavoritesContext.Provider value={{ localFavorites, addOrRemoveFavorite, loadingToggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavoritesContext = () => useContext(FavoritesContext);
