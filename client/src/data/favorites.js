const baseUrl = "http://localhost:3000";

async function fetchFavoriteStations() {
  const response = await fetch(`${baseUrl}/favorites`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch favorite stations");
  }

  console.log(data);

  return data;
}

async function addFavoriteStation(stationId) {
  const response = await fetch(`${baseUrl}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stationId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to add favorite station");
  }

  console.log(data);

  return data;
}

async function removeFavoriteStation(stationId) {
  const response = await fetch(`${baseUrl}/favorites`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stationId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to remove favorite station");
  }

  console.log(data);

  return data;
}

export { fetchFavoriteStations, addFavoriteStation, removeFavoriteStation };
