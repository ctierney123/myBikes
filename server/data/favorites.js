import { client } from "../app.js";
import { getAllStationsAndStatuses } from "./stations.js";

const getFavoritesByUserId = async (userId) => {
  let favoritesCache = await client.lRange(`user/${userId}/favorites`, 0, -1);

  console.log(favoritesCache);

  if (favoritesCache) {
    favoritesCache = favoritesCache.map((item) => JSON.parse(item));

    const data = await getAllStationsAndStatuses();

    favoritesCache = favoritesCache.map((item) => {
      const station = data.find((station) => station.station_id === item);
      return station;
    });

    return favoritesCache;
  } else {
    throw new Error(`Could not get all favorite with userId, ${userId}`);
  }
};

const addFavorite = async (userId, stationId) => {
  const favoritesCache = await client.lRange(`user/${userId}/favorites`, 0, -1);

  if (!favoritesCache) {
    throw new Error(`Could not get all favorite with userId, ${userId}`);
  }

  const parsedCache = favoritesCache.map((item) => JSON.parse(item));

  if (parsedCache.includes(stationId)) {
    throw new Error(`Station ID ${stationId} already exists in favorites`);
  }

  try {
    await client.lPush(`user/${userId}/favorites`, JSON.stringify(stationId));
  } catch (e) {
    throw new Error(`Could not add favorite with userId, ${userId}`);
  }

  parsedCache.push(stationId);

  const data = await getAllStationsAndStatuses();

  res = parsedCache.map((item) => {
    const station = data.find((station) => station.station_id === item);
    return station;
  });

  return res;
};

const removeFavorite = async (userId, stationId) => {
  const favoritesCache = await client.lRange(`user/${userId}/favorites`, 0, -1);

  if (!favoritesCache) {
    throw new Error(`Could not get all favorite with userId, ${userId}`);
  }

  const parsedCache = favoritesCache.map((item) => JSON.parse(item));

  if (!parsedCache.includes(stationId)) {
    throw new Error(`Station ID ${stationId} does not exist in favorites`);
  }

  try {
    await client.lRem(`user/${userId}/favorites`, 0, JSON.stringify(stationId));
  } catch (e) {
    throw new Error(`Could not remove favorite with userId, ${userId}`);
  }

  const res = parsedCache.filter((item) => item !== stationId);

  res = parsedCache.map((item) => {
    const station = data.find((station) => station.station_id === item);
    return station;
  });

  return res;
};

export { getFavoritesByUserId, addFavorite, removeFavorite };
