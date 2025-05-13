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

async function fetchStationById(id) {
  const response = await fetch(`${baseUrl}/stations/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch station with id, ${id}`);
  }

  console.log(data);

  return data;
}

async function fetchNearbyStations(lat, long, radius) {
  const response = await fetch(
    `${baseUrl}/stations/nearby?lat=${lat}&long=${long}&radius=${radius}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch nearby stations");
  }

  console.log(data);

  return data;
}

async function fetchStationsByName(name) {
  const response = await fetch(`${baseUrl}/stations/search?name=${name}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch stations by name, ${name}`);
  }

  console.log(data);

  return data;
}
export {
  fetchAllStations,
  fetchStationById,
  fetchNearbyStations,
  fetchStationsByName,
};
