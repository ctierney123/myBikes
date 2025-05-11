import redis from "redis";
import { calculateDistance } from "../helpers";
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
      const dataStation = await resStation.json();

      const resStatus = await getAllStations();
      const dataStatus = await resStatus.json();

      const dataMerge = dataStation.map(
        (station) => (station = { ...station, ...dataStatus.find(station.id) })
      );

      if (!dataMerge) {
        throw new Error(`Could not get status of id, ${id}`);
      }
      await client.set(`stations`, JSON.stringify(stationStatusCache));
      return stationStatusCache;
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
      const res = await getAllStationsAndStatuses();
      const data = await res.json();

      const stationById = data.find((station) => station.station_id == id);

      if (!stationById) {
        throw new Error(`Could not get status of id, ${id}`);
      }
      await client.set(`station/${id}`, JSON.stringify(stationById));
      return stationById;
    } catch (e) {
      console.error(e);
    }
  }
};

const getNearbyStations = async (radius, userLat, userLong) => {
  let nearyStationsCache = await client.get(`nearby`);
  if (nearyStationsCache) {
    nearyStationsCache = JSON.parse(nearyStationsCache);

    return nearyStationsCache;
  } else {
    try {
      const res = await getAllStationsAndStatuses();
      const data = await res.json();

      const nearbyStations = data.filter(
        (station) =>
          parseFloat(
            calculateDistance(
              userLat,
              userLong,
              station.lon,
              station.lat
            ).toFixed(2)
          ) <= rad
      );

      if (!nearbyStations) {
        throw new Error(
          `Could not get all nearby stations within raidus of, ${rad}`
        );
      }

      await client.set(`nearby`, JSON.stringify(nearbyStations));
      return nearbyStations;
    } catch (e) {
      console.error(e);
    }
  }
};

// OLD FUNCTIONS THAT GET STATIONS AND STATUSES SEPERATELY

// const getStationById = async (id) => {
//   let stationByIdCache = await client.get(`station/${id}`);
//   if (stationByIdCache) {
//     stationByIdCache = JSON.parse(stationByIdCache);

//     return stationByIdCache;
//   } else {
//     try {
//       const res = await getAllStations();
//       const data = await res.json();

//       const stationById = data.find((station) => station.station_id == id);

//       if (!stationById) {
//         throw new Error(`Could not get status of id, ${id}`);
//       }
//       await client.set(`station/${id}`, JSON.stringify(stationById));
//       return stationById;
//     } catch (e) {
//       console.error(e);
//     }
//   }
// };

// const getStatusByStationId = async (id) => {
//   let statusByIdCache = await client.get(`status/${id}`);
//   if (statusByIdCache) {
//     statusByIdCache = JSON.parse(statusByIdCache);

//     return statusByIdCache;
//   } else {
//     try {
//       const res = await getAllStatuses();
//       const data = await res.json();

//       const statusByStationId = data.find(
//         (station) => station.station_id == id
//       );

//       if (!statusByStationId) {
//         throw new Error(`Could not get status of id, ${id}`);
//       }
//       await client.set(`status/${id}`, JSON.stringify(statusByStationId));
//       return statusByStationId;
//     } catch (e) {
//       console.error(e);
//     }
//   }
// };

// const getNearbyStations = async (radius, userLat, userLong) => {
//   let nearyStationsCache = await client.get(`nearby/${id}`);
//   if (nearyStationsCache) {
//     nearyStationsCache = JSON.parse(nearyStationsCache);

//     return nearyStationsCache;
//   } else {
//     try {
//       const res = await getAllStations();
//       const data = await res.json();

//       const nearbyStations = data.filter(
//         (station) =>
//           parseFloat(
//             calculateDistance(
//               userLat,
//               userLong,
//               station.lon,
//               station.lat
//             ).toFixed(2)
//           ) <= rad
//       );

//       if (!nearbyStations) {
//         throw new Error(
//           `Could not get all nearby stations within raidus of, ${rad}`
//         );
//       }
//       await client.set(`status/${id}`, JSON.stringify(nearbyStations));
//       return nearbyStations;
//     } catch (e) {
//       console.error(e);
//     }
//   }
// };

// const getNearbyStationStatueses = async (radius, userLat, userLong) => {
//   let nearyStationsCache = await client.get(`nearby/${id}`);
//   if (nearyStationsCache) {
//     nearyStationsCache = JSON.parse(nearyStationsCache);

//     return nearyStationsCache;
//   } else {
//     try {
//       const res = await getAllStations();
//       const data = await res.json();

//       const nearbyStations = data.filter(
//         (station) =>
//           parseFloat(
//             calculateDistance(
//               userLat,
//               userLong,
//               station.lon,
//               station.lat
//             ).toFixed(2)
//           ) <= rad
//       );

//       if (!nearbyStations) {
//         throw new Error(
//           `Could not get all nearby stations within raidus of, ${rad}`
//         );
//       }
//       await client.set(`status/${id}`, JSON.stringify(nearbyStations));
//       return nearbyStations;
//     } catch (e) {
//       console.error(e);
//     }
//   }
// };

export { getAllStationsAndStatuses, getStationById, getNearbyStations };
