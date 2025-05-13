// src/FavoriteStationsContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { indexFavoriteStation } from './api/indexStation';

const FavoriteStationsContext = createContext();

export const useFavoriteStations = () => useContext(FavoriteStationsContext);

export const FavoriteStationsProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = async (station) => {
    const exists = favorites.find((s) => s.id === station.id);
    if (exists) return;

    setFavorites((prev) => [...prev, station]);

    try {
      await indexFavoriteStation(station);
      console.log('Indexed station to Elasticsearch');
    } catch (error) {
      console.error('Failed to index:', error);
    }
  };

  const removeFavorite = (stationId) => {
    setFavorites((prev) => prev.filter((s) => s.id !== stationId));
    // (optional) Also delete from Elasticsearch here
  };

  return (
    <FavoriteStationsContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoriteStationsContext.Provider>
  );
};
