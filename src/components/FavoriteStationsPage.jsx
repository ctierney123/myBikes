import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../styles/FavoriteStationsPage.css';

const FavoriteStationsPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationStatus, setStationStatus] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      if (!res.ok) throw new Error('Failed to load favorites');
      const data = await res.json();
      setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove favorite');
      setFavorites((prev) => prev.filter((s) => s.id !== id));
      setMessage('Station removed from favorites');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error removing station');
    }
  };

  const openModal = async (station) => {
    setSelectedStation(station);
    setIsModalOpen(true);
    try {
      const statusRes = await fetch('https://gbfs.citibikenyc.com/gbfs/en/station_status.json');
      const statusData = await statusRes.json();
      const match = statusData.data.stations.find((s) => s.station_id === station.station_id || s.station_id === station.id);
      setStationStatus(match || null);
    } catch (err) {
      console.error('Failed to fetch station status:', err);
      setStationStatus(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
    setStationStatus(null);
  };

  return (
    <div className="favorites-page">
      <h1>Your Favorite Stations</h1>
      {error && <p className="error-msg">{error}</p>}
      {message && <p className="message">{message}</p>}
      <ul className="station-list">
        {favorites.map((station) => (
          <li key={station.id || station.station_id} className="station-card">
            <h3>{station.name}</h3>
            <p>{station.address}</p>
            <div className="button-group">
              <button className="view-btn" onClick={() => openModal(station)}>View Details</button>
              <button className="remove-btn" onClick={() => removeFavorite(station.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
        {selectedStation && (
          <div className="modal-content">
            <h2>{selectedStation.name}</h2>
            {/*<p><strong>Address:</strong> {selectedStation.address}</p>*/}
            <p><strong>Capacity:</strong> {selectedStation.capacity}</p>
            {stationStatus ? (
              <>
                <p><strong>Bikes Available:</strong> {stationStatus.num_bikes_available}</p>
                <p><strong>Docks Available:</strong> {stationStatus.num_docks_available}</p>
                <p><strong>Is Renting:</strong> {stationStatus.is_renting ? 'Yes' : 'No'}</p>
                <p><strong>Is Returning:</strong> {stationStatus.is_returning ? 'Yes' : 'No'}</p>
                <p><strong>Last Reported:</strong> {new Date(stationStatus.last_reported * 1000).toLocaleString()}</p>
              </>
            ) : (
              <p>Loading real-time station status...</p>
            )}
            <button onClick={closeModal} className="close-btn">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FavoriteStationsPage;
