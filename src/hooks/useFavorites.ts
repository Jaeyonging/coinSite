import { useState, useEffect, useCallback } from 'react';
import { getFavoritesFromCookie, toggleFavorite as toggleFavoriteCookie } from '../utils/cookies';

/**
 * 즐겨찾기 관리 훅
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // 초기 로드 시 쿠키에서 즐겨찾기 가져오기
  useEffect(() => {
    const savedFavorites = getFavoritesFromCookie();
    setFavorites(savedFavorites);
  }, []);

  // 즐겨찾기 토글
  const toggleFavorite = useCallback((market: string) => {
    const newFavorites = toggleFavoriteCookie(market);
    setFavorites(newFavorites);
  }, []);

  // 즐겨찾기 여부 확인
  const isFavorite = useCallback((market: string) => {
    return favorites.includes(market);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
