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

fetchAllStations();
