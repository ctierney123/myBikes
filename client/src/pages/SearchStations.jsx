import { Bike, Anchor } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { fetchStationsByName } from "../data/stations.js";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function SearchStations() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [stationsPage, setStationsPage] = useState([]);
  const [hasViewMore, setHasViewMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState("");

  //   useEffect(() => {
  //     async function getData() {
  //       const data = await fetchStationsByName(name);
  //       console.log(data);

  //       setStations(data);

  //       const firstIndex = 0;
  //       const lastIndex = 20;
  //       const limit = sortedData.slice(firstIndex, lastIndex);
  //       const nextExists = lastIndex < sortedData.length;

  //       setStationsPage(limit);
  //       setHasViewMore(nextExists);
  //     }

  //     getData();
  //   }, []);

  async function getData(e) {
    e.preventDefault();
    const data = await fetchStationsByName(name);

    setStations(data);

    const firstIndex = 0;
    const lastIndex = 20;
    const limit = data.slice(firstIndex, lastIndex);
    const nextExists = lastIndex < data.length;

    setStationsPage(limit);
    setHasViewMore(nextExists);
  }

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

  // if (!stations || stations.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center w-full h-full">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto">
      <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-2xl font-bold">Station Search</h1>
        <p className="text-gray-600">
          List of all stations will be displayed here.
        </p>
        <div>
          <form className="mt-4 space-y-4" onSubmit={getData}>
            <div className="flex space-x-4">
              <div className="flex flex-col space-y-3">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="border border-gray-400 px-2 py-2 rounded-md text-sm focus:outline-blue-600"
                  placeholder="Longfellow Ave & Aldus St"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="pt-4 pb-0">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-1.5 text-sm font-semibold rounded-md cursor-pointer hover:bg-blue-800"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
      <div>
        {stations.length > 0 && (
          <div>
            <section className="grid grid-cols-5 grid-rows-auto rounded-md gap-6">
              {stationsPage.map((station) => (
                <div
                  key={station.station_id}
                  className="flex-col bg-white p-4 rounded-md shadow-sm"
                >
                  <Link to={`/dashboard/${station.station_id}`}>
                    <h2 className="text-xl font-semibold truncate">
                      {station.name}
                    </h2>
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
                  </Link>
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
        )}
      </div>
    </div>
  );
}
