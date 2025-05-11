import { Router } from "express";
import { client } from "../app";
//import { isSignedIn, isSignedOut } from "../middleware.js";
import { isId, isString, isUsername } from "../helpers.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  removeUser,
  updateUser,
} from "../data/users.js";

const router = Router();

router.post("/", async (req, res) => {
  const userData = req.body;

  let { userId, username } = userData;

  try {
    userId = isId(userId, "userId");
    username = isUsername(username, "username");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    const data = await createUser(userId, username);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.get("/users", async (req, res) => {
  try {
    const data = await getAllUsers();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

router
  .route("/user/:id")
  .get(async (req, res) => {
    try {
      const data = await getUserById(req.params.id);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  })
  .put(async (req, res) => {
    const user = req.session.user;
    const userId = user._id;

    const updateObject = req.body;
    if (!updateObject || Object.keys(updateObject).length === 0) {
      return res.status(400).json({ error: "No request body" });
    }

    try {
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
        await client.lset(`${userId}/favorites`, JSON.stringify(favorites));
      }
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const data = updateUser(userId, updateObject);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    const user = req.session.user;
    const userId = user._id;

    try {
      userId = isId(userId);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const data = removeUser(userId);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

router.get("/favorite/:id", async (req, res) => {
  try {
    const data = await getFavoritesByUserId(req.params.id);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
});

export default router;
