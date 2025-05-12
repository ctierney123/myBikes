import { client } from "../app.js";

const getFavoritesByUserId = async (userId) => {
  let favoritesCache = await client.lRange(`user/${userId}/favorites`, 0, -1);

  console.log(favoritesCache);

  if (favoritesCache) {
    favoritesCache = favoritesCache.map((item) => JSON.parse(item));

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

  return parsedCache;
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
  return res;
};

export { getFavoritesByUserId, addFavorite, removeFavorite };
