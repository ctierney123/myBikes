import redis from "redis";
import { calculateDistance } from "../helpers.js";
export const client = redis.createClient();
client.connect().then(() => {});

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

      await client.set(`stations`, JSON.stringify(dataMerge));
      return dataMerge;
    } catch (e) {
      console.error(e);
    }
  }
};

const getStationById = async (id) => {
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
  let stationByNameCache = await client.get(`station/${name}`);
  if (stationByNameCache) {
    stationByNameCache = JSON.parse(stationByNameCache);

    return stationByNameCache;
  } else {
    try {
      const data = await getAllStationsAndStatuses();

      const stationByName = data.find((station) => station.name.includes(name));

      if (!stationByName) {
        throw new Error(`Could not find stations with name, ${name}`);
      }
      await client.set(`station/${name}`, JSON.stringify(stationByName));
      return stationByName;
    } catch (e) {
      console.error(e);
    }
  }
};

const getNearbyStations = async (userLat, userLong) => {
  let nearyStationsCache = await client.get(`nearby`);
  if (nearyStationsCache) {
    nearyStationsCache = JSON.parse(nearyStationsCache);

    return nearyStationsCache;
  } else {
    try {
      const data = await getAllStationsAndStatuses();

      const nearbyStations = data.filter(
        (station) =>
          parseFloat(
            calculateDistance(
              userLat,
              userLong,
              station.lat,
              station.lon
            ).toFixed(2)
          ) <= 1
      );

      if (!nearbyStations) {
        throw new Error(
          `Could not get all nearby stations within raidus of, ${rad}`
        );
      }
      console.log(nearbyStations);

      await client.set(`nearby`, JSON.stringify(nearbyStations));
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
