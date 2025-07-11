import { Bike, Anchor, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllStations } from "../data/stations.js";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { addFavoriteStation } from "../data/favorites.js";

export default function AllStations() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [stationsPage, setStationsPage] = useState([]);
  const [hasViewMore, setHasViewMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    async function getData() {
      const data = await fetchAllStations();

      setStations(data);

      const firstIndex = 0;
      const lastIndex = 20;
      const limit = data.slice(firstIndex, lastIndex);
      const nextExists = lastIndex < data.length;

      setStationsPage(limit);
      setHasViewMore(nextExists);
    }

    getData();
  }, []);

  useEffect(() => {
    const firstIndex = 0;
    const lastIndex = 20 + currentPage * 20;
    const limit = stations.slice(firstIndex, lastIndex);

    const nextExists = lastIndex < stations.length;
    setStationsPage(limit);
    setHasViewMore(nextExists);
  }, [currentPage, stations]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  const addFavorite = async (stationId) => {
    try {
      await addFavoriteStation(stationId);
      alert("Added to favorites");
    } catch (error) {
      console.error("Error adding favorite:", error);
      alert(error.message);
    }
  };

  if (!stations || stations.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto">
      <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-2xl font-bold">All Stations</h1>
        <p className="text-gray-600">
          List of all stations will be displayed here.
        </p>
      </section>
      <section className="grid grid-cols-5 grid-rows-auto rounded-md gap-6">
        {stationsPage.map((station) => (
          <div
            key={station.station_id}
            className="flex-col bg-white p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/dashboard/${station.station_id}`}
                className="truncate hover:underline"
              >
                <h2 className="text-xl font-semibold">{station.name}</h2>
              </Link>
              <button
                className="cursor-pointer"
                onClick={() => addFavorite(station.station_id)}
              >
                <Star className="text-yellow-500 w-6 h-6 hover:fill-yellow-500" />
              </button>
            </div>

            <p className="text-gray-600">
              Location: {parseFloat(station.lat).toFixed(3)},{" "}
              {parseFloat(station.lon).toFixed(3)}
            </p>
            <div className="flex mt-2 gap-2">
              <Bike className="text-blue-500 w-7 h-7" />
              <p className="text-gray-800">
                Number of bikes: {station.num_bikes_available}
              </p>
            </div>
            <div className="flex mt-2 gap-2">
              <Anchor className="text-blue-500 w-6 h-6" />
              <p className="text-gray-800">
                Number of docks: {station.num_docks_available}
              </p>
            </div>
          </div>
        ))}
      </section>
      <div className="flex justify-center mt-4">
        {hasViewMore && (
          <button
            className="bg-white p-2 px-4 border border-gray-300 hover:bg-gray-100"
            onClick={handleNextPage}
          >
            <p className="text-sm">View More</p>
          </button>
        )}
      </div>
    </div>
  );
}
