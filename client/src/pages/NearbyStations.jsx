import { Bike, Anchor } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllStations } from "../data/stations.js";
import { useState, useEffect } from "react";

export default function NearbyStations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [stationsPage, setStationsPage] = useState([]);
  const [next, setNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(id));

  useEffect(() => {
    async function getData() {
      const data = await fetchAllStations();
      console.log(data);
      setStations(data);
      try {
        if (data && data.length > 0) {
          const firstIndex = (currentPage - 1) * 10;
          const lastIndex = firstIndex + 10;
          const limit = data.slice(firstIndex, lastIndex);

          // if (limit.length === 0) {
          //   navigate("/404");
          //   return;
          // }

          const nextPage = lastIndex;
          const isNext = nextPage < data.length;
          setNext(isNext);

          setStationsPage(limit);
        }
      } catch (e) {
        console.error(e);
      }
    }

    getData();
  }, [currentPage]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    navigate(`/dashboard/stations/${nextPage}`);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      navigate(`/dashboard/stations/${previousPage}`);
    }
  };

  if (!stations || stations.length === 0) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto">
      <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-2xl font-bold">Nearby Stations</h1>
        <p className="text-gray-600">
          List of stations 1km near you will be displayed here.
        </p>
      </section>
      <div>
        {currentPage > 1 && <button onClick={handlePreviousPage}>Prev</button>}
        {next && <button onClick={handleNextPage}>Next</button>}
      </div>
      <section className="grid grid-cols-5 grid-rows-auto rounded-md gap-6">
        {stationsPage.map((station) => (
          <div
            key={station.station_id}
            className="flex-col bg-white p-4 rounded-md shadow-sm"
          >
            <h2 className="text-xl font-semibold truncate">{station.name}</h2>
            <p className="text-gray-600">
              Location: {parseFloat(station.lat).toFixed(2)},{" "}
              {parseFloat(station.lon).toFixed(2)}
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
    </div>
  );
}
