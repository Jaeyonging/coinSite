const FAVORITES_COOKIE_NAME = 'coin_favorites';


export const getFavoritesFromCookie = (): string[] => {
  if (typeof document === 'undefined') return [];
  
  const cookies = document.cookie.split(';');
  const favoriteCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${FAVORITES_COOKIE_NAME}=`)
  );

  if (!favoriteCookie) return [];

  try {
    const value = favoriteCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    return JSON.parse(decoded) as string[];
  } catch (error) {
    console.error('Error parsing favorites cookie:', error);
    return [];
  }
};

export const saveFavoritesToCookie = (favorites: string[]): void => {
  if (typeof document === 'undefined') return;
  
  try {
    const encoded = encodeURIComponent(JSON.stringify(favorites));
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1년 후 만료
    
    document.cookie = `${FAVORITES_COOKIE_NAME}=${encoded}; expires=${expires.toUTCString()}; path=/`;
  } catch (error) {
    console.error('Error saving favorites cookie:', error);
  }
};

export const addFavorite = (market: string): string[] => {
  const favorites = getFavoritesFromCookie();
  if (!favorites.includes(market)) {
    const newFavorites = [...favorites, market];
    saveFavoritesToCookie(newFavorites);
    return newFavorites;
  }
  return favorites;
};

export const removeFavorite = (market: string): string[] => {
  const favorites = getFavoritesFromCookie();
  const newFavorites = favorites.filter(fav => fav !== market);
  saveFavoritesToCookie(newFavorites);
  return newFavorites;
};

export const toggleFavorite = (market: string): string[] => {
  const favorites = getFavoritesFromCookie();
  if (favorites.includes(market)) {
    return removeFavorite(market);
  } else {
    return addFavorite(market);
  }
};
