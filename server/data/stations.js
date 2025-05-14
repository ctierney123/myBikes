import { calculateDistance, isString, isFLoat } from "../helpers.js";
import { client } from "../app.js";

const getAllStations = async () => {
  let stationCache = await client.get("stationList");
  if (stationCache) {
    stationCache = JSON.parse(stationCache);

    return stationCache;
  } else {
    try {
      const res = await fetch(
        `https://gbfs.citibikenyc.com/gbfs/en/station_information.json`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Could not get all stations");
      }

      const data = await res.json();
      await client.set("stationList", JSON.stringify(data));
      return data;
    } catch (e) {
      console.error(e);
    }
  }
};

const getAllStatuses = async () => {
  let statusCache = await client.get("statusList");
  if (statusCache) {
    statusCache = JSON.parse(statusCache);

    return statusCache;
  } else {
    try {
      const res = await fetch(
        `https://gbfs.citibikenyc.com/gbfs/en/station_status.json`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Could not get all station statuses");
      }

      const data = await res.json();
      await client.set("status", JSON.stringify(data));
      return data;
    } catch (e) {
      console.error(e);
    }
  }
};

const getAllStationsAndStatuses = async () => {
  let stationStatusCache = await client.get(`stations`);
  if (stationStatusCache) {
    stationStatusCache = JSON.parse(stationStatusCache);

    return stationStatusCache;
  } else {
    try {
      const resStation = await getAllStations();
      const dataStation = resStation.data.stations;

      const resStatus = await getAllStatuses();
      const dataStatus = resStatus.data.stations;

      const dataMerge = dataStation.map(
        (station) =>
          (station = {
            ...dataStatus.find((st) => st.station_id == station.station_id),
            ...station,
          })
      );

      if (!dataMerge) {
        throw new Error(`Could not get station of id, ${id}`);
      }

      const sortedData = dataMerge.sort((a, b) => a.station_id - b.station_id);

      await client.set(`stations`, JSON.stringify(sortedData));
      return sortedData;
    } catch (e) {
      console.error(e);
    }
  }
};

const getStationById = async (id) => {
  id = isString(id, "station id");
  let stationByIdCache = await client.get(`station/${id}`);
  if (stationByIdCache) {
    stationByIdCache = JSON.parse(stationByIdCache);

    return stationByIdCache;
  } else {
    try {
      const data = await getAllStationsAndStatuses();

      const stationById = data.find((station) => station.station_id == id);

      if (!stationById) {
        throw new Error(`Could not get station of id, ${id}`);
      }
      await client.set(`station/${id}`, JSON.stringify(stationById));
      return stationById;
    } catch (e) {
      console.error(e);
    }
  }
};

const getStationByName = async (name) => {
  name = isString(name, "name");
  let stationByNameCache = await client.get(`station/${name}`);
  if (stationByNameCache) {
    stationByNameCache = JSON.parse(stationByNameCache);

    return stationByNameCache;
  } else {
    try {
      const data = await getAllStationsAndStatuses();

      const stationByName = data.filter((station) =>
        station.name.toLowerCase().includes(name.toLowerCase())
      );

      if (!stationByName) {
        throw new Error(`Could not find stations with name, ${name}`);
      }

      const sortedStations = stationByName.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      await client.set(`station/${name}`, JSON.stringify(sortedStations));
      return sortedStations;
    } catch (e) {
      console.error(e);
    }
  }
};

const getNearbyStations = async (userLat, userLong, radius) => {
  userLat = isFLoat(userLat, "userLat");
  userLong = isFLoat(userLong, "userLong");
  let nearyStationsCache = await client.get(
    `nearby/${userLat}&${userLong}&${radius}`
  );
  if (nearyStationsCache) {
    nearyStationsCache = JSON.parse(nearyStationsCache);

    return nearyStationsCache;
  } else {
    try {
      let data = await getAllStationsAndStatuses();

      data.forEach(
        (station) =>
          (station.distance = parseFloat(
            calculateDistance(
              userLat,
              userLong,
              station.lat,
              station.lon
            ).toFixed(3)
          ))
      );

      let nearbyStations = data.filter(
        (station) => parseFloat(station.distance) <= radius
      );

      if (!nearbyStations) {
        throw new Error(
          `Could not get all nearby stations within radius of, ${rad}`
        );
      }

      nearbyStations = nearbyStations.sort((a, b) => a.distance - b.distance);

      await client.set(
        `nearby/${userLat}&${userLong}&${radius}`,
        JSON.stringify(nearbyStations)
      );
      return nearbyStations;
    } catch (e) {
      console.error(e);
    }
  }
};

export {
  getAllStationsAndStatuses,
  getStationById,
  getNearbyStations,
  getStationByName,
};
