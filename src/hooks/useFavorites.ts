import { useState, useEffect, useCallback } from 'react';
import { getFavoritesFromCookie, toggleFavorite as toggleFavoriteCookie } from '../utils/cookies';


export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = getFavoritesFromCookie();
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = useCallback((market: string) => {
    const newFavorites = toggleFavoriteCookie(market);
    setFavorites(newFavorites);
  }, []);

  const isFavorite = useCallback((market: string) => {
    return favorites.includes(market);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
