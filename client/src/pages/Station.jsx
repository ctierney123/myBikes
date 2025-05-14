import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { fetchStationById } from "../data/stations.js";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function Station() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetchStationById(id);

      setStation(data);
    }

    getData();
  }, [id]);

  if (!station || station.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto">
      <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-2xl font-bold">Station: {station.name}</h1>
        <p className="text-gray-600">
          Details about this station will be displayed here
        </p>
      </section>
      <section className="grid grid-cols-5 grid-rows-auto rounded-md gap-6">
        <div
          key={station.station_id}
          className="flex-col bg-white p-4 rounded-md shadow-sm"
        >
          <p className="text-gray-600">
            Location: {parseFloat(station.lat).toFixed(3)},{" "}
            {parseFloat(station.lon).toFixed(3)}
          </p>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Station Type: {station.station_type}
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Number of bikes: {station.num_bikes_available}
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Number of e-bikes: {station.num_ebikes_available}
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Number of docks: {station.num_docks_available}
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Rental Methods:
              <ul>
                {station.rental_methods.map((rental, id) => (
                  <li key={id}>{rental}</li>
                ))}
              </ul>
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Rental:
              <Link to={`/dashboard/${station.rental_uris.android}`}>
                Android
              </Link>
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Rental:
              <Link to={`/dashboard/${station.rental_uris.ios}`}>Ios</Link>
            </p>
          </div>
          <div className="flex mt-2 gap-2">
            <p className="text-gray-800">
              Kiosk: {station.has_kiosk ? "TRUE" : "FALSE"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
