import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CITIBIKE_STATUS_API_URL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json';

const FavoriteStationDetailsPage = () => {
  const { id } = useParams();
  const [stationStatus, setStationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStationStatus = async () => {
      try {
        const response = await fetch(CITIBIKE_STATUS_API_URL);
        const data = await response.json();
        const foundStation = data.data.stations.find((station) => station.station_id === id);
        setStationStatus(foundStation);
      } catch (error) {
        console.error('Error fetching station status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationStatus();
  }, [id]);

  if (loading) return <p>Loading station details...</p>;

  if (!stationStatus) return <p>Station not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Station Full Details</h1>
      <p><strong>Station ID:</strong> {stationStatus.station_id}</p>
      <p><strong>Available Bikes:</strong> {stationStatus.num_bikes_available}</p>
      <p><strong>Available EBikes:</strong> {stationStatus.num_ebikes_available}</p>
      <p><strong>Available Docks:</strong> {stationStatus.num_docks_available}</p>
      <p><strong>Status:</strong> {stationStatus.is_installed ? 'Installed' : 'Not Installed'}</p>
      <p><strong>Last Reported:</strong> {new Date(stationStatus.last_reported * 1000).toLocaleString()}</p>

      <Link to="/favorites">
        <button style={{ marginTop: '1rem' }}>Back to Favorites</button>
      </Link>
    </div>
  );
};

export default FavoriteStationDetailsPage;
