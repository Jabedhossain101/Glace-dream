'use client';
import { createContext, useContext, useState } from 'react';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = product => {
    setFavorites(prev =>
      prev.find(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoriteContext);
