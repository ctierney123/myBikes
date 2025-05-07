//import mongo collections, bcrypt and implement the following data functions
import { users } from "../config/mongoCollections.js";
import { isId, isString, isUsername } from "../helpers.js";

const createUser = async (userId, username) => {
  userId = isId(userId, "userId");
  username = isUsername(username, "username");

  let newUser = {
    userId,
    username,
    favorites: [],
  };

  const userCollection = await users();

  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.insertedId) throw new Error("Could not add user");

  const addedId = insertInfo.insertInfo.toString();
  const userById = getUserById(addedId);

  return userById;
};

const getUserById = async (userId) => {
  userId = isId(userId, "userId");

  const userCollection = await users();
  let userById = await userCollection.findOne({
    _id: new ObjectId(userId),
  });

  if (!userById) throw new Error(`No user found with id, ${userId}!`);

  return userById;
};

const updateUser = async (userId, updateObject) => {
  userId = isId(userId, "userId");
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
  }

  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: updatedUser },
    { returnDocument: "after" }
  );

  if (!updatedInfo)
    throw new Error(`Could not update user with id of ${userId} successfully`);

  return updatedInfo;
};

const removeUser = async (userId) => {
  userId = isId(userId, "userId");

  const userCollection = await users();
  const deletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(userId),
  });

  if (!deletionInfo)
    throw new Error(`Could not delete user with id of ${userId}`);

  return deletionInfo;
};

export { createUser, getUserById, updateUser, removeUser };
