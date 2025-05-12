//import mongo collections, bcrypt and implement the following data functions
import { isString, isUsername } from "../helpers.js";

const createUser = async (userId, username) => {
  username = isUsername(username, "username");

  let newUser = {
    userId,
    username,
  };

  await client.lpush("users", JSON.stringify(userId));

  await client.set(`user/${userId}`, JSON.stringify(newUser));

  let userCache = await client.get(`user/${userId}`);
  if (!userCache) {
    throw new Error("Could not create user");
  }
  userCache = JSON.parse(userCache);

  return userCache;
};

const updateUser = async (userId, updateObject) => {
  updateObject = isObject(updateObject, "updateObject");
  const updateObjectKeys = Object.keys(updateObject);
  const updatedUser = await getUserById(userId);

  let { username, favorites } = updateObject;

  if (updateObjectKeys.includes("username")) {
    username = isString(username, "username");
    updatedUser.username = username;
  }

  if (updateObjectKeys.includes("favorites")) {
    favorites = favorites.array.forEach((favorite) => {
      favorite = favorite.isFavorite(favorite, "favorite");
    });
    updatedUser.favorites = favorites;
    await client.lset(`${userId}/favorites`, JSON.stringify(favorites));
  }

  await client.lrem("users", 0, JSON.stringify(userId));
  await client.lpush("users", JSON.stringify(userId));
  await client.set(`user/${userId}`, JSON.stringify(updatedUserr));

  let userCache = await client.get(`user/${userId}`);
  if (!userCache) {
    throw new Error("Could not update user");
  }
  userCache = JSON.parse(userCache);

  return userCache;
};

const removeUser = async (userId) => {
  let tempCache = client.get(`user/${userId}`);

  await client.lrem("users", 0, JSON.stringify(userId));
  await client.del(`user/${userId}`);
  await client.del(`${userId}/favorites`);

  let userCache = await client.get(`user/${userId}`);
  if (userCache) {
    throw new Error("Could not remove user");
  }

  return tempCache;
};

const getAllUsers = async () => {
  let allUsersCache = await client.lrange("users", 0, -1);
  if (allUsersCache) {
    allUsersCache = JSON.parse(stationStatusCache);

    return allUsersCache;
  } else {
    throw new Error("Could not get all users");
  }
};

const getUserById = async (userId) => {
  let userCache = await client.get(`user/${userId}`);
  if (!userCache) {
    throw new Error(`Could not get user with id, ${userId}`);
  }
  userCache = JSON.parse(userCache);

  return userCache;
};

export { createUser, getUserById, updateUser, removeUser, getAllUsers };
