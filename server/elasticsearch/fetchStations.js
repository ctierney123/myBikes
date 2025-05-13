import { esClient } from "./elasticsearchClient.js";

async function fetchAndIndexStations() {
  try {
    const response = await fetch(
      "https://gbfs.citibikenyc.com/gbfs/en/station_information.json"
    );
    const data = await response.json();
    const stations = data.data.stations;

    const body = stations.flatMap((station) => {
      // Ensure last_reported is a valid date
      let lastReported = null;
      if (station.last_reported) {
        lastReported = new Date(station.last_reported);
        if (isNaN(lastReported.getTime())) {
          console.warn(
            `Invalid last_reported value for station ${station.station_id}: ${station.last_reported}`
          );
          lastReported = null; // Set to null if invalid
        } else {
          lastReported = lastReported.toISOString();
        }
      }

      return [
        { index: { _index: "citibike-stations", _id: station.station_id } },
        {
          station_id: station.station_id,
          name: station.name,
          latitude: station.lat,
          longitude: station.lon,
          available_bikes: station.num_bikes_available,
          status: station.status,
          last_reported: lastReported, // Can be null if invalid
        },
      ];
    });

    // Log the body of the request to ensure it's correct
    console.log("Request Body:", JSON.stringify(body, null, 2));

    const bulkResponse = await esClient.bulk({ body });

    // Log the entire bulkResponse to inspect its structure
    console.log("Bulk response:", bulkResponse);

    // Check for errors in the response and log them
    if (bulkResponse.errors) {
      console.log("Failed to index some documents:", bulkResponse.items);
    } else {
      console.log("Successfully indexed stations");
    }
  } catch (error) {
    console.error("Failed to fetch and index stations:", error);
  }
}

fetchAndIndexStations();
