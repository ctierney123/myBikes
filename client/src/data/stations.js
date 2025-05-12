const baseUrl = "http://localhost:3000";

async function fetchAllStations() {
  const response = await fetch(`${baseUrl}/stations`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch stations");
  }

  console.log(data);

  return data;
}

async function fetchStationsById(id) {
  const response = await fetch(`${baseUrl}/stations/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch station with id, ${id}`);
  }

  console.log(data);

  return data;
}

async function fetchNearbyStations() {
  const response = await fetch(`${baseUrl}/stations/nearby`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch nearby stations");
  }

  console.log(data);

  return data;
}

async function fetchStationsByName(name) {
  const response = await fetch(`${baseUrl}/stations/${name}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch nearby stations");
  }

  console.log(data);

  return data;
}
export {
  fetchAllStations,
  fetchStationsById,
  fetchNearbyStations,
  fetchStationsByName,
};
