import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FavoriteStationsProvider } from './FavoriteStationsContext';
import FavoriteStationsPage from './components/FavoriteStationsPage';
import FavoriteStationDetailsPage from './components/FavoriteStationDetails';
import NotFoundPage from './components/NotFoundPage';
import SearchPage from './components/SearchPage';

const App = () => {
  return (
    <FavoriteStationsProvider>
      <Router>
        <Routes>
          <Route path="/favorites" element={<FavoriteStationsPage />} />
          <Route path="/favorites/:id" element={<FavoriteStationDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </FavoriteStationsProvider>
  );
};

export default App;
