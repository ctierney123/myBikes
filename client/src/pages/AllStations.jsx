import { Bike, Anchor } from "lucide-react";

export default function AllStations() {
  const stations = [
    {
      station_id: 1,
      name: "Longfellow Ave & Aldus St",
      latitude: 40.845,
      longitude: -73.866,
      capacity: 24,
      num_ebikes_available: 12,
      num_docks_available: 0,
    },
    {
      station_id: 2,
      name: "East 138th St & Cypress Ave",
      latitude: 40.813,
      longitude: -73.908,
      capacity: 20,
      num_ebikes_available: 8,
      num_docks_available: 5,
    },
    {
      station_id: 3,
      name: "East 149th St & Morris Ave",
      latitude: 40.818,
      longitude: -73.911,
      capacity: 30,
      num_ebikes_available: 15,
      num_docks_available: 10,
    },
    {
      station_id: 4,
      name: "East 156th St & River Ave",
      latitude: 40.834,
      longitude: -73.917,
      capacity: 18,
      num_ebikes_available: 5,
      num_docks_available: 8,
    },
    {
      station_id: 5,
      name: "East 163rd St & Boston Rd",
      latitude: 40.837,
      longitude: -73.903,
      capacity: 22,
      num_ebikes_available: 10,
      num_docks_available: 12,
    },
    {
      station_id: 6,
      name: "East 170th St & Grand Concourse",
      latitude: 40.843,
      longitude: -73.903,
      capacity: 25,
      num_ebikes_available: 20,
      num_docks_available: 5,
    },
    {
      station_id: 7,
      name: "East 177th St & Third Ave",
      latitude: 40.847,
      longitude: -73.895,
      capacity: 28,
      num_ebikes_available: 18,
      num_docks_available: 7,
    },
    {
      station_id: 8,
      name: "East 184th St & Webster Ave",
      latitude: 40.855,
      longitude: -73.895,
      capacity: 26,
      num_ebikes_available: 12,
      num_docks_available: 10,
    },
    {
      station_id: 9,
      name: "Longfellow Ave & Aldus St",
      latitude: 40.845,
      longitude: -73.866,
      capacity: 24,
      num_ebikes_available: 12,
      num_docks_available: 0,
    },
    {
      station_id: 10,
      name: "East 138th St & Cypress Ave",
      latitude: 40.813,
      longitude: -73.908,
      capacity: 20,
      num_ebikes_available: 8,
      num_docks_available: 5,
    },
    {
      station_id: 13,
      name: "East 149th St & Morris Ave",
      latitude: 40.818,
      longitude: -73.911,
      capacity: 30,
      num_ebikes_available: 15,
      num_docks_available: 10,
    },
    {
      station_id: 14,
      name: "East 156th St & River Ave",
      latitude: 40.834,
      longitude: -73.917,
      capacity: 18,
      num_ebikes_available: 5,
      num_docks_available: 8,
    },
    {
      station_id: 15,
      name: "East 163rd St & Boston Rd",
      latitude: 40.837,
      longitude: -73.903,
      capacity: 22,
      num_ebikes_available: 10,
      num_docks_available: 12,
    },
    {
      station_id: 16,
      name: "East 170th St & Grand Concourse",
      latitude: 40.843,
      longitude: -73.903,
      capacity: 25,
      num_ebikes_available: 20,
      num_docks_available: 5,
    },
    {
      station_id: 17,
      name: "East 177th St & Third Ave",
      latitude: 40.847,
      longitude: -73.895,
      capacity: 28,
      num_ebikes_available: 18,
      num_docks_available: 7,
    },
    {
      station_id: 18,
      name: "East 184th St & Webster Ave",
      latitude: 40.855,
      longitude: -73.895,
      capacity: 26,
      num_ebikes_available: 12,
      num_docks_available: 10,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col p-8 overflow-y-auto">
      <section className="flex-col bg-white rounded-md p-4 shadow-sm mb-6">
        <h1 className="text-2xl font-bold">All Stations</h1>
        <p className="text-gray-600">
          List of all stations will be displayed here.
        </p>
      </section>
      <section className="grid grid-cols-5 grid-rows-auto rounded-md gap-6">
        {stations.map((station) => (
          <div
            key={station.station_id}
            className="flex-col bg-white p-4 rounded-md shadow-sm"
          >
            <h2 className="text-xl font-semibold truncate">{station.name}</h2>
            <p className="text-gray-600">
              Location: {station.latitude},{station.longitude}
            </p>
            <div className="flex mt-2 gap-2">
              <Bike className="text-blue-500 w-7 h-7" />
              <p className="text-gray-800">Number of bikes: 10</p>
            </div>
            <div className="flex mt-2 gap-2">
              <Anchor className="text-blue-500 w-6 h-6" />
              <p className="text-gray-800">Number of docks: 10</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
