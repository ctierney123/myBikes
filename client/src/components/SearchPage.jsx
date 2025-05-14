import React, { useState, useEffect } from "react";
import "../styles/SearchPage.css";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Track if a search was attempted

  useEffect(() => {
    if (query) handleSearch();
  }, [page]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000); // Clear message after 5 seconds
      return () => clearTimeout(timer); // Clean up if component re-renders
    }
  }, [message]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/search?q=${query}&page=${page}`);

      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      console.log("test: " + data);
      setResults(data.results);
      setHasSearched(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setHasSearched(true);
    handleSearch();
  };

  const addFavorite = async (station) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(station),
      });
      if (res.status === 409) {
        setMessage("This station is already in your favorites!");
        return;
      }
      if (!res.ok) throw new Error("Failed to add favorite");
      setMessage("Station added to favorites!");
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Stations</h1>

      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or address"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {hasSearched && results.length === 0 && (
        <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
          No results found. Try searching for a different name or address.
        </p>
      )}

      <ul className="results-list">
        {Array.isArray(results) &&
          results.map((station, index) => (
            <li key={station.station_id || index} className="result-card">
              <div>
                <strong>{station.name}</strong>
                <br />
                <span>{station.address}</span>
              </div>
              <button onClick={() => addFavorite(station)}>
                Add to Favorites
              </button>
            </li>
          ))}
      </ul>

      {/*{results.length > 0 && (
        <div className="pagination-controls">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}*/}
      {results.length > 0 && (
        <div className="pagination-controls">
          {page > 0 && (
            <button onClick={() => setPage(page - 1)}>Previous</button>
          )}
          {results.length === 10 ? (
            <button onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <p style={{ color: "#888", marginTop: "10px" }}>
              No more results. Try a different search term if needed.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
