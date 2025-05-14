// src/components/FavoriteStationCard.jsx
import React from 'react';

const FavoriteStationCard = ({ station }) => (
  <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
    <h3>{station.name}</h3>
    <p>{station.address}</p>
    <p>Lat: {station.lat} | Lon: {station.lon}</p>
  </div>
);

export default FavoriteStationCard;
